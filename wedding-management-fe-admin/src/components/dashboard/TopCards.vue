<template>
  <div class="card" style="height: 100%;">
    <div class="card-body p-4">
      <div class="d-flex align-items-center">
        <div>
          <h3 class="mb-0 display-6 font-weight-bold">{{ earning }}</h3>
          <div class="text-muted mt-3" style="font-size: 1.1rem;">
            {{ title }}
          </div>
          <span :class="`text-${subtitle} fs-3 mt-2`">
            {{ subtitle }}
          </span>
        </div>
        <div class="ms-auto">
          <i :class="`${icon} fs-1 text-muted`"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Định nghĩa các props
defineProps({
  earning: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* Thêm style nếu cần */
</style>