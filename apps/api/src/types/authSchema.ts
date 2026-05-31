import * as z from "zod";

export const signupSchema = z.object({
  username: z.string().trim().min(1, "username is required."),
  password: z.string().min(8, "password is required."),
  isAdmin: z.boolean().optional()
});

export const signinSchema = z.object({
  username: z.string().trim().min(1, "username is required."),
  password: z.string().min(8, "password is required."),
});