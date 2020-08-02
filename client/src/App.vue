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
          <li class="nav-item">
            <router-link :to="{ name: 'Sign up' }" class="nav-link" href="#">Sign up</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'Log in' }" class="nav-link" href="#">Log in</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-2"/>
  </div>
</template>

<style>

</style>
