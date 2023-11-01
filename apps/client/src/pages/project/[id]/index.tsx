import { Button, Table } from "antd";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import AnnotateTool from "./AnnotateTool";
import { DataItem } from "@/interfaces/dataset";
import DatasetService from "@/services/dataset";
import LoadingLayer from "@/components/LoadingLayer";
import { Project } from "@/interfaces/project";
import ProjectHeader from "./ProjectHeader";
import ProjectService from "@/services/project";
import generateColumns from "./columns";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";

export function ProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project>();
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [annotatingItem, setAnnotatingItem] = useState<DataItem | null>(null);
  const intl = useIntl();
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

  if (loadingProject) return <LoadingLayer />;
  else return (
    <section className="bg-white h-full flex flex-col" id="project-detail-page">
      <ProjectHeader
        project={project}
        extra={
          <Button>
            <Link to="settings">
              {intl.formatMessage({ id: "settings" })}
            </Link>
          </Button>
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
              onClick: () => setAnnotatingItem(record)
            })}
          />
        </div>
        { (annotatingItem && project) &&
          <AnnotateTool
            dataItem={annotatingItem}
            annotatingType={project.dataset.type}
            presets={project.presets}
          />
        }
      </div>
    </section>
  );
}