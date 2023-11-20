import {createRouter,createWebHistory} from "vue-router";
import Todos from "@/pages/todos/index.vue";
import Home from "@/pages/index.vue"
import ComputedCount from "@/pages/count/index.vue";

const router = createRouter({
    history:createWebHistory(),//manage web history
    routes:[
        {//하나의 객체가 하나의 라우트
            path        : '/',//url
            name        : 'Home',//name
            component   : Home,//해당 컴포넌트
        },
        {
            path        : '/todos',
            name        : 'TodoList',
            component   : Todos,
        },
        {
            path        : '/count',
            name        : 'computedCount',
            component   : ComputedCount,
        }
    ],
});
export default router;