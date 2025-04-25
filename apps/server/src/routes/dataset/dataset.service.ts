import { db } from "@/db/connection.ts";
import { datasetTable } from "@/db/schema.ts";

import type { DatasetDto } from "./dataset.dto.ts";

async function createDataset(dto: DatasetDto.CreateDatasetReq) {
  const [dataset] = await db
    .insert(datasetTable)
    .values([
      {
        location: dto.location,
        type: dto.type,
        project: dto.project
      }
    ])
    .returning();

  return dataset;
}

export const datasetService = {
  createDataset
};
