import { Hono } from "hono";

import { BizException } from "@/utils/exception.ts";

import { AuthSchema } from "./auth.dto.ts";
import { authService } from "./auth.service.ts";

const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  const parsed = AuthSchema.loginReqSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await authService.login(parsed.data);
  return c.json(res);
});

export { authRouter };
