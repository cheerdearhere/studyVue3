## B. 디랙티브: v-**
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
#### d. [커스텀 컴포넌트에서 v-model 사용하기](https://vuejs.org/guide/components/v-model.html)
여러 데이터를 연결하는 경우
```vue
<script>
  export default {
//props로 연결
    props:{
      label: {
        type: String,
        required: true,
      },
      errorMessage:{
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      }
    },
    setup(props, {emit}){
      const onInputSubject = (e)=>{
        // emit('update-subject', e.target.value);
        emit('update:subject',e.target.value);
      }
      //update: propsName
      const onInputPassword = e =>{
        emit('update:password',e.target.value);
      }
      return {
        onInputSubject,
        onInputPassword,
      }
    }
  }
</script>
```
따로 업데이트 function 연결 없이 사용
```vue
<Input
    label="Subject"
    v-model:subject="todo.subject"
    v-model:password="todo.password"
    :error-message="errorMessage"
/>
```
하나만 연결하는 경우 
```vue
<template>
  <Input
    v-model="email"
  />
</template>
```
내부 컴포넌트
```vue
<script>
  export default {
      props: {
          //따로 이름을 정하지않을 때의 명칭
          modelValue:{
            type: String,
            required: true
          }
      },
    setup(props,{emit}){
          const onInput = e=>{
              emit('update:modelValue',e.target.value);
          }
    }
  }
</script>
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
| 원형                               | 약어            |
|----------------------------------|---------------|
| v-on:이벤트="함수이름"                  | @event="함수이름" |
| v-bind:대상타입="변수이름"               | :대상타입="변수이름"  |
| v-slot:template에서 name으로 지정한 값   | #templateName |
| v-model                          |               |
| v-for="(값,index,array) in 컬랙션이름" |               |
| v-if="조건" v-if-else="조건" v-else  |               |
| v-show="조건"                      |               |