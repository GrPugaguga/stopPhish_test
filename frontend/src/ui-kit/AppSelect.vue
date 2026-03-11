<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue: string | number | null;
  options: { value: string | number | null; text: string }[];
  placeholder?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();

function parseValue(raw: string): string | number | null {
  if (raw === '') return null;
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <select
        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm bg-white outline-none transition appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        :value="modelValue ?? ''"
        @change="$emit('update:modelValue', parseValue(($event.target as HTMLSelectElement).value))"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="String(opt.value)" :value="opt.value ?? ''">
          {{ opt.text }}
        </option>
      </select>
      <svg
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
</template>
