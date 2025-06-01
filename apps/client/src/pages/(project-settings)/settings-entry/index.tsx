import { Menu, MenuProps } from "antd";
import { useIntl } from "react-intl";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useProject } from "@/hooks/use-project";

import ProjectHeader from "../../project-detail/components/project-header";

export default function ProjectSettingPage() {
  const navigate = useNavigate();
  const { id: projectId = "" } = useParams();
  const intl = useIntl();

  const { project, role } = useProject(parseInt(projectId));

  const menuItems: MenuProps["items"] = [
    { key: "general", label: intl.formatMessage({ id: "project-setting-general" }) },
    { key: "preset", label: intl.formatMessage({ id: "project-setting-preset" }) },
    { key: "member", label: intl.formatMessage({ id: "project-setting-member" }) },
    { key: "access", label: intl.formatMessage({ id: "project-setting-access" }) }
  ];

  function handleClickTab(e: any) {
    navigate(e.key);
  }

  return (
    <section id="project-settings" className="h-full bg-white flex flex-col">
      <ProjectHeader project={project} role={role} />
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
