import { Dropdown, type MenuProps, Tag } from "antd";
import { useIntl } from "react-intl";

import Access from "@/components/Access";
import Avatar from "@/components/Avatar";
import { useAccess } from "@/hooks/useAccess";
import useUser from "@/hooks/useUser";

export default function UserIdentifier() {
  const { signout, realname } = useUser();

  const access = useAccess();
  const intl = useIntl();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "退出登录",
      danger: true
    }
  ];

  const handleClickAvatar: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      signout();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Access accessible={access.canSeeSuperAdmin}>
        <Tag color="gold">{intl.formatMessage({ id: "role-super-admin" })}</Tag>
      </Access>
      <Dropdown menu={{ items, onClick: handleClickAvatar }} trigger={["click"]}>
        <div className="cursor-pointer">
          <Avatar name={realname} />
        </div>
      </Dropdown>
    </div>
  );
}
