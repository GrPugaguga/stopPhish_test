<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full px-3 py-2 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      :class="error ? 'border-red-500' : 'border-gray-300'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
