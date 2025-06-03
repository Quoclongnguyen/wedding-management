<template>
  <div class="menu" id="menu">
    <div class="menu__container container">
      <div class="menu__header">
        <span class="elegant-text">
          <fa-utensils class="icon" />
          Ẩm Thực Tinh Tế
        </span>
        <h1>THỰC ĐƠN ĐẶC SẮC</h1>
        <p class="menu-description">
          Trải nghiệm ẩm thực đỉnh cao với những món ăn được chế biến bởi 
          đội ngũ đầu bếp tài năng, kết hợp giữa hương vị truyền thống và 
          phong cách hiện đại.
        </p>
        <router-link to="/listmenu">
          <Button>Khám Phá Thực Đơn</Button>
        </router-link>
      </div>

      <div class="menu__content">
        <ul class="menu__list">
          <li class="menu__item" v-for="(item, index) in initialFood" :key="item.title">
            <div class="menu__item--img">
              <img :src="item.img_url" :alt="item.title" />
              <div class="overlay">
                <span class="number">0{{ index + 1 }}</span>
              </div>
            </div>
            <div class="menu__item--content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <div class="tags">
                <span class="tag">Đặc sắc</span>
                <span class="tag">Cao cấp</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../Button/button.vue'
import img6 from '@/assets/assets/img_6.png'
import img5 from '@/assets/assets/img_5.png'
import img4 from '@/assets/assets/img_4.png'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'

// Đăng ký icon nếu chưa đăng ký toàn cục
const initialFood = [
  {
    title: "Gỏi Hải Sản Premium",
    img_url: img6,
    desc: "Tinh hoa ẩm thực biển kết hợp với nghệ thuật trang trí hiện đại"
  },
  {
    title: "Súp Hải Sản Hoàng Đế",
    img_url: img5,
    desc: "Hương vị đậm đà với nguyên liệu cao cấp tuyển chọn"
  },
  {
    title: "Bò Wagyu Nướng",
    img_url: img4,
    desc: "Thịt bò Wagyu thượng hạng kết hợp với công thức độc quyền"
  }
]
</script>

<script>
// Đăng ký FontAwesome nếu bạn chưa đăng ký toàn cục
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
library.add(faUtensils)
</script>

<style scoped src="./Menu.scss"></style>