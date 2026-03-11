<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import { useAuthStore } from '../stores/auth';
import type { CredentialsDto } from '@shared/schemas';

const authStore = useAuthStore();
const activeTab = ref<'login' | 'register'>('login');
const apiError = ref('');

async function handleLogin(payload: CredentialsDto) {
  try {
    apiError.value = '';
    await authStore.login(payload);
  } catch (err: unknown) {
    apiError.value =
      (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Ошибка входа';
  }
}

async function handleRegister(payload: CredentialsDto) {
  try {
    apiError.value = '';
    await authStore.register(payload);
  } catch (err: unknown) {
    apiError.value =
      (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Ошибка регистрации';
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex border-b border-gray-200">
      <button
        class="pb-3 px-4 text-sm font-medium border-b-2 transition cursor-pointer"
        :class="
          activeTab === 'login'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-400'
        "
        @click="
          activeTab = 'login';
          apiError = '';
        "
      >
        Вход
      </button>
      <button
        class="pb-3 px-4 text-sm font-medium border-b-2 transition cursor-pointer"
        :class="
          activeTab === 'register'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-400'
        "
        @click="
          activeTab = 'register';
          apiError = '';
        "
      >
        Регистрация
      </button>
    </div>
    <span v-if="apiError" class="text-xs text-red-500">{{ apiError }}</span>
    <LoginForm v-if="activeTab === 'login'" @submit="handleLogin" />
    <RegisterForm v-else @submit="handleRegister" />
  </div>
</template>
