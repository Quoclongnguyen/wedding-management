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
import { useToast } from "vue-toastification";
import LoadingOverlay from "@/components/Context/LoadingOverlay.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./Payment.scss";

const loading = ref(true);
const error = ref(false);
const orderSent = ref(false);
const toast = useToast();

const paymentComplete = async () => {
  const storedInvoiceId = localStorage.getItem("invoiceId");

  if (storedInvoiceId) {
    const invoiceId = JSON.parse(storedInvoiceId);

    try {
      const response = await fetch(
        `https://localhost:7296/api/invoice/repayment-compelete/${invoiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceId),
        }
      );

      if (!response.ok) throw new Error("Failed to complete payment");

      const data = await response.json();
      console.log("Đã gửi đơn hàng thành công:", data);
      orderSent.value = true;
      loading.value = false;
      localStorage.removeItem("invoiceId");
    } catch (err) {
      console.error("Lỗi khi gửi đơn hàng:", err);
      loading.value = false;
      error.value = true;
      localStorage.removeItem("invoiceId");
    }
  } else {
    console.error("Không có dữ liệu đơn hàng trong localStorage");
    loading.value = false;
    error.value = true;
  }
};

const sendOrderData = async () => {
  const storedOrderData = localStorage.getItem("orderData");

  if (storedOrderData) {
    const orderData = JSON.parse(storedOrderData);

    try {
      const response = await fetch("https://localhost:7296/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to send order data");

      const data = await response.json();
      console.log("Đã gửi đơn hàng thành công:", data);
      orderSent.value = true;
      loading.value = false;
      localStorage.removeItem("orderData");
    } catch (err) {
      console.error("Lỗi khi gửi đơn hàng:", err);
      loading.value = false;
      error.value = true;
      localStorage.removeItem("orderData");
    }
  } else {
    console.error("Không có dữ liệu đơn hàng trong localStorage");
    loading.value = false;
    error.value = true;
  }
};

const retryPayment = () => {
  window.location.href = "/bill";
};

const navigateTo = (path) => {
  window.location.href = path;
};

onMounted(() => {
  if (!orderSent.value) {
    const storedInvoiceId = localStorage.getItem("invoiceId");
    if (storedInvoiceId != null) {
      paymentComplete();
    } else {
      sendOrderData();
    }
  }
});
</script>