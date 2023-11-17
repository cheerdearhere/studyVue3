Study files -  Vue 3.0
======================

# I. 시작하기 전에
## A. 명령어
### 1. vue project 실행

package.json 파일 script 참고(추가적으로 명령어를 입력했다면 달라지겠지만 따로 추가하지 않은경우)
```json
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
```
cmd에 입력
```dockerfile
npm run  serve


# 결과
> vue3-project@0.1.0 build
> vue-cli-service build

All browser targets in the browserslist configuration have supported ES module.
Therefore we don't build two separate bundles for differential loading.


|  Building for production...

 DONE  Compiled successfully in 5804ms                                                                                                                                                                                                                                                                                                  
               오전 9:08:24

  App running at:
  - Local:   http://localhost:8081/
  - Network: http://{ip address}:8081/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```
### 2. JSON-SERVER : DB-server 대신 사용
서버에서 전송되는 데이터(json) 형태로 응답을 저장하고 전송함
#### a. 데이터를 보관할 json 파일 생성: db.json
#### b. json-server 설치
[npm page](https://www.npmjs.com/package/json-server)
#### c. 동작시키기
```dockerfile
json-server --watch [json파일].json

#ex
json-server --watch db.json

#결과

  \{^_^}/ hi!

  Loading db.json
  Done

# 서버와 통신하는 것처럼 여기서 요청
  Resources
  http://localhost:3000/todos 

  Home
  http://localhost:3000

  Type s + enter at any time to create a snapshot of the database
  Watching...

GET /todos 200 31.426 ms - 665
GET /todos?_sort=id&_order=desc&subject_like=&_page=1&_limit=5 200 31.250 ms - 334
```
#### d. 사용하기
서버에 요청하듯이 사용
```javascript
    try{
        const rs = await axios.get(`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${currentPage.value}&_limit=${cnt}`);//json-server에서 사용하는 페이지네이션
        todoList.value = rs.data;
        totalCnt.value = rs.headers['x-total-count'];
    }catch (err){
        error.value=`Server error: 관리자에게 문의하세요 \n ${err}`
    }
```

# II. Vue 3.0: [composition API](https://ko.vuejs.org/guide/introduction.html#single-file-components)
vue.js 2.0에서는 [options API](https://ko.vuejs.org/guide/introduction.html#single-file-components)가 사용됨
## A. Component
### 1. 구성
- template: JSX로 이뤄진 부분, 보여짐
- script: javascript가 쓰여짐. 
- style: css
```vue
    <template>
        <!-- JSX tag -->
    </template>
    <script>
        export default {
            setup(){
        
        }
      }
    </script>
    <style>
      //css
    </style>
```
#### a. template
- vue.js 2에서는 template안에 최상위 element가 하나만 있어야 했다. (like react)
```vue
<template>
    <div>
      <h1>
        aa
      </h1>
      <div>
        <p>
          bbb
        </p>
      </div>
    </div>  
</template>
```
- vue.js 3에서는 그 제한이 사라짐
```vue
<template>
    <h1>
      aa
    </h1>
    <div>
      <p>
        bbb
      </p>
    </div>
</template>
```
- script에서 선언된 변수, 함수를 바로 출력할때 : {{}}
```vue
<template>
  <div class="use">
    {{ 변수선언 }}
    {{ 함수선언("매개변수") }}
  </div>
</template>
```
#### b. script
해당 component에서 동적으로 사용할 내용이 들어감
```vue
    <script>
        import {component} from "root"; //라이브러리/모듈/컴포넌트 연결 
        export default{ //컴포넌트에서 사용할 대상들 적음
            props:{
                // super로부터 전달받을 데이터 형식
            },
            emits:[
                //부모로 전달할 대상
            ],
            components:{
                //컴포넌트들 
            },
            setup(props,{emit}){
                //script가 직접 사용되는 곳
                
                const 변수선언 = "value";
                const 함수선언=(params)=>{
                    return 변수선언 + " "+ params;
                }
              
                //값을 선언한 경우 return에 반드시 입력
                return {
                    변수선언,
                    함수선언,
                }
            }
        }
    </script>
```
#### c. style
stylesheet 직접 작성
```vue
<style>
  //stylesheet
</style>
```
bootstrap을 사용하는 경우

[Bootstrap CDN](https://www.bootstrapcdn.com/)을 public폴더의 [index.html](./public/index.html)에 연결
```html
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
```

## B. 디렉티브: v-**
### 1. event
event 삽입은 on{Event}가 아닌 v-on:{event}="function"의 형태로 사용
```vue
<template>
  <p>{{data}}</p>
  <button
      v-on:click="consoleLog"
  >
        버튼  
  </button>
</template>
<script>
    export default {
        setup(){
            let data= 999;
            const consoleLog = ()=>{
                data += 1;
                console.log(data);
            }
            return {
                data,
                consoleLog,
            }
        }
    }   
</script>
```
단, 변수의 값이 변해도 화면으로 바인딩 되지 않는다.(콘솔로는 변한것을 확인가능)

### 2. 단방향 data binding
#### a. ref와 reactiv 변수 사용하기
- ref: 하나의 값(특히 리터럴인경우)

ref에서도 Collection을 쓸수 있으나 script내에서 값을 꺼낼 때 반드시 .value가 필요
(단, template에서 표시할때는 필요x)
```vue
<template>
<!-- data.value가 아님 -->
  <p>{{data}}</p>
  <button
      v-on:click="fnUpdate"
  >
        버튼  
  </button>
</template>
<script>
    import {ref} from 'vue'; //vue에서 가져옴
    export default {
        setup(){
            let data= ref(999); //선언할때 ref로
            const fnUpdate = ()=>{
                data.value += 1; //변경시 .value
            }
            return {
                data,
                fnUpdate,
            }
        }
    }   
</script>
```
- reactive: Collection 객체(배열, 객체, 집합 등)를 사용하는 경우 
```vue
<template>
  <p>{{dataArr}}</p>
  <button
      v-on:click="fnUpdate"
  >
    버튼
  </button>
</template>
<script>
  import {reactive} from 'vue'; //vue에서 가져옴
  export default {
    setup(){
      let dataArr= reactive([1,2,3]); //선언할때 reactive로
      const fnUpdate = ()=>{
        dataArr[0] += 1; //변경시 .value없음
      }
      return {
        dataArr,
        fnUpdate,
      }
    }
  }
</script>
```
#### b. v-bind:대상유형="ref 처리한 객체 이름"
대상 유형은 tag의 value, type, class 등
```vue
<template>
<!-- class 동적 변화 -->
  <div v-bind:class="classD">
    {{name}}
  </div>
<!-- 위, 아래가 함께 바뀜 -->
  <input v-bind:type="type" v-bind:value="name"/> 
<!--  tag type 동적 변화 -->
  <button v-on:click="updateName">클릭</button>
</template>
<script>
    import {ref} from "vue";

    export default {
        setup() {
            const name = ref("이름");
            const type = ref("text");
            const classD = ref("name");
            
            const updateName = ()=>{
                name.value = "6";  
                type.value = "number";
                classD.value = "numb";
            };
            return {
                name,
                type,
                classD,
                updateName
            }
        }
    }
</script>
```
### 3. 양방향 바인딩: client의 조작에 동적으로 대응
#### a. 두 방향의 바인딩을 위한 event - function 체인 사용
```vue
<template>
    <input 
        type="text" 
        v-bind:value="name"
        @input="nameChange"
<!--   event 감지해서 적용     -->
    /> 
    <button 
        class="btn btn-primary"
        v-on:click="onsubmit"
    >
        클릭
    </button>
</template>
<script>
    import {ref} from "vue";

    export default {
        setup() {
            const name = ref("이름");
            const onsubmit = ()=>{
                name.value = "6";  
            };
            const nameChange = (e)=>{
                name.value=e.target.value;
            }
            
            return {
                name,
                onsubmit,
                nameChange
            }
        }
    }
</script>
```
#### b. v-model="ref객체"
```vue
<template>
    <input 
        type="text" 
        v-model="name"
    />
  <!--    변동감지가 이미 됨    -->
    <button 
        class="btn btn-primary"
        v-on:click="onsubmit"
    >
        클릭
    </button>
</template>
<script>
    import {ref} from "vue";

    export default {
        setup() {
            const name = ref("이름");
            const onsubmit = ()=>{
                name.value = "6";  
            };
            return {
                name,
                onsubmit,
            }
        }
    }
</script>
```
#### c. checkbox 데이터 바인딩
```vue
    <div class="form-check">
        <input class="form-check-input" 
               type="checkbox" 
               v-model="value.completed"
        />
<!--   boolean data로 바인딩 -->
        <label class="form-check-label">
            <h5 class="todoLabel">
                {{index+1}}. {{value.subject}}
            </h5>
        </label>
    </div>
```
### 4. v-for="(element,index,array) in Collection객체"
map과 매개변수 배치가 유사함
```vue
<template>
  <!--   v-for: 반복문 처리   -->
  <div
      v-for="(value,index) in todoList2"
      :key="value.id"
      class="todoList2 card mt-2"
  >
    <div class="card-body p-2">
      <h5>{{index+1}}. {{value.subject}}</h5>
    </div>
  </div>
</template>
```
### 5. v-show, v-if
둘은 같은 기능을 하지만 초기 랜더 비용과 중간 토글 비용에 차이가 있으므로 성능을 고려해 사용

#### a. v-if="조건문", v-else-if="조건문", v-else
v-if/else-if/else는 토글 비용이 크기때문에 자주 바뀌지 않는 경우에 사용
ex) 권한에 따른 정보 표시, mode 선택 변화 등
```vue
<template>
  <div class="if">
    <div v-if="조건1">if:true</div>
    <div v-else-if="조건2">else-if</div>
    <div v-else>else:false</div>
  </div>
</template>
```
#### b. v-show="조건"
v-show는 랜더링 비용이 크기때문에 자주 바뀌는 경우에 사용
ex) client의 input에 반응, 입력값 에러인경우 문자표시
```vue
<template>
  <div class="show">
    <div v-show="조건1">true</div>
    <div v-show="조건2">false</div>
        ...
  </div>
  <div class="errorMsg" v-show="hasError">Error: This field cannot be empty!</div>
</template>
<script>
  import { ref } from "vue";
  export default {
    setup(){
        const hasError = ref(false);
        const validate = e => {
            // validation
            if(error) hasError.value = true;
        }
        
        return {
            hasError,
            validate,
        }
    }
}
</script>
```

### etc. 축약표시
| 원형                               | 약어               |
|----------------------------------|------------------|
| v-on:이벤트="함수이름"                  | @event="함수이름"    |
| v-bind:대상타입="변수이름"               | :대상타입="변수이름"     |
| v-model                          ||
| v-for="(값,index,array) in 컬랙션이름" ||
| v-if="조건" v-if-else="조건" v-else  ||
| v-show="조건"                      ||

## C. parent - child 사이의 통신
### 1. 컴포넌트 분리해서 연결하기
#### a. 컴포넌트를 분리해 다른 파일로 작성
#### b. script: 분리된 컴포넌트 연결하기
script태그에 import 
```vue
<script>
//  import
  import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
  import TodoList from "@/components/TodoList.vue";
  export default {
//  component 처리
        components:{
          TodoSimpleForm,
          TodoList,
        },
        setup() {
            ...
        }
    }
</script>
```
#### c. JSX 입력
```vue
<template>
    <TodoSimpleForm/>
    <TodoList/>
</template>
```
#### d. 분리한 child component에 데이터, 함수 등 옮기기
```vue
<script>
  export default{
    setup(){
      let todo2=ref("");
      const hasError = ref(false);
      const addTodoList2=()=>{
        if(todo2.value===""){
          hasError.value=true;
        }else{
          todo2.value.push({
            id: Date.now(),// ms로 id사용리
            subject:todo2.value,//내용
            completed:false,//완료
          });
          todo2.value="";
          hasError.value=false;
        }
      }
      return {
        todo2,
        hasError,
        addTodoList2,
      }
    }
  }
</script>
```
데이터의 위치가 달라지므로 super - sub 사이의 통신을 위해 설정.
### 2. Parent component와 Child component의 통신
      * props : super > sub
      * context : sub > super
#### a. child > parent: context
context.emit("이벤트 이름",전달할 변수);
```vue
<script>
  export default{
    emits:[
        //vue 3.0부터는 필수
        'add-todo', 
    ],
    setup(props,context){
      let todo2=ref("");
      const hasError = ref(false);
      const addTodoList=()=>{
        if(todo2.value===""){
          hasError.value=true;
        }else{
          // emit: super component에 데이터 전달하는 method
          context.emit('add-todo',{
            id: Date.now(),// ms로 id사용리
            subject:todo2.value,//내용
            completed:false,//완료
          });
          todo2.value="";
          hasError.value=false;
        }
      }
      return {
        todo2,
        hasError,
        addTodoList,
      }
    }
  }
</script>
```
context.emit()으로 설정한 이벤트를 감지하도록 parent template에 연결

v-on:설정한이벤트 = "연결할 콜백"
```vue
<template>
  <TodoSimpleForm
      @add-todo="addTodoList"
  />
</template>
```
전달한 데이터를 param으로 call back funciton에 전달
```vue
<script>
import TodoSimpleForm from "./src/components/TodoSimpleForm.vue";
import { ref } from "vue";
export default {
    components: {
      TodoSimpleForm,
    },
    setup(){
        //...
        let todoList = ref([]);
        const addTodoList = (parameter)=>{
            todoList.value.push(parameter);
        }       
        return {
            todoList,
            addTodoList,
        }
    }
}
</script>
```

#### b. parent > child : props
부모 컴포넌트에서 전달할 대상을 입력

변수는 bind, 함수는 on으로 처리
```vue
    <TodoList
        v-bind:todoList="todoList2" 
        :todoStyle="todoStyle"
        v-on:delete-todo="deleteTodo"
        @toggle-todo="toggleTodo"
    />
```
받는 컴포넌트(child)에서 props 관리
```vue
<script>
  export default{
    // props:[
    //     'todoList',
    //     'todoStyle',
    // ],
    /* 타입과 필수 여부를 지정할 수 있음 */
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
    setup(props, context){
      const todosLength=()=>{
        console.log("list length",props.todoList.length);
      };
      return{
        todosLength
      }
    }
  }
</script>
```
* props 사용시 [주의사항](https://vuejs.org/guide/components/props.html)

props는 부모에서 자식으로 보내는 단방향 전송임. 

부모의 변경사항이 자식컴포넌트에 영향을 주지만 자식 컴포넌트의 변경이 부모로 전달되지 않음. 

필요하다면 context 이용
```vue
<script>
export default {
  props:{
    todoList: {
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
  setup(props, {emit}){
    // context.emit을 구조 분해 할당해 사용하면 더 간결
    const toggleTodo = (index)=>{
      emit('toggle-todo',index);
    }
    const deleteTodo = (index)=>{
      emit('delete-todo',index)
    }
    return{
      toggleTodo,
      deleteTodo,
    }
  }
}
</script>
```

#### c. computed와 watch


## D. Router 처리

# III. 기타 기능
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
## C. 
