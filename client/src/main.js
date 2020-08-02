import Vue from 'vue';
import 'bootswatch/dist/flatly/bootstrap.css';
import axios from 'axios';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://127.0.0.1:5000';

if (localStorage.token) {
  axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.token}` };
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
