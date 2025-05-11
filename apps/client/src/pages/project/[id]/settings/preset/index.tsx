import { Button, Form, Input, message } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import LabelTag from "@/components/LabelTag";
import { useProject } from "@/hooks/use-project";
import { Label } from "@/interfaces/annotation";
import ProjectService from "@/services/project";

export default function ProjectSettingPreset() {
  const { id: projectId = "" } = useParams();
  const { project, refreshProject } = useProject(parseInt(projectId));

  const intl = useIntl();
  const initialValues = {
    presets: project.presets.map((item) => item.name).join("\n")
  };

  async function handleSave(e: any) {
    const raw: string = e.presets || "";
    const data: Label[] = raw
      .split("\n")
      .filter((item) => item !== "")
      .map((str, index) => ({ name: str, index }));
    try {
      await ProjectService.update(project.id, { presets: JSON.stringify(data) });
      refreshProject();
    } catch (err) {
      if (err instanceof Error) {
        message.error("修改失败: " + err.message);
      }
    }
  }

  return (
    <div id="labeling-setting" className="px-6 my-4">
      <h1>{intl.formatMessage({ id: "project-setting-preset" })}</h1>
      <div className="flex">
        <Form layout="vertical" initialValues={initialValues} onFinish={handleSave}>
          <Form.Item
            name="presets"
            label={`${intl.formatMessage({ id: "project-preset-edit" })}
          (${intl.formatMessage({ id: "project-preset-edit-tips" })})
            `}
          >
            <Input.TextArea style={{ width: 400, height: "12.5rem" }} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" htmlType="submit">
              {intl.formatMessage({ id: "save" })}
            </Button>
          </Form.Item>
        </Form>
        <div>
          <h3 className="my-2 text-4 ml-6">Labels ({project.presets.length})</h3>
          <div className="flex flex-col ml-4 gap-2 min-w-28 h-45 of-auto b-solid b-1 b-color-nord-snow-0 p-2 b-rd-2">
            {project.presets.map((label) => (
              <div key={label.index}>
                <LabelTag name={label.name} index={label.index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
