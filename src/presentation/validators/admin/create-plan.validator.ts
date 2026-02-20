import z from "zod/v3";
import { PlanDuration, PlanType } from "../../../domain/enums/plan.js";

const planNameRegex = /^[A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9]$/;

export const createPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters")
    .regex(
      planNameRegex,
      "Name must start with a letter and contain only letters, numbers, and spaces",
    )
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain consecutive spaces",
    })
    .refine((val) => /[A-Za-z]/.test(val), {
      message: "Name must contain at least one letter",
    }),

  type: z.nativeEnum(PlanType),

  duration: z.nativeEnum(PlanDuration),

  price: z.coerce
    .number({
      invalid_type_error: "Price is required",
    })
    .min(0, "Price must be greater than or equal to 0"),

  features: z.object({
    commissionRate: z.coerce
      .number({
        invalid_type_error: "Commission rate is required",
      })
      .min(0, "Must be at least 0%")
      .max(100, "Cannot exceed 100%"),
  }),
});
