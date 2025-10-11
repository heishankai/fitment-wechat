<template>
  <view class="container">
    <view
      class="custom-navbar"
      :style="{
        paddingTop: safeArea.top + 8 + 'px',
      }"
    >
      <text>深圳</text>
      <uni-icons type="down" color="#fff" size="16" />
    </view>
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
      <uni-icons type="search" color="#00cec9" size="24" />
      <uni-icons custom-prefix="iconfont" type="icon-wushuju" color="#808080" size="100" />
    </scroll-view>
    <tabbar selected="0"></tabbar>
  </view>
</template>

<script setup lang="ts">
// components
import tabbar from '@/components/custom-tab-bar.vue'
import { useGuessList } from '@/utils'
import { getUserInfoService } from './service'

// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()
console.log(safeArea, 'safeArea')

// 组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()
// 当前下拉刷新状态
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

onLoad(() => {
  getUserInfoService().then((res) => {
    console.log('res', res)
  })
})
</script>

<style lang="scss">
page {
  height: 100%;
}

.custom-navbar {
  color: #fff;
  padding: 0px 12px 12px 0px;
  background: linear-gradient(135deg, #00cec9, #00b4d8);
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;

  text {
    padding-left: 12px;
  }
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
