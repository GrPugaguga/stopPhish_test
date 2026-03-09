import { ZodSchema } from 'zod';
import { Context } from 'moleculer';

export function createAction<T, R, M extends object = Record<string, never>>(
  schema: ZodSchema<T>,
  handler: (ctx: Context<T, M>) => Promise<R>,
) {
  return {
    hooks: {
      before: [
        (ctx: Context) => {
          ctx.params = schema.parse(ctx.params);
        },
      ],
    },

    handler,
  };
}
