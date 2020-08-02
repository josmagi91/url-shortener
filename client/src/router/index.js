import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import LogIn from '../views/LogIn.vue';
import SignUp from '../views/SignUp.vue';

Vue.use(VueRouter);

function loginRedirection(to, from, next) {
  if (localStorage.token) {
    next('Home');
  } else {
    next();
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
