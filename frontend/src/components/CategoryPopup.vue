<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import AppButton from '../ui-kit/AppButton.vue';

const props = defineProps<{
  initialValue?: string;
  position?: { top: number; left: number };
}>();

const emit = defineEmits<{
  save: [name: string];
  cancel: [];
}>();

const name = ref(props.initialValue ?? '');
const inputRef = ref<HTMLInputElement | null>(null);
const rootRef = ref<HTMLElement | null>(null);

function save() {
  const trimmed = name.value.trim();
  if (trimmed) emit('save', trimmed);
}

function onClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    emit('cancel');
  }
}

onMounted(async () => {
  await nextTick();
  inputRef.value?.focus();
  inputRef.value?.select();
  document.addEventListener('mousedown', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside);
});
</script>

<template>
  <div
    ref="rootRef"
    class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2.5 z-50"
    :style="
      position
        ? { position: 'fixed', top: position.top + 'px', left: position.left + 'px' }
        : { position: 'absolute', top: '100%', left: '0', right: '0', marginTop: '4px' }
    "
  >
    <input
      ref="inputRef"
      v-model="name"
      type="text"
      placeholder="Название категории"
      class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      @keydown.enter="save"
      @keydown.escape="emit('cancel')"
    />
    <AppButton variant="primary" @click="save">OK</AppButton>
    <AppButton variant="ghost" @click="emit('cancel')">Отмена</AppButton>
  </div>
</template>
