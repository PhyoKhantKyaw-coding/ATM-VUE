import DefaultLayout from '@/layout/DefaultLayout.vue'
import ATMHomeView from '@/modules/home/ATMHomeView.vue'
import AuthContainer from '@/modules/login/AuthContainer.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      component: DefaultLayout,
      children: [
        {
          name: 'home', 
          path: '',
          component: ATMHomeView
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
          component: AuthContainer
        }
      ]
    },
    {
      path: '/',
      redirect: '/login' // ✅ Default route to /login
    }
  ]  
})
router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("token")

  if (to.meta.requiresAuth && !token) {
      next('/')
  } 
  else if (to.name === 'login' && token) {
      next('/home')
  }
  else if (to.name === 'home' && !token) {
      next('/login')
  }
  else {
      next()
  }
})
export default router
