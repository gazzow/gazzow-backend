import { z } from "zod/v3";

export const registerSchema = z
  .object({
    name: z
      .string({ message: "Invalid format. Name must be string" })
      .trim()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(25, { message: "Name is too long" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Name can only contain letters and spaces",
      }),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Please enter a valid email address" })
      .refine((val) => !val.endsWith("@example.com"), {
        message: "Disposable emails are not allowed",
      }),

    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(46, { message: "Password is too long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      })
      .refine(
        (val) =>
          !["Password123!", "12345678", "qwerty123", "admin123"].includes(val),
        {
          message: "This password is too common. Choose a stronger one.",
        },
      ),

    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });
