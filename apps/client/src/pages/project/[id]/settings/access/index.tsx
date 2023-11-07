import ProjectSettingContext from "../ProjectSettingContext";
import { Select } from "antd";
import { useContext } from "react";
import { useIntl } from "react-intl";

export default function ProjectSettingAccess() {
  const intl = useIntl();
  const { project } = useContext(ProjectSettingContext);
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
          size="large"
        />
      </div>
    </div>
  );
}