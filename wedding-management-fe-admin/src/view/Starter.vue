<template>
  <div class="container-fluid">
    <!-- Hiển thị trạng thái tải dữ liệu -->
    <div v-if="loading" class="text-center">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="text-danger text-center">{{ error }}</div>
    <div v-else>
      <!-- Hiển thị các thẻ (Top Cards) -->
      <div class="row">
        <div class="col-sm-12 col-lg-4 mb-4">
          <TopCards
            bg="bg-light-success text-success"
            title="Tổng số sảnh"
            subtitle="Halls"
            :earning="statistics?.totalHalls"
            icon="bi bi-door-open"
          />
        </div>
        <div class="col-sm-12 col-lg-4 mb-4">
          <TopCards
            bg="bg-light-danger text-danger"
            title="Tổng số chi nhánh"
            subtitle="Branches"
            :earning="statistics?.totalBranches"
            icon="bi bi-building"
          />
        </div>
        <div class="col-sm-12 col-lg-4 mb-4">
          <TopCards
            bg="bg-light-warning text-warning"
            title="Tổng số món ăn"
            subtitle="Menus"
            :earning="statistics?.totalMenus"
            icon="bi bi-cup-hot"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 col-lg-4 mb-4">
          <TopCards
            bg="bg-light-info text-info"
            title="Tổng số dịch vụ"
            subtitle="Services"
            :earning="statistics?.totalServices"
            icon="bi bi-gear"
          />
        </div>
        <div class="col-sm-12 col-lg-4 mb-4">
          <TopCards
            bg="bg-light-success text-success"
            title="Tổng số người dùng"
            subtitle="Users"
            :earning="statistics?.totalUsers"
            icon="bi bi-people"
          />
        </div>
        <div class="col-sm-12 col-lg-4 mb-4">
          <TopCards
            bg="bg-light-danger text-danger"
            title="Tổng số hóa đơn"
            subtitle="Invoices"
            :earning="statistics?.totalInvoices"
            icon="bi bi-receipt"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 col-lg-6 mb-4">
          <TopCards
            bg="bg-light-warning text-warning"
            title="Tổng doanh thu"
            subtitle="Revenue"
            :earning="`${statistics?.totalRevenue?.toLocaleString()} VND`"
            icon="bi bi-cash"
          />
        </div>
        <div class="col-sm-12 col-lg-6 mb-4">
          <TopCards
            bg="bg-light-info text-info"
            title="Tổng số đánh giá"
            subtitle="Feedbacks"
            :earning="statistics?.totalFeedback"
            icon="bi bi-star"
          />
        </div>
      </div>

      <!-- Bảng: Top 5 Sảnh được đặt nhiều nhất -->
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Top 5 Sảnh được đặt nhiều nhất</h5>
              <table class="table no-wrap mt-3 align-middle">
                <thead>
                  <tr>
                    <th>Tên sảnh</th>
                    <th>Số lần đặt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hall in statistics?.topHalls" :key="hall.hallId">
                    <td>{{ hall.hallName }}</td>
                    <td>{{ hall.bookingCount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Bảng: Doanh thu theo tháng -->
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Doanh thu theo tháng</h5>
              <table class="table no-wrap mt-3 align-middle">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in statistics?.revenueByMonth" :key="item.month">
                    <td>Tháng {{ item.month }}</td>
                    <td>{{ item.revenue.toLocaleString() }} VND</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TopCards from '@/components/dashboard/TopCards.vue';
import { dashboardApi } from '@/api/dashboard';

const statistics = ref(null);
const loading = ref(true);
const error = ref(null);

// Gọi API khi component được mount
onMounted(async () => {
  try {
    const data = await dashboardApi.getStatistics();
    statistics.value = data; // Gán dữ liệu từ API vào biến statistics
  } catch (err) {
    console.error('Lỗi khi gọi API:', err);
    error.value = 'Không thể tải dữ liệu từ API.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.container-fluid {
  padding: 20px;
}
</style>