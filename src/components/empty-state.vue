<template>
  <view class="empty-state">
    <uni-icons type="shop" size="60" color="#00cec9" />
    <text>暂无数据</text>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0px;
  color: #999;
  font-size: 16px;
  gap: 12px;
}
</style>
