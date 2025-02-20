import { eq, and, isNull, or, desc } from "drizzle-orm";
import { coursesTable, db, usersTable } from "../../db";
import { SQLiteInsertValue } from "drizzle-orm/sqlite-core";
import dayjs = require("dayjs");
// import * as dayjs from "dayjs";

export const courseRepo = {
  getAll: async () => {
    try {
      const data = await db
        .select()
        .from(coursesTable)
        .where(isNull(coursesTable.deleted_at))
        .orderBy(desc(coursesTable.created_at));

      return data;
    } catch (err: any) {
      console.log("err courseRepo -> getAll", err);
      throw err;
    }
  },
  getById: async (id: number) => {
    try {
      const [data] = await db
        .select()
        .from(coursesTable)
        .where(and(isNull(coursesTable.deleted_at), eq(coursesTable.id, id)))
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err courseRepo -> getById", err);
      throw err;
    }
  },
  getByName: async (name: string) => {
    try {
      const [data] = await db
        .select()
        .from(coursesTable)
        .where(
          and(isNull(coursesTable.deleted_at), eq(coursesTable.name, name)),
        )
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err courseRepo -> getById", err);
      throw err;
    }
  },
  create: async (
    userId: number,
    incommingData: Omit<
      SQLiteInsertValue<typeof coursesTable>,
      "created_at" | "deleted_at" | "updated_at" | "users_id"
    >,
  ) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db.insert(coursesTable).values({
        ...incommingData,
        users_id: userId,
        created_at: timestamp,
      });

      const data = await courseRepo.getByName(String(incommingData.name));

      return data;
    } catch (err: any) {
      console.log("err courseRepo -> create", err);
      throw err;
    }
  },
  update: async (
    courseId: number,
    incommingData: { name?: string; description?: string; image?: string },
  ) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db
        .update(coursesTable)
        .set({
          ...incommingData,
          updated_at: timestamp,
        })
        .where(eq(coursesTable.id, courseId));
    } catch (err: any) {
      console.log("err courseRepo -> update", err);
      throw err;
    }
  },
  delete: async (courseId: number) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db
        .update(coursesTable)
        .set({
          deleted_at: timestamp,
        })
        .where(eq(coursesTable.id, courseId));
    } catch (err: any) {
      console.log("err courseRepo -> delete", err);
      throw err;
    }
  },
};
