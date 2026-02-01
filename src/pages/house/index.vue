<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y @scroll="onScroll" @scrolltolower="onScrollToLower">
      <!-- 轮播图 -->
      <view class="swiper-container">
        <base-swiper :list="swiper_image_list" />
      </view>

      <!-- 新房装修和旧房改造 -->
      <view class="renovation-wrapper">
        <renovation-cards />

        <!-- 往期案例 -->
        <view class="case-section">
          <text class="case-title">往期案例</text>
          <text class="case-desc">为您推荐优质装修案例</text>
        </view>
        <case-list ref="caseListRef" />
      </view>
    </scroll-view>
    <contact-service :scrollTop="scrollTop" />

    <!-- 首页弹窗 -->
    <activity-popup ref="activityPopupRef" />
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import BaseSwiper from '@/components/base-swiper.vue'
import caseList from './components/case-list.vue'
import contactService from '@/components/contact-service.vue'
import RenovationCards from './components/renovation-cards.vue'
import ActivityPopup from './components/activity-popup.vue'
import { getButtonTitleService, getSwiperListService } from './service'

// 获取组件的引用
const swiperHeaderRef = ref()
const caseListRef = ref()
const activityPopupRef = ref()
const scrollTop = ref<number>(0)
const swiper_image_list = ref<string[]>([])

// 加载轮播图
const loadSwiperList = async (): Promise<void> => {
  const { success, data } = await getSwiperListService()

  if (success) {
    swiper_image_list.value = (data || []).map((item: any) => item?.swiper_image)
  }
}
// 按钮标题
const verificationBtnTitle = ref<string>('1元验房')

// 处理滚动事件
const onScroll = (e: any): void => {
  // 将滚动事件传递给 swiper-header 组件
  swiperHeaderRef.value?.handleScroll(e)
  scrollTop.value = e.detail.scrollTop
}

// 处理滚动到底部
const onScrollToLower = (): void => {
  // 加载更多案例
  caseListRef.value?.getMore()
}

// 初始化按钮标题
const initVerificationBtnTitle = async (): Promise<void> => {
  const { success, data } = await getButtonTitleService()
  if (success) {
    verificationBtnTitle.value = data.title
  }
}

onLoad(() => {
  initVerificationBtnTitle()
  loadSwiperList()
})

onLoad(() => {
  // 每次进入首页时显示活动弹窗
  activityPopupRef.value?.showPopup()
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
}

.scroll-view {
  flex: 1;
  height: 0;
  overflow: hidden;
}

.swiper-container {
  width: 100%;
  height: 760rpx;
  min-height: 760rpx;
  margin-bottom: -40rpx;
  position: relative;
  z-index: 1;
}

.renovation-wrapper {
  background: #fff;
  position: relative;
  z-index: 2;
  padding-top: 20rpx;
  border-radius: 38rpx 38rpx 0 0;
  overflow: hidden;
}

.verification-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.3);
}

/* 精选案例 */
.case-section {
  padding: 40rpx 20rpx 20rpx;

  .case-title {
    display: block;
    font-size: 44rpx;
    font-weight: 700;
    color: #222;
    margin-bottom: 12rpx;
  }

  .case-desc {
    display: block;
    font-size: 28rpx;
    color: #999;
  }
}
</style>
