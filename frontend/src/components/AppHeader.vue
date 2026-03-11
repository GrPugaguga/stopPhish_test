<script setup lang="ts">
import AppButton from '../ui-kit/AppButton.vue';

defineProps<{
  searchQuery: string;
}>();

defineEmits<{
  'update:searchQuery': [value: string];
  createNote: [];
  logout: [];
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900 flex-1">Мои заметки</h1>
      <AppButton variant="primary" @click="$emit('createNote')">
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Новая заметка
        </span>
      </AppButton>
      <AppButton variant="ghost" @click="$emit('logout')">Выйти</AppButton>
    </div>
    <input
      :value="searchQuery"
      type="text"
      placeholder="Поиск заметок..."
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
