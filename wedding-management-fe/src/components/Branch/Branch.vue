<template>
  <div class="branch" id="branch">
    <div class="branch__container container">
      <div class="branch__left">
        <div class="image-wrapper">
          <img :src="imgSrc" alt="Chi nhánh" />
          <div class="image-overlay"></div>
        </div>
      </div>
      <div class="branch__right">
        <div class="content-wrapper">
          <span class="elegant-text">Hệ Thống Chi Nhánh</span>
          <h1>TIỆC CƯỚI SANG TRỌNG<br />KHẮP MỌI MIỀN</h1>
          <div class="description">
            <p class="main-desc">
              Hệ thống nhà hàng tiệc cưới của chúng tôi tự hào hiện diện tại nhiều
              vị trí đắc địa trên toàn quốc, mang đến sự thuận tiện tối đa cho quý khách.
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>Vị trí đắc địa, dễ dàng tiếp cận</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-building"></i>
                <span>Không gian rộng rãi, thiết kế hiện đại</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-car"></i>
                <span>Bãi đỗ xe rộng rãi, an toàn</span>
              </div>
            </div>
          </div>
          <div class="cta-wrapper">
            <router-link to="/listbranch">
              <Button class="explore-btn">KHÁM PHÁ CHI NHÁNH</Button>
            </router-link>
            <div class="stats">
              <div class="stat-item">
                <span class="number">10+</span>
                <span class="label">Chi Nhánh</span>
              </div>
              <div class="stat-item">
                <span class="number">1000+</span>
                <span class="label">Tiệc Cưới</span>
              </div>
              <div class="stat-item">
                <span class="number">98%</span>
                <span class="label">Hài Lòng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../Button/button.vue'
import imgSrc from '@/assets/assets/img_2.png'
</script>

<style scoped src="./Branch.scss"></style>