<template>
  <view class="container">
    <custom-navbar />
    <scroll-view class="scroll-view" scroll-y>
      <mine-header :userInfo="userInfo" />
      <mine-title />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import mineHeader from './components/mine-header.vue'
import mineTitle from './components/mine-title.vue'
import customNavbar from './components/custom-navbar.vue'

const userInfo = ref({})

// 页面显示时加载用户信息
onShow(() => {
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = (): void => {
  const data = wx.getStorageSync('userInfo')
  if (data) {
    userInfo.value = { ...data }
  }

  console.log(data, 'userInfo')
}
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
