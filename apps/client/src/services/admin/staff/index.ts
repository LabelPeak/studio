import { Role } from "@/interfaces/project";
import { User } from "@/interfaces/user";
import { requestWithAuth } from "@/services/request";

function findAll(props: {
  page: number, size: number
}) {
  return requestWithAuth<{ list: Array<User>, total: number }>(
    `/api/admin/staff?page=${props.page}&size=${props.size}`
  );
}

function findAllInProject(props: {
  project: number, page: number, size: number
}) {
  return requestWithAuth<{
     list: Array<User & { role: Role }>;
     total: number;
    }>(
      `/api/admin/staff?project=${props.project}&page=${props.page}&size=${props.size}`
    );
}

function create(props: { realname: string }) {
  return requestWithAuth<User & { password: string }>("/api/admin/staff", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

function update(props: { id: number, realname: string, password: string }) {
  return requestWithAuth<null>(`/api/admin/staff/${props.id}`, {
    method: "PATCH",
    body: JSON.stringify(props)
  });
}

function remove(props: { id: number }) {
  return requestWithAuth<void>(`/api/admin/staff/${props.id}`, {
    method: "DELETE"
  });
}

const innerStaffApi = {
  findAll,
  findAllInProject,
  create,
  update,
  remove
};

export default innerStaffApi;