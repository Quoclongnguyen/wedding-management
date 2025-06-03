<template>
  <div class="payment-container">
    <div class="payment-card">
      <div v-if="loading" class="loading-state">
        <LoadingOverlay />
        <h3>Đang xử lý thanh toán</h3>
        <p>Vui lòng đợi trong giây lát...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="status-icon error">
          <font-awesome-icon icon="times-circle" />
        </div>
        <h2>Thanh toán thất bại</h2>
        <p>Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.</p>
        <p class="error-details">Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ bộ phận hỗ trợ khách hàng.</p>
        <button class="retry-button" @click="retryPayment">Thử lại</button>
      </div>

      <div v-else-if="isDeposit" class="deposit-state">
        <div class="status-icon deposit">
          <font-awesome-icon icon="check-circle" />
        </div>
        <h2>Đặt cọc thành công</h2>
        <p>Bạn đã đặt cọc thành công cho đơn hàng.<br>Vui lòng thanh toán phần còn lại trước ngày tổ chức.</p>
        <div class="success-actions">
          <button class="home-button" @click="navigateTo('/')">Về trang chủ</button>
          <button class="new-order-button" @click="navigateTo('/bill')">Đặt đơn mới</button>
        </div>
      </div>

      <div v-else class="success-state">
        <div class="status-icon success">
          <font-awesome-icon icon="check-circle" />
        </div>
        <h2>Thanh toán thành công</h2>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        <div class="success-actions">
          <button class="home-button" @click="navigateTo('/')">Về trang chủ</button>
          <button class="new-order-button" @click="navigateTo('/bill')">Đặt đơn mới</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";
import LoadingOverlay from "@/components/Context/LoadingOverlay.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./Payment.scss";

const loading = ref(true);
const error = ref(false);
const toast = useToast();
const route = useRoute();

const isDeposit = ref(false);
const invoiceData = ref(null);

const retryPayment = () => window.location.href = "/bill";
const navigateTo = (path) => window.location.href = path;

const fetchInvoiceStatus = async (invoiceId) => {
  try {
    const response = await fetch(`https://localhost:7296/api/invoice/${invoiceId}`);
    if (!response.ok) throw new Error("Không lấy được thông tin hóa đơn");
    invoiceData.value = await response.json();

    console.log("Payment.vue Trạng thái hóa đơn:", invoiceData.value);

    const deposit = invoiceData.value.depositPayment || 0;
    const total = invoiceData.value.total || 0;
    const isFullyPaid = deposit >= total;

    if (isFullyPaid) {
      isDeposit.value = false;
      toast.success("Bạn đã thanh toán đầy đủ đơn hàng!");
    } else if (deposit > 0) {
      isDeposit.value = true;
      toast.success("Bạn đã đặt cọc thành công!");
    } else {
      isDeposit.value = false;
      toast.info("Đơn hàng chưa được thanh toán.");
    }
  } catch (err) {
    error.value = true;
    console.error("[Payment.vue] Lỗi lấy trạng thái hóa đơn:", err);
  } finally {
    loading.value = false;
    localStorage.removeItem("invoiceId");
    localStorage.removeItem("orderData");
  }
};


onMounted(() => {
  const status = route.query.status;
  const invoiceIdRaw = route.query.invoiceId;

  if (status === "fail") {
    error.value = true;
    loading.value = false;
    return;
  }

  const invoiceId = invoiceIdRaw || localStorage.getItem("invoiceId");

  if (!invoiceId) {
    error.value = true;
    loading.value = false;
    return;
  }

  fetchInvoiceStatus(invoiceId);
});
</script>
