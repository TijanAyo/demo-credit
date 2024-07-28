import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const environmentSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  SALT_ROUND: z.string(),
  JWT_SECRET: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_USER: z.string(),
});

export const environment = environmentSchema.parse(process.env);
