import { useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, message, Space } from "antd";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { last } from "remeda";
import { isStatusBefore, PROJECT_STATUS } from "shared";

import Access from "@/components/Access";
import { useAccess } from "@/hooks/use-access";
import { useProject } from "@/hooks/use-project";
import { DataItem } from "@/interfaces/dataset";
import DatasetService from "@/services/dataset";
import ProjectService from "@/services/project";

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
  const currentStatus = last(project.statusHistory)?.status;

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

  async function handleStartAnnotate() {
    try {
      await ProjectService.pushStatusHistory({
        projectId: project.id,
        record: {
          status: PROJECT_STATUS.ANNOTATING
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    }
  }

  async function handleStartPreAnnotate() {
    try {
      await ProjectService.startPreAnnotate({
        projectId: project.id
      });
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    }
  }

  async function handleRelease() {
    try {
      const { project: newProject } = await ProjectService.releaseProject({
        projectId: project.id,
        releaseType: "yolo"
      });
      window.open(newProject.releaseUrl);
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message);
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
            <Access
              accessible={
                access.canSeeAdmin &&
                Boolean(
                  currentStatus && isStatusBefore(currentStatus, PROJECT_STATUS.PRE_ANNOTATING)
                )
              }
            >
              <Button type="primary" onClick={handleImportFile}>
                {intl.formatMessage({ id: "import" })}
              </Button>
            </Access>
            <Access accessible={access.canSeeAdmin && currentStatus === PROJECT_STATUS.PENDING}>
              <Dropdown.Button
                onClick={handleStartAnnotate}
                menu={{
                  items: [
                    {
                      key: PROJECT_STATUS.PRE_ANNOTATING,
                      label: "执行预标注任务",
                      onClick: handleStartPreAnnotate
                    }
                  ]
                }}
              >
                执行标注任务
              </Dropdown.Button>
            </Access>
            <Access accessible={access.canSeeAdmin}>
              <Button onClick={() => setIsOpenStatusDrawer(true)}>项目进展</Button>
            </Access>
            <Access accessible={access.canSeeAdmin}>
              <Link to="settings">
                <Button>{intl.formatMessage({ id: "settings" })}</Button>
              </Link>
            </Access>
            <Access accessible={access.canSeeAdmin}>
              <Button type="primary" onClick={handleRelease}>
                发布
              </Button>
            </Access>
          </Space>
        }
      />
      <div className="flex flex-auto of-hidden">
        <AnnotationArea project={project} onSelectDataItems={handleSelectRows} role={role} />
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
