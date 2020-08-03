<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">Url Shortener</a>
      <button class="navbar-toggler collapsed" type="button"
      data-toggle="collapse" data-target="#navbarColor01"
      aria-controls="navbarColor01" aria-expanded="false"
      aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse collapse" id="navbarColor01" style="">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
        </ul>
        <ul class="navbar-nav my-2 my-lg-0">
          <li v-if="!logged" class="nav-item">
            <router-link :to="{ name: 'Sign up' }" class="nav-link" href="#">Sign up</router-link>
          </li>
          <li v-if="!logged" class="nav-item">
            <router-link :to="{ name: 'Log in' }" class="nav-link" href="#">Log in</router-link>
          </li>
          <li v-else class="nav-item">
            <a @click="logout" class="nav-link" href="#">Log out</a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-2" @update-login="updateLogin"/>
  </div>
</template>

<script>
export default {
  data: () => ({
    logged: localStorage.token,
  }),
  methods: {
    updateLogin() {
      this.logged = localStorage.token;
    },
    logout() {
      localStorage.removeItem('token');
      this.logged = 0;
      this.$router.push('/').catch(() => {});
    },
  },
};
</script>

<style>

</style>
