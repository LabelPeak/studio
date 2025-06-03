import { round } from "remeda";
import type { ImageClassifyAnnotation } from "shared";
import yaml from "yaml";

import { BasicReleaseLoader, type DataItem } from "./basic.ts";

/**
 * @description `<class_id> <center_x> <center_y> <width> <height>`
 *
 * @example
 * 0 0.412567 0.625444l 0.432333 0.123456
 */
type YoloAnnotation = string;

type YoloOutputYAML = string;

export class YoloReleaseLoader extends BasicReleaseLoader {
  public releaseToZip(): Promise<string> {
    return Promise.resolve("");
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
    return yaml.stringify({
      train: "/images/train/",
      val: "/images/val/",
      nc: this.presetLabels.length,
      names: this.presetLabels
    });
  }
}
