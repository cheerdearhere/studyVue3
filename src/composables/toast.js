import {computed} from "vue";
import {useStore} from "vuex";

export const useToast= () =>{
// Toast > mutations, store
    // const showToast = ref(false);
    // const toastMessage = ref("");
    // const toastResStatus = ref(false);
    // const timeOut = ref(null);
    //vuex store
    const store = useStore();
    // const toastMessage = computed(()=>store.getters['toast/toastMessageWithSmile']);
    // const toastResStatus = computed(()=>store.state.toast.toastResStatus);
    // const showToast = computed(()=>store.state.toast.showToast);
    const toasts = computed(()=>store.state.toast.toasts);
//  action으로 이동, store.dispatch로 실행
//     const resetToast = ()=>{
//         toastMessage.value="";
//         toastResStatus.value=false;
//     }
//     const triggerToast =(message,status)=>{
//         toastMessage.value=message;
//         toastResStatus.value=status;
//         showToast.value = true;
//         //5초뒤 리셋
//         timeOut.value = setTimeout(()=>{
//             showToast.value = false;
//             resetToast();
//         },3000);
//     }
    const triggerToast = (message,toastResStatus)=>{
        console.log("toastJS",{message,toastResStatus})
        store.dispatch('toast/triggerToast', {message, toastResStatus});
    }

    return {
        toasts,
        triggerToast,
    }
}