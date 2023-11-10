import { DataItem, Dataset } from "@/interfaces/dataset";
import { requestWithAuth } from "../request";

export function getDetail(props: { projectId: number }) {
  return requestWithAuth<Dataset>(`/api/dataset?projectId=${props.projectId}`);
}

export function getDataItems(props:
   { datasetId: number, page: number, size: number }
) {
  return requestWithAuth<{ list: DataItem[], total: number}>(
    `/api/dataset/dataitem?page=${props.page}&size=${props.size}&datasetId=${props.datasetId}`
  );
}

export function updateAnnotation(props:
  { data: string, project: number, id: number }
) {
  return requestWithAuth<null>("/api/dataset/dataitem/annotate", {
    method: "PUT",
    body: JSON.stringify(props)
  });
}

const DatasetService = {
  getDetail,
  getDataItems,
  updateAnnotation
};

export default DatasetService;