export interface Label {
  index: number;
  name: string;
}

export interface Annotation<T> {
  id: string;
  value: T;
  type: "labels" | "relations"
}