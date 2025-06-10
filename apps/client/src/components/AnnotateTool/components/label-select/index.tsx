import { useIntl } from "react-intl";
import { Label } from "shared";

import LabelTag from "@/components/LabelTag";

interface LabelSelectProps {
  availableLabels?: Label[];
  selectedLabels: Label[];
  onLabelSelect: (label: Label) => void;
}

export default function LabelSelect({
  availableLabels,
  selectedLabels,
  onLabelSelect
}: LabelSelectProps) {
  const intl = useIntl();

  return (
    <section id="label-select-presets-section" className="w-40% px-2 box-border">
      <h2 className="text-14px my-0 py-3 b-b-1 b-b-dashed b-color-nord-snow-0">
        {intl.formatMessage({ id: "presets" })}
      </h2>
      <div className="flex gap-2 mt-2 flex-wrap">
        {availableLabels?.map((label) => (
          <LabelTag
            key={label.index}
            index={label.index}
            name={label.name}
            onClick={onLabelSelect}
            selected={Boolean(selectedLabels.find((l) => l.index === label.index))}
          />
        ))}
      </div>
    </section>
  );
}
