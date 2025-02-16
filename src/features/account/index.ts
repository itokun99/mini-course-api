import { Hono } from "hono";
import { authMiddleware, createError, createResponse, userRepo } from "@/core";

const app = new Hono();

app.use(authMiddleware);

app.get("/profile", async (c) => {
  try {
    const { id } = c.get("jwtPayload");

    if (!id) {
      throw createError(404, "User does not exist");
    }

    const user = await userRepo.getById(Number(id));

    if (!user) {
      throw createError(404, "User does not exist");
    }

    return c.json(createResponse("success", "ok", user), 200);
  } catch (error: any) {
    return c.json(
      createResponse(
        "error",
        error?.message || "Something went wrong",
        undefined,
        error?.error,
      ),
      error?.statusCode || 500,
    );
  }
});

export default app;
