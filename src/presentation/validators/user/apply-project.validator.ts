import z from "zod/v3";

export const applyProjectSchema = z.object({
  proposal: z
    .string()
    .trim()
    .max(300, { message: "Proposal cannot exceed 300 characters" })
    .optional(),

  expectedRate: z.coerce
    .number()
    .min(1, { message: "Expected rate must be greater than 0" }),
});
