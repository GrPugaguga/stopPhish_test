import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
});

export const noteFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export const noteIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateNoteWithIdSchema = updateNoteSchema.extend({
  id: z.coerce.number().int().positive(),
});

export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
export type NoteFiltersDto = z.infer<typeof noteFiltersSchema>;
export type UpdateNoteWithIdDto = z.infer<typeof updateNoteWithIdSchema>;
