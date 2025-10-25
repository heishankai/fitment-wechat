<template>
  <view class="header-container">
    <!-- 已登录状态 -->
    <view class="user-info" v-if="userInfo?.token">
      <view class="user-main">
        <image
          class="avatar"
          :src="userInfo?.avatar || '/static/default-avatar.png'"
          mode="aspectFill"
        />
        <view class="user-details">
          <view class="name">{{ userInfo?.nickname || '用户' }}</view>
          <view class="level">装修业主</view>
        </view>
        <view class="edit-btn" @click="handleEditProfile">
          <uni-icons type="compose" size="18" color="#666" />
        </view>
      </view>

      <!-- 用户数据统计 -->
      <view class="user-stats">
        <view class="stat-item" @click="navigateToOrders">
          <view class="stat-number">12</view>
          <view class="stat-label">我的订单</view>
        </view>
      </view>
    </view>

    <!-- 未登录状态 -->
    <view class="guest-info" v-else>
      <view class="guest-content">
        <view class="welcome-title">欢迎来到装修助手</view>
        <view class="welcome-subtitle">专业装修服务，让家更美好</view>
        <button class="login-btn" @click="handleLogin">
          <uni-icons type="person" size="18" color="#fff" />
          立即登录
        </button>
      </view>
      <view class="guest-features">
        <view class="feature-item">
          <uni-icons type="star" size="20" color="#fff" />
          <text>专业设计师</text>
        </view>
        <view class="feature-item">
          <uni-icons type="heart" size="20" color="#fff" />
          <text>品质保证</text>
        </view>
        <view class="feature-item">
          <uni-icons type="gear" size="20" color="#fff" />
          <text>贴心服务</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 解构 props 并设置默认值
const { userInfo } = defineProps<{ userInfo: any }>()

// 登录
const handleLogin = (): void => {
  wx.navigateTo({
    url: '/subpackages/login/index',
  })
}

// 编辑个人信息
const handleEditProfile = (): void => {
  wx.navigateTo({
    url: '/subpackages/profile-edit/index',
  })
}

// 导航到订单页面
const navigateToOrders = (): void => {
  wx.navigateTo({
    url: '/subpackages/orders/index',
  })
}
</script>

<style lang="scss" scoped>
.header-container {
  margin: 24rpx;
  background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 206, 201, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  // 已登录用户信息
  .user-info {
    position: relative;
    z-index: 2;

    .user-main {
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;

      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
      }

      .user-details {
        flex: 1;
        margin-left: 24rpx;

        .name {
          font-size: 36rpx;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8rpx;
        }

        .level {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.2);
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
          display: inline-block;
        }
      }

      .edit-btn {
        width: 60rpx;
        height: 60rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10rpx);
      }
    }

    .user-stats {
      display: flex;
      justify-content: space-around;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16rpx;
      padding: 24rpx;
      backdrop-filter: blur(10rpx);

      .stat-item {
        text-align: center;
        flex: 1;

        .stat-number {
          font-size: 32rpx;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8rpx;
        }

        .stat-label {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  // 未登录状态
  .guest-info {
    position: relative;
    z-index: 2;

    .guest-content {
      text-align: center;
      margin-bottom: 32rpx;

      .welcome-title {
        font-size: 40rpx;
        font-weight: 600;
        color: #fff;
        margin-bottom: 16rpx;
      }

      .welcome-subtitle {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 32rpx;
      }

      .login-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 2rpx solid rgba(255, 255, 255, 0.3);
        border-radius: 50rpx;
        padding: 16rpx 48rpx;
        color: #fff;
        font-size: 28rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12rpx;
        margin: 0 auto;
        backdrop-filter: blur(10rpx);

        &::after {
          border: none;
        }
      }
    }

    .guest-features {
      display: flex;
      justify-content: space-around;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16rpx;
      padding: 24rpx;
      backdrop-filter: blur(10rpx);

      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;
        color: #fff;
        font-size: 24rpx;
      }
    }
  }
}
</style>
