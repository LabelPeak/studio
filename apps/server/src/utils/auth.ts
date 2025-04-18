import { db } from "@/db/connection.ts";

export function assertUser(id: number) {
  db.query.userTable.findFirst({
    where: (userTable, { eq }) => eq(userTable.id, id)
  });
}
