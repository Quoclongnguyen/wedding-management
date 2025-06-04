<template>
  <div class="bill">
    <div class="bill-page" style="display: flex; justify-content: center; align-items: center;">
      <div class="bill-form-container display-flex justify-content-center align-items-center">
        <h1 class="title">Đơn Hàng</h1>
        <form>

          <!-- Chi Nhánh -->
          <div class="accordion-item">
            <button type="button" class="branch-toggle-button" :class="{ active: openSection === 'branch' }"
              @click="toggleSection('branch')">
              Chi Nhánh
            </button>

            <transition name="accordion-slide">
              <div v-if="openSection === 'branch'" class="accordion-body">
                <div v-for="(branch, index) in branchs" :key="index" class="menu-card"
                  style="width: 18rem; margin-bottom: 16px; margin-right: 16px">
                  <img class="card-img-top image-fixed-height" :src="branch.image" alt="Branch image" />
                  <div class="card-body">
                    <h5 class="card-title">{{ branch.name }}</h5>
                    <p class="card-text">Mô tả: {{ branch.description }}</p>
                    <p class="card-text">Địa chỉ: {{ branch.address }}</p>
                    <p class="card-text">SDT: {{ branch.phone }}</p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'flexCheckDefault-' + index"
                        :checked="branch.branchId === selectedBranchId"
                        @change="() => handleBranchCheckboxChange(branch.branchId)" />
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Sảnh Cưới -->
          <div class="accordion-item">
            <button type="button" class="branch-toggle-button" :class="{ active: openSection === 'hall' }"
              @click="toggleSection('hall')">
              Sảnh Cưới
            </button>

            <transition name="accordion-slide">
              <div v-if="openSection === 'hall'" class="accordion-body">
                <div v-for="(hall, index) in hallsByBranch" :key="index" class="menu-card"
                  style="width: 18rem; margin-bottom: 16px; margin-right: 16px">
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
              </div>
            </transition>
          </div>


          <!-- MENU -->
          <div class="accordion-item">
            <div>
              <h2 class="section-title">Thực Đơn</h2>

            </div>
            <button type="button" class="branch-toggle-button" :class="{ active: openSection === 'menu' }"
              @click="toggleSection('menu')">
              Thực Đơn
            </button>

            <transition name="accordion-slide">
              <div v-if="openSection === 'menu'" class="accordion-body">
                <div v-for="(menu, index) in menus" :key="index" class="menu-card"
                  style="width: 18rem; margin-bottom: 16px; margin-right: 16px">
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
              </div>
            </transition>
          </div>

          <!-- Dịch vụ -->

          <div class="accordion-item">

            <div>
              <h2 class="section-title">Dịch Vụ</h2>
            </div>
            <button type="button" class="branch-toggle-button" :class="{ active: openSection === 'service' }"
              @click="toggleSection('service')">
              Dịch Vụ
            </button>

            <transition name="accordion-slide">
              <div v-if="openSection === 'service'" class="accordion-body">
                <div v-for="(service, index) in services" :key="index" class="menu-card"
                  style="width: 18rem; margin-bottom: 16px; margin-right: 16px">
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
              </div>
            </transition>
          </div>




          <!-- Thông tin người đặt -->
          <div class="section-block">
            <h2 class="section-title">Thông tin người đặt</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Họ và tên:</label>
                <input id="fullName" type="text" class="form-control" v-model="fullName" placeholder="nguyen van a" />
              </div>

              <div class="form-group">
                <label for="phoneNumber">Số điện thoại:</label>
                <input id="phoneNumber" type="tel" class="form-control" v-model="phoneNumber"
                  placeholder="0325478964" />
              </div>

              <div class="form-group full-width">
                <label for="note">Ghi chú cho nhà hàng:</label>
                <textarea id="note" class="form-control" v-model="note" placeholder="Ghi chú nếu có"
                  rows="3"></textarea>
              </div>

              <div class="form-group">
                <label for="selectedDate">Ngày đến tham dự:</label>
                <input id="selectedDate" type="date" class="form-control" v-model="selectedDate" />
              </div>

              <div class="form-group">
                <label for="selectedTimeSlot">Chọn ca:</label>
                <select id="selectedTimeSlot" class="form-control" v-model="selectedTimeSlot">
                  <option value="">-- Chọn ca --</option>
                  <option v-for="slot in timeSlots" :key="slot" :value="slot">
                    {{ slot }}
                  </option>
                </select>
              </div>
            </div>
          </div>


          <Accordion>









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

            <div class="text-center mt-4">
              <button type="button" class="btn btn-primary"
                style="background: #ff6b6b; border: none; padding: 10px 30px; border-radius: 6px; font-size: 16px;"
                @click="showConfirmModal = true">
                Xác nhận đặt nhà hàng
              </button>
            </div>

            <!-- Modal xác nhận và thanh toán -->
            <Modal v-if="showConfirmModal" @close="showConfirmModal = false">
              <template #header>
                <div style="display: flex; align-items: center;">
                  <i class="fas fa-clipboard-check" style="margin-right: 10px; color: #27ae60"></i>
                  <span style="font-size: 28px; font-weight: bold;">Xác nhận đặt nhà hàng</span>
                </div>
              </template>
              <template #body>
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <button type="button" class="btn"
                    style="background: #7b61ff; color: #fff; font-weight: 600; font-size: 18px; border-radius: 10px; margin-top: 30px; margin-bottom: 20px; width: 250px;"
                    @click="handleCheckOrder" :disabled="isChecking">
                    <i class="fas fa-search" style="margin-right: 8px;"></i>
                    {{ isChecking ? 'Đang kiểm tra...' : 'Kiểm tra đơn hàng' }}
                  </button>

                  <div v-if="orderChecked === true" style="color: green; font-weight: bold; margin-bottom: 20px;">
                    Thông tin đơn hàng hợp lệ.
                  </div>
                  <div v-else-if="orderChecked === false && checkClicked"
                    style="color: red; font-weight: bold; margin-bottom: 20px;">
                    Đơn hàng không hợp lệ. Vui lòng kiểm tra lại.
                  </div>

                  <div
                    style="background: #fff; border-radius: 16px; box-shadow: 0 2px 8px #eee; padding: 24px 20px; width: 320px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                      <i class="fas fa-money-bill-wave"
                        style="color: #f4c542; font-size: 28px; margin-right: 10px;"></i>
                      <span style="font-size: 22px; font-weight: 600;">Thanh toán đặt cọc 50%</span>
                    </div>
                    <button type="button" class="btn"
                      style="background: linear-gradient(90deg, #00c6fb 0%, #43e97b 100%); color: #fff; font-weight: 600; font-size: 16px; border-radius: 8px; width: 90%; margin-top: 10px;"
                      @click="handleVnPayPayment" :disabled="!orderChecked">
                      <i class="fas fa-credit-card" style="margin-right: 8px;"></i>
                      Thanh toán online
                    </button>
                  </div>
                </div>
              </template>
              <template #footer>
                <button class="btn btn-secondary" style="width: 120px;" @click="showConfirmModal = false">
                  <i class="fas fa-times"></i> Đóng
                </button>
              </template>
            </Modal>


            <!-- Nút gọi mở modal chi tiết đơn hàng -->
            <button type="button" class="btn btn-info mt-4"
              style="position: fixed; bottom: 90px; right: 0; z-index: 1000" @click="toggleOrderModal">
              <i class="fas fa-shopping-cart" style="margin-right: 8px;"></i> Xem Đơn Hàng
            </button>

            <!-- Hiển thị Modal xem chi tiết đơn hàng -->
            <Modal v-if="showOrderModal" @close="toggleOrderModal">
              <template #header>
                <h3>Chi Tiết Đơn Hàng</h3>
              </template>
              <template #body>
                <div>
                  <!-- Chi Nhánh -->
                  <h5>Chi nhánh đã chọn</h5>
                  <div v-if="selectedBranchId">
                    <img :src="branchs.find(branch => branch.branchId === selectedBranchId)?.image || ''"
                      alt="Branch Image" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;" />
                    <p>{{branchs.find(branch => branch.branchId === selectedBranchId)?.name || 'Chưa chọn'}}</p>
                  </div>

                  <!-- Sảnh Cưới -->
                  <h5>Sảnh cưới đã chọn</h5>
                  <div v-if="selectedHallId">
                    <img :src="hallsByBranch.find(hall => hall.hallId === selectedHallId)?.image || ''" alt="Hall Image"
                      style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;" />
                    <p>{{hallsByBranch.find(hall => hall.hallId === selectedHallId)?.name || 'Chưa chọn'}}</p>
                    <p>Giá: {{formatPrice(hallsByBranch.find(hall => hall.hallId === selectedHallId)?.price || 0)}}
                    </p>
                  </div>

                  <!-- Thực Đơn -->
                  <h5>Danh sách món ăn đã chọn</h5>
                  <div v-for="menuId in selectedMenus" :key="menuId" style="margin-bottom: 10px;">
                    <img :src="menus.find(menu => menu.menuId === menuId)?.image || ''" alt="Menu Image"
                      style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 5px;" />
                    <p>{{menus.find(menu => menu.menuId === menuId)?.name || 'Không xác định'}}</p>
                    <p>Giá: {{formatPrice(menus.find(menu => menu.menuId === menuId)?.price || 0)}}</p>
                  </div>

                  <!-- Dịch Vụ -->
                  <h5>Danh sách dịch vụ đã chọn</h5>
                  <div v-for="serviceId in selectedServices" :key="serviceId" style="margin-bottom: 10px;">
                    <img :src="services.find(service => service.serviceId === serviceId)?.image || ''"
                      alt="Service Image" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 5px;" />
                    <p>{{services.find(service => service.serviceId === serviceId)?.name || 'Không xác định'}}</p>
                    <p>Giá: {{formatPrice(services.find(service => service.serviceId === serviceId)?.price || 0)}}</p>
                  </div>

                  <!-- Tổng Tiền -->
                  <h3>Tổng Tiền</h3>
                  <p>{{ formatPrice(calculateTotalPrice()) }}</p>
                </div>
              </template>
              <template #footer>
                <button class="btn btn-secondary" @click="toggleOrderModal">Đóng</button>
              </template>
            </Modal>

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
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { watch } from "vue";


import Modal from '@/components/common/Modal.vue'; // Đường dẫn tùy thuộc vào vị trí file Modal
// State

const isBranchOpen = ref(false)


const openSection = ref(null)


const activeKey = ref(null);
const toggleAccordion = (key) => {
  activeKey.value = activeKey.value === key ? null : key;
};



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


const showOrderModal = ref(false); // Trạng thái điều khiển modal

// Toast thông báo
const toast = useToast();

// Hàm toggle để mở/đóng danh sách chi nhánh
const toggleBranch = () => {
  isBranchOpen.value = !isBranchOpen.value;
};



// Lưu thông tin người đặt
watch(fullName, (val) => localStorage.setItem("fullName", val));
watch(phoneNumber, (val) => localStorage.setItem("phoneNumber", val));
watch(note, (val) => localStorage.setItem("note", val));

// Lưu ngày tổ chức, ca, sảnh, món ăn, dịch vụ
watch(selectedDate, (val) => localStorage.setItem("selectedDate", val));
watch(selectedTimeSlot, (val) => localStorage.setItem("selectedTimeSlot", val));
watch(selectedBranchId, (val) => localStorage.setItem("selectedBranchId", val));
watch(selectedHallId, (val) => localStorage.setItem("selectedHallId", val));
watch(selectedMenus, (val) => localStorage.setItem("selectedMenus", JSON.stringify(val)));
watch(selectedServices, (val) => localStorage.setItem("selectedServices", JSON.stringify(val)));


//kiem tra don hang
const orderChecked = ref(false);
const isChecking = ref(false);
const checkClicked = ref(false);


const showConfirmModal = ref(false);






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


const validateOrder = async () => {
  if (!fullName.value.trim()) {
    toast.error("Vui lòng nhập họ và tên!");
    return false;
  }

  if (!phoneNumber.value.trim() || !/^[0-9]{10}$/.test(phoneNumber.value)) {
    toast.error("Vui lòng nhập số điện thoại hợp lệ (10 chữ số)!");
    return false;
  }

  if (!selectedDate.value) {
    toast.error("Vui lòng chọn ngày tổ chức!");
    return false;
  }

  if (!selectedTimeSlot.value) {
    toast.error("Vui lòng chọn buổi tổ chức!");
    return false;
  }

  if (!selectedBranchId.value) {
    toast.error("Vui lòng chọn chi nhánh!");
    return false;
  }

  if (!selectedHallId.value) {
    toast.error("Vui lòng chọn sảnh cưới!");
    return false;
  }

  if (selectedMenus.value.length < 3) {
    toast.error("Vui lòng chọn ít nhất 3 món ăn!");
    return false;
  }

  if (selectedServices.value.length < 1) {
    toast.error("Vui lòng chọn ít nhất 1 dịch vụ!");
    return false;
  }

  try {
    await axios.post("https://localhost:7296/api/invoice/checked", {
      AttendanceDate: selectedDate.value,
      BranchId: selectedBranchId.value,
      HallId: selectedHallId.value,
      TimeHall: selectedTimeSlot.value,
    });
    return true;
  } catch (error) {
    // Nếu backend trả lỗi 400 là bị trùng
    if (error.response && error.response.status === 400) {
      // Hiển thị rõ lý do bị trùng
      const msg = error.response.data?.message || "Sảnh đã được đặt vào thời gian này. Vui lòng chọn sảnh khác!";
      toast.error(msg);
    } else {
      toast.error("Không thể kiểm tra trạng thái sảnh. Vui lòng thử lại!");
    }
    return false;
  }
};


const handleSubmitOrder = async () => {
  const isValid = await validateOrder();
  if (!isValid) {
    return;
  }

  toast.success("Thông tin hợp lệ! Đang xử lý đơn hàng...");
  // Gửi dữ liệu đơn hàng đến API hoặc thực hiện các bước tiếp theo
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
    return acc + (menu?.price || 0); // Sử dụng giá trị mặc định 0 nếu không tìm thấy menu
  }, 0);

  const serviceTotal = selectedServices.value.reduce((acc, serviceId) => {
    const service = services.value.find((s) => s.serviceId === serviceId);
    return acc + (service?.price || 0); // Sử dụng giá trị mặc định 0 nếu không tìm thấy service
  }, 0);

  const hall = hallsByBranch.value.find((h) => h.hallId === selectedHallId.value);
  const hallTotal = hall?.price || 0; // Sử dụng giá trị mặc định 0 nếu không tìm thấy hall

  const totalBeforeDiscount = menuTotal + serviceTotal + hallTotal;
  const discountedAmount = (discount.value / 100) * totalBeforeDiscount;
  return totalBeforeDiscount - discountedAmount;
};



const confirmOrder = async () => {
  const isValid = await validateOrder()
  if (!isValid) return

  // Lấy userId từ token nếu cần
  const token = Cookies.get("token_user")

  //Nếu không có token → báo lỗi và dừng lại
  if (!token) {
    toast.error("Không tìm thấy token người dùng. Vui lòng đăng nhập lại.");
    return;
  }

  let userId
  try {
    // Giải mã token
    const decoded = jwt_decode(token)
    userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]

    // Nếu không có userId trong token → báo lỗi
    if (!userId) throw new Error("Không lấy được userId từ token")
  } catch (e) {
    toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    return;
  }

  const total = calculateTotalPrice()
  const totalBefore = total / (1 - discount.value / 100)



  const orderData = {
    UserId: userId,
    BranchId: selectedBranchId.value,
    HallId: selectedHallId.value,
    OrderMenus: selectedMenus.value.map(menuId => ({ MenuID: menuId, Quantity: 1 })),
    OrderServices: selectedServices.value.map(serviceId => ({ ServiceID: serviceId, Quantity: 1 })),
    AttendanceDate: selectedDate.value,
    TimeHall: selectedTimeSlot.value,
    FullName: fullName.value,
    PhoneNumber: phoneNumber.value,
    Note: note.value || "",
    InvoiceCodeRequest: selectedPromoCode.value
      ? [{ CodeId: selectedPromoCode.value.codeId }]
      : [],
    Total: total,
    TotalBeforeDiscount: totalBeforeDiscount,
    // KHÔNG truyền DepositPayment và OrderStatus ở đây!
    PaymentWallet: false
  };

  try {
    const response = await axios.post("https://localhost:7296/api/invoice", orderData)
    toast.success("Đơn hàng đã được xác nhận!")
  } catch (error) {
    console.error("Error confirming order:", error.response?.data || error.message)
    toast.error(error.response?.data?.message || "Lỗi khi gửi đơn hàng!")
  }
}


const toggleOrderModal = () => {
  showOrderModal.value = !showOrderModal.value;
};

const handleVnPayPayment = async () => {
  try {
    // 1. Kiểm tra hợp lệ đơn hàng
    const isValid = await validateOrder();
    console.log("[handleVnPayPayment] validateOrder result:", isValid);
    if (!isValid) {
      toast.error("Vui lòng kiểm tra lại thông tin đơn hàng!");
      return;
    }

    // 2. Lấy token và userId
    const token = Cookies.get("token_user");
    console.log("[handleVnPayPayment] token:", token);
    if (!token) {
      toast.error("Bạn cần đăng nhập để đặt hàng!");
      return;
    }
    let userId;
    try {
      const decoded = jwt_decode(token);
      userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      console.log("[handleVnPayPayment] userId:", userId);
      if (!userId) throw new Error();
    } catch (e) {
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      console.error("[handleVnPayPayment] Token decode error:", e);
      return;
    }

    // 3. Chuẩn bị dữ liệu đơn hàng
    const total = calculateTotalPrice();
    const totalBeforeDiscount = total / (1 - discount.value / 100);

    const orderData = {
      UserId: userId,
      BranchId: selectedBranchId.value,
      HallId: selectedHallId.value,
      OrderMenus: selectedMenus.value.map(menuId => ({ MenuID: menuId, Quantity: 1 })),
      OrderServices: selectedServices.value.map(serviceId => ({ ServiceID: serviceId, Quantity: 1 })),
      AttendanceDate: selectedDate.value,
      TimeHall: selectedTimeSlot.value,
      FullName: fullName.value,
      PhoneNumber: phoneNumber.value,
      Note: note.value || "",
      InvoiceCodeRequest: selectedPromoCode.value
        ? [{ CodeId: selectedPromoCode.value.codeId }]
        : [],
      Total: total,
      TotalBeforeDiscount: totalBeforeDiscount,
      PaymentWallet: false
    };
    console.log("[handleVnPayPayment] orderData gửi lên BE:", orderData);

    // 4. Gửi đơn hàng lên backend
    const res = await fetch("https://localhost:7296/api/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    // 5. Xử lý lỗi trả về từ backend
    if (!res.ok) {
      let errorMsg = "Tạo đơn hàng thất bại!";
      try {
        const errorJson = await res.json();
        errorMsg = errorJson.message || errorMsg;
        console.error("[handleVnPayPayment] Lỗi trả về từ BE:", errorJson);
      } catch {
        const errorText = await res.text();
        if (errorText) errorMsg = errorText;
        console.error("[handleVnPayPayment] Lỗi trả về từ BE (text):", errorText);
      }
      toast.error(errorMsg);
      return;
    }

    // 6. Lấy invoiceId từ response
    const result = await res.json();
    const invoiceId = result.invoiceId || result.invoiceID || result.id;
    console.log("[handleVnPayPayment] invoiceId nhận về:", invoiceId, "result:", result);
    if (!invoiceId) {
      toast.error("Không nhận được mã đơn hàng từ hệ thống.");
      return;
    }

    // 7. Gọi API lấy link thanh toán VNPAY
    const depositAmount = Math.round(total / 2);
    console.log("[handleVnPayPayment] Gọi API lấy payment-url với:", { invoiceId, depositAmount });
    const urlRes = await fetch(`https://localhost:7296/api/payment/get-payment-url?invoiceId=${invoiceId}&amount=${depositAmount}`);
    if (!urlRes.ok) {
      let errMsg = "Lỗi khi lấy URL thanh toán!";
      try {
        const errJson = await urlRes.json();
        errMsg = errJson.message || errMsg;
        console.error("[handleVnPayPayment] Lỗi lấy payment-url (json):", errJson);
      } catch {
        const errText = await urlRes.text();
        if (errText) errMsg = errText;
        console.error("[handleVnPayPayment] Lỗi lấy payment-url (text):", errText);
      }
      toast.error(errMsg);
      return;
    }

    const paymentUrl = await urlRes.text();
    console.log("[handleVnPayPayment] paymentUrl nhận về:", paymentUrl);

    // 8. Lưu invoiceId để xử lý sau khi thanh toán xong
    localStorage.setItem("invoiceId", invoiceId.toString());

    // 9. Redirect sang trang VNPAY
    window.location.href = paymentUrl;

  } catch (err) {
    console.error("[handleVnPayPayment] Lỗi khi xử lý thanh toán:", err);
    toast.error("Không thể thực hiện thanh toán. Vui lòng thử lại.");
  }
};

// Hàm kiểm tra tính hợp lệ của đơn hàng
const handleCheckOrder = async () => {
  isChecking.value = true;
  checkClicked.value = true;
  const valid = await validateOrder();
  orderChecked.value = valid;
  isChecking.value = false;

  if (valid) {
    toast.success("Đơn hàng hợp lệ! Bạn có thể thanh toán.");
  } else {
    toast.error("Đơn hàng không hợp lệ. Vui lòng kiểm tra lại.");
  }
};

const toggleSection = (sectionName) => {
  openSection.value = openSection.value === sectionName ? null : sectionName
}


// Lifecycle hook
onMounted(async () => {
  // Gọi song song các API lấy dữ liệu chính để tối ưu tốc độ load ban đầu
  await Promise.all([
    fetchBranches(),
    fetchMenus(),
    fetchServices(),
    fetchPromoCodes()
  ]);

  //  Lấy dữ liệu từ localStorage sau khi dữ liệu gốc đã sẵn sàng
  fullName.value = localStorage.getItem("fullName") || "";
  phoneNumber.value = localStorage.getItem("phoneNumber") || "";
  note.value = localStorage.getItem("note") || "";
  selectedDate.value = localStorage.getItem("selectedDate") || null;
  selectedTimeSlot.value = localStorage.getItem("selectedTimeSlot") || "";
  selectedBranchId.value = localStorage.getItem("selectedBranchId") ? Number(localStorage.getItem("selectedBranchId")) : null;
  selectedHallId.value = localStorage.getItem("selectedHallId") ? Number(localStorage.getItem("selectedHallId")) : null;
  selectedMenus.value = localStorage.getItem("selectedMenus") ? JSON.parse(localStorage.getItem("selectedMenus")) : [];
  selectedServices.value = localStorage.getItem("selectedServices") ? JSON.parse(localStorage.getItem("selectedServices")) : [];

  //  Nếu người dùng đã chọn chi nhánh trước đó thì tự động load danh sách sảnh tương ứng
  if (selectedBranchId.value) {
    await handleBranchCheckboxChange(selectedBranchId.value);
  }
});

</script>

<style scoped>
.section-title {
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  position: relative;
}

.section-title::after {
  content: "";
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #fe8e5c 0%, #f5576c 100%);
  margin: 15px auto 0 auto;
  border-radius: 2px;
}
</style>