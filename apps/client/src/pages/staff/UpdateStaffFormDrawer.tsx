import { Button, Col, Drawer, Form, Input, Row, Space, message } from "antd";
import { useEffect, useRef } from "react";
import AdminService from "@/services/admin/staff";
import type { FormInstance } from "antd/es/form";
import { User } from "@/interfaces/user";
import { useIntl } from "react-intl";

interface IProps {
  open: boolean;
  defaultValue: User | undefined;
  onClose: (shouldUpdate: boolean) => void;
}

export default function UpdateStaffFormDrawer(props: IProps) {
  const { open, defaultValue } = props;
  const formRef = useRef<FormInstance>(null);
  const intl = useIntl();

  async function handSubmit() {
    const id = parseInt(formRef.current!.getFieldValue("id"));
    const realname = formRef.current!.getFieldValue("realname");
    const password = formRef.current!.getFieldValue("password");

    if (realname || password) {
      const res = await AdminService.updateStaff({ id, realname, password });
      if (res.code == 200) {
        message.success("更新成功");
        handleClose(true);
      } else {
        message.error("更新失败: " + res.msg || "未知错误");
      }
    }
  }

  function handleClose(shouldUpdate: boolean = false) {
    formRef.current?.resetFields();
    props.onClose?.(shouldUpdate);
  }

  useEffect(() => {
    if (open === true) {
      formRef.current?.setFieldsValue(defaultValue);
    }
  }, [open]);

  return (
    <Drawer
      title={intl.formatMessage({ id: "update-staff-account"})}
      width={600}
      onClose={() => handleClose()}
      open={open}
      styles={{
        body: {
          paddingBottom: 80
        }
      }}
      extra={
        <Space>
          <Button onClick={() => handleClose()}>
            { intl.formatMessage({ id: "close" })}
          </Button>
          <Button onClick={handSubmit} type="primary">
            { intl.formatMessage({ id: "submit" })}
          </Button>
        </Space>
      }
    >
      { defaultValue && <Form
        layout="vertical"
        ref={formRef}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="id"
              label={intl.formatMessage({ id: "id-prompt" })}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="username"
              label={intl.formatMessage({ id: "username-prompt" })}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="realname"
              label={intl.formatMessage({ id: "realname-prompt" })}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label={intl.formatMessage({ id: "password-prompt" })}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form> }
    </Drawer>
  );
}