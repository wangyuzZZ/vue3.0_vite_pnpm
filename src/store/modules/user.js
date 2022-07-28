import {
    defineStore
} from "pinia"
import {
    login,
    getInfo,
    logout
} from "@/api/login"
import {
    getRouters
} from "@/api/menu"
import {
    setToken,
    removeToken
} from "@/utils/auth"
import {
    deepCopy
} from "@/utils/w"
import Layout from "@/layout/index.vue"
import ParentView from "@/components/ParentView/index.vue"
const useUserStore = defineStore(
    // 唯一ID
    'user', {
        state: () => ({
            token: localStorage.token || '', //token
            roles: [], //角色信息
            permissions: [], //权限
            user: {}, //用户信息
            routes: [] //用户路由
        }),
        getters: {
            getRoles: state => {
                return state.roles
            }
        },
        actions: {
            // 登录
            login(username, password, code, uuid) {
                return new Promise((resolve, reject) => {
                    login(username, password, code, uuid).then(res => {
                        setToken(res.token)
                        this.token = res.token
                        resolve()
                    }).catch(e => {
                        reject(e)
                    })
                })
            },
            //获取用户信息
            getUserInfo() {
                return new Promise((resolve, reject) => {
                    getInfo().then(res => {
                        if (res.code === 200) {
                            const {
                                permissions,
                                roles,
                                user
                            } = res
                            this.roles = roles
                            this.permissions = permissions
                            this.user = user
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    }).catch(e => {
                        reject(e)
                    })
                })
            },
            //退出登录
            loginOut() {
                return new Promise((resolve, reject) => {
                    logout().then(res => {
                        if (res.code === 200) {
                            removeToken()
                            this.token = ''
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    }).catch(e => {
                        reject(e)
                    })
                })
            },
            //生成路由
            generateRoutes() {
                return new Promise(resolve => {
                    // 向后端请求路由数据
                    getRouters().then(res => {
                        /** 此代码仅使用在后台路由代码未更新时 后台更新若依代码后可删除这段代码 */
                        let tempArr = deepCopy(res.data)
                        tempArr.forEach(item => {
                            if (item.children && item.children.length) {
                                item.children.forEach((item2, index) => {
                                    if (item2.children && item.children.length) {
                                        item.children[index].component = 'ParentView'
                                    }
                                })
                            }
                        })
                        /** */
                        const rewriteRoutes = filterAsyncRouter(deepCopy(tempArr), false, true)
                        // console.log(rewriteRoutes)
                        resolve(rewriteRoutes)
                    })
                })
            }
        }
    }
)
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
    return asyncRouterMap.filter((route, index) => {
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {
            // Layout ParentView 组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            } else if (route.component === 'InnerLink') {
                route.component = 'InnerLink'
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}
export const loadView = (view) => {
    return (resolve) => require([`@/views/${view}`], resolve)
}
export default useUserStore