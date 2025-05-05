import { hashSync } from "bcrypt-ts";

import { db } from "@/db/connection.ts";
import { userTable } from "@/db/schema.ts";
import { userService } from "@/routes/staff/staff.service.ts";

export async function initFirstAdmin() {
  const userTotal = (
    await userService.findAll({
      page: 1,
      size: 1
    })
  ).total;

  if (userTotal === 0) {
    const username = process.env.ADMIN_NAME ?? "";
    const encryptedPassword = hashSync(process.env.ADMIN_DEFAULT_PASSWORD ?? "");

    await db.insert(userTable).values([
      {
        username,
        realname: username,
        password: encryptedPassword,
        superadmin: true
      }
    ]);
  }
}
