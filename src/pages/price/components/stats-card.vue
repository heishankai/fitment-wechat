<template>
  <view class="stats-card">
    <view class="stats-card-item">
      <uni-icons type="staff" color="#00cec9" size="24" />
      <view class="title">累计服务</view>
      <view class="value">10000+</view>
    </view>
    <view class="stats-card-item">
      <uni-icons custom-prefix="iconfont" type="icon-xunzhang" color="#00cec9" size="24" />
      <view class="title">专业工匠</view>
      <view class="value">500+</view>
    </view>
    <view class="stats-card-item">
      <uni-icons
        custom-prefix="iconfont"
        type="icon-tubiaoshangshengqushi"
        color="#00cec9"
        size="24"
      />
      <view class="title">满意度</view>
      <view class="value">98%</view>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.stats-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px 16px 16px;
  gap: 16px;

  .stats-card-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: rgba(#00cec9, 0.1);
    border-radius: 14px;
    padding: 10px;

    .title {
      font-size: 14px;
      font-weight: 400;
      color: #717182;
    }

    .value {
      font-size: 24px;
      font-weight: 600;
      color: #00cec9;
    }
  }
}
</style>
