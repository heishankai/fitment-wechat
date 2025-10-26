<template>
  <view class="container">
    <!-- 可滚动的内容区域 -->
    <scroll-view class="scroll-view" scroll-y @scroll="onScroll">
      <!-- 轮播图 -->
      <swiper-header ref="swiperHeaderRef" />
      <!-- 计算价格 -->
      <calculate-price />
      <!-- 推荐案例 -->
      <view class="house-content"> 推荐案例 </view>
    </scroll-view>
    <tabbar selected="2"></tabbar>
  </view>
</template>

<script setup lang="ts">
// components
import tabbar from '@/components/custom-tab-bar.vue'
import swiperHeader from './components/swiper-header.vue'
import calculatePrice from './components/calculate-price.vue'

// 获取 swiper-header 组件的引用
const swiperHeaderRef = ref()

// 处理滚动事件
const onScroll = (e: any): void => {
  // 将滚动事件传递给 swiper-header 组件
  swiperHeaderRef.value?.handleScroll(e)
}
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.house-content {
  padding: 16rpx;
  background-color: #f8f9fa;
  min-height: 200px;
}
</style>
