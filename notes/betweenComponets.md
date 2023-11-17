## C. parent-child 사이의 통신
### 1. 컴포넌트 분리해서 연결하기
#### a. 컴포넌트를 분리해 다른 파일로 작성
#### b. script: 분리된 컴포넌트 연결하기
script태그에 import
```vue
<script>
//  import
  import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
  import TodoList from "@/components/TodoList.vue";
  export default {
//  component 처리
        components:{
          TodoSimpleForm,
          TodoList,
        },
        setup() {
            ...
        }
    }
</script>
```
#### c. JSX 입력
```vue
<template>
    <TodoSimpleForm/>
    <TodoList/>
</template>
```
#### d. 분리한 child component에 데이터, 함수 등 옮기기
```vue
<script>
  export default{
    setup(){
      let todo2=ref("");
      const hasError = ref(false);
      const addTodoList2=()=>{
        if(todo2.value===""){
          hasError.value=true;
        }else{
          todo2.value.push({
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
```
데이터의 위치가 달라지므로 super - sub 사이의 통신을 위해 설정.
### 2. Parent component와 Child component의 통신
      * props : super > sub
      * context : sub > super
#### a. child > parent: context
context.emit("이벤트 이름",전달할 변수);
```vue
<script>
  export default{
    emits:[
        //vue 3.0부터는 필수
        'add-todo', 
    ],
    setup(props,context){
      let todo2=ref("");
      const hasError = ref(false);
      const addTodoList=()=>{
        if(todo2.value===""){
          hasError.value=true;
        }else{
          // emit: super component에 데이터 전달하는 method
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
        addTodoList,
      }
    }
  }
</script>
```
context.emit()으로 설정한 이벤트를 감지하도록 parent template에 연결

v-on:설정한이벤트 = "연결할 콜백"
```vue
<template>
  <TodoSimpleForm
      @add-todo="addTodoList"
  />
</template>
```
전달한 데이터를 param으로 call back funciton에 전달
```vue
<script>
import TodoSimpleForm from "./src/components/TodoSimpleForm.vue";
import { ref } from "vue";
export default {
    components: {
      TodoSimpleForm,
    },
    setup(){
        //...
        let todoList = ref([]);
        const addTodoList = (parameter)=>{
            todoList.value.push(parameter);
        }       
        return {
            todoList,
            addTodoList,
        }
    }
}
</script>
```

#### b. parent > child : props
부모 컴포넌트에서 전달할 대상을 입력

변수는 bind, 함수는 on으로 처리
```vue
    <TodoList
        v-bind:todoList="todoList2" 
        :todoStyle="todoStyle"
        v-on:delete-todo="deleteTodo"
        @toggle-todo="toggleTodo"
    />
```
받는 컴포넌트(child)에서 props 관리
```vue
<script>
  export default{
    // props:[
    //     'todoList',
    //     'todoStyle',
    // ],
    /* 타입과 필수 여부를 지정할 수 있음 */
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
    setup(props, context){
      const todosLength=()=>{
        console.log("list length",props.todoList.length);
      };
      return{
        todosLength
      }
    }
  }
</script>
```
* props 사용시 [주의사항](https://vuejs.org/guide/components/props.html)

props는 부모에서 자식으로 보내는 단방향 전송임.

부모의 변경사항이 자식컴포넌트에 영향을 주지만 자식 컴포넌트의 변경이 부모로 전달되지 않음.

필요하다면 context 이용
```vue
<script>
export default {
  props:{
    todoList: {
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
    // context.emit을 구조 분해 할당해 사용하면 더 간결
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
```