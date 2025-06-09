import { Form, Input, message, Modal } from "antd";
import { useState } from "react";

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void>;
}

const MIN_PASSWORD_LENGTH = 8;

export function ChangePasswordModal({ open, onCancel, onOk }: ChangePasswordModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onOk(values);
      form.resetFields();
    } catch (errorInfo) {
      console.log("表单校验失败:", errorInfo);
      message.error("请检查输入项！"); // 可以在这里给出统一的错误提示
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="修改密码"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="changePasswordForm">
        <Form.Item
          name="oldPassword"
          label="原密码"
          rules={[{ required: true, message: "请输入原密码!" }]}
        >
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: "请输入新密码!" },
            { min: MIN_PASSWORD_LENGTH, message: `密码长度至少为 ${MIN_PASSWORD_LENGTH} 位!` }
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请输入新密码（至少6位）" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="确认新密码"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "请再次输入新密码!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致!"));
              }
            })
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
