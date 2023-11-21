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
#### e. json-server 설정하기
CLI에서 옵션을 선택해 사용가능
```dockerfile
json-server [options] <source>
ex)
json-server --watch db.json --port 3004

Options:
  --config, -c       Path to config file           [default: "json-server.json"]
  --port, -p         Set port                                    [default: 3000]
  --host, -H         Set host                             [default: "localhost"]
  --watch, -w        Watch file(s)                                     [boolean]
  --routes, -r       Path to routes file
  --middlewares, -m  Paths to middleware files                           [array]
  --static, -s       Set static files directory
  --read-only, --ro  Allow only GET requests                           [boolean]
  --no-cors, --nc    Disable Cross-Origin Resource Sharing             [boolean]
  --no-gzip, --ng    Disable GZIP Content-Encoding                     [boolean]
  --snapshots, -S    Set snapshots directory                      [default: "."]
  --delay, -d        Add delay to responses (ms)
  --id, -i           Set database id property (e.g. _id)         [default: "id"]
  --foreignKeySuffix, --fks  Set foreign key suffix, (e.g. _id as in post_id)
                                                                 [default: "Id"]
  --quiet, -q        Suppress log messages from output                 [boolean]
  --help, -h         Show help                                         [boolean]
  --version, -v      Show version number                               [boolean]

Examples:
  json-server db.json
  json-server file.js
  json-server http://example.com/db.json

https://github.com/typicode/json-server
```
json-server.json(설정 파일)
```json5
{
//  "대상 옵션" : "내용"
  "port"  : 3000,
  "watch" : true,
}
```
## B. 비동기, 동기
[youTube : dreamCoding 강의](https://www.youtube.com/watch?v=JB_yU6Oe2eE)

[정리한 문서 이동](notes/Synchronous_Asynchronous.md)

# II. Vue 3.0: [composition API](https://ko.vuejs.org/guide/introduction.html#single-file-components)
vue.js 2.0에서는 [options API](https://ko.vuejs.org/guide/introduction.html#single-file-components)가 사용됨
## A. Component 구성
[문서로 이동](notes/componentInfo.md)
## B. 디렉티브: v-**
[문서로 이동](notes/directiveCodes.md)
## C. parent - child 사이의 통신
[문서로 이동](notes/betweenComponets.md)
## D. manage states: Computed Properties And Watch
[문서로 이동](notes/manageStates.md)
## E. Router 처리
[문서로 이동](notes/router.md)
## F. Component Lifecycle Hooks
[문서로 이동](notes/compnentLifecycleHooks.md)

# III. 기타 기능
[문서로 이동](notes/examples.md)

# IV. 유용한 Library
## A. [Lodash](https://lodash.com/)
객체, json 문자열을 비교할때 유용. 
### 1. 라이브러리 설치
#### a. CDN
```html
<!-- Lodash CDN -->
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
```
#### b. npm 사용
```dockerfile
    npm i lodash
```
### 2. 사용 예시
```javascript
    _.사용할함수(비교대상);
```

```vue

<template>
  <button
      :class="!isTodoUpdated?'':'disabled'"
      :disabled="!isTodoUpdated"
  >
    내용이 달라져야 활성화
  </button>
</template>
<script>
  import {computed} from "vue";
  import _ from "lodash";

  export default {
    setup() {
    ...
      const isTodoUpdated = computed(() => {
        return !_.isEqual(todo.value, originTodo.value);
      });
      const onSave = async () =>{
        const updateData = todo.value;
        const res = await axios.put(`${host}/${id}`,{ ...updateData });
        if(res.status !== 200) throw new Error("server Error: failed save");
        originTodo.value = {...res.data}; //저장 후 비교대상 update
        alert("success: update data");
      }
    ...
      return {
        isTodoUpdated,
        onSave,
      }
    }
  }

</script>
```