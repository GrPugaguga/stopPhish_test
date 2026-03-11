<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import CategorySection from '../components/CategorySection.vue';
import CategoryPopup from '../components/CategoryPopup.vue';
import NoteModal from '../components/NoteModal.vue';
import AppIconButton from '../ui-kit/AppIconButton.vue';
import { useNotesStore, type Note } from '../stores/notes';
import { useAuthStore } from '../stores/auth';
import type { CreateNoteDto } from '@shared/schemas';

const notesStore = useNotesStore();
const authStore = useAuthStore();

const searchQuery = ref('');
let debounceTimer: ReturnType<typeof setTimeout>;

watch(searchQuery, (val) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => notesStore.fetchNotes(val ? { search: val } : undefined), 300);
});

onMounted(async () => {
  await Promise.all([notesStore.fetchNotes(), notesStore.fetchCategories()]);
  expandedCategories.value.add('uncategorized');
  for (const cat of notesStore.categories) {
    expandedCategories.value.add(cat.id);
  }
});

const groupedByCategory = computed(() => {
  const map = new Map<number | null, typeof notesStore.notes>();
  for (const note of notesStore.notes) {
    const key = note.categoryId;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(note);
  }
  return map;
});

const isSearching = computed(() => searchQuery.value.trim().length > 0);

const categoriesWithNotes = computed(() => {
  const all = notesStore.categories.map((cat) => ({
    category: cat,
    notes: groupedByCategory.value.get(cat.id) ?? [],
  }));
  return isSearching.value ? all.filter((item) => item.notes.length > 0) : all;
});

const uncategorizedNotes = computed(() => groupedByCategory.value.get(null) ?? []);

const expandedCategories = ref(new Set<number | 'uncategorized'>());

function toggleCategory(id: number | 'uncategorized') {
  if (expandedCategories.value.has(id)) {
    expandedCategories.value.delete(id);
  } else {
    expandedCategories.value.add(id);
  }
}

const modalOpen = ref(false);
const editingNote = ref<Note | null>(null);
const defaultCategoryId = ref<number | null>(null);

function openCreate(categoryId?: number | null) {
  editingNote.value = null;
  defaultCategoryId.value = categoryId ?? null;
  modalOpen.value = true;
}

function openEdit(note: Note) {
  editingNote.value = note;
  defaultCategoryId.value = null;
  modalOpen.value = true;
}

async function handleSave(payload: CreateNoteDto) {
  if (editingNote.value) {
    await notesStore.updateNote(editingNote.value.id, payload);
  } else {
    await notesStore.createNote(payload);
  }
  modalOpen.value = false;
}

async function handleDelete() {
  if (editingNote.value && confirm('Удалить заметку?')) {
    await notesStore.deleteNote(editingNote.value.id);
    modalOpen.value = false;
  }
}

async function handleDeleteFromRow(noteId: number) {
  if (confirm('Удалить заметку?')) {
    await notesStore.deleteNote(noteId);
  }
}

async function handleDropNote(noteId: number, categoryId: number | null) {
  await notesStore.moveNote(noteId, categoryId);
}

const newCatPopup = ref(false);
const renameCatPopup = ref(false);
const renamingCatId = ref<number | null>(null);
const renamePosition = ref<{ top: number; left: number } | undefined>();

async function handleAddCategory(name: string) {
  await notesStore.createCategory({ name });
  newCatPopup.value = false;
  const created = notesStore.categories[notesStore.categories.length - 1];
  if (created) expandedCategories.value.add(created.id);
}

function openRenamePopup(categoryId: number, rect: DOMRect) {
  renamePosition.value = { top: rect.bottom + 4, left: rect.left };
  renamingCatId.value = categoryId;
  renameCatPopup.value = true;
}

async function handleRenameCategory(name: string) {
  if (renamingCatId.value !== null) {
    await notesStore.updateCategory({ id: renamingCatId.value, name });
  }
  renameCatPopup.value = false;
}

async function handleDeleteCategory(id: number) {
  const count = notesStore.notes.filter((n) => n.categoryId === id).length;
  const msg = count ? `Удалить категорию и ${count} заметок внутри?` : 'Удалить пустую категорию?';
  if (confirm(msg)) {
    await notesStore.deleteCategory(id);
  }
}

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto flex flex-col gap-6 p-8">
      <AppHeader
        v-model:search-query="searchQuery"
        @create-note="openCreate()"
        @logout="handleLogout"
      />

      <div class="flex flex-col gap-3">
        <CategorySection
          v-if="!isSearching || uncategorizedNotes.length"
          :category="null"
          :notes="uncategorizedNotes"
          :expanded="expandedCategories.has('uncategorized')"
          @toggle="toggleCategory('uncategorized')"
          @click-note="openEdit"
          @edit-note="openEdit"
          @delete-note="handleDeleteFromRow"
          @drop-note="(noteId) => handleDropNote(noteId, null)"
        />

        <CategorySection
          v-for="item in categoriesWithNotes"
          :key="item.category.id"
          :category="item.category"
          :notes="item.notes"
          :expanded="expandedCategories.has(item.category.id)"
          @toggle="toggleCategory(item.category.id)"
          @add-note="openCreate(item.category.id)"
          @edit-category="openRenamePopup(item.category.id, $event)"
          @delete-category="handleDeleteCategory(item.category.id)"
          @click-note="openEdit"
          @edit-note="openEdit"
          @delete-note="handleDeleteFromRow"
          @drop-note="(noteId) => handleDropNote(noteId, item.category.id)"
        />

        <div class="relative">
          <button
            class="flex items-center gap-2 px-5 py-3 text-sm text-gray-500 hover:text-indigo-600 transition rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 w-full cursor-pointer"
            @click="newCatPopup = true"
          >
            <AppIconButton icon="plus" />
            Новая категория
          </button>
          <CategoryPopup
            v-if="newCatPopup"
            initial-value=""
            @save="handleAddCategory"
            @cancel="newCatPopup = false"
          />
        </div>
      </div>
    </div>

    <NoteModal
      :open="modalOpen"
      :note="editingNote"
      :categories="notesStore.categories"
      :default-category-id="defaultCategoryId"
      @close="modalOpen = false"
      @save="handleSave"
      @delete="handleDelete"
    />

    <Teleport to="body">
      <CategoryPopup
        v-if="renameCatPopup"
        :initial-value="notesStore.categories.find((c) => c.id === renamingCatId)?.name ?? ''"
        :position="renamePosition"
        @save="handleRenameCategory"
        @cancel="renameCatPopup = false"
      />
    </Teleport>
  </div>
</template>
