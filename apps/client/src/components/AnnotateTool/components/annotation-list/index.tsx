import { useIntl } from "react-intl";
import { ImageClassifyAnnotation } from "shared";
import { Label } from "shared";

import LabelTag from "@/components/LabelTag";

interface AnnotationListProps {
  annotationObjectList: ImageClassifyAnnotation[];
  labels?: Label[];
}

const AnnotationList = ({ annotationObjectList, labels }: AnnotationListProps) => {
  const intl = useIntl();

  return (
    <section
      id="annotations"
      className="w-60% px-2 box-border b-l-1 b-l-solid b-color-nord-snow-0 flex flex-col"
    >
      <h2 className="text-14px my-0 py-3 b-b-1 b-b-dashed b-color-nord-snow-0">
        {intl.formatMessage({ id: "annotations" })} ({annotationObjectList.length})
      </h2>
      <div className="of-auto flex-auto">
        {annotationObjectList.map((annotation, index) => (
          <p
            className="m-0 py-2 cursor-pointer flex hover:bg-nord-snow-1 b-rd-1 items-center"
            key={annotation.id}
          >
            <span className="c-nord-polar-3 w-36px">#{index + 1}</span>
            <LabelTag
              index={labels?.findIndex((label) => label.name === annotation.value.labels[0]) ?? 0}
              name={annotation.value.labels[0]}
            />
            <span className="flex-auto" />
            <span className="font-mono text-14px">
              <span> x: {annotation.value.x.toFixed(2)}% </span>
              <span> y: {annotation.value.y.toFixed(2)}% </span>
            </span>
          </p>
        ))}
      </div>
    </section>
  );
};

export default AnnotationList;
