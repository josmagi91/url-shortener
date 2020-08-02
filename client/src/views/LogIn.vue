<template>
  <section>
    <h1 class="text-center">Log in</h1>
    <div class="sign-up-form">
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            v-model="user.email"
            type="email"
            class="form-control"
            id="email"
            required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            required>
        </div>
        <div class="text-center">
          <button type="submit" class="sign-up-form btn btn-primary">Log in</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    errorMessage: '',
    user: {
      email: '',
      password: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    login() {
      axios.post('/auth/login', this.user).then((res) => {
        localStorage.token = res.data.token;
        this.$router.push('Home');
      }).catch((err) => {
        this.errorMessage = err.response.data.message;
      });
    },
  },
};
</script>

<style>
.sign-up-form{
  width: 40%;
  margin-right: auto;
  margin-left: auto;
}

.passwordHelp {
  font-size: 14px;
}
</style>
