<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const userInfo = ref<any>({})

// 页面显示时加载用户信息
onLoad(() => {
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = (): void => {
  const data = wx.getStorageSync('userInfo')
  if (data) {
    userInfo.value = data
  }
  console.log(data, 'userInfo')
}

// 退出登录
const handleLogout = (): void => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: ({ confirm }) => {
      if (!confirm)return 
      wx.removeStorageSync('userInfo')
      wx.navigateTo({ url: '/subpackages/login/index' })
    },
  })
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
