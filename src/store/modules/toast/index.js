export default {
    namespaced:true,//사용여부
    state:{
        //전역에서 관리할 데이터
        toasts: [],
        // showToast         : false,
        // toastMessage      : "",
        // toastResStatus    : "",
    },
    mutations: {
        // UPDATE_TOAST_MESSAGE(state, payload){
        //     state.toastMessage = payload;
        // },
        // UPDATE_TOAST_STATUS(state, payload){
        //     state.toastResStatus = payload;
        // },
        // UPDATE_SHOW_TOAST_FLAG(state, payload){
        //     state.showToast = payload;
        // },
        ADD_TOAST(state, payload){
            state.toasts.push(payload);
        },
        REMOVE_TOAST(state, payload){
            state.toasts.shift();//처음 들어온 아이템 제거
        }
    },
    actions: {
        triggerToast (context, payload){
            const {commit} = context;
            const {message, toastResStatus} = payload;
            // commit('UPDATE_TOAST_MESSAGE',message);
            // commit('UPDATE_TOAST_STATUS',toastResStatus);
            // commit('UPDATE_SHOW_TOAST_FLAG',true);
            commit('ADD_TOAST',{
                id: Date.now(),
                message,
                status: toastResStatus
            });
            //5초뒤 리셋
            setTimeout(()=>{
                // commit('UPDATE_TOAST_MESSAGE','');
                // commit('UPDATE_TOAST_STATUS','');
                // commit('UPDATE_SHOW_TOAST_FLAG',false);
                commit('REMOVE_TOAST');
            },3000);
        },
        // resetTimeOut({commit}){
        //     commit('UPDATE_TOAST_TIMEOUT',null);
        // }
    },
    getters:{//state를 밖으로 보낼때 별도의 getter를 지정할 수 있다.
        // toastMessageWithSmile(state){
        //     return state.toasts+' :)';
        // }
    },
}