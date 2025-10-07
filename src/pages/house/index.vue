<template>
  <view class="container">
    <!-- <search-navbar :selectedTab="selectedTab" @updateSelectTab="updateSelectTab" /> -->
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
     我的房子
    </scroll-view>
    <tabbar selected="2"></tabbar>
    <custom-popup ref="subscribeModalRef" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// components
import tabbar from '@/components/custom-tab-bar.vue'
import { useGuessList } from '@/utils'

// 组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()

const subscribeModalRef = ref<any>()
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
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to bottom, #f0faf9, #b3e5dc, #b3e5dc);
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
