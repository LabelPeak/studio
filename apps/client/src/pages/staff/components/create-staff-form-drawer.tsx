import {
  Alert,
  Button,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  Typography
} from "antd";
import type { FormInstance } from "antd/es/form";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";

import { User } from "@/interfaces/user";
import StaffService from "@/services/staff";

interface IProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateStaffFormDrawer(props: IProps) {
  const { open, onClose } = props;
  const [result, setResult] = useState<User & { password: string }>();
  const formRef = useRef<FormInstance>(null);
  const intl = useIntl();

  async function handSubmit() {
    if (!formRef.current) {
      return;
    }

    const realname = formRef.current.getFieldValue("realname");
    if (realname) {
      const res = await StaffService.create({ realname });
      setResult(res);
    }
  }

  function handleReset() {
    formRef.current?.resetFields();
    setResult(undefined);
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: "new-staff-account" })}
      width={600}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80
        }
      }}
      extra={
        <Space>
          <Button onClick={onClose}>{intl.formatMessage({ id: "close" })}</Button>
          {result != undefined ? (
            <Button onClick={handleReset} type="primary">
              {intl.formatMessage({ id: "reset" })}
            </Button>
          ) : (
            <Button onClick={handSubmit} type="primary">
              {intl.formatMessage({ id: "submit" })}
            </Button>
          )}
        </Space>
      }
    >
      <Form layout="vertical" ref={formRef}>
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
        </Row>
      </Form>
      <Divider orientation="left">{intl.formatMessage({ id: "result" })}</Divider>
      {result ? (
        <>
          <Descriptions bordered column={2} size="small" layout="vertical">
            <Descriptions.Item label={intl.formatMessage({ id: "id-prompt" })}>
              {result.id}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: "realname-prompt" })}>
              {result.realname}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: "username-prompt" })}>
              <Typography.Text copyable>{result.username}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: "password-prompt" })}>
              <Typography.Text copyable>{result.password}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>
          <Alert
            type="warning"
            style={{ marginTop: "2em" }}
            message={intl.formatMessage({ id: "new-staff-username-save-tip" })}
            showIcon
          />
        </>
      ) : (
        <div className="text-center">
          <p>{intl.formatMessage({ id: "new-staff-auto-generate-tip" })}</p>
          <p>{intl.formatMessage({ id: "new-staff-operation-tip" })}</p>
        </div>
      )}
    </Drawer>
  );
}
