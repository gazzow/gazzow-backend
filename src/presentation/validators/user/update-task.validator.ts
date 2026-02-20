import z from "zod/v3";

export const updateTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(699, "Description must not exceed 699 characters"),

  assigneeId: z.string().nullable().optional(),

  estimatedHours: z.coerce
    .number({
      invalid_type_error: "Estimated hours must be a number",
    })
    .min(1, "Estimated hours must be greater than 0"),

  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please select a valid due date",
    })
    .refine((val) => new Date(val) > new Date(), {
      message: "Due date must be in the future",
    }),

  priority: z.string().min(1, "Please select task priority"),

  expectedRate: z.coerce.number().min(0).optional(),
});
