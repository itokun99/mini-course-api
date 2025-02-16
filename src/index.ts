import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { APP_CONFIG, createResponse } from "./core";
import userRoutes from "@/features/user";
import courseRoutes from "@/features/course";
import lessonRoutes from "@/features/lesson";
import authRoutes from "@/features/auth";
import uploadRoutes from "@/features/upload";
import { ContentfulStatusCode } from "hono/utils/http-status";

const app = new Hono();

// top middleware
app.use(logger());

// static file middleware
app.use("/static/*", serveStatic({ root: "./" }));
app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));
app.get("*", serveStatic({ path: "./static/fallback.txt" }));

app.notFound((c) => {
  return c.json(
    {
      status: 0,
      message: "Not Found",
    },
    404,
  );
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    createResponse("error", err?.message),
    c.res.status as ContentfulStatusCode,
  );
});

// api routes mini courses
app.route("/api/users", userRoutes);
app.route("/api/courses", courseRoutes);
app.route("/api/lessons", lessonRoutes);
app.route("/api/auth", authRoutes);
app.route("/api/upload", uploadRoutes);

export default {
  port: APP_CONFIG.appPort,
  fetch: app.fetch,
};
