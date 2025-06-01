import { format } from "date-fns";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import AccessTag from "@/components/AccessTag";
import RoleTag from "@/components/RoleTag";
import { Project } from "@/interfaces/project";
import { Role } from "@/interfaces/user-project-relation";

interface ProjectCardProps {
  project: Partial<Project>;
  role: Role;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { project, role } = props;
  const navigate = useNavigate();
  const intl = useIntl();

  function handleClickCard(id: number | undefined) {
    if (id !== undefined) {
      navigate(id.toString());
    }
  }

  return (
    <div
      className="project-card bg-white py-4 shadow shadow-nord-snow-0 b-rd-1 decoration-none cursor-pointer"
      onClick={() => handleClickCard(project.id)}
    >
      <div className="body px-4 mb-3 flex items-end">
        {project.access ? <AccessTag access={project.access} /> : null}
        <span className="font-bold mr-2 of-hidden text-ellipsis">{project.name}</span>
        <span
          className="text-14px c-nord-polar-3 shrink-0"
          title={intl.formatMessage({ id: "role-admin" })}
        >
          {project.admin?.realname || ""}
        </span>
        <span className="flex-auto" />
      </div>
      {project.createAt ? (
        <div className="mb-3 px-4">
          <span
            className="c-nord-polar-3 op-60 mr-2 text-14px"
            title={intl.formatMessage({ id: "project-createAt" })}
          >
            {format(new Date(project.createAt), "yyyy/MM/dd")}
          </span>
        </div>
      ) : null}
      <div className="footer pt-3 px-4 b-t-solid b-width-1 b-t-nord-snow-0 flex items-end">
        <span className="c-nord-polar-3 text-14px">
          {/* TODO: {project.countDataItems === 0
            ? intl.formatMessage({ id: "project-annotate-progress-none" })
            : `${intl.formatMessage({ id: "project-annotate-progress" })}: ${project.countAnnotations}/${project.countDataItems}`} */}
        </span>
        <div className="flex-auto" />
        <RoleTag role={role} />
      </div>
    </div>
  );
}
