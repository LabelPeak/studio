import { RefObject } from "react";

import { DataItem, Dataset } from "@/interfaces/dataset";

import ImageClassifyModule from "./components/image-classify-module";
import { AnnotateModuleRef } from "./types";

interface IProps {
  annotatingType: Dataset["type"];
  onUpdate: () => void;
  controller: RefObject<AnnotateModuleRef>;
  dataItem: DataItem;
  // editorOptions: { size: { width: number, height: number } }
}

export default function ModuleMiddleware(props: IProps) {
  const { onUpdate, controller, dataItem } = props;

  return <ImageClassifyModule onUpdate={onUpdate} ref={controller} dataItem={dataItem} />;
}
