<template>
  <view class="container">
    <scroll-view
      class="scroll-view"
      scroll-y
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      :scroll-with-animation="true"
      :enable-flex="true"
    >
      <address-list ref="guessRef" />
    </scroll-view>
    <view class="bottom-bar">
      <button class="save-btn" @click="addAddress">添加地址</button>
    </view>
  </view>
</template>

<script setup lang="ts">
// utils
import { useGuessList } from '@/utils'
import AddressList from './components/address-list.vue'

// 组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()

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

const addAddress = (): void => {
  wx.navigateTo({
    url: '/subpackages/address-form/index',
  })
}

onShow(() => {
  guessRef.value?.resetData()
  guessRef.value?.getMore()
})
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

.bottom-bar {
  padding: 24rpx;
  background: #fff;
  border-top: 1rpx solid #eee;

  .save-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 44rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      border: none;
    }

    &[disabled] {
      background: #ccc;
      color: #999;
    }
  }
}
</style>
