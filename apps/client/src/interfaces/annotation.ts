export interface Label {
  index: number;
  name: string;
}

/**
 * @deprecated
 */
export interface Annotation<T> {
  id: string;
  value: T;
  type: "labels" | "relations";
}
