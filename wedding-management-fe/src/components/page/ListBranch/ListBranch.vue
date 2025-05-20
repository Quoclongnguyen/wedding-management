<!-- filepath: d:\workspace\vue\wedding-vue\wedding-management-main\wedding-management-fe\wedding-management-fe\src\components\page\ListBranch\ListBranch.vue -->
<template>
  <div style="padding: 30px; font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-weight: 600; color: #2c3e50;">Branch List</h1>
      <Spinner v-if="loading" />
    </div>

    <b-row>
      <b-col v-for="branch in branches" :key="branch.branchId" cols="12" md="4" class="mb-4">
        <b-card no-body class="shadow-sm rounded">
          <b-img :src="branch.image" alt="branch.name" class="w-100" style="height: 200px; object-fit: cover;" />
          <b-card-body>
            <h5 class="fw-semibold">{{ branch.name }}</h5>
            <p class="text-secondary mb-1">
              <i class="bi bi-geo-alt-fill me-1"></i>{{ branch.address }}
            </p>
            <p class="text-muted">{{ branch.description }}</p>
            <div class="d-flex justify-content-between">
              <b-button @click="openModal(branch.branchId)" variant="primary">
                <i class="bi bi-chat-left-text me-1"></i>Feedback
              </b-button>
              <b-button variant="outline-primary">Details</b-button>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-modal v-model="showModal" size="lg" title="Branch Feedback" @hide="resetModal" hide-footer>
      <div v-if="feedbackData.length">
        <div v-for="feedback in feedbackData" :key="feedback.feedbackId" class="mb-3 pb-2 border-bottom">
          <div class="d-flex justify-content-between">
            <div>
              <strong>{{ feedback.user?.firstName || 'Unknown' }} {{ feedback.user?.lastName || '' }}</strong>
              <CustomRating :rating="feedback.rating || 0" />
            </div>
            <small class="text-muted">{{ formatDate(feedback.feedbackDate) }}</small>
          </div>
          <p class="mt-2">{{ feedback.content }}</p>
        </div>
      </div>
      <div v-else class="text-center text-muted mb-3">
        No feedback yet.
      </div>

      <hr />

      <h5>Write your feedback</h5>
      <b-form-textarea v-model="userFeedback" placeholder="Enter your feedback..." rows="3" class="mb-2" />
      <div class="d-flex align-items-center justify-content-between">
        <CustomRating v-model:rating="rating" />
        <b-button variant="primary" :disabled="loadingSubmit" @click="submitFeedback">
          <b-spinner v-if="loadingSubmit" small label="Submitting..." class="me-1" />
          {{ loadingSubmit ? 'Submitting...' : 'Submit Feedback' }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { useToast } from 'vue-toastification'
import LoadingOverlay from '@/components/Context/LoadingOverlay.vue'
import CustomRating from '@/components/Context/CustomRating.vue'
import "./ListBranch.scss"

const branches = ref([])
const feedbackData = ref([])
const showModal = ref(false)
const loading = ref(true)
const loadingSubmit = ref(false)
const userFeedback = ref('')
const rating = ref(0)
const currentModalBranchId = ref(null)

const toast = useToast()

onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7296/api/ApiBranch')
    branches.value = await response.json()
  } catch (error) {
    console.error('Error loading branch list:', error)
    toast.error('Failed to load branch list.')
  } finally {
    loading.value = false
  }
})

const openModal = (branchId) => {
  currentModalBranchId.value = branchId
  fetchFeedbacksByBranch(branchId)
  showModal.value = true
}

const fetchFeedbacksByBranch = async (branchId) => {
  try {
    const response = await fetch(`https://localhost:7296/api/feedback/${branchId}`)
    feedbackData.value = await response.json()
  } catch (error) {
    console.error('Error loading feedback for branch:', error)
    toast.error('Failed to load feedback.')
  }
}

const submitFeedback = async () => {
  loadingSubmit.value = true
  const tokenFromCookie = Cookies.get('token_user')
  const decodedToken = jwt_decode(tokenFromCookie)
  const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']

  const feedbackToSubmit = {
    userId,
    content: userFeedback.value,
    rating: rating.value,
    branchId: currentModalBranchId.value,
  }

  try {
    const response = await fetch('https://localhost:7296/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenFromCookie}`,
      },
      body: JSON.stringify(feedbackToSubmit),
    })

    if (response.ok) {
      toast.success('Feedback submitted successfully!')
      showModal.value = false
      userFeedback.value = ''
      rating.value = 0
      fetchFeedbacksByBranch(currentModalBranchId.value)
    } else {
      toast.error('Failed to submit feedback.')
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    toast.error('Failed to submit feedback.')
  } finally {
    loadingSubmit.value = false
  }
}

const resetModal = () => {
  userFeedback.value = ''
  rating.value = 0
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>