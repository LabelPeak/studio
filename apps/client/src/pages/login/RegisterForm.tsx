import { Button, Form, Input } from "antd";

export default function RegisterForm() {
  return (
    <Form name="register" style={{ width: "360px" }} size="large">
      <Form.Item name="username">
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item name="confirm-password">
        <Input.Password placeholder="Confirm password" />
      </Form.Item>
      <Form.Item >
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}