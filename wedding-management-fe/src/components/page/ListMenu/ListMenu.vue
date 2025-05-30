 <template>
  <div class="page-container">
    <div class="header-section">
      <h1>DANH SÁCH THỰC ĐƠN</h1>
      <LoadingOverlay v-if="loading" />
      <div class="search-filters">
        <form class="search-form" @submit.prevent="handleSearch">
          <div class="search-input-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              v-model="searchKeyword"
              class="search-input"
            />
            <button type="submit" class="search-button">Tìm Kiếm</button>
          </div>
        </form>
        <select class="category-select" v-model="selectedCategory" @change="handleCategoryChange">
          <option value="">Tất cả món ăn</option>
          <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="menu-grid">
      <div class="row gx-2 gy-3 justify-content-center">
        <div
          v-for="menuItem in (searchResult.length > 0 ? searchResult : menus)"
          :key="menuItem.menuId"
          class="col-xs-12 col-md-3 col-lg-2 menu-item"
        >
          <div class="menu-card">
            <div class="image-wrapper">
              <img :src="menuItem.image" :alt="menuItem.name" class="menu-image" />
              <div class="price-badge">{{ formatPrice(menuItem.price) }}</div>
            </div>
            <div class="card-content">
              <h3 class="menu-name">{{ menuItem.name }}</h3>
              <div class="menu-info">
                <p class="category">
                  <font-awesome-icon icon="utensils" class="icon" />
                  {{ menuItem.categoryName }}
                </p>
              </div>
              <div class="button-group">
                <button class="detail-button" @click="openModal(menuItem)">
                  <font-awesome-icon icon="info-circle" class="icon" />
                  Chi Tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal v-model="showModal" title="Chi tiết món ăn" hide-footer>
      <div v-if="selectedService" class="modal-content-wrapper">
        <img :src="selectedService.image" class="modal-image" :alt="selectedService.name" />
        <h3 class="modal-title">{{ selectedService.name }}</h3>
        <div class="modal-info">
          <p class="price">Giá: {{ formatPrice(selectedService.price) }}</p>
          <p class="description">{{ selectedService.description }}</p>
        </div>
        <button class="close-button" @click="showModal = false">
          Đóng
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import LoadingOverlay from "@/components/Context/LoadingOverlay.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "./ListMenu.scss";

const menus = ref([]);
const categories = ref([]);
const searchResult = ref([]);
const selectedCategory = ref("");
const searchKeyword = ref("");
const selectedService = ref(null);
const showModal = ref(false);
const loading = ref(true);

const toast = useToast();

// Fetch menu and category data on mount
onMounted(async () => {
  try {
    loading.value = true;
    const menuResponse = await fetch("https://localhost:7296/api/menu");
    const categoryResponse = await fetch("https://localhost:7296/api/menu/getCate");

    if (!menuResponse.ok || !categoryResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    menus.value = await menuResponse.json();
    categories.value = await categoryResponse.json();
  } catch (error) {
    console.error("Error loading data:", error);
    toast.error("Không thể tải dữ liệu thực đơn!");
  } finally {
    loading.value = false;
  }
});

// Handle search functionality
const handleSearch = () => {
  searchResult.value = menus.value.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
};

// Handle category change
const handleCategoryChange = async () => {
  if (!selectedCategory.value) {
    searchResult.value = [];
    return;
  }

  try {
    loading.value = true;
    const response = await fetch(
      `https://localhost:7296/api/menu/byCategory/${selectedCategory.value}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch category data");
    }

    menus.value = await response.json();
    searchResult.value = [];
  } catch (error) {
    console.error("Error loading category data:", error);
    toast.error("Không thể tải dữ liệu danh mục!");
  } finally {
    loading.value = false;
  }
};

// Open modal with selected menu item
const openModal = (menuItem) => {
  selectedService.value = menuItem;
  showModal.value = true;
};

// Format price to VND currency
const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
</script>

<style scoped>

</style>