import router from './index'
import NProgress from 'nprogress' //进度条
import 'nprogress/nprogress.css' //进度条样式
import {
  getToken
} from "@/utils/auth" //获取本地token
import {
  MenuWhiteList
} from "./menuWhiteList" //路由白名单
import useUserStore from '@/store/modules/user'
NProgress.configure({
  showSpinner: false
})
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const {
    name
  } = to
  NProgress.start() //开启进度条
  // 盘点本地是否存有token
  if (getToken()) {
    // 判断当前是否有角色信息
    if (userStore.getRoles.length) {
      next()
      return
    }
    // 获取角色信息 拉取动态路由
    userStore.getUserInfo().then(res => {
      userStore.generateRoutes().then(accessRoutes => {
        console.log('动态路由表', accessRoutes)
        router.addRoute(accessRoutes) // 动态添加可访问路由表
        // 登录后无法前往登录页 重新跳转到首页
        if (to.path === '/login') {
          next({
            path:setDefaultPath(accessRoutes)
          })
          NProgress.done()
          return
        }
        // hack方法 确保addRoutes已完成
        next({
          ...to,
          replace: true
        })
      })
    }).catch(e => {
      userStore.loginOut().then(res => {
        next('/login')
      })
    })
    return
  }
  // 盘点是否在路由白名单
  if (MenuWhiteList.includes(name)) {
    next()
    return
  }
  next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
})

router.afterEach(() => {
  NProgress.done() //关闭进度条
})

function setDefaultPath(arr) {
  if (arr[0] && arr[0].children && arr[0].children.length) {
    return setDefaultPath(arr[0].children)
  }
  return arr[0].path
}