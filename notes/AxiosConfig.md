### 1. axios 생성
```javascript
import axios from "axios";

export default axios.create({
    baseURL  : `http://localhost:9000/`,
    method: 'post',
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'foobar'
    },
    params: {
        ID: 12345
    },
    data: {
        firstName: 'Fred',
    },
//     ...
});
```
### 2. axios 적용
```vue

<script>
  import axios from "@/axiosConfig";
  export default {
      setup(){
          const addTodo = async ()=>{
            //   기본 설정한 url뒤로 추가됨
            const res = await axios.post("todo",{}); 
          }
          return{
              addTodo,
          }
      }
  }
</script>
```
### 3. [문서](https://www.npmjs.com/package/axios)