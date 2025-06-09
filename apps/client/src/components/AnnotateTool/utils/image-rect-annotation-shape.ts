import { IRectInputData } from "@leafer-ui/interface";
import { Rect } from "leafer-ui";
import { ImageClassifyAnnotation, Label } from "shared";

class ImageRectAnnotationShape {
  public rect: Rect;
  public startX = 0;
  public startY = 0;
  private label: Label | null = null;

  public constructor(props: IRectInputData, label: Label) {
    this.rect = new Rect(props);
    this.label = label;
  }

  public onCreate(e: { startX: number; startY: number }) {
    this.startX = e.startX;
    this.startY = e.startY;
  }

  public shapeTo(e: { x: number; y: number }) {
    if (e.x >= this.startX) {
      this.rect.width = e.x - this.rect.x;
    } else {
      this.rect.x = e.x;
      this.rect.width = this.startX - e.x;
    }
    if (e.y >= this.startY) {
      this.rect.height = e.y - this.rect.y;
    } else {
      this.rect.y = e.y;
      this.rect.height = this.startY - e.y;
    }
  }

  public exportToValue(outBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): ImageClassifyAnnotation["value"] {
    if (!this.label) {
      throw new Error("Label is not set");
    }
    return {
      x: ((this.rect.x - outBounds.x) / outBounds.width) * 100,
      y: ((this.rect.y - outBounds.y) / outBounds.height) * 100,
      width: (this.rect.width / outBounds.width) * 100,
      height: (this.rect.height / outBounds.height) * 100,
      labels: [this.label.name]
    };
  }
}

export default ImageRectAnnotationShape;
