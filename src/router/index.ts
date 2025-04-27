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
      path: '/',
      component: DefaultLayout,
      children: [
        {
          name: 'login', 
          path: '',
          component: AuthContainer
        }
      ]
    }
  ]  
})
router.beforeEach((to, _, next) => {
  // const token = localStorage.get('token')

  // if (to.meta.requiresAuth && !token) {
  //     next('/auth/login')
  // } else if (to.name === 'NotFound') {
  //     next()
  // }  else if (!to.meta.requiresAuth && token) {
  //     next('/')
  // } else {
  //     next()
  // }
  next()
})
export default router
