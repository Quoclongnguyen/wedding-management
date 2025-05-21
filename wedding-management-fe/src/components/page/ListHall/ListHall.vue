<template>
  <div class="page-container">
    <div class="header-section">
      <h1>DANH SÁCH SẢNH CƯỚI</h1>
      <div v-if="loading" class="loading-overlay">
        <Spinner animation="border" />
      </div>
      <form class="search-form" @submit.prevent="handleSearch">
        <div class="search-input-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm sảnh cưới..."
            v-model="searchKeyword"
            class="search-input"
          />
          <button type="submit" class="search-button">Tìm Kiếm</button>
        </div>
      </form>
    </div>

    <div class="halls-section">
      <div class="row">
        <div
          v-for="hallItem in (searchResult.length > 0 ? searchResult : hallData)"
          :key="hallItem.hallId"
          class="col-xs-12 col-md-4 col-lg-3 hall-item"
        >
          <div class="card hall-card">
            <div class="image-wrapper">
              <img :src="hallItem.image" class="hall-image" />
              <div class="price-badge">{{ formatPrice(hallItem.price) }}</div>
            </div>
            <div class="card-body">
              <h5 class="hall-title">{{ hallItem.name }}</h5>
              <div class="hall-capacity">
                <i class="fas fa-users"></i>
                <span>Sức chứa: {{ hallItem.capacity }} khách</span>
              </div>
              <div class="button-group">
                <button class="book-button" @click="navigateToBill">
                  <font-awesome-icon icon="cart-shopping" />
                  Đặt Ngay
                </button>
                <button
                  class="detail-button"
                  @click="openModal(hallItem)"
                >
                  <font-awesome-icon icon="info-circle" class="icon" />
                  Xem Chi Tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <template #header>
        <h5>Chi tiết sảnh cưới</h5>
      </template>
      <template #body>
        <div v-if="selectedService" class="modal-content-wrapper">
          <img
            :src="selectedService.image"
            class="modal-image"
            :alt="selectedService.name"
          />
          <h3 class="modal-title">{{ selectedService.name }}</h3>
          <div class="modal-info">
            <p class="price">Giá: {{ formatPrice(selectedService.price) }}</p>
            <p class="description">{{ selectedService.description }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn-secondary" @click="closeModal">Đóng</button>
      </template>
    </Modal>

    <div class="booked-halls-section">
      <div class="section-header">
        <h2 class="section-title">Danh Sách Sảnh Đã Có Người Đặt</h2>
        <div class="date-picker-wrapper">
          <font-awesome-icon icon="calendar-alt" class="calendar-icon" />
          <DatePicker
            v-model="selectedDate"
            :date-format="'dd/MM/yyyy'"
            class="date-input"
            placeholder="Chọn ngày"
            is-clearable
          />
        </div>
      </div>

      <div class="booked-halls-grid">
        <div
          v-for="hall in filteredHalls"
          :key="hall.HallId"
          class="booked-hall-card"
        >
          <div class="card-header">
            <h3>{{ hall.hallName }}</h3>
          </div>
          <div class="card-content">
            <div class="info-item">
              <font-awesome-icon icon="map-marker-alt" />
              <span>{{ hall.branchName }}</span>
            </div>
            <div class="info-item">
              <font-awesome-icon icon="calendar-alt" />
              <span>{{ formatDate(hall.bookingDate) }}</span>
            </div>
            <div class="time-badge">
              <font-awesome-icon icon="clock" />
              <span>{{ hall.timeHall }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref , onMounted , computed} from "vue";
import { useRouter } from "vue-router";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { useToast } from "vue-toastification";
import "./ListHall.scss";
import LoadingOverlay from '@/components/Context/LoadingOverlay.vue'
import Modal from "@/components/common/Modal.vue";
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const hallData = ref([]);
const searchResult = ref([]);
const searchKeyword = ref("");
const bookedHalls = ref([]);
const selectedService = ref(null);
const showModal = ref(false);
const selectedDate = ref(null);

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

const navigateToBill = () => {
  router.push("/bill");
};

const handleSearch = () => {
  searchResult.value = hallData.value.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
};

const openModal = (service) => {
  console.log("Service:", service); // Kiểm tra giá trị
  selectedService.value = service;
  showModal.value = true;
  console.log("Show Modal:", showModal.value);
};

const closeModal = () => {
  showModal.value = false;
};

const fetchHalls = async () => {
  try {
    const response = await fetch("https://localhost:7296/api/hall");
    if (response.ok) {
      hallData.value = await response.json();
    } else {
      toast.error("Lỗi khi tải danh sách sảnh cưới!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Lỗi mạng hoặc server!");
  } finally {
    loading.value = false;
  }
};

const fetchBookedHalls = async () => {
  try {
    const response = await fetch(
      "https://localhost:7296/api/invoice/booked-hall"
    );
    if (response.ok) {
      const data = await response.json();
      bookedHalls.value = data.sort(
        (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)
      );
    } else {
      toast.error("Lỗi khi tải danh sách sảnh đã đặt!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Lỗi mạng hoặc server!");
  }
};

const filteredHalls = computed(() => {
  if (!selectedDate.value) return bookedHalls.value;
  return bookedHalls.value.filter((hall) => {
    const bookingDate = new Date(hall.bookingDate);
    return (
      bookingDate.getFullYear() === selectedDate.value.getFullYear() &&
      bookingDate.getMonth() === selectedDate.value.getMonth() &&
      bookingDate.getDate() === selectedDate.value.getDate()
    );
  });
});

onMounted(() => {
  fetchHalls();
  fetchBookedHalls();
});
</script>

<style scoped>

</style>