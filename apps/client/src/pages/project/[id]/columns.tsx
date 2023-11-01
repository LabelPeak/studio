import { ColumnsType } from "antd/es/table";
import { DataItem } from "@/interfaces/dataset";

function generateColumns(props: { projectLocation: string }) {
  const { projectLocation } = props;

  const columns: ColumnsType<DataItem> = [
    {
      title: "编号",
      dataIndex: "id",
      width: 100
    },
    {
      title: "来源",
      dataIndex: "file",
      render: (text: string) => `${projectLocation}/${text}`
    }
  ];

  return columns;
}

export default generateColumns;