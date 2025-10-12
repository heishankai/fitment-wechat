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
      <case-list ref="guessRef" :selected-city="selectedCity" />
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
// 当前选中的城市
const selectedCity = ref('杭州')

// 标签页配置
const TAB_CONFIG = [
  { key: 0, name: '全部案例', remodelType: null },
  { key: 1, name: '新房装修', remodelType: 1 },
  { key: 2, name: '旧房改造', remodelType: 2 },
] as const

// 切换标签页
const switchTab = (tabIndex: number): void => {
  if (activeTab.value === tabIndex) return

  activeTab.value = tabIndex
  const currentTab = TAB_CONFIG[tabIndex]

  // 通知 case-list 组件切换筛选条件
  guessRef.value?.switchFilter(currentTab.remodelType)
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

.custom-navbar {
  color: #fff;
  padding: 0px 12px 12px 0px;
  background: linear-gradient(135deg, #00cec9, #00b4d8);
  flex-direction: column;
  display: flex;

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

    .tab {
      flex: 1;
      padding: 12px 16px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      position: relative;
      z-index: 1;

      &.active {
        background: linear-gradient(135deg, #00cec9, #00b4d8);
        color: #fff;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 206, 201, 0.3);
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
</style>
