import DefaultLayout from '@/layout/DefaultLayout.vue';
import ATMHomeView from '@/modules/home/ATMHomeView.vue';
import LoginView from '@/modules/login/LoginView.vue';
import RegisterView from '@/modules/register/RegisterView.vue';
import { createRouter, createWebHistory } from 'vue-router';

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
        }
      ]
    },
    {
      path: '/login',
      component: DefaultLayout,
      children: [
        {
          name: 'login',
          path: '',
          component: LoginView,
          meta: { requiresAuth: false }
        }
      ]
    },
    {
      path: '/register',
      component: DefaultLayout,
      children: [
        {
          name: 'register',
          path: '',
          component: RegisterView,
          meta: { requiresAuth: false }
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  }
  else if (token && to.name === 'login') {
    next('/');
  } else {
    next();
  }
});

export default router;
