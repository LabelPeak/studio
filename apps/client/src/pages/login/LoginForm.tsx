import { Button, Form, Input } from "antd";
import { type IntlShape } from "react-intl";

interface IProps {
  intl: IntlShape
}

export default function LoginForm(props: IProps) {
  const { intl } = props;

  return (
    <Form name="login" style={{ width: "360px" }} size="large">
      <Form.Item name="username">
        <Input placeholder={ intl.formatMessage({id: "username-prompt"})}/>
      </Form.Item>
      <Form.Item name="password">
        <Input.Password
          placeholder={ intl.formatMessage({id: "password-prompt"})}
          autoComplete="on"
        />
      </Form.Item>
      <Form.Item >
        <Button type="primary" htmlType="submit" block>
          { intl.formatMessage({ id: "login" })}
        </Button>
      </Form.Item>
    </Form>
  );
}