

<template>
  Todo Simple Form
  <form
      @submit.prevent="addTodoList2"
  >
    <!--@submit.prevent: event modifier (이벤트와 관련된처리를 함)          -->
    <div class="d-flex">
      <div class="flex-grow-1 mr-2">
        <input
            id="todo2"
            class="form-control"
            type="text"
            placeholder="new Todo"
            v-model="todo2"
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
      let todo2=ref("");
      const hasError = ref(false);
      const addTodoList2=()=>{
        // e.preventDefault();//form이라 우선 막음 - @onclick.prevent로
        if(todo2.value===""){
          hasError.value=true;
        }else{
          //super component에 데이터 전달하는 함수
          context.emit('add-todo',{
            id: Date.now(),// ms로 id사용리
            subject:todo2.value,//내용
            completed:false,//완료
          });
          todo2.value="";
          hasError.value=false;
        }
      }
      return {
        todo2,
        hasError,
        addTodoList2,
      }
    }
  }
</script>

<style scoped>

</style>