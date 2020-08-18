import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';
import SignUp from '../views/SignUp.vue';
import NotFound from '../views/NotFound.vue';
import List from '../views/List.vue';

Vue.use(VueRouter);

function loginRedirection(to, from, next) {
  if (localStorage.token) {
    next('Home');
  } else {
    next();
  }
}

function redirect(to, from, next) {
  axios.get(`/api/shorturl/${to.params.url}`).then((res) => {
    window.location = res.data.url;
  }).catch(() => {
    next('Not Found');
  });
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/sign-up',
    name: 'Sign up',
    component: SignUp,
    beforeEnter: loginRedirection,
  },
  {
    path: '/login',
    name: 'Log in',
    component: LogIn,
    beforeEnter: loginRedirection,
  },
  {
    path: '/list',
    name: 'List',
    component: List,
  },
  {
    path: '/notfound',
    name: 'Not Found',
    component: NotFound,
  },
  {
    path: '/:url',
    name: 'redirect',
    beforeEnter: redirect,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
