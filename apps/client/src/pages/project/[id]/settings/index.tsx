import { Menu, MenuProps } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import LoadingLayer from "@/components/LoadingLayer";
import { Project } from "@/interfaces/project";
import ProjectService from "@/services/project";
import ProjectSettingContext from "./ProjectSettingContext";
import { useRequest } from "ahooks";
import { useState } from "react";

const menuItems: MenuProps["items"] = [
  { key: "general", label: "项目管理" }
];

export default function ProjectSettingPage() {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const { id: projectId } = useParams<{ id: string }>();
  const { loading: loadingProject } = useRequest(ProjectService.getProjectDetail, {
    defaultParams: [+(projectId || "0")],
    onSuccess: (res) => {
      if (res.data?.id) {
        setProject(res.data);
      }
    }
  });

  function handleClickTab(e: any) {
    navigate(e.key);
  }

  if (loadingProject) return <LoadingLayer />;
  else return (
    <section id="project-settings" className="h-full bg-white flex">
      <div className="w-50 h-full">
        <Menu
          items={menuItems}
          className="h-full"
          defaultSelectedKeys={["general"]}
          onClick={handleClickTab}
        />
      </div>
      <div className="flex-auto">
        <ProjectSettingContext.Provider value={{ project }}>
          <Outlet />
        </ProjectSettingContext.Provider>
      </div>
    </section>
  );
}