import {
    createRouter,
    createWebHistory
} from "vue-router";
const localRouter = [{
    path: '/',
    name:"Home",
    component: () => import('@/views/home/index.vue')
}, {
    path: '/login',
    name:"Login",
    component: () => import('@/views/login/index.vue')
}]
const router = createRouter({
    history: createWebHistory(), // 路由模式 history => createWebHistory  hash => createWebHashHistory
    strict: true,
    routes: localRouter
})
export default router