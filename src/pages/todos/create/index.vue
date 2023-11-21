<template>
  <h1>Create Todo page</h1>
  <TodoCreateForm/>
</template>

<script>
import TodoCreateForm from "@/components/TodoForm.vue";
export default {
  components:{
    TodoCreateForm,
  },
  setup(){
    return {

    }
  }
}
</script>

<style scoped>

</style>