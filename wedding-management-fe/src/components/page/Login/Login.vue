<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-content">
        <div class="login-header">
          <h2 class="title">Đăng Nhập</h2>
          <p class="subtitle">Chào mừng bạn trở lại</p>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-group">
              <font-awesome-icon icon="envelope" class="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                v-model="formData.email"
                required
                class="form-control"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu</label>
            <div class="input-group">
              <font-awesome-icon icon="lock" class="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                v-model="formData.password"
                required
                class="form-control"
              />
            </div>
          </div>
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <RouterLink to="/forgot-password" class="forgot-password">
              Quên mật khẩu?
            </RouterLink>
          </div>
          <button type="submit" class="login-button" :disabled="isLoading">
            <template v-if="isLoading">
              <div class="spinner-container">
                <span class="spinner"></span>
                <span>Đang xử lý...</span>
              </div>
            </template>
            <template v-else>Đăng Nhập</template>
          </button>
          <div class="divider"><span>Hoặc</span></div>
          <div class="register-link">
            <p>Chưa có tài khoản?</p>
            <RouterLink to="/register" class="register-button">
              <font-awesome-icon icon="user-plus" class="icon" />
              <span>Đăng Ký Ngay</span>
            </RouterLink>
          </div>
        </form>
      </div>
      <div class="login-image">
        <div class="image-overlay"></div>
        <img :src="loginImage" alt="Login" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Cookies from 'js-cookie'
import { useToast } from 'vue-toastification'
import loginImg from '@/assets/assets/login.png'
import "./login.scss";

const router = useRouter()
const toast = useToast()

const formData = ref({
  email: '',
  password: '',
})
const isLoading = ref(false)
const rememberMe = ref(false)

const loginImage = loginImg

onMounted(() => {
  const token = Cookies.get('token_user')
  if (token) {
    try {
      router.push('/')
    } catch (error) {
      console.error('Invalid token:', error)
    }
  }
})

const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://localhost:7296/api/account/SignIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    })
    if (response.ok) {
      const data = await response.json()
      const token = data.token
      if (rememberMe.value) {
        Cookies.set('token_user', token, { expires: 7 })
      } else {
        Cookies.set('token_user', token)
      }
      toast.success('Đăng nhập thành công!', { position: 'top-right', timeout: 3000 })
      router.push('/')
    } else {
      toast.error('Đăng nhập thất bại!', { position: 'top-right', timeout: 3000 })
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error)
    toast.error('Lỗi mạng hoặc server!', { position: 'top-right', timeout: 3000 })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Style mày giữ nguyên hoặc chỉnh sửa tùy thích */
</style>
