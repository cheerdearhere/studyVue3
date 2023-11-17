# III. 기타 기능
기능 추가 예시
## A. form으로 데이터 받기
```vue
<template>
    <div>
        <form
            class="d-flex"
            @submit.prevent="addTodoList2"
        >
<!--      onSubmit에서 preventDefault() 처리 > form의 자동 reload를 막음   -->
            <div class="flex-grow-1 mr-2">
                <input
                    id="todo2"
                    class="form-control"
                    type="text"
                    placeholder="new Todo"
                    v-model="todo2"
                />
            </div>
            <button
                class="btn btn-sm btn-outline-dark"
                type="submit"
            >
                Add todo list
            </button>
        </form>
    </div>
</template>
<script>
export default {
    setup(){
        let todo2=ref("");
        const todoList2 = ref([]);
        const addTodoList2=()=>{
            // e.preventDefault();대신 .prevent사용
            todoList2.value.push({
                id: Date.now(),// ms로 id사용
                subject:todo2.value,//내용
            });
            todo2.value="";
        }
        return {
            todo2,
            todoList2,
            addTodoList2,
        }
    } 
}
</script>
```
## B. check되면 css까지 변경
```vue
<template>
  <div
      v-for="(value,index) in todoList2"
      :key="value.id"
      class="todoList2 card mt-2"
  >
    <div class="card-body p-2">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="value.completed"/>
        <label class="form-check-label">
          <!--      css 바인딩 : object -->
          <h5
              class="todoLabel"
              :style="value.completed ? todoStyle:{}"
          >
            <!--      css 바인딩 : class 사용  -->
            <h5
                class="todoLabel"
                :class="{completedTodo: value.completed }"
            >
            {{index+1}}. {{value.subject}}
          </h5>
        </label>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
    setup(){
  //      ...
      const todoStyle  = {//jsx문법때처럼 -이 아닌 camelCase로 지정
        textDecoration: 'line-through',
        color: 'lightGray',
      }
      return {
//            ...
          todoStyle,
      }
    }
}
</script>
<style>
  .completedTodo{
    text-decoration: line-through;
    color:lightgray;
  }
</style>
```
## C. 