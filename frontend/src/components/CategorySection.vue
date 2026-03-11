<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Note } from '../stores/notes';
import NoteRow from './NoteRow.vue';
import AppIconButton from '../ui-kit/AppIconButton.vue';

const props = defineProps<{
  category: { id: number; name: string } | null;
  notes: Note[];
  expanded: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  addNote: [];
  editCategory: [rect: DOMRect];
  deleteCategory: [];
  editNote: [note: Note];
  deleteNote: [noteId: number];
  clickNote: [note: Note];
  dropNote: [noteId: number];
}>();

const isUncategorized = computed(() => props.category === null);
const dragOver = ref(false);
const editBtnRef = ref<HTMLElement | null>(null);

function onEditClick() {
  if (editBtnRef.value) {
    emit('editCategory', editBtnRef.value.getBoundingClientRect());
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  e.dataTransfer!.dropEffect = 'move';
  dragOver.value = true;
}

function onDragLeave(e: DragEvent) {
  const root = e.currentTarget as HTMLElement;
  if (!root.contains(e.relatedTarget as Node)) {
    dragOver.value = false;
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  dragOver.value = false;
  const noteId = Number(e.dataTransfer?.getData('text/plain'));
  if (noteId) emit('dropNote', noteId);
}
</script>

<template>
  <div
    class="bg-white rounded-xl border overflow-hidden transition"
    :class="[
      isUncategorized ? 'border-dashed border-gray-200' : 'border-gray-200',
      dragOver && 'border-indigo-500 bg-indigo-50/30',
    ]"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div
      class="flex items-center gap-3 px-5 py-3.5 cursor-pointer select-none hover:bg-gray-50 transition group"
      @click="emit('toggle')"
    >
      <AppIconButton icon="chevron" :rotated="expanded" />
      <h3
        class="font-semibold flex-1"
        :class="isUncategorized ? 'text-gray-400 italic' : 'text-gray-900'"
      >
        {{ category?.name ?? 'Без категории' }}
      </h3>
      <div
        v-if="category"
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
      >
        <AppIconButton icon="plus" @click="emit('addNote')" />
        <button
          ref="editBtnRef"
          class="p-1.5 rounded transition cursor-pointer text-gray-400 hover:text-indigo-600"
          @click.stop="onEditClick"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <AppIconButton icon="delete" variant="danger" @click="emit('deleteCategory')" />
      </div>
      <span class="text-xs text-gray-400">{{ notes.length }}</span>
    </div>

    <div v-show="expanded" class="flex flex-col">
      <NoteRow
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @click="emit('clickNote', note)"
        @edit="emit('editNote', note)"
        @delete="emit('deleteNote', note.id)"
      />
      <p v-if="!notes.length" class="text-sm text-gray-400 px-5 py-3">Заметок пока нет</p>
    </div>
  </div>
</template>
