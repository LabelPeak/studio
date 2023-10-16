import { Project } from "@/interfaces/project";
import { requestWithAuth } from "../request";

function getMyParticipateProjects() {
  return requestWithAuth<Project[]>("/api/project");
}

const ProjectService = {
  getMyParticipateProjects
};

export default ProjectService;