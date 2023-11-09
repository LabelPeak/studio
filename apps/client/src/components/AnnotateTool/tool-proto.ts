import { Annotation } from "@/interfaces/annotation";
import { DataItem } from "@/interfaces/dataset";

export interface IModuleProps {
  dataItem: DataItem;
  onUpdate: (data: Annotation<unknown>[]) => void;
}

export interface AnnotateModuleRef {
  save: () => string;
  undo: () => void;
  redo: () => void;
}