<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content-wrapper">
      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="logo-container">
          <image
            class="avatar"
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=test"
            mode="scaleToFill"
          />
          <view class="logo-ring"></view>
        </view>
        <text class="welcome-text">欢迎使用</text>
        <text class="app-name">叮当智装</text>
        <text class="subtitle">让装修变得更简单</text>
      </view>

      <!-- 登录按钮区域 -->
      <view class="login-section">
        <button class="login-btn" @click="handleLogin">
          <text class="btn-text">微信一键登录</text>
          <text class="btn-icon">→</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { loginService } from './service'
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

  const { success, data } = await loginService({ code })

  if (success) {
    wx.setStorageSync('userInfo', data)
  }

  wx.hideLoading()
  wx.navigateBack({ delta: 1 })
}
</script>

<style lang="scss">
page {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.login-container {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

// 背景装饰圆圈
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: 10%;
  right: -50rpx;
  animation-delay: 0s;
}

.circle-2 {
  width: 150rpx;
  height: 150rpx;
  top: 60%;
  left: -30rpx;
  animation-delay: 2s;
}

.circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 30%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// 主要内容区域
.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Logo区域
.logo-section {
  text-align: center;
  margin-bottom: 120rpx;
}

.logo-container {
  position: relative;
  margin-bottom: 40rpx;
  display: inline-block;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.logo-ring {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  right: -10rpx;
  bottom: -10rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.welcome-text {
  display: block;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16rpx;
  font-weight: 300;
}

.app-name {
  display: block;
  font-size: 56rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 16rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
}

// 登录按钮区域
.login-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(45deg, #00cec9, #00b4d8);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 206, 201, 0.4);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 40rpx;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(0, 206, 201, 0.4);
  }

  &:active::before {
    left: 100%;
  }

  &::after {
    border: none;
  }
}

.btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
  margin-right: 16rpx;
}

.btn-icon {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.login-btn:active .btn-icon {
  transform: translateX(4rpx);
}
</style>
