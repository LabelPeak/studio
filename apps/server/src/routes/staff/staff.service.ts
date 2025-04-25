import { hashSync } from "bcrypt-ts";
import { count, eq, getTableColumns, ilike, or } from "drizzle-orm";
import { omit } from "remeda";

import { db } from "@/db/connection.ts";
import { usersToProjects, userTable } from "@/db/schema.ts";
import { BizException } from "@/utils/exception.ts";

import type { UserDto } from "./staff.dto.ts";

async function findOneById(dto: UserDto.FindOneByIdReq) {
  const staff = await db.query.userTable.findFirst({
    columns: {
      password: false
    },
    where: (_userTable) => eq(_userTable.id, dto.id)
  });

  if (!staff) {
    throw new BizException("staff_not_found");
  }
  return staff;
}

async function findAll(dto: UserDto.FindAllReq) {
  const list = await db.query.userTable.findMany({
    offset: (dto.page - 1) * dto.size,
    limit: dto.size
  });

  return {
    list,
    total: list.length
  };
}

async function findAllByProject(dto: UserDto.FindAllByProjectReq) {
  const columns = omit(getTableColumns(userTable), ["password"]);

  const list = await db
    .select(columns)
    .from(userTable)
    .leftJoin(usersToProjects, eq(usersToProjects.user, userTable.id))
    .where(eq(usersToProjects.project, dto.projectId))
    .limit(dto.size)
    .offset((dto.page - 1) * dto.size);

  const total =
    (
      await db
        .select({ count: count() })
        .from(userTable)
        .leftJoin(usersToProjects, eq(usersToProjects.user, userTable.id))
        .where(eq(usersToProjects.project, dto.projectId))
    ).at(0)?.count ?? 0;

  return {
    list,
    total
  };
}

async function createSingleStaff(dto: UserDto.CreateSingleStaffReq) {
  const password = crypto.randomUUID();
  const encryptedPassword = hashSync(password);

  const sameNameCnt = await db.$count(userTable, eq(userTable.realname, dto.realname));

  const [newUser] = await db
    .insert(userTable)
    .values([
      {
        username:
          sameNameCnt === 0
            ? dto.realname
            : `${dto.realname}.${(sameNameCnt + 1).toString().padStart(3, "0").split("").join("")}`,
        realname: dto.realname,
        password: encryptedPassword,
        superadmin: 0
      }
    ])
    .returning();

  return {
    ...newUser,
    password
  };
}

async function updateStaff(dto: UserDto.UpdateStaffReq) {
  const [updatedStaff] = await db
    .update(userTable)
    .set({ realname: dto.realname })
    .where(eq(userTable.id, dto.staffId))
    .returning();

  return {
    ...updatedStaff,
    password: undefined
  };
}

async function deleteStaffById(dto: UserDto.DeleteStaffReq) {
  await db.delete(userTable).where(eq(userTable.id, dto.staffId)).returning();

  return null;
}

async function searchStaffs(dto: UserDto.SearchStaffsReq) {
  const list = await db.query.userTable.findMany({
    where: () =>
      or(ilike(userTable.username, `${dto.token}%`), ilike(userTable.realname, `%${dto.token}%`)),
    limit: dto.size,
    offset: (dto.page - 1) * dto.size
  });

  const total = await db.$count(
    userTable,
    or(ilike(userTable.username, `${dto.token}%`), ilike(userTable.realname, `%${dto.token}%`))
  );

  return {
    list,
    total
  };
}

export const userService = {
  findOneById,
  findAll,
  findAllByProject,
  createSingleStaff,
  updateStaff,
  deleteStaffById,
  searchStaffs
};
