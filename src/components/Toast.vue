<template>
    <div
        class="alert toast-box"
        :class="status ? 'alert-success' : 'alert-danger'"
        role="alert"
    >
      {{ message }}
    </div>
</template>
<script>


export default {
  props:{
    message: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  setup(){
    return {
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

</style>