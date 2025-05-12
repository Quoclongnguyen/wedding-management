import { createRouter, createWebHistory } from 'vue-router'
import Starter from '@/view/Starter.vue'
import FullLayout from '@/layout/FullLayout.vue'
import AccountManage from '@/components/dashboard/AccountManage.vue'; // Import AccountManage


const routes = [
  {
    path: '/',
    component: FullLayout, // Sử dụng FullLayout làm layout chính
    children: [
      {
        path: '', // Route mặc định
        name: 'Starter',
        component: Starter, // Trang Starter
      },
      // Bạn có thể thêm các route con khác tại đây
       {
        path: 'accounts', // Route cho quản lý tài khoản
        name: 'AccountManage',
        component: AccountManage, // Trang AccountManage
      },
    ]
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router   