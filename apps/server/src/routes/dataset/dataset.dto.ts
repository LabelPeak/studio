import { z } from "zod";

const createSchema = z.object({
  location: z.string(),
  type: z.string(),
  project: z.number()
});

export const DatasetSchema = {
  createSchema
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DatasetDto {
  export type CreateDatasetReq = z.infer<typeof createSchema>;
}
