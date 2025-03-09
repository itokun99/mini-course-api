import {
  adminRoleMiddleware,
  authMiddleware,
  courseRepo,
  createError,
  createLessonValidationSchema,
  createResponse,
  lessonRepo,
  saveFileToStatic,
  updateLessonValidationSchema,
  userRepo,
} from "@/core";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const courseId = c.req.query("course_id");
    const data = courseId
      ? await lessonRepo.getByCourseId(Number(courseId))
      : await lessonRepo.getAll();
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
    const validation = createLessonValidationSchema.safeParse(body);
    if (!validation.success) {
      throw createError(400, "Validation error", validation.error);
    }

    const { name, description, image, course_id } = validation.data;

    const course = await courseRepo.getById(Number(course_id));

    if (!course) {
      throw createError(400, "Course not found");
    }

    const existingData = await lessonRepo.getByName(name, course.id);

    if (existingData) {
      throw createError(400, "Lesson already exists");
    }

    let imagePath: string | undefined;

    if (image) {
      imagePath = await saveFileToStatic("lessons", image);
    }

    const data = await lessonRepo.create(userId, {
      name,
      description,
      course_id: course.id,
      ...(imagePath && {
        image: imagePath,
      }),
    });

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

    let data = await lessonRepo.getById(Number(id));

    if (!data) {
      throw createError(404, "Lesson not found");
    }

    const body = await c.req.parseBody();
    const validation = updateLessonValidationSchema.safeParse(body);
    if (!validation.success) {
      throw createError(400, "Validation error", validation.error);
    }

    const { name, description, image, course_id } = validation.data;

    const course = await courseRepo.getById(Number(course_id));

    if (!course) {
      throw createError(404, "Course not found");
    }

    const existingData = await lessonRepo.getByName(String(name), course.id);

    if (name !== data.name && existingData) {
      throw createError(400, "Lesson already exists");
    }

    let imagePath: string | undefined;

    if (image) {
      imagePath = await saveFileToStatic("lesson", image);
      // await Bun.file(`.${data.image}`).delete();
      // data.image = imagePath;
    }

    await lessonRepo.update(Number(id), {
      name,
      description,
      ...(course_id && {
        course_id: course.id,
      }),
      ...(imagePath && {
        image: imagePath,
      }),
    });

    if (name) data.name = name;
    if (description) data.description = description;
    if (imagePath) {
      await Bun.file(`.${data.image}`).delete();
      data.image = imagePath;
    }
    if (course_id) data.course_id = course.id;

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
    const data = await lessonRepo.getById(Number(id));
    if (!data) {
      throw createError(400, "Lesson not found");
    }

    await lessonRepo.delete(Number(id));

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
