<template>
  <section>
    <h1 class="text-center">Sign up</h1>
    <div class="sign-up-form">
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="signup">
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
          <h5 id="passwordHelp" class="form-text text-muted passwordHelp">
            Password must be 8 characters or longer.
          </h5>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm your password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            required>
          <h5 id="confirmPasswordHelp" class="form-text text-muted passwordHelp">
            Please, confirm your password.
          </h5>
        </div>
        <div class="text-center">
          <button type="submit" class="sign-up-form btn btn-primary">Sign up</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export default {
  data: () => ({
    errorMessage: '',
    user: {
      email: '',
      password: '',
      confirmPassword: '',
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
    signup() {
      this.errorMessage = '';
      if (this.validate()) {
        const userData = {
          email: this.user.email,
          password: this.user.password,
        };

        axios.post(`${API_URL}/auth/signup`, userData).then((res) => {
          console.log(res.data);
        }).catch((err) => {
          this.errorMessage = err.response.data.message;
        });
      }
    },
    validate() {
      if (this.user.password.length < 8) {
        this.errorMessage = 'Password must be 8 characters or longer.';
        return false;
      }
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Password must match.';
        return false;
      }
      return true;
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
