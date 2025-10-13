<template>
  <view class="container">
    <view class="custom-navbar" :style="{ paddingTop: safeArea.top + 4 + 'px' }">
      <view class="address" @click="navigateToCityList">
        <text>{{ selectedCity }}</text>
        <uni-icons type="down" color="#fff" size="18" />
      </view>
      <describe-header />
    </view>
    <view class="case-header">
      <view class="title">装修案例</view>
      <view class="tabs">
        <view class="tab" :class="{ active: activeTab === 0 }" @click="switchTab(0)">
          全部案例
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
import describeHeader from './components/describe-header.vue'
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

/* 主题色变量 */
$primary-color: #00cec9;
$secondary-color: #00cec9;
$accent-color: #00a8cc;

.custom-navbar {
  color: #fff;
  padding: 0px 12px 12px 0px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  /* 主题渐变背景 */
  background: linear-gradient(
    135deg,
    $primary-color 0%,
    $secondary-color 25%,
    $accent-color 50%,
    $primary-color 75%,
    $secondary-color 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 12s ease-in-out infinite;
  
  /* 水彩纹理层 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
      radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  
  /* 闪烁效果层 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 15% 25%, rgba(255, 215, 0, 0.6) 1px, transparent 1px),
      radial-gradient(circle at 75% 15%, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
      radial-gradient(circle at 35% 75%, rgba(255, 215, 0, 0.4) 1px, transparent 1px),
      radial-gradient(circle at 85% 65%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
      radial-gradient(circle at 55% 45%, rgba(255, 215, 0, 0.5) 1px, transparent 1px),
      radial-gradient(circle at 25% 85%, rgba(255, 255, 255, 0.7) 1px, transparent 1px);
    background-size: 200rpx 200rpx, 150rpx 150rpx, 180rpx 180rpx, 160rpx 160rpx, 170rpx 170rpx, 190rpx 190rpx;
    animation: sparkleMove 6s linear infinite;
    pointer-events: none;
  }

  .address {
    margin-left: 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 6px 16px;
    display: inline-flex;
    align-items: center;
    width: fit-content;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    height: 32px;
    box-sizing: border-box;

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }

    text {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      margin-right: 6px;
      line-height: 1;
    }
  }
}

.case-header {
  margin: 20px 12px 0 12px;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 16px;
    padding-left: 4px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 4px;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #00cec9, #00b4d8);
      border-radius: 2px;
    }
  }

  .tabs {
    display: flex;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 206, 201, 0.1);
    position: relative;

    .tab {
      flex: 1;
      padding: 12px 16px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-radius: 8px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
        box-shadow: 0 6px 20px rgba(0, 206, 201, 0.4);
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

.case-list {
  padding: 24px 12px;
  background: #f8f9fa;

  .case-item {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);

    .case-image {
      position: relative;
      width: 100%;
      height: 200px;

      .image {
        width: 100%;
        height: 100%;
      }

      .case-tag {
        position: absolute;
        top: 12px;
        left: 12px;
        background: #00cec9;
        color: #fff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.old {
          background: #f5f5f5;
          color: #666;
        }
      }
    }

    .case-info {
      padding: 16px;

      .case-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 6px;
        line-height: 1.3;
      }

      .case-desc {
        font-size: 13px;
        color: #999;
        line-height: 1.2;
      }
    }
  }
}

/* 动画关键帧 */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes sparkleMove {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10rpx, -5rpx); }
  50% { transform: translate(-5rpx, 10rpx); }
  75% { transform: translate(5rpx, -8rpx); }
}

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
