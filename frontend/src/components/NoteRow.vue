<script setup lang="ts">
import type { Note } from '../stores/notes';
import AppIconButton from '../ui-kit/AppIconButton.vue';

const props = defineProps<{
  note: Note;
}>();

defineEmits<{
  click: [];
  edit: [];
  delete: [];
}>();

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

function onDragStart(e: DragEvent) {
  e.dataTransfer?.setData('text/plain', props.note.id.toString());
  e.dataTransfer!.effectAllowed = 'move';
}
</script>

<template>
  <div
    draggable="true"
    class="flex gap-3 px-5 py-2.5 border-t border-gray-100 hover:bg-gray-50 transition cursor-pointer group"
    @dragstart="onDragStart"
    @click="$emit('click')"
  >
    <AppIconButton icon="grip" class="shrink-0 self-start" />
    <div class="flex-1 min-w-0 flex flex-col">
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-900 truncate flex-1">{{ note.title }}</span>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
          <AppIconButton icon="edit" @click="$emit('edit')" />
          <AppIconButton icon="delete" variant="danger" @click="$emit('delete')" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400 truncate flex-1">{{ note.content }}</span>
        <span class="text-xs text-gray-400 shrink-0">{{ formatDate(note.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>
