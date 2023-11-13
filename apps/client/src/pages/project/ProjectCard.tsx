import AccessTag from "@/components/AccessTag";
import Avatar from "@/components/Avatar";
import { Project } from "@/interfaces/project";
import RoleTag from "@/components/RoleTag";
import { useNavigate } from "react-router-dom";

interface IProps {
  project: Partial<Project>
}

export default function ProjectCard(props: IProps) {
  const { project } = props;
  const navigate = useNavigate();

  function handleClickCard(id: number | undefined) {
    if (id !== undefined)
      navigate(id.toString());
  }

  return (
    <div
      className="project-card bg-white py-4 shadow shadow-nord-snow-0 b-rd-1 decoration-none cursor-pointer"
      onClick={() => handleClickCard(project.id)}
    >
      <div className="body px-4 mb-4 flex">
        <AccessTag access={project.access!} />
        <span className="font-bold">{ project.name }</span>
        <span className="flex-auto" />
        <RoleTag role={project.role!} />
      </div>
      <div className="footer pt-3 px-4 b-t-solid b-width-1 b-t-nord-snow-0 flex items-end">
        <div className="c-nord-polar-3 op-60 mr-2"> { project.createAt } </div>
        <div className="flex-auto" />
        <Avatar name={project.admin?.realname || ""} size="small" />
      </div>
    </div>
  );
}
