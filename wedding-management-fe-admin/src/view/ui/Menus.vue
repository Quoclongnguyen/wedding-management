<script setup>
import { ref, computed, onMounted } from "vue";
import { menuApi } from "@/api/menu"; // Giả sử API của bạn
import { branchApi } from "@/api/branch";

const menus = ref([]);
const categories = ref([]);
const currentPage = ref(0);
const searchTerm = ref("");
const searchResults = ref([]);
const confirmationModal = ref(false);
const menuIdToDelete = ref(null);
const addMenuModal = ref(false);
const editMenuModal = ref(false);
const editMenu = ref({
    menuId: "",
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
});
const error = ref([]);
const loading = ref(false);
const successModal = ref(false);
const successMessage = ref("");

const newMenu = ref({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
});

onMounted(() => {
    fetchMenus();
    fetchCategories();
});

const fetchMenus = async () => {
    try {
        loading.value = true;
        const data = await menuApi.getAll();
        menus.value = data;
    } catch (err) {
        console.error("Error fetching menus:", err);
        error.value = ["Lỗi khi tải danh sách món ăn"];
    } finally {
        loading.value = false;
    }
};

const fetchCategories = async () => {
    try {
        const data = await menuApi.getCategories();
        categories.value = data;
    } catch (err) {
        console.error("Error fetching categories:", err);
    }
};

const itemsPerPage = 5;
const pageCount = computed(() => Math.ceil(menus.value.length / itemsPerPage));
const offset = computed(() => currentPage.value * itemsPerPage);
const currentItems = computed(() =>
    menus.value.slice(offset.value, offset.value + itemsPerPage)
);

const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    searchTerm.value = term;
    const filteredResults = menus.value.filter(
        (menu) =>
            menu.name.toLowerCase().includes(term) ||
            menu.description.toLowerCase().includes(term)
    );
    searchResults.value = filteredResults;
};

const displayItems = computed(() =>
    searchTerm.value ? searchResults.value : currentItems.value
);

const validate = () => {
    const errors = [];
    if (!newMenu.value.name) errors.push("Tên món ăn là bắt buộc");
    if (!newMenu.value.description) errors.push("Mô tả là bắt buộc");
    if (!newMenu.value.categoryId) errors.push("Danh mục là bắt buộc");
    if (newMenu.value.price <= 0) errors.push("Giá phải lớn hơn 0");

    error.value = errors;
    return errors.length === 0;
};

const handleAddMenu = async () => {
    if (!validate()) return;

    try {
        loading.value = true;
        await menuApi.create(newMenu.value);
        successMessage.value = "Thêm món ăn thành công!";
        successModal.value = true;
        addMenuModal.value = false;
        fetchMenus();
        newMenu.value = {
            name: "",
            description: "",
            price: 0,
            categoryId: "",
            image: "",
        };
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi thêm món ăn"];
    } finally {
        loading.value = false;
    }
};

const handleEditMenu = async (menuId) => {
    try {
        const menu = await menuApi.getById(menuId);
        editMenu.value = { ...menu };
        editMenuModal.value = true;
    } catch (err) {
        console.error("Error fetching menu:", err);
    }
};

const handleUpdateMenu = async () => {
    try {
        loading.value = true;
        await menuApi.update(editMenu.value.menuId, editMenu.value);
        successMessage.value = "Cập nhật món ăn thành công!";
        successModal.value = true;
        editMenuModal.value = false;
        fetchMenus();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi cập nhật món ăn"];
    } finally {
        loading.value = false;
    }
};

const handleDeleteMenu = async () => {
    try {
        loading.value = true;
        await menuApi.delete(menuIdToDelete.value);
        successMessage.value = "Xóa món ăn thành công!";
        successModal.value = true;
        confirmationModal.value = false;
        fetchMenus();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi xóa món ăn"];
    } finally {
        loading.value = false;
    }
};

const confirmDeleteMenu = (menuId) => {
    if (menuId) {
        menuIdToDelete.value = menuId;
        confirmationModal.value = true;
    } else {
        console.error("menuId không tồn tại");
    }
};
</script>

<template>
    <div class="containerMenu">
        <h5>Danh sách món ăn</h5>
        <div class="Timkiemmenu">
            <input class="search" placeholder="Tìm kiếm theo tên món ăn" v-model="searchTerm" @input="handleSearch" />
            <button class="btnThemMon" @click="addMenuModal = true">Thêm món ăn mới</button>
        </div>

        <div v-if="loading" class="text-center">Đang tải...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên món ăn</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="menu in displayItems" :key="menu.menuId">
                    <td>
                        <img :src="menu.image" alt="Hình ảnh món ăn" style="width: 100px; height: 60px; object-fit: cover; border-radius: 6px;" />
                    </td>
                    <td>{{ menu.name }}</td>
                    <td>{{ menu.categoryName }}</td>
                    <td>{{ menu.price.toLocaleString() }} VND</td>
                    <td>
                        <button class="btn btn-info btn-sm" @click="handleEditMenu(menu.menuId)">Sửa</button>
                        <button class="btn btn-danger btn-sm" @click="confirmDeleteMenu(menu.menuId)">Xóa</button>
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

        <!-- Add Menu Modal -->
        <div v-if="addMenuModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm món ăn mới</h5>
                        <button type="button" class="btn-close" @click="addMenuModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên món ăn</label>
                            <input type="text" class="form-control" v-model="newMenu.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" v-model="newMenu.description" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">URL Hình ảnh</label>
                            <input type="text" class="form-control" v-model="newMenu.image" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Danh mục</label>
                            <select class="form-control" v-model="newMenu.categoryId" required>
                                <option value="">Chọn danh mục</option>
                                <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Giá</label>
                            <input type="number" class="form-control" v-model="newMenu.price" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleAddMenu" :disabled="loading">Thêm</button>
                        <button class="btn btn-secondary" @click="addMenuModal = false">Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Menu Modal -->
        <div v-if="editMenuModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa món ăn</h5>
                        <button type="button" class="btn-close" @click="editMenuModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên món ăn</label>
                            <input type="text" class="form-control" v-model="editMenu.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" v-model="editMenu.description" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">URL Hình ảnh</label>
                            <input type="text" class="form-control" v-model="editMenu.image" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Danh mục</label>
                            <select class="form-control" v-model="editMenu.categoryId" required>
                                <option value="">Chọn danh mục</option>
                                <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Giá</label>
                            <input type="number" class="form-control" v-model="editMenu.price" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleUpdateMenu" :disabled="loading">Cập nhật</button>
                        <button class="btn btn-secondary" @click="editMenuModal = false">Hủy</button>
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
                        <p>Bạn có chắc chắn muốn xóa món ăn này?</p>
                        <button class="btn btn-danger" @click="handleDeleteMenu" :disabled="loading">Xóa</button>
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


.containerMenu {
    max-width: 80%;
    margin: 0 auto;
    padding: 15px;
    background-color: #f8f9fa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-bottom: 1rem;

}


.Timkiemmenu .search{
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

.Timkiemmenu .btnThemMon{
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom:  10px;
    
}
.tables
{
    background-color: #fff; ;
    width: 100%;
    border-radius: 10px;
}
</style>
