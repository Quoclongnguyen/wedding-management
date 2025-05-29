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
const orderSent = ref(false);
const toast = useToast();
const route = useRoute();

const paymentComplete = async (invoiceId) => {
  try {
    console.log(" Gọi API hoàn tất thanh toán với invoiceId:", invoiceId);

    const response = await fetch(`https://localhost:7296/api/invoice/repayment-compelete/${invoiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(" Phản hồi từ server:", data);

    if (!response.ok || data.message?.includes("hủy")) {
      // Nếu server trả về thông báo lỗi hoặc đơn hàng đã bị hủy
      throw new Error(data.message || "Không thể xác nhận thanh toán");
    }

    // Thành công
    orderSent.value = true;
    toast.success("Đơn hàng đã được xác nhận thanh toán!");
  } catch (err) {
    console.error(" Lỗi khi hoàn tất thanh toán:", err);
    toast.error(err.message || "Thanh toán thất bại. Vui lòng thử lại.");
    error.value = true;
  } finally {
    loading.value = false;
    localStorage.removeItem("invoiceId");
    localStorage.removeItem("orderData");
  }
};

const retryPayment = () => window.location.href = "/bill";
const navigateTo = (path) => window.location.href = path;

onMounted(() => {
  const status = route.query.status;
  const invoiceIdRaw = route.query.invoiceId;

  console.log(" Trạng thái từ URL:", status);
  console.log(" invoiceIdRaw:", invoiceIdRaw);

  if (status === "fail") {
    error.value = true;
    loading.value = false;
    return;
  }

  if (status === "success" && invoiceIdRaw) {
    const invoiceId = parseInt(invoiceIdRaw);
    if (!isNaN(invoiceId)) {
      console.log("👉 Gọi xử lý thanh toán sau callback VNPAY...");
      paymentComplete(invoiceId);
    } else {
      console.error(" invoiceId không hợp lệ từ URL");
      error.value = true;
      loading.value = false;
    }
    return;
  }

  const storedInvoiceId = localStorage.getItem("invoiceId");
  if (storedInvoiceId) {
    try {
      const invoiceId = JSON.parse(storedInvoiceId);
      console.log(" Gọi lại API từ localStorage...");
      paymentComplete(invoiceId);
    } catch (e) {
      console.error(" Không đọc được invoiceId từ localStorage:", e);
      error.value = true;
      loading.value = false;
    }
  } else {
    console.error(" Không có invoiceId, không thể xử lý.");
    error.value = true;
    loading.value = false;
  }
});
</script>
