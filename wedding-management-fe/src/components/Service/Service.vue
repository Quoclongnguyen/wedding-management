<template>
  <div class="service" id="service">
    <div class="service__container ">
      <div class="service__left">
        <span class="elegant-text">Dịch Vụ Hoàn Hảo</span>
        <h1>TRỌN GÓI DỊCH VỤ<br />ĐẲNG CẤP 5 SAO</h1>
        <p>
          Chúng tôi cung cấp đầy đủ các dịch vụ cao cấp từ trang trí, 
          âm thanh ánh sáng đến quay phim, chụp ảnh chuyên nghiệp. 
          Đội ngũ nhân viên giàu kinh nghiệm sẽ đảm bảo mọi chi tiết 
          được thực hiện hoàn hảo, mang đến cho bạn một đám cưới 
          trong mơ không thể quên.
        </p>
        <router-link to="/listservice">
          <Button>Khám Phá Dịch Vụ</Button>
        </router-link>
      </div>
      <div class="service__right">
        <img :src="imgSrc" alt="Premium Services" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../Button/button.vue'
import imgSrc from '@/assets/assets/Untitled.png'
import './Service.scss'
</script>