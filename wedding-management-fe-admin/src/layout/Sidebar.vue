<template>
  <div class="p-3">
    <!-- Logo và nút đóng menu -->
    <div class="d-flex align-items-center">
      <Logo />
      <span class="ms-auto d-lg-none">
        <button
          class="btn-close btn-sm"
          @click="showMobilemenu"
        ></button>
      </span>
    </div>

    <!-- Navigation -->
    <div class="pt-4 mt-2">
      <ul class="nav flex-column sidebarNav">
        <li
          v-for="(navi, index) in navigation"
          :key="index"
          class="nav-item sidenav-bg"
        >
          <router-link
            :to="navi.href"
            :class="[
              'nav-link py-3',
              $route.path === navi.href ? 'text-primary' : 'text-secondary'
            ]"
          >
            <i :class="navi.icon"></i>
            <span class="ms-3 d-inline-block">{{ navi.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Logo from './Logo.vue'; // Import Logo component

// Navigation data
const navigation = ref([
  { title: 'Dashboard', href: '/', icon: 'bi bi-speedometer2' },
  { title: 'Quản lý tài khoản', href: '/accounts', icon: 'bi bi-people' },
  { title: 'Quản lý chi nhánh', href: '/branches', icon: 'bi bi-building' },
  { title: 'Quản lý sảnh cưới', href: '/halls', icon: 'bi bi-door-open' },
  { title: 'Quản lý menu món ăn', href: '/menu-categories', icon: 'bi bi-list-nested' },
  { title: 'Quản lý món ăn', href: '/menus', icon: 'bi bi-cup-hot' },
  { title: 'Quản lý menu dịch vụ', href: '/service-categories', icon: 'bi bi-tags' },
  { title: 'Quản lý dịch vụ', href: '/services', icon: 'bi bi-gear' },
  { title: 'Quản lý hoá đơn', href: '/invoices', icon: 'bi bi-receipt' },
  { title: 'Quản lý đánh giá', href: '/feedbacks', icon: 'bi bi-star' },
]);

// Function to toggle mobile menu
const showMobilemenu = () => {
  const sidebarArea = document.getElementById('sidebarArea');
  if (sidebarArea) {
    sidebarArea.classList.toggle('showSidebar');
  }
};

// Current route
const $route = useRoute();
</script>

<style scoped>
/* Add custom styles if needed */
</style>