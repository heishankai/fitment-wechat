<template>
  <view class="container">
    <!-- 可滚动的内容区域 -->
    <scroll-view class="scroll-view" scroll-y @scroll="onScroll" @scrolltolower="onScrollToLower">
      <!-- 轮播图 -->
      <swiper-header ref="swiperHeaderRef" />
      <!-- 计算价格 -->
      <calculate-price />
      <!-- 1元验房 -->
      <view class="verification-section">
        <view class="verification-btn" @click="goToVerification">
          <text class="verification-text">{{ verificationBtnTitle }}</text>
        </view>
      </view>
      <!-- 推荐案例 -->
      <view class="section-title">推荐案例</view>
      <case-list ref="caseListRef" />
    </scroll-view>
    <contact-service :scrollTop="scrollTop" />
  </view>
</template>

<script setup lang="ts">
import swiperHeader from './components/swiper-header.vue'
import calculatePrice from './components/calculate-price.vue'
import caseList from './components/case-list.vue'
import contactService from '@/components/contact-service.vue'
import { getButtonTitleService } from './service'

// 获取组件的引用
const swiperHeaderRef = ref()
const caseListRef = ref()
const scrollTop = ref<number>(0)

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

// 跳转到1元验房页面
const goToVerification = (): void => {
  uni.navigateTo({
    url: '/subpackages/verification/index',
  })
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
})
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

.verification-section {
  padding: 20rpx;
}

.verification-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.verification-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.3);
}

.verification-text {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.section-title {
  padding: 16rpx;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}
</style>
