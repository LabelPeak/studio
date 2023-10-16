import { Avatar as AntdAvatar } from "antd";

export interface IAvatarProps {
  role?: string;
  name: string;
  size?: string;
}

export default function Avatar(props: IAvatarProps) {
  const { name } = props;
  // TODO: customize color by name hash
  const colorList = ["#BF616A", "#D08770", "#EBCB8B", "#A3BE8C", "#B48EAD"];

  return (
    <AntdAvatar style={{ background: colorList[0] }} className="select-none">
      { name.slice(0, 2) }
    </AntdAvatar>
  );
}