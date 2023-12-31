import { Menu, MenuProps } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import LoadingLayer from "@/components/LoadingLayer";
import ProjectHeader from "../ProjectHeader";
import ProjectService from "@/services/project";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";
import useWorkingProject from "@/hooks/useWorkingProject";

export default function ProjectSettingPage() {
  const navigate = useNavigate();
  const { project, setProject } = useWorkingProject();
  const { id: projectId } = useParams<{ id: string }>();
  const intl = useIntl();
  const { loading: loadingProject } = useRequest(ProjectService.getProjectDetail, {
    defaultParams: [+(projectId || "0")],
    onSuccess: (res) => {
      if (res.data?.id) {
        setProject(res.data);
      }
    }
  });

  const menuItems: MenuProps["items"] = [
    { key: "general", label: intl.formatMessage({ id: "project-setting-general" }) },
    { key: "preset", label: intl.formatMessage({ id: "project-setting-preset" }) },
    { key: "member", label: intl.formatMessage({ id: "project-setting-member" }) },
    { key: "access", label: intl.formatMessage({ id: "project-setting-access" }) }
  ];

  function handleClickTab(e: any) {
    navigate(e.key);
  }

  if (loadingProject) return <LoadingLayer />;
  else return (
    <section id="project-settings" className="h-full bg-white flex flex-col">
      <ProjectHeader project={project} />
      <div className="flex h-full">
        <div className="w-50 h-full">
          <Menu
            items={menuItems}
            className="h-full"
            defaultSelectedKeys={["general"]}
            onClick={handleClickTab}
          />
        </div>
        <div className="flex-auto text-5">
          <Outlet />
        </div>
      </div>
    </section>
  );
}