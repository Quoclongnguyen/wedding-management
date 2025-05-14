<script setup>
import { ref, computed, onMounted } from "vue";
import { hallApi } from "@/api/hall"; // Giả sử bạn có API cho Sảnh
import { branchApi } from "@/api/branch";

// State
const halls = ref([]);
const currentPage = ref(0);
const searchTerm = ref("");
const searchResults = ref([]);
const confirmationModal = ref(false);
const hallIdToDelete = ref(null);
const addHallModal = ref(false);
const editHallModal = ref(false);
const error = ref([]);
const loading = ref(false);
const successModal = ref(false);
const successMessage = ref("");
const branches = ref([]);

const newHall = ref({
    name: "",
    description: "",
    image: "",
    branchId: "",
    capacity: 0,
    price: 0,
});

const editHall = ref({
    hallId: "",
    name: "",
    description: "",
    image: "",
    branchId: "",
    capacity: 0,
    price: 0,
});

// Fetch halls and branches
const fetchHalls = async () => {
    try {
        loading.value = true;
        const data = await hallApi.getAll();
        halls.value = data;
    } catch (err) {
        console.error("Error fetching halls:", err);
        error.value = ["Lỗi khi tải danh sách sảnh"];
    } finally {
        loading.value = false;
    }
};

const fetchBranches = async () => {
    try {
        const data = await branchApi.getAll();
        branches.value = data;
    } catch (err) {
        console.error("Error fetching branches:", err);
    }
};

// Pagination
const itemsPerPage = 5;
const pageCount = computed(() => Math.ceil(halls.value.length / itemsPerPage));
const offset = computed(() => currentPage.value * itemsPerPage);
const currentItems = computed(() =>
    halls.value.slice(offset.value, offset.value + itemsPerPage)
);

// Search
const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    searchTerm.value = term;
    const filteredResults = halls.value.filter(
        (hall) =>
            hall.name.toLowerCase().includes(term) ||
            hall.description.toLowerCase().includes(term)
    );
    searchResults.value = filteredResults;
};

const displayItems = computed(() =>
    searchTerm.value ? searchResults.value : currentItems.value
);

// Validation
const validate = () => {
    const errors = [];
    if (!newHall.value.name) errors.push("Tên sảnh là bắt buộc");
    if (!newHall.value.description) errors.push("Mô tả là bắt buộc");
    if (!newHall.value.branchId) errors.push("Chi nhánh là bắt buộc");
    if (newHall.value.capacity <= 0) errors.push("Sức chứa phải lớn hơn 0");
    if (newHall.value.price <= 0) errors.push("Giá phải lớn hơn 0");

    error.value = errors;
    return errors.length === 0;
};

// Handle Add
const handleAddHall = async () => {
    if (!validate()) return;

    try {
        loading.value = true;
        await hallApi.create(newHall.value);
        successMessage.value = "Thêm sảnh thành công!";
        successModal.value = true;
        addHallModal.value = false;
        fetchHalls();
        newHall.value = {
            name: "",
            description: "",
            image: "",
            branchId: "",
            capacity: 0,
            price: 0,
        };
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi thêm sảnh"];
    } finally {
        loading.value = false;
    }
};

// Handle Edit
const handleEditHall = async (hallId) => {
    try {
        const hall = await hallApi.getById(hallId);
        editHall.value = { ...hall };
        editHallModal.value = true;
    } catch (err) {
        console.error("Error fetching hall:", err);
    }
};

// Handle Update
const handleUpdateHall = async () => {
    try {
        loading.value = true;
        await hallApi.update(editHall.value.hallId, editHall.value);
        successMessage.value = "Cập nhật sảnh thành công!";
        successModal.value = true;
        editHallModal.value = false;
        fetchHalls();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi cập nhật sảnh"];
    } finally {
        loading.value = false;
    }
};

// Handle Delete
const handleDeleteHall = async () => {
    if (!hallIdToDelete.value) {
        console.error("Không có ID sảnh để xóa");
        return;
    }

    try {
        loading.value = true;
        await hallApi.delete(hallIdToDelete.value); // Gọi API xóa sảnh
        successMessage.value = "Xóa sảnh thành công!";
        successModal.value = true;
        confirmationModal.value = false;
        fetchHalls();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi xóa sảnh"];
    } finally {
        loading.value = false;
    }
};

const confirmDeleteHall = (hallId) => {
    if (hallId) {
        hallIdToDelete.value = hallId;
        confirmationModal.value = true;
    } else {
        console.error("hallId không tồn tại");
    }
};

// Lifecycle
onMounted(() => {
    fetchHalls();
    fetchBranches();
});
</script>
<template>
    <div class="containerHalls">
        <h5 class="card-title">Quản lý sảnh</h5>
        <div class="Timkiem">
            <input class="timkiemHall" placeholder="Tìm kiếm theo tên sảnh" v-model="searchTerm"
                @input="handleSearch" />
            <button class="btnThemSanhhall" @click="addHallModal = true">
                Thêm sảnh mới
            </button>
        </div>

        <div v-if="loading" class="text-center">Đang tải...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sảnh</th>
                    <th>Chi nhánh</th>
                    <th>Sức chứa</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="hall in displayItems" :key="hall.hallId">
                    <td>
                        <img :src="hall.image" alt="Hình ảnh sảnh"
                            style="width: 200px; height: 80px; object-fit: cover;" />
                    </td>
                    <td>{{ hall.name }}</td>
                    <td>{{ hall.branchName }}</td>
                    <td>{{ hall.capacity }} bàn</td>
                    <td>
                        {{ hall.price.toLocaleString() }} VND
                    </td>
                    <td>
                        <button class="btn btn-info btn-sm" @click="handleEditHall(hall.hallId)">
                            Sửa
                        </button>
                        <button class="btn btn-danger btn-sm" @click="confirmDeleteHall(hall.hallId)">
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <nav>
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 0 }"
                    @click="currentPage = Math.max(0, currentPage - 1)">
                    <a class="page-link">Trước</a>
                </li>
                <li class="page-item" v-for="page in pageCount" :key="page"
                    :class="{ active: currentPage === page - 1 }" @click="currentPage = page - 1">
                    <a class="page-link">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === pageCount - 1 }"
                    @click="currentPage = Math.min(pageCount - 1, currentPage + 1)">
                    <a class="page-link">Sau</a>
                </li>
            </ul>
        </nav>

        <!-- Add Hall Modal -->
        <div v-if="addHallModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm sảnh mới</h5>
                        <button type="button" class="btn-close" @click="addHallModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleAddHall">
                            <div class="mb-3">
                                <label for="hallName" class="form-label">Tên sảnh</label>
                                <input type="text" class="form-control" id="hallName" v-model="newHall.name" required />
                            </div>
                            <div class="mb-3">
                                <label for="hallDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="hallDescription" v-model="newHall.description"
                                    required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="hallImage" class="form-label">URL Hình ảnh</label>
                                <input type="text" class="form-control" id="hallImage" v-model="newHall.image" />
                            </div>
                            <div class="mb-3">
                                <label for="hallLocation" class="form-label">Chi nhánh</label>
                                <select class="form-control" v-model="newHall.branchId" required>
                                    <option v-for="branch in branches" :key="branch.branchId" :value="branch.branchId">
                                        {{ branch.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="hallCapacity" class="form-label">Sức chứa</label>
                                <input type="number" class="form-control" v-model="newHall.capacity" required />
                            </div>
                            <div class="mb-3">
                                <label for="hallPrice" class="form-label">Giá</label>
                                <input type="number" class="form-control" v-model="newHall.price" required />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleAddHall" :disabled="loading.value">
                            {{ loading.value ? "Đang xử lý..." : "Thêm" }}
                        </button>
                        <button class="btn btn-secondary" @click="addHallModal = false">Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="editHallModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa sảnh</h5>
                        <button type="button" class="btn-close" @click="editHallModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleUpdateHall">
                            <div class="mb-3">
                                <label for="hallName" class="form-label">Tên sảnh</label>
                                <input type="text" class="form-control" id="hallName" v-model="editHall.name"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="hallDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="hallDescription" v-model="editHall.description"
                                    required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="hallImage" class="form-label">URL Hình ảnh</label>
                                <input type="text" class="form-control" id="hallImage" v-model="editHall.image" />
                            </div>
                            <div class="mb-3">
                                <label for="hallLocation" class="form-label">Chi nhánh</label>
                                <select class="form-control" v-model="editHall.branchId" required>
                                    <option v-for="branch in branches" :key="branch.branchId" :value="branch.branchId">
                                        {{ branch.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="hallCapacity" class="form-label">Sức chứa</label>
                                <input type="number" class="form-control" v-model="editHall.capacity" required />
                            </div>
                            <div class="mb-3">
                                <label for="hallPrice" class="form-label">Giá</label>
                                <input type="number" class="form-control" v-model="editHall.price" required />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleUpdateHall" :disabled="loading.value">
                            {{ loading.value ? "Đang xử lý..." : "Cập nhật" }}
                        </button>
                        <button class="btn btn-secondary" @click="editHallModal = false">Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="confirmationModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xác nhận xóa</h5>
                        <button type="button" class="btn-close" @click="confirmationModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa sảnh này?</p>
                        <button class="btn btn-danger" @click="handleDeleteHall" :disabled="loading.value">
                            {{ loading.value ? "Đang xử lý..." : "Xóa" }}
                        </button>
                        <button class="btn btn-secondary" @click="confirmationModal = false">Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="successModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thành công</h5>
                        <button type="button" class="btn-close" @click="successModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ successMessage }}</p>
                        <button class="btn btn-primary" @click="successModal = false">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.containerHalls {
    max-width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem; 
  
}

.timkiemHall
{
    margin-top: 10px;
    background: #dbdee0;
    border-radius: 8px;
    display: block;
    width: 80%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    border: #dbdee0 1px solid;
}
.btnThemSanhhall
{
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom:  10px;
}

.table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
}


</style>