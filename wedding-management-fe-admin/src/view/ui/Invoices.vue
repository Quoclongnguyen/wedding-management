<template>
  <div class="page-container">
    <div class="page-header mb-4">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="page-title">
                <i class="bi bi-receipt me-2"></i>
                Quản lý hóa đơn
              </h2>
              <p class="text-muted">
                Quản lý thông tin hóa đơn và trạng thái thanh toán
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Table -->
    <div class="row">
      <div class="col-12">
        <div class="card main-card">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-4">
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input class="form-control search-input" placeholder="Tìm kiếm theo email hoặc mã hóa đơn"
                  v-model="searchTerm" @input="handleSearch" />
              </div>
            </div>

            <!-- Loading Spinner -->
            <div v-if="loading" class="loading-container">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <div class="loading-text">Đang tải dữ liệu...</div>
            </div>

            <!-- Table -->
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Mã HĐ</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Ngày tổ chức</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in displayItems" :key="invoice.invoiceID">
                    <td>#{{ invoice.invoiceID }}</td>
                    <td>
                      <div class="item-name">{{ invoice.user.email }}</div>
                      <div class="item-description">
                        <i class="bi bi-telephone me-1"></i>{{ invoice.user.phoneNumber }}
                      </div>
                    </td>
                    <td>{{ formatDate(invoice.invoiceDate) }}</td>
                    <td>
                      <div>{{ formatDate(invoice.attendanceDate) }}</div>
                      <div class="text-muted">{{ invoice.timeHall }}</div>
                    </td>
                    <td>{{ formatCurrency(invoice.total) }}</td>
                    <td>
                      <span :class="getStatusBadgeClass(invoice.orderStatus)">
                        <i :class="getStatusIconClass(invoice.orderStatus)" class="me-2"></i>
                        {{ invoice.orderStatus }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-info btn-sm me-2" @click="handleViewDetail(invoice.invoiceID)">
                          <i class="bi bi-eye-fill"></i>
                        </button>
                        <button class="btn btn-warning btn-sm me-2" @click="handleEdit(invoice)">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-primary btn-sm" @click="openUpdateStatusModal(invoice)">
                          <i class="bi bi-gear-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <nav v-if="pageCount > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled: currentPage === 0}">
                  <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 0">&lt;</button>
                </li>
                <li class="page-item"
                  v-for="page in pageCount"
                  :key="page"
                  :class="{active: currentPage === page - 1}">
                  <button class="page-link" @click="changePage(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{disabled: currentPage === pageCount - 1}">
                  <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === pageCount - 1">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);z-index:1050;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết hóa đơn #{{ selectedInvoice?.invoiceID }}</h5>
            <button type="button" class="btn-close" @click="detailModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedInvoice">
              <h5 class="mb-4">Thông tin khách hàng</h5>
              <div class="row mb-4">
                <div class="col-md-6">
                  <p><strong>Họ tên:</strong> {{ selectedInvoice.user.fullName }}</p>
                  <p><strong>Email:</strong> {{ selectedInvoice.user.email }}</p>
                  <p><strong>Số điện thoại:</strong> {{ selectedInvoice.user.phoneNumber }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Ngày đặt:</strong> {{ formatDate(selectedInvoice.invoiceDate) }}</p>
                  <p><strong>Ngày tổ chức:</strong> {{ formatDate(selectedInvoice.attendanceDate) }}</p>
                  <p><strong>Ca:</strong> {{ selectedInvoice.timeHall }}</p>
                </div>
              </div>
              <h5 class="mb-4">Chi tiết đơn hàng</h5>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Sản phẩm/Dịch vụ</th>
                    <th class="text-end">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Sảnh:</strong> {{ selectedInvoice.hall.name }}</td>
                    <td class="text-end">{{ formatCurrency(selectedInvoice.hall.price) }}</td>
                  </tr>
                  <tr v-for="(menu, index) in selectedInvoice.orderMenus" :key="'menu-' + index">
                    <td>{{ menu.name }}</td>
                    <td class="text-end">{{ formatCurrency(menu.price) }}</td>
                  </tr>
                  <tr v-for="(service, index) in selectedInvoice.orderServices" :key="'service-' + index">
                    <td>{{ service.name }}</td>
                    <td class="text-end">{{ formatCurrency(service.price) }}</td>
                  </tr>
                  <tr>
                    <td class="text-end"><strong>Tổng tiền:</strong></td>
                    <td class="text-end">{{ formatCurrency(selectedInvoice.totalBeforeDiscount) }}</td>
                  </tr>
                  <tr>
                    <td class="text-end"><strong>Sau giảm giá:</strong></td>
                    <td class="text-end">{{ formatCurrency(selectedInvoice.total) }}</td>
                  </tr>
                  <tr>
                    <td class="text-end"><strong>Đã cọc:</strong></td>
                    <td class="text-end">{{ formatCurrency(selectedInvoice.depositPayment) }}</td>
                  </tr>
                  <tr>
                    <td class="text-end"><strong>Còn lại:</strong></td>
                    <td class="text-end">{{ formatCurrency(selectedInvoice.total - selectedInvoice.depositPayment) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="detailModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="updateStatusModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);z-index:1050;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cập nhật trạng thái hóa đơn</h5>
            <button type="button" class="btn-close" @click="updateStatusModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedInvoice">
              <div class="mb-3">
                <label class="form-label">Trạng thái đơn hàng</label>
                <select class="form-control" v-model="selectedStatus">
                  <option value="Đã đặt cọc">Đã đặt cọc</option>
                  <option value="Đã hủy đơn hàng">Đã hủy đơn hàng</option>
                  <option value="Hoàn tất thanh toán">Hoàn tất thanh toán</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleUpdateStatus" :disabled="loading">
              <span v-if="loading"><i class="bi bi-arrow-clockwise spin me-1"></i> Đang xử lý...</span>
              <span v-else><i class="bi bi-check-lg me-1"></i> Cập nhật</span>
            </button>
            <button class="btn btn-secondary" @click="updateStatusModal = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="successModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);z-index:1050;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center">
              <i class="bi bi-check-circle-fill text-success display-4 mb-3"></i>
              <p class="mb-0">{{ successMessage }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="successModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModal" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);z-index:1050;">
      <div class="modal-dialog modal-xl edit-invoice-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i> Chỉnh sửa hóa đơn #{{ selectedInvoice?.invoiceID }}
            </h5>
            <button type="button" class="btn-close" @click="editModal = false"></button>
          </div>
          <div class="modal-body p-0">
            <div v-if="selectedInvoice" class="p-4">
              <div class="mb-3">
                <label class="form-label">Chi nhánh</label>
                <select class="form-control" v-model="selectedBranch">
                  <option v-for="branch in branches" :key="branch.branchId" :value="branch">
                    {{ branch.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Sảnh cưới</label>
                <select class="form-control" v-model="selectedHall">
                  <option v-for="hall in hallsByBranch.length ? hallsByBranch : halls" :key="hall.hallId" :value="hall">
                    {{ hall.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Thực đơn</label>
                <select class="form-control" v-model="selectedMenus" multiple>
                  <option v-for="menu in menus" :key="menu.menuId" :value="menu.menuId">
                    {{ menu.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Dịch vụ</label>
                <select class="form-control" v-model="selectedServices" multiple>
                  <option v-for="service in services" :key="service.serviceId" :value="service.serviceId">
                    {{ service.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="handleSaveEdit" :disabled="loading">
              <span v-if="loading"><span class="spinner-border spinner-border-sm me-1" role="status"></span> Đang lưu...</span>
              <span v-else><i class="bi bi-check-lg me-1"></i> Lưu thay đổi</span>
            </button>
            <button class="btn btn-secondary" @click="editModal = false"><i class="bi bi-x-lg me-1"></i> Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { invoiceApi } from '@/api/invoice';

export default {
  data() {
    return {
      invoices: [],
      searchTerm: '',
      currentPage: 0,
      searchResults: [],
      selectedInvoice: null,
      detailModal: false,
      updateStatusModal: false,
      successModal: false,
      successMessage: '',
      editModal: false,
      branches: [],
      halls: [],
      menus: [],
      services: [],
      selectedBranch: null,
      selectedHall: null,
      selectedMenus: [],
      selectedServices: [],
      hallsByBranch: [],
      loadingHalls: false,
      selectedStatus: '',
      loading: false,
    };
  },
  computed: {
    pageCount() {
      return this.invoices && this.invoices.length ? Math.ceil(this.invoices.length / 10) : 0;
    },
    displayItems() {
      return this.searchTerm
        ? this.searchResults
        : this.invoices.slice(this.currentPage * 10, (this.currentPage + 1) * 10);
    },
  },
  methods: {
    fetchInvoices() {
      this.loading = true;
      invoiceApi.getAll()
        .then((response) => {
          this.invoices = response.data || [];
        })
        .catch(() => {
          this.error = "Không thể tải danh sách hóa đơn.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchBranches() {
      this.loading = true;
      fetch('https://localhost:7296/api/ApiBranch')
        .then((response) => response.json())
        .then((data) => {
          this.branches = data;
        })
        .catch(() => {
          this.error = "Không thể tải danh sách chi nhánh.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchHalls() {
      this.loading = true;
      fetch('https://localhost:7296/api/hall')
        .then((response) => response.json())
        .then((data) => {
          this.halls = data;
        })
        .catch(() => {
          this.error = "Không thể tải danh sách sảnh.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchMenus() {
      this.loading = true;
      fetch('https://localhost:7296/api/menu')
        .then((response) => response.json())
        .then((data) => {
          this.menus = data;
        })
        .catch(() => {
          this.error = "Không thể tải danh sách thực đơn.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchServices() {
      this.loading = true;
      fetch('https://localhost:7296/api/service')
        .then((response) => response.json())
        .then((data) => {
          this.services = data;
        })
        .catch(() => {
          this.error = "Không thể tải danh sách dịch vụ.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      const term = this.searchTerm.toLowerCase();
      this.searchResults = this.invoices.filter(
        (invoice) =>
          invoice.user?.email.toLowerCase().includes(term) ||
          invoice.invoiceID.toString().includes(term)
      );
    },
    formatDate(date) {
      return new Date(date).toLocaleString("vi-VN");
    },
    formatCurrency(amount) {
      return amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case "Đã hủy đơn hàng":
          return "badge bg-danger";
        case "Hoàn tất thanh toán":
          return "badge bg-success";
        case "Đã đặt cọc":
          return "badge bg-warning text-dark";
        default:
          return "badge bg-secondary";
      }
    },
    getStatusIconClass(status) {
      switch (status) {
        case "Đã hủy đơn hàng":
          return "bi-x-circle-fill";
        case "Hoàn tất thanh toán":
          return "bi-check-circle-fill";
        case "Đã đặt cọc":
          return "bi-clock-fill";
        default:
          return "bi-clock-fill";
      }
    },
    handleViewDetail(invoiceId) {
      this.loading = true;
      invoiceApi.getById(invoiceId)
        .then((response) => {
          this.selectedInvoice = response.data;
          this.detailModal = true;
        })
        .catch(() => {
          this.error = "Không thể tải thông tin hóa đơn.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(invoice) {
      this.selectedInvoice = invoice;
      this.selectedBranch = invoice.branch;
      this.selectedHall = invoice.hall;
      this.selectedMenus = invoice.orderMenus.map((om) => om.menuId);
      this.selectedServices = invoice.orderServices.map((os) => os.serviceId);
      this.editModal = true;
    },
    handleSaveEdit() {
      this.loading = true;
      const updatedInvoice = {
        ...this.selectedInvoice,
        branchId: this.selectedBranch.branchId,
        hallId: this.selectedHall.hallId,
        orderMenus: this.selectedMenus.map((menuId) => ({ menuId })),
        orderServices: this.selectedServices.map((serviceId) => ({ serviceId })),
      };
      invoiceApi.update(this.selectedInvoice.invoiceID, updatedInvoice)
        .then(() => {
          this.successMessage = "Cập nhật hóa đơn thành công!";
          this.successModal = true;
          this.editModal = false;
          this.fetchInvoices();
        })
        .catch(() => {
          this.error = "Lỗi khi cập nhật hóa đơn.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openUpdateStatusModal(invoice) {
      this.selectedInvoice = invoice;
      this.selectedStatus = invoice.orderStatus;
      this.updateStatusModal = true;
    },
    handleUpdateStatus() {
      this.loading = true;
      invoiceApi.updateStatus(this.selectedInvoice.invoiceID, this.selectedStatus)
        .then(() => {
          this.successMessage = "Cập nhật trạng thái thành công!";
          this.successModal = true;
          this.updateStatusModal = false;
          this.fetchInvoices();
        })
        .catch(() => {
          this.error = "Lỗi khi cập nhật trạng thái hóa đơn.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changePage(page) {
      if (page >= 0 && page < this.pageCount) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchInvoices();
    this.fetchBranches();
    this.fetchHalls();
    this.fetchMenus();
    this.fetchServices();
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>