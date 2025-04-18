import { Hono } from "hono";

import { BizException } from "@/utils/exception.ts";

import { UserSchema } from "./staff.dto.ts";
import { userService } from "./staff.service.ts";

const staffRouter = new Hono();

staffRouter.get("/", async (c) => {
  const res = await userService.findOneById(2);
  return c.json(res);
});

staffRouter.get("/all", async (c) => {
  const parsed = UserSchema.findAllRequestReqSchema.safeParse({
    page: Number(c.req.query("page")),
    size: Number(c.req.query("size"))
  });
  if (parsed.success === false) {
    throw new BizException("invalid_param");
  }

  const res = await userService.findAll(parsed.data, 1);
  return c.json(res);
});

staffRouter.get("/project/:id", async (c) => {
  const parsed = UserSchema.findAllByProjectReqSchema.safeParse({
    projectId: Number(c.req.param("id")),
    page: Number(c.req.query("page")),
    size: Number(c.req.query("size"))
  });
  if (parsed.success === false) {
    throw new BizException("invalid_param");
  }

  const res = await userService.findAllByProject(parsed.data, 1);
  return c.json(res);
});

staffRouter.post("/", async (c) => {
  const parsed = UserSchema.createSingleStaffReqSchema.safeParse(await c.req.json());
  if (parsed.success === false) {
    throw new BizException("invalid_param");
  }

  const res = await userService.createSingleStaff(parsed.data);
  return c.json(res);
});

staffRouter.patch("/:id", async (c) => {
  const parsed = UserSchema.updateStaffReqSchema.safeParse({
    staffId: Number(c.req.param("id"))
  });
  if (parsed.success === false) {
    throw new BizException("invalid_param");
  }

  const res = await userService.updateStaff(parsed.data);
  return c.json(res);
});

staffRouter.delete("/:id", async (c) => {
  const parsed = UserSchema.deleteStaffReqSchema.safeParse({
    staffId: Number(c.req.param("id"))
  });
  if (parsed.success === false) {
    throw new BizException("invalid_param");
  }
  const res = await userService.deleteStaffById(parsed.data);
  return c.json(res);
});

staffRouter.get("/search", async (c) => {
  const parsed = UserSchema.searchStaffsReqSchema.safeParse({
    token: c.req.query("token"),
    size: Number(c.req.query("size")),
    page: Number(c.req.query("page"))
  });
  if (parsed.success === false) {
    console.error(parsed.error);
    throw new BizException("invalid_param");
  }

  const res = await userService.searchStaffs(parsed.data);
  return c.json(res);
});

export { staffRouter };
