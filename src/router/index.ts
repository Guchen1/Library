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
      path:'/users',
      name:'users',
      component:()=>import('../views/UsersView.vue')
    },
    {
      path:'/dashboard',
      name:'dashboard',
      component:()=>import('../views/DashBoard.vue')
    },
    {
      path:'/state',
      name:'state',
      component:()=>import('../components/StateReciever.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(window.top!=window.self &&to.name!='state'){ next({name:'state'}) ;return }
  if(to.name=='state') {next(); return }
  if (to.name !== 'sign'&&to.name !=='home' && !useClient().loggedIn) {  document.body.style.overflow = 'hidden';next({ name: 'home' })}
  else if((to.name == 'sign'||to.name =='home')&&useClient().loggedIn){setTimeout(()=>document.body.style.overflow = 'auto',50) ; next({ name: 'dashboard' })}
  else if(to.name =='home') {document.body.style.overflow = 'hidden';next()}
  else {setTimeout(()=>document.body.style.overflow = 'auto',50) ;next()}
})
export default router
