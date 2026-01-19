<template>
  <view class="renovation-cards">
    <!-- 新房装修 -->
    <view class="renovation-card new-house-card" @click="handleNewHouseClick">
      <view class="card-icons">
        <view class="icon-circle">
          <uni-icons type="home" size="24" color="#fff" />
        </view>
      </view>
      <text class="card-title">新房装修</text>
      <text class="card-desc">从零开始·打造专属理想家</text>
      <view class="card-action">
        <view class="action-btn">
          <text class="action-text">免费获取报价</text>
          <view class="action-dot"></view>
        </view>
        <uni-icons type="arrow-right" size="18" color="#fff" />
      </view>
    </view>

    <!-- 旧房改造 -->
    <view class="renovation-card old-house-card" @click="handleOldHouseClick">
      <view class="card-icons">
        <view class="icon-circle">
          <uni-icons custom-prefix="iconfont" type="icon-chuizi" size="24" color="#fff" />
        </view>
      </view>
      <text class="card-title">旧房改造</text>
      <text class="card-desc">焕新升级·让老房重获新生</text>
      <view class="card-action">
        <view class="action-btn">
          <text class="action-text">免费获取报价</text>
          <view class="action-dot"></view>
        </view>
        <uni-icons type="arrow-right" size="18" color="#fff" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 处理新房装修点击
const handleNewHouseClick = (): void => {
  wx.navigateTo({
    url: `/subpackages/renovation-form/index?houseType=new`,
  })
}

// 处理旧房改造点击
const handleOldHouseClick = (): void => {
  wx.navigateTo({
    url: `/subpackages/renovation-form/index?houseType=old`,
  })
}
</script>

<style scoped lang="scss">
.renovation-cards {
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  margin-top: 0;
}

.renovation-card {
  position: relative;
  flex: 1;
  padding: 32rpx 24rpx;
  border-radius: 24rpx;
  overflow: hidden;
  min-height: 280rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.new-house-card {
  margin-right: 20rpx;
  background: linear-gradient(135deg, #00cec9 0%, #00a8a3 100%);
}

.old-house-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-icons {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.icon-circle {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.icon-text {
  font-size: 28rpx;
}

.card-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.card-desc {
  display: block;
  font-size: 24rpx;
  color: #fff;
  opacity: 0.9;
  margin-bottom: 24rpx;
  line-height: 1.4;
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 16rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 40rpx;
  backdrop-filter: blur(10rpx);
  flex: 1;
}

.action-text {
  font-size: 22rpx;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

.action-dot {
  width: 8rpx;
  height: 8rpx;
  background: #fff;
  border-radius: 50%;
}
</style>
