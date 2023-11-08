import { DataItem, DataType, Dataset } from "@/interfaces/dataset";
import { ReactNode, useRef } from "react";
import { AnnotateModuleRef } from "./tool-proto";
import AnnotateToolContext from "./context";
import ImageClassifyModule from "./ImageClassifyModule";
import { Project } from "@/interfaces/project";
import classNames from "classnames";
import { useIntl } from "react-intl";

interface IProps {
  project: Project;
  dataItem: DataItem;
  annotatingType: Dataset["type"];
  presets: string;
}

export default function AnnotateTool(props: IProps) {
  const { dataItem, annotatingType, project } = props;
  const annotateModuleRef = useRef<AnnotateModuleRef>(null);
  const intl = useIntl();

  function getAnnotateModule(): ReactNode {
    if (annotatingType === DataType.ImageClassify) {
      return <ImageClassifyModule ref={annotateModuleRef} dataItem={dataItem} />;
    } else {
      return null;
    }
  }

  function handleUpdate() {
    const res = annotateModuleRef.current?.export();
    if (res) {
      console.log(JSON.parse(res));
    }
  }

  return (
    <div
      id="annotate-section"
      className={classNames([
        "w-700px b-l-solid b-color-nord-snow-0 b-l-1",
        "flex flex-col shrink-0"
      ])}
    >
      <div className="header b-b-1 b-b-solid b-color-nord-snow-0 flex h-[55px]">
        <div className="index py-4 text-4 b-r-1 b-r-solid b-color-nord-snow-0 px-4"> #{ dataItem.id } </div>
        <div className="operations flex-auto flex text-6 p-4 gap-4">
          <div title={intl.formatMessage({ id: "operation-undo"})} className="cursor-pointer i-mdi-undo-variant c-nord-polar-3" />
          <div title={intl.formatMessage({ id: "operation-redo"})} className="cursor-pointer i-mdi-redo-variant c-nord-polar-3" />
          <div title={intl.formatMessage({ id: "operation-reset"})} className="cursor-pointer i-mdi-close c-nord-polar-3" />
          <div title={intl.formatMessage({ id: "operation-delete"})} className="cursor-pointer i-mdi-delete-outline c-nord-aurora-0" />
        </div>
        <div
          className="px-6 py-4 bg-nord-frost-3 c-nord-snow-2 font-bold cursor-pointer"
          onClick={handleUpdate}
        >
          { intl.formatMessage({ id: "operation-update"})}
        </div>
      </div>
      <div className="flex-auto">
        <AnnotateToolContext.Provider
          value={{
            dataset: project.dataset,
            presets: project.presets
          }}>
          { getAnnotateModule() }
        </AnnotateToolContext.Provider>
      </div>
    </div>
  );
}