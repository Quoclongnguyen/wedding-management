<script setup>
import { ref, computed, onMounted } from "vue";
import { serviceApi } from "@/api/service";
import { serviceCategoryApi } from "@/api/serviceCategory";

const services = ref([]);
const categories = ref([]);
const currentPage = ref(0);
const searchTerm = ref("");
const searchResults = ref([]);
const confirmationModal = ref(false);
const serviceIdToDelete = ref(null);
const addServiceModal = ref(false);
const editServiceModal = ref(false);
const error = ref([]);
const loading = ref(false);
const successModal = ref(false);
const successMessage = ref("");

const newService = ref({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
});

const editService = ref({
    serviceId: "",
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
});

onMounted(() => {
    fetchServices();
    fetchCategories();
});

const fetchServices = async () => {
    try {
        loading.value = true;
        const data = await serviceApi.getAll();
        services.value = data;
    } catch (err) {
        console.error("Error fetching services:", err);
        error.value = ["Lỗi khi tải danh sách dịch vụ"];
    } finally {
        loading.value = false;
    }
};

const fetchCategories = async () => {
    try {
        const data = await serviceCategoryApi.getAll();
        categories.value = data;
    } catch (err) {
        console.error("Error fetching categories:", err);
    }
};

const itemsPerPage = 5;
const pageCount = computed(() => Math.ceil(services.value.length / itemsPerPage));
const offset = computed(() => currentPage.value * itemsPerPage);
const currentItems = computed(() =>
    services.value.slice(offset.value, offset.value + itemsPerPage)
);

const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    searchTerm.value = term;
    const filteredResults = services.value.filter(
        (service) =>
            service.name.toLowerCase().includes(term) ||
            service.description.toLowerCase().includes(term)
    );
    searchResults.value = filteredResults;
};

const displayItems = computed(() =>
    searchTerm.value ? searchResults.value : currentItems.value
);

const validate = () => {
    const errors = [];
    if (!newService.value.name) errors.push("Tên dịch vụ là bắt buộc");
    if (!newService.value.description) errors.push("Mô tả là bắt buộc");
    if (!newService.value.categoryId) errors.push("Danh mục là bắt buộc");
    if (newService.value.price <= 0) errors.push("Giá phải lớn hơn 0");

    error.value = errors;
    return errors.length === 0;
};

const handleAddService = async () => {
    if (!validate()) return;

    try {
        loading.value = true;
        await serviceApi.create(newService.value);
        successMessage.value = "Thêm dịch vụ thành công!";
        successModal.value = true;
        addServiceModal.value = false;
        fetchServices();
        newService.value = {
            name: "",
            description: "",
            price: 0,
            categoryId: "",
            image: "",
        };
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi thêm dịch vụ"];
    } finally {
        loading.value = false;
    }
};

const handleEditService = async (serviceId) => {
    try {
        const service = await serviceApi.getById(serviceId);
        editService.value = {
            serviceId: service.serviceId,
            name: service.name,
            description: service.description,
            price: service.price,
            categoryId: service.categoryId,
            image: service.image,
        };
        editServiceModal.value = true;
    } catch (err) {
        console.error("Error fetching service:", err);
    }
};

const handleUpdateService = async () => {
    try {
        loading.value = true;
        await serviceApi.update(editService.value.serviceId, editService.value);
        successMessage.value = "Cập nhật dịch vụ thành công!";
        successModal.value = true;
        editServiceModal.value = false;
        fetchServices();
    } catch (err) {
        error.value = [
            err.response?.data?.message || "Lỗi khi cập nhật dịch vụ",
        ];
    } finally {
        loading.value = false;
    }
};

const handleDeleteService = async () => {
    try {
        loading.value = true;
        await serviceApi.delete(serviceIdToDelete.value);
        successMessage.value = "Xóa dịch vụ thành công!";
        successModal.value = true;
        confirmationModal.value = false;
        fetchServices();
    } catch (err) {
        error.value = [err.response?.data?.message || "Lỗi khi xóa dịch vụ"];
    } finally {
        loading.value = false;
    }
};

const confirmDeleteService = (serviceId) => {
    if (serviceId) {
        serviceIdToDelete.value = serviceId;
        confirmationModal.value = true;
    } else {
        console.error("serviceId không tồn tại");
    }
};
</script>

<template>
    <div class="services">
        <h5>Quản lý dịch vụ</h5>
        <div class="search-bar">
            <input
                class="form-control"
                placeholder="Tìm kiếm theo tên dịch vụ"
                v-model="searchTerm"
                @input="handleSearch"
            />
            <button class="btn btn-primary" @click="addServiceModal = true">
                Thêm dịch vụ mới
            </button>
        </div>

        <div v-if="loading" class="text-center">Đang tải...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Tên dịch vụ</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="service in displayItems" :key="service.serviceId">
                    <td>
                        <img :src="service.image" alt="Hình ảnh dịch vụ" style="width: 100px; height: 60px; object-fit: cover;" />
                    </td>
                    <td>{{ service.name }}</td>
                    <td>{{ service.categoryName }}</td>
                    <td>{{ service.price.toLocaleString() }} VND</td>
                    <td>
                        <button class="btn btn-info btn-sm" @click="handleEditService(service.serviceId)">Sửa</button>
                        <button class="btn btn-danger btn-sm" @click="() => confirmDeleteService(service.serviceId)">Xóa</button>
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

        <!-- Add Service Modal -->
        <div v-if="addServiceModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm dịch vụ mới</h5>
                        <button type="button" class="btn-close" @click="addServiceModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên dịch vụ</label>
                            <input type="text" class="form-control" v-model="newService.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" v-model="newService.description" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">URL Hình ảnh</label>
                            <input type="text" class="form-control" v-model="newService.image" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Danh mục</label>
                            <select class="form-control" v-model="newService.categoryId">
                                <option value="">Chọn danh mục</option>
                                <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Giá</label>
                            <input type="number" class="form-control" v-model="newService.price" required />
                        </div>
                        <div v-if="error.length" class="text-danger">
                            <ul>
                                <li v-for="err in error" :key="err">{{ err }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleAddService" :disabled="loading">{{ loading ? "Đang xử lý..." : "Thêm" }}</button>
                        <button class="btn btn-secondary" @click="addServiceModal = false">Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Service Modal -->
        <div v-if="editServiceModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chỉnh sửa dịch vụ</h5>
                        <button type="button" class="btn-close" @click="editServiceModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên dịch vụ</label>
                            <input type="text" class="form-control" v-model="editService.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" v-model="editService.description" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">URL Hình ảnh</label>
                            <input type="text" class="form-control" v-model="editService.image" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Danh mục</label>
                            <select class="form-control" v-model="editService.categoryId">
                                <option value="">Chọn danh mục</option>
                                <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Giá</label>
                            <input type="number" class="form-control" v-model="editService.price" required />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="handleUpdateService" :disabled="loading">{{ loading ? "Đang xử lý..." : "Cập nhật" }}</button>
                        <button class="btn btn-secondary" @click="editServiceModal = false">Hủy</button>
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
                        Bạn có chắc chắn muốn xóa dịch vụ này?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-danger" @click="handleDeleteService" :disabled="loading">{{ loading ? "Đang xử lý..." : "Xóa" }}</button>
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
.services {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.search-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>
