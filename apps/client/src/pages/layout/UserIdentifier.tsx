import Avatar, { type IAvatarProps } from "@/components/Avatar";
import { Dropdown, type MenuProps } from "antd";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

interface IProps extends IAvatarProps {}

export default function UserIdentifier(props: IProps) {
  const resetUser = useUser(store => store.reset);
  const resetAuth = useAuth(store => store.reset);
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "退出登录",
      danger: true
    },
  ];

  const handleClickAvatar: MenuProps["onClick"]= function({ key }) {
    if (key === "logout") handleLogout();
  };

  function handleLogout() {
    resetUser();
    resetAuth();
    navigate("/login");
  }

  return (
    <Dropdown menu={{ items, onClick: handleClickAvatar }} trigger={["click"]}>
      <div className="cursor-pointer">
        <Avatar { ...props } />
      </div>
    </Dropdown>
  );
}