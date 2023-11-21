<!--  최상위 컴포넌트  -->
<template>
  <Navbar/>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default{
  components:{
    Navbar
  },
  setup(){
    return {

    }
  }
}
</script>
<style>
body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>