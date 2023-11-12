import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { Label } from "@/interfaces/annotation";
import LabelTag from "@/components/LabelTag";
import ProjectService from "@/services/project";
import { useIntl } from "react-intl";
import useWorkingProject from "@/hooks/useWorkingProject";

export default function ProjectSettingPreset() {
  const intl = useIntl();
  const { project, setProject } = useWorkingProject();
  const [presets, setPresets] = useState<Label[]>([]);
  const initialValues = {
    presets: (JSON.parse(project?.presets || "[]") as Label[])
      .map(item => item.name).join("\n")
  };

  useEffect(() => {
    if (project)
      setPresets(JSON.parse(project.presets));
  }, [project]);

  async function handleSave(e: any) {
    const raw: string = e.presets || "";
    const data: Label[] = raw.split("\n").filter(item => item !== "").map((str, index) => ({ name: str, index }));
    if (project){
      const res = await ProjectService.update(project?.id, { presets: JSON.stringify(data) });
      if (res.code === 200 && res.data) {
        setProject(res.data);
      }
    }
  }

  return (
    <div id="labeling-setting" className="px-6 my-4">
      <h1>{ intl.formatMessage({ id: "project-setting-preset" })}</h1>
      <div className="flex">
        <Form
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSave}
        >
          <Form.Item name="presets" label={intl.formatMessage({ id: "project-preset-add" })}>
            <Input.TextArea style={{ width: 400, height: "12.5rem" }} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" htmlType="submit">{intl.formatMessage({id: "save"})}</Button>
          </Form.Item>
        </Form>
        <div>
          <h3 className="my-2 text-4 ml-6">Labels ({ presets.length })</h3>
          <div className="flex flex-col ml-4 gap-2 min-w-28 h-45 of-scroll b-solid b-1 b-color-nord-snow-0 p-2 b-rd-2">
            { presets.map((label) => (
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