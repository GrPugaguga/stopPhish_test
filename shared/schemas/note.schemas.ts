import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  categoryId: z.number().int().positive().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export const noteFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
});

export const noteIdSchema = z.object({
  id: z.number().int().positive(),
});

export const updateNoteWithIdSchema = updateNoteSchema.extend({ id: z.number().int().positive() });

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
export type NoteFiltersDto = z.infer<typeof noteFiltersSchema>;
export type UpdateNoteWithIdDto = z.infer<typeof updateNoteWithIdSchema>;
