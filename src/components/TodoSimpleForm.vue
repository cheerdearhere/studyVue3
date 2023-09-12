

<template>
  Todo Simple Form
  <form
      @submit.prevent="addTodoList"
  >
    <!--@submit.prevent: event modifier (이벤트와 관련된처리를 함)          -->
    <div class="d-flex">
      <div class="flex-grow-1 mr-2">
        <input
            id="todo"
            class="form-control"
            type="text"
            placeholder="new Todo"
            v-model="todo"
        />
      </div>
      <div>
        <button
            class="btn btn-sm btn-outline-dark"
            type="submit"
        >
          Add todo list
        </button>
      </div>
    </div>
    <div class="errorMsg" v-show="hasError">Error: This field cannot be empty!</div>
  </form>
</template>

<script>
  import {ref} from "vue";

  export default{
    emits:['add-todo'],
    setup(props,context){
      /*
      * props : super > sub
      * context : sub > super
      * */
      let todo=ref("");
      const hasError = ref(false);
      const addTodoList=()=>{
        // e.preventDefault();//form이라 우선 막음 - @onclick.prevent로
        if(todo.value===""){
          hasError.value=true;
        }else{
          //super component에 데이터 전달하는 함수
          context.emit('add-todo',{
            id: Date.now(),// ms로 id사용리
            subject:todo.value,//내용
            completed:false,//완료
          });
          todo.value="";
          hasError.value=false;
        }
      }
      return {
        todo,
        hasError,
        addTodoList,
      }
    }
  }
</script>

<style scoped>

</style>