import { useQueryClient } from "@tanstack/react-query";
import { Button, message, Space } from "antd";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";

import Access from "@/components/Access";
import { useAccess } from "@/hooks/use-access";
import { useProject } from "@/hooks/use-project";
import { DataItem } from "@/interfaces/dataset";
import DatasetService from "@/services/dataset";

import AnnotationArea from "./components/annotation-area";
import ImportDataItemsForm from "./components/import-data-items-form";
import ProjectHeader from "./components/project-header";
import ProjectStatusDrawer from "./components/project-status-drawer";

export function ProjectDetailPage() {
  const { id: projectId = "" } = useParams();
  const intl = useIntl();
  const [openImportForm, setOpenImportForm] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const selectedDataItemsRef = useRef<DataItem[]>([]);
  const queryClient = useQueryClient();

  const [isOpenStatusDrawer, setIsOpenStatusDrawer] = useState(false);

  const { project, role } = useProject(parseInt(projectId));
  const access = useAccess({ role });

  function handleImportFile() {
    setOpenImportForm(true);
  }

  function handleFinishImportFile(count: number) {
    setOpenImportForm(false);
    if (count > 0) {
      queryClient.invalidateQueries({
        queryKey: ["dataItems", project.dataset.id]
      });
    }
  }

  function handleSelectRows(rows: DataItem[]) {
    selectedDataItemsRef.current = rows;
    if (rows.length === 0) {
      setIsMultiSelect(false);
    } else {
      setIsMultiSelect(true);
    }
  }

  async function handleBatchedDelete() {
    if (selectedDataItemsRef.current.length === 0) {
      return;
    }
    try {
      const deleteCount = await DatasetService.deleteDataItems({
        project: project.id,
        dataitems: selectedDataItemsRef.current.map((item) => item.id)
      });
      message.success(`成功删除 ${deleteCount} 条数据项`);
      queryClient.invalidateQueries({
        queryKey: ["dataItems", project.dataset.id]
      });
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
              <Button onClick={() => setIsOpenStatusDrawer(true)}>项目进展</Button>
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
        <AnnotationArea project={project} onSelectDataItems={handleSelectRows} />
      </div>
      <ImportDataItemsForm
        isOpen={openImportForm}
        project={project}
        handleClose={handleFinishImportFile}
      />
      <ProjectStatusDrawer
        open={isOpenStatusDrawer}
        onClose={() => setIsOpenStatusDrawer(false)}
        project={project}
      />
    </section>
  );
}
