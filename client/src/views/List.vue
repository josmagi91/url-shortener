<template>
  <section>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Short Url</th>
          <th scope="col">Orignal Url</th>
          <th scope="col">Created on</th>
          <th scope="col">Times used</th>
        </tr>
      </thead>
      <tbody v-for="urlData in urls" :key="urlData.shortUrl">
        <tr>
          <th scope="row">{{ `${urlBase}/${urlData.shortUrl}` }}</th>
          <td>{{ urlData.url }}</td>
          <td>{{ formatDate(new Date(urlData.created)) }}</td>
          <td>{{ urlData.timesUsed}}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    errorMessage: '',
    urlBase: window.location.origin,
    urls: [],
  }),
  created() {
    axios.get('/api/shorturl/list').then((res) => {
      // Asign a url list and show it
      this.urls = res.data.urls;
    }).catch((err) => {
      this.errorMessage = err.response.data.message;
    });
  },
  methods: {
    formatDate(date) {
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      return `${year}/${month}/${day}`;
    },
  },
};
</script>
