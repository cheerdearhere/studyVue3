<template>
  <h4>detail을 따로 만든경우</h4>
  <TodoDetail/>
  <br/><hr class="line"/>
  <h4>수정/생성페이지를 한번에 만든경우</h4>
  <TodoForm :editing="true"/>
</template>
<script setup>
  import TodoDetail from "@/components/TodoDetail.vue";
  import TodoForm from "@/components/TodoForm.vue";

</script>
<style scoped>
.line{
  border: #5372bb solid 5px;

}
</style>