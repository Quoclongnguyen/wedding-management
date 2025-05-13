<script setup>
import { ref, computed, onMounted } from "vue";
import { branchApi } from "@/api/branch";

// State
const branches = ref([]);
const currentPage = ref(0);
const searchTerm = ref("");
const searchResults = ref([]);
const confirmationModal = ref(false);
const branchIdToDelete = ref(null);
const addBranchModal = ref(false);
const editBranchModal = ref(false);
const error = ref([]);
const loading = ref(false);
const successModal = ref(false);
const successMessage = ref("");

const newBranch = ref({
    name: "",
    description: "",
    image: "",
    address: "",
    phone: "",
    isLocked: false,
});

const editBranch = ref({
    branchId: "",
    name: "",
    description: "",
    image: "",
    address: "",
    phone: "",
    isLocked: false,
});

// Fetch branches
const fetchBranches = async () => {
    try {
        loading.value = true;
        const data = await branchApi.getAll();
        branches.value = data;
    } catch (err) {
        console.error("Error fetching branches:", err);
        error.value = ["Lỗi khi tải danh sách chi nhánh"];
    } finally {
        loading.value = false;
    }
};

// Pagination
const itemsPerPage = 5;
const pageCount = computed(() => Math.ceil(branches.value.length / itemsPerPage));
const offset = computed(() => currentPage.value * itemsPerPage);
const currentItems = computed(() =>
    branches.value.slice(offset.value, offset.value + itemsPerPage)
);

// Search
const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    searchTerm.value = term;
    searchResults.value = branches.value.filter(
        (branch) =>
            branch.name.toLowerCase().includes(term) ||
            branch.address.toLowerCase().includes(term)
    );
};
const displayItems = computed(() =>
    searchTerm.value ? searchResults.value : currentItems.value
);

// Validation
const validate = () => {
    const errors = [];
    if (!newBranch.value.name) errors.push("Tên chi nhánh là bắt buộc");
    if (!newBranch.value.description) errors.push("Mô tả là bắt buộc");
    if (!newBranch.value.address) errors.push("Địa chỉ là bắt buộc");
    if (!newBranch.value.phone) errors.push("Số điện thoại là bắt buộc");

    error.value = errors;
    return errors.length === 0;
};

// Add branch
const handleAddBranch = async () => {
    if (!validate()) return;

    try {
        loading.value = true;
        await branchApi.create(newBranch.value);
        successMessage.value = "Thêm chi nhánh thành công!";
        successModal.value = true;
        addBranchModal.value = false;
        fetchBranches();
        newBranch.value = {
            name: "",
            description: "",
            image: "",
            address: "",
            phone: "",
            isLocked: false,
        };
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi thêm chi nhánh"];
    } finally {
        loading.value = false;
    }
};

// Edit branch
const handleEditBranch = async (branchId) => {
    try {
        const branch = await branchApi.getById(branchId);
        editBranch.value = { ...branch };
        editBranchModal.value = true;
    } catch (err) {
        console.error("Error fetching branch:", err);
    }
};

// Update branch
const handleUpdateBranch = async () => {
    try {
        loading.value = true;
        await branchApi.update(editBranch.value.branchId, editBranch.value);
        successMessage.value = "Cập nhật chi nhánh thành công!";
        successModal.value = true;
        editBranchModal.value = false;
        fetchBranches();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi cập nhật chi nhánh"];
    } finally {
        loading.value = false;
    }
};

// Delete branch
const handleDeleteBranch = async () => {
    if (!branchIdToDelete.value) {
        console.error("Không có ID chi nhánh để xóa");
        return;
    }

    try {
        loading.value = true;
        await branchApi.delete(branchIdToDelete.value); // Gọi API xóa chi nhánh
        successMessage.value = "Xóa chi nhánh thành công!";
        successModal.value = true;
        confirmationModal.value = false;
        fetchBranches();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi xóa chi nhánh"];
    } finally {
        loading.value = false;
    }
};
const confirmDeleteBranch = (branchId) => {
    if (branchId) {
        branchIdToDelete.value = branchId;
        confirmationModal.value = true;
    } else {
        console.error("branchId không tồn tại");
    }
};


// Lifecycle
onMounted(fetchBranches);
</script>

<template>
    <div>
        <div class="Timkiem">
            <input class="form-control col-3"  placeholder="Tìm kiếm theo tên hoặc địa chỉ" v-model="searchTerm"
                @input="handleSearch"/>
            <button class="btnThemChinhanh" @click="addBranchModal = true">
                Thêm chi nhánh mới
            </button>
        </div>

        <div v-if="loading" class="text-center">Đang tải...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên chi nhánh</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="branch in displayItems" :key="branch.branchId">
                    <td>
                        <img :src="branch.image" alt="Hình ảnh chi nhánh"
                            style="width: 200px; height: 80px; object-fit: cover;" />
                    </td>
                    <td>{{ branch.name }}</td>
                    <td>{{ branch.address }}</td>
                    <td>{{ branch.phone }}</td>
                    <td>
                        <span :class="branch.isLocked ? 'badge bg-danger' : 'badge bg-success'">
                            {{ branch.isLocked ? "Đã khóa" : "Đang hoạt động" }}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-info btn-sm" @click="handleEditBranch(branch.branchId)">
                            Sửa
                        </button>
                        <button class="btn btn-danger btn-sm" @click="confirmDeleteBranch(branch.branchId)">
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

        <!-- Add Branch Modal -->

        <div v-if="addBranchModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm chi nhánh mới</h5>
                        <button type="button" class="btn-close" @click="addBranchModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleAddBranch">
                            <div class="mb-3">
                                <label for="branchName" class="form-label">Tên chi nhánh</label>
                                <input type="text" class="form-control" id="branchName" v-model="newBranch.name"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="branchDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="branchDescription" v-model="newBranch.description"
                                    required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="branchImage" class="form-label">URL Hình ảnh</label>
                                <input type="text" class="form-control" id="branchImage" v-model="newBranch.image" />
                            </div>
                            <div class="mb-3">
                                <label for="branchAddress" class="form-label">Địa chỉ</label>
                                <input type="text" class="form-control" id="branchAddress" v-model="newBranch.address"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="branchPhone" class="form-label">Số điện thoại</label>
                                <input type="text" class="form-control" id="branchPhone" v-model="newBranch.phone"
                                    required />
                            </div>
                            <button type="submit" class="btn btn-primary" :disabled="loading.value">Thêm</button>
                            <button type="button" class="btn btn-secondary" @click="addBranchModal = false">Hủy</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <!-- Edit Branch Modal -->
        <div v-if="editBranchModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa chi nhánh</h5>
                        <button type="button" class="btn-close" @click="editBranchModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleUpdateBranch">
                            <div class="mb-3">
                                <label for="editBranchName" class="form-label">Tên chi nhánh</label>
                                <input type="text" class="form-control" id="editBranchName" v-model="editBranch.name"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="editBranchDescription" class="form-label">Mô tả</label>
                                <textarea class="form-control" id="editBranchDescription"
                                    v-model="editBranch.description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="editBranchImage" class="form-label">URL Hình ảnh</label>
                                <input type="text" class="form-control" id="editBranchImage"
                                    v-model="editBranch.image" />
                            </div>
                            <div class="mb-3">
                                <label for="editBranchAddress" class="form-label">Địa chỉ</label>
                                <input type="text" class="form-control" id="editBranchAddress"
                                    v-model="editBranch.address" required />
                            </div>
                            <div class="mb-3">
                                <label for="editBranchPhone" class="form-label">Số điện thoại</label>
                                <input type="text" class="form-control" id="editBranchPhone" v-model="editBranch.phone"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="editBranchStatus" class="form-label">Trạng thái</label>
                                <select class="form-control" id="editBranchStatus" v-model="editBranch.isLocked">
                                    <option :value="false">Đang hoạt động</option>
                                    <option :value="true">Đã khóa</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary" :disabled="loading.value">Cập nhật</button>
                            <button type="button" class="btn btn-secondary"
                                @click="editBranchModal = false">Hủy</button>
                        </form>
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
                        <p>Bạn có chắc chắn muốn xóa chi nhánh này?</p>
                        <button class="btn btn-danger" @click="handleDeleteBranch"
                            :disabled="loading.value">Xóa</button>
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
/* Add your styles here */
.Timkiem {
    display: flexbox;
    border-radius: 10px;
    width: 80%;
}
.Timkiem .btnThemChinhanh {

    display: flexbox;
    color: white;
    
    background: #2962ff;
    width: 20%;
    border-radius: 8px;
}
</style>
