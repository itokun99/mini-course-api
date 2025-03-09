import { z } from "zod";
import { zfd } from "zod-form-data";

export const createLessonValidationSchema = zfd.formData({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, { message: "Description must be at least 3 characters" }),
  image: zfd.file().optional(),
  course_id: z.string({ required_error: "Course id is required" }),
});

export const updateLessonValidationSchema = zfd.formData({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .optional(),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .optional(),
  image: zfd.file().optional(),
  course_id: z.string().optional(),
});
