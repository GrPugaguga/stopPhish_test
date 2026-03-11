import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createAction } from '../validator';

const testSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().int().positive(),
});

function makeCtx(params: unknown) {
  return { params } as never;
}

describe('createAction', () => {
  it('parses valid params and calls handler', async () => {
    const handler = vi.fn().mockResolvedValue('ok');
    const action = createAction(testSchema, handler);

    const ctx = makeCtx({ name: 'Alice', age: '25' });
    // Run before hook
    action.hooks.before[0](ctx);
    // Params should be parsed (age coerced to number)
    expect((ctx as { params: unknown }).params).toEqual({ name: 'Alice', age: 25 });

    const result = await action.handler(ctx);
    expect(handler).toHaveBeenCalledWith(ctx);
    expect(result).toBe('ok');
  });

  it('throws ValidationError for invalid params', () => {
    const handler = vi.fn();
    const action = createAction(testSchema, handler);

    const ctx = makeCtx({ name: '', age: -1 });
    expect(() => action.hooks.before[0](ctx)).toThrow('Invalid request parameters');
  });

  it('ValidationError has zod issues in data', () => {
    const handler = vi.fn();
    const action = createAction(testSchema, handler);

    const ctx = makeCtx({ name: '', age: 'abc' });
    try {
      action.hooks.before[0](ctx);
      expect.unreachable('should have thrown');
    } catch (err: unknown) {
      const error = err as { code: number; type: string; data: { errors: unknown[] } };
      expect(error.code).toBe(422);
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.data.errors).toBeDefined();
      expect(error.data.errors.length).toBeGreaterThan(0);
    }
  });
});
