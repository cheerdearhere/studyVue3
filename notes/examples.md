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
## C. toast 컴포넌트 만들기
### 1. Toast용 component 생성
```vue
<template>
  <div
      class="alert toast-box"
      :class="status ? 'alert-success' : 'alert-danger'"
      role="alert"
  >
    {{ message }}
  </div>

</template>
<script>
export default {
  props:{
    message: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  setup(){

    return {

    }
  }
}
</script>

<style>
  .toast-box{
    position: fixed;
    z-index: 1000;
    top: 10px;
    right: 10px;
  }
</style>
```

### 2. 사용할 페이지 연겷
```vue
<template>
  <Toast
      v-show="showToast"
      :message="toastMessage"
      :status="toastResStatus"
  />
</template>
<script>
  import Toast from "@/components/Toast.vue";
  import {reactive} from "vue";

  export default {
    components: {
      Toast,
    },
    setup() {
      const showToast = ref(false);
      const toastMessage = ref("");
      const toastResStatus = ref(false);

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

      const onSave = async () => {
        const updateData = todo.value;
        const res = await axios.put(`${host}/${id}`, {...updateData});
        const {status, statusText} = res;
        if (status !== 200) {//throw new Error("server Error: failed save");
          triggerToast(`Error : ${statusText} (code: ${status})`, false);
        } else {
          triggerToast(`Success : Saved Todo`, true);
          originTodo.value = {...res.data};
        }
      }
      
      return {
        showToast,
        toastMessage,
        toastResStatus,
        onSave,
      }
    }
  }
</script>
```
### 3. 공용 component 관련 로직 추출(Composition api로 사용하기)
#### a. 여러곳에서 중복으로 사용되는 code를 모을 directory
보통 composables 또는 hooks라고 지음
#### b. 내부에 js로 파일 생성
```javascript
import {onBeforeUnmount, ref} from "vue";

export const useToast= () =>{
    // Toast
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastResStatus = ref(false);
    const timeOut = ref(null);
    
    const resetToast = ()=>{
        toastMessage.value="";
        toastResStatus.value=false;
    }
    
    const triggerToast =(message,status)=>{
        toastMessage.value=message;
        toastResStatus.value=status;
        showToast.value = true;
        //5초뒤 리셋
        timeOut.value = setTimeout(()=>{
            showToast.value = false;
            resetToast();
        },3000);
    }
    onBeforeUnmount(()=>{
        clearTimeout(timeOut);
    });
    return {
        toastMessage,
        toastResStatus,
        showToast,
        triggerToast,
    }
}
```
#### c. 사용할 곳에서 연결
```vue
<template>
  <Toast
      v-show="showToast"
      :message="toastMessage"
      :status="toastResStatus"
  />
</template>
<script>
  import {useToast} from "@/composables/toast";
  import Toast from "@/Toast.vue";

  export default {
    components: {
      Toast,
    },
    setup() {
      // toast
      const {
        toastMessage,
        toastResStatus,
        showToast,
        triggerToast,
      } = useToast();
      // 사용 하기
      const getTodos = async (page)=>{
        currentPage.value = page;
        error.value='';
        try{
          const rs = await axios.get(`${host}?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${currentPage.value}&_limit=${cnt}`);//json-server에서 사용하는 페이지네이션
          todoList.value = rs.data;
          totalCnt.value = rs.headers['x-total-count'];
        }catch (error){
          triggerToast(`${error.name}: ${error.message} (code: ${error.code})`);
        }
      }
      getTodos(1);//mount 실행
      return {
        // toast
        showToast,
        toastMessage,
        toastResStatus,
      }
    }
  }
</script>
```
#### d. toast에 애니메이션 추가
[document 보기](https://vuejs.org/guide/built-ins/transition.html)
대상 컴포넌트를 <transition>으로 감싸고 name을지정
```vue
<transition name="infoSlide">
  <Toast
      v-show="showToast"
      :message="toastMessage"
      :status="toastResStatus"
  />
</transition>
```
스타일에서 다음 클래스로 값을 지정한다
```asciidoc
    .{name}-enter-active    : transition 시작할때 처리할 대상, 값 지정 
    .{name}-leave-active    : transition 종료할때 처리할 대상, 값 지정 
    .{name}-enter-from      : 표시할때 처음 상태
    .{name}-leave-to        : 제거할때 끝 상태
    .{name}-enter-to        : 표시할때 끝 상태  
    .{name}-leave-from      : 제거할때 처음 상태
```
사용 예시
```vue
<style>
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
```
