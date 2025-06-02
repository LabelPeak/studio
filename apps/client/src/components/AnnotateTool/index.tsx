import { Button, message, Tag } from "antd";
import classNames from "classnames";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { DataItem, Dataset } from "@/interfaces/dataset";
import { Access, Project } from "@/interfaces/project";
import DatasetService from "@/services/dataset";

import AnnotateToolContext from "./context";
import ModuleMiddleware from "./middleware";
import { AnnotateModuleRef } from "./tool-proto";

interface AnnotateToolProps {
  project: Project;
  dataItem: DataItem;
  annotatingType: Dataset["type"];
  onClose: () => void;
}

export interface AnnotateToolRef {
  checkSafeSave: () => boolean;
}

const AnnotateTool = forwardRef<AnnotateToolRef, AnnotateToolProps>((props, ref) => {
  const { dataItem, annotatingType, project, onClose } = props;
  const annotateModuleRef = useRef<AnnotateModuleRef>(null);
  const [isSaveSaved, setIsSaveSaved] = useState(true);
  const intl = useIntl();

  useImperativeHandle(
    ref,
    () => ({
      checkSafeSave: () => isSaveSaved
    }),
    [isSaveSaved]
  );

  useEffect(() => {
    setIsSaveSaved(true);
  }, [dataItem]);

  function handleUpdateDraft() {
    setIsSaveSaved(false);
  }

  function handleClickReset() {
    annotateModuleRef.current?.reset();
    setIsSaveSaved(true);
  }

  async function handleClickSave() {
    if (!annotateModuleRef.current) {
      return;
    }
    const data = annotateModuleRef.current.save();
    try {
      await DatasetService.updateAnnotation({
        data,
        project: project.id,
        id: dataItem.id,
        times: 1
      });
      message.success("更新成功");
      setIsSaveSaved(true);
    } catch (error) {
      if (error instanceof Error) {
        message.error("更新失败: " + error.message);
      }
      return;
    }
  }

  return (
    <div
      id="annotate-section"
      className={classNames([
        "b-l-solid b-color-nord-snow-0 b-l-1 w-700px",
        "flex flex-col shrink-0 of-hidden"
      ])}
    >
      <div className="header b-b-1 b-b-solid b-color-nord-snow-0 flex py-2 items-center">
        <div className="index text-4 b-r-1 b-r-solid b-color-nord-snow-0 px-4">#{dataItem.id}</div>
        <div className="operations flex-auto flex text-6 px-4 gap-4">
          <div
            title={intl.formatMessage({ id: "operation-undo" })}
            className="cursor-pointer i-mdi-undo-variant c-nord-polar-3"
          />
          <div
            title={intl.formatMessage({ id: "operation-redo" })}
            className="cursor-pointer i-mdi-redo-variant c-nord-polar-3"
          />
          <div
            title={intl.formatMessage({ id: "operation-reset" })}
            className="cursor-pointer i-mdi-delete-outline c-nord-aurora-0"
            onClick={handleClickReset}
          />
        </div>
        <div className="flex mr-4 gap-2 items-center">
          {!isSaveSaved &&
            (project.access !== Access.Write ? (
              <Tag color="orange">项目{intl.formatMessage({ id: project.access })}, 无法更新</Tag>
            ) : (
              <Tag color="orange">有内容未保存</Tag>
            ))}
          <Button
            type="primary"
            onClick={handleClickSave}
            disabled={project.access !== Access.Write}
          >
            {intl.formatMessage({ id: "operation-update" })}
          </Button>
          <Button onClick={onClose} danger>
            关闭
          </Button>
        </div>
      </div>
      <div className="flex-auto of-hidden">
        <AnnotateToolContext.Provider
          value={{
            dataset: project.dataset,
            presets: project.presets
          }}
        >
          <ModuleMiddleware
            annotatingType={annotatingType}
            onUpdate={handleUpdateDraft}
            controller={annotateModuleRef}
            dataItem={dataItem}
          />
        </AnnotateToolContext.Provider>
      </div>
    </div>
  );
});

AnnotateTool.displayName = "AnnotateTool";

export default AnnotateTool;
