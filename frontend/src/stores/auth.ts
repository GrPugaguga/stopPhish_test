import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api';
import router from '../router';
import type { CredentialsDto } from '@shared/schemas';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'));
  const isAuthenticated = computed(() => !!token.value);

  async function login(payload: CredentialsDto) {
    const { data } = await api.post('/auth/login', payload);
    token.value = data.token;
    localStorage.setItem('token', data.token);
    router.push('/');
  }

  async function register(payload: CredentialsDto) {
    const { data } = await api.post('/auth/register', payload);
    token.value = data.token;
    localStorage.setItem('token', data.token);
    router.push('/');
  }

  function logout() {
    token.value = null;
    localStorage.removeItem('token');
    router.push('/login');
  }

  return { token, isAuthenticated, login, register, logout };
});
