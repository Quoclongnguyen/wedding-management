<template>
  <div class="home" id="home">
    <div class="home__container">
      <div class="home__left">
        <div class="content-wrapper">
          <span class="elegant-text">Nhà Hàng Tiệc Cưới</span>
          <h1 class="main-title">
            KHÔNG GIAN SANG TRỌNG<br />
            CHO NGÀY HẠNH PHÚC
          </h1>
          <p class="description">
            Chào mừng bạn đến với trung tâm tiệc cưới đẳng cấp. 
            Chúng tôi tự hào mang đến những trải nghiệm hoàn hảo và độc đáo, 
            nơi mỗi chi tiết được chăm chút tỉ mỉ để tạo nên không gian 
            lý tưởng cho ngày trọng đại của bạn.
          </p>
          <div class="home__buttons">
            <RouterLink to="/bill">
              <Button class="primary-btn">ĐẶT TIỆC NGAY</Button>
            </RouterLink>
            <RouterLink to="/listbranch">
              <Button class="secondary-btn">XEM CHI NHÁNH</Button>
            </RouterLink>
          </div>
          <div class="highlights">
            <div class="highlight-item">
              <span class="number">1000+</span>
              <span class="label">Tiệc cưới</span>
            </div>
            <div class="highlight-item">
              <span class="number">10+</span>
              <span class="label">Chi nhánh</span>
            </div>
            <div class="highlight-item">
              <span class="number">98%</span>
              <span class="label">Khách hài lòng</span>
            </div>
          </div>
        </div>
      </div>
      <div class="home__right">
        <div class="image-wrapper">
          <img
            :src="imgSrc"
            alt="Wedding Venue"
            class="main-image"
          />
          <div class="overlay"></div>
          <div class="floating-card">
            <div class="card-content">
              <h3>Đặt Tiệc Ngay</h3>
              <p>Nhận ưu đãi đặc biệt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gọi component khác 
    <Branch />
    <Hall />
    <Menu />
    <Service />
    -->
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Button from '@/components/Button/button.vue'
import "./Home.scss"


// Đường dẫn ảnh, nhớ sửa lại nếu khác
import imgSrc from '@/assets/assets/img_1.png'
</script>

<style lang="scss" scoped>

</style>