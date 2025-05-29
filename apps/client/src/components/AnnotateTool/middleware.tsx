import { RefObject } from "react";

import { DataItem, Dataset, DataType } from "@/interfaces/dataset";

import ImageClassifyModule from "./ImageClassifyModule";
import { AnnotateModuleRef } from "./tool-proto";

interface IProps {
  annotatingType: Dataset["type"];
  onUpdate: () => void;
  controller: RefObject<AnnotateModuleRef>;
  dataItem: DataItem;
  // editorOptions: { size: { width: number, height: number } }
}

export default function ModuleMiddleware(props: IProps) {
  const { annotatingType, onUpdate, controller, dataItem } = props;

  if (annotatingType === DataType.ImageClassify) {
    return <ImageClassifyModule onUpdate={onUpdate} ref={controller} dataItem={dataItem} />;
  }
  return null;
}
