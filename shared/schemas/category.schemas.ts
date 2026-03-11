import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateCategorySchema = createCategorySchema;

export const categoryIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateCategoryWithIdSchema = updateCategorySchema.extend({
  id: z.coerce.number().int().positive(),
});

export interface CategoryResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryWithIdDto = z.infer<typeof updateCategoryWithIdSchema>;
