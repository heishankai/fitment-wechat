<template>
  <view class="swiper-header">
    <!-- 轮播图 -->
    <view v-if="!swiperList?.length" class="swiper-placeholder">
      <view class="placeholder-content">
        <uni-icons type="image" size="40" color="#ddd" />
      </view>
    </view>
    <swiper
      v-else
      class="swiper"
      :current="current"
      :indicator-dots="false"
      :autoplay="true"
      :circular="true"
      :duration="500"
      :interval="3000"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(image, index) in swiperList" :key="index">
        <image
          class="carousel-image"
          :src="image"
          mode="scaleToFill"
          :lazy-load="true"
          @click="handlePreviewCarouselImage(index)"
          @load="onImageLoad"
        />
      </swiper-item>
    </swiper>

    <!-- 自定义指示点 -->
    <view v-if="swiperList.length > 0" class="custom-dots">
      <view
        v-for="(image, index) in swiperList"
        :key="index"
        class="dot"
        :class="{ active: current === index }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { previewImage } from '@/utils'
import { getSwiperListService } from '../service'

const current = ref(0)
const isScrolled = ref(false)
const swiperList = ref<string[]>([])
const imageLoaded = ref(false) // 图片加载状态

// 监听页面滚动
const handleScroll = (e: any): void => {
  const scrollTop = e.detail.scrollTop
  // 当滚动超过轮播图高度的一半时，改变 navbar 样式
  const threshold = 100 // 可以根据实际轮播图高度调整
  isScrolled.value = scrollTop > threshold
}

// 暴露方法给父组件
defineExpose({
  handleScroll,
})

// swiper 切换事件
const onSwiperChange = (e: any): void => {
  const newCurrent = e.detail.current
  if (current.value !== newCurrent) {
    current.value = newCurrent
  }
}

// 图片加载完成处理
const onImageLoad = (): void => {
  if (!imageLoaded.value) {
    imageLoaded.value = true
  }
}

// 点击图片预览
const handlePreviewCarouselImage = (index: number): void => {
  previewImage(
    swiperList.value[index] || '',
    swiperList.value.map((item: string) => item),
  )
}

// 加载轮播图
const loadSwiperList = async (): Promise<void> => {
  try {
    const { success, data } = await getSwiperListService()
    if (success && data?.swiper_image?.length) {
      // 一次性更新数据，避免多次渲染导致闪动
      swiperList.value = data.swiper_image
      // 重置到第一张
      current.value = 0
      imageLoaded.value = false
    }
  } catch (error) {
    console.error('加载轮播图失败:', error)
  }
}

onLoad(() => {
  loadSwiperList()
})
</script>

<style lang="scss">
.swiper-header {
  width: 100%;
  height: 760rpx; // 使用固定rpx单位，避免vh在微信小程序中的兼容性问题
  min-height: 760rpx; // 确保最小高度
  background-color: #fff;
  position: relative;
  overflow: hidden; // 防止内容溢出导致闪烁

  // 占位内容
  .swiper-placeholder {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;

    .placeholder-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .swiper {
    width: 100%;
    height: 100%;
    // 防止swiper在scroll-view中闪动
    will-change: transform;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    display: block;
    // 使用aspectFill模式时，确保图片正确显示
    object-fit: cover;
    // 防止图片加载时的闪烁
    background-color: #f5f5f5;
    // 硬件加速
    will-change: transform;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  /* 自定义指示点 */
  .custom-dots {
    position: absolute;
    bottom: 24rpx;
    right: 24rpx;
    display: flex;
    align-items: center;

    .dot {
      width: 16rpx;
      height: 8rpx;
      border-radius: 4rpx;
      background-color: rgba(255, 255, 255, 0.5);
      margin: 0 6rpx;
      transform: scale(1);
      transition: all 0.3s ease;
    }

    .dot.active {
      width: 32rpx;
      background-color: #00cec9;
      transform: scale(1.2);
    }
  }
}
</style>
