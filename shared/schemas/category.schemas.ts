import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateCategorySchema = createCategorySchema;

export const categoryIdSchema = z.object({
  id: z.number().int().positive(),
});

export const updateCategoryWithIdSchema = updateCategorySchema.extend({
  id: z.number().int().positive(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryWithIdDto = z.infer<typeof updateCategoryWithIdSchema>;
