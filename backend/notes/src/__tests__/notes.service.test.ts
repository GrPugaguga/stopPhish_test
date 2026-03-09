import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ServiceBroker } from 'moleculer';

const mockRepo = vi.hoisted(() => ({
  findNotes: vi.fn(),
  findNoteById: vi.fn(),
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
  findCategories: vi.fn(),
  findCategoryById: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock('../data-source.js', () => ({ default: {} }));

vi.mock('../repository/notes.repository.impl.js', () => ({
  TypeOrmNotesRepository: function () {
    return mockRepo;
  },
}));

import NotesService from '../notes.service.js';

const user = { id: 1, email: 'test@example.com' };
const meta = { user };

let broker: ServiceBroker;

beforeAll(async () => {
  broker = new ServiceBroker({ logger: false });
  broker.createService(NotesService);
  await broker.start();
});

afterAll(() => broker.stop());

describe('notes.list', () => {
  it('returns notes for user', async () => {
    const notes = [{ id: 1, title: 'Test', content: 'Body', userId: 1 }];
    mockRepo.findNotes.mockResolvedValue(notes);

    const result = await broker.call('notes.list', {}, { meta });
    expect(mockRepo.findNotes).toHaveBeenCalledWith(user, {});
    expect(result).toEqual(notes);
  });

  it('filters by search and categoryId', async () => {
    mockRepo.findNotes.mockResolvedValue([]);
    await broker.call('notes.list', { search: 'hello', categoryId: 2 }, { meta });
    expect(mockRepo.findNotes).toHaveBeenCalledWith(user, { search: 'hello', categoryId: 2 });
  });
});

describe('notes.get', () => {
  it('returns note by id', async () => {
    const note = { id: 1, title: 'Test', userId: 1 };
    mockRepo.findNoteById.mockResolvedValue(note);

    const result = await broker.call('notes.get', { id: 1 }, { meta });
    expect(mockRepo.findNoteById).toHaveBeenCalledWith(1, user);
    expect(result).toEqual(note);
  });

  it('throws if note not found', async () => {
    mockRepo.findNoteById.mockResolvedValue(null);
    await expect(broker.call('notes.get', { id: 99 }, { meta })).rejects.toThrow('Note not found');
  });
});

describe('notes.create', () => {
  it('creates and returns note', async () => {
    const note = { id: 1, title: 'New', content: 'Content', userId: 1 };
    mockRepo.createNote.mockResolvedValue(note);

    const result = await broker.call(
      'notes.create',
      { title: 'New', content: 'Content' },
      { meta },
    );
    expect(mockRepo.createNote).toHaveBeenCalledWith({ title: 'New', content: 'Content', user });
    expect(result).toEqual(note);
  });
});

describe('notes.delete', () => {
  it('deletes note and returns success', async () => {
    mockRepo.deleteNote.mockResolvedValue(undefined);
    const result = await broker.call('notes.delete', { id: 1 }, { meta });
    expect(mockRepo.deleteNote).toHaveBeenCalledWith(1, user);
    expect(result).toEqual({ success: true });
  });
});

describe('notes.categoriesList', () => {
  it('returns categories for user', async () => {
    const cats = [{ id: 1, name: 'Work', userId: 1 }];
    mockRepo.findCategories.mockResolvedValue(cats);

    const result = await broker.call('notes.categoriesList', {}, { meta });
    expect(mockRepo.findCategories).toHaveBeenCalledWith(user);
    expect(result).toEqual(cats);
  });
});

describe('notes.categoriesCreate', () => {
  it('creates category', async () => {
    const cat = { id: 1, name: 'Work', userId: 1 };
    mockRepo.createCategory.mockResolvedValue(cat);

    const result = await broker.call('notes.categoriesCreate', { name: 'Work' }, { meta });
    expect(mockRepo.createCategory).toHaveBeenCalledWith({ name: 'Work', user });
    expect(result).toEqual(cat);
  });
});

describe('notes.categoriesDelete', () => {
  it('deletes category and returns success', async () => {
    mockRepo.deleteCategory.mockResolvedValue(undefined);
    const result = await broker.call('notes.categoriesDelete', { id: 1 }, { meta });
    expect(mockRepo.deleteCategory).toHaveBeenCalledWith(1, user);
    expect(result).toEqual({ success: true });
  });
});
