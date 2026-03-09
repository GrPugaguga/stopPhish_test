import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const validateTokenSchema = z.object({
  token: z.string(),
});

export type CredentialsDto = z.infer<typeof credentialsSchema>;
export type ValidateTokenDto = z.infer<typeof validateTokenSchema>;
