import { describe, it, expect } from 'vitest';
import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
  noteFiltersSchema,
} from '../note.schemas';
import { createCategorySchema, categoryIdSchema } from '../category.schemas';
import { credentialsSchema } from '../user.schemas';

describe('note schemas', () => {
  describe('createNoteSchema', () => {
    it('accepts valid note', () => {
      const result = createNoteSchema.safeParse({ title: 'Test', content: 'Body' });
      expect(result.success).toBe(true);
    });

    it('accepts categoryId as number', () => {
      const result = createNoteSchema.safeParse({ title: 'T', content: 'C', categoryId: 5 });
      expect(result.success).toBe(true);
      expect(result.data!.categoryId).toBe(5);
    });

    it('accepts categoryId: null', () => {
      const result = createNoteSchema.safeParse({ title: 'T', content: 'C', categoryId: null });
      expect(result.success).toBe(true);
      expect(result.data!.categoryId).toBeNull();
    });

    it('rejects empty title', () => {
      const result = createNoteSchema.safeParse({ title: '', content: 'C' });
      expect(result.success).toBe(false);
    });

    it('rejects title longer than 255 chars', () => {
      const result = createNoteSchema.safeParse({ title: 'A'.repeat(256), content: 'C' });
      expect(result.success).toBe(false);
    });
  });

  describe('updateNoteSchema', () => {
    it('accepts empty object (all fields optional)', () => {
      const result = updateNoteSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts categoryId: null', () => {
      const result = updateNoteSchema.safeParse({ categoryId: null });
      expect(result.success).toBe(true);
      expect(result.data!.categoryId).toBeNull();
    });
  });

  describe('noteIdSchema', () => {
    it('coerces string to number', () => {
      const result = noteIdSchema.safeParse({ id: '1' });
      expect(result.success).toBe(true);
      expect(result.data!.id).toBe(1);
    });

    it('rejects negative id', () => {
      const result = noteIdSchema.safeParse({ id: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe('noteFiltersSchema', () => {
    it('accepts search and categoryId', () => {
      const result = noteFiltersSchema.safeParse({ search: 'test', categoryId: 2 });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ search: 'test', categoryId: 2 });
    });
  });
});

describe('category schemas', () => {
  describe('createCategorySchema', () => {
    it('accepts valid name', () => {
      const result = createCategorySchema.safeParse({ name: 'Work' });
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const result = createCategorySchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('rejects name longer than 100 chars', () => {
      const result = createCategorySchema.safeParse({ name: 'A'.repeat(101) });
      expect(result.success).toBe(false);
    });
  });

  describe('categoryIdSchema', () => {
    it('coerces string to number', () => {
      const result = categoryIdSchema.safeParse({ id: '5' });
      expect(result.success).toBe(true);
      expect(result.data!.id).toBe(5);
    });
  });
});

describe('user schemas', () => {
  describe('credentialsSchema', () => {
    it('accepts valid credentials', () => {
      const result = credentialsSchema.safeParse({ email: 'a@b.com', password: '123456' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = credentialsSchema.safeParse({ email: 'not-email', password: '123456' });
      expect(result.success).toBe(false);
    });

    it('rejects password shorter than 6 chars', () => {
      const result = credentialsSchema.safeParse({ email: 'a@b.com', password: '12345' });
      expect(result.success).toBe(false);
    });
  });
});
