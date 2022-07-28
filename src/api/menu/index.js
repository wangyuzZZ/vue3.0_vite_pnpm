import request from '@/request'

/** 获取路由生成菜单 */
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}