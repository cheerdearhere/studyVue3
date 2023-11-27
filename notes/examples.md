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
  .,
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
### 4. modal 만들기
가능하면 모달창은 최상위에서 공통 컴포넌트로 처리하는 것이 좋음

모달창 형식은 [bootstrap](https://getbootstrap.com/docs/4.0/components/modal/)에서 가져옴
```html
<!--
원레는 JQuery로 사용. 이를 막기위해 새 class사용
div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
-->
<div class="modal-wrapper">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>
```
#### a. 모달 위치 조정하기
style scoped로 선언해서 처리
```vue
<style scoped>
  .modal-wrapper{
    z-index: 2000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000088;
  }
</style>
```
#### b. modal component를 관리할 flag ref
```vue
<template>
  <Modal
      v-if="modalFlag"
  />
</template>
<script>
import {ref} from 'vue';
export default {
    setup(){
        const modalFlag = ref(false);
        
        return {
            modalFlag,
        }
    }
}
</script>
```
#### c. 열기/닫기 버튼 연결
모달 컴포넌트
```vue
<template>
  <div class="modal-footer">
    <button
        type="button"
        class="btn btn-secondary"
        @click="closeModal"
    >
      Close
    </button>
  </div>
</template>
<script>
  export default {
    emits:{
      modalFlag:{
        type: Boolean,
        default: false,
      }
    },
    setup(props,context){
      const {emit} = context;
      const closeModal = ()=>{
        emit('closeModal');
      }
      return{
        closeModal,
      }
    }
  }
</script>
```
대상 위치 eventListener 차리

```vue
<template>
  <Modal
      v-if="modalFlag"
      @closeModal="closeModal"
      @deleteTodo="deleteTodo"
  />
</template>
<script>
  import Modal from "./Modal.vue";

  export default {
    components:{
     Modal,   
    },
    setup() {
      const modalFlag = ref(false);
      const deleteTodoId = ref(null);
      const openModal = (id) => {
        deleteTodoId.value = id;
        modalFlag.value = true;
      }
      const closeModal = () => {
        deleteTodoId.value = null;
        modalFlag.value = false;
      }
      // 기능구현
      const deleteTodo = () => {
        emit('delete-todo', deleteTodoId.value);
        closeModal();
      }
      return {
        modalFlag,
        openModal,
        closeModal,
        deleteTodo,
      }
    }
  }
</script>
```
#### d. modal 적용
```vue
<template>
  <div class="modal-wrapper">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" @click="closeModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this todo?
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
          >
            Close
          </button>
          <button type="button" class="btn btn-danger" @click="onDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{

  },
  emits:{
    modalFlag:{
      type: Boolean,
      default: false,
    }
  },
  setup(props,context){
    const {emit} = context;
    const closeModal = ()=>{
      emit('closeModal');
    }
    const onDelete = ()=>{
      emit('deleteTodo');
    }
    return{
      closeModal,
      onDelete,
    }
  }
}
</script>
```
### 5. transition group(여러 알림창 누적해서 띄우기)
#### a. toast에서 v-if 제거, toast-box 묶기
```vue
<template>
  <div class="toast-box">
    <div
        class="alert"
        :class="`alert-${status}`"
        role="alert"
    >
      {{ message }}
    </div>
  </div>
</template>
```
#### b. .toast-box 내부에 새 메세지 추가되도록 처리
vuex store에서 list관리
```javascript
export default {
    namespaced:true,//사용여부
    state:{
        //전역에서 관리할 데이터
        toasts: [],
        // showToast         : false,
        // toastMessage      : "",
        // toastResStatus    : "",
    },
    mutations: {
        // UPDATE_TOAST_MESSAGE(state, payload){
        //     state.toastMessage = payload;
        // },
        // UPDATE_TOAST_STATUS(state, payload){
        //     state.toastResStatus = payload;
        // },
        // UPDATE_SHOW_TOAST_FLAG(state, payload){
        //     state.showToast = payload;
        // },
        ADD_TOAST(state, payload){
            state.toasts.push(payload);
        },
        REMOVE_TOAST(state, payload){
            state.toasts.shift();//처음 들어온 아이템 제거
        }
    },
    actions: {
        triggerToast (context, payload){
            const {commit} = context;
            const {message, toastResStatus} = payload;
            // commit('UPDATE_TOAST_MESSAGE',message);
            // commit('UPDATE_TOAST_STATUS',toastResStatus);
            // commit('UPDATE_SHOW_TOAST_FLAG',true);
            commit('ADD_TOAST',{
                id: Date.now(),
                message,
                status: toastResStatus
            });
            //5초뒤 리셋
            setTimeout(()=>{
                // commit('UPDATE_TOAST_MESSAGE','');
                // commit('UPDATE_TOAST_STATUS','');
                // commit('UPDATE_SHOW_TOAST_FLAG',false);
                commit('REMOVE_TOAST');
            },3000);
        },
        // resetTimeOut({commit}){
        //     commit('UPDATE_TOAST_TIMEOUT',null);
        // }
    },
    getters:{//state를 밖으로 보낼때 별도의 getter를 지정할 수 있다.
        // toastMessageWithSmile(state){
        //     return state.toasts+' :)';
        // }
    },
}
```
변경된 부분 적용
```javascript
import {computed} from "vue";
import {useStore} from "vuex";

export const useToast= () =>{
// Toast > mutations, store
    // const showToast = ref(false);
    // const toastMessage = ref("");
    // const toastResStatus = ref(false);
    // const timeOut = ref(null);
    //vuex store
    const store = useStore();
    // const toastMessage = computed(()=>store.getters['toast/toastMessageWithSmile']);
    // const toastResStatus = computed(()=>store.state.toast.toastResStatus);
    // const showToast = computed(()=>store.state.toast.showToast);
    const toasts = computed(()=>store.state.toast.toasts);
//  action으로 이동, store.dispatch로 실행
//     const resetToast = ()=>{
//         toastMessage.value="";
//         toastResStatus.value=false;
//     }
//     const triggerToast =(message,status)=>{
//         toastMessage.value=message;
//         toastResStatus.value=status;
//         showToast.value = true;
//         //5초뒤 리셋
//         timeOut.value = setTimeout(()=>{
//             showToast.value = false;
//             resetToast();
//         },3000);
//     }
    const triggerToast = (message,toastResStatus)=>{
        console.log("toastJS",{message,toastResStatus})
        store.dispatch('toast/triggerToast', {message, toastResStatus});
    }

    return {
        toasts,
        triggerToast,
    }
}
```
해당 컴포넌트로 이동해 array 기준 적용

App.vue에 있던 transition을 가져옴.

transition이 여럿인 경우 transition-group 사용
```vue
<template>
  <div class="toast-box">
    <transition-group name="infoSlide">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          class="alert"
          :class="`alert-${toast.status}`"
          role="alert"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>
<script>
import {useToast} from "@/composables/toast";

export default {
  // props:{
  //   message: {
  //     type: String,
  //     required: true,
  //   },
  //   status: {
  //     type: String,
  //     default: "danger",
  //   },
  // },
  setup(){
    const {toasts} = useToast();
    return {
      toasts,
    }
  }
}
</script>

<style scoped>
  .toast-box{
    position: fixed;
    z-index: 1000;
    top: 10px;
    right: 10px;
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
```
### 6. pagination 꺼내오기
```vue
<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li v-if="currentPage !== 1" class="page-item" >
        <a class="page-link" href="#" @click.prevent="onClick(1)">First</a>
      </li>
      <li class="page-item" :class="currentPage === 1?'disabled':''">
        <a class="page-link" href="#" disabled="{{currentPage !== 1}}" @click.prevent="onClick(currentPage-1)">prev</a>
      </li>
      <li
          v-for="page in totalPages"
          :key ="page"
          class="page-item"
          :class="currentPage===page?'active':''"
      >
        <a class="page-link" href="" @click.prevent="onClick(page)" >
          {{page}}
        </a>
      </li>
      <li class="page-item" :class="currentPage === totalPages?'disabled':''">
        <a class="page-link" href="#" disabled="{{currentPage !== totalPages}}" @click.prevent="onClick(currentPage+1)">Next</a>
      </li>
      <li class="page-item" :class="currentPage === totalPages?'disabled':''">
        <a class="page-link" href="#" disabled="{{currentPage !== totalPages}}" @click.prevent="onClick(totalPages)">Last</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import {getCurrentInstance} from "vue";

export default {
  props:{
    currentPage:{
      type:Number,
      required: true
    },
    totalPages:{
      type:Number,
      required: true
    }
  },
  emits:['page_click'],
  setup(){
    const {emit} = getCurrentInstance();
    const onClick=(page)=>{
      emit("page_click",page);
    }
    return {
      onClick
    }
  }
}

</script>

<style scoped>

</style>
```
해당 list 페이지에 사용하기
```vue
<template>
  <Pagination
      v-if="todoList.length"
      @page_click="getTodos"
      :current-page="currentPage"
      :total-pages="totalPages"
  />
</template>
```