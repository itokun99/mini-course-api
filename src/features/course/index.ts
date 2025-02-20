import {
  adminRoleMiddleware,
  authMiddleware,
  courseRepo,
  createCourseValidationSchema,
  createError,
  createResponse,
  saveFileToStatic,
  updateCourseValidationSchema,
  userRepo,
} from "@/core";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const data = await courseRepo.getAll();
    return c.json(createResponse("success", "ok", data), 200);
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

app.use(authMiddleware);
app.use(adminRoleMiddleware);
app.post("/", async (c) => {
  try {
    const { id: userId } = c.get("jwtPayload");
    const user = await userRepo.getById(Number(userId));

    if (!userId || !user) {
      throw createError(401, "Unauthorized");
    }

    const body = await c.req.parseBody();
    const validation = createCourseValidationSchema.safeParse(body);
    if (!validation.success) {
      throw createError(400, "Validation error", validation.error);
    }

    const { name, description, image } = validation.data;

    const existingData = await courseRepo.getByName(name);
    if (existingData) {
      throw createError(400, "Course already exists");
    }

    const data = await courseRepo.create(userId, {
      name,
      description,
    });

    if (image) {
      const imagePath = await saveFileToStatic("courses", image);
      await courseRepo.update(data.id, {
        image: imagePath as string,
      });
      data.image = imagePath;
    }

    return c.json(createResponse("success", "ok", data), 201);
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

app.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { id: userId } = c.get("jwtPayload");
    const user = await userRepo.getById(Number(userId));

    if (!userId || !user) {
      throw createError(401, "Unauthorized");
    }

    let data = await courseRepo.getById(Number(id));

    if (!data) {
      throw createError(404, "Course not found");
    }

    const body = await c.req.parseBody();
    const validation = updateCourseValidationSchema.safeParse(body);
    if (!validation.success) {
      throw createError(400, "Validation error", validation.error);
    }

    const { name, description, image } = validation.data;

    const existingData = await courseRepo.getByName(String(name));
    if (name !== data.name && existingData) {
      throw createError(400, "Course already exists");
    }

    await courseRepo.update(Number(id), {
      name,
      description,
    });

    if (name) data.name = name;
    if (description) data.description = description;

    if (image) {
      const imagePath = await saveFileToStatic("courses", image);
      await courseRepo.update(data.id, {
        image: imagePath as string,
      });
      await Bun.file(`.${data.image}`).delete();
      data.image = imagePath;
    }

    return c.json(createResponse("success", "ok", data), 200);
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

app.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { id: userId } = c.get("jwtPayload");
    const user = await userRepo.getById(Number(userId));

    if (!userId || !user) {
      throw createError(401, "Unauthorized");
    }
    const data = await courseRepo.getById(Number(id));
    if (!data) {
      throw createError(400, "Course not found");
    }

    await courseRepo.delete(Number(id));

    if (data.image) {
      Bun.file(`.${data.image}`).delete();
    }

    return c.json(createResponse("success", "ok"), 200);
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
