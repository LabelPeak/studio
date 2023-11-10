import AnnotateTool, { AnnotateToolRef } from "@/components/AnnotateTool";
import { Button, Modal, Space, Table } from "antd";
import { Link, useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import Access from "@/components/Access";
import { DataItem } from "@/interfaces/dataset";
import DatasetService from "@/services/dataset";
import ImportDataItemsForm from "./ImportDataItemsForm";
import LoadingLayer from "@/components/LoadingLayer";
import ProjectHeader from "./ProjectHeader";
import ProjectService from "@/services/project";
import generateColumns from "./columns";
import { useAccess } from "@/hooks/useAccess";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";
import useWorkingProject from "@/hooks/useWorkingProject";

export function ProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { project, setProject } = useWorkingProject();
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [annotatingItem, setAnnotatingItem] = useState<DataItem | null>(null);
  const intl = useIntl();
  const access = useAccess({ role: project?.role });
  const [openImportForm, setOpenImportForm] = useState(false);
  const annotateToolRef = useRef<AnnotateToolRef>(null);

  const columns = useMemo(() => {
    return generateColumns({
      projectLocation: project?.dataset.location || ""
    });
  }, [project]);

  const { loading: loadingProject } = useRequest(ProjectService.getProjectDetail, {
    defaultParams: [+(projectId || "0")],
    onSuccess: (res) => {
      if (res.data?.id) {
        setProject(res.data);
        loadDataItems({ page: 1, size: 10, datasetId: res.data.dataset.id });
      }
    }
  });

  const {
    run: loadDataItems,
    loading: loadingDataItems
  } = useRequest(DatasetService.getDataItems, {
    manual: true,
    onSuccess: (res) => {
      if (res.data) setDataItems(res.data.list);
    }
  });

  function handleImportFile() {
    setOpenImportForm(true);
  }

  function handleFinishImportFile(count: number) {
    setOpenImportForm(false);
    if (count > 0 && project) {
      loadDataItems({ page: 1, size: 10, datasetId: project.dataset.id });
    }
  }

  function handleClickDataItem(item: DataItem) {
    if (annotateToolRef.current === null) {
      setAnnotatingItem(item);
    } else {
      if (annotateToolRef.current.checkSafeSave()) {
        setAnnotatingItem(item);
      } else {
        Modal.confirm({
          title: "警告",
          content: "修改内容后未保存，是否放弃修改？",
          onOk: () => {
            setAnnotatingItem(item);
          }
        });
      }
    }

  }

  if (loadingProject) return <LoadingLayer />;
  else return (
    <section className="bg-white h-full flex flex-col" id="project-detail-page">
      <ProjectHeader
        project={project}
        extra={
          <Space>
            <Access accessible={access.canSeeAdmin}>
              <Button type="primary" onClick={handleImportFile}>
                {intl.formatMessage({id: "import" })}
              </Button>
            </Access>
            <Button>
              <Link to="settings">
                {intl.formatMessage({ id: "settings" })}
              </Link>
            </Button>
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
            rowSelection={{ type: "checkbox" }}
            onRow={(record) => ({
              onClick: () => handleClickDataItem(record)
            })}
          />
        </div>
        { (annotatingItem && project) &&
          <AnnotateTool
            ref={annotateToolRef}
            project={project}
            dataItem={annotatingItem}
            annotatingType={project.dataset.type}
            presets={project.presets}
          />
        }
      </div>
      { project &&
       <ImportDataItemsForm
         isOpen={openImportForm}
         project={project}
         handleClose={handleFinishImportFile}
       /> }
    </section>
  );
}