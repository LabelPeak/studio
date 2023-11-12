import { Select, message } from "antd";
import { Access } from "@/interfaces/project";
import ProjectService from "@/services/project";
import { useIntl } from "react-intl";
import useWorkingProject from "@/hooks/useWorkingProject";

export default function ProjectSettingAccess() {
  const intl = useIntl();
  const { project, setProject } = useWorkingProject();
  const basePermissionsOptions = [
    {
      value: "read",
      label: intl.formatMessage({ id: "read" })
    },
    {
      value: "write",
      label: intl.formatMessage({ id: "write" })
    },
    {
      value: "hidden",
      label: intl.formatMessage({ id: "hidden" })
    },
  ];

  async function handleAccessChange(value: Access) {
    if (project) {
      const res = await ProjectService.update(project.id, { access: value });
      if (res.code === 200 && res.data) {
        setProject(res.data);
      } else {
        message.success("修改失败: " + res.msg || "未知错误");
      }
    }
  }

  return (
    <div id="access-setting" className="px-6 my-4 w-120">
      <div id="base-permissions">
        <h1>{ intl.formatMessage({ id: "base-permissions" })}</h1>
        <p className="text-[.8em]">
          { intl.formatMessage({ id: "base-permissions-intro" })}
        </p>
        <Select
          className="w-30"
          defaultValue={project?.access} options={basePermissionsOptions}
          onChange={handleAccessChange}
          size="large"
        />
      </div>
    </div>
  );
}