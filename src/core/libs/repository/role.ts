import { SQLiteInsertValue } from "drizzle-orm/sqlite-core";
import { db, rolesTable } from "../../db";
import dayjs = require("dayjs");
import { isNull, and, eq } from "drizzle-orm";

type DataInsert = Omit<
  SQLiteInsertValue<typeof rolesTable>,
  "created_at" | "deleted_at" | "updated_at" | "deleted_at"
>;

export const roleRepo = {
  getAll: async () => {
    try {
      const data = await db.select().from(rolesTable);
      return data;
    } catch (err: any) {
      console.log("err roleRepo -> getAll", err);
      throw err;
    }
  },
  getById: async (id: number) => {
    try {
      const [data] = await db
        .select()
        .from(rolesTable)
        .where(eq(rolesTable.id, id))
        .limit(1);
      return data;
    } catch (err: any) {
      console.log("err roleRepo -> getById", err);
      throw err;
    }
  },
  getByValue: async (value: string) => {
    try {
      const [data] = await db
        .select()
        .from(rolesTable)
        .where(and(isNull(rolesTable.deleted_at), eq(rolesTable.value, value)))
        .limit(1);
      return data;
    } catch (err: any) {
      console.log("err roleRepo -> getByValue", err);
      throw err;
    }
  },
  createRole: async (dataInsert: DataInsert) => {
    try {
      const now = dayjs();
      const timestamp = now.format("YYYY-MM-DD HH:mm:ss");
      await db
        .insert(rolesTable)
        .values({ ...dataInsert, created_at: timestamp });
      const data = await roleRepo.getByValue(String(dataInsert.value));
      return data;
    } catch (err: any) {
      console.log("err roleRepo -> createRole", err);
      throw err;
    }
  },
};
