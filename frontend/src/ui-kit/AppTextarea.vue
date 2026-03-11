<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue: string;
  rows?: number;
  placeholder?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <textarea
      :value="modelValue"
      :rows="rows ?? 6"
      :placeholder="placeholder"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>
