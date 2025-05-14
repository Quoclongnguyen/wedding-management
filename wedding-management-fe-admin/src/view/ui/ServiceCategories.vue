<script setup>
import { ref, computed, onMounted } from "vue";
import { serviceCategoryApi } from "@/api/serviceCategory"; // API của bạn

const categories = ref([]);
const currentPage = ref(0);
const searchTerm = ref("");
const searchResults = ref([]);
const confirmationModal = ref(false);
const categoryIdToDelete = ref(null);
const addCategoryModal = ref(false);
const editCategoryModal = ref(false);
const editCategory = ref({
    id: "",
    name: "",
    description: "",
});
const error = ref([]);
const loading = ref(false);
const successModal = ref(false);
const successMessage = ref("");

const newCategory = ref({
    name: "",
    description: "",
});

onMounted(() => {
    fetchCategories();
});

const fetchCategories = async () => {
    try {
        loading.value = true;
        const data = await serviceCategoryApi.getAll();
        categories.value = data;
    } catch (err) {
        console.error("Error fetching categories:", err);
        error.value = ["Lỗi khi tải danh sách danh mục"];
    } finally {
        loading.value = false;
    }
};

const itemsPerPage = 5;
const pageCount = computed(() => Math.ceil(categories.value.length / itemsPerPage));
const offset = computed(() => currentPage.value * itemsPerPage);
const currentItems = computed(() =>
    categories.value.slice(offset.value, offset.value + itemsPerPage)
);

const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    searchTerm.value = term;
    const filteredResults = categories.value.filter(
        (category) =>
            category.name.toLowerCase().includes(term) ||
            category.description.toLowerCase().includes(term)
    );
    searchResults.value = filteredResults;
};

const displayItems = computed(() =>
    searchTerm.value ? searchResults.value : currentItems.value
);

const validate = () => {
    const errors = [];
    if (!newCategory.value.name) errors.push("Tên danh mục là bắt buộc");
    if (!newCategory.value.description) errors.push("Mô tả là bắt buộc");

    error.value = errors;
    return errors.length === 0;
};

const handleAddCategory = async () => {
    if (!validate()) return;

    try {
        loading.value = true;
        await serviceCategoryApi.create(newCategory.value);
        successMessage.value = "Thêm danh mục thành công!";
        successModal.value = true;
        addCategoryModal.value = false;
        fetchCategories();
        newCategory.value = { name: "", description: "" };
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi thêm danh mục"];
    } finally {
        loading.value = false;
    }
};

const handleEditCategory = async (categoryId) => {
    try {
        const category = await serviceCategoryApi.getById(categoryId);
        editCategory.value = {
            id: category.categoryId,
            name: category.name,
            description: category.description,
        };
        editCategoryModal.value = true;
    } catch (err) {
        console.error("Error fetching category:", err);
    }
};

const handleUpdateCategory = async () => {
    if (!editCategory.value.id) {
        error.value = ["Không tìm thấy danh mục để cập nhật"];
        return;
    }

    try {
        loading.value = true;
        await serviceCategoryApi.update(editCategory.value.id, {
            categoryId: editCategory.value.id,
            name: editCategory.value.name,
            description: editCategory.value.description,
        });
        successMessage.value = "Cập nhật danh mục thành công!";
        successModal.value = true;
        editCategoryModal.value = false;
        fetchCategories();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi cập nhật danh mục"];
    } finally {
        loading.value = false;
    }
};

const handleDeleteCategory = async () => {
    try {
        loading.value = true;
        await serviceCategoryApi.delete(categoryIdToDelete.value);
        successMessage.value = "Xóa danh mục thành công!";
        successModal.value = true;
        confirmationModal.value = false;
        fetchCategories();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi xóa danh mục"];
    } finally {
        loading.value = false;
    }
};

const confirmDeleteCategory = (categoryId) => {
    if (categoryId) {
        categoryIdToDelete.value = categoryId;
        confirmationModal.value = true;
    } else {
        console.error("categoryId không tồn tại");
    }
};
</script>

<template>
    <div class="menu-categories">
        <h5>Quản lý danh mục dịch vụ </h5>
        <div class="Timkiem">
            <input class="inputSearch" placeholder="Tìm kiếm theo tên danh mục" v-model="searchTerm" @input="handleSearch" />
            <button class="btnThemDanhMuc" @click="addCategoryModal = true">Thêm danh mục mới</button>
        </div>

        <div v-if="loading" class="text-center">Đang tải...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Tên danh mục</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in displayItems" :key="category.categoryId">
                    <td>{{ category.name }}</td>
                    <td>{{ category.description }}</td>
                    <td>
                        <button class="btn btn-info btn-sm" @click="handleEditCategory(category.categoryId)">Sửa</button>
                        <button class="btn btn-danger btn-sm" @click="() => { confirmDeleteCategory(category.categoryId) }">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <nav>
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="currentPage = Math.max(0, currentPage - 1)">
                    <a class="page-link">Trước</a>
                </li>
                <li class="page-item" v-for="page in pageCount" :key="page" :class="{ active: currentPage === page - 1 }" @click="currentPage = page - 1">
                    <a class="page-link">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === pageCount - 1 }" @click="currentPage = Math.min(pageCount - 1, currentPage + 1)">
                    <a class="page-link">Sau</a>
                </li>
            </ul>
        </nav>

        <!-- Add Category Modal -->
        <div v-if="addCategoryModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm danh mục mới</h5>
                        <button type="button" class="btn-close" @click="addCategoryModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên danh mục</label>
                            <input type="text" class="form-control" v-model="newCategory.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" v-model="newCategory.description" required></textarea>
                        </div>
                        <div v-if="error.length" class="text-danger">
                            <ul>
                                <li v-for="err in error" :key="err">{{ err }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleAddCategory" :disabled="loading">{{ loading ? 'Đang xử lý...' : 'Thêm' }}</button>
                        <button class="btn btn-secondary" @click="addCategoryModal = false">Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Category Modal -->
        <div v-if="editCategoryModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa danh mục</h5>
                        <button type="button" class="btn-close" @click="editCategoryModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên danh mục</label>
                            <input type="text" class="form-control" v-model="editCategory.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" v-model="editCategory.description" required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleUpdateCategory" :disabled="loading">{{ loading ? 'Đang xử lý...' : 'Cập nhật' }}</button>
                        <button class="btn btn-secondary" @click="editCategoryModal = false">Hủy</button>
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
                        Bạn có chắc chắn muốn xóa danh mục này?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-danger" @click="handleDeleteCategory" :disabled="loading">{{ loading ? 'Đang xử lý...' : 'Xóa' }}</button>
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
.menu-categories {
    max-width: 80%;
    margin: 0 auto;
    padding: 10px;
    background-color: #f8f9fa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
.Timkiem .inputSearch {
    margin-top: 10px;
    background: #dbdee0;
    width: 80%;
    font-size: 1rem;
    border-radius: 8px;
    font-weight: 400;
    line-height: 1.5;
    border: #dbdee0 1px solid;
    display: block;
    padding: 0.375rem 0.75rem;
}
.Timkiem .btnThemDanhMuc {
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}
</style>
