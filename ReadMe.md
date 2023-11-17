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
        import {component} from "root"; //라이브러리/모듈 연결 
        export default{ //컴포넌트에서 사용할 대상들 적음
            props:{
                // super로부터 전달받을 데이터 형식
            },
            emits:[
                //부모로 전달할 대상
            ],
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

## B. v-**
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
### 4. 축약표시
| 원형                    | 약어               |
|-----------------------|------------------|
| v-on:이벤트="함수이름"       | @event="함수이름"    |
| v-bind:대상타입="변수이름"    | :대상타입="변수이름"     |
|v-model||



