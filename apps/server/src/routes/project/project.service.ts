import { and, eq } from "drizzle-orm";
import type { ContextVariableMap } from "hono";
import { mimes } from "hono/utils/mime";
import { last, omit } from "remeda";
import { isStatusBefore, type Label, PROJECT_STATUS, type ProjectStatusRecord } from "shared";
import { appendProjectStatusHistory, composeProjectStatus } from "shared";

import { db } from "@/db/connection.ts";
import { projectTable, usersToProjects } from "@/db/schema.ts";
import { BizException } from "@/utils/exception.ts";
import { inngest } from "@/utils/inngest.ts";
import { storeFileFromBuffer } from "@/utils/minio.ts";
import type { BasicReleaseLoader } from "@/utils/release-loader/basic.ts";
import { CocoReleaseLoader } from "@/utils/release-loader/coco.ts";
import { YoloReleaseLoader } from "@/utils/release-loader/yolo.ts";

import { datasetService } from "../dataset/dataset.service.ts";
import type { ProjectDto } from "./project.dto.ts";
import { PROJECT_ROLE } from "./project.entity.ts";

async function findOneById(
  dto: ProjectDto.FindOneByIdReq,
  authPayload: ContextVariableMap["authPayload"]
) {
  const operatorId = authPayload.operatorId;

  const relation = await db.query.usersToProjects.findFirst({
    where: (_table) => and(eq(_table.user, operatorId), eq(_table.project, dto.id)),
    with: {
      project: {
        with: {
          dataset: true
        }
      }
    }
  });

  return relation;
}

async function findAll(dto: ProjectDto.FindAllReq) {
  const list = await db.query.projectTable.findMany({
    limit: dto.size,
    offset: (dto.page - 1) * dto.size,
    with: {
      admin: true
    }
  });

  const total = await db.$count(projectTable);

  return {
    list,
    total
  };
}

async function findMine(_: ProjectDto.FindMineReq, authPayload: ContextVariableMap["authPayload"]) {
  const { operatorId } = authPayload;

  const list = await db.query.usersToProjects.findMany({
    where: (_usersToProjects) => eq(_usersToProjects.user, operatorId),
    with: {
      project: {
        with: {
          admin: {
            columns: {
              username: false,
              password: false,
              superadmin: false
            }
          }
        },
        columns: {
          presets: false
        }
      }
    }
  });

  return list;
}

async function createSingleProject(dto: ProjectDto.CreateSingleProjectReq) {
  const admin = await db.query.userTable.findFirst({
    where: (_userTable) => eq(_userTable.id, dto.admin)
  });

  if (admin === undefined) {
    throw new BizException("admin_not_found");
  }

  const [project] = await db
    .insert(projectTable)
    .values([
      {
        name: dto.name,
        admin: admin.id,
        access: dto.access,
        createAt: new Date(),
        presets: "[]",
        statusHistory: appendProjectStatusHistory(
          composeProjectStatus(PROJECT_STATUS.PENDING, admin.username),
          []
        )
      }
    ])
    .returning();

  await db.insert(usersToProjects).values([
    {
      role: "admin",
      user: admin.id,
      project: project.id
    }
  ]);

  // TODO: 返回值添加 dataset 信息
  await datasetService.createDataset({
    type: dto.type,
    location: "<fake-location>",
    project: project.id
  });

  return project;
}

async function update(dto: ProjectDto.UpdateByIdReq) {
  const omitIdDto = omit(dto, ["id"]);

  const [project] = await db
    .update(projectTable)
    .set(omitIdDto)
    .where(eq(projectTable.id, dto.id))
    .returning();

  return project;
}

async function deleteById(dto: ProjectDto.DeleteByIdReq) {
  const { length: rowsDeleted } = await db
    .delete(projectTable)
    .where(eq(projectTable.id, dto.id))
    .returning();

  return rowsDeleted;
}

async function assignStaff(dto: ProjectDto.AssignStaffReq) {
  const [relation] = await db
    .insert(usersToProjects)
    .values([
      {
        role: dto.role,
        user: dto.user,
        project: dto.project
      }
    ])
    .returning();

  return relation;
}

async function pushStatusHistory(dto: ProjectDto.PushStatusHistoryReq) {
  const project = await db.query.projectTable.findFirst({
    where: (_table) => and(eq(_table.id, dto.projectId))
  });

  if (project === undefined) {
    throw new BizException("project_not_found");
  }

  const currentStatus = last(project.statusHistory as ProjectStatusRecord[])?.status;
  if (!currentStatus) {
    throw new BizException("empty_status_history");
  }

  if (isStatusBefore(dto.record.status, currentStatus) || currentStatus === dto.record.status) {
    throw new BizException("invalid_status");
  }

  const newHistory = appendProjectStatusHistory(
    dto.record,
    project.statusHistory as ProjectStatusRecord[]
  );

  await db
    .update(projectTable)
    .set({
      statusHistory: newHistory
    })
    .where(eq(projectTable.id, dto.projectId))
    .returning();

  return {
    newHistory
  };
}

async function startPreAnnotate(
  dto: ProjectDto.StartPreAnnotateReq,
  authPayload: ContextVariableMap["authPayload"]
) {
  const relation = await findOneById({ id: dto.projectId }, authPayload);

  if (relation?.role !== PROJECT_ROLE.ADMIN) {
    throw new BizException("permission_denied");
  }

  if (
    last(relation.project?.statusHistory as ProjectStatusRecord[])?.status !==
    PROJECT_STATUS.PENDING
  ) {
    throw new BizException("invalid_status");
  }

  if (!relation.user || !relation.project) {
    throw new BizException("project_not_found");
  }

  // const user = await userService.findOneById({ id: relation.user });

  try {
    await inngest.send({
      name: "app/project.pre-annotate",
      data: {
        projectId: relation.project.id,
        datasetId: relation.project.dataset.id,
        labels: relation.project.presets
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw new BizException("inngest_error");
  }

  /* pushStatusHistory({
    projectId: relation.project.id,
    record: composeProjectStatus(PROJECT_STATUS.PRE_ANNOTATING, user.username)
  }); */

  return null;
}

async function releaseProject(
  dto: ProjectDto.ReleaseProjectReq,
  authPayload: ContextVariableMap["authPayload"]
) {
  const relation = await db.query.usersToProjects.findFirst({
    where: (_table) =>
      and(eq(_table.user, authPayload.operatorId), eq(_table.project, dto.projectId)),
    with: {
      user: true,
      project: {
        with: {
          dataset: true
        }
      }
    }
  });

  if (!relation || !relation.user || relation.project === null) {
    throw new BizException("project_not_found");
  }

  // TODO: if (relation?.role !== PROJECT_ROLE.ADMIN) {
  // throw new BizException("permission_denied");
  // }

  const dataItems = await db.query.dataItemTable.findMany({
    where: (_table) => eq(_table.dataset, relation.project?.dataset.id ?? 0)
  });

  let releaseLoader: BasicReleaseLoader | null = null;

  if (dto.releaseType === "coco") {
    releaseLoader = new CocoReleaseLoader({
      poc: relation.user.username,
      releaseName: relation.project.name,
      dataset: relation.project.dataset,
      presetLabels: relation.project.presets as Label[],
      dataItems
    });
  } else {
    releaseLoader = new YoloReleaseLoader({
      poc: relation.user.username,
      releaseName: relation.project.name,
      dataset: relation.project.dataset,
      presetLabels: relation.project.presets as Label[],
      dataItems
    });
  }

  const zipBuffer = await releaseLoader.releaseToZip();

  const url = await storeFileFromBuffer(zipBuffer, releaseLoader.getArchiveName(), mimes.zip);

  const [project] = await db
    .update(projectTable)
    .set({ releaseUrl: url })
    .where(eq(projectTable.id, dto.projectId))
    .returning();

  await pushStatusHistory({
    projectId: relation.project.id,
    record: composeProjectStatus(PROJECT_STATUS.RELEASED, relation.user.username)
  });

  return {
    project
  };
}

export const projectService = {
  findOneById,
  findAll,
  findMine,
  createSingleProject,
  update,
  deleteById,
  assignStaff,
  pushStatusHistory,
  startPreAnnotate,
  releaseProject
};
