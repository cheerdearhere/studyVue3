import {createRouter,createWebHistory} from "vue-router";
import Todos from "@/pages/todos/index.vue";
import TodoCreate from "@/pages/todos/create/index.vue";
import Todo from "@/pages/todos/_id.vue";
import Home from "@/pages/index.vue"
import ComputedCount from "@/pages/count/index.vue";

const domain = "http://localhost";
const port =  9000;
const todoHost = `${domain}:${port}/todos`;

const router = createRouter({
    history:createWebHistory(),//manage web history
    routes:[
        {//하나의 객체가 하나의 라우트
            path        : '/',//url
            name        : 'Home',//name
            component   : Home,//해당 컴포넌트
        },
        {
            path        : '/count',
            name        : 'computedCount',
            component   : ComputedCount,
        },
        {
            path        : '/todos',
            name        : 'TodoList',
            component   : Todos,
        },
        {
            path        : '/todos/create',
            name        : 'TodoCreate',
            component   : TodoCreate,

        },
        {
            path        : '/todos/:id',
            name        : 'Todo',
            component   : Todo,
        },
    ],
});
export default router;
export {
    todoHost,
}