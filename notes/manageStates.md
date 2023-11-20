## D. manage states: Computed Properties And Watch
### 1. computed
함수와 같은 기능을 하지만 다음이 다르다
```asciidoc
    1. parameter를 받지 않고 reactive 변수를 가져와 계산
    2. 같은 연산 결과를 내는 경우 같은 내용을 여러곳에서 사용하더라도 중복연산을 하지않는다.(like useMemo) 
```
```vue
<template>
    <h2>Count: {{count}}</h2>
    <h2>Computed: {{doubleCountComputed}}</h2>
    <h2>Method: {{doubleCountMethod()}}</h2>
    <h2>Computed: {{doubleCountComputed}}</h2>
    <h2>Method: {{doubleCountMethod()}}</h2>
    <button
        @click="count++"
    >add One</button>
</template>
<script>
import { ref, computed } from 'vue'
export default {
    setup() {
        const count = ref(1);
        const iterateNum = ref(0);
        const doubleCountComputed = computed(()=>{
            console.log("Computed");//2곳에서 사용되도 1번만 표시 = 한번만 연산
            return count.value*2;
        });
        const doubleCountMethod = ()=>{
            console.log("Method");// 2곳에서 사용하면 두번 표시 = 매번 연산
            return count.value*2;
        };
        return{
            count,
            doubleCountComputed,// 함수의 역할을 하지만 값만 전달
            doubleCountMethod,
        }
    }
}
</script>
```
### 2. watchEffect, watch
내부의 reactiveValue가 변경되는 것음 감지함.

변경이 감지될때마다 내부 callback이 처리됨

like react:useEffect
완전 같지는 않음
#### a. watchEffect 
```vue
<template>
    <h4>{{currState}}</h4>
    <button
        @click="upState"
    >
    up
    </button>
</template>
<script>
import {ref, watchEffect} from "vue";
export default {
    setup() {
        const currState = ref(1);
        const upState = ()=>{
            currState.value+=1;
        }
        watchEffect(() => {
            console.log(currState.value);
        });
        /* react: useEffect
        useEffect(()=>{
            console.log(currState);
        },[currState]);
         */
        return{
            currState,
            upState,
        }
    } 
}
</script>
```
내부에서 사용하는 값이 아닌 경우 반응하지 않는다.
#### b. watch
watch(바라볼값,callback);

ref 사용
```vue
<template>
  <h4>{{currState}}</h4>
  <button
      @click="upState"
  >
    up
  </button>
</template>
<script>
  import {ref} from "vue";
  export default {
    setup() {
      const currState = ref(1);
      const upState = ()=>{
        currState.value+=1;
      }
      //watch(주시대상,(변경된값,변경전값)=>{})
      watch(currState,(currentState, previousState)=>{
          console.log(`${previousState} >>> ${currentState}`);
      })
      return{
        currState,
        upState,
      }
    }
  }
</script>
```
reactive 사용
```vue
<template>
  <h4>{{currState}}</h4>
  <button
      @click="upState"
  >
    up
  </button>
</template>
<script>
  import {reactive} from "vue/reactivity";
  export default {
    setup() {
      const currState = reactive({count:1});
      const upState = ()=>{
        currState.count+=1;
      }
      //watch(
      //    ()=>reactive객체.주시대상,i=>reactivObj.get(i);
      //    (변경된값,변경전값)=>{
      //        내용
      //    }
      //);
      watch(
          ()=>currState.count,//reactive에서 값을 꺼내는 동작
          (currentState, previousState)=>{
              //처리 내용
              console.log(`${previousState} >>> ${currentState}`);
          }
      );
      return{
        currState,
        upState,
      }
    }
  }
</script>
```
여러개의 소스를 한번에 감지하기

```vue

<template>
  <h4>{{currState}}</h4>
  <button @click="upState('a')">
    apple up
  </button>
  <button @click="upState('b')">
    banana up
  </button>
  <button @click="upState('c')">
    all fruits up
  </button>
</template>
<script>
  import {reactive} from "vue";

  export default {
    setup() {
      const currState = reactive({
        apple: 1,
        banana: 20,
      });
      const upState=(type)=>{
        if(type==="a"){
            currState.apple += 1;
        }
        if(type==="b"){
            currState.banana +=10;
        }
        if(type==="c"){
            currState.apple += 10;
            currState.banana += 1;
        })
      }
      watch(
          ()=>[currState.apple,currState.banana],
          (curr,prev)=>{
            console.log(`${prev} >>> ${curr}`);
            //prev와 curr의 값이 위의 데이터 순의 배열로 표시된다.
          }
      );
      return {
        currState,
        upState,
      }
    }
  }
</script>
```
### 3. 