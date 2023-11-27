<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h1>Todo List Page</h1>
      <button class="btn btn-outline-primary" @click.stop="goCreate">Create Todo</button>
    </div>

    <div class="todoContainer container">
      <input
          id="todo"
          class="form-control"
          type="text"
          placeholder="Search"
          v-model="searchText"
          @keyup.enter = "searchTodo"
      />
      <div>
        <div v-if="error" class="errorMsg">{{error}}</div>
        <div v-if="!todoList.length">
          작성된 내역이 없습니다.
        </div>
        <!--  5. 전달 하기: props v-bind(:)로 전달
                one way binding: 부모에서 자식으로만 보낼 수 있음
        -->
        <TodoList
            :todoList="todoList"
            :todoStyle="todoStyle"
            @delete-todo="deleteTodo"
            @toggle-todo="toggleTodo"
        />
      </div>
    </div>
    <div class="paging">
      <Pagination
        v-if="todoList.length"
        @page_click="getTodos"
        :current-page="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
/* 2. component 등록 */
import TodoList from "@/components/TodoList.vue";
import ComputedCount from "@/components/ComputedCount.vue";
import UseRef from "@/components/UseRef.vue";
import {computed, onBeforeUnmount, reactive, ref, watch, watchEffect} from "vue";
import axios, {HttpStatusCode} from "axios";
import {todoHost} from "@/router";
import Toast from "@/components/Toast.vue";
import {useToast} from "@/composables/toast";
import {useRouter} from "vue-router";
import Pagination from "@/components/Pagination.vue";

export default {
  components:{
    Pagination,
    ComputedCount,
    TodoList,
    UseRef,
    Toast,
  },
  setup(){
    // router
    const router = useRouter();
    // toast
    const {
      toastMessage,
      toastResStatus,
      showToast,
      triggerToast,
    } = useToast();

    /* 강의의 내용을 적용 */
    const hasError = ref(false);
    const toggle=ref(true);
    const upTrue=()=>toggle.value=true;
    const downFalse=()=>toggle.value=false;
    const todoStyle  = {//jsx문법때처럼 -이 아닌 camelCase로 지정
      textDecoration: 'line-through',
      color: 'lightGray',
    }
    let todo=ref("");
    const todoList = ref([]);
    const totalCnt = ref(0);
    const cnt = 5;
    const totalPages = computed(()=>{
      return Math.ceil(totalCnt.value/cnt);
    });
    const currentPage = ref(1);
    const error = ref('');
    //useEffect update
    /*
     * useEffect(()=>{},[target]);
     */
    watchEffect(()=>{
      console.log(currentPage.value);
      console.log(totalCnt.value);
    });
    //reactive도 적용 가능하다
    const reactiveObj = reactive({
      num: 3,
      another:0,
    });
    watchEffect(()=>{
      console.log("watchEffect",reactiveObj.num);
    });
    reactiveObj.num= 2;

    //현재 값만 감지
    watch(currentPage,()=>{
      console.log("watch",currentPage.value);
    });
    //현재값과 이전값
    watch(currentPage,(curr,prev)=>{
      console.log(`${prev}=>${curr}`);
    });
    //reactive 사용
    watch(()=>reactiveObj.num,(curr,prev)=>{
      console.log(`${prev}->${curr}`);
    });
    //여러 state 감지
    watch(()=>[reactiveObj.num,reactiveObj.another,currentPage.value],(curr,prev)=>{
      console.log(`num&another: ${prev}=>${curr}`);
    });

    reactiveObj.num= 10;
    reactiveObj.another++;

    const searchText = ref('');
    const getTodos = async (page)=>{
      currentPage.value = page;
      error.value='';
      try{
        const rs = await axios.get(`${todoHost}?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${currentPage.value}&_limit=${cnt}`);//json-server에서 사용하는 페이지네이션
        todoList.value = rs.data;
        totalCnt.value = rs.headers['x-total-count'];
      }catch (error){
        triggerToast(`${error.name}: ${error.message} (code: ${error.code})`,"danger");
      }
    }
    getTodos(1);//mount 실행
    // watch를 사용해 검색처리하기(client에서 필터링) 추가
    let getListTimeOut = null;
    watch(searchText,()=>{
      clearTimeout(getListTimeOut);//이전 interval 제거
      getListTimeOut = setTimeout(()=>{//검색 주기 지정
        getTodos(1);
      },1000);
    });
    const searchTodo =()=>{//enterkey 연결
      clearTimeout(getListTimeOut);
      getTodos(1);
    }

    const addTodoList = (todo) => {
      //json-server db.json > 가상db(REST API)
      //axios를 사용해 서버로 전송 > db.json에 저장
      error.value= '';
      //서버(지금은 임시)로 전달
      axios.post(todoHost,{
        subject: todo.subject,
        completed: todo.completed,
      }).then(rs=>{
        console.log(rs);
        triggerToast(`데이터가 추가됨 \n id: ${rs.data.id}/ subject: ${rs.data.subject}`,"success");
        //context.emit(데이터이름,데이터 obj)에서 전달받은 것
      }).catch(error=> triggerToast(`${error.name}: ${error.message} (code: ${error.code})`,"danger"));
    }
    const toggleTodo=async (idx, checked)=>{
      error.value='';
      const id = todoList.value[idx].id;
      try{
        await axios.patch(`${todoHost}/${id}`,{
          completed: checked,//!todoList.value[idx].completed
        });
        triggerToast(`${todoList.value[idx].id} 번 ${checked?"-완-":"-re-"}`,checked?"success":"danger");
      }catch (error){
        triggerToast(`${error.name}: ${error.message} (code: ${error.code})`,"danger");
      }finally {
        getTodos()
            .catch(error=>triggerToast(`${error.name}: ${error.message} (code: ${error.code})`,"danger"));
      }
    }
    const deleteTodo= async (todoId)=>{
      error.value='';
      await axios.delete(`${todoHost}/${todoId}`)
          .then(rs=>{
            if(rs.status !== HttpStatusCode.Ok){
              triggerToast(`${rs.statusText}: ${rs.status}`,"danger")
            }
            getTodos(1);
            triggerToast(`데이터가 삭제됨(${rs.status})`,"success");
          })
          .catch(error=>triggerToast(`${error.name}: ${error.message} (code: ${error.code})`,"danger"));
    }
    const goCreate = () =>{
      router.push({
        name:"TodoCreate"
      });
    }
    onBeforeUnmount(()=>{
      clearTimeout(getListTimeOut);
    })
    //export returns
    return {
      todo,
      todoList,
      toggle,
      hasError,
      todoStyle,
      searchText,
      // filteredTodoList,
      error,
      totalPages,
      currentPage,
      // toast
      showToast,
      toastMessage,
      toastResStatus,

      getTodos,
      deleteTodo,
      toggleTodo,
      searchTodo,
      addTodoList,
      upTrue,
      downFalse,
      goCreate,
    }
  }
}
</script>
<style scoped>
</style>