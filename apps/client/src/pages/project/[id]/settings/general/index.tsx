import { Button, Form, Input, message } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { useProject } from "@/hooks/use-project";
import ProjectService from "@/services/project";

export default function ProjectSettingGeneral() {
  const { id: projectId = "" } = useParams();
  const { project, refreshProject } = useProject(parseInt(projectId));
  const intl = useIntl();

  async function handleSubmit(e: any) {
    try {
      await ProjectService.update(project.id, {
        name: e.name
      });
      refreshProject();
    } catch (err) {
      if (err instanceof Error) {
        message.error("更新失败: " + err.message);
      }
    }
  }

  return (
    <div id="general-setting" className="px-6 my-4 w-120">
      <div id="project-profile">
        <h1>{intl.formatMessage({ id: "project-profile" })}</h1>
        <Form layout="vertical" size="large" onFinish={handleSubmit} initialValues={project}>
          <Form.Item name="name" label={intl.formatMessage({ id: "project-name" })}>
            <Input />
          </Form.Item>
          <div className="justify-end flex">
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: "save" })}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
