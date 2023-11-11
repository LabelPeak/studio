import { Project, Role } from "@/interfaces/project";
import { useRef, useState } from "react";
import LoadingLayer from "@/components/LoadingLayer";
import ProjectColumnPlaceholder from "./ProjectColumnPlaceHolder";
import ProjectItem from "./ProjectItem";
import ProjectService from "@/services/project";
import StaffColumnPlaceholder from "./StaffColumnPlaceholder";
import StaffItem from "./StaffItem";
import StaffService from "@/services/staff";
import { User } from "@/interfaces/user";
import { message } from "antd";
import { useIntl } from "react-intl";
import { useRequest } from "ahooks";

export function DashboardPage() {
  const intl = useIntl();
  const projectPaginationRef = useRef({ page: 1, size: 10 });
  const staffPaginationRef = useRef({ page: 1, size: 10 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setTotalProjects] = useState(0);
  const [staffs, setStaffs] = useState<Array<User & { role: Role }>>([]);
  const [, setTotalStaffs] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project>();

  const {
    loading: loadingProjects,
    run: findAllProjects
  } = useRequest(ProjectService.findAll, {
    defaultParams: [{ ...projectPaginationRef.current }],
    onSuccess: (res) => {
      if (res.data !== undefined && res.code === 200) {
        setProjects(res.data.list);
        setTotalProjects(res.data.total);
      }
    }
  });

  const {
    loading: loadingStaffs,
    run: findAllStaffsInProject
  } = useRequest(StaffService.findAllInProject, {
    manual: true,
    onSuccess: (res) => {
      if (res.data !== undefined && res.code === 200) {
        setStaffs(res.data.list);
        setTotalStaffs(res.data.total);
      }
    }
  });

  function handleClickProject(project: Project) {
    setSelectedProject(project);
    staffPaginationRef.current.page = 1;
    findAllStaffsInProject({
      project: project.id,
      ...staffPaginationRef.current
    });
  }

  async function handleDeleteProject(id: number) {
    const res = await ProjectService.remove(id);
    if (res.code === 200) {
      message.success("删除成功");
      projectPaginationRef.current.page = 1;
      findAllProjects(projectPaginationRef.current);
      setSelectedProject(undefined);
    } else {
      message.error("删除失败: " + res.msg || "未知错误");
    }
  }

  function handleClickStaff(staff: User & { role: Role }) {
    console.log(staff);
  }

  return (
    <section
      id="dashboard-page"
      className="h-full flex bg-white"
    >
      <section className="w-xs b-r-1- b-r-solid b-color-nord-snow-0 flex flex-col">
        <div className="flex b-b-1 b-b-solid b-color-nord-snow-0 items-center p-4">
          <h1 className="m-0 text-4">{ intl.formatMessage({ id: "page-title-projects" })}</h1>
          <div className="flex-auto" />
          <div className="i-mdi-folder-plus c-nord-frost-3 text-5 cursor-pointer" title="add-project" />
        </div>
        <div className="flex-auto relative of-auto bg-nord-snow-2 bg-op-70">
          { loadingProjects
            ? <LoadingLayer />
            : projects.length === 0
              ? <ProjectColumnPlaceholder type="empty" />
              : projects.map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  onClick={handleClickProject}
                  onDelete={handleDeleteProject}
                  selectedId={selectedProject?.id}
                />
              ))}
        </div>
      </section>
      <section className="w-xs b-r-1- b-r-solid b-color-nord-snow-0 flex flex-col">
        <div className="flex b-b-1 b-b-solid b-color-nord-snow-0 items-center p-4">
          <h1 className="m-0 text-4">{ intl.formatMessage({ id: "page-title-staffs" })}</h1>
          <div className="flex-auto" />
          <div className="i-mdi-account-plus c-nord-frost-3 text-5 cursor-pointer" title="assign-staff" />
        </div>
        <div className="flex-auto relative bg-nord-snow-2 bg-op-70">
          { selectedProject
            ? loadingStaffs
              ? <LoadingLayer />
              : staffs.length === 0
                ? <StaffColumnPlaceholder type="empty" />
                : staffs.map(staff => (
                  <StaffItem
                    key={staff.id} onClick={handleClickStaff}
                    staff={staff}
                  />
                ))
            : <StaffColumnPlaceholder type="disable" />
          }
        </div>
      </section>
      <div className="flex-auto bg-nord-snow-2 bg-op-70">
      </div>
    </section>
  );
}