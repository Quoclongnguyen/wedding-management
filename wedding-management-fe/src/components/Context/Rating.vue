
<template>
  <div class="star-rating">
    <!-- Hiển thị sao đầy -->
    <i v-for="i in fullStars" :key="'full-' + i" class="fas fa-star"></i>
    <!-- Hiển thị sao nửa -->
    <i v-if="hasHalfStar" class="fas fa-star-half-alt"></i>
    <!-- Hiển thị sao rỗng -->
    <i v-for="i in emptyStars" :key="'empty-' + i" class="far fa-star"></i>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

// Nhận giá trị `rating` từ component cha
defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0, // Giá trị mặc định nếu không được truyền
  },
})

// Tính toán số lượng sao đầy, sao nửa và sao rỗng
const fullStars = computed(() => Math.floor(rating))
const hasHalfStar = computed(() => rating - fullStars.value >= 0.5)
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0))
</script>

<style scoped>
.star-rating {
  display: flex;
  gap: 4px;
  color: #ffc107; /* Màu vàng cho sao */
  font-size: 20px;
}
</style>