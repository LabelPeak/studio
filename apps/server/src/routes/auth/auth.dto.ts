import { z } from "zod";

const loginReqSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const AuthSchema = {
  loginReqSchema
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthDto {
  export type LoginReq = z.infer<typeof loginReqSchema>;
}
