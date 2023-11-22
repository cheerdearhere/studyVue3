<template>
  <div class="modal-wrapper">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            <slot name="modalTitle"></slot>
          </h5>
          <button type="button" class="close" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot name="modalBody"></slot>
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
          >
            Close
          </button>
          <slot name="modalExecuteBtn"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{

  },
  emits:{
    modalFlag:{
      type: Boolean,
      default: false,
    }
  },
  setup(props,context){
    const {emit} = context;
    const closeModal = ()=>{
      emit('closeModal');
    }
    return{
      closeModal,
    }
  }
}
</script>
<style scoped>
.modal-wrapper{
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000088;
}
</style>