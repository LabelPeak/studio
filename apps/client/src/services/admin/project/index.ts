import { Project } from "@/interfaces/project";
import { requestWithAuth } from "@/services/request";

function findAll(props: {
  page: number,
  size: number
}) {
  return requestWithAuth<{
    list: Project[];
    total: number;
  }>(
    `/api/admin/project?page=${props.page}&size=${props.size}`
  );
}

const innerProjectApi = {
  findAll
};

export default innerProjectApi;