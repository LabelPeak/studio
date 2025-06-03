import { format } from "date-fns";
import { type ImageClassifyAnnotation } from "shared";

import { BasicReleaseLoader, type DataItem, MAX_ANNOTATION_PER_FILE } from "./basic.ts";

interface CocoInfo {
  description?: string;
  year?: number;
  contributor?: string;
  date_created?: string;
  [key: string]: any;
}

interface CocoImage {
  id: number;
  file_name: string;
  width: number;
  height: number;
  license?: number;
}

interface CocoAnnotation {
  id: number;
  /**
   * Will be matched with CocoImage['id']
   */
  image_id: string | number;
  category_id: number;
  segmentation?: any[];
  area?: number;
  bbox?: [number, number, number, number];
  iscrowd?: 0 | 1;
}

interface CocoCategory {
  id: number;
  name: string;
  supercategory?: string;
}

export interface CocoOutputJSON {
  info: CocoInfo;
  images: CocoImage[];
  annotations: CocoAnnotation[];
  categories: CocoCategory[];
}

export class CocoReleaseLoader extends BasicReleaseLoader {
  public releaseToZip(): Promise<string> {
    return Promise.resolve("");
  }

  public composeCocoOutputJSON(): CocoOutputJSON {
    const presetMap = this.presetLabels.reduce((prev, label, index) => {
      prev.set(label, index + 1);
      return prev;
    }, new Map<string, number>());

    // 1. Compose CocoCategories
    const cocoCategories = this.composeCocoCategories(presetMap);

    const cocoImages: CocoImage[] = [];
    const cocoAnnotations: CocoAnnotation[] = [];

    // 2. Compose CocoImages and CocoAnnotations
    for (let i = 0; i < this.dataItems.length; i++) {
      const dataItem = this.dataItems[i];

      const numericImageId = i + 1;

      // Compose CocoImage
      const image = this.composeCocoImage(dataItem, numericImageId);
      cocoImages.push(image);

      // Compose CocoAnnotation
      const fileAnnotations = this.composeCocoAnnotationByFile(dataItem, numericImageId, presetMap);
      cocoAnnotations.push(...fileAnnotations);
    }

    // 3. Compose CocoInfo
    const cocoInfo: CocoInfo = {
      description: `Dataset: ${this.releaseName} - LabelPeak COCO Export`,
      contributor: this.poc,
      year: new Date().getFullYear(),
      date_created: format(new Date(), "yyyy/MM/dd"),
      version: "1.0"
    };

    return {
      info: cocoInfo,
      images: cocoImages,
      annotations: cocoAnnotations,
      categories: cocoCategories
    };
  }

  private composeCocoCategories(presetMap: Map<string, number>): CocoCategory[] {
    return Array.from(presetMap.entries()).map(([name, id]) => ({
      id,
      name,
      supercategory: "object"
    }));
  }

  private composeCocoImage(dataItem: DataItem, imageId: number): CocoImage {
    const ext = dataItem.file.split(".").pop() || "jpg";

    return {
      id: imageId,
      file_name: `${String(imageId).padStart(10, "0")}.${ext}`,
      width: (dataItem.annotation as ImageClassifyAnnotation[]).at(0)?.originWidth ?? 0,
      height: (dataItem.annotation as ImageClassifyAnnotation[]).at(0)?.originHeight ?? 0
    };
  }

  private composeCocoAnnotationByFile(
    dataItem: DataItem,
    imageId: number,
    presetMap: Map<string, number>
  ): CocoAnnotation[] {
    return (dataItem.annotation as ImageClassifyAnnotation[]).map((annotation, index) => {
      const { originWidth, originHeight } = annotation;
      const { x, y, width, height, labels } = annotation.value;
      const xMin = Math.floor((x * originWidth) / 100);
      const yMin = Math.floor((y * originHeight) / 100);
      const _width = Math.floor((width * originWidth) / 100);
      const _height = Math.floor((height * originHeight) / 100);

      return {
        id: imageId * MAX_ANNOTATION_PER_FILE + index + 1,
        image_id: imageId,
        category_id: presetMap.get(labels[0]) ?? -1,
        bbox: [xMin, yMin, _width, _height],
        area: _width * _height,
        iscrowd: 0
      };
    });
  }
}
