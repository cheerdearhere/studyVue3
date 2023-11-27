<template>
  <form
      @submit.prevent="onSave"
  >
    <div class="row">
      <div class="col-8">
        <Input
            label="Subject"
            v-model:subject="todo.subject"
            :error-message="errorMessage"
        />
        <!--    v-model 이용하면 따로 bind, on을 처리할 필요 없음    -->
        <!--            :subject="todo.subject" -->
        <!--            @update-subject="updateTodoSubject"-->
      </div>
      <div class="col-4"  v-if="editing">
        <div class="form-group">
          <div class="form-check">
            <label class="form-check-label">
              Status
            </label>
            <div class="completeBadge-container">
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
      <div class="col-12">
        <div class="form-group">
          <label for="contents">contents</label>
          <textarea id="contents" v-model="todo.body" class="form-control" cols="30" rows="30"></textarea>
        </div>
      </div>
    </div>
    <hr/>
    <div class="container">
      <button type="submit" class="btn btn-outline-primary" :disabled="!isTodoUpdated">
        {{ editing ? "Update" : "Create" }}
      </button>
      <button type="button" class="btn btn-danger ml-2" @click.stop="goList">
        Cancel
      </button>
      <button type="button" class="btn btn-outline-dark ml-2" @click.stop="resetTodo">Reset</button>
    </div>
  </form>
<!--  <teleport to="#confirmModal">-->
<!--    <SaveModal-->
<!--        v-if="modalFlag"-->
<!--        :isEdit="isEdit"-->
<!--        @closeModal="closeModal"-->
<!--        @onSave="onSave"-->
<!--    />-->
<!--  </teleport>-->
  <teleport to="#resultAlert">
    <transition name="infoSlide">
      <Toast
          v-show="showToast"
          :message="toastMessage"
          :status="toastResStatus"
      />
    </transition>
  </teleport>
</template>

<script>
import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import Toast from "@/components/Toast.vue";
import {computed, ref} from "vue";
import axios, {HttpStatusCode} from "axios";
import {todoHost} from "@/router";
import _ from "lodash";
import {useToast} from "@/composables/toast";
import {useRoute, useRouter} from "vue-router";
import SaveModal from "@/components/SaveModal.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import Input from "@/components/Input.vue";
export default {
  components: {
    DeleteModal,
    SaveModal,
    Toast,
    TodoSimpleForm,
    Input,
  },
  props:{
    editing:{//editing true > 수정 페이지
      type: Boolean,
      default: false, // default가 생성페이지(false)
    }
  },
  setup(props){
    const route = useRoute();
    const router = useRouter();

    const todo = ref({
      subject:"",
      completed:false,
      body: "",
    });
    const originTodo = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const {
      toastMessage,
      toastResStatus,
      showToast,
      triggerToast,
    } = useToast();


    const id = route.params.id;

    const getTodo = async ()=>{
      loading.value=true;
      const res = await axios.get(`${todoHost}/${id}`);
      if(res.status !== 200) {
        triggerToast("Not found", false);
        throw new Error("check the todo's id");
      }
      todo.value = {...res.data};
      originTodo.value = {...res.data};
      loading.value = false; //완료 후 loading flag 처리
    }

    if(props.editing){
      getTodo();
    }

    const resetTodo= ()=>{
      todo.value = {...originTodo.value};
    }

    const goList =()=>{
      const check = confirm("입력하신 내용이 저장되지 않습니다. 진행하시겠습니까?");
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
    const todoValidation = (targetData) =>{
      errorMessage.value = "";
      if(targetData.subject===null || targetData.subject.trim()===""){
        errorMessage.value = "Subject is required";
        return false;
      }
      return true;
    }
  // const updateTodoSubject = (newSubject) =>{
  //     todo.value.subject = newSubject;
  // }
    const onSave = async () =>{
      const updateData = todo.value;
      if(!todoValidation(updateData)) {
        triggerToast(errorMessage.value,false);
        return ;
      }
      try{
        let res;
        if(props.editing){
          res = await axios.put(`${todoHost}/${id}`,{ ...updateData });
        }
        else{
          res = await axios.post(`${todoHost}`,{ ...updateData });
        }

        const {status, statusText} = res;
        if(status !== HttpStatusCode.Ok && status !== HttpStatusCode.Created ) {
          triggerToast(`Error : ${statusText} (code: ${status})`,false);
        }else{
          triggerToast(`Success : ${props.editing ? "Updated" : "Created"}`,true);
          if(props.editing){
            originTodo.value = {...res.data};
          }
          else{
            resetTodo();
            await router.push("/todos");
          }

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
      errorMessage,
      //methods
      getTodo,
      toggleStatus,
      onSave,
      goList,
      resetTodo,
      // updateTodoSubject,
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
.errorMessage{
  font-size: small;
  color: red;
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