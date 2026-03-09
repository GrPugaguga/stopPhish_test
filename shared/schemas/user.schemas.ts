import { z } from 'zod';

export interface UserPayload {
  id: number;
  email: string;
}

export interface UserTokenPayload {
  token: string;
}

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const validateTokenSchema = z.object({
  token: z.string(),
});

export type CredentialsDto = z.infer<typeof credentialsSchema>;
export type ValidateTokenDto = z.infer<typeof validateTokenSchema>;
