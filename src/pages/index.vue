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
.infoSlide-enter-active,
.infoSlide-leave-active {
  transition: all 0.3s ease;
}
.infoSlide-enter-from,
.infoSlide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.infoSlide-enter-to,
.infoSlide-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>