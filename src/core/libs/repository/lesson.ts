import { eq, and, isNull, desc } from "drizzle-orm";
import { lessonsTable, db } from "../../db";
import { SQLiteInsertValue } from "drizzle-orm/sqlite-core";
import dayjs = require("dayjs");
// import * as dayjs from "dayjs";

export const lessonRepo = {
  getAll: async () => {
    try {
      const data = await db
        .select()
        .from(lessonsTable)
        .where(isNull(lessonsTable.deleted_at))
        .orderBy(desc(lessonsTable.created_at));

      return data;
    } catch (err: any) {
      console.log("err lessonRepo -> getAll", err);
      throw err;
    }
  },
  getByCourseId: async (courseId: number) => {
    try {
      const data = await db
        .select()
        .from(lessonsTable)
        .where(
          and(
            isNull(lessonsTable.deleted_at),
            eq(lessonsTable.course_id, courseId),
          ),
        )
        .orderBy(desc(lessonsTable.created_at));

      return data;
    } catch (err: any) {
      console.log("err lessonRepo -> getAll", err);
      throw err;
    }
  },
  getById: async (id: number) => {
    try {
      const [data] = await db
        .select()
        .from(lessonsTable)
        .where(and(isNull(lessonsTable.deleted_at), eq(lessonsTable.id, id)))
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err lessonRepo -> getById", err);
      throw err;
    }
  },
  getByName: async (name: string, courseId?: number) => {
    try {
      const [data] = await db
        .select()
        .from(lessonsTable)
        .where(
          and(
            isNull(lessonsTable.deleted_at),
            courseId
              ? and(
                  eq(lessonsTable.name, name),
                  eq(lessonsTable.course_id, courseId),
                )
              : eq(lessonsTable.name, name),
          ),
        )
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err lessonRepo -> getById", err);
      throw err;
    }
  },
  create: async (
    userId: number,
    incommingData: {
      name: string;
      description: string;
      course_id: number;
    },
  ) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db.insert(lessonsTable).values({
        ...incommingData,
        created_by: userId,
        created_at: timestamp,
      });

      const data = await lessonRepo.getByName(String(incommingData.name));

      return data;
    } catch (err: any) {
      console.log("err lessonRepo -> create", err);
      throw err;
    }
  },
  update: async (
    lessonId: number,
    incommingData: {
      name?: string;
      description?: string;
      image?: string;
      course_id?: number;
    },
  ) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db
        .update(lessonsTable)
        .set({
          ...incommingData,
          updated_at: timestamp,
        })
        .where(eq(lessonsTable.id, lessonId));
    } catch (err: any) {
      console.log("err lessonRepo -> update", err);
      throw err;
    }
  },
  delete: async (id: number) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db
        .update(lessonsTable)
        .set({
          deleted_at: timestamp,
        })
        .where(eq(lessonsTable.id, id));
    } catch (err: any) {
      console.log("err lessonRepo -> delete", err);
      throw err;
    }
  },
};
