import { Button, Form, Input } from "antd";
import AuthService from "@/services/Auth";
import { type IntlShape } from "react-intl";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface IProps {
  intl: IntlShape
}

export default function LoginForm(props: IProps) {
  const { intl } = props;
  const { setAuthConfig } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: {username: string, password: string}) {
    const { username, password } = e;
    const res = await AuthService.login({ username, password });
    if (res.data) {
      const { token } = res.data;
      setAuthConfig({ token });
      navigate("/dashboard");
    }
  }

  return (
    <Form
      name="login"
      style={{ width: "360px" }}
      size="large"
      onFinish={handleLogin}
    >
      <Form.Item name="username">
        <Input placeholder={ intl.formatMessage({id: "username-prompt"})}/>
      </Form.Item>
      <Form.Item name="password">
        <Input.Password
          placeholder={ intl.formatMessage({id: "password-prompt"})}
          autoComplete="on"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          { intl.formatMessage({ id: "login" })}
        </Button>
      </Form.Item>
    </Form>
  );
}