import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLock, faUserPlus, faCircleUser ,faBell ,faClipboard,  faMoneyBillWave,faCartShopping,faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faEnvelope, faLock, faUserPlus ,faCircleUser, faBell ,faClipboard, faMoneyBillWave, faCartShopping,faCircleInfo)
const app = createApp(App)
app.use(BootstrapVue3)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
