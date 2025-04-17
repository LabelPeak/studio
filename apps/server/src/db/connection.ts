import * as schema from "./schema.ts"
import { drizzle } from "drizzle-orm/node-postgres"

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
  schema
})