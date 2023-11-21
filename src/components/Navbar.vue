<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{name: 'Home'}">Vue 3.0</router-link>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link class="nav-link" to="/todos">Todo List</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/count">Computed Counter</router-link>
      </li>
      <li class="nav-item disabled">
        <router-link class="nav-link" to="/">home</router-link>
      </li>
    </ul>
  </nav>
</template>
<script setup>

</script>
<style scoped>

</style>