import { Project } from "@/interfaces/project";
import { requestWithAuth } from "../request";

function getMyParticipateProjects() {
  return requestWithAuth<Project[]>("/api/project");
}

function getProjectDetail(projectId: number) {
  return requestWithAuth<Project>("/api/project/" + projectId.toString());
}

const ProjectService = {
  getMyParticipateProjects,
  getProjectDetail
};

export default ProjectService;