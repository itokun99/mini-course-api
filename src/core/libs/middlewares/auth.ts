import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

export const authMiddleware = createMiddleware((c, next) => {
  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
  const jwtMiddleware = jwt({
    secret: JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});
