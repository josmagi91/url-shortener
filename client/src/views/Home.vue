<template>
  <section>
    <h1 class="text-center">Shorten your Url</h1>
    <div class="sign-up-form">
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="shorten">
        <div class="form-group">
          <input
            v-model="url"
            type="url"
            class="form-control"
            id="url"
            required>
        </div>
        <div class="text-center">
          <button type="submit" class="sign-up-form btn btn-primary">Shorten</button>
        </div>
      </form>
      <div
        v-if="shorturl"
        class="pt-5">
          <label for="url">Shortened url</label>
          <input
            type="url"
            class="form-control"
            id="url"
            v-model="shorturl"
            required>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    errorMessage: '',
    url: '',
    shorturl: '',
  }),
  methods: {
    shorten() {
      const urlData = {
        url: this.url,
      };
      axios.post('/api/shorturl/new', urlData).then((res) => {
        // Asign a short url, and show it
        this.shorturl = `${process.env.VUE_APP_BASE_URL}/${res.data.shortUrl}`;
      }).catch((err) => {
        this.errorMessage = err.response.data.message;
      });
    },
  },
  name: 'Home',
};
</script>
