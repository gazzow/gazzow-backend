import z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email format" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
