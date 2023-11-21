<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else>
    <h1>Todo Page: {{ todo.id }}</h1>
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
  </div>
  <Toast
    v-show="showToast"
    :message="toastMessage"
    :status="toastResStatus"
  />
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {computed, ref} from "vue";
import {host} from "@/router";
import _ from "lodash";
import Toast from "@/components/Toast.vue";

const route = useRoute();
const router = useRouter();

const todo = ref(null);
const originTodo = ref(null);
const loading = ref(true);//loading처리
const showToast = ref(false);
const toastMessage = ref("");
const toastResStatus = ref(false);

const id = route.params.id;
const getTodo = async ()=>{
  const res = await axios.get(`${host}/${id}`);
  if(res.status !== 200) throw Error("Not found");
  todo.value = {...res.data};
  originTodo.value = {...res.data};
  loading.value = false; //완료 후 loading flag 처리
}

const resetTodo= ()=>{
  todo.value = {...originTodo.value};
}

const goList =()=>{
  const check = confirm("수정한 내용이 저장되지 않습니다. 진행하시겠습니까?");
  if(check) {
    router.push("/todos");
    /* 이렇게도 가능
      router.push({
        name: "Todos"
      });
     */
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

const resetToast = ()=>{
  toastMessage.value="";
  toastResStatus.value=false;
}
const triggerToast =(message,status)=>{
  toastMessage.value=message;
  toastResStatus.value=status;
  showToast.value = true;
  //5초뒤 리셋
  setTimeout(()=>{
    showToast.value = false;
    resetToast();
  },5000);
}
const onSave = async () =>{
  const updateData = todo.value;
  try{
    const res = await axios.put(`${host}/${id}`,{ ...updateData });
    const {status, statusText} = res;
    if(status !== 200) {//throw new Error("server Error: failed save");
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
// run
getTodo();
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