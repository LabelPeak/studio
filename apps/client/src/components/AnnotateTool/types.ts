import { IEventListenerId } from "@leafer/interface";
import { Rect } from "leafer-ui";
import { Annotation } from "shared";

import { DataItem } from "@/interfaces/dataset";

/**
 * 编辑器状态，
 * 包含编辑器的所有状态，图层、标注形状、标注事件、标注模式等
 */
export interface EditorState {
  loadedImageRect?: Rect;
  loadedImageMeta?: { width: number; height: number };
  annotatingEvents: IEventListenerId[];
  mode: "annotate" | "filter";
  size: { height: number; width: number };
}

export interface IModuleProps {
  dataItem: DataItem;
  onUpdate: (data: Annotation<unknown>[]) => void;
}

export interface AnnotateModuleRef {
  save: () => string;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}
