import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull(),
  username: text().notNull(),
  password: text().notNull(),
  role_id: int().notNull(),
  created_at: text(),
  updated_at: text(),
  deleted_at: text(),
});

export const userCredentialsTable = sqliteTable("user_credentials", {
  id: int().primaryKey({ autoIncrement: true }),
  token: text(),
  forget_token: text(),
  user_id: int().notNull(),
  created_at: text(),
  updated_at: text(),
  deleted_at: text(),
});

export const userCoursesTable = sqliteTable("user_courses", {
  id: int().primaryKey({ autoIncrement: true }),
  user_id: int().notNull(),
  course_id: int().notNull(),
  created_at: text(),
  updated_at: text(),
  deleted_at: text(),
});

export const coursesTable = sqliteTable("courses", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  users_id: int().notNull(),
  image: text(),
  created_at: text(),
  updated_at: text(),
  deleted_at: text(),
});

export const lessonsTable = sqliteTable("lessons", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  course_id: int().notNull(),
  created_at: text(),
  updated_at: text(),
  deleted_at: text(),
});

export const rolesTable = sqliteTable("roles", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  value: text().notNull(),
  created_at: text(),
  updated_at: text(),
  deleted_at: text(),
});
