import { Button, Table } from "antd";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import AnnotateTool from "./AnnotateTool";
import { DataItem } from "@/interfaces/dataset";
import DatasetService from "@/services/dataset";
import LoadingLayer from "@/components/LoadingLayer";
import { Project } from "@/interfaces/project";
import ProjectService from "@/services/project";
import generateColumns from "./columns";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";

export function ProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project>();
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
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
      <div className="h-14 flex b-b-1 b-b-solid b-color-nord-snow-0">
        <Link
          className="b-r-1 b-r-solid b-color-nord-snow-2 px-4 flex items-center hover:bg-nord-snow-2"
          to="/project"
        >
          <div className="i-mdi-arrow-left text-5 c-nord-polar-3" />
        </Link>
        <div className="px-4 flex items-center">
          <span className="font-bold">{project?.name}</span>
        </div>
        <div className="flex-auto" />
        <div className="flex items-center px-4">
          <Button>
            <Link to="settings">
              {intl.formatMessage({ id: "settings" })}
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-auto">
        <div id="table-section" className="flex-auto">
          <Table<DataItem>
            loading={loadingDataItems}
            dataSource={dataItems}
            rowKey="id"
            columns={columns}
            pagination={false}
            rowSelection={{ type: "checkbox" }}
          />
        </div>
        <AnnotateTool />
      </div>
    </section>
  );
}