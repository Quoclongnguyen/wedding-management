<template>
  <div class="spinner"></div>
</template>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 5px solid rgba(0,0,0,0.1);
  border-top-color: #fe8e5c; /* Màu sắc bạn muốn */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
