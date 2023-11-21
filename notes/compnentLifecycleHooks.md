### 1. 컴포넌트의 생명주기때 개입해 사용가능
```vue

<script>
  import {
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate, onErrorCaptured,
    onMounted, onRenderTracked, onRenderTriggered,
    onUnmounted,
    onUpdated
  } from "@vue/runtime-core";

  const MyComponent = {
    setup() {
      onBeforeMount(() => {
        console.log("Before mounting to DOM")
      });
      onMounted(() => {
        console.log("mounted");
      });
      onBeforeUpdate(() => {
        console.log("Before updating")
      });
      onUpdated(() => {
        console.log("updated");
      });
      onBeforeUnmount(() => {
        console.log("before unmounted")
      });
      onUnmounted(() => {
        console.log("unmount");
      });
      onErrorCaptured(() => {
        console.log("occurred Error in a child component");
      });
      onRenderTracked(() => {
        console.log("component rendering");
      });
      onRenderTriggered(()=>{
        console.log("component re-rendering");
      });
    }
  }
</script>
```
### 2. examples

```vue

<script>
  import {ref} from "@vue/reactivity";

  export default {
    setup() {
      const timeout = ref(null);
      const triggerToast =(message,status)=>{
        toastMessage.value=message;
        toastResStatus.value=status;
        showToast.value = true;
        //5초뒤 리셋
        timeout.value = setTimeout(()=>{
          showToast.value = false;
          resetToast();
        },3000);
      }
      onBeforeMount(()=>{
          //mount 전에 데이터를 받아놓음
        getTodo();
      });
      onUnmounted(()=>{
        // setTimeOut, interval 등 메모리를 오래 사용하는 경우 unMount처리할때 닫아주면 성능향상에 도움이 된다.
        clearTimeout(timeout.value);
      });
    }
  }
</script>
```
