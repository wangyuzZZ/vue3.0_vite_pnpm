import request from '@/request'

/**
 * 登录
 * @param {String} username //用户名
 * @param {Sting} password //密码
 * @param {String} code //验证码
 * @param {String} uuid //ID
 */
export function login(username, password, code, uuid) {
    const data = {
        username,
        password,
        code,
        uuid
    }
    return request({
        url: '/login',
        method: 'post',
        data: data
    })
}
/**
 * 获取用户信息
 */
export function getInfo() {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}
/**
 * 获取验证码
 */
export function getCodeImg() {
    return request({
        url: '/captchaImage',
        method: 'get'
    })
}
/**
 * 退出
 */
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}