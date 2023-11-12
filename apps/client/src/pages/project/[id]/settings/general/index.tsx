import { Button, Form, Input, message } from "antd";
import ProjectService from "@/services/project";
import { useIntl } from "react-intl";
import useWorkingProject from "@/hooks/useWorkingProject";

export default function ProjectSettingGeneral() {
  const intl = useIntl();
  const { project, setProject } = useWorkingProject();

  async function handleSubmit(e: any) {
    if (!project || !e.name) return;
    const res = await ProjectService.update(project?.id, {
      name: e.name
    });
    if (res.code === 200 && res.data) {
      setProject(res.data);
    } else {
      message.error("更新失败: " + res.msg || "未知错误");
    }
  }

  return (
    <div id="general-setting" className="px-6 my-4 w-120">
      <div id="project-profile">
        <h1>{ intl.formatMessage({ id: "project-profile" })}</h1>
        <Form
          layout="vertical"
          size="large"
          onFinish={handleSubmit}
          initialValues={project}
        >
          <Form.Item name="name" label={intl.formatMessage({ id: "project-name" })}>
            <Input />
          </Form.Item>
          <div className="justify-end flex">
            <Button type="primary" htmlType="submit">{ intl.formatMessage({ id: "save" }) }</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}