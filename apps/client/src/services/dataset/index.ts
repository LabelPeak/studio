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

const DatasetService = {
  getDetail,
  getDataItems
};

export default DatasetService;