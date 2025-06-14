import { User } from "@/interfaces/user";
import { Role } from "@/interfaces/user-project-relation";

import { requestWithAuth } from "../request";

function getProfile() {
  return requestWithAuth<User>("/api/staff");
}

function findAll(props: { page: number; size: number }) {
  return requestWithAuth<{ list: Array<User>; total: number }>(
    `/api/staff/all?page=${props.page}&size=${props.size}`
  );
}

function findAllInProject(props: { project: number; page: number; size: number }) {
  return requestWithAuth<{
    list: Array<User & { role: Role }>;
    total: number;
  }>(`/api/staff/project/${props.project}?page=${props.page}&size=${props.size}`);
}

function create(props: { realname: string }) {
  return requestWithAuth<User & { password: string }>("/api/staff", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

function update(props: { id: number; realname: string; password: string }) {
  return requestWithAuth<null>(`/api/staff/${props.id}`, {
    method: "PATCH",
    body: JSON.stringify(props)
  });
}

function remove(props: { id: number }) {
  return requestWithAuth<undefined>(`/api/staff/${props.id}`, {
    method: "DELETE"
  });
}

function search(props: { token: string; page: number; size: number }) {
  return requestWithAuth<{ list: User[]; total: number }>(
    `/api/staff/search?token=${props.token}&page=${props.page}&size=${props.size}`,
    {
      method: "GET"
    }
  );
}

const StaffService = {
  getProfile,
  findAll,
  findAllInProject,
  create,
  update,
  remove,
  search
};

export default StaffService;
