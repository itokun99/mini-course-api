import { eq, and, isNull, or } from "drizzle-orm";
import { db, usersTable } from "../../db";
import { SQLiteInsertValue } from "drizzle-orm/sqlite-core";
import dayjs = require("dayjs");

export const userRepo = {
  getByEmail: async (email: string) => {
    try {
      const [data] = await db
        .select()
        .from(usersTable)
        .where(and(isNull(usersTable.deleted_at), eq(usersTable.email, email)))
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err userRepo -> getByEmail", err);
      throw err;
    }
  },
  getById: async (id: number) => {
    try {
      const [data] = await db
        .select()
        .from(usersTable)
        .where(and(isNull(usersTable.deleted_at), eq(usersTable.id, id)))
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err userRepo -> getById", err);
      throw err;
    }
  },
  getByUsername: async (username: string) => {
    try {
      const [data] = await db
        .select()
        .from(usersTable)
        .where(
          and(isNull(usersTable.deleted_at), eq(usersTable.username, username)),
        )
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err userRepo -> getByEmail", err);
      throw err;
    }
  },
  getByEmailOrUsername: async (value: string) => {
    try {
      const [data] = await db
        .select()
        .from(usersTable)
        .where(
          and(
            isNull(usersTable.deleted_at),
            or(eq(usersTable.email, value), eq(usersTable.username, value)),
          ),
        )
        .limit(1);

      return data;
    } catch (err: any) {
      console.log("err userRepo -> getByEmail", err);
      throw err;
    }
  },
  createUser: async (
    userData: Omit<
      SQLiteInsertValue<typeof usersTable>,
      "created_at" | "deleted_at" | "updated_at"
    >,
  ) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");

      await db.insert(usersTable).values({
        ...userData,
        created_at: timestamp,
      });
      const data = await userRepo.getByEmail(String(userData.email));
      return data;
    } catch (err: any) {
      console.log("err userRepo -> createUser", err);
      throw err;
    }
  },
};
