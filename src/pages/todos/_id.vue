<template>
  <h1>Todo </h1>
</template>
<script setup>
  import {useRoute} from "vue-router";

  const route = useRoute();
  console.log(route.params.id);//이 값으로 페이지 내용 호출
</script>
<style scoped>

</style>