<template>
  <!-- html code -->
  <div>
    <h1>Kossie coder</h1>
    My name: <span class="name">{{ name }}</span>
  </div>
  <!-- vue3 변경점 -->
  <p class="content">vue2에서는 root tag가 하나여야했지만 vue3에서는 루트태그가 하나가 아니어도 된다</p>
  <div class="functionCall">
    <h1>Call Function!</h1>
    <p class="functionStrCall">{{greeting}}</p>
    <p class="functionCall">{{greeting()}}</p>
    <p class="functionCall">{{greeting("Father")}}</p>
    <p>{{myAge("1888-01-01")}}</p>
  </div>
  <hr/>
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
    <hr/>
    <h1>Reactive</h1>
    <button class="btn btn-outline-warning bin-block" v-on:click="changeUserData">Change</button>
    <div>
      <table class="table table-border">
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
  <hr/>
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
  <hr/>
  <div class="useModel">
    <h1>양방향 바인딩</h1>
    <div class="form-group">
      <label class="label" for="useEvent">단방향 바인딩과 이벤트를 사용해서 양방향으로 설정 &emsp;</label>
      <input
          id="useEvent"
          class="form-control"
          type="text"
          :value="mvData"
          @input="updateMVdata"
          placeholder="값을 입력하고 Alert 버튼을 클릭하세요"
      />
    </div>
    <button
        class="btn btn-block btn-outline-danger"
        @click="onSubmit"
    >
      Alert!!
    </button>
    <div class="form-group">
      <label class="label" for="useVModel">같은 기능을 v-model 하나로 처리할 수 있음 &emsp; </label>
      <input
          id="useVModel"
          class="form-control"
          type="text"
          v-model="mvData"
          placeholder="값을 입력하고 Alert 버튼을 클릭하세요"
      />
    </div>
  </div>
  <div class="todoContainer container">
    <h1>직접 만든 todo list</h1>
    <div class="form-group">
      <label for="todo">To-Do list</label>
      <input
          class="form-control"
          id="todo"
          type="text"
          placeholder="new Todo"
          v-model="todo"
          @keydown="autoSubmit"
      />
      <button
          class="btn btn-block btn-outline-primary"
          @click="addTodoList"
      >
        Add todo list
      </button>
    </div>
    <ul class="todoList"></ul>
  </div>
  <div class="show">
    <div v-show="toggle">true</div>
    <div v-show="!toggle">false</div>
  </div>
  <div class="if">
    <div v-if="toggle">if:true</div>
    <!--    <div v-else-if="조건">else-if</div>-->
    <div v-else>else:false</div>
  </div>
  <div  class="inSquare" @mouseover="upTrue" @mouseleave="downFalse">
    마우스를 올려볼래?
    <p>v-show는 랜더링 비용이 크기때문에 자주 바뀌는 경우에 사용</p>
    <p>v-if/else-if/else는 토글 비용이 크기때문에 자주 바뀌지 않는 경우에 사용</p>
  </div>
</template>

<script>
import {computed, reactive, ref} from "vue";
export default {
  setup(){
    const searchText = ref('');
    const filteredTodoList = computed(()=>{
      if(searchText.value){
        return todoList.value.filter(todo=>{
          return todo.subject.includes(searchText.value)
        })
      }
      return todoList.value;
    });
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
    const mvData = ref("");
    let todo=ref("");
    const todoList = reactive([]);
    const autoSubmit=(e)=>{
      if(e.keyCode===13){
        addTodoList();
      }
    }
    const addTodoList=()=>{
      todoList.push(todo.value);
      if(todoList.length > 0){
        let li;
        let liList=[];
        const targetEL = document.querySelector(".todoList");
        targetEL.innerHTML = "";
        todoList.forEach((item,idx)=>{
          li = `<li>${idx+1}. ${item}</li>`;
          liList.push(li);
        });
        liList.forEach(item=>targetEL.innerHTML+=item);
        todo.value="";
      }
    }
    const onSubmit = ()=>{
      alert(mvData.value);
    };
    const updateMVdata = (e)=>{
      mvData.value = e.target.value;
    }
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
      mvData,
      todo,
      todoList,
      searchText,
      filteredTodoList,
      addTodoList,
      autoSubmit,
      greeting,//function도 export시킬 수 있음
      myAge,
      listeningFunction,
      changeUserData,
      onSubmit,
      updateMVdata,
    }
  }
}

</script>



<style>
body{
  width: 100%;
  height: 100%;
}
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
.inSquare{
  height:50px;
  background: #000;
  color: #fff;
}
</style>