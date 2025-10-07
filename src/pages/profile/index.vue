<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
      <view class="content">
        <!-- 用户信息卡片 -->
        <view class="user-card">
          <view class="user-avatar">
            <image :src="userInfo.avatar" mode="aspectFill" class="avatar-image" />
          </view>
          <view class="user-info">
            <text class="user-name">{{ userInfo.name }}</text>
            <text class="user-phone">{{ userInfo.phone }}</text>
          </view>
          <view class="edit-btn" @click="editProfile">
            <text class="edit-icon">✏️</text>
          </view>
        </view>

        <!-- 功能菜单 -->
        <view class="menu-section">
          <view class="menu-item" @click="navigateTo('/pages/orders/index')">
            <view class="menu-icon">📋</view>
            <text class="menu-text">我的订单</text>
            <text class="menu-arrow">></text>
          </view>

          <view class="menu-item" @click="navigateTo('/pages/favorites/index')">
            <view class="menu-icon">❤️</view>
            <text class="menu-text">我的收藏</text>
            <text class="menu-arrow">></text>
          </view>

          <view class="menu-item" @click="navigateTo('/pages/address/index')">
            <view class="menu-icon">📍</view>
            <text class="menu-text">收货地址</text>
            <text class="menu-arrow">></text>
          </view>

          <view class="menu-item" @click="navigateTo('/pages/coupons/index')">
            <view class="menu-icon">🎫</view>
            <text class="menu-text">优惠券</text>
            <text class="menu-arrow">></text>
          </view>
        </view>

        <!-- 服务菜单 -->
        <view class="menu-section">
          <view class="menu-item" @click="navigateTo('/pages/feedback/index')">
            <view class="menu-icon">💬</view>
            <text class="menu-text">意见反馈</text>
            <text class="menu-arrow">></text>
          </view>

          <view class="menu-item" @click="navigateTo('/pages/about/index')">
            <view class="menu-icon">ℹ️</view>
            <text class="menu-text">关于我们</text>
            <text class="menu-arrow">></text>
          </view>

          <view class="menu-item" @click="navigateTo('/pages/settings/index')">
            <view class="menu-icon">⚙️</view>
            <text class="menu-text">设置</text>
            <text class="menu-arrow">></text>
          </view>
        </view>

        <!-- 退出登录 -->
        <view class="logout-section">
          <button class="logout-btn" @click="handleLogout">
            <text class="logout-text">退出登录</text>
          </button>
        </view>
      </view>
    </scroll-view>
    <tabbar selected="4"></tabbar>
  </view>
</template>

<script setup lang="ts">
// components
import tabbar from '@/components/custom-tab-bar.vue'

// utils
import { useGuessList } from '@/utils'

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()

// 当前下拉刷新状态
const isTriggered = ref(false)

// 自定义下拉刷新被触发
const onRefresherrefresh = async (): Promise<void> => {
  // 开始动画
  isTriggered.value = true

  // 加载数据
  guessRef.value?.resetData()

  await guessRef.value?.getMore()

  // 关闭动画
  isTriggered.value = false
}

const userInfo = ref({
  name: '装修用户',
  phone: '138****8888',
  avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=user',
})

const navigateTo = (url: string): any => {
  console.log('导航到:', url)
  // 这里可以根据实际需要跳转到对应页面
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  })
}

const editProfile = (): any => {
  uni.showToast({
    title: '编辑资料功能开发中',
    icon: 'none',
  })
}

const handleLogout = (): any => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息
        uni.removeStorageSync('userInfo')

        // 跳转到登录页
        uni.reLaunch({
          url: '/subpackages/login/index',
        })

        uni.showToast({
          title: '已退出登录',
          icon: 'success',
        })
      }
    },
  })
}
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  /* background-color: #efefef; */
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.header {
  padding: 60rpx 40rpx 40rpx;
  text-align: center;
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #333;
}

.content {
  padding: 0 40rpx;
}

.user-card {
  background: linear-gradient(135deg, #00cec9, #00b4d8);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 206, 201, 0.3);
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.user-phone {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.edit-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 24rpx;
  color: #fff;
}

.menu-section {
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8f9fa;
  }
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  font-size: 24rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 24rpx;
  color: #ccc;
}

.logout-section {
  margin-top: 60rpx;
}

.logout-btn {
  width: 100%;
  height: 100rpx;
  background: #fff;
  border: 2rpx solid #ff4757;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

  &::after {
    border: none;
  }
}

.logout-text {
  font-size: 28rpx;
  color: #ff4757;
  font-weight: 600;
}
</style>
