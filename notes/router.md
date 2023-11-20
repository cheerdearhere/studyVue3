### 1. vue-router 사용
[npm 사이트](https://www.npmjs.com/package/vue-router)

### 2. 기본 설정
#### a. router 폴더
```javascript
const router = createRouter({
    history:createWebHistory(),//manage web history
    routes:[//page 정보
        {//하나의 객체가 하나의 라우트
            path        : '/',//url
            name        : 'home',//name
            component   : Home//해당 컴포넌트
        },
        {
            path        : '/todos',
            name        : 'Todo List',
            component   : Todos,
        },
    ],
});
export default router;
```
#### b. pages 폴더
![img.png](img/routerFolder.png)

pages 폴더가 router의 '/'링크, 

그 하위 폴더가 /이후의 path

```dockerfile
    /todos = pages.todos.index.vue
```

#### c. main.js에 router 등록
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";//라우터
createApp(App)
    .use(router)//사용
    .mount('#app');
```

#### d. router를 App.vue(최상위 컴포넌트) 등록
이동할때마다 변경됨
```vue
<!--  최상위 컴포넌트  -->
<template>
    <!-- router 등록 -->
  <router-view/>
  <div class="computed">
    <ComputedCount/>
  </div>
        ...
```
#### e. 기존 작성 내용 중 페이지 내용을 pages하위로 이동
특히 Client Side Render인 경우 Page 쪽에서 하는 것을 권장
