<template>
  <div>
    <div class="page-header mb-4">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="page-title">
                <i class="bi bi-receipt me-2"></i>
                Quản lý đánh giá
              </h2>
              <p class="text-muted">Quản lý thông tin đánh giá</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="card main-card">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <div class="col-4">
                <input
                  class="form-control"
                  placeholder="Tìm kiếm theo nội dung hoặc email"
                  v-model="searchTerm"
                  @input="handleSearch"
                />
              </div>
              <div class="col-4">
                <select
                  class="form-control"
                  v-model="selectedBranch"
                  @change="handleBranchChange"
                >
                  <option v-for="branch in branches" :key="branch.branchId" :value="branch.branchId">
                    {{ branch.name }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="loading" class="text-center">Đang tải...</div>

            <div v-else>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Người đánh giá</th>
                      <th>Thời gian</th>
                      <th>Nội dung</th>
                      <th>Đánh giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="feedback in displayItems" :key="feedback.feedbackId">
                      <td>{{ feedback.user?.email }}</td>
                      <td>{{ formatDate(feedback.feedbackDate) }}</td>
                      <td>{{ feedback.content }}</td>
                      <td>
                        <div class="text-warning">
                          <i
                            v-for="n in Math.round(feedback.rating || 0)"
                            :key="n"
                            class="bi bi-star-fill me-1"
                          ></i>
                        </div>
                      </td>
                      <td>
                        <button
                          class="btn btn-danger btn-sm"
                          @click="openDeleteModal(feedback.feedbackId)"
                        >
                          Ẩn
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <nav v-if="pageCount > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="handlePageClick(currentPage - 1)" :disabled="currentPage === 0">
                    Trước
                  </button>
                </li>
                <li
                  class="page-item"
                  v-for="page in pageCount"
                  :key="page"
                  :class="{ active: currentPage === page - 1 }"
                >
                  <button class="page-link" @click="handlePageClick(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === pageCount - 1 }">
                  <button class="page-link" @click="handlePageClick(currentPage + 1)" :disabled="currentPage === pageCount - 1">
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="confirmationModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận ẩn</h5>
            <button type="button" class="btn-close" @click="confirmationModal = false"></button>
          </div>
          <div class="modal-body">
            Bạn có chắc chắn muốn ẩn đánh giá này?
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" @click="handleDeleteFeedback" :disabled="loading">
              {{ loading ? "Đang xử lý..." : "Ẩn" }}
            </button>
            <button class="btn btn-secondary" @click="confirmationModal = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="successModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body text-center text-success">
            <i class="bi bi-check-circle-fill fs-1"></i>
            <p class="mt-2">{{ successMessage }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="successModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { feedbackApi } from '../../api/feedback';
import { branchApi } from '../../api/branch';

// State variables
const feedbacks = ref([]);
const branches = ref([]);
const currentPage = ref(0);
const searchTerm = ref('');
const searchResults = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedBranch = ref('');
const confirmationModal = ref(false);
const feedbackIdToDelete = ref(null);
const successModal = ref(false);
const successMessage = ref('');

// Fetch feedbacks when branch changes
const fetchFeedbacks = async (branchId) => {
  try {
    loading.value = true;
    const data = await feedbackApi.getByBranch(branchId);
    feedbacks.value = data;
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    error.value = 'Lỗi khi tải danh sách đánh giá';
  } finally {
    loading.value = false;
  }
};

// Fetch branches
const fetchBranches = async () => {
  try {
    const data = await branchApi.getAll();
    branches.value = data;
    if (data.length > 0) {
      selectedBranch.value = data[0].branchId; // Set default selected branch
    }
  } catch (err) {
    console.error('Error fetching branches:', err);
    error.value = 'Lỗi khi tải danh sách chi nhánh';
  }
};

// Handle page change
const handlePageClick = (page) => {
  currentPage.value = page;
};

// Handle search functionality
const handleSearch = () => {
  const term = searchTerm.value.toLowerCase();
  searchResults.value = feedbacks.value.filter(
    (feedback) =>
      feedback.content?.toLowerCase().includes(term) ||
      feedback.user?.email?.toLowerCase().includes(term)
  );
};

// Calculate page count and current page items
const pageCount = computed(() => Math.ceil(feedbacks.value.length / 5));
const displayItems = computed(() => {
  return searchTerm.value ? searchResults.value : feedbacks.value.slice(currentPage.value * 5, (currentPage.value + 1) * 5);
});

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN');
};

// Open delete modal
const openDeleteModal = (feedbackId) => {
  feedbackIdToDelete.value = feedbackId;
  confirmationModal.value = true;
};

// Handle delete feedback
const handleDeleteFeedback = async () => {
  try {
    loading.value = true;
    await feedbackApi.delete(feedbackIdToDelete.value);
    successMessage.value = 'Ẩn đánh giá thành công!';
    successModal.value = true;
    confirmationModal.value = false;
    fetchFeedbacks(selectedBranch.value); // Refresh the feedback list
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi khi ẩn đánh giá';
  } finally {
    loading.value = false;
  }
};

// Fetch initial data on mounted
onMounted(() => {
  fetchBranches();
  if (selectedBranch.value) {
    fetchFeedbacks(selectedBranch.value);
  }
});
</script>

<style scoped>
/* Add your custom styles here */
</style>