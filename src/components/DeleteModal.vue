<template>
  <Modal>
    <template v-slot:modalTitle>
      Delete todo?
    </template>
    <template v-slot:modalBody>
      Are you sure?
    </template>
    <template v-slot:modalExecuteBtn>
      <button
          type="button"
          class="btn btn-danger"
          @click="onDelete"
      >
        Delete
      </button>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
export default {
  components:{
    Modal,
  },
  setup(props,{emit}){
    const onDelete = ()=>{
      emit('deleteTodo');
    }
    return{
      onDelete,
    }
  }
}
</script>

<style scoped>

</style>