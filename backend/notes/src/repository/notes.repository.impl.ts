import { DataSource } from 'typeorm';
import type { UserPayload } from '@shared/schemas';
import type {
  CreateNoteDto,
  NoteFiltersDto,
  UpdateNoteWithIdDto,
  CreateCategoryDto,
  UpdateCategoryWithIdDto,
} from '@shared/schemas';
import { Note } from '../entity/Note.js';
import { Category } from '../entity/Category.js';
import { NotesRepository } from './notes.repository.js';

export class TypeOrmNotesRepository extends NotesRepository {
  private readonly notes;
  private readonly categories;

  constructor(dataSource: DataSource) {
    super();
    this.notes = dataSource.getRepository(Note);
    this.categories = dataSource.getRepository(Category);
  }

  // Notes

  async findNotes(user: UserPayload, filters: NoteFiltersDto): Promise<Note[]> {
    const query = this.notes
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId: user.id });

    if (filters.search) {
      query.andWhere('note.title ILIKE :search', { search: `%${filters.search}%` });
    }

    if (filters.categoryId) {
      query.andWhere('note.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    return query.getMany();
  }

  async findNoteById(id: number, user: UserPayload): Promise<Note | null> {
    return this.notes.findOneBy({ id, userId: user.id });
  }

  async createNote(data: CreateNoteDto & { user: UserPayload }): Promise<Note> {
    const note = this.notes.create({
      title: data.title,
      content: data.content,
      userId: data.user.id,
      categoryId: data.categoryId ?? null,
    });
    return this.notes.save(note);
  }

  async updateNote(user: UserPayload, data: UpdateNoteWithIdDto): Promise<Note> {
    const { id, ...rest } = data;
    await this.notes.update({ id, userId: user.id }, rest);
    return this.notes.findOneByOrFail({ id, userId: user.id });
  }

  async deleteNote(id: number, user: UserPayload): Promise<void> {
    await this.notes.delete({ id, userId: user.id });
  }

  // Categories

  async findCategories(user: UserPayload): Promise<Category[]> {
    return this.categories.findBy({ userId: user.id });
  }

  async findCategoryById(id: number, user: UserPayload): Promise<Category | null> {
    return this.categories.findOneBy({ id, userId: user.id });
  }

  async createCategory(data: CreateCategoryDto & { user: UserPayload }): Promise<Category> {
    const category = this.categories.create({ name: data.name, userId: data.user.id });
    return this.categories.save(category);
  }

  async updateCategory(user: UserPayload, data: UpdateCategoryWithIdDto): Promise<Category> {
    const { id, ...rest } = data;
    await this.categories.update({ id, userId: user.id }, rest);
    return this.categories.findOneByOrFail({ id, userId: user.id });
  }

  async deleteCategory(id: number, user: UserPayload): Promise<void> {
    await this.categories.delete({ id, userId: user.id });
  }
}
