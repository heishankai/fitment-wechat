<template>
  <view class="container">
    <view class="custom-navbar" :style="{ paddingTop: safeArea.top + 'px' }">
      <view class="address" @click="navigateToCityList">
        <uni-icons type="location" color="#fff" size="18" />
        <text>{{ city_name }}</text>
      </view>
    </view>

    <case-tabs :selected-tab="activeTab" @switch-tab="handleTabSwitch" />

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
      <case-list
        ref="guessRef"
        :key="`case-list-${activeTab}`"
        class="case-list-wrapper"
        :city_name="city_name"
      />
    </scroll-view>
    <tabbar selected="0"></tabbar>
  </view>
</template>

<script setup lang="ts">
// components
import tabbar from '@/components/custom-tab-bar.vue'
import caseList from './components/case-list.vue'
import caseTabs from './components/tabs.vue'
// utils
import { useGuessList } from '@/utils'

// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()

// 组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()

// 响应式数据
const isTriggered = ref(false)
const activeTab = ref('0')
const city_name = ref('')

// 加载城市信息
const loadCity = (): void => {
  city_name.value = wx.getStorageSync('selectedCity')?.city_name ?? '杭州市'
}

// 切换标签页
const handleTabSwitch = (tabIndex: string, remodelType: number | null): void => {
  activeTab.value = tabIndex
  // 通知 case-list 组件进行筛选
  guessRef.value?.switchFilter(remodelType)
}

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

// 跳转城市选择页面
const navigateToCityList = (): void => {
  wx.navigateTo({
    url: '/subpackages/city-list/index',
  })
}

// 页面显示时加载城市信息
onShow(() => {
  loadCity()
  // 重新加载数据
  guessRef.value?.resetData()
  guessRef.value?.getMore()
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
