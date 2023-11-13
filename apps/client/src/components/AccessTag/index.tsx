import { Access } from "@/interfaces/project";
import { Tag } from "antd";
import { useIntl } from "react-intl";

const AccessTagColorMap: {
  [key in Access]: string;
} = {
  "write": "success",
  "read": "error",
  "hidden": "error",
};

interface IProps {
  access: Access;
}

export default function AccessTag(props: IProps) {
  const { access } = props;
  const intl = useIntl();

  return (
    <Tag color={AccessTagColorMap[access]}>
      { intl.formatMessage({ id: access }) }
    </Tag>
  );
}