<script setup>
import { ref, provide, inject } from 'vue'
import Cookies from 'js-cookie'
import { useToast } from 'vue-toastification'

const toast = useToast()

// State variables
const token = ref(null)
const firstName = ref(null)
const avatar = ref(null)
const email = ref(null)
const id = ref(null)

// Login function
const login = (userToken, userFirstName, userEmail, userAvatar) => {
  token.value = userToken
  firstName.value = userFirstName
  email.value = userEmail
  avatar.value = userAvatar
  Cookies.set('token_user', userToken)
}

// Logout function
const logout = () => {
  toast.success('Đăng xuất thành công!', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
  Cookies.remove('token_user')
  token.value = null
  firstName.value = null
  email.value = null
  avatar.value = null
}

// Provide the context
provide('auth', {
  token,
  firstName,
  avatar,
  email,
  id,
  login,
  logout,
})
</script>

<template>
  <!-- Render the slot to allow child components -->
  <slot />
</template>