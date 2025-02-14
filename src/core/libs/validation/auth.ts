import { z } from "zod";

export const signupValidationSchema = z.object(
  {
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(3, {
        message: "Name must be at least 3 characters",
      }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { message: "Password must be at least 6 characters" }),
  },
  {
    required_error: "Invalid data",
  },
);

export const signinValidationSchema = z.object(
  {
    email: z.string({
      required_error: "Email / Username is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  },
  {
    required_error: "Invalid data",
  },
);
