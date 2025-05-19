import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/layout/Home/Home.vue'
import Login from '@/components/page/Login/Login.vue'
import Register from '@/components/page/Register/Register.vue'
import Profile from '@/components/page/Profile/Profile.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },

 
 
 
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
 

 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router