
import { z } from "zod";

/* =======================
   Password Schema Base
======================= */
const passwordField = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(15, "Password must be less than 15 characters")
  .regex(/[a-zA-Z]/, "Contain at least one letter.")
  .regex(/[0-9]/, "Contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Contain at least one special character.")
  .trim();

/* =======================
   Email Schema Base
======================= */
const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email!");

/* =======================
   Login Schema
======================= */
export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

/* =======================
   Register Schema
======================= */
export const registerSchema = loginSchema.extend({
  username: z.string().min(2, "Username must be at least 2 characters."),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
});

/* =======================
   Forgot Password Schema
======================= */
export const forgotPasswordSchema = z.object({
  email: emailField,
});

/* =======================
   Create Password Schema
======================= */
export const createPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

/* =======================
   Generic Form Schema
======================= */
export const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type FormSchemaType = z.infer<typeof formSchema>;