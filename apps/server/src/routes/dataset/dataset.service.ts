import { eq } from "drizzle-orm";

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
async function findAllDataItemByDatasetId(dto: DatasetDto.FindAllDataItemByDatasetIdReq) {
  const list = await db.query.dataItemTable.findMany({
    where: (_table) => eq(_table.dataset, dto.datasetId),
    limit: dto.size,
    offset: (dto.page - 1) * dto.size
  });

  const total = await db.$count(datasetTable, eq(datasetTable.id, dto.datasetId));

  return {
    list,
    total
  };
}

export const datasetService = {
  createDataset,
  findAllDataItemByDatasetId
};
