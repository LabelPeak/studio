import { Button, Form, Input } from "antd";
import ProjectSettingContext from "../ProjectSettingContext";
import { useContext } from "react";
import { useIntl } from "react-intl";

export default function ProjectSettingGeneral() {
  const intl = useIntl();
  const { project } = useContext(ProjectSettingContext);

  return (
    <div id="general-setting" className="px-6 my-4 w-120">
      <Form layout="vertical" size="large">
        <Form.Item label={intl.formatMessage({ id: "project-name" })}>
          <Input defaultValue={project?.name} />
        </Form.Item>
        <div className="justify-end flex">
          <Button type="primary">{ intl.formatMessage({ id: "save" }) }</Button>
        </div>
      </Form>
    </div>
  );
}