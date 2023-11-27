<template>
  <h1>Home Page</h1>
  <div>
    <div>{{ count }}</div>
    <button @click="count++">Add</button>
  </div>
  <UseRef/>
</template>

<script>
import UseRef from "@/components/UseRef.vue";
import {useCount} from "@/composables/useCount";

export default {
  components:{
    UseRef
  },
  setup(){
    const {count} = useCount();
    return {
      count,
    }
  }
}
</script>

<style>
</style>