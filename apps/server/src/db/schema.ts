import { relations } from "drizzle-orm";
import {
  boolean,
  char,
  integer,
  json,
  pgTable,
  primaryKey,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  password: varchar({ length: 80 }).notNull(),
  username: varchar({ length: 20 }).notNull(),
  realname: varchar({ length: 10 }).notNull(),
  superadmin: boolean()
});

export const userRelations = relations(userTable, ({ many }) => ({
  projects: many(usersToProjects)
}));

export const projectTable = pgTable("project", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  createAt: timestamp().notNull(),
  presets: varchar({ length: 500 }).notNull(),
  access: varchar({ length: 10 }).notNull(),
  statusHistory: json().notNull(),
  admin: integer().references(() => userTable.id)
  // FIXME: dataset 和 role 字段少了
});

export const projectRelations = relations(projectTable, ({ many }) => ({
  users: many(usersToProjects)
}));

export const usersToProjects = pgTable(
  "user_project",
  {
    role: char({ length: 10 }).notNull(),
    user: integer().references(() => userTable.id),
    project: integer().references(() => projectTable.id)
  },
  (t) => [primaryKey({ columns: [t.user, t.project] })]
);

export const usersToProjectsRelations = relations(usersToProjects, ({ one }) => ({
  user: one(userTable, {
    fields: [usersToProjects.user],
    references: [userTable.id]
  }),
  project: one(projectTable, {
    fields: [usersToProjects.project],
    references: [projectTable.id]
  })
}));

export const datasetTable = pgTable("dataset", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: char({ length: 16 }).notNull(),
  location: varchar({ length: 200 }).notNull(),
  project: integer().references(() => projectTable.id)
});

export const dataItemTable = pgTable("dataitem", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  annotation: json().notNull(),
  file: varchar({ length: 80 }).notNull(),
  dataset: integer().references(() => datasetTable.id),
  reannotation: json().notNull(),
  feedback: varchar({ length: 50 }).notNull(),
  approved: integer().notNull(),
  updateAt: timestamp().notNull()
});
