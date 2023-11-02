import { Link, useLocation, useNavigate } from "react-router-dom";
import { type ReactNode, memo, useMemo } from "react";
import { Project } from "@/interfaces/project";
import { Role } from "@/interfaces/project";
import { Tag } from "antd";
import { useIntl } from "react-intl";
interface IProps {
  project?: Project;
  extra?: ReactNode;
}

const RoleTagColorMapper: {
  [key in Role]: string;
} = {
  "admin": "blue",
  "annotator": "volcano",
  "checker": "green",
};

function ProjectHeader(props: IProps) {
  const { project, extra } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const backPathname = useMemo(() => {
    const temp = location.pathname.split("/");
    temp.pop();
    return temp.join("/");
  }, [location]);

  return (
    <div className="h-14 flex b-b-1 b-b-solid b-color-nord-snow-0 flex-shrink-0">
      <Link
        className="b-r-1 b-r-solid b-color-nord-snow-2 px-4 flex items-center hover:bg-nord-snow-2"
        to=".."
        onClick={(e) => {e.preventDefault(); navigate(backPathname); } }
      >
        <div className="i-mdi-arrow-left text-5 c-nord-polar-3" />
      </Link>
      <div className="px-4 flex items-center">
        <span className="font-bold">{project?.name}</span>
      </div>
      <div className="px-2 flex items-center">
        <Tag>{ intl.formatMessage({ id: project?.dataset.type }) }</Tag>
      </div>
      <div className="px-2 flex items-center">
        <Tag bordered={false} color={RoleTagColorMapper[project!.role]}>
          { intl.formatMessage({ id: "role-" + project?.role }) }
        </Tag>
      </div>
      <div className="flex-auto" />
      <div className="flex items-center px-4">
        { extra }
      </div>
    </div>
  );
}

const ProjectHeaderMemo = memo(ProjectHeader);

export default ProjectHeaderMemo;