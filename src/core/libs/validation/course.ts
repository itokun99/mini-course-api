import { z } from "zod";
import { zfd } from "zod-form-data";

export const createCourseValidationSchema = zfd.formData({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, { message: "Description must be at least 3 characters" }),
  image: zfd.file().optional(),
});

export const updateCourseValidationSchema = zfd.formData({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .optional(),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .optional(),
  image: zfd.file().optional(),
});
