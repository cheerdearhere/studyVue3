<template>
<!--  <div-->
<!--      v-for="(value,index) in todoList"-->
<!--      :key="value.id"-->
<!--      class="todoList card mt-2"-->
<!--  >-->
  <List
    :items="todoList"
  >
    <template #default="slotProps">
    <div
        class="card-body p-2 d-flex align-items-center box-pointer"
        @click="moveToPage(slotProps.item.id)"
    >
      <div class="flex-grow-1">
        <input
          type="checkbox"
          :checked="slotProps.item.completed"
          @change="toggleTodo(slotProps.index, $event)"
          @click.stop
        />
        <!-- v-model="value.completed"
        : 단방향 전달인 props에서 양방향 처리인 v-model을 사용하는 것은 적절하지 않음
        -->        &emsp;
        <span
            class="todoLabel"
            :class="{todo:slotProps.item.completed}"
            :style="slotProps.item.completed ? todoStyle:{}"
        >
            {{slotProps.item.id}}. {{slotProps.item.subject}}
        </span>
      </div>
      <div>
        <button
            class="btn btn-outline-danger btn-sm"
            @click.stop="openModal(slotProps.item.id)"
        >
          Delete
        </button>
      </div>
    </div>
    </template>
  </List>
<!--  </div>-->

  <teleport to="#confirmModal">
    <DeleteModal
      v-if="modalFlag"
      @closeModal="closeModal"
      @deleteTodo="deleteTodo"
    />
  </teleport>
</template>
<script>
  import {watchEffect, ref} from "vue";
  import {useRouter} from "vue-router";
  import DeleteModal from '@/components/DeleteModal.vue';
  import List from '@/components/List.vue';

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
    components:{
      DeleteModal,
      List
    },
    setup(props, {emit}){
      // watchEffect 영ㄴ습
      let val  = 2;
      watchEffect(()=>{
        console.log("list length",props.todoList.length);
        console.log("reactive value가 아니면 변화가 감지 안됨",val);
      });
      val++;
      val++;

      const modalFlag = ref(false);
      const deleteTodoId = ref(null);
      const openModal = (id)=>{
        deleteTodoId.value = id;
        modalFlag.value = true;
      }
      const closeModal = ()=>{
        deleteTodoId.value=null;
        modalFlag.value= false;
      }
      const deleteTodo = ()=>{
        emit('delete-todo',deleteTodoId.value);
        closeModal();
      }
      // context.emit을 구조분해할당을 쓰면 더 간결
      const toggleTodo = (index, event)=>{
        emit('toggle-todo',index, event.target.checked);
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
        modalFlag,
        toggleTodo,
        deleteTodo,
        moveToPage,
        openModal,
        closeModal,
      }
    }
  }
</script>
<style scoped>
.box-pointer{
  cursor: pointer;
}
</style>