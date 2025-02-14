import { Hono } from "hono";
import { env } from "hono/adapter";
import {
  createError,
  createPassword,
  createResponse,
  createToken,
  roleRepo,
  signinValidationSchema,
  signupValidationSchema,
  userRepo,
  validatePassword,
} from "@/core";

const app = new Hono();

app.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const validation = signupValidationSchema.safeParse(body);
    if (!validation.success) {
      throw createError(400, "Validation error", validation.error);
    }

    const { name, email, password, username } = validation.data;

    const [existUserEmail, existUsername] = await Promise.all([
      userRepo.getByEmail(email),
      userRepo.getByUsername(username),
    ]);

    const roles = await roleRepo.getAll();

    // once in first time create
    if (!roles.length) {
      await roleRepo.createRole({
        name: "Admin",
        value: "admin",
      });
      await roleRepo.createRole({
        name: "User",
        value: "user",
      });
    }

    const role = await roleRepo.getByValue("user");

    // if doesn't role data with value user
    if (!role) {
      throw createError(400, "Role does not exist");
    }

    // if email was existing by other user
    if (existUserEmail) {
      throw createError(400, "Email already exists");
    }

    // if username was existing by other user
    if (existUsername) {
      throw createError(400, "Username already exists");
    }

    const user = await userRepo.createUser({
      name,
      email,
      password: createPassword(password),
      username,
      role_id: role.id,
    });

    return c.json(createResponse("success", "Sign Up successfull", user), 201);
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

app.post("/signin", async (c) => {
  const _env = env<{ JWT_SECRET: string; JWT_EXPIRES_IN: string }>(c);
  console.log(_env);
  try {
    const body = await c.req.json();
    const validation = signinValidationSchema.safeParse(body);
    if (!validation.success) {
      throw createError(400, "Validation error", validation.error);
    }

    const { email, password } = validation.data;

    const user = await userRepo.getByEmailOrUsername(email);

    if (!user) {
      throw createError(400, "User does not exist");
    }

    const isMatch = validatePassword(password, user.password);

    if (!isMatch) {
      throw createError(400, "Invalid password");
    }

    const token = createToken(
      { id: user.id },
      _env.JWT_SECRET as string,
      _env.JWT_EXPIRES_IN as string,
    );
    return c.json(
      createResponse("success", "ok", {
        token,
      }),
      200,
    );
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
