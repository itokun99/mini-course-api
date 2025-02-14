import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({
    status: 1,
    message: "ok",
    data: [],
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
