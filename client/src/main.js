import Vue from 'vue';
import 'bootswatch/dist/flatly/bootstrap.css';
import axios from 'axios';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
axios.defaults.baseURL = process.env.VUE_APP_ENDPOINT;

if (localStorage.token) {
  axios.defaults.headers.common = { Authorization: `Bearer ${localStorage.token}` };
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
