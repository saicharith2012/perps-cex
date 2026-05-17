import * as z from "zod";

export const authSchema = z.object({
  username: z.string().trim().min(1, "username is required."),
  password: z.string().min(8, "password is required.").max(20),
});