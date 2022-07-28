import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
import {
    getToken
} from "@/utils/auth"
import useUserStore from '@/store/modules/user'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10000 // 超时
})
// request拦截器
service.interceptors.request.use(config => {
    if (getToken()) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
        const userStore = useUserStore()
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        if (code === 401) {
            userStore.loginOut().then(res => {
                location.href = '/login';
            })
        } else if (code === 500) {
            return Promise.reject(new Error('接口异常 500'))
        } else if (code !== 200) {
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    error => {
        let {
            message
        } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        return Promise.reject(error)
    }
)

export default service