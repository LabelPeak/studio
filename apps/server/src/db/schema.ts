import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
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
  presets: json().notNull(),
  access: varchar({ length: 10 }).notNull(),
  statusHistory: json().notNull(),
  admin: integer().references(() => userTable.id),
  releaseUrl: varchar()
});

export const projectRelations = relations(projectTable, ({ many, one }) => ({
  admin: one(userTable, { fields: [projectTable.admin], references: [userTable.id] }),
  users: many(usersToProjects),
  dataset: one(datasetTable, { fields: [projectTable.id], references: [datasetTable.project] })
}));

export const usersToProjects = pgTable(
  "user_project",
  {
    role: varchar({ length: 10 }).notNull(),
    user: integer().references(() => userTable.id, { onDelete: "cascade" }),
    project: integer().references(() => projectTable.id, { onDelete: "cascade" })
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
  type: varchar({ length: 16 }).notNull(),
  location: varchar({ length: 200 }).notNull(),
  project: integer().references(() => projectTable.id, { onDelete: "cascade" })
});

export const datasetRelations = relations(datasetTable, ({ many }) => ({
  dataitems: many(dataItemTable)
}));

export const dataItemTable = pgTable("dataitem", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  annotation: json().notNull(),
  file: text().notNull(),
  dataset: integer(),
  reannotation: json().notNull(),
  feedback: varchar({ length: 50 }).notNull(),
  approved: boolean(),
  updateAt: timestamp().notNull()
});

export const dataItemRelations = relations(dataItemTable, ({ one }) => ({
  dataset: one(datasetTable, {
    fields: [dataItemTable.dataset],
    references: [datasetTable.id]
  })
}));
