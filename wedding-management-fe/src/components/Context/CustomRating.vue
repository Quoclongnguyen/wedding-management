<template>
  <div class="custom-rating">
    <FontAwesomeIcon
      v-for="i in 5"
      :key="i"
      :icon="getIcon(i)"
      :style="{ color: i <= props.rating ? 'gold' : 'gray', cursor: 'pointer' }"
      @click="handleRatingChange(i)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
})

const emit = defineEmits(['update:rating'])

const handleRatingChange = (newRating) => {
  emit('update:rating', newRating)
}

const getIcon = (i) => {
  if (i <= props.rating) {
    return faStar
  } else if (i - 0.5 === props.rating) {
    return faStarHalfAlt
  } else {
    return faStar
  }
}
</script>

<style scoped>
.custom-rating {
  display: flex;
  gap: 5px;
}
</style>
