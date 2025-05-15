<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import authService from "@/service/auth-service";

// Các biến trạng thái
const username = ref("");
const password = ref("");
const error = ref(""); // Biến để lưu thông báo lỗi
const loading = ref(false);
const router = useRouter();

// Hàm kiểm tra tính hợp lệ của form
const validate = () => {
  if (!username.value.trim()) {
    error.value = "Vui lòng nhập email!";
    return false;
  }
  if (!password.value) {
    error.value = "Vui lòng nhập mật khẩu!";
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.value)) {
    error.value = "Email không hợp lệ!";
    return false;
  }
  return true;
};

// Hàm xử lý đăng nhập
const handleLogin = async () => {
  if (!validate()) return;

  loading.value = true;
  error.value = ""; // Xóa thông báo lỗi trước đó

  try {
    const payload = {
      email: username.value,
      password: password.value,
    };

    console.log("Payload gửi:", payload);

    const response = await axios.post(
      "https://localhost:7296/api/account/SignInAdmin",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200 && response.data.token) {
      const { token, roles } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(roles));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (authService.checkRoleUser()) {
        router.push("/"); // Chuyển hướng đến trang chính
      } else {
        error.value = "Tài khoản không có quyền truy cập!";
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
      }
    }
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.response?.data || err);
    if (err.response) {
      error.value = err.response.data.message || "Đăng nhập thất bại!";
    } else {
      error.value = "Lỗi kết nối server!";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h2 class="text-center">Wedding Management</h2>
          <p class="text-center text-muted">Đăng nhập vào hệ thống quản trị</p>
        </div>

        <!-- Hiển thị lỗi nếu có -->
        <div v-if="error" class="eror-box" show>
          
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
        </div>

        <!-- Form đăng nhập -->
        <b-form @submit.prevent="handleLogin">
          <b-form-group label="Email" label-for="username" class="mb-4">
            <b-form-input
              id="username"
              v-model="username"
              type="email"
              placeholder="Nhập email của bạn"
              :disabled="loading"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Mật khẩu" label-for="password" class="mb-4">
            <b-form-input
              id="password"
              v-model="password"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              :disabled="loading"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100" :disabled="loading">
            <span v-if="loading">
              <i class="bi bi-arrow-clockwise spin me-2"></i> Đang xử lý...
            </span>
            <span v-else>
              <i class="bi bi-box-arrow-in-right me-2"></i> Đăng nhập
            </span>
          </b-button>
        </b-form>

        <div class="text-center mt-4">
          <p class="text-muted">© 2025 Wedding Management.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Thêm các style tùy chỉnh nếu cần */
</style>