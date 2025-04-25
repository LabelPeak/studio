import { Hono } from "hono";

import { superadminMiddleware } from "@/middlewares/auth.middleware.ts";
import { BizException } from "@/utils/exception.ts";
import { createResponse } from "@/utils/response.ts";

import { ProjectSchema } from "./project.dto.ts";
import { projectService } from "./project.service.ts";

const projectRouter = new Hono();

projectRouter.get("/query/:id", async (c) => {
  const parsed = ProjectSchema.findOneByIdReqSchema.safeParse({
    id: Number(c.req.param("id"))
  });

  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await projectService.findOneById(parsed.data);
  return c.json(createResponse(res));
});

projectRouter.get("/all", async (c) => {
  const parsed = ProjectSchema.findAllRequestReqSchema.safeParse({
    page: Number(c.req.query("page")),
    size: Number(c.req.query("size"))
  });

  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await projectService.findAll(parsed.data);
  return c.json(createResponse(res));
});

projectRouter.get("/mine", async (c) => {
  const parsed = ProjectSchema.findMineReqSchema.safeParse({});
  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await projectService.findMine(parsed.data, c.get("authPayload"));
  return c.json(createResponse(res));
});

projectRouter.post("/create", superadminMiddleware, async (c) => {
  const parsed = ProjectSchema.createSingleProjectReqSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await projectService.createSingleProject(parsed.data, c.get("authPayload"));

  // 修改：将 res 用 createResponse 包裹
  return c.json(createResponse(res));
});

projectRouter.patch("/update/:id", superadminMiddleware, async (c) => {
  const parsed = ProjectSchema.updateByIdReqSchema.safeParse({
    id: Number(c.req.param("id")),
    ...(await c.req.json())
  });
  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await projectService.update(parsed.data);
  return c.json(createResponse(res));
});

projectRouter.delete("/delete/:id", superadminMiddleware, async (c) => {
  const parsed = ProjectSchema.deleteByIdReqSchema.safeParse({
    id: Number(c.req.param("id"))
  });
  if (!parsed.success) {
    throw new BizException("invalid_param");
  }

  const res = await projectService.deleteById(parsed.data);
  return c.json(createResponse(res));
});

projectRouter.post("/assign", async (c) => {
  const parsed = ProjectSchema.assignStaffReqSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new BizException("invalid_param");
  }
  const res = await projectService.assignStaff(parsed.data);
  return c.json(createResponse(res));
});

export { projectRouter };
