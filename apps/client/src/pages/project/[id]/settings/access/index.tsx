import { message, Select } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { useProject } from "@/hooks/use-project";
import { Access } from "@/interfaces/project";
import ProjectService from "@/services/project";

export default function ProjectSettingAccess() {
  const { id: projectId = "" } = useParams();
  const { project, refreshProject } = useProject(parseInt(projectId));

  const intl = useIntl();
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
    }
  ];

  async function handleAccessChange(value: Access) {
    try {
      await ProjectService.update(project.id, { access: value });
      refreshProject();
    } catch (e) {
      if (e instanceof Error) {
        message.error("修改失败: " + e.message);
      }
    }
  }

  return (
    <div id="access-setting" className="px-6 my-4 w-120">
      <div id="base-permissions">
        <h1>{intl.formatMessage({ id: "base-permissions" })}</h1>
        <p className="text-[.8em]">{intl.formatMessage({ id: "base-permissions-intro" })}</p>
        <Select
          className="w-30"
          defaultValue={project.access}
          options={basePermissionsOptions}
          onChange={handleAccessChange}
          size="large"
        />
      </div>
    </div>
  );
}
