import { Avatar as AntdAvatar, AvatarProps as AntdAvatarProps } from "antd";
import clsx from "clsx";
import { useMemo } from "react";
export interface IAvatarProps extends AntdAvatarProps {
  name: string;
}

const COLOR_LIST = ["#BF616A", "#D08770", "#EBCB8B", "#A3BE8C", "#B48EAD"] as const;

export default function Avatar(props: IAvatarProps) {
  const { name, style, className, ...otherProps } = props;

  const backgroundColor = useMemo(() => {
    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % COLOR_LIST.length;
    return COLOR_LIST[index];
  }, [name]);

  return (
    <AntdAvatar
      style={{ backgroundColor, ...style }}
      className={clsx(className, "select-none")}
      {...otherProps}
    >
      {name.slice(-2)}
    </AntdAvatar>
  );
}
