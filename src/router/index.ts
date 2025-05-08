import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';

import DefaultLayout from '@/layout/DefaultLayout.vue';
import ATMHomeView from '@/modules/home/ATMHomeView.vue';
import LoginView from '@/modules/login/LoginView.vue';
import RegisterView from '@/modules/register/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          name: 'home',
          path: '',
          component: ATMHomeView,
          meta: { requiresAuth: true }
        },
        {
          name: 'login',
          path: '/login',
          component: LoginView,
          meta: { requiresAuth: false }
        },
        {
          name: 'register',
          path: '/register',
          component: RegisterView,
          meta: { requiresAuth: false }
        }
      ]
    }
  ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (token && (to.name === 'login' || to.name === 'register')) {
    next('/');
  } else {
    next();
  }
});

export default router;
