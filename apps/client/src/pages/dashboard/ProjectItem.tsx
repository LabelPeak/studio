import { Dropdown, type MenuProps } from "antd";
import { Project } from "@/interfaces/project";
import classNames from "classnames";
import { format } from "date-fns";
import { useIntl } from "react-intl";

interface IProps {
  project: Project,
  onClick: (project: Project) => void;
  onDelete: (projectId: number) => void;
  selectedId: number | undefined;
}

export default function ProjectItem(props: IProps) {
  const { project, selectedId } = props;
  const intl = useIntl();

  const dropdownItems: MenuProps["items"] = [
    { key: "delete", label: intl.formatMessage({ id: "delete" }), danger: true }
  ];

  function handleClick() {
    props.onClick(project);
  }

  const handleClickMenu: MenuProps["onClick"] = function(e) {
    if (e.key === "delete") props.onDelete(project.id);
  };

  return (
    <div
      className={classNames([
        "b-b-1 b-b-solid b-color-nord-snow-0 py-3 px-4 transition-colors transition-1",
        selectedId == project.id ? "bg-nord-snow-0": "hover:bg-nord-snow-2 bg-white",
      ])}
      onClick={handleClick}>
      <div className="flex items-center mb-4">
        <div
          className="max-w-[220px] of-hidden text-ellipsis"
          title={project.name}
        >
          { project.name }
        </div>
        <div className="flex-auto"></div>
        <div className="c-nord-polar-3 text-[14px]">{ format(new Date(project.createAt), "MM/dd") }</div>
        <Dropdown menu={{ items: dropdownItems, onClick: handleClickMenu }} trigger={["click"]}>
          <div
            className="ml-2 i-mdi-arrow-down-drop-circle-outline c-nord-polar-3 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>
      <div className="flex items-center text-[13px]">
        <div className="mr-2 c-nord-frost-3">#{ project.id }</div>
        <div className="font-italic mr-2">{ intl.formatMessage({ id: project.access })}</div>
        <div className="flex-auto" />
        <div className="c-nord-polar-2">
          <span>负责人: </span>
          <span>{ project.admin.realname }</span>
        </div>
      </div>
    </div>
  );
}