import { forwardRef, useImperativeHandle } from "react";
import classNames from "classnames";

interface IProps {}

interface AnnotateTool {}

const AnnotateTool = forwardRef<AnnotateTool ,IProps>((_, ref) => {
  useImperativeHandle(ref, () => {
    return {};
  }, []);

  return (
    <div
      id="annotate-section"
      className={classNames([
        "flex-basis-[60%] b-l-solid b-color-nord-snow-0 b-l-1",
        "flex justify-center items-center"
      ])}
    >
      <h1 className="c-nord-snow-1 text-8">数据标注区</h1>
    </div>
  );
});

export default AnnotateTool;