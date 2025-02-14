import { db, usersTable } from "@/core";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const data = await db.select().from(usersTable);
  return c.json({
    status: 1,
    message: "ok",
    data,
  });
});

app.post("/", async (c) => {
  return c.json({
    status: 1,
    message: "ok",
  });
});

app.put("/", async (c) => {
  return c.json({
    status: 1,
    message: "ok",
  });
});

app.delete("/", async (c) => {
  return c.json({
    status: 1,
    message: "ok",
  });
});

export default app;
