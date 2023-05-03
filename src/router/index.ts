import { createRouter, createWebHistory } from 'vue-router'
import { useClient } from '../stores/client'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/ManageView.vue')
    },
    {
      path:'/check',
      name:'check',
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
    {
      path:'/dashboard',
      name:'dashboard',
      component:()=>import('../views/DashBoard.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name !== 'sign'&&to.name !=='home' && !useClient().loggedIn) next({ name: 'home' })
  else if((to.name == 'sign'||to.name =='home')&&useClient().loggedIn) next({ name: 'dashboard' })
  else next()
})
export default router
