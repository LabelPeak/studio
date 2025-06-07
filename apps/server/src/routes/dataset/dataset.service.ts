import { and, eq } from "drizzle-orm";
import type { ContextVariableMap } from "hono";
import { nanoid } from "nanoid";

import { db } from "@/db/connection.ts";
import { dataItemTable, datasetTable } from "@/db/schema.ts";
import { BizException } from "@/utils/exception.ts";
import { storeFile } from "@/utils/minio.ts";

import { PROJECT_ROLE } from "../project/project.entity.ts";
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

async function uploadDataItems(
  dto: DatasetDto.UploadDataItemReq,
  authPayload: ContextVariableMap["authPayload"]
) {
  const { operatorId } = authPayload;

  const dataset = await db.query.datasetTable.findFirst({
    where: (_table) => eq(_table.id, dto.datasetId)
  });

  const projectId = dataset?.project;
  if (!projectId) {
    throw new BizException("dataset_not_found");
  }

  const relation = await db.query.usersToProjects.findFirst({
    where: (_table) => and(eq(_table.user, operatorId), eq(_table.project, projectId))
  });
  if (relation?.role !== PROJECT_ROLE.ADMIN) {
    throw new BizException("permission_denied");
  }

  try {
    const fileName = `${nanoid(32)}.${dto.file.name.split(".").pop()}`;
    const fileURL = await storeFile(dto.file, fileName);
    await db.insert(dataItemTable).values([
      {
        annotation: "[]",
        file: fileURL,
        dataset: dto.datasetId,
        reannotation: "[]",
        feedback: "",
        approved: false,
        updateAt: new Date()
      }
    ]);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw new BizException(err.message, 500);
    }
  }
  return null;
}

async function updateAnnotation(
  dto: DatasetDto.UpdateAnnotationReq,
  authPayload: ContextVariableMap["authPayload"]
) {
  const { operatorId } = authPayload;
  const relation = await db.query.usersToProjects.findFirst({
    where: (_table) => and(eq(_table.user, operatorId), eq(_table.project, dto.project))
  });

  if (relation?.role !== PROJECT_ROLE.ADMIN && relation?.role !== PROJECT_ROLE.ANNOTATOR) {
    throw new BizException("permission_denied");
  }

  if (dto.times === 1) {
    await db
      .update(dataItemTable)
      .set({
        annotation: dto.data,
        updateAt: new Date()
      })
      .where(eq(dataItemTable.id, dto.id));
  } else {
    await db
      .update(dataItemTable)
      .set({
        reannotation: dto.data,
        updateAt: new Date()
      })
      .where(eq(dataItemTable.id, dto.id));
  }

  return null;
}

/**
 * Only use for inngest to update pre-annotation
 */
async function updatePreAnnotation(dto: DatasetDto.UpdatePreAnnotationReq) {
  // const project = await db.query.projectTable.findFirst({
  // where: (_table) => and(eq(_table.id, dto.project))
  // });

  // if (
  // last(project?.statusHistory as ProjectStatusRecord[])?.status !== PROJECT_STATUS.PRE_ANNOTATING
  // ) {
  // throw new BizException("invalid_status");
  // }

  await db
    .update(dataItemTable)
    .set({
      annotation: dto.data,
      updateAt: new Date()
    })
    .where(eq(dataItemTable.id, dto.id));

  return null;
}

export const datasetService = {
  createDataset,
  findAllDataItemByDatasetId,
  uploadDataItems,
  updateAnnotation,
  updatePreAnnotation
};
