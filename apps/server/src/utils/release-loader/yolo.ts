import archiver from "archiver";
import { round } from "remeda";
import type { ImageClassifyAnnotation } from "shared";
import { stringify as YAMLStringify } from "yaml";

import { BasicReleaseLoader, type DataItem } from "./basic.ts";

/**
 * @description `<class_id> <center_x> <center_y> <width> <height>`
 * @example
 * 0 0.412567 0.625444l 0.432333 0.123456
 */
type YoloAnnotation = string;

type YoloOutputYAML = string;

/* interface YoloDataYAML {
  train: string;
  val: string;
  nc: number;
  names: string[];
} */

export class YoloReleaseLoader extends BasicReleaseLoader {
  trainDir = "train";
  valDir = "val";

  trainRatio = 0.8;
  valRatio = 0.2;

  public async releaseToZip(): Promise<Buffer> {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const buffers: Buffer[] = [];

    archive.on("data", (chunk) => {
      buffers.push(chunk);
    });

    const yamlContent = this.composeYoloOutputYAML();
    archive.append(yamlContent, { name: "data.yaml" });

    const presetMap = new Map(this.presetLabels.map((label) => [label.name, label.index]));

    for (let i = 0; i < this.dataItems.length; i++) {
      const dataItem = this.dataItems[i];
      const imageId = i + 1;

      const ext = dataItem.file.split(".").pop() || "jpg";
      const imageName = String(imageId).padStart(10, "0");

      const imageBuffer = await this.composeImageBuffer(dataItem);
      const directory =
        i + 1 < this.dataItems.length * this.trainRatio ? this.trainDir : this.valDir;

      try {
        archive.append(imageBuffer, {
          name: `/images/${directory}/${imageName}.${ext}`
        });
      } catch (e) {
        if (e instanceof Error) {
          console.warn(`${e.message}, skipped.`);
          continue;
        }
      }

      const annotationContent = this.composeYoloAnnotationPerFile(dataItem, presetMap);
      archive.append(annotationContent, {
        name: `/labels/${directory}/${imageName}.txt`
      });
    }

    try {
      await archive.finalize();
      const zipBuffer = Buffer.concat(buffers);

      return zipBuffer;
    } catch (error) {
      throw new Error(
        `Failed to create archive: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  public composeYoloAnnotationPerFile(
    dataItem: DataItem,
    presetMap: Map<string, number>
  ): YoloAnnotation {
    const lines = (dataItem.annotation as ImageClassifyAnnotation[]).map((annotation) => {
      const { value } = annotation;
      const { x, y, width, height, labels } = value;
      const xCenter = round(x + width / 2, 6);
      const yCenter = round(y + height / 2, 6);
      const _width = round(width, 6);
      const _height = round(height, 6);

      return `${presetMap.get(labels[0])} ${xCenter} ${yCenter} ${_width} ${_height}`;
    });

    return lines.join("\n") + "\n";
  }

  public composeYoloOutputYAML(): YoloOutputYAML {
    return YAMLStringify({
      train: `/images/${this.trainDir}/`,
      val: `/images/${this.valDir}/`,
      nc: this.presetLabels.length,
      names: this.presetLabels
    });
  }

  private async composeImageBuffer(dataItem: DataItem): Promise<Buffer> {
    try {
      const resp = await fetch(dataItem.file);
      const arrayBuffer = await resp.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Failed to fetch image: ${e.message}`);
      }
      throw new Error(`Failed to fetch image: ${String(e)}`);
    }
  }
}
