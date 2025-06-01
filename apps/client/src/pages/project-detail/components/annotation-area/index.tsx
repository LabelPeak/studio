import { useQuery } from "@tanstack/react-query";
import { Modal, Table } from "antd";
import { useMemo, useRef, useState } from "react";

import AnnotateTool, { AnnotateToolRef } from "@/components/AnnotateTool";
import { DataItem } from "@/interfaces/dataset";
import { Project } from "@/interfaces/project";
import DatasetService from "@/services/dataset";

import generateColumns from "../../columns";

interface AnnotationAreaProps {
  project: Project;
  onSelectDataItems: (items: DataItem[]) => void;
}

export default function AnnotationArea({ project, onSelectDataItems }: AnnotationAreaProps) {
  const [dataItemPage] = useState(1);
  const [annotatingItem, setAnnotatingItem] = useState<DataItem | null>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const annotateToolRef = useRef<AnnotateToolRef>(null);

  const columns = useMemo(() => {
    return generateColumns({
      isToolOpen
    });
  }, [project, isToolOpen]);

  // TODO: use infinite list
  const { data: dataItems, isFetching: loadingDataItems } = useQuery({
    queryKey: ["dataItems", project.dataset.id, dataItemPage] as const,
    queryFn: async ({ queryKey }) => {
      const res = await DatasetService.getDataItems({
        datasetId: queryKey[1],
        page: queryKey[2],
        size: 10
      });

      return res.list;
    }
  });

  function handleClickDataItem(item: DataItem) {
    setIsToolOpen(true);
    if (annotateToolRef.current === null) {
      setAnnotatingItem(item);
    } else {
      if (annotateToolRef.current.checkSafeSave()) {
        setAnnotatingItem(item);
      } else {
        Modal.confirm({
          maskClosable: true,
          title: "警告",
          content: "修改内容后未保存，是否放弃修改？",
          onOk: () => {
            setAnnotatingItem(item);
          }
        });
      }
    }
  }

  return (
    <>
      <div id="table-section" className="flex-auto of-auto">
        <Table<DataItem>
          loading={loadingDataItems}
          dataSource={dataItems}
          rowKey="id"
          columns={columns}
          pagination={false}
          rowSelection={{ type: "checkbox", onChange: (_, rows) => onSelectDataItems(rows) }}
          onRow={(record) => ({
            onClick: () => handleClickDataItem(record)
          })}
        />
      </div>
      {isToolOpen && annotatingItem && (
        <AnnotateTool
          ref={annotateToolRef}
          project={project}
          dataItem={annotatingItem}
          annotatingType={project.dataset.type}
        />
      )}
    </>
  );
}
