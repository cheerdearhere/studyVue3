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

</template>

<script>
// js code
export default {
  setup(){//mount 할 때
    const name = 'Ik Cho';//변수를 지정하고
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
    return {
      name,//return에 obj 방식으로 이름을 입력
      greeting,//function도 export시킬 수 있음
      myAge,
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
</style>