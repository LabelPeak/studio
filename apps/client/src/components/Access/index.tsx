import { ReactNode } from "react";

interface IProps {
  accessible: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export default function Access(props: IProps) {
  const { accessible, fallback, children } = props;
  if (accessible) {
    return children;
  } else {
    return fallback;
  }
}