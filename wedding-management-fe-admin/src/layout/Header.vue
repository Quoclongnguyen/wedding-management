<script setup>
import { ref } from 'vue';
import LogoWhite from './LogoWhite.vue';

// State variables

const isOpen = ref(false);
const dropdownOpen = ref(false);
const user1 = '@/assets/images/user1.jpg'; // Đường dẫn đến ảnh người dùng

// Methods
const showMobilemenu = () => {
  const sidebarArea = document.getElementById('sidebarArea');
  if (sidebarArea) {
    sidebarArea.classList.toggle('showSidebar');
  }
};

const Handletoggle = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = () => {
  console.log('Logout clicked');
};
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-primary">
    <!-- Logo và nút mở menu -->
    <div class="d-flex align-items-center">
      <router-link to="/" class="navbar-brand d-lg-none">
        <LogoWhite />
      </router-link>
      <button
        class="btn btn-primary d-lg-none"
        @click="showMobilemenu"
      >
        <i class="bi bi-list"></i>
      </button>
    </div>

    <!-- Nút toggle menu -->
    <div class="hstack gap-2">
      <button
        class="btn btn-primary btn-sm d-sm-block d-md-none"
        @click="Handletoggle"
      >
        <i :class="isOpen ? 'bi bi-x' : 'bi bi-three-dots-vertical'"></i>
      </button>
    </div>

    <!-- Dropdown menu -->
    <div class="ml-auto d-flex align-items-center gap-3">
      <div v-if="isOpen" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto"></ul>
        <div class="dropdown">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              :src="user1"
              alt="profile"
              class="rounded-circle"
              width="30"
            />
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><h6 class="dropdown-header">Info</h6></li>
            <li><a class="dropdown-item" href="#">My Account</a></li>
            <li><a class="dropdown-item" href="#">Edit Profile</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#">My Balance</a></li>
            <li><a class="dropdown-item" href="#">Inbox</a></li>
            <li>
              <a class="dropdown-item" href="#" @click="handleLogout">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>