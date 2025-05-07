import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";

import LoadingLayer from "@/components/LoadingLayer";
import { Project, Role } from "@/interfaces/project";
import { User } from "@/interfaces/user";
import ProjectService from "@/services/project";
import StaffService from "@/services/staff";

import CreateProjectDrawer from "./components/create-project-form-drawer";
import ProjectColumnPlaceholder from "./components/project-column-placeholder";
import ProjectItem from "./components/project-item";
import StaffColumnPlaceholder from "./components/staff-column-placeholder";
import StaffItem from "./components/staff-item";

export function DashboardPage() {
  const intl = useIntl();
  const [projectPage, setProjectPage] = useState(1);
  const [staffPage, setStaffPage] = useState(1);

  const [selectedProject, setSelectedProject] = useState<Project>();
  const [openCreateProjectForm, setOpenCreateProjectForm] = useState(false);

  const {
    data: projects = [],
    isFetching: loadingProjects,
    refetch: refreshProjects
  } = useQuery({
    queryKey: ["allProjects", projectPage] as const,
    queryFn: async ({ queryKey }) => {
      const res = await ProjectService.findAll({
        page: queryKey[1],
        size: 10
      });
      return res.list;
    }
  });

  const { data: staffs = [], isFetching: loadingStaffs } = useQuery({
    queryKey: ["staffsInProject", selectedProject?.id, staffPage] as const,
    queryFn: async ({ queryKey }) => {
      if (queryKey[1] === undefined) {
        return [];
      }
      const res = await StaffService.findAllInProject({
        project: queryKey[1],
        page: queryKey[2],
        size: 10
      });

      return res.list;
    }
  });

  function handleClickCreateProject() {
    setOpenCreateProjectForm(true);
  }

  function handleClickProject(project: Project) {
    setSelectedProject(project);
    setStaffPage(1);
  }

  async function handleDeleteProject(id: number) {
    try {
      await ProjectService.remove(id);
      message.success("删除成功");
      setProjectPage(1);
      refreshProjects();
      setSelectedProject(undefined);
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error("删除失败: " + e.message || "未知错误");
      }
    }
  }

  function handleClickStaff(staff: User & { role: Role }) {
    console.log(staff);
  }

  function handleCreateProjectFormClose() {
    setOpenCreateProjectForm(false);
  }

  return (
    <section id="dashboard-page" className="h-full flex bg-white">
      <section className="w-xs b-r-1 b-r-solid b-color-nord-snow-0 flex flex-col">
        <div className="flex b-b-1 b-b-solid b-color-nord-snow-0 items-center p-4">
          <h1 className="m-0 text-4">{intl.formatMessage({ id: "page-title-projects" })}</h1>
          <div className="flex-auto" />
          <div
            className="i-mdi-folder-plus c-nord-frost-3 text-5 cursor-pointer"
            title="add-project"
            onClick={handleClickCreateProject}
          />
        </div>
        <div className="flex-auto relative of-auto bg-nord-snow-2 bg-op-70">
          {loadingProjects ? <LoadingLayer /> : null}
          {!loadingProjects && projects.length === 0 ? (
            <ProjectColumnPlaceholder type="empty" />
          ) : null}
          {!loadingProjects
            ? projects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  onClick={handleClickProject}
                  onDelete={handleDeleteProject}
                  selectedId={selectedProject?.id}
                />
              ))
            : null}
        </div>
      </section>
      <section className="w-xs b-r-1 b-r-solid b-color-nord-snow-0 flex flex-col">
        <div className="flex b-b-1 b-b-solid b-color-nord-snow-0 items-center p-4">
          <h1 className="m-0 text-4">{intl.formatMessage({ id: "page-title-staffs" })}</h1>
          <div className="flex-auto" />
          <div
            className="i-mdi-account-plus c-nord-frost-3 text-5 cursor-pointer"
            title="assign-staff"
          />
        </div>
        <div className="flex-auto relative bg-nord-snow-2 bg-op-70">
          {!selectedProject ? <StaffColumnPlaceholder type="disable" /> : null}
          {selectedProject && loadingStaffs ? <LoadingLayer /> : null}
          {selectedProject && !loadingStaffs && staffs.length === 0 ? (
            <StaffColumnPlaceholder type="empty" />
          ) : (
            staffs.map((staff) => (
              <StaffItem key={staff.id} onClick={handleClickStaff} staff={staff} />
            ))
          )}
        </div>
      </section>
      <div className="flex-auto bg-nord-snow-2 bg-op-70">{/* flow chart */}</div>
      <CreateProjectDrawer
        open={openCreateProjectForm}
        onClose={handleCreateProjectFormClose}
        onCreateSuccess={refreshProjects}
      />
    </section>
  );
}
