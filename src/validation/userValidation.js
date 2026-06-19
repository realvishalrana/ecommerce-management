import { z } from "zod";
import { USER_ROLE } from "../models/userModel.js";

const roleValues = Object.values(USER_ROLE);

const signupUserSchema = z
  .object({
    email: z
      .string({
        error: "Email is required",
      })
      .email(),
    password: z
      .string({
        error: "Password is required",
      })
      .min(3, "Password must be at least 3 characters")
      .max(20, "Password cannot exceed 20 characters"),
    confirmPassword: z
      .string({
        error: "Confirm Password is required",
      })
      .min(3, "Confirm Password must be at least 3 characters")
      .max(20, "Confirm Password cannot exceed 20 characters"),
    address: z.object({
      city: z.string(),
      state: z.string().min(2).max(50),
    }),
    DOB: z.coerce.date(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(roleValues),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const loginUserSchema = z.object({
  email: z
    .string({
      error: "Email is required",
    })
    .email(),
  password: z
    .string({
      error: "Password is required",
    })
    .min(3, "Password must be at least 3 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export { signupUserSchema, loginUserSchema };
