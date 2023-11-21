import {onBeforeUnmount, ref} from "vue";

export const useToast= () =>{
    // Toast
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastResStatus = ref(false);
    const timeOut = ref(null);
    const resetToast = ()=>{
        toastMessage.value="";
        toastResStatus.value=false;
    }
    const triggerToast =(message,status)=>{
        toastMessage.value=message;
        toastResStatus.value=status;
        showToast.value = true;
        //5초뒤 리셋
        timeOut.value = setTimeout(()=>{
            showToast.value = false;
            resetToast();
        },3000);
    }
    onBeforeUnmount(()=>{
        clearTimeout(timeOut);
    });
    return {
        toastMessage,
        toastResStatus,
        showToast,
        resetToast,
        triggerToast,
    }
}