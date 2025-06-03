<template>
  <div class="hall" id="hall">
    <div class="hall__container">
      <div class="hall__left">
        <img :src="imgSrc" alt="Sảnh cưới" />
      </div>
      <div class="hall__right">
        <span class="elegant-text">Sảnh Cưới Đẳng Cấp</span>
        <h1>KHÔNG GIAN TIỆC CƯỚI<br />SANG TRỌNG & ẤM CÚNG</h1>
        <p>
          Mỗi sảnh cưới của chúng tôi là một tác phẩm nghệ thuật, được thiết kế tỉ mỉ 
          với những chi tiết sang trọng và hiện đại. Từ ánh sáng lung linh đến không gian 
          rộng rãi, mọi yếu tố đều được chăm chút để tạo nên khung cảnh hoàn hảo cho 
          ngày trọng đại của bạn.
        </p>
        <router-link to="/listhall">
          <Button>Khám Phá Sảnh Cưới</Button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../Button/button.vue'
import imgSrc from '@/assets/assets/img_5.png'
import './Hall.scss'
</script>