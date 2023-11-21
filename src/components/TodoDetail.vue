<template>

  <div v-if="loading">
    Loading...
  </div>
  <div v-else>
    <h1>Todo Page: {{ todo.id }}</h1>
    <form>
      <div class="form-group">
        <label for="subject">Todo subject</label>
        <input v-model="todo.subject" type="text" id="subject" class="form-control"/>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="todo.completed" @click.stop />
        <label class="form-check-label">
          <span v-show="todo.completed"  class="badge badge-success">완료</span>
          <span v-show="!todo.completed" class="badge badge-warning">미완</span>
        </label>
      </div>
      <button class="btn btn-outline-success">저장</button>
      <button class="btn btn-danger" @click.stop="goList">취소</button>
    </form>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {ref} from "vue";

const route = useRoute();
const router = useRouter();

const todo = ref(null);
const loading = ref(true);//loading처리

const getTodo = async ()=>{
  const res = await axios.get(`http://localhost:3000/todos/${route.params.id}`);
  if(res.status !== 200) throw Error("Not found");
  todo.value = res.data;
  loading.value = false; //완료 후 loading flag 처리
}
getTodo();
const goList =()=>{
  const check = confirm("수정한 내용이 저장되지 않습니다. 진행하시겠습니까?");
  if(check) router.push("/todos");
}
</script>

<style scoped>

</style>