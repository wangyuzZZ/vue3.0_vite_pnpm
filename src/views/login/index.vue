<script setup name="Login">
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCodeImg } from "@/api/login"
import useUserStore from '@/store/modules/user'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
// 登录表单
const loginForm = ref({
    username: "",
    password: "",
    code: "",
    uuid: ""
})
// 验证码
const codeImg = ref('')
onBeforeMount(() => {
    queryCodeImg()//获取验证码
})
/** 获取验证码 */
const queryCodeImg = () => {
    getCodeImg().then(res => {
        if (res.code === 200) {
            codeImg.value = "data:image/gif;base64," + res.img
            loginForm.value.uuid = res.uuid
        }
    })
}
/** 登录 */
const loginClick = () => {
    const { username, password, code, uuid } = loginForm.value
    const redirect = route.query && route.query.redirect
    userStore.login(username, password, code, uuid).then(res => {
        router.push(redirect || '/')
    })
}
/** 退出登录 */
const loginOutClick = () => {

}
</script>
<template>
    <div>
        <input type="text" placeholder="账号" v-model="loginForm.username">
        <input type="text" placeholder="密码" v-model="loginForm.password">
        <div>
            <input type="text" placeholder="验证码" v-model="loginForm.code">
            <img :src="codeImg" alt="麦润-验证码">
        </div>
    </div>
    <div>
        <div @click="loginClick">登录</div>
        <div @click="loginOutClick">退出</div>
    </div>
</template>
<style scoped>
</style>