import {createRouter,createWebHistory} from "vue-router";
import Todos from "@/pages/todos/index.vue";
import Home from "@/pages/index.vue"

const router = createRouter({
    history:createWebHistory(),//manage web history
    routes:[
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