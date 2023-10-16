import Avatar from "@/components/Avatar";
import { Project } from "@/interfaces/project";
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
      <div className="body px-4 mb-4">
        <span className="font-bold">{ project.name }</span>
      </div>
      <div className="footer pt-4 px-4 b-t-solid b-width-1 b-t-nord-snow-0 flex items-end">
        <div className="c-nord-polar-3 op-60"> { project.createAt } </div>
        <div className="flex-auto" />
        <Avatar name={project.creator?.username || ""} size="small" />
      </div>
    </div>
  );
}
