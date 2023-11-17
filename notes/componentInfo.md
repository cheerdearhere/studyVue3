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