import { createRouter, createWebHistory } from 'vue-router';
import Starter from '@/view/Starter.vue';
import FullLayout from '@/layout/FullLayout.vue';
import AccountManage from '@/components/dashboard/AccountManage.vue';
import Login from '@/view/ui/Login.vue';
import AuthService from '@/service/auth-service'; // Phải có checkRoleUser()
import Branchs from '@/view/ui/Branchs.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: FullLayout,
    meta: { requiresAuth: true }, // áp dụng cho cả FullLayout và children
    children: [
      { path: '', name: 'Starter', component: Starter },
      {
        path: 'accounts',
        name: 'AccountManage',
        component: AccountManage,
      },
       {
        path: 'branches',
        name: 'Branches',
        component: Branchs,
      },

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const hasPermission = AuthService.checkRoleUser();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token && hasPermission) {
      next(); // Cho phép truy cập
    } else {
      console.warn("Người dùng không có quyền hoặc chưa đăng nhập.");
      next({ path: '/login' }); // Chuyển hướng đến trang login
    }
  } else {
    next(); // Không yêu cầu xác thực
  }
});

export default router;
