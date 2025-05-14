<template>
  <b-card class="container">
    <b-card-body>
      <b-card-title>Quản lý tài khoản</b-card-title>
      <div class="d-flex justify-content-between mb-3">
        <div class="col-4">
          <input
            class="form-control"
            placeholder="Tìm kiếm theo email hoặc tên"
            v-model="searchTerm"
            @input="handleSearch"
          />
        </div>
        <b-button class="btn" @click="addUserModal = true">
          Thêm người dùng
        </b-button>
      </div>

      <div v-if="loading" class="text-center">Đang tải...</div>
      <div v-else>
        <b-table :items="displayItems" :fields="['email', 'fullName', 'phoneNumber', 'roles', 'actions']" responsive>
          <template #cell(fullName)="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
          <template #cell(roles)="{ item }">
            <span
              v-for="(role, index) in item.roles"
              :key="index"
              class="badge me-1"
              :class="'bg-' + getRoleBadgeColor(role)"
            >
              {{ formatRoleName(role) }}
            </span>
          </template>
          <template #cell(actions)="{ item }">
            <b-button size="sm" variant="info" class="me-2" @click="handleEditUser(item.id)">
              Sửa
            </b-button>
            <b-button size="sm" variant="danger" @click="() => { userIdToDelete = item.id; confirmationModal = true }">
              Xóa
            </b-button>
          </template>
        </b-table>

        <nav class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="currentPage--" :disabled="currentPage === 0">Trước</button>
            </li>
            <li
              v-for="page in pageCount"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page - 1 }"
            >
              <button class="page-link" @click="currentPage = page - 1">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= pageCount - 1 }">
              <button class="page-link" @click="currentPage++" :disabled="currentPage >= pageCount - 1">Sau</button>
            </li>
          </ul>
        </nav>
      </div>
    </b-card-body>
  </b-card>

  <!-- Modal Thêm Người Dùng -->
  <b-modal v-model="addUserModal" title="Thêm người dùng mới">
    <template #default>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="newUser.email" />
      </div>
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input type="password" class="form-control" v-model="newUser.password" />
      </div>
      <div class="mb-3">
        <label class="form-label">Họ</label>
        <input type="text" class="form-control" v-model="newUser.firstName" />
      </div>
      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input type="text" class="form-control" v-model="newUser.lastName" />
      </div>
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input type="text" class="form-control" v-model="newUser.phoneNumber" />
      </div>
      <div class="mb-3">
        <label class="form-label">Vai trò</label>
        <select class="form-control" v-model="newUser.roles[0]">
          <option value="user">Khách hàng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>
      <div v-for="(err, index) in error" :key="index" class="text-danger">
        {{ err }}
      </div>
    </template>
    <template #footer>
      <b-button variant="primary" @click="handleAddUser" :disabled="loading">
        {{ loading ? 'Đang xử lý...' : 'Thêm' }}
      </b-button>
      <b-button variant="secondary" @click="addUserModal = false">Hủy</b-button>
    </template>
  </b-modal>

  <!-- Modal Sửa Người Dùng -->
  <b-modal v-model="editUserModal" title="Chỉnh sửa thông tin người dùng">
    <template #default>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="editUser.email" />
      </div>
      <div class="mb-3">
        <label class="form-label">Họ</label>
        <input type="text" class="form-control" v-model="editUser.firstName" />
      </div>
      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input type="text" class="form-control" v-model="editUser.lastName" />
      </div>
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input type="text" class="form-control" v-model="editUser.phoneNumber" />
      </div>
      <div class="mb-3">
        <label class="form-label">Vai trò</label>
        <select class="form-control" v-model="editUser.roles[0]">
          <option value="user">Khách hàng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>
    </template>
    <template #footer>
      <b-button variant="primary" @click="handleUpdateUser" :disabled="loading">
        {{ loading ? 'Đang xử lý...' : 'Cập nhật' }}
      </b-button>
      <b-button variant="secondary" @click="editUserModal = false">Hủy</b-button>
    </template>
  </b-modal>

  <!-- Modal Xác Nhận Xoá -->
  <b-modal v-model="confirmationModal" title="Xác nhận xoá">
    <template #default>
      <div class="mb-3">
        <p>Bạn có chắc chắn muốn xoá người dùng này?</p>
      </div>
    </template>
    <template #footer>
      <b-button variant="danger" @click="handleDeleteUser" :disabled="loading">
        {{ loading ? 'Đang xử lý...' : 'Xoá' }}
      </b-button>
      <b-button variant="secondary" @click="confirmationModal = false">Hủy</b-button>
    </template>
  </b-modal>

  <!-- Modal Thành Công -->
  <b-modal v-model="successModal">
    <template #default>
      <div class="text-center text-success">
        <i class="bi bi-check-circle-fill fs-1"></i>
        <p class="mt-2">{{ successMessage }}</p>
      </div>
    </template>
    <template #footer>
      <b-button variant="primary" @click="successModal = false">Đóng</b-button>
    </template>
  </b-modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { accountApi } from '@/api/account';
import {
  BCard,
  BCardBody,
  BCardTitle,
  BTable,
  BButton,
  BModal,
} from 'bootstrap-vue-3';



const users = ref([]);
const currentPage = ref(0);
const perPage = 5;
const searchTerm = ref('');
const addUserModal = ref(false);
const editUserModal = ref(false);
const confirmationModal = ref(false);
const successModal = ref(false);
const successMessage = ref('');
const loading = ref(false);
const error = ref([]);
const userIdToDelete = ref(null);

const newUser = ref({
  email: 'user@gmail.com',
  password: 'Test@123456',
  firstName: 'Nguyễn',
  lastName: 'Văn',
  phoneNumber: '0999999999',
  roles: ['user'],
});

const editUser = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  roles: [],
});

const fetchUsers = async () => {
  try {
    loading.value = true;
    const data = await accountApi.getAll();
    users.value = data;
  } catch (err) {
    error.value = ['Lỗi khi tải danh sách người dùng'];
  } finally {
    loading.value = false;
  }
};

const pageCount = computed(() => Math.ceil(users.value.length / perPage));
const offset = computed(() => currentPage.value * perPage);

const filteredUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
  );
});

const displayItems = computed(() => {
  return filteredUsers.value.slice(offset.value, offset.value + perPage);
});

const handleSearch = () => {
  currentPage.value = 0;
};

const validate = () => {
  const errors = [];
  const user = newUser.value;

  if (!user.email) errors.push('Email là bắt buộc');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) errors.push('Email không hợp lệ');

  if (!user.password) errors.push('Mật khẩu là bắt buộc');
  else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(user.password)) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
  }

  if (!user.firstName) errors.push('Họ là bắt buộc');
  if (!user.lastName) errors.push('Tên là bắt buộc');
  if (!user.phoneNumber) errors.push('Số điện thoại là bắt buộc');

  error.value = errors;
  return errors.length === 0;
};

const resetNewUserForm = () => {
  newUser.value = {
    email: 'user@gmail.com',
    password: 'Test@123456',
    firstName: 'Nguyễn',
    lastName: 'Văn',
    phoneNumber: '0999999999',
    roles: ['user'],
  };
};

const handleAddUser = async () => {
  if (!validate()) return;
  try {
    loading.value = true;
    await accountApi.create(newUser.value);
    successMessage.value = 'Thêm người dùng thành công!';
    successModal.value = true;
    addUserModal.value = false;
    fetchUsers();
    resetNewUserForm();
  } catch (err) {
    error.value = ['Có lỗi xảy ra khi thêm người dùng'];
  } finally {
    loading.value = false;
  }
};

const handleEditUser = async (userId) => {
  try {
    const user = await accountApi.getById(userId);
    editUser.value = {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles || [],
    };
    editUserModal.value = true;
  } catch (err) {
    console.error('Error fetching user:', err);
  }
};

const handleUpdateUser = async () => {
  try {
    loading.value = true;
    await accountApi.update(editUser.value.id, {
      firstName: editUser.value.firstName,
      lastName: editUser.value.lastName,
      email: editUser.value.email,
      phoneNumber: editUser.value.phoneNumber,
      roles: editUser.value.roles,
    });
    successMessage.value = 'Cập nhật thông tin thành công!';
    successModal.value = true;
    editUserModal.value = false;
    fetchUsers();
  } catch (err) {
    error.value = ['Lỗi khi cập nhật thông tin'];
  } finally {
    loading.value = false;
  }
};

const handleDeleteUser = async () => {
  try {
    loading.value = true;
    await accountApi.delete(userIdToDelete.value);
    successMessage.value = 'Xoá người dùng thành công!';
    successModal.value = true;
    confirmationModal.value = false;
    fetchUsers();
  } catch (err) {
    error.value = ['Lỗi khi xoá người dùng'];
  } finally {
    loading.value = false;
  }
};

const getRoleBadgeColor = (role) => {
  switch (role.toLowerCase()) {
    case 'admin': return 'danger';
    case 'user': return 'success';
    default: return 'secondary';
  }
};

const formatRoleName = (role) => {
  switch (role.toLowerCase()) {
    case 'admin': return 'Quản trị viên';
    case 'user': return 'Khách hàng';
    default: return role;
  }
};

onMounted(fetchUsers);
</script>


<style scoped>
.container {
  max-width: 80%;
    margin: 0 auto;
    padding: 15px;
    background-color: #f8f9fa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-bottom: 1rem;
}

.form-control
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
.btn
{
  margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom:  10px;}
</style>