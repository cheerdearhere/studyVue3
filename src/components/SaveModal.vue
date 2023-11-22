<template>
  <Modal>
    <template v-slot:modalTitle>
      {{`${isEdit? "Update":"Create"} todo?`}}
    </template>
    <template v-slot:modalBody>
      this contents will be saved. Are you sure?
    </template>
    <template v-slot:modalExecuteBtn>
      <button
        type="button"
        class="btn"
        :class="isEdit?'btn-primary':'btn-success'"
        @click="onSave"
      >
        {{isEdit? "Update ":"Create"}}
      </button>
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/Modal.vue";

export default {
  components: {Modal},
  props:{
    isEdit:{
      type: Boolean,
      default: false,
    }
  },
  setup(props,{emit}){
    const onSave=()=>{
      emit('saveTodo',props.isEdit);
    }
    return {
      onSave,
    }
  }

}

</script>

<style scoped>

</style>