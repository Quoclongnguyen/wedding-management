<template>
    <div style="padding: 30px; font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-weight: 600; color: #2c3e50;">Branch List</h1>
            <!-- Spinner hiển thị khi đang tải dữ liệu chi nhánh -->
            <Spinner v-if="loading" />
        </div>

        <!-- Danh sách chi nhánh hiển thị theo lưới -->
        <b-row>
            <b-col v-for="branch in branches" :key="branch.branchId" cols="12" md="4" class="mb-4">
                <b-card no-body class="shadow-sm rounded">
                    <!-- Ảnh chi nhánh -->
                    <b-img :src="branch.image" alt="branch.name" class="w-100"
                        style="height: 200px; object-fit: cover;" />
                    <b-card-body>
                        <h5 class="fw-semibold">{{ branch.name }}</h5>
                        <p class="text-secondary mb-1">
                            <i class="bi bi-geo-alt-fill me-1"></i>{{ branch.address }}
                        </p>
                        <p class="text-muted">{{ branch.description }}</p>
                        <div class="d-flex justify-content-between">
                            <!-- Nút mở modal nhập phản hồi -->
                            <b-button @click="openModal(branch.branchId)" variant="primary">
                                <i class="bi bi-chat-left-text me-1"></i>Feedback
                            </b-button>
                            <b-button variant="outline-primary">Details</b-button>
                        </div>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>

        <!-- Modal hiển thị phản hồi cho chi nhánh -->
        <b-modal v-model="showModal" size="lg" title="Branch Feedback" @hide="resetModal" hide-footer>
            <!-- Nếu có phản hồi, lặp qua feedbackData -->
            <div v-if="feedbackData.length">
                <div v-for="feedback in feedbackData" :key="feedback.feedbackId" class="mb-3 pb-2 border-bottom">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>{{ feedback.user?.firstName || 'Unknown' }} {{ feedback.user?.lastName || ''
                            }}</strong>
                            <star-rating v-model:rating="feedback.rating"
                                readonly
                                :star-size="20"
                                active-color="#ffc107"
                                />
                        </div>
                        <small class="text-muted">{{ formatDate(feedback.feedbackDate) }}</small>
                    </div>
                    <p class="mt-2">{{ feedback.content }}</p>
                </div>
            </div>
            <!-- Nếu chưa có phản hồi nào -->
            <div v-else class="text-center text-muted mb-3">
                No feedback yet.
            </div>

            <hr />

            <!-- Form nhập phản hồi mới -->
            <h5>Write your feedback</h5>
            <b-form-textarea v-model="userFeedback" placeholder="Enter your feedback..." rows="3" class="mb-2" />
            <div class="d-flex align-items-center justify-content-between">
                <star-rating v-model="rating" :star-size="24" active-color="#ffc107" />
                <!-- Nút gửi phản hồi, hiển thị spinner khi loading -->
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
import StarRating from 'vue3-star-ratings'
import Spinner from '@/components/common/Spinner.vue'
import "./ListBranch.scss"

// State variables
const branches = ref([])
const feedbackData = ref([])
const showModal = ref(false)
const loading = ref(true)
const loadingSubmit = ref(false)
const userFeedback = ref('')
const rating = ref(0)
const currentModalBranchId = ref(null)

const toast = useToast()

// Hàm khởi chạy khi component được mount: fetch danh sách chi nhánh
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

// Mở modal và fetch feedback cho chi nhánh
const openModal = (branchId) => {
    currentModalBranchId.value = branchId
    fetchFeedbacksByBranch(branchId)
    showModal.value = true
}

// Fetch dữ liệu feedback cho chi nhánh
const fetchFeedbacksByBranch = async (branchId) => {
    try {
        const response = await fetch(`https://localhost:7296/api/feedback/${branchId}`)
        feedbackData.value = await response.json()
    } catch (error) {
        console.error('Error loading feedback for branch:', error)
        toast.error('Failed to load feedback.')
    }
}

// Gửi phản hồi mới lên server
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

// Reset state khi đóng modal
const resetModal = () => {
    userFeedback.value = ''
    rating.value = 0
}

// Chuyển đổi date string thành định dạng locale để hiển thị
const formatDate = (date) => {
    return new Date(date).toLocaleString()
}
</script>

<style scoped>
.star-rating .star {
    color: #ffc107 !important;
    /* Màu vàng */
}
</style>
