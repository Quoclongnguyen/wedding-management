<template>
  <div class="bill">
    <!-- Nội dung giao diện sẽ được thêm ở đây -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";

// State và biến reactive
const branchs = ref([]);
const halls = ref([]);
const selectedBranchId = ref(null);
const selectedHallId = ref(null);
const selectedHalls = ref([]);
const fullName = ref("");
const phoneNumber = ref("");
const note = ref("");
const selectedDate = ref(null);
const cost = ref(0);
const numberOfTables = ref(0);
const weddingHalls = ref([]);
const selectedBranchIdSuggest = ref(null);
const selectedHallIdSuggest = ref(null);

// Toast thông báo
const toast = useToast();

// Hàm gọi API
const fetchBranches = async () => {
  try {
    const response = await axios.get("https://localhost:7296/api/ApiBranch");
    branchs.value = response.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    toast.error("Không thể tải danh sách chi nhánh!");
  }
};

const fetchHalls = async () => {
  try {
    const response = await axios.get("https://localhost:7296/api/hall");
    halls.value = response.data;
  } catch (error) {
    console.error("Error fetching halls:", error);
    toast.error("Không thể tải danh sách sảnh cưới!");
  }
};

// Lifecycle hook
onMounted(() => {
  fetchBranches();
  fetchHalls();
});
</script>

<style scoped>
/* Thêm style nếu cần */
</style>