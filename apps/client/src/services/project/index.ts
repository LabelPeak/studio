import { Project } from "@/interfaces/project";
import { requestWithAuth } from "../request";

function getMyParticipateProjects() {
  return requestWithAuth<Project[]>("/api/project/mine");
}

function getProjectDetail(projectId: number) {
  return requestWithAuth<Project>("/api/project/query/" + projectId.toString());
}

const ProjectService = {
  getMyParticipateProjects,
  getProjectDetail
};

export default ProjectService;