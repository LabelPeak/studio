import { Project, Role } from "@/interfaces/project";
import { requestWithAuth } from "../request";

function getMyParticipateProjects() {
  return requestWithAuth<Project[]>("/api/project/mine");
}

function getProjectDetail(projectId: number) {
  return requestWithAuth<Project>("/api/project/query/" + projectId.toString());
}

function findAll(props: {
  page: number,
  size: number
}) {
  return requestWithAuth<{
    list: Project[];
    total: number;
  }>(
    `/api/project/all?page=${props.page}&size=${props.size}`
  );
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

function assignStaff(props: {
  user: number;
  project: number;
  role: Role;
}) {
  return requestWithAuth<null>("/api/project/assign", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

const ProjectService = {
  getMyParticipateProjects,
  getProjectDetail,
  findAll,
  remove,
  update,
  assignStaff
};

export default ProjectService;