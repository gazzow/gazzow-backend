import z from "zod/v3";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address" }),

  password: z.string().trim().min(1, { message: "Password is required" }),
});
