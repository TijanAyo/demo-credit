import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const environmentSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
});

export const environment = environmentSchema.parse(process.env);
