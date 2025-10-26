<template>
  <view class="container">
    <!-- 顶部自定义导航栏 -->
    <custom-navbar />

    <!-- 搜索框 -->
    <view class="search-section">
      <view class="search-box">
        <uni-icons type="search" size="18" color="#999" />
        <input
          v-model="searchKeyword"
          placeholder="搜索工种、服务内容..."
          class="search-input"
          @input="onSearchInput"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <uni-icons type="clear" size="16" color="#999" />
        </view>
      </view>
    </view>
    <!-- 统计卡片 -->
    <stats-card />

    <!-- 工种列表 -->
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
      @scroll="onScroll"
    >
      <work-list ref="workListRef" />
    </scroll-view>
    <contact-service :scrollTop="scrollTop"/>
    <tabbar selected="1"></tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from 'lodash-es'
// components
import tabbar from '@/components/custom-tab-bar.vue'
import customNavbar from './components/custom-navbar.vue'
import statsCard from './components/stats-card.vue'
import workList from './components/work-list.vue'
import contactService from '@/components/contact-service.vue'
// 滚动到底部事件
const onScrolltolower = (): void => {
  workListRef.value?.getMore()
}

const searchKeyword = ref('')
const workListRef = ref<any>()
const scrollTop = ref<number>(0)
// 当前下拉刷新状态
const isTriggered = ref(false)

// 搜索输入处理
const onSearchInput = (e: any): void => {
  const value = e.detail.value
  searchKeyword.value = value
  
  // 如果输入框为空，重置数据
  if (!value.trim()) {
    workListRef.value?.resetData()
    workListRef.value?.loadWorkList()
    return
  }
  
  // 使用防抖搜索
  debouncedSearch()
}

// 防抖搜索函数
const debouncedSearch = debounce(() => {
  workListRef.value?.resetData()
  workListRef.value?.loadWorkList(searchKeyword.value)
}, 500)

// 清空搜索
const clearSearch = (): void => {
  searchKeyword.value = ''
  workListRef.value?.resetData()
  workListRef.value?.loadWorkList()
}

// 自定义下拉刷新被触发
const onRefresherrefresh = async (): Promise<void> => {
  // 开始动画
  isTriggered.value = true

  // 重置工种列表数据
  workListRef.value?.resetData()
  await workListRef.value?.loadWorkList()

  // 关闭动画
  isTriggered.value = false
}

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}

onLoad(() => {
  // 页面加载时，工种列表组件会自动加载数据
})
</script>

<style lang="scss">
/* 主题色 */
$primary-color: #00cec9;
$text-primary: #333;
$text-secondary: #666;
$text-muted: #999;
$bg-primary: #f8f9fa;
$bg-card: #ffffff;
$border-color: #e9ecef;

page {
  height: 100%;
  overflow: hidden;
  background: $bg-card;
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

/* 搜索框 */
.search-section {
  padding: 16px;
  background: #fff;

  .search-box {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 12px 16px;
    gap: 8px;

    .search-input {
      flex: 1;
      font-size: 14px;
      color: $text-primary;
      background: transparent;
      border: none;
      outline: none;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ddd;
    }
  }
}
</style>
