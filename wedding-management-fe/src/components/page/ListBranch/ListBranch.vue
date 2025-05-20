<template>
  <div class="branch-list-container">
    <div class="header">
      <h1>Branch List</h1>
      <LoadingOverlay v-if="loading" />
    </div>

    <b-row>
      <b-col
        v-for="branch in branches"
        :key="branch.branchId"
        cols="12"
        md="4"
        class="mb-4"
      >
        <b-card no-body class="shadow-sm rounded">
          <b-img
            :src="branch.image"
            :alt="branch.name"
            class="branch-image"
          />
          <b-card-body>
            <h5 class="branch-name">{{ branch.name }}</h5>
            <p class="branch-address">
              <i class="bi bi-geo-alt-fill me-1"></i>{{ branch.address }}
            </p>
            <p class="branch-description">{{ branch.description }}</p>
            <div class="button-group">
              <b-button @click="openModal(branch.branchId)" variant="primary">
                <i class="bi bi-chat-left-text me-1"></i>Feedback
              </b-button>
              <b-button variant="outline-primary">Details</b-button>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-modal
      v-model="showModal"
      size="lg"
      title="Branch Feedback"
      @hide="resetModal"
      hide-footer
    >
      <div v-if="feedbackData.length">
        <div
          v-for="feedback in feedbackData"
          :key="feedback.feedbackId"
          class="feedback-item"
        >
          <div class="feedback-header">
            <strong>{{ feedback.user?.firstName || 'Unknown' }} {{ feedback.user?.lastName || '' }}</strong>
            <CustomRating :rating="feedback.rating || 0" />
            <small class="feedback-date">{{ formatDate(feedback.feedbackDate) }}</small>
          </div>
          <p class="feedback-content">{{ feedback.content }}</p>
        </div>
      </div>
      <div v-else class="no-feedback">
        No feedback yet.
      </div>

      <hr />

      <h5>Write your feedback</h5>
      <b-form-textarea
        v-model="userFeedback"
        placeholder="Enter your feedback..."
        rows="3"
        class="mb-2"
      />
      <div class="feedback-form">
        <CustomRating v-model:rating="rating" />
        <b-button
          variant="primary"
          :disabled="loadingSubmit"
          @click="submitFeedback"
        >
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
import './ListBranch.scss'

const branches = ref([])
const feedbackData = ref([])
const showModal = ref(false)
const loading = ref(true)
const loadingSubmit = ref(false)
const userFeedback = ref('')
const rating = ref(0)
const currentModalBranchId = ref(null)

const toast = useToast()

// Fetch branch list on mount
onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7296/api/ApiBranch')
    if (!response.ok) throw new Error('Failed to fetch branches')
    branches.value = await response.json()
  } catch (error) {
    console.error('Error loading branch list:', error)
    toast.error('Failed to load branch list.')
  } finally {
    loading.value = false
  }
})

// Open feedback modal
const openModal = (branchId) => {
  currentModalBranchId.value = branchId
  fetchFeedbacksByBranch(branchId)
  showModal.value = true
}

// Fetch feedbacks for a branch
const fetchFeedbacksByBranch = async (branchId) => {
  try {
    const response = await fetch(`https://localhost:7296/api/feedback/${branchId}`)
    if (!response.ok) throw new Error('Failed to fetch feedbacks')
    feedbackData.value = await response.json()
  } catch (error) {
    console.error('Error loading feedback for branch:', error)
    toast.error('Failed to load feedback.')
  }
}

// Submit feedback
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

    if (!response.ok) throw new Error('Failed to submit feedback')
    toast.success('Feedback submitted successfully!')
    showModal.value = false
    resetModal()
    fetchFeedbacksByBranch(currentModalBranchId.value)
  } catch (error) {
    console.error('Error submitting feedback:', error)
    toast.error('Failed to submit feedback.')
  } finally {
    loadingSubmit.value = false
  }
}

// Reset modal state
const resetModal = () => {
  userFeedback.value = ''
  rating.value = 0
}

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.branch-list-container {
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8f9fa;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.branch-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.branch-name {
  font-weight: 600;
}

.branch-address {
  color: #6c757d;
}

.branch-description {
  color: #adb5bd;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.feedback-item {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.feedback-content {
  margin-top: 10px;
}

.no-feedback {
  text-align: center;
  color: #adb5bd;
}

.feedback-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
