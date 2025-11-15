<template>
  <view class="swiper-header">
    <view
      class="custom-navbar"
      :class="{ 'navbar-scrolled': isScrolled }"
      :style="{ paddingTop: safeArea.top + 'px' }"
    >
      <view class="navbar-content">
        <view class="address" @click="navigateToCityList">
          <view class="icon-wrapper" :class="{ 'icon-dark': isScrolled }">
            <uni-icons type="location" :color="isScrolled ? '#333' : '#fff'" size="18" />
          </view>
          <text :class="{ 'text-dark': isScrolled }">{{ city_name }}</text>
        </view>
        <view class="title" :class="{ 'text-dark': isScrolled }">叮当智装</view>
        <view class="placeholder"></view>
      </view>
    </view>
    <!-- 轮播图 -->
    <!-- 只在有数据时才渲染swiper，避免初始化闪动 -->
    <view v-if="swiperList.length === 0" class="swiper-placeholder">
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

// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()

const current = ref(0)
const city_name = ref('杭州市')
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

// 加载城市信息
const loadCity = (): void => {
  city_name.value = wx.getStorageSync('selectedCity')?.city_name ?? '杭州市'
}

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

// 跳转城市选择页面
const navigateToCityList = (): void => {
  wx.navigateTo({
    url: '/subpackages/city-list/index',
  })
}

onLoad(() => {
  loadSwiperList()
})

onShow(() => {
  loadCity()
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

  .custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    color: #fff;
    padding: 0px 12px 0px 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    &.navbar-scrolled {
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 42px;
      line-height: 42px;
    }

    .address {
      gap: 2px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #fff;
      transition: color 0.3s ease;

      .icon-wrapper {
        transition: color 0.3s ease;
        color: #fff;

        &.icon-dark {
          color: #333;
        }
      }

      .text-dark {
        color: #333;
      }
    }

    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      transition: color 0.3s ease;

      &.text-dark {
        color: #333;
      }
    }

    .placeholder {
      width: 100px;
    }
  }

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
