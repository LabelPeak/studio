import { Modal, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import classNames from "classnames";
import { format } from "date-fns";

import CheckStatusTag from "@/components/CheckStatusTag";
import { Annotation } from "@/interfaces/annotation";
import { DataItem } from "@/interfaces/dataset";

interface GenerateColumnsProps {
  isToolOpen: boolean;
}

function generateColumns(props: GenerateColumnsProps) {
  const { isToolOpen } = props;

  function handleViewCode(dataItem: DataItem) {
    // TODO: show empty annotation message
    if (dataItem.annotation.length === 0) {
      return;
    }

    Modal.confirm({
      title: "源标注数据",
      maskClosable: true,
      width: 800,
      icon: <div className="i-mdi-code-json c-nord-frost-3 text-24px mr-2" />,
      content: (
        <Typography.Paragraph>
          <pre className="of-auto max-h-60vh">{JSON.stringify(dataItem.annotation, null, 2)}</pre>
        </Typography.Paragraph>
      )
    });
  }

  let columns: ColumnsType<DataItem> = [
    {
      title: "编号",
      dataIndex: "id",
      width: 80
    },
    {
      title: "来源",
      dataIndex: "file",
      ellipsis: true,
      // TODO: render data source preview
      render: (text: string) => `${text}`
    }
  ];

  if (!isToolOpen) {
    columns = columns.concat([
      {
        title: "上次修改时间",
        dataIndex: "updateAt",
        width: 200,
        render: (date) => format(new Date(date), "yyyy-MM-dd hh:mm:ss")
      },
      {
        title: "标注数量",
        dataIndex: "annotation",
        width: 120,
        align: "center",
        render: (annotations: Annotation<unknown>[]) => annotations.length
      },
      {
        title: "审核状态",
        width: 120,
        dataIndex: "approved",
        align: "center",
        render: (approved: boolean | undefined) => <CheckStatusTag checked={approved} />
      }
    ]);
  }

  columns.push({
    title: "操作",
    width: 80,
    align: "center",
    render: (_, record) => (
      <div
        className={classNames([
          "i-mdi-code-json c-nord-frost-3 text-18px inline-block",
          record.annotation.length === 0 ? "op-30 cursor-not-allowed" : "cursor-pointer"
        ])}
        onClick={(e) => {
          e.stopPropagation();
          handleViewCode(record);
        }}
      />
    )
  });

  return columns;
}

export default generateColumns;
