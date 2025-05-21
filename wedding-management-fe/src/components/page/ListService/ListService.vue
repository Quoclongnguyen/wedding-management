<template>
  <div class="page-container">
    <div class="header-section">
      <h1>DANH SÁCH DỊCH VỤ</h1>
      <LoadingOverlay v-if="loading" />
      <div class="search-section">
        <form class="search-form" @submit.prevent="handleSearch">
          <div class="search-input-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              v-model="searchKeyword"
              class="search-input"
            />
            <button type="submit" class="search-button">Tìm Kiếm</button>
          </div>
        </form>
      </div>
    </div>

    <div class="services-grid">
      <div class="row">
        <div
          v-for="service in (searchResult.length > 0 ? searchResult : services)"
          :key="service.serviceId"
          class="col-xs-12 col-md-4 col-lg-3 service-item"
        >
          <div class="service-card">
            <div class="image-wrapper">
              <img :src="service.image" :alt="service.name" class="service-image" />
              <div class="price-badge">
                <font-awesome-icon icon="money-bill-wave" class="icon" />
                {{ formatPrice(service.price) }}
              </div>
            </div>
            <div class="card-content">
              <h3 class="service-name">{{ service.name }}</h3>
              <div class="button-group">
                <button class="book-button" @click="navigateToBill">
                  <font-awesome-icon icon="cart-shopping" />
                  Đặt Ngay
                </button>
                <button
                  class="detail-button"
                  @click="openModal(service)"
                >
                  <font-awesome-icon icon="circle-info" />
                  Chi Tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <b-modal v-model="showModal" title="Chi tiết dịch vụ" hide-footer>
      <div v-if="selectedService" class="modal-content-wrapper">
        <img :src="selectedService.image" class="modal-image" :alt="selectedService.name" />
        <h3 class="modal-title">{{ selectedService.name }}</h3>
        <div class="modal-info">
          <p class="price">Giá: {{ formatPrice(selectedService.price) }}</p>
          <p class="description">{{ selectedService.description }}</p>
        </div>
        <button class="close-button" @click="showModal = false">Đóng</button>
      </div>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import LoadingOverlay from "@/components/Context/LoadingOverlay.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./ListService.scss";


const services = ref([]);
const searchResult = ref([]);
const searchKeyword = ref("");
const selectedService = ref(null);
const showModal = ref(false);
const loading = ref(true);
const toast = useToast();

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const openModal = (service) => {
  selectedService.value = service;
  showModal.value = true;
};

const navigateToBill = () => {
  // Logic điều hướng đến trang đặt tiệc
  toast.info("Chuyển đến trang đặt tiệc!");
};

const handleSearch = () => {
  searchResult.value = services.value.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
};

// Gọi API thực tế để lấy danh sách dịch vụ
onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch("https://localhost:7296/api/service"); // Thay URL bằng endpoint API thực tế của bạn
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    services.value = await response.json();
  } catch (error) {
    console.error("Error loading services:", error);
    toast.error("Không thể tải danh sách dịch vụ!");
  } finally {
    loading.value = false;
  }
});
</script>

