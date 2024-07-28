import { z } from "zod";

export const transferSchema = z.object({
  account_number: z.string().trim(),
  amount: z.number(),
  transaction_pin: z.string().max(4),
});
