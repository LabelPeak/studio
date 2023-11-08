import { DataItem } from "@/interfaces/dataset";

export interface IModuleProps {
  dataItem: DataItem;
}

export interface AnnotateModuleRef {
  export: () => string;
  undo: () => void;
  redo: () => void;
}