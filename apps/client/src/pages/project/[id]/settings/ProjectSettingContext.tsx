import { Project } from "@/interfaces/project";
import { createContext } from "react";

interface IContext {
  project: Project | undefined;
}

const ProjectSettingContext = createContext<IContext>({
  project: undefined
});

export default ProjectSettingContext;