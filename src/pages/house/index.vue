<template>
  <view class="container">
    <!-- 可滚动的内容区域 -->
    <scroll-view class="scroll-view" scroll-y @scroll="onScroll" @scrolltolower="onScrollToLower">
      <!-- 轮播图 -->
      <swiper-header ref="swiperHeaderRef" />
      <!-- 计算价格 -->
      <calculate-price />
      <!-- 推荐案例 -->
      <view class="section-title">推荐案例</view>
      <case-list ref="caseListRef" />
    </scroll-view>
    <tabbar selected="2"></tabbar>
  </view>
</template>

<script setup lang="ts">
// components
import tabbar from '@/components/custom-tab-bar.vue'
import swiperHeader from './components/swiper-header.vue'
import calculatePrice from './components/calculate-price.vue'
import caseList from './components/case-list.vue'

// 获取组件的引用
const swiperHeaderRef = ref()
const caseListRef = ref()

// 处理滚动事件
const onScroll = (e: any): void => {
  // 将滚动事件传递给 swiper-header 组件
  swiperHeaderRef.value?.handleScroll(e)
}

// 处理滚动到底部
const onScrollToLower = (): void => {
  // 加载更多案例
  caseListRef.value?.getMore()
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

.section-title {
  padding: 16rpx;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}
</style>
