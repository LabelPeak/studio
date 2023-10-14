import { Button, Form, Input } from "antd";

export default function LoginForm() {
  return (
    <Form name="login" style={{ width: "360px" }} size="large">
      <Form.Item name="username">
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item >
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}