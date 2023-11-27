<!--  최상위 컴포넌트  -->
<template>
  <Navbar/>
  <div class="container">
    <router-view/>
  </div>
  <Toast/>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Toast from "@/components/Toast.vue";

export default{
  components:{
    Navbar,
    Toast,
  },
  setup(){
  }
}
</script>
<style>
body{
  width: 100%;
  height: 100%;
  margin: 5%;
}
div{
  background: #fff;
  color:#000;
}
.todoContainer{
  margin-top: 2%;
  margin-bottom: 5%;
}
.errorMsg{
  font-size: smaller;
  font-weight: bolder;
  color:red;
  background: #000;
}
.footer{
  height:20px;
  width:100vw;
}
</style>