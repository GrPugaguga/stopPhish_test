import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../pages/LoginPage.vue') },
    { path: '/', name: 'home', component: () => import('../pages/NotesPage.vue') },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  if (!token && to.name !== 'login') return { name: 'login' };
  if (token && to.name === 'login') return { name: 'home' };
});

export default router;
