import { z } from "zod";

const createSchema = z.object({
  location: z.string(),
  type: z.string(),
  project: z.number()
});

const findAllDataItemByDatasetIdSchema = z.object({
  datasetId: z.number(),
  page: z.number(),
  size: z.number()
});

const uploadDataItemsSchema = z.object({
  datasetId: z.number(),
  file: z.instanceof(File)
});

export const DatasetSchema = {
  createSchema,
  findAllDataItemByDatasetIdSchema,
  uploadDataItemsSchema
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DatasetDto {
  export type CreateDatasetReq = z.infer<typeof createSchema>;
  export type FindAllDataItemByDatasetIdReq = z.infer<typeof findAllDataItemByDatasetIdSchema>;
  export type UploadDataItemReq = z.infer<typeof uploadDataItemsSchema>;
}
