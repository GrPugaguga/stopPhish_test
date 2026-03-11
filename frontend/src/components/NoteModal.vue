<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Note, Category } from '../stores/notes';
import AppModal from '../ui-kit/AppModal.vue';
import AppInput from '../ui-kit/AppInput.vue';
import AppSelect from '../ui-kit/AppSelect.vue';
import AppTextarea from '../ui-kit/AppTextarea.vue';
import AppButton from '../ui-kit/AppButton.vue';
import type { CreateNoteDto } from '@shared/schemas';

const props = defineProps<{
  open: boolean;
  note: Note | null;
  categories: Category[];
  defaultCategoryId?: number | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [payload: CreateNoteDto];
  delete: [];
}>();

const title = ref('');
const content = ref('');
const categoryId = ref<number | null>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      title.value = props.note?.title ?? '';
      content.value = props.note?.content ?? '';
      categoryId.value = props.note?.categoryId ?? props.defaultCategoryId ?? null;
    }
  },
);

function getCategoryOptions() {
  return [
    { value: null, text: 'Без категории' },
    ...props.categories.map((c) => ({ value: c.id, text: c.name })),
  ];
}

function handleSave() {
  if (!title.value.trim()) return;
  emit('save', {
    title: title.value.trim(),
    content: content.value,
    categoryId: categoryId.value,
  });
}
</script>

<template>
  <AppModal
    :open="open"
    :title="note ? 'Редактировать заметку' : 'Новая заметка'"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-4">
      <AppInput v-model="title" label="Заголовок" placeholder="Название заметки" />
      <AppSelect v-model="categoryId" label="Категория" :options="getCategoryOptions()" />
      <AppTextarea v-model="content" label="Содержание" placeholder="Текст заметки..." />
    </div>
    <template #footer>
      <div class="flex items-center justify-between">
        <AppButton v-if="note" variant="danger" @click="emit('delete')">Удалить</AppButton>
        <span v-else />
        <div class="flex gap-2">
          <AppButton variant="secondary" @click="emit('close')">Отмена</AppButton>
          <AppButton variant="primary" @click="handleSave">Сохранить</AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>
