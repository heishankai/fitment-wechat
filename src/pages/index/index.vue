<template>
  <view class="container">
    <button @click="handleLogin">一键登录</button>
  </view>
</template>

<script setup lang="ts">
import { loginService, getUserInfoService } from './service'
// 一键登录
const handleLogin = async (): Promise<void> => {
  wx.showLoading({ title: '登录中', mask: true })

  // 调用 uni.login 获取登录凭证
  const { code } = await new Promise<{ code: string }>((resolve, reject) => {
    wx.login({
      success: (res) => resolve(res),
      fail: (err) => reject(err),
    })
  })

  console.log(code, 'code')

  const { success, data } = await loginService({ code })

  if (success) {
    wx.setStorageSync('userInfo', data)
  }

  console.log('data', data)

  wx.hideLoading()
  // uni.navigateBack({ delta: 1 })
}

onLoad(() => {
  getUserInfoService().then((res) => {
    console.log('res', res)
  })
  console.log('onLoad')
})
</script>

<style lang="scss"></style>
