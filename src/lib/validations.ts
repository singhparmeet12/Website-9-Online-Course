import { z } from "zod";

export const enrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  userId: z.string().optional(), // Defaults to demo user if omitted
});

export const progressSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  completed: z.boolean().default(true),
  userId: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(100),
});

export const courseFilterSchema = z.object({
  category: z.string().optional(),
  level: z.string().optional(),
  search: z.string().optional(),
});
