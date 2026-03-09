import type { Note } from '../entity/Note.js';
import type { Category } from '../entity/Category.js';
import type { UserPayload } from '@shared/schemas';
import type {
  CreateNoteDto,
  NoteFiltersDto,
  UpdateNoteWithIdDto,
  CreateCategoryDto,
  UpdateCategoryWithIdDto,
} from '@shared/schemas';

export abstract class NotesRepository {
  abstract findNotes(user: UserPayload, filters: NoteFiltersDto): Promise<Note[]>;
  abstract findNoteById(id: number, user: UserPayload): Promise<Note | null>;
  abstract createNote(data: CreateNoteDto & { user: UserPayload }): Promise<Note>;
  abstract updateNote(user: UserPayload, data: UpdateNoteWithIdDto): Promise<Note>;
  abstract deleteNote(id: number, user: UserPayload): Promise<void>;

  abstract findCategories(user: UserPayload): Promise<Category[]>;
  abstract findCategoryById(id: number, user: UserPayload): Promise<Category | null>;
  abstract createCategory(data: CreateCategoryDto & { user: UserPayload }): Promise<Category>;
  abstract updateCategory(user: UserPayload, data: UpdateCategoryWithIdDto): Promise<Category>;
  abstract deleteCategory(id: number, user: UserPayload): Promise<void>;
}
