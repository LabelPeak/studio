import { Avatar as AntdAvatar } from "antd";
import { useMemo } from "react";

export interface IAvatarProps {
  role?: string;
  name: string;
  size?: string;
}

const COLOR_LIST = ["#BF616A", "#D08770", "#EBCB8B", "#A3BE8C", "#B48EAD"] as const;

export default function Avatar(props: IAvatarProps) {
  const { name } = props;

  const backgroundColor = useMemo(() => {
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % COLOR_LIST.length;
    return COLOR_LIST[index];
  }, [name]);

  return (
    <AntdAvatar style={{ backgroundColor }} className="select-none">
      {name.slice(-2)}
    </AntdAvatar>
  );
}
