<template>
  <div class="toast-box">
    <transition-group name="infoSlide">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="alert"
          :class="`alert-${toast.status}`"
          role="alert"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>
<script>
import {useToast} from "@/composables/toast";

export default {
  // props:{
  //   message: {
  //     type: String,
  //     required: true,
  //   },
  //   status: {
  //     type: String,
  //     default: "danger",
  //   },
  // },
  setup(){
    const {toasts} = useToast();
    return {
      toasts,
    }
  }
}
</script>

<style scoped>
  .toast-box{
    position: fixed;
    z-index: 1000;
    top: 10px;
    right: 10px;
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