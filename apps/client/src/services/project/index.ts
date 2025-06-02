import { ProjectStatusRecord } from "shared";

import { Project } from "@/interfaces/project";
import { Role, UserProjectRelation } from "@/interfaces/user-project-relation";

import { requestWithAuth } from "../request";

export interface UserProjectRelationWithAnnotation extends UserProjectRelation {
  countAnnotations: number;
  countDataItems: number;
}

function getMyParticipateProjects() {
  return requestWithAuth<UserProjectRelationWithAnnotation[]>("/api/project/mine");
}

function getProjectDetail(projectId: number) {
  return requestWithAuth<UserProjectRelation>("/api/project/query/" + projectId.toString());
}

function findAll(props: { page: number; size: number }) {
  return requestWithAuth<{
    list: Project[];
    total: number;
  }>(`/api/project/all?page=${props.page}&size=${props.size}`);
}

function create(props: { name: string; access: string; type: string; admin: number }) {
  return requestWithAuth<Project>("/api/project/create", {
    method: "POST",
    body: JSON.stringify(props)
  });
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
    presets: string;
  }>
) {
  return requestWithAuth<Project>("/api/project/update/" + projectId.toString(), {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

function assignStaff(props: { user: number; project: number; role: Role }) {
  return requestWithAuth<null>("/api/project/assign", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

function pushStatusHistory(props: { projectId: number; record: Partial<ProjectStatusRecord> }) {
  return requestWithAuth<null>("/api/project/status-history/push", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

const ProjectService = {
  getMyParticipateProjects,
  getProjectDetail,
  findAll,
  create,
  remove,
  update,
  assignStaff,
  pushStatusHistory
};

export default ProjectService;
