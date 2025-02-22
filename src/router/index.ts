// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/pages/Dashboard.vue';
import PigDesigner from '@/pages/PigDesigner.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/design',
      name: 'PigDesigner',
      component: PigDesigner,
    },
  ],
});

export default router;
