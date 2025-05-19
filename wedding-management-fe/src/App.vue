<script setup>
import Header from '@/layout/Header/Header.vue'
import Footer from '@/layout/Footer.vue'
import { useRoute } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'


const route = useRoute()
</script>

<template>
  <div>
    <!-- Hiển thị Header nếu không phải trang Login hoặc Register -->
    <Header v-if="!['/login', '/register'].includes(route.path)" />
    <router-view />
    <!-- Hiển thị Footer nếu không phải trang Login hoặc Register -->
    <Footer v-if="!['/login', '/register'].includes(route.path)" />
  </div>
</template>

<style scoped>
/* Thêm style nếu cần */
</style>