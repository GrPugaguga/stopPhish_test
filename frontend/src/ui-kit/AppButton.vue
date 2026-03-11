<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    class="text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700': variant === 'primary' || !variant,
      'border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50': variant === 'secondary',
      'text-red-500 hover:text-red-700': variant === 'danger',
      'text-gray-500 hover:text-gray-800': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
