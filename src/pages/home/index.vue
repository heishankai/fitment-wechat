<template>
  <view class="container">
    <view class="custom-navbar" :style="{ paddingTop: safeArea.top + 'px' }">
      <view class="address" @click="navigateToCityList">
        <uni-icons type="location" color="#fff" size="18" />
        <text>{{ selectedCity }}</text>
      </view>
    </view>

    <view class="case-header">
      <view class="tabs">
        <view class="tab" :class="{ active: activeTab === 0 }" @click="switchTab(0)">
          完工案例
        </view>
        <view class="tab" :class="{ active: activeTab === 1 }" @click="switchTab(1)">
          新房装修
        </view>
        <view class="tab" :class="{ active: activeTab === 2 }" @click="switchTab(2)">
          旧房改造
        </view>
      </view>
    </view>

    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
      :scroll-with-animation="true"
      :enable-flex="true"
    >
      <view class="content-container" :class="{ 'content-transitioning': isContentTransitioning }">
        <case-list
          ref="guessRef"
          :selected-city="selectedCity"
          :key="`case-list-${activeTab}`"
          class="case-list-wrapper"
        />
      </view>
    </scroll-view>
    <tabbar selected="0"></tabbar>
  </view>
</template>

<script setup lang="ts">
// components
import tabbar from '@/components/custom-tab-bar.vue'
import caseList from './components/case-list.vue'
// utils
import { useGuessList } from '@/utils'

// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()

// 组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()

// 响应式数据
const isTriggered = ref(false)
const activeTab = ref(0)
const isContentTransitioning = ref(false)
// 当前选中的城市
const selectedCity = ref('杭州')

// 标签页配置
const TAB_CONFIG = [
  { key: 0, name: '全部案例', remodelType: null },
  { key: 1, name: '新房装修', remodelType: 1 },
  { key: 2, name: '旧房改造', remodelType: 2 },
] as const

// 切换标签页
const switchTab = async (tabIndex: number): Promise<void> => {
  if (activeTab.value === tabIndex) return

  // 开始内容切换动画
  isContentTransitioning.value = true

  // 延迟切换tab状态，让动画更流畅
  setTimeout(() => {
    activeTab.value = tabIndex
    const currentTab = TAB_CONFIG[tabIndex]

    // 通知 case-list 组件切换筛选条件
    guessRef.value?.switchFilter(currentTab.remodelType)

    // 结束内容切换动画
    setTimeout(() => {
      isContentTransitioning.value = false
    }, 150)
  }, 100)
}

// 自定义下拉刷新被触发
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true

  // 重置数据并重新加载
  guessRef.value?.resetData()

  await guessRef.value?.getMore()

  isTriggered.value = false
}

// 跳转城市选择页面
const navigateToCityList = (): void => {
  wx.navigateTo({
    url: '/subpackages/city-list/index',
  })
}

// 从本地存储加载选中的城市
const loadSelectedCity = (): void => {
  const city = wx.getStorageSync('selectedCity')
  if (city && city.city_name) {
    selectedCity.value = city.city_name
  }

  console.log(city, 'city')
}

// 页面显示时检查城市更新
onShow(() => {
  loadSelectedCity()
})
</script>

<style lang="scss">
/* 主题色变量 */
$primary-color: #00cec9;
$secondary-color: #00b4d8;
$accent-color: #00a8cc;

page {
  height: 100%;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  height: 0; /* 确保 flex 子元素有正确的高度 */
}

/* 内容容器动画 */
.content-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);

  &.content-transitioning {
    opacity: 0.7;
    transform: translateY(10px);
  }
}

.case-list-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.4s ease-out;
}

.custom-navbar {
  color: #fff;
  padding: 0px 12px 0px 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, $primary-color, $secondary-color);

  .address {
    gap: 2px;
    display: flex;
    align-items: center;
    height: 44px; /* 与微信胶囊按钮高度保持一致 */
    line-height: 44px;
    font-size: 16px;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      opacity: 0.8;
    }
  }
}

.case-header {
  margin: 12px;

  .tabs {
    display: flex;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba($primary-color, 0.1);
    position: relative;

    .tab {
      flex: 1;
      padding: 12px 16px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;
      position: relative;
      z-index: 2;
      cursor: pointer;
      transform: scale(1);

      &:hover {
        transform: scale(1.02);
        color: #495057;
      }

      &.active {
        background: linear-gradient(135deg, $primary-color, $secondary-color);
        color: #fff;
        font-weight: 600;
        box-shadow: 0 6px 20px rgba($primary-color, 0.4);
        transform: scale(1.05);
        z-index: 3;

        &::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, $primary-color, $secondary-color);
          border-radius: 10px;
          z-index: -1;
          opacity: 0.3;
          filter: blur(8px);
        }
      }
    }
  }
}

/* 动画关键帧 */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
