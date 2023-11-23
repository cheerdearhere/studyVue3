<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light mt-0">
    <router-link class="navbar-brand" :to="{name: 'Home'}">Vue 3.0</router-link>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link class="nav-link" :to="{name: 'TodoList'}">Todos</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{name: 'computedCount'}">Counter</router-link>
      </li>
      <li class="nav-item disabled">
        <router-link class="nav-link" :to="{name: 'Home'}">Home</router-link>
      </li>
    </ul>
  </nav>
</template>
<script setup>

</script>
<style scoped>

</style>