import { request } from "../request";

interface ILoginProps {
  username: string;
  password: string;
}

function login(props: ILoginProps) {
  return request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(props)
  });
}

const AuthService = {
  login
};

export default AuthService;