import { User } from "@/interfaces/user";
import { requestWithAuth } from "@/services/request";

function findAllStaff(props: {
  page: number, size: number
}) {
  return requestWithAuth<{ list: Array<User>, total: number }>(
    `/api/admin/staff?page=${props.page}&size=${props.size}`
  );
}

function createStaff(props: { realname: string }) {
  return requestWithAuth<User & { password: string }>("/api/admin/staff", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

function deleteStaff(props: { id: number }) {
  return requestWithAuth<void>(`/api/admin/staff/${props.id}`, {
    method: "DELETE"
  });
}

const AdminService = {
  findAllStaff,
  createStaff,
  deleteStaff
};

export default AdminService;