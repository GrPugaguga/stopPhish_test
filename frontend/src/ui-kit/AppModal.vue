<script setup lang="ts">
defineProps<{
  open: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close');
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click="onOverlayClick"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <button
            class="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-5 overflow-y-auto flex-1">
          <slot />
        </div>
        <div v-if="$slots.footer" class="p-5 border-t border-gray-200">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
