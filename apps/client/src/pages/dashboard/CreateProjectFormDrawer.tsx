import { Button, Drawer, Form, FormInstance, Input, Select, message } from "antd";
import { Access } from "@/interfaces/project";
import { DataType } from "@/interfaces/dataset";
import DebounceSelect from "@/components/DebounceSelect";
import ProjectService from "@/services/project";
import StaffService from "@/services/staff";
import { useIntl } from "react-intl";
import { useRef } from "react";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectDrawer(props: IProps) {
  const { open, onClose } = props;
  const intl = useIntl();
  const formRef = useRef<FormInstance>(null);

  async function fetchStaffs(token: string) {
    const res = await StaffService.search({ token, page: 1, size: 10});
    const temp = (res.data?.list || []).map(item => ({
      label: `${item.realname} ${item.username}`,
      value: item.id!
    }));
    return temp;
  }

  function handleClose() {
    if (formRef.current) {
      formRef.current.resetFields();
    }
    onClose();
  }

  async function handleSubmit() {
    try {
      const data = await formRef.current?.validateFields();
      const res = await ProjectService.create({
        name: data.name,
        access: data.access,
        type: data.type,
        admin: data.admin.value
      });
      if (res.code === 200) {
        message.success("创建成功");
        handleClose();
      } else {
        message.error("创建失败: " + res.msg || "未知错误");
      }
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: "project-create" })}
      width={400}
      onClose={handleClose}
      open={open}
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={handleSubmit}
        initialValues={{
          access: "write",
          type: "info-extract"
        }}>
        <Form.Item label={intl.formatMessage({ id: "project-name" })} name="name" rules={[{ required: true }]}>
          <Input placeholder="输入项目名称" />
        </Form.Item>
        <Form.Item label={intl.formatMessage({id: "project-access-prompt"})} name="access" required>
          <Select
            options={
              Object.values(Access)
                .map(access => ({
                  value: access,
                  label: intl.formatMessage({ id: access })
                }))
            }
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({id: "project-datatype-prompt"})} name="type" required>
          <Select
            options={
              Object.values(DataType)
                .map(type => ({
                  value: type,
                  label: intl.formatMessage({ id: type })
                }))
            }
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: "role-admin" })} name="admin" rules={[{ required: true }]}>
          <DebounceSelect
            placeholder={intl.formatMessage({ id: "staffs-search-prompt" })}
            fetchOptions={fetchStaffs}
          />
        </Form.Item>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">{ intl.formatMessage({ id: "create" })}</Button>
        </div>
      </Form>
    </Drawer>
  );
}