<template>
  <div class="register-page">
    <div class="register-form-container">
      <h2 class="title">Đăng Ký Tài Khoản</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group" v-for="field in fields" :key="field.name">
          <label class="form-label">{{ field.label }}</label>
          <div class="input-group">
            <component :is="field.icon" class="input-icon" />
            <input
              :type="field.type"
              class="form-control"
              :name="field.name"
              v-model="formValue[field.name]"
              :placeholder="field.placeholder"
            />
          </div>
          <div v-if="formError[field.name]" class="error">{{ formError[field.name] }}</div>
        </div>

        <button type="submit" class="register-button" :disabled="isSubmitting">
          {{ isSubmitting ? "Đang xử lý..." : "Đăng Ký" }}
        </button>

        <div class="login-link">
          Đã có tài khoản?
          <RouterLink to="/login">Đăng nhập ngay</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useRouter, RouterLink } from "vue-router"
import { useToast } from "vue-toastification"
import Cookies from "js-cookie"

// Icons from FontAwesome Vue 3
import { faUser, faEnvelope, faLock, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)

const formValue = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: ""
})

const formError = reactive({})

const fields = [
  { name: "firstName", label: "Họ", type: "text", placeholder: "Nhập họ", icon: FontAwesomeIcon, iconProps: { icon: faUser } },
  { name: "lastName", label: "Tên", type: "text", placeholder: "Nhập tên", icon: FontAwesomeIcon, iconProps: { icon: faUser } },
  { name: "email", label: "Email", type: "email", placeholder: "Nhập email", icon: FontAwesomeIcon, iconProps: { icon: faEnvelope } },
  { name: "password", label: "Mật khẩu", type: "password", placeholder: "Nhập mật khẩu", icon: FontAwesomeIcon, iconProps: { icon: faLock } },
  { name: "confirmPassword", label: "Xác nhận mật khẩu", type: "password", placeholder: "Xác nhận mật khẩu", icon: FontAwesomeIcon, iconProps: { icon: faLock } },
  { name: "phoneNumber", label: "Số điện thoại", type: "tel", placeholder: "Nhập số điện thoại", icon: FontAwesomeIcon, iconProps: { icon: faPhone } },
]

function isEmptyValue(value) {
  return !value || value.trim().length < 1
}

function isEmailValid(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
}

function isPhoneValid(phone) {
  return /^[0-9]{10}$/.test(phone)
}

function isStrongPassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  return strongPasswordRegex.test(password)
}

function validateForm() {
  const error = {}

  if (isEmptyValue(formValue.firstName)) error.firstName = "Vui lòng nhập họ"
  if (isEmptyValue(formValue.lastName)) error.lastName = "Vui lòng nhập tên"

  if (isEmptyValue(formValue.email)) error.email = "Vui lòng nhập email"
  else if (!isEmailValid(formValue.email)) error.email = "Email không hợp lệ"

  if (isEmptyValue(formValue.password)) error.password = "Vui lòng nhập mật khẩu"
  else if (!isStrongPassword(formValue.password))
    error.password =
      "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"

  if (isEmptyValue(formValue.confirmPassword)) error.confirmPassword = "Vui lòng xác nhận mật khẩu"
  else if (formValue.confirmPassword !== formValue.password) error.confirmPassword = "Mật khẩu xác nhận không khớp"

  if (isEmptyValue(formValue.phoneNumber)) error.phoneNumber = "Vui lòng nhập số điện thoại"
  else if (!isPhoneValid(formValue.phoneNumber)) error.phoneNumber = "Số điện thoại không hợp lệ"

  Object.assign(formError, error)
  return Object.keys(error).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await fetch("https://localhost:7296/api/account/SignUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValue),
    })

    if (response.ok) {
      toast.success("Đăng ký thành công!")
      router.push("/login")
    } else if (response.status === 401) {
      toast.error(
        "Mật khẩu phải đáp ứng các yêu cầu sau:\n- Ít nhất 6 ký tự\n- Ít nhất 1 chữ hoa (A-Z)\n- Ít nhất 1 chữ thường (a-z)\n- Ít nhất 1 số (0-9)\n- Ít nhất 1 ký tự đặc biệt (!@#$%^&*)",
        { position: "top-center", autoClose: 5000, style: { whiteSpace: "pre-line" } }
      )
    } else {
      toast.error("Đăng ký thất bại!")
    }
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi đăng ký!")
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
@import "./Register.scss";
</style>