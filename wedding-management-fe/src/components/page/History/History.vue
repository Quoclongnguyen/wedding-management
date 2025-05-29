<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { format } from 'date-fns';

const toast = useToast();
const invoices = ref([]);
const loading = ref(true);
const selectedInvoice = ref(null);
const showModal = ref(false);
const showModalPaymentWallet = ref(false);
const isProcessingPaymentWallet = ref(false);
const wallet = ref(null);
const paymentCoin = ref('');

let id = null;
const tokenFromCookie = Cookies.get('token_user');
if (tokenFromCookie) {
  const decodedToken = jwt_decode(tokenFromCookie);
  id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
}

const fetchInvoicesByUser = async () => {
  loading.value = true;
  try {
    const res = await fetch(`https://localhost:7296/api/invoice/get-invoice/${id}`);
    const data = await res.json();
    invoices.value = data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
  } catch (err) {
    console.error('Lỗi lấy đơn hàng:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchInvoicesByUser);

const openModal = (invoice) => {
  selectedInvoice.value = invoice;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const cancelInvoice = async (invoiceId) => {
  try {
    const res = await fetch(`https://localhost:7296/api/invoice/cancel/${invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId })
    });
    if (res.ok) {
      invoices.value = invoices.value.map(i => i.invoiceID === invoiceId ? { ...i, orderStatus: 'Đã hủy đơn hàng' } : i);
      toast.success('Đã hủy đơn hàng thành công');
      closeModal();
    } else {
      toast.error('Lỗi khi hủy đơn hàng');
    }
  } catch (e) {
    console.error('Cancel error:', e);
  }
};

const repaymentInvoice = async (invoiceId) => {
  localStorage.setItem('invoiceId', invoiceId); // Lưu invoiceId vào localStorage để dùng lại sau redirect
  try {
    const res = await fetch(`https://localhost:7296/api/invoice/check-repayment/${invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId })
    });
    if (res.ok) {
      toast.success("Kiểm tra đơn hàng thành công. Chuyển sang cổng thanh toán...");
      demoPayment(); // GỌI HÀM demoPayment() → Chuyển đến VNPAY
    } else {
      const data = await res.json();
      toast.error(data.message);
      localStorage.removeItem('invoiceId');
    }
  } catch (err) {
    console.error('Repayment error:', err);
    toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
  }
};


const demoPayment = async () => {
  try {
    localStorage.removeItem('orderData'); // Dọn dữ liệu đơn hàng cũ nếu có

    //  Kiểm tra hóa đơn đầu vào
    if (!selectedInvoice.value || typeof selectedInvoice.value.invoiceID !== 'number') {
      toast.error("Không tìm thấy hóa đơn để thanh toán.");
      return;
    }

    const invoiceId = selectedInvoice.value.invoiceID;
    const total = parseFloat(selectedInvoice.value.total || 0);
    const deposit = parseFloat(selectedInvoice.value.depositPayment || 0);
    const amount = Math.floor(total - deposit); // ✅ dùng Math.floor để tránh số lẻ

    //  Log để kiểm tra
    console.log("===> InvoiceID:", invoiceId);
    console.log("===> Tổng tiền:", total);
    console.log("===> Đã đặt cọc:", deposit);
    console.log("===> Số tiền gửi lên BE (amount):", amount);

    //  VNPAY yêu cầu >= 5.000 VND và là số nguyên
    if (isNaN(amount) || amount < 5000) {
      toast.error("Số tiền cần thanh toán phải từ 5.000 VND trở lên.");
      return;
    }

    //  Gọi backend lấy URL VNPAY
    const response = await fetch(`https://localhost:7296/api/payment/get-payment-url?invoiceId=${invoiceId}&amount=${amount}`);
    if (!response.ok) {
      const errText = await response.text();
      console.error(" Gọi API thanh toán thất bại:", errText);
      throw new Error("Failed to fetch payment URL");
    }

    const url = await response.text();

    if (!url.startsWith("https://")) {
      toast.error("Đường dẫn thanh toán không hợp lệ.");
      return;
    }

    //  Điều hướng sang VNPAY
    window.location.href = url;
  } catch (err) {
    console.error(' Payment URL error:', err);
    toast.error("Không thể tạo đường dẫn thanh toán. Vui lòng thử lại.");
  }
};







const repaymentInvoiceCoin = async (invoiceId) => {
  localStorage.setItem('invoiceId', invoiceId);
  try {
    const res = await fetch(`https://localhost:7296/api/invoice/check-repayment/${invoiceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId })
    });
    if (res.ok) {
      openModalPaymentCoin(); // Hiện modal xác nhận thanh toán ví
    } else {
      const data = await res.json();
      toast.error(data.message);
      localStorage.removeItem('invoiceId');
    }
  } catch (e) {
    console.error(e);
  }
};

const openModalPaymentCoin = async () => {
  await fetchWallet();
  afterPaymentCoint();
  closeModal();
  showModalPaymentWallet.value = true;
};

const closeModalPaymentCoin = () => {
  afterPaymentCoint();
  fetchWallet();
  showModalPaymentWallet.value = false;
};

const fetchWallet = async () => {
  try {
    const res = await fetch(`https://localhost:7296/api/wallet/${id}`);

    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }

    const data = await res.json();
    wallet.value = data;
  } catch (e) {
    console.error('Wallet fetch error:', e);
    toast.error("Không thể lấy thông tin ví.");
    wallet.value = null;
  }
};


const afterPaymentCoint = () => {
  const coin = wallet.value?.coin || 0;
  const need = selectedInvoice.value.total / 2;
  paymentCoin.value = coin >= need ? coin - need : 'Không đủ số dư';
};

const paymentCompeleteWallet = () => {
  isProcessingPaymentWallet.value = true;
  setTimeout(async () => {
    const invoiceId = localStorage.getItem('invoiceId');
    try {
      const res = await fetch(`https://localhost:7296/api/invoice/repayment-compelete-wallet/${invoiceId}`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Đơn hàng đã được thanh toán thành công bằng ví!');
        closeModalPaymentCoin(); // Đóng modal
        fetchInvoicesByUser();   //  Làm mới dữ liệu
        localStorage.removeItem('invoiceId');
      } else {
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      }
    } catch (e) {
      console.error('Wallet pay error:', e);
    } finally {
      isProcessingPaymentWallet.value = false;
    }
  }, 2000);
};

const handleCancelInvoice = () => {
  if (selectedInvoice.value.orderStatus === 'Đã hủy đơn hàng') {
    window.alert('Đơn đã bị hủy trước đó');
  } else if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    cancelInvoice(selectedInvoice.value.invoiceID);
  }
};


const getStatusBadge = (invoice) => {
  // Đơn hàng đã hủy
  if (invoice.orderStatus === 'Đã hủy đơn hàng') {
    return { label: 'Đã hủy đơn hàng', class: 'badge bg-danger' };
  }

  // Đơn đã hoàn tất thanh toán
  if (invoice.orderStatus === 'Hoàn tất thanh toán' || invoice.paymentStatus) {
    return {
      label: invoice.paymentCompleteWallet
        ? 'Đã hoàn tất thanh toán bằng ví'
        : 'Đã hoàn tất thanh toán bằng VNPAY',
      class: 'badge bg-success',
    };
  }

  // Đơn đã đặt cọc nhưng chưa thanh toán hết
  if (invoice.orderStatus === 'Đã đặt cọc') {
    return {
      label: invoice.paymentWallet
        ? 'Đã đặt cọc bằng ví'
        : 'Đã đặt cọc bằng VNPAY',
      class: 'badge bg-warning text-dark',
    };
  }

  // Các trạng thái khác
  return {
    label: invoice.orderStatus || 'Không xác định',
    class: 'badge bg-secondary',
  };
};


const formatPrice = (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy');
</script>
<template>
  <div class="history-container">
    <h1>Lịch sử đặt nhà hàng</h1>

    <div v-if="loading" class="text-center py-4">
      <span class="spinner-border"></span>
    </div>


    <div v-else>
      <div v-if="invoices.length > 0">
        <div v-for="invoice in invoices" :key="invoice.invoiceID" class="card my-4 p-3 position-relative">
          <div class="position-absolute top-0 end-0 m-2">
            <span :class="getStatusBadge(invoice).class">{{ getStatusBadge(invoice).label }}</span>
          </div>

          <h5>Mã hóa đơn: {{ invoice.invoiceID }}</h5>
          <p><b>Họ tên:</b> {{ invoice.fullName }}</p>
          <p><b>Số điện thoại:</b> {{ invoice.phoneNumber }}</p>
          <p><b>Chi nhánh:</b> {{ invoice.branch.name }}</p>
          <p><b>Sảnh cưới:</b> {{ invoice.hall.name }}</p>
          <p><b>Thời gian đã đặt:</b> {{ formatDate(invoice.invoiceDate) }}</p>
          <p><b>Ngày tham dự:</b> {{ formatDate(invoice.attendanceDate) }}</p>
          <p><b>Ca:</b> {{ invoice.timeHall }}</p>
          <p><b>Tổng tiền:</b> <span class="text-danger">{{ formatPrice(invoice.total) }}</span></p>
          <p><b>Đã đặt cọc:</b> <span class="text-danger">{{ formatPrice(invoice.depositPayment) }}</span></p>

          <div class="text-end">
            <button class="btn btn-outline-primary" @click="openModal(invoice)">Xem chi tiết</button>
          </div>
        </div>
      </div>
      <p v-else>Không có hóa đơn nào.</p>
    </div>

    <!-- Modal Chi tiết hóa đơn -->
    <b-modal v-model="showModal" title="Chi tiết hóa đơn" size="xl" hide-footer>
      <template v-if="selectedInvoice">
        <h5>Mã hóa đơn: {{ selectedInvoice.invoiceID }}</h5>
        <p>Họ tên: {{ selectedInvoice.fullName }}</p>
        <p>SĐT: {{ selectedInvoice.phoneNumber }}</p>
        <p>Chi nhánh: {{ selectedInvoice.branch.name }}</p>
        <p>Sảnh cưới: {{ selectedInvoice.hall.name }}</p>
        <p>Ngày đặt: {{ formatDate(selectedInvoice.invoiceDate) }}</p>
        <p>Ngày tổ chức: {{ formatDate(selectedInvoice.attendanceDate) }}</p>

        <h5>Danh sách thực đơn</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tên</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedInvoice.orderMenus" :key="item.orderMenuId">
              <td><img :src="item.menuEntity.image" style="width:100px; height:100px; object-fit:cover" /></td>
              <td>{{ item.menuEntity.name }}</td>
              <td>{{ formatPrice(item.menuEntity.price) }}</td>
            </tr>
          </tbody>
        </table>

        <h5>Danh sách dịch vụ</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tên</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedInvoice.orderServices" :key="item.orderServiceId">
              <td><img :src="item.serviceEntity.image" style="width:100px; height:100px; object-fit:cover" /></td>
              <td>{{ item.serviceEntity.name }}</td>
              <td>{{ formatPrice(item.serviceEntity.price) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-between">
          <button class="btn btn-danger" @click="handleCancelInvoice">Hủy đơn</button>

          <div>
            <button class="btn btn-secondary me-2" @click="() => repaymentInvoiceCoin(selectedInvoice.invoiceID)"
              :disabled="selectedInvoice.paymentStatus">
              Thanh toán ví Coin
            </button>
            <button class="btn btn-success" @click="() => repaymentInvoice(selectedInvoice.invoiceID)"
              :disabled="selectedInvoice.paymentStatus">
              Thanh toán VNPAY
            </button>
          </div>
        </div>
      </template>
    </b-modal>

    <!-- Modal Thanh toán bằng ví -->
    <b-modal v-model="showModalPaymentWallet" title="Thanh toán bằng ví" hide-footer>
      <template v-if="wallet">
        <p>Số dư hiện tại: <b class="text-danger">{{ formatPrice(wallet.coin) }}</b></p>
        <p>Giá trị cần thanh toán: {{ formatPrice(selectedInvoice.total / 2) }}</p>
        <p>Số dư sau thanh toán: <span v-if="typeof paymentCoin === 'number'">{{ formatPrice(paymentCoin) }}</span><span
            v-else class="text-danger">{{ paymentCoin }}</span></p>

        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="closeModalPaymentCoin">Đóng</button>
          <button class="btn btn-primary" @click="paymentCompeleteWallet" :disabled="isProcessingPaymentWallet">
            <span v-if="isProcessingPaymentWallet" class="spinner-border spinner-border-sm me-2"></span>
            Xác nhận thanh toán
          </button>
        </div>
      </template>
      <template v-else>
        <p class="text-danger">Không thể lấy thông tin ví.</p>
      </template>
    </b-modal>
  </div>
</template>


<style scoped>
.history-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.card {
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
