<template>
  <div class="form-group">
    <label for="subject">{{ label }}</label>
    <input
        :value="subject"
        @input="onInput"
        type="text"
        id="subject"
        class="form-control"
    />
    <div v-if="errorMessage" class="errorMessage">
      {{errorMessage}}
    </div>
  </div>
</template>

<script>
import {getCurrentInstance} from 'vue';
export default {
  props:{
    label: {
      type: String,
      required: true,
    },
    errorMessage:{
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    }
  },
  setup(){
    const {emit} =getCurrentInstance();//props없이 emit만 사용할 경우
    const onInput = (e)=>{
      // emit('update-subject', e.target.value);
      emit('update:subject',e.target.value);
    }
    return {
      onInput
    }
  }
}

</script>


<style scoped>
.text-red{
  color: red;
}
</style>