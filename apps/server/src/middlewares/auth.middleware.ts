import { createMiddleware } from "hono/factory";

import { userService } from "@/routes/staff/staff.service.ts";
import { BizException } from "@/utils/exception.ts";

interface AuthPayload {
  id?: number;
  exp?: number;
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const payload: AuthPayload = await c.get("jwtPayload");

  if (!payload.exp || payload.exp < Date.now() / 1000) {
    throw new BizException("token_expired", 401);
  }

  if (payload.id) {
    try {
      const staff = await userService.findOneById({ id: payload.id });
      c.set("authPayload", {
        operatorId: payload.id,
        operatorIsSuperAdmin: Boolean(staff.superadmin)
      });
      await next();
      return;
    } catch {
      throw new BizException("invalid_token", 401);
    }
  }
  throw new BizException("invalid_token", 401);
});

export const superadminMiddleware = createMiddleware(async (c, next) => {
  const isSuperadmin = c.get("operatorIsSuperAdmin");

  if (isSuperadmin === false) {
    throw new BizException("permission_denied", 403);
  }
  await next();
});
