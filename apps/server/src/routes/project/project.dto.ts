import { PROJECT_STATUS } from "shared";
import { z } from "zod";

import { convertConstToZodEnum } from "@/utils/zod.ts";

const findOneByIdReqSchema = z.object({
  id: z.number()
});

const findAllRequestReqSchema = z.object({
  page: z.number(),
  size: z.number()
});

const findMineReqSchema = z.object({});

const deleteByIdReqSchema = z.object({
  id: z.number()
});

const createSingleProjectReqSchema = z.object({
  name: z.string(),
  admin: z.number(),
  access: z.string(),
  type: z.string()
});

const updateByIdReqSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  access: z.string().optional(),
  presets: z.string().optional()
});

const assignStaffReqSchema = z.object({
  user: z.number(),
  project: z.number(),
  role: z.string()
});

const pushStatusHistoryReqSchema = z.object({
  projectId: z.number(),
  record: z.object({
    status: convertConstToZodEnum(PROJECT_STATUS),
    trigger: z.string().optional()
  })
});

export const ProjectSchema = {
  findOneByIdReqSchema,
  findAllRequestReqSchema,
  findMineReqSchema,
  deleteByIdReqSchema,
  createSingleProjectReqSchema,
  updateByIdReqSchema,
  assignStaffReqSchema,
  pushStatusHistoryReqSchema
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProjectDto {
  export type FindOneByIdReq = z.infer<typeof findOneByIdReqSchema>;
  export type FindAllReq = z.infer<typeof findAllRequestReqSchema>;
  export type FindMineReq = z.infer<typeof findMineReqSchema>;
  export type DeleteByIdReq = z.infer<typeof deleteByIdReqSchema>;
  export type CreateSingleProjectReq = z.infer<typeof createSingleProjectReqSchema>;
  export type UpdateByIdReq = z.infer<typeof updateByIdReqSchema>;
  export type AssignStaffReq = z.infer<typeof assignStaffReqSchema>;
  export type PushStatusHistoryReq = z.infer<typeof pushStatusHistoryReqSchema>;
}
