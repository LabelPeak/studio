import consola from "consola";
import { imageDimensionsFromData } from "image-dimensions";
import { nanoid } from "nanoid";
import pLimit from "p-limit";
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

interface FetchAnnotationFormLLMOptions {
  dataURI: string;
  labels: ProjectPreAnnotateEventData["labels"];
  dimensions?: {
    width: number;
    height: number;
  };
}

async function fetchAnnotationFromLLM({
  dataURI,
  labels,
  dimensions
}: FetchAnnotationFormLLMOptions): Promise<LLMAnnotation[]> {
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
用户会告诉你图片的尺寸，你需要根据图片的尺寸来计算标注数据的坐标和尺寸, area 里面的字段值均为图片的实际像素。
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
              type: "text",
              text: `图片的宽度为 ${dimensions?.width} 像素, 高度为 ${dimensions?.height} 像素。`
            },
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

function transformLLMAnnotation(
  annotation: LLMAnnotation,
  dimensions?: { width: number; height: number }
) {
  const squareLength = 1000;
  const { width, height } = dimensions ?? { width: squareLength, height: squareLength };

  return {
    x: round((annotation.area[0] / width) * 100, 6),
    y: round((annotation.area[1] / height) * 100, 6),
    width: round((annotation.area[2] / width) * 100, 6),
    height: round((annotation.area[3] / height) * 100, 6),
    labels: [annotation.label]
  };
}

const preAnnotateFunction = inngest.createFunction(
  { id: "project-pre-annotate" },
  { event: "app/project.pre-annotate" },
  async ({ event, step }) => {
    const limit = pLimit(6);

    const result = await step.run("Start pre-annotate", async () => {
      const { datasetId, labels, projectId } = event.data as ProjectPreAnnotateEventData;
      // TODO: 分页发送
      const { list } = await datasetService.findAllDataItemByDatasetId({
        datasetId,
        page: 1,
        size: 100
      });

      const resultList = await Promise.allSettled(
        list.map(async (dataItem) =>
          limit(async () => {
            const { dataURI, dimensions } = await parseDataItemImage(dataItem.file);
            const annotations = await fetchAnnotationFromLLM({ dataURI, labels, dimensions });

            const formatted = annotations.map((item) => ({
              originHeight: dimensions?.height ?? 0,
              originWidth: dimensions?.width ?? 0,
              value: transformLLMAnnotation(item, dimensions),
              id: nanoid(10),
              type: "labels"
            }));

            await datasetService.updatePreAnnotation({
              id: dataItem.id,
              project: projectId,
              data: JSON.stringify(formatted)
            });

            return {
              file: dataItem.file,
              annotations,
              dimensions
            };
          })
        )
      );

      const successList = resultList.filter((item) => item.status === "fulfilled");
      const failList = resultList.filter((item) => item.status === "rejected");
      consola.info(
        `Successfully pre-annotated to project#${projectId} for ${list.length - failList.length} data items.`
      );
      if (failList.length > 0) {
        consola.error(`Failed to pre-annotate ${failList.length} data items.`);
        consola.error(failList.map((item) => item.reason));
      }

      return {
        success: successList.map((item) => item.value),
        totalCount: resultList.length,
        failCount: failList.length
      };
    });

    return result;
  }
);

export default preAnnotateFunction;
