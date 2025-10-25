<template>
  <view class="menu-container">
    <!-- 主要功能区域 -->
    <view class="main-functions">
      <view class="function-card" @click="navigateToOrders">
        <view class="card-icon">
          <uni-icons type="list" size="24" color="#00cec9" />
        </view>
        <view class="card-content">
          <view class="card-title">我的订单</view>
          <view class="card-desc">查看订单状态</view>
        </view>
        <uni-icons type="right" size="16" color="#ccc" />
      </view>

      <view class="function-card" @click="navigateToAddress">
        <view class="card-icon">
          <uni-icons type="location" size="24" color="#4ecdc4" />
        </view>
        <view class="card-content">
          <view class="card-title">地址管理</view>
          <view class="card-desc">管理收货地址</view>
        </view>
        <uni-icons type="right" size="16" color="#ccc" />
      </view>
    </view>

    <!-- 服务功能区域 -->
    <view class="service-functions">
      <view class="section-title">服务与帮助</view>

      <view class="function-card" @click="navigateToCustomerService">
        <view class="card-icon">
          <uni-icons type="chat" size="24" color="#45b7d1" />
        </view>
        <view class="card-content">
          <view class="card-title">联系客服</view>
          <view class="card-desc">在线客服支持</view>
        </view>
        <uni-icons type="right" size="16" color="#ccc" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 订单功能导航
const navigateToOrders = (): void => {
  wx.navigateTo({
    url: '/subpackages/orders/index',
  })
}

// 地址管理功能导航
const navigateToAddress = (): void => {
  wx.navigateTo({
    url: '/subpackages/address/index',
  })
}

// 联系客服功能导航
const navigateToCustomerService = (): void => {
  wx.navigateTo({
    url: '/subpackages/customer-service/index',
  })
}
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 0 24rpx 24rpx 24rpx;

  .main-functions {
    margin-bottom: 32rpx;
  }

  .service-functions,
  .settings-functions {
    margin-bottom: 32rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 16rpx;
      padding-left: 8rpx;
    }
  }

  .function-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.12);
    }

    .card-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: 16rpx;
      background: rgba(0, 206, 201, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;

      .card-title {
        font-size: 32rpx;
        font-weight: 500;
        color: $uni-text-color;
        margin-bottom: 8rpx;
      }

      .card-desc {
        font-size: 24rpx;
        color: $uni-text-color-placeholder;
      }
    }
  }
}
</style>
