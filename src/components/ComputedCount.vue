<template>
  <table class="table">
    <thead>
      <tr>
        <th>variable</th>
        <th>value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          count
        </td>
        <td>
          {{ count }}
        </td>
      </tr>
      <tr>
        <td>double computed</td>
        <td>{{doubleCountComputed}}</td>
      </tr>
      <tr>
        <td>double function</td>
        <td>{{doubleMethod()}}</td>
      </tr>
      <tr>
        <td colspan="2">
          <button @click="count++">+</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script>
import {computed, ref} from "vue";
  export default{
    setup(){
      const count = ref(1);
      /*
        function과 computed의 차이점:
        1.  function은 외부의 인자를 받아서 처리
            computed는 bind된 값만 처리
        2.  computed는 값을 캐싱하여 계속 갖고 있어 기존의 값을 두번 연산하지 않는다.
            function은 개별로 처리함
      */
      const doubleCountComputed = computed(()=>{
        return count.value * 2;
      });
      const doubleMethod = ()=>{
        return count.value * 2;
      }
      return {
        count,
        doubleCountComputed,
        doubleMethod,
      }
    }
  }
</script>

<style>

</style>