<template>
  <div
      v-for="(value,index) in todoList"
      :key="value.id"
      class="todoList2 card mt-2"
  >
    <div class="card-body p-2 d-flex align-items-center">
      <div class="form-check flex-grow-1">
        &emsp;
        <input
          class="form-check-input"
          type="checkbox"
          :value="value.completed"
          @change="toggleTodo(index)"
        />
        <!-- v-model="value.completed"
        : 단방향 전달인 props에서 양방향 처리인 v-model을 사용하는 것은 적절하지 않음
        -->        &emsp;
        <label class="form-check-label">
          <!--      css 바인딩 : object -->
          <h5
              class="todoLabel"
              :style="value.completed ? todoStyle:{}"
          >
            <!--      css 바인딩 : class 사용
            <h5
                class="todoLabel"
                :class="{completedTodo: value.completed }"
            >
            -->
            {{index+1}}. {{value.subject}}
          </h5>
        </label>
      </div>
      <div>
        <button
            class="btn btn-outline-danger btn-sm"
            @click="deleteTodo(index)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script>
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
      // context.emit을 구조분해할당을 쓰면 더 간결
      const toggleTodo = (index)=>{
        emit('toggle-todo',index);
      }
      const deleteTodo = (index)=>{
        emit('delete-todo',index)
      }
      return{
        toggleTodo,
        deleteTodo,
      }
    }
  }
</script>
<style>

</style>