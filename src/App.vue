<!--  최상위 컴포넌트  -->
<template>
  <!-- html code -->
  <div>
    <h1>Kossie coder</h1>
    My name: <span class="name">{{ name }}</span>
  </div>
  <!-- vue3 변경점 -->
  <p class="content">vue2에서는 root tag가 하나여야했지만 vue3에서는 루트태그가 하나가 아니어도 된다</p>
  <div>
    <h1>Call Function!</h1>
    <p class="functionStrCall">{{greeting}}</p>
    <p class="functionCall">{{greeting()}}</p>
    <p class="functionCall">{{greeting("Father")}}</p>
    <p>{{myAge("1888-01-01")}}</p>
  </div>
  <div class="usingEvent">
    <h1>Ref</h1>
    <div> Are you listen? {{afterClick}}</div>
<!--  tag 내에서 ref(리터럴 적용)를 사용하는 경우에는 .value를 할 필요는 없음 -->
    <button
        class="btn btn-outline-success btn-block"
        v-on:click="listeningFunction"
    >
      Click me!
    </button>
    <h1>Reactive</h1>
    <button class="btn btn-outline-warning bin-block" v-on:click="changeUserData">Change</button>
    <div>
      <table class="table table-hover table-border">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>phone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{userData.id}}</td>
            <td>{{userData.name}}</td>
            <td>{{userData.phone}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="dataBind">
    <h1>Data binding</h1>
    <h5 class="label">Click: </h5>
    <button class="btn btn-outline-success btn-sm" disabled>"Click me!"</button><br/>
    <input v-bind:type="toggleType" v-bind:value="afterClick" v-bind:class="toggleClass"/>
<!--
  축약 가능
    v-bind: => :
    v-on: => @
-->
    <input type="text" :value="userData.name" @mouseover="changeUserData"/>
  </div>
</template>

<script>
  //import 영역
  import { ref } from 'vue';//리터럴인 경우
  import {reactive} from "vue";//list, obj 등 자료형인 경우
  // codes
  export default {
    setup(){//mount 할 때
      // variables
      const name = 'Ik Cho';//변수를 지정
      let afterClick = ref("no...I'm waiting");
      let toggleFlag =false;
      const userData = reactive({
        id:"1",
        name:"김",
        phone:"009",
      });
      let toggleType = ref("text");
      let toggleClass = ref("red");
      // functions
      const greeting = (whom)=>{//함수 지정
        if(!whom)whom=name;
        return `Hi!!!! ${whom}`;
      };
      const myAge = (birthStr)=>{
        const today = new Date();
        const birthDay = new Date(birthStr);
        const diff = today - birthDay;
        const age = Math.floor(diff/(12*30*24*60*60*1000));
        return `I'm ${age} years old.`
      }
      const listeningFunction = ()=>{
        toggleFlag = !toggleFlag;
        //ref에 저정된 값을 변경시킴
        afterClick.value = toggleFlag ? "Yes!" : "no...I'm waiting";//그냥 변수만 변경되고 화면은 변경안됨
        //단 tag에서 쓰는 경우에는 .value를 안써도 됨
        toggleType.value = toggleFlag ? "text" : "number";//type도 바인드 가능
        toggleClass.value = toggleFlag ? "redName" : "blueName";
      }
      const changeUserData = ()=>{
        toggleFlag = !toggleFlag;
        userData.id     = toggleFlag ? "2" : "1";
        userData.name   = toggleFlag ? "홍" : "김";
        userData.phone  = toggleFlag ? "00100" : "009";
      }
      //export returns
      return {
        name,//return에 obj 방식으로 이름을 입력
        afterClick,
        userData,
        toggleType,
        toggleClass,

        greeting,//function도 export시킬 수 있음
        myAge,
        listeningFunction,
        changeUserData,

      }
    }
  }
</script>

<style>
  // stylesheet code
  div{
    background: #fff;
    color:#000;
  }
  .name{
    font-weight: bolder;
  }
  .content{
    color:#888888;
  }
  .functionStrCall{
    text-decoration: line-through;
    color:#FF0000FF;
  }
  .functionCall{
    color: #42b983;
  }
  .label{
    display:inline-block;
  }
  .redName {
    color:red;
  }
  .blueName {
    background-color:blue;
  }
</style>