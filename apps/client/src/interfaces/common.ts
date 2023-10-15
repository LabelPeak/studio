export type Nullable<T> = {
  [key in keyof T]: T[key] | null;
}