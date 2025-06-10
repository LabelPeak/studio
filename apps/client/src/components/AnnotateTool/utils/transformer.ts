import { nanoid } from "nanoid";
import { ImageClassifyAnnotation } from "shared";

import ImageRectAnnotationShape from "./image-rect-annotation-shape";

export function transformShapeToImageAnnotation(
  shapes: ImageRectAnnotationShape[],
  imageSize: { width: number; height: number },
  canvasSize: { width: number; height: number }
): ImageClassifyAnnotation[] {
  const isFitHeight = canvasSize.width / canvasSize.height > imageSize.width / imageSize.height;

  // 缩放比
  const scale = isFitHeight
    ? canvasSize.height / imageSize.height
    : canvasSize.width / imageSize.width;

  const bounds = isFitHeight
    ? {
        x: canvasSize.width / 2 - (imageSize.width * scale) / 2,
        y: 0,
        width: imageSize.width * scale,
        height: canvasSize.height
      }
    : {
        x: 0,
        y: canvasSize.height / 2 - (imageSize.height * scale) / 2,
        width: imageSize.width * scale,
        height: canvasSize.height
      };

  const value: Array<ImageClassifyAnnotation> = shapes.map((item) => {
    return {
      originHeight: imageSize.height,
      originWidth: imageSize.width,
      value: item.exportToValue(bounds),
      id: nanoid(10),
      type: "labels"
    };
  });

  return value;
}
