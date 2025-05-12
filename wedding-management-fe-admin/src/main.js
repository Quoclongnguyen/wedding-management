
import './assets/scss/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import BootstrapVue3 from 'bootstrap-vue-3'; 

const app = createApp(App);
app.use(BootstrapVue3); // Đăng ký Bootstrap
app.use(router); // Đăng ký router trước khi mount
app.mount('#app'); // Mount ứng dụng vào #app