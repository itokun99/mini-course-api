import { APP_CONFIG } from "../config";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const db = drizzle({ connection: { source: APP_CONFIG.db.fileName! } });
