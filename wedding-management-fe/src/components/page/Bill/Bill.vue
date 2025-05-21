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


            <Accordion.Item eventKey="3">
              <Accordion.Header>Dịch Vụ</Accordion.Header>
              <Accordion.Body class="body">
                <div v-for="(service, index) in services" :key="index" class="menu-card" style="width: 18rem;">
                  <img class="image-fixed-height" :src="service.image" alt="Service Image" />
                  <div class="card-body">
                    <h5 class="card-title">{{ service.name }}</h5>
                    <p class="card-text">Mô tả: {{ service.description }}</p>
                    <p class="card-text">Giá: {{ formatPrice(service.price) }}</p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'flexCheckService-' + index"
                        :checked="selectedServices.includes(service.serviceId)"
                        @change="handleServiceCheckboxChange(service.serviceId)" />
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Thông Tin Người Đặt</Accordion.Header>
              <Accordion.Body class="body">
                <div class="form-group">
                  <label for="fullName">Họ và Tên:</label>
                  <input id="fullName" type="text" class="form-control" v-model="fullName"
                    placeholder="Nhập họ và tên" />
                </div>
                <div class="form-group">
                  <label for="phoneNumber">Số Điện Thoại:</label>
                  <input id="phoneNumber" type="tel" class="form-control" v-model="phoneNumber"
                    placeholder="Nhập số điện thoại" />
                </div>
                <div class="form-group">
                  <label for="note">Ghi Chú:</label>
                  <textarea id="note" class="form-control" v-model="note"
                    placeholder="Nhập ghi chú (nếu có)"></textarea>
                </div>
                <button type="button" class="btn btn-success mt-3" @click="handleSubmitOrder">
                  Xác Nhận Đặt Hàng
                </button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Chọn Ngày và Buổi Tổ Chức</Accordion.Header>
              <Accordion.Body class="body">
                <div class="form-group">
                  <label for="selectedDate">Ngày Tổ Chức:</label>
                  <input id="selectedDate" type="date" class="form-control" v-model="selectedDate"
                    placeholder="Chọn ngày tổ chức" />
                </div>
                <div class="form-group mt-3">
                  <label for="selectedTimeSlot">Buổi Tổ Chức:</label>
                  <select id="selectedTimeSlot" class="form-control" v-model="selectedTimeSlot">
                    <option value="" disabled>Chọn buổi tổ chức</option>
                    <option v-for="slot in timeSlots" :key="slot" :value="slot">
                      {{ slot }}
                    </option>
                  </select>
                </div>
              </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item eventKey="6">
              <div class="order-summary mt-4">
                <h5>Tổng Tiền Trước Giảm Giá: {{ formatPrice(calculateTotalPrice() + (discount / 100) *
                  calculateTotalPrice()) }}</h5>
                <h5>Giảm Giá: {{ discount }}%</h5>
                <h5>Tổng Tiền Sau Giảm Giá: {{ formatPrice(calculateTotalPrice()) }}</h5>
              </div>
              <Accordion.Header>Áp Dụng Mã Giảm Giá</Accordion.Header>
              <Accordion.Body class="body">
                <div class="form-group">
                  <label for="promoCode">Chọn Mã Giảm Giá:</label>
                  <select id="promoCode" class="form-control" v-model="selectedPromoCode" @change="applyPromoCode">
                    <option value="" disabled>Chọn mã giảm giá</option>
                    <option v-for="code in promoCodes" :key="code.codeId" :value="code">
                      {{ code.codeName }} - Giảm {{ code.discount }}%
                    </option>
                  </select>
                </div>
                <p v-if="discount > 0" class="mt-3">
                  Đã áp dụng mã giảm giá: <strong>{{ selectedPromoCode.codeName }}</strong> - Giảm <strong>{{ discount
                  }}%</strong>
                </p>
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
// state cho dịch vụ
const services = ref([]);
const selectedServices = ref([]);
// state cho nhập thông tin nguoi dùng
const fullName = ref("");
const phoneNumber = ref("");
const note = ref("");
// state cho ngày tổ chức
const selectedDate = ref(null); // Ngày tổ chức
const selectedTimeSlot = ref(""); // Buổi tổ chức (sáng, chiều, tối)
const timeSlots = ref(["Sáng", "Chiều", "Tối"]); // Các buổi tổ chức

// state cho mã giam giá
const promoCodes = ref([]); // Danh sách mã giảm giá
const selectedPromoCode = ref(null); // Mã giảm giá đã chọn
const discount = ref(0); // Giá trị giảm giá

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

// Hàm gọi API để lấy danh sách dịch vụ
const fetchServices = async () => {
  try {
    const response = await axios.get("https://localhost:7296/api/service");
    services.value = response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    toast.error("Không thể tải danh sách dịch vụ!");
  }
};
// Hàm xử lý khi chọn dịch vụ
const handleServiceCheckboxChange = (serviceId) => {
  if (selectedServices.value.includes(serviceId)) {
    selectedServices.value = selectedServices.value.filter((id) => id !== serviceId);
    toast.error("Đã hủy dịch vụ!");
  } else {
    selectedServices.value.push(serviceId);
    toast.success("Đã chọn dịch vụ!");
  }
};



const validateOrder = () => {
  // Kiểm tra thông tin người dùng
  if (!fullName.value.trim()) {
    toast.error("Vui lòng nhập họ và tên!");
    return false;
  }
  if (!phoneNumber.value.trim() || !/^[0-9]{10}$/.test(phoneNumber.value)) {
    toast.error("Vui lòng nhập số điện thoại hợp lệ (10 chữ số)!");
    return false;
  }

  // Kiểm tra thông tin ngày và buổi tổ chức
  if (!selectedDate.value) {
    toast.error("Vui lòng chọn ngày tổ chức!");
    return false;
  }
  if (!selectedTimeSlot.value) {
    toast.error("Vui lòng chọn buổi tổ chức!");
    return false;
  }

  return true;
};

const handleSubmitOrder = () => {
  if (!validateOrder()) {
    return;
  }
  // Tiếp tục xử lý đặt hàng...
  toast.success("Thông tin hợp lệ! Đang xử lý đơn hàng...");
};


//hàm gọi API để lấy danh sách mã giảm giá
const fetchPromoCodes = async () => {
  try {
    const response = await axios.get("https://localhost:7296/api/invoice/promo-code");
    promoCodes.value = response.data.filter((code) => {
      const currentDate = new Date();
      const expiryDate = new Date(code.expirationDate);
      return expiryDate > currentDate; // Chỉ lấy mã giảm giá còn hiệu lực
    });
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    toast.error("Không thể tải danh sách mã giảm giá!");
  }
};
// hàm xử lý khi nguoi dùng chọn mã giảm giá
const applyPromoCode = () => {
  if (selectedPromoCode.value) {
    discount.value = selectedPromoCode.value.discount; // Lấy giá trị giảm giá từ mã đã chọn
    toast.success(`Đã áp dụng mã giảm giá: ${selectedPromoCode.value.codeName}`);
  } else {
    discount.value = 0; // Không áp dụng mã giảm giá
    toast.error("Vui lòng chọn mã giảm giá hợp lệ!");
  }
};
const calculateTotalPrice = () => {
  const menuTotal = selectedMenus.value.reduce((acc, menuId) => {
    const menu = menus.value.find((m) => m.menuId === menuId);
    return acc + (menu ? menu.price : 0);
  }, 0);

  const serviceTotal = selectedServices.value.reduce((acc, serviceId) => {
    const service = services.value.find((s) => s.serviceId === serviceId);
    return acc + (service ? service.price : 0);
  }, 0);

  const hall = hallsByBranch.value.find((h) => h.hallId === selectedHallId.value);
  const hallTotal = hall ? hall.price : 0;

  const totalBeforeDiscount = menuTotal + serviceTotal + hallTotal;
  const discountedAmount = (discount.value / 100) * totalBeforeDiscount;
  return totalBeforeDiscount - discountedAmount;
};







// Lifecycle hook
onMounted(() => {
  fetchBranches();
  fetchMenus();
  fetchServices();
  fetchPromoCodes(); // Gọi API lấy mã giảm giá
});
</script>

<style scoped></style>