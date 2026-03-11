import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';
import type {
  NoteResponse,
  CategoryResponse,
  CreateNoteDto,
  NoteFiltersDto,
  CreateCategoryDto,
  UpdateCategoryWithIdDto,
} from '@shared/schemas';

export type Note = NoteResponse;
export type Category = CategoryResponse;

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([]);
  const categories = ref<Category[]>([]);

  async function fetchNotes(filters?: NoteFiltersDto) {
    const { data } = await api.get('/api/notes', { params: filters });
    notes.value = data;
  }

  async function fetchCategories() {
    const { data } = await api.get('/api/categories');
    categories.value = data;
  }

  async function createNote(payload: CreateNoteDto) {
    const { data } = await api.post('/api/notes', payload);
    notes.value.push(data);
    return data as Note;
  }

  async function updateNote(id: number, payload: CreateNoteDto) {
    const { data } = await api.put(`/api/notes/${id}`, payload);
    const idx = notes.value.findIndex((n) => n.id === id);
    if (idx !== -1) notes.value[idx] = data;
    return data as Note;
  }

  async function deleteNote(id: number) {
    await api.delete(`/api/notes/${id}`);
    notes.value = notes.value.filter((n) => n.id !== id);
  }

  async function createCategory(payload: CreateCategoryDto) {
    const { data } = await api.post('/api/categories', payload);
    categories.value.push(data);
    return data as Category;
  }

  async function updateCategory(payload: UpdateCategoryWithIdDto) {
    const { data } = await api.put(`/api/categories/${payload.id}`, { name: payload.name });
    const idx = categories.value.findIndex((c) => c.id === payload.id);
    if (idx !== -1) categories.value[idx] = data;
    return data as Category;
  }

  async function deleteCategory(id: number) {
    await api.delete(`/api/categories/${id}`);
    categories.value = categories.value.filter((c) => c.id !== id);
    notes.value = notes.value.filter((n) => n.categoryId !== id);
    await fetchNotes();
  }

  async function moveNote(noteId: number, categoryId: number | null) {
    const { data } = await api.put(`/api/notes/${noteId}`, { categoryId });
    const idx = notes.value.findIndex((n) => n.id === noteId);
    if (idx !== -1) notes.value[idx] = data;
  }

  return {
    notes,
    categories,
    fetchNotes,
    fetchCategories,
    createNote,
    updateNote,
    deleteNote,
    createCategory,
    updateCategory,
    deleteCategory,
    moveNote,
  };
});
