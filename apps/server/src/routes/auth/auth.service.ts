import { compare } from "bcrypt-ts";
import { sign } from "hono/jwt";

import { db } from "@/db/connection.ts";
import { BizException } from "@/utils/exception.ts";

import type { AuthDto } from "./auth.dto.ts";

const ONE_DAY = 60 * 60 * 24;

async function login(dto: AuthDto.LoginReq) {
  const { username, password } = dto;
  const staff = await db.query.userTable.findFirst({
    where: (_userTable, { eq }) => eq(_userTable.username, username)
  });

  if (!staff || !compare(staff.password, password)) {
    throw new BizException("用户名或密码错误");
  }

  const payload = {
    id: staff.id,
    exp: Math.floor(Date.now() / 1000) + ONE_DAY * 7
  };

  const token = await sign(payload, String(process.env.JWT_SECRET));

  return {
    token
  };
}

export const authService = {
  login
};
