import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import { createError, createResponse } from "../utils";
import { roleRepo, userRepo } from "../repository";

export const authMiddleware = createMiddleware((c, next) => {
  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
  const jwtMiddleware = jwt({
    secret: JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

export const adminRoleMiddleware = createMiddleware(async (c, next) => {
  const { id } = c.get("jwtPayload");
  const user = await userRepo.getById(Number(id));
  if (!user) {
    return c.json(createResponse("error", "Unauthorized"), 401);
  }
  const userRole = await roleRepo.getById(user.role_id);
  if (!userRole || userRole.value !== "admin") {
    return c.json(createResponse("error", "Unauthorized"), 401);
  }
  await next();
});
