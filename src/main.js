import {
    createApp
} from 'vue'
import App from './App.vue'
const app = createApp(App)
// pinia 
import pinia from './store'
app.use(pinia)
// 路由
import router from "@/router"
app.use(router)
import './router/permission' //路由拦截
app.mount('#app')