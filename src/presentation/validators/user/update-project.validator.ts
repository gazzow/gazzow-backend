import z from "zod/v3";

export const updateProjectSchema = z
  .object({
    title: z
      .string()
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must not exceed 200 characters"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must not exceed 5000 characters"),

    requiredSkills: z
      .array(z.string().min(1))
      .min(1, "Select at least one tech stack"),

    visibility: z.enum(["public", "invite"], {
      message: "Please select project visibility",
    }),

    developersNeeded: z
      .number({
        message: "Developers count is required",
      })
      .min(1, "At least 1 developer is required"),

    experience: z.string().min(1, "Please select preferred experience"),

    // Budget
    budgetMin: z
      .number({ message: "Minimum budget must be a number" })
      .min(0, "Minimum budget cannot be negative"),

    budgetMax: z
      .number({ message: "Maximum budget must be a number" })
      .min(0, "Maximum budget cannot be negative"),

    // Duration
    durationMin: z
      .number({ message: "Minimum duration must be a number" })
      .min(1, "Minimum duration must be at least 1"),

    durationMax: z
      .number({ message: "Maximum duration must be a number" })
      .min(1, "Maximum duration must be at least 1"),

    durationUnit: z.enum(["weeks", "months"], {
      message: "Please select duration unit",
    }),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  })
  .refine((data) => Number(data.durationMax) >= Number(data.durationMin), {
    message:
      "Maximum duration must be greater than or equal to minimum duration",
    path: ["durationMax"],
  });
