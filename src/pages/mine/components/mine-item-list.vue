<template>
  <view class="menu-container">
    <!-- 主要功能区域 -->
    <view class="main-functions">
      <function-card title="我的工地" desc="查看工地状态" icon-type="list" icon-color="#00cec9" url="/subpackages/orders/index" />

      <function-card title="地址管理" desc="管理收货地址" icon-type="location" icon-color="#4ecdc4"
        url="/subpackages/address/index" />
    </view>

    <!-- 服务功能区域 -->
    <view class="service-functions">
      <view class="section-title">服务与帮助</view>

      <function-card title="消息列表" desc="查看消息通知" icon-type="chat" icon-color="#00cec9"
        url="/subpackages/message-list/index" />

      <function-card title="联系客服" desc="在线客服支持" icon-type="headphones" icon-color="#45b7d1"
        url="/subpackages/customer-service/index" />
    </view>
  </view>
</template>

<script setup lang="ts">
import functionCard from '@/components/function-card.vue'
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
}
</style>
