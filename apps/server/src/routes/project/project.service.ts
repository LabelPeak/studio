import { eq } from "drizzle-orm";
import type { ContextVariableMap } from "hono";

import { db } from "@/db/connection.ts";
import { projectTable, usersToProjects } from "@/db/schema.ts";
import { BizException } from "@/utils/exception.ts";

import { datasetService } from "../dataset/dataset.service.ts";
import type { ProjectDto } from "./project.dto.ts";

async function findOneById(dto: ProjectDto.FindOneByIdReq) {
  const project = await db.query.projectTable.findFirst({
    where: (_projectTable) => eq(_projectTable.id, dto.id)
  });

  if (!project) {
    throw new BizException("project_not_found");
  }

  return project;
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
        admin: admin?.id,
        access: dto.access,
        createAt: new Date(),
        presets: "[]",
        statusHistory: "[]"
      }
    ])
    .returning();

  await db.insert(usersToProjects).values([
    {
      role: "admin",
      user: admin?.id,
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
  const [project] = await db
    .update(projectTable)
    .set(dto)
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

export const projectService = {
  findOneById,
  findAll,
  findMine,
  createSingleProject,
  update,
  deleteById,
  assignStaff
};
