<template>
  <form
      @submit.prevent="onSave"
  >
    <div class="row">
      <div class="col-8">
        <div class="form-group">
          <label for="subject">subject</label>
          <input v-model="todo.subject" type="text" id="subject" class="form-control"/>
        </div>
      </div>
      <div class="col-4">
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label">
              Status
            </label>
            <div class="completeBadge-container">
              <!--  공용으로 쓰는 class와 binding된 class를 나눠서 맥락평가로 처리가능  -->
              <span
                  class="completeBadge badge"
                  :class="todo.completed ? 'badge-success':'badge-warning'"
                  @click.stop="toggleStatus"
              >
                  {{ todo.completed ? "Completed" : "Incomplete" }}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <div class="container">
      <button type="submit" class="btn btn-outline-primary" :disabled="!isTodoUpdated">Save</button>
      <button type="button" class="btn btn-danger ml-2" @click.stop="goList">Cancel</button>
      <button type="button" class="btn btn-outline-dark ml-2" @click.stop="resetTodo">Reset</button>
    </div>
  </form>
  <Toast
      v-show="showToast"
      :message="toastMessage"
      :status="toastResStatus"
  />
</template>

<script>
import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import Toast from "@/components/Toast.vue";
import {computed, ref} from "vue";
import axios from "axios";
import {host} from "@/router";
import _ from "lodash";
import {useToast} from "@/composables/toast";
import {useRoute, useRouter} from "vue-router";
export default {
  components: {
    Toast,
    TodoSimpleForm,
  },
  setup(){
    const route = useRoute();
    const router = useRouter();

    const todo = ref({
      subject:"",
      complete:false,
    });
    const originTodo = ref(null);
    const {
      toastMessage,
      toastResStatus,
      showToast,
      triggerToast,
    } = useToast();


    const id = route.params.id;

    const resetTodo= ()=>{
      todo.value = {...originTodo.value};
    }

    const goList =()=>{
      const check = confirm("입력한 내용이 저장되지 않습니다. 진행하시겠습니까?");
      if(check) {
        router.push("/todos");
      }
    }

    const toggleStatus = ()=>{
      todo.value.completed = !todo.value.completed;
    }

    const isTodoUpdated = computed(() =>{
      const check= !_.isEqual(todo.value, originTodo.value);
      console.log(check);
      return check;
    });

    const onSave = async () =>{
      const updateData = todo.value;
      try{
        const res = await axios.put(`${host}/${id}`,{ ...updateData });
        const {status, statusText} = res;
        if(status !== 200) {
          triggerToast(`Error : ${statusText} (code: ${status})`,false);
        }else{
          triggerToast(`Success : Saved Todo`,true);
          originTodo.value = {...res.data};
        }
      }
      catch (error){
        triggerToast(`${error.name}: ${error.message} (code: ${error.code})`);
      }
    }
    return {
      //reactive variables
      todo,
      toastMessage,
      toastResStatus,
      showToast,
      //computed variables
      isTodoUpdated,
      //methods
      toggleStatus,
      onSave,
      goList,
      resetTodo,
    }
  }
}
</script>


<style scoped>
.completeBadge{
  display: block;
  height: 100%;
  font-size: larger;
  cursor: pointer;
}
.completeBadge-container{
  height: 100%;
  margin-top: 7%;
}
</style>