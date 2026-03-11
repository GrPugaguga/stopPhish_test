import z, { type ZodSchema } from 'zod';
import { Context } from 'moleculer';
import { ValidationError } from '@shared/errors';

export function createAction<T, R, M extends object = Record<string, never>>(
  schema: ZodSchema<T>,
  handler: (ctx: Context<T, M>) => Promise<R>,
) {
  return {
    hooks: {
      before: [
        (ctx: Context) => {
          try {
            ctx.params = schema.parse(ctx.params);
          } catch (err) {
            throw new ValidationError('Invalid request parameters', {
              errors: (err as z.ZodError).issues,
            });
          }
        },
      ],
    },

    handler,
  };
}
