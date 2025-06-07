import consola from "consola";
import { imageDimensionsFromData } from "image-dimensions";
import { nanoid } from "nanoid";
import { round } from "remeda";

import { datasetService } from "@/routes/dataset/dataset.service.ts";
import { inngest } from "@/utils/inngest.ts";

interface ProjectPreAnnotateEventData {
  projectId: number;
  datasetId: number;
  labels: { index: number; name: string }[];
}

interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface LLMAnnotation {
  label: string;
  area: [xMin: number, yMin: number, width: number, height: number];
}

async function parseDataItemImage(url: string) {
  const resp = await fetch(url);

  const contentType = resp.headers.get("content-type");
  const arrayBuffer = await resp.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const dataURI = `data:${contentType};base64,${base64}`;

  const dimensions = imageDimensionsFromData(new Uint8Array(arrayBuffer));

  return { dataURI, dimensions };
}

async function fetchAnnotationFromLLM(
  dataURI: string,
  labels: ProjectPreAnnotateEventData["labels"]
): Promise<LLMAnnotation[]> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  });

  const resp = await fetch(process.env.OPENAI_URL ?? "", {
    headers,
    method: "POST",
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "",
      messages: [
        {
          role: "system",
          content: `作为数据标注专家，请为用户发送的图片标注
${labels.map((label) => label.name).join(",")} 这些标签。
在图中找出所有与这些标签相关的区域，一个标签可能对应多个对象。
请以 { label: "<detectedLabelName>", area: [<xMin>, <yMin>, <width>, <height>]} 这样的 json 对象形式表示标注数据。
最终输出 json 数组，表示这张图里面的所有标注对象。

注意：
1. 请严格按照上述格式输出，不要输出任何额外的信息。
2. 请确保标注的区域是准确的，不要包含任何无关的信息。
3. 请确保标注的区域是完整的，不要遗漏任何信息。
4. 请确保标注的区域是唯一的，不要包含任何重复的信息。 
`
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: dataURI,
                detail: "high"
              }
            }
          ]
        }
      ]
    })
  });

  const data: LLMResponse = await resp.json();
  const annotations = JSON.parse(data.choices.at(0)?.message.content ?? "[]") as LLMAnnotation[];
  return annotations;
}

function transformLLMAnnotation(annotation: LLMAnnotation) {
  const squareLength = 500;

  return {
    x: round((annotation.area[0] / squareLength) * 100, 6),
    y: round((annotation.area[1] / squareLength) * 100, 6),
    width: round((annotation.area[2] / squareLength) * 100, 6),
    height: round((annotation.area[3] / squareLength) * 100, 6),
    labels: [annotation.label]
  };
}

const preAnnotateFunction = inngest.createFunction(
  { id: "project-pre-annotate" },
  { event: "app/project.pre-annotate" },
  async ({ event, step }) => {
    await step.run("Start pre-annotate", async () => {
      const { datasetId, labels, projectId } = event.data as ProjectPreAnnotateEventData;
      // TODO: 分页发送
      const { list } = await datasetService.findAllDataItemByDatasetId({
        datasetId,
        page: 1,
        size: 100
      });

      const resultList = await Promise.allSettled(
        list.map(async (dataItem) => {
          const { dataURI, dimensions } = await parseDataItemImage(dataItem.file);
          const annotations = await fetchAnnotationFromLLM(dataURI, labels);

          const formatted = annotations.map((item) => ({
            originHeight: dimensions?.height ?? 0,
            originWidth: dimensions?.width ?? 0,
            value: transformLLMAnnotation(item),
            id: nanoid(10),
            type: "labels"
          }));

          await datasetService.updatePreAnnotation({
            id: dataItem.id,
            project: projectId,
            data: JSON.stringify(formatted)
          });
        })
      );

      const failList = resultList.filter((item) => item.status === "rejected");
      consola.log(
        `Successfully pre-annotated to project#${projectId} for ${list.length - failList.length} data items.`
      );
      if (failList.length > 0) {
        consola.error(`Failed to pre-annotate ${failList.length} data items.`);
        consola.error(failList.map((item) => item.reason));
      }

      return {
        total: resultList.length,
        success: resultList.length - failList.length,
        fail: failList.length
      };
    });
  }
);

export default preAnnotateFunction;
