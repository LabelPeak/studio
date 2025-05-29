import { useQuery } from "@tanstack/react-query";
import { Button, message, Modal, Space, Table } from "antd";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";

import Access from "@/components/Access";
import AnnotateTool, { AnnotateToolRef } from "@/components/AnnotateTool";
import { useProject } from "@/hooks/use-project";
import { useAccess } from "@/hooks/useAccess";
import { DataItem } from "@/interfaces/dataset";
import DatasetService from "@/services/dataset";

import generateColumns from "./columns";
import ImportDataItemsForm from "./ImportDataItemsForm";
import ProjectHeader from "./ProjectHeader";

export function ProjectDetailPage() {
  const { id: projectId = "" } = useParams();
  const [annotatingItem, setAnnotatingItem] = useState<DataItem | null>(null);
  const intl = useIntl();
  const [openImportForm, setOpenImportForm] = useState(false);
  const annotateToolRef = useRef<AnnotateToolRef>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const selectedDataItems = useRef<DataItem[]>([]);
  const [dataItemPage] = useState(1);

  const { project, role } = useProject(parseInt(projectId));

  const columns = useMemo(() => {
    return generateColumns({
      isToolOpen
    });
  }, [project, isToolOpen]);

  const access = useAccess({ role });

  // TODO: use infinite list
  const {
    data: dataItems,
    isFetching: loadingDataItems,
    refetch: refreshDataItems
  } = useQuery({
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

  function handleImportFile() {
    setOpenImportForm(true);
  }

  function handleFinishImportFile(count: number) {
    setOpenImportForm(false);
    if (count > 0) {
      refreshDataItems();
    }
  }

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

  function handleSelectRows(_: any, rows: DataItem[]) {
    selectedDataItems.current = rows;
    if (rows.length === 0) {
      setIsMultiSelect(false);
    } else {
      setIsMultiSelect(true);
    }
  }

  async function handleBatchedDelete() {
    if (selectedDataItems.current.length === 0) {
      return;
    }
    try {
      const deleteCount = await DatasetService.deleteDataItems({
        project: project.id,
        dataitems: selectedDataItems.current.map((item) => item.id)
      });
      message.success(`成功删除 ${deleteCount} 条数据项`);
      refreshDataItems();
    } catch (error) {
      if (error instanceof Error) {
        message.error("删除失败: " + error.message);
      }
    }
  }

  return (
    <section className="bg-white h-full flex flex-col" id="project-detail-page">
      <ProjectHeader
        project={project}
        role={role}
        extra={
          <Space>
            <Access accessible={access.canSeeAdmin && isMultiSelect}>
              <Button danger onClick={handleBatchedDelete}>
                {intl.formatMessage({ id: "batched-delete" })}
              </Button>
            </Access>
            <Access accessible={access.canSeeAdmin}>
              <Button type="primary" onClick={handleImportFile}>
                {intl.formatMessage({ id: "import" })}
              </Button>
            </Access>
            <Access accessible={access.canSeeAdmin}>
              <Button>
                <Link to="settings">{intl.formatMessage({ id: "settings" })}</Link>
              </Button>
            </Access>
          </Space>
        }
      />
      <div className="flex flex-auto of-hidden">
        <div id="table-section" className="flex-auto of-auto">
          <Table<DataItem>
            loading={loadingDataItems}
            dataSource={dataItems}
            rowKey="id"
            columns={columns}
            pagination={false}
            rowSelection={{ type: "checkbox", onChange: handleSelectRows }}
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
      </div>
      <ImportDataItemsForm
        isOpen={openImportForm}
        project={project}
        handleClose={handleFinishImportFile}
      />
    </section>
  );
}
