<template>
  <web-view v-if="webViewUrl" :src="webViewUrl" updateTitle />
</template>

<script setup lang="ts">
import { WEBVIEWURL } from '@/utils/request'
const webViewUrl = ref<string>('')

onLoad(() => {
  const token = wx.getStorageSync('userInfo')?.token
  if (token) {
    webViewUrl.value = `${WEBVIEWURL}/chat/wechat?token=${token}`
    console.log(`${WEBVIEWURL}/chat/wechat?token=${token}`, '111')
  } else {
    wx.navigateTo({ url: '/subpackages/login/index' })
  }
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
