import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/personal',
      name: 'personal',
      component: () => import('../views/PersonalCenter.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/ManageView.vue')
    },
    {
      path:'/checkinout',
      name:'checkinout',
      component:()=>import('../views/CheckInout.vue')
    },
    {
      path:'/books',
      name:'books',
      component:()=>import('../views/BooksView.vue')
    },
    {
      path:'/sign',
      name:'sign',
      component:()=>import('../views/SignView.vue')
    },
    {
      path:'/news',
      name:'news',
      component:()=>import('../views/NewsView.vue')
    },
  ]
})

export default router
