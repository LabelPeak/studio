import Avatar from "@/components/Avatar";
import { Role } from "@/interfaces/project";
import RoleTag from "@/components/RoleTag";
import { User } from "@/interfaces/user";
import classNames from "classnames";

interface IProps {
  staff: User & { role: Role },
  onClick: (project: IProps["staff"]) => void;
}

export default function StaffItem(props: IProps) {
  const { staff, onClick } = props;

  function handleClick() {
    onClick(staff);
  }

  return (
    <div
      className={classNames([
        "b-b-1 b-b-solid b-color-nord-snow-0 py-3 px-4 hover:bg-nord-snow-2",
        "transition-colors transition-1 bg-white cursor-pointer",
      ])}
      onClick={handleClick}>
      <div className="flex items-center">
        <Avatar name={staff.realname!} />
        <div className="ml-2">{ staff.username }</div>
        <div className="flex-auto" />
        <RoleTag role={ staff.role } />
      </div>
      <div className="flex items-center text-[14px]">
      </div>

    </div>
  );
}