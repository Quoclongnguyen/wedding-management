<template>
  <nav class="nav navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div class="container nav__container">
      <RouterLink class="nav__logo" to="/" style="margin-right:6px">
        Wedding
      </RouterLink>
 

      <div class="collapse navbar-collapse" id="basic-navbar-nav">
        <ul class="navbar-nav mx-auto nav__links">
          <li class="nav-item">
            <RouterLink class="nav-link text-black me-3 fw-bold mt-1" to="/">
              Trang chủ
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link text-black me-3 fw-bold mt-1" to="/listhall">
              Sảnh cưới
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link text-black me-3 fw-bold mt-1" to="/listbranch">
              Chi nhánh
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link text-black me-3 fw-bold mt-1" to="/listmenu">
              Thực đơn
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link text-black me-3 fw-bold mt-1" to="/listservice">
              Dịch vụ
            </RouterLink>
          </li>
        </ul>

        <ul class="navbar-nav nav__user-links">
          <template v-if="token">
            <li class="nav-item">
              <RouterLink
                class="nav-link text-black me-3 fw-bold mt-1"
                to="/profile"
                title="Thông tin cá nhân"
              >
                <font-awesome-icon :icon="['fas', 'circle-user']" />
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                class="nav-link text-black fw-bold mt-1"
                to="/history"
                title="Lịch sử đặt tiệc"
              >
                <font-awesome-icon icon="clipboard" />
              </RouterLink>
            </li>
            <li class="nav-item" style="margin-left:15px">
              <RouterLink
                class="nav-link text-black fw-bold mt-1"
                to="/bill"
                title="Đặt tiệc"
              >
               <font-awesome-icon icon="bell" />
              </RouterLink>
            </li>
            <li class="nav-item">
              <button
                @click="handleLogout"
                class="nav-link text-black me-3 fw-bold mt-1 btn btn-link"
                style="width: 100px; margin-left: -6px"
              >
                Đăng Xuất
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink
                class="nav-link text-black me-3 fw-bold mt-1"
                to="/login"
              >
                Đăng Nhập
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue"
import { RouterLink, useRouter } from "vue-router"
import Cookies from "js-cookie"
import "./Header.scss"

const token = ref(Cookies.get("token_user"))
const router = useRouter()

const handleLogout = () => {
  Cookies.remove("token_user") // xóa token khỏi cookie
  token.value = null // cập nhật giá trị token trong Vue
  router.push("/") // chuyển về trang chủ
}
</script>