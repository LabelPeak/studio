import { useQuery } from "@tanstack/react-query";
import { Empty, Modal, Table } from "antd";
import { useMemo, useRef, useState } from "react";
import { last } from "remeda";
import { PROJECT_STATUS } from "shared";

import AnnotateTool, { AnnotateToolRef } from "@/components/AnnotateTool";
import { DataItem } from "@/interfaces/dataset";
import { Project } from "@/interfaces/project";
import { Role } from "@/interfaces/user-project-relation";
import DatasetService from "@/services/dataset";

import generateColumns from "../../columns";

interface AnnotationAreaProps {
  project: Project;
  role: Role;
  onSelectDataItems: (items: DataItem[]) => void;
}

export default function AnnotationArea({ project, role, onSelectDataItems }: AnnotationAreaProps) {
  const [dataItemPage] = useState(1);
  const [annotatingItem, setAnnotatingItem] = useState<DataItem | null>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const annotateToolRef = useRef<AnnotateToolRef>(null);

  const isShowAnnotationArea = useMemo(() => {
    const currentStatus = last(project.statusHistory)?.status;

    if (role === Role.annotator) {
      if (
        currentStatus === PROJECT_STATUS.ANNOTATING ||
        currentStatus === PROJECT_STATUS.RE_ANNOTATING
      ) {
        return true;
      }
      return false;
    } else if (role === Role.checker) {
      if (
        currentStatus === PROJECT_STATUS.CHECKING ||
        currentStatus === PROJECT_STATUS.RE_CHECKING
      ) {
        return true;
      }
      return false;
    }

    return true;
  }, [project.statusHistory, role]);

  const columns = useMemo(() => {
    return generateColumns({
      isToolOpen
    });
  }, [project, isToolOpen]);

  const { data: dataItems, isFetching: loadingDataItems } = useQuery({
    queryKey: ["dataItems", project.dataset.id, dataItemPage] as const,
    queryFn: async ({ queryKey }) => {
      const res = await DatasetService.getDataItems({
        datasetId: queryKey[1],
        page: queryKey[2],
        size: 10
      });

      return res.list;
    },
    enabled: isShowAnnotationArea
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

  if (!isShowAnnotationArea) {
    return (
      <div className="flex-auto of-auto">
        <div className="flex h-full items-center justify-center">
          <Empty description={"项目状态不允许标注"}></Empty>
        </div>
      </div>
    );
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
