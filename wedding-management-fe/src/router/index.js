import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/layout/Home/Home.vue'
import Login from '@/components/page/Login/Login.vue'
import Register from '@/components/page/Register/Register.vue'
import Profile from '@/components/page/Profile/Profile.vue'
import ListHall from '@/components/page/ListHall/ListHall.vue'
import ListBranch from '@/components/page/ListBranch/ListBranch.vue'
import ListMenu from '@/components/page/ListMenu/ListMenu.vue'
import ListService from '@/components/page/ListService/ListService.vue'




const routes = [
  { path: '/', name: 'Home', component: Home },

 
 
 
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/listHall', name: 'ListHall', component: ListHall },
  { path: '/listbranch', name :'ListBranch', component: ListBranch},
  { path: '/listmenu', name :'ListMenu', component: ListMenu},
  { path: '/listservice', name :'ListService', component: ListService},

 

 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router