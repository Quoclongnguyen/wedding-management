<template>
  <div class="profile">
    <div class="title">
      <h1>Thông tin cá nhân</h1>
    </div>
    <div v-if="loading" class="overlay">
      <span class="spinner-border"></span>
    </div>
    <div v-else>
      <div v-if="isLoggedIn" class="container emp-profile">
        <form>
          <div class="row profile_avatar">
            <div class="col-md-8 profile_detail">
              <div>
                <label for="first-name" class="form-label"><b>Tên</b></label>
                <p>{{ firstName }}</p>
              </div>
              <div>
                <label for="last-name" class="form-label"><b>Họ</b></label>
                <p>{{ lastName }}</p>
              </div>
              <div>
                <label for="email" class="form-label"><b>Email</b></label>
                <p>{{ email }}</p>
              </div>
              <div>
                <label for="phone-number" class="form-label"><b>Số điện thoại</b></label>
                <p>{{ phoneNumber || "Chưa nhập số điện thoại" }}</p>
              </div>
              <button class="btn btn-dark" @click="openModal">Cập nhật thông tin</button>
            </div>
          </div>
        </form>
      </div>
      <div v-else class="container emp-profile">
        <p class="text-center mt-3">Người dùng chưa đăng nhập.</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cập nhật thông tin</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="first-name" class="form-label">Tên</label>
                <input type="text" class="form-control" v-model="firstNameUpdate" />
              </div>
              <div class="mb-3">
                <label for="last-name" class="form-label">Họ</label>
                <input type="text" class="form-control" v-model="lastNameUpdate" />
              </div>
              <div class="mb-3">
                <label for="phone-number" class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control" v-model="phoneNumber" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import Cookies from "js-cookie"

import jwt_decode from "jwt-decode"


import { useToast } from "vue-toastification"

const loading = ref(true)
const isLoggedIn = ref(false)
const showModal = ref(false)
const toast = useToast()

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const phoneNumber = ref("")
const wallet = ref(null)
const error = ref(null)

const firstNameUpdate = ref("")
const lastNameUpdate = ref("")

const openModal = () => {
  firstNameUpdate.value = firstName.value
  lastNameUpdate.value = lastName.value
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSubmit = async () => {
  const profileData = {
    firstName: firstNameUpdate.value,
    lastName: lastNameUpdate.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
  }

  try {
    const response = await fetch("https://localhost:7296/api/account/Update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`)
    }

    const data = await response.json()
    toast.success("Cập nhật thành công!")
    firstName.value = data.firstName
    lastName.value = data.lastName
    phoneNumber.value = data.phoneNumber
    closeModal()
  } catch (err) {
    console.error("Error updating profile:", err)
    toast.error("Cập nhật thất bại!")
  }
}

onMounted(async () => {
  const tokenFromCookie = Cookies.get("token_user")
  let decodedToken = null

  if (tokenFromCookie) {
    decodedToken = jwt_decode(tokenFromCookie)
    isLoggedIn.value = true
  }

  if (!decodedToken) {
    isLoggedIn.value = false
    loading.value = false
    return
  }

  const userId =
    decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ]

  firstName.value =
    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  lastName.value =
    decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
    ]
  email.value =
    decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ]
  phoneNumber.value =
    decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"
    ]

  if (userId) {
   try {
  const response = await fetch(
    `https://localhost:7296/api/account/GetInFoUserById?id=${userId}`
  )
  if (!response.ok) {
    if (response.status === 404) {
      toast.error("Người dùng không tồn tại!")
    } else {
      throw new Error("Failed to fetch user info")
    }
  } else {
    const data = await response.json()
    firstName.value = data.firstName
    lastName.value = data.lastName
    phoneNumber.value = data.phone
  }
} catch (err) {
  console.error("Error fetching user info:", err)
  error.value = err.message
}
  }

  loading.value = false
})
</script>

<style scoped>
@import "./Profile.scss";

.profile .title {
  text-align: center;
  margin-bottom: 20px;
}

.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.modal {
  display: block;
}
</style>