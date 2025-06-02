import { Tag } from "antd";
import { memo, type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { last } from "remeda";

import Access from "@/components/Access";
import AccessTag from "@/components/AccessTag";
import RoleTag from "@/components/RoleTag";
import { useAccess } from "@/hooks/use-access";
import { Project } from "@/interfaces/project";
import { Role } from "@/interfaces/user-project-relation";

interface ProjectHeaderProps {
  project: Project;
  role: Role;
  extra?: ReactNode;
}

function ProjectHeader(props: ProjectHeaderProps) {
  const { project, extra, role } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const { canSeeAdmin } = useAccess({ role });

  const backPathname = useMemo(() => {
    const temp = location.pathname.split("/");
    temp.pop();
    return temp.join("/");
  }, [location]);

  return (
    <section className="h-14 flex b-b-1 b-b-solid b-color-nord-snow-0 flex-shrink-0">
      <Link
        className="b-r-1 b-r-solid b-color-nord-snow-2 px-4 flex items-center hover:bg-nord-snow-2"
        to=".."
        onClick={(e) => {
          e.preventDefault();
          navigate(backPathname);
        }}
      >
        <div className="i-mdi-arrow-left text-5 c-nord-polar-3" />
      </Link>
      <div className="px-4 flex items-center">
        <span className="c-nord-polar-3 mr-2">#{project.id}</span>
        <span className="font-bold">{project.name}</span>
      </div>
      <div className="mr-2 flex items-center">
        <Tag>{intl.formatMessage({ id: project.dataset.type })}</Tag>
      </div>
      <Access accessible={canSeeAdmin}>
        <div className="mr-2 flex items-center">
          <AccessTag access={project.access} />
        </div>
      </Access>
      <div className="mr-2 flex items-center">
        <RoleTag role={role} />
      </div>
      <div className="mr-2 flex items-center">
        <Tag bordered={false}>
          项目状态:{" "}
          {intl.formatMessage({ id: `project-status-${last(project.statusHistory)?.status}` })}
        </Tag>
      </div>
      <div className="flex-auto" />
      <div className="flex items-center px-4">{extra}</div>
    </section>
  );
}

const ProjectHeaderMemo = memo(ProjectHeader);

export default ProjectHeaderMemo;
