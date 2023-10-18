import { Project } from "@/interfaces/project";
import { createContext } from "react";

interface IContext {
  project: Project | null;
}

const ProjectSettingContext = createContext<IContext>({
  project: null
});

export default ProjectSettingContext;