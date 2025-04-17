import { z } from "zod";

const findOneByIdReqSchema = z.object({
  id: z.number(),
});

const findAllRequestReqSchema = z.object({
  page: z.number(),
  size: z.number(),
});

const findAllByProjectReqSchema = z.object({
  projectId: z.number(),
  page: z.number(),
  size: z.number(),
})

const createSingleStaffReqSchema = z.object({
  realname: z.string(),
})

const updateStaffReqSchema = z.object({
  password: z.string(),
  realname: z.string(),
  staffId: z.number(),
})

const deleteStaffReqSchema = z.object({
  staffId: z.number(),
})

const searchStaffsReqSchema = z.object({
  token: z.string(),
  page: z.number(),
  size: z.number(),
})

export const UserSchema = {
  findAllByProjectReqSchema,
  findAllRequestReqSchema,
  findOneByIdReqSchema,
  createSingleStaffReqSchema,
  updateStaffReqSchema,
  deleteStaffReqSchema,
  searchStaffsReqSchema
}

export namespace UserDto {
  export type FindOneByIdReq = z.infer<typeof findOneByIdReqSchema>;
  export type FindAllReq = z.infer<typeof findAllRequestReqSchema>;
  export type FindAllByProjectReq = z.infer<typeof findAllByProjectReqSchema>;
  export type CreateSingleStaffReq = z.infer<typeof createSingleStaffReqSchema>;
  export type UpdateStaffReq = z.infer<typeof updateStaffReqSchema>;
  export type DeleteStaffReq = z.infer<typeof deleteStaffReqSchema>;
  export type SearchStaffsReq = z.infer<typeof searchStaffsReqSchema>;
}