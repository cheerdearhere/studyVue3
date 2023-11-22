<template>
  <div class="modal-wrapper">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this todo?
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
          >
            Close
          </button>
          <button type="button" class="btn btn-danger" @click="onDelete">Delete</button>
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
    const onDelete = ()=>{
      emit('deleteTodo');
    }
    return{
      closeModal,
      onDelete,
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