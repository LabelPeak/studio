import { DataItem, DataType, Dataset } from "@/interfaces/dataset";
import { AnnotateModuleRef } from "./tool-proto";
import ImageClassifyModule from "./ImageClassifyModule";
import { RefObject } from "react";

interface IProps {
  annotatingType: Dataset["type"];
  onUpdate: () => void;
  controller: RefObject<AnnotateModuleRef>;
  dataItem: DataItem;
}

export default function ModuleMiddleware(props: IProps) {
  const { annotatingType, onUpdate, controller, dataItem } = props;

  if (annotatingType === DataType.ImageClassify) {
    return (
      <ImageClassifyModule
        onUpdate={onUpdate}
        ref={controller}
        dataItem={dataItem}
      />
    );
  } else {
    return null;
  }
}