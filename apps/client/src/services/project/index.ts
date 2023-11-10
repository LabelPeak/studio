import { Project } from "@/interfaces/project";
import { requestWithAuth } from "../request";

function getMyParticipateProjects() {
  return requestWithAuth<Project[]>("/api/project/mine");
}

function getProjectDetail(projectId: number) {
  return requestWithAuth<Project>("/api/project/query/" + projectId.toString());
}

function remove(projectId: number) {
  return requestWithAuth<Project>("/api/project/delete/" + projectId.toString(), {
    method: "DELETE"
  });
}

function update(
  projectId: number,
  data: Partial<{
    access: string;
    name: string;
  }>
) {
  return requestWithAuth<Project>("/api/project/update/" + projectId.toString(), {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

const ProjectService = {
  getMyParticipateProjects,
  getProjectDetail,
  remove,
  update
};

export default ProjectService;