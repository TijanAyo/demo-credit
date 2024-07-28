import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().trim().max(20),
  last_name: z.string().trim().max(20),
  email_address: z.string().email().trim(),
  phone_number: z.string().trim().max(20),
  bvn: z.string().trim().max(20),
  password: z.string().trim(),
});

export const loginSchema = z.object({
  email_address: z.string().email().trim(),
  password: z.string().trim(),
});
