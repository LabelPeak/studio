import { Link, useNavigate } from "react-router-dom";
import { type ReactNode, memo } from "react";
import { Project } from "@/interfaces/project";

interface IProps {
  project?: Project;
  extra?: ReactNode;
}

function ProjectHeader(props: IProps) {
  const { project, extra } = props;
  const navigate = useNavigate();

  return (
    <div className="h-14 flex b-b-1 b-b-solid b-color-nord-snow-0">
      <Link
        className="b-r-1 b-r-solid b-color-nord-snow-2 px-4 flex items-center hover:bg-nord-snow-2"
        to=".."
        onClick={(e) => {e.preventDefault(); navigate(-1); } }
      >
        <div className="i-mdi-arrow-left text-5 c-nord-polar-3" />
      </Link>
      <div className="px-4 flex items-center">
        <span className="font-bold">{project?.name}</span>
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