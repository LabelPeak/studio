export interface Label {
  index: number;
  name: string;
}

export interface Annotation<T> {
  id: string;
  value: T;
  type: "labels" | "relations";
}

export interface ImageClassifyAnnotation
  extends Annotation<{
    x: number;
    y: number;
    width: number;
    height: number;
    labels: string[];
  }> {
  originWidth: number;
  originHeight: number;
}
