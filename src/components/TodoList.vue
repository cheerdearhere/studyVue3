<template>
  <div
      v-for="(value,index) in todoList"
      :key="value.id"
      class="todoList card mt-2"
  >
    <div
        class="card-body p-2 d-flex align-items-center box-pointer"
        @click="moveToPage(value.id)"
    >
      <div class="flex-grow-1">
        <input
          type="checkbox"
          :checked="value.completed"
          @change="toggleTodo(index, $event)"
          @click.stop
        />
        <!-- v-model="value.completed"
        : 단방향 전달인 props에서 양방향 처리인 v-model을 사용하는 것은 적절하지 않음
        -->        &emsp;
        <span
            class="todoLabel"
            :class="{todo:value.completed}"
            :style="value.completed ? todoStyle:{}"
        >
            {{value.id}}. {{value.subject}}
        </span>
      </div>
      <div>
        <button
            class="btn btn-outline-danger btn-sm"
            @click.stop="deleteTodo(index)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import {watchEffect} from "vue";
  import {useRouter} from "vue-router";

  export default{
    /* array로 받을 수 있음 */
    // props:[
    //     'todoList',
    //     'todoStyle',
    // ],
    /* obj로 받으면 타입과 필수를 지정할 수 있음 */
    props:{
      todoList: {
        //Type: Array,Object,String,Number,Boolean,Function,Promise
        type     : Array,
        required : true,
      },
      todoStyle:{
        type     : Object,
        required : true,
      },
    },
    emits:[
      'toggle-todo',
      'delete-todo',
    ],
    setup(props, {emit}){
      let val  = 2;
      watchEffect(()=>{
        console.log("list length",props.todoList.length);
        console.log("reactive value가 아니면 변화가 감지 안됨",val);
      });
      val++;
      val++;


      // context.emit을 구조분해할당을 쓰면 더 간결
      const toggleTodo = (index, event)=>{
        emit('toggle-todo',index, event.target.checked);
      }
      const deleteTodo = (index)=>{
        emit('delete-todo',index)
      }
      const router = useRouter();
      const moveToPage = (id)=>{
        // router.push(`/todos/${id}`);
        router.push({
          name:'Todo',
          params: {
            id: id,
          }
        })
      }
      return{
        toggleTodo,
        deleteTodo,
        moveToPage,
      }
    }
  }
</script>
<style scoped>
.box-pointer{
  cursor: pointer;
}
</style>