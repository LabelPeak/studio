import { Tag } from "antd";
import { useIntl } from "react-intl";

import { Role } from "@/interfaces/user-project-relation";

const RoleTagColorMapper: {
  [key in Role]: string;
} = {
  admin: "blue",
  annotator: "volcano",
  checker: "green"
};

interface IProps {
  role: Role;
}

export default function RoleTag(props: IProps) {
  const { role } = props;
  const intl = useIntl();

  return (
    <Tag bordered={false} color={RoleTagColorMapper[role]}>
      {intl.formatMessage({ id: "role-" + role })}
    </Tag>
  );
}
