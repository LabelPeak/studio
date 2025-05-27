import { z } from "zod";

const createReqSchema = z.object({
  location: z.string(),
  type: z.string(),
  project: z.number()
});

const findAllDataItemByDatasetIdReqSchema = z.object({
  datasetId: z.number(),
  page: z.number(),
  size: z.number()
});

const uploadDataItemsReqSchema = z.object({
  datasetId: z.number(),
  file: z.instanceof(File)
});

const updateAnnotationReqSchema = z.object({
  times: z.number(),
  data: z.string(),
  project: z.number(),
  id: z.number()
});

export const DatasetSchema = {
  createReqSchema,
  findAllDataItemByDatasetIdReqSchema,
  uploadDataItemsReqSchema,
  updateAnnotationReqSchema
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DatasetDto {
  export type CreateDatasetReq = z.infer<typeof createReqSchema>;
  export type FindAllDataItemByDatasetIdReq = z.infer<typeof findAllDataItemByDatasetIdReqSchema>;
  export type UploadDataItemReq = z.infer<typeof uploadDataItemsReqSchema>;
  export type UpdateAnnotationReq = z.infer<typeof updateAnnotationReqSchema>;
}
