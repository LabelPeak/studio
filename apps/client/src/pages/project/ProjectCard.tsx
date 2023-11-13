import AccessTag from "@/components/AccessTag";
import { Project } from "@/interfaces/project";
import RoleTag from "@/components/RoleTag";
import { format } from "date-fns";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

interface IProps {
  project: Partial<Project>
}

export default function ProjectCard(props: IProps) {
  const { project } = props;
  const navigate = useNavigate();
  const intl = useIntl();

  function handleClickCard(id: number | undefined) {
    if (id !== undefined)
      navigate(id.toString());
  }

  return (
    <div
      className="project-card bg-white py-4 shadow shadow-nord-snow-0 b-rd-1 decoration-none cursor-pointer"
      onClick={() => handleClickCard(project.id)}
    >
      <div className="body px-4 mb-4 flex items-end">
        <AccessTag access={project.access!} />
        <span className="font-bold mr-2">{ project.name }</span>
        <span className="text-14px c-nord-polar-3" title={ intl.formatMessage({ id: "role-admin" }) }>
          {project.admin?.realname || ""}
        </span>
        <span className="flex-auto" />
      </div>
      <div className="footer pt-3 px-4 b-t-solid b-width-1 b-t-nord-snow-0 flex items-end">
        <div className="c-nord-polar-3 op-60 mr-2 text-14px">
          { format(new Date(project.createAt!), "yyyy/MM/dd") }
        </div>
        <div className="flex-auto" />
        <RoleTag role={project.role!} />
      </div>
    </div>
  );
}
