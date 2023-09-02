<!--  최상위 컴포넌트  -->
<template>
  <!-- html code -->
  <div>
    <h1>Kossie coder</h1>
    My name: <span class="name">{{ name }}</span>
  </div>
  <!-- vue3 변경점 -->
  <p class="content">vue2에서는 root tag가 하나여야했지만 vue3에서는 루트태그가 하나가 아니어도 된다</p>
</template>

<script>
// js code
export default {
  setup(){//mount 할 때
    const name = 'Ik Cho';//변수를 지정하고

    return {
      name//return에 obj 방식으로 이름을 입력
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
</style>