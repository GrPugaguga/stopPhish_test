<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '../ui-kit/AppInput.vue';
import AppButton from '../ui-kit/AppButton.vue';

const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
}>();

const email = ref('');
const password = ref('');
const error = ref('');

function onSubmit() {
  error.value = '';
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля';
    return;
  }
  emit('submit', { email: email.value, password: password.value });
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <AppInput v-model="email" label="Email" type="email" placeholder="user@example.com" />
    <AppInput v-model="password" label="Пароль" type="password" placeholder="••••••" />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
    <AppButton variant="primary" type="submit" class="w-full">Войти</AppButton>
  </form>
</template>
