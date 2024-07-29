import { z } from "zod";

export const transferSchema = z.object({
  account_number: z.string().trim(),
  amount: z.number(),
  transaction_pin: z.string().max(4),
});

export const setTransactionPinSchema = z.object({
  pin: z.string().trim(),
  confirm_pin: z.string().trim(),
});
