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