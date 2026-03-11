import { Service, ServiceBroker } from 'moleculer';
import type { Context } from 'moleculer';
import type { UserPayload } from '@shared/schemas';
import { NotFoundError, ConflictError } from '@shared/errors';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import {
  createNoteSchema,
  updateNoteWithIdSchema,
  noteFiltersSchema,
  noteIdSchema,
  createCategorySchema,
  updateCategoryWithIdSchema,
  categoryIdSchema,
  type CreateNoteDto,
  type UpdateNoteWithIdDto,
  type NoteFiltersDto,
  type CreateCategoryDto,
  type UpdateCategoryWithIdDto,
  createAction,
} from '@shared/schemas';
import { z } from 'zod';
import AppDataSource from './data-source.js';
import { NotesRepository } from './repository/notes.repository.js';
import { TypeOrmNotesRepository } from './repository/notes.repository.impl.js';
import { Note } from './entity/Note.js';
import { Category } from './entity/Category.js';

type Meta = { user: UserPayload };

function handleDbError(err: unknown): never {
  if (err instanceof QueryFailedError && (err as unknown as { code: string }).code === '23505') {
    throw new ConflictError('Категория с таким именем уже существует');
  }
  if (err instanceof EntityNotFoundError) {
    throw new NotFoundError('Запись не найдена');
  }
  throw err;
}

const emptySchema = z.object({});

export default class NotesService extends Service {
  private repo!: NotesRepository;

  constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: 'notes',
      created: this.onCreated,
      actions: {
        list: createAction<NoteFiltersDto, Note[], Meta>(noteFiltersSchema, (ctx) =>
          this.list(ctx),
        ),
        get: createAction<{ id: number }, Note, Meta>(noteIdSchema, (ctx) => this.get(ctx)),
        create: createAction<CreateNoteDto, Note, Meta>(createNoteSchema, (ctx) =>
          this.create(ctx),
        ),
        update: createAction<UpdateNoteWithIdDto, Note, Meta>(updateNoteWithIdSchema, (ctx) =>
          this.update(ctx),
        ),
        delete: createAction<{ id: number }, { success: boolean }, Meta>(noteIdSchema, (ctx) =>
          this.delete(ctx),
        ),
        categoriesList: createAction<Record<string, never>, Category[], Meta>(
          emptySchema as z.ZodType<Record<string, never>>,
          (ctx) => this.categoriesList(ctx),
        ),
        categoriesCreate: createAction<CreateCategoryDto, Category, Meta>(
          createCategorySchema,
          (ctx) => this.categoriesCreate(ctx),
        ),
        categoriesUpdate: createAction<UpdateCategoryWithIdDto, Category, Meta>(
          updateCategoryWithIdSchema,
          (ctx) => this.categoriesUpdate(ctx),
        ),
        categoriesDelete: createAction<{ id: number }, { success: boolean }, Meta>(
          categoryIdSchema,
          (ctx) => this.categoriesDelete(ctx),
        ),
      },
    });
  }

  onCreated() {
    this.repo = new TypeOrmNotesRepository(AppDataSource);
  }

  async list(ctx: Context<NoteFiltersDto, Meta>): Promise<Note[]> {
    const data = ctx.params;
    return this.repo.findNotes(ctx.meta.user, data);
  }

  async get(ctx: Context<{ id: number }, Meta>): Promise<Note> {
    const { id } = ctx.params;
    const note = await this.repo.findNoteById(id, ctx.meta.user);
    if (!note) throw new NotFoundError('Note not found');
    return note;
  }

  async create(ctx: Context<CreateNoteDto, Meta>): Promise<Note> {
    const data = ctx.params;
    return this.repo.createNote({ ...data, user: ctx.meta.user });
  }

  async update(ctx: Context<UpdateNoteWithIdDto, Meta>): Promise<Note> {
    try {
      return await this.repo.updateNote(ctx.meta.user, ctx.params);
    } catch (err) {
      handleDbError(err);
    }
  }

  async delete(ctx: Context<{ id: number }, Meta>): Promise<{ success: boolean }> {
    const { id } = ctx.params;
    await this.repo.deleteNote(id, ctx.meta.user);
    return { success: true };
  }

  async categoriesList(ctx: Context<Record<string, never>, Meta>): Promise<Category[]> {
    return this.repo.findCategories(ctx.meta.user);
  }

  async categoriesCreate(ctx: Context<CreateCategoryDto, Meta>): Promise<Category> {
    try {
      return await this.repo.createCategory({ ...ctx.params, user: ctx.meta.user });
    } catch (err) {
      handleDbError(err);
    }
  }

  async categoriesUpdate(ctx: Context<UpdateCategoryWithIdDto, Meta>): Promise<Category> {
    try {
      return await this.repo.updateCategory(ctx.meta.user, ctx.params);
    } catch (err) {
      handleDbError(err);
    }
  }

  async categoriesDelete(ctx: Context<{ id: number }, Meta>): Promise<{ success: boolean }> {
    const { id } = ctx.params;
    await this.repo.deleteCategory(id, ctx.meta.user);
    return { success: true };
  }
}
