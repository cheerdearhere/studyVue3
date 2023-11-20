<template>
  <h2>Computed Count Page</h2>
  <div class="computed">
    <ComputedCount/>
  </div>
</template>
<script>
import ComputedCount from "@/components/ComputedCount.vue";

export default {
  components: {ComputedCount},
  setup(){

    return {}
  }
}
</script>

<style scoped>
body{
  width: 100%;
  height: 100%;
  margin: 5%;
}
div{
  background: #fff;
  color:#000;
}
</style>