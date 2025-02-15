import { Hono } from "hono";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";
import { APP_CONFIG, createResponse } from "./core";
import userRoutes from "./features/user";
import courseRoutes from "./features/course";
import lessonRoutes from "./features/lesson";
import authRoutes from "./features/auth";
import { SignatureKey } from "hono/utils/jwt/jws";
import { env } from "hono/adapter";
import { ContentfulStatusCode } from "hono/utils/http-status";

const app = new Hono();

app.notFound((c) => {
  return c.json(
    {
      status: 0,
      message: "Not Found",
    },
    404,
  );
});

app.use(logger());

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

export default {
  port: APP_CONFIG.appPort,
  fetch: app.fetch,
};
