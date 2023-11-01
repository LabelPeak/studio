import { DataItem, Dataset } from "@/interfaces/dataset";
import { forwardRef, useImperativeHandle, useRef } from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";

interface IProps {
  dataItem: DataItem;
  annotatingType: Dataset["type"];
  presets: string;
}

interface AnnotateTool {}

const AnnotateTool = forwardRef<AnnotateTool ,IProps>((props, ref) => {
  const { dataItem } = props;
  const annotationDraft = useRef(dataItem.annotation);
  const intl = useIntl();

  useImperativeHandle(ref, () => {
    return {};
  }, []);

  function handleUpdate() {
    return annotationDraft;
  }

  return (
    <div
      id="annotate-section"
      className={classNames([
        "flex-basis-[60%] b-l-solid b-color-nord-snow-0 b-l-1",
        "flex flex-col"
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
    </div>
  );
});

AnnotateTool.displayName = "AnnotateTool";

export default AnnotateTool;