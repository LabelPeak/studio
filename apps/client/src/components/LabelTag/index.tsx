import classNames from "classnames";
import { Label } from "shared";

interface IProps extends Label {
  selected?: boolean;
  onClick?: (value: Label) => void;
}

export const LabelTagColors = [
  "#b4317d",
  "#ce2e2c",
  "#2657d1",
  "#c6712b",
  "#569c30",
  "#c34524",
  "#44959a",
  "#2438bc",
  "#88b236",
  "#c98b31",
  "#4d20a4"
];

export default function LabelTag(props: IProps) {
  const { index, name, selected = false } = props;

  return (
    <span
      className={classNames([
        "py-1 px-2 b-rd-r-1 text-14px cursor-pointer bg-op-70 relative",
        "b-l-3 b-l-solid b-color-[var(--color)]",
        "transition-colors transition-1",
        selected ? "c-white" : "c-[var(--color)]"
      ])}
      // @ts-expect-error --color is not a valid property
      style={{ "--color": LabelTagColors[index % LabelTagColors.length] }}
      onClick={() => props.onClick?.({ index, name })}
    >
      <span
        className={classNames([
          "w-full h-full absolute top-0 left-0 b-rd-r-1 bg-[var(--color)]",
          !selected && "op-10"
        ])}
      />
      <span className="relative z-10">{name}</span>
    </span>
  );
}
