import { z } from 'zod';

const envSchema = z.object({
  // Users DB
  USERS_DB_HOST: z.string().default('localhost'),
  USERS_DB_PORT: z.coerce.number().default(5433),
  USERS_DB_USER: z.string(),
  USERS_DB_PASSWORD: z.string(),
  USERS_DB_NAME: z.string(),

  // Notes DB
  NOTES_DB_HOST: z.string().default('localhost'),
  NOTES_DB_PORT: z.coerce.number().default(5434),
  NOTES_DB_USER: z.string(),
  NOTES_DB_PASSWORD: z.string(),
  NOTES_DB_NAME: z.string(),

  // NATS
  NATS_URL: z.string().default('nats://localhost:4222'),
  NATS_USER: z.string(),
  NATS_PASS: z.string(),

  // Auth
  JWT_SECRET: z.string(),
});

export const ENV = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
