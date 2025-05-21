<template>
  <div class="bill">
    <div class="bill-page" style="display: flex; justify-content: center; align-items: center;">
      <div class="bill-form-container display-flex justify-content-center align-items-center">
        <h1 class="title">Đơn Hàng</h1>
        <form>
          <Accordion>
            <!-- Chi Nhánh -->
            <Accordion.Item eventKey="0">
              <Accordion.Header>Chi Nhánh</Accordion.Header>
              <Accordion.Body class="body">
                <div v-for="(branch, index) in branchs" :key="index" class="menu-card" style="width: 18rem;">
                  <img class="image-fixed-height" :src="branch.image" alt="Branch Image" />
                  <div class="card-body">
                    <h5 class="card-title">{{ branch.name }}</h5>
                    <p class="card-text">Mô tả: {{ branch.description }}</p>
                    <p class="card-text">Địa chỉ: {{ branch.address }}</p>
                    <p class="card-text">SDT: {{ branch.phone }}</p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'flexCheckDefault-' + index"
                        :checked="branch.branchId === selectedBranchId"
                        @change="handleBranchCheckboxChange(branch.branchId)" />
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <!-- Sảnh Cưới -->
            <Accordion.Item eventKey="1">
              <Accordion.Header>Sảnh Cưới</Accordion.Header>
              <Accordion.Body class="body">
                <div v-for="(hall, index) in hallsByBranch" :key="index" class="menu-card" style="width: 18rem;">
                  <img class="image-fixed-height" :src="hall.image" alt="Hall Image" />
                  <div class="card-body">
                    <h5 class="card-title">{{ hall.name }}</h5>
                    <p class="card-text">Sức chứa: {{ hall.capacity }}</p>
                    <p class="card-text">Giá: {{ formatPrice(hall.price) }}</p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'flexCheckHall-' + index"
                        :checked="hall.hallId === selectedHallId" @change="handleHallCheckboxChange(hall.hallId)" />
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Thực Đơn</Accordion.Header>
              <Accordion.Body class="body">
                <div v-for="(menu, index) in menus" :key="index" class="menu-card" style="width: 18rem;">
                  <img class="image-fixed-height" :src="menu.image" alt="Menu Image" />
                  <div class="card-body">
                    <h5 class="card-title">{{ menu.name }}</h5>
                    <p class="card-text">Mô tả: {{ menu.description }}</p>
                    <p class="card-text">Giá: {{ formatPrice(menu.price) }}</p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'flexCheckMenu-' + index"
                        :checked="selectedMenus.includes(menu.menuId)"
                        @change="handleMenuCheckboxChange(menu.menuId)" />
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import "./Bill.scss";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";

// State
const branchs = ref([]);
const selectedBranchId = ref(null);
const hallsByBranch = ref([]);
const selectedHallId = ref(null);
const menus = ref([]);
const selectedMenus = ref([]);


// Toast thông báo
const toast = useToast();

// Hàm gọi API để lấy danh sách chi nhánh
const fetchBranches = async () => {
  try {
    const response = await axios.get("https://localhost:7296/api/ApiBranch");
    branchs.value = response.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    toast.error("Không thể tải danh sách chi nhánh!");
  }
};

// Xử lý khi người dùng chọn chi nhánh
const handleBranchChange = (branch) => {
  toast.success(`Bạn đã chọn chi nhánh: ${branch.name}`);
};

const handleBranchCheckboxChange = async (branchId) => {
  selectedBranchId.value = branchId;
  selectedHallId.value = null; // Reset sảnh khi đổi chi nhánh
  hallsByBranch.value = []; // Reset danh sách sảnh

  try {
    const response = await axios.get(`https://localhost:7296/api/get-hall-by-branchid/${branchId}`);
    hallsByBranch.value = response.data;
    toast.success("Đã tải danh sách sảnh cưới!");
  } catch (error) {
    console.error("Error fetching halls:", error);
    toast.error("Không thể tải danh sách sảnh cưới!");
  }
};
const handleHallCheckboxChange = (hallId) => {
  selectedHallId.value = hallId;
  toast.success("Bạn đã chọn sảnh cưới!");
};
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Hàm gọi API để lấy danh sách thực đơn
const fetchMenus = async () => {
  try {
    const response = await axios.get("https://localhost:7296/api/menu");
    menus.value = response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    toast.error("Không thể tải danh sách thực đơn!");
  }
};
// Hàm xử lý khi chọn món ăn
const handleMenuCheckboxChange = (menuId) => {
  if (selectedMenus.value.includes(menuId)) {
    selectedMenus.value = selectedMenus.value.filter((id) => id !== menuId);
    toast.error("Đã hủy món ăn!");
  } else {
    selectedMenus.value.push(menuId);
    toast.success("Đã chọn món ăn!");
  }
};

// Lifecycle hook
onMounted(() => {
  fetchBranches();
  fetchMenus();
});
</script>

<style scoped>
/* Thêm style nếu cần */
</style>