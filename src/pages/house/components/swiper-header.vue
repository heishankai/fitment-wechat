<template>
  <view class="swiper-header">
    <view
      class="custom-navbar"
      :class="{ 'navbar-scrolled': isScrolled }"
      :style="{ paddingTop: safeArea.top + 'px' }"
    >
      <view class="navbar-content">
        <view class="address">
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
    <swiper
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
          @click="handlePreviewCarouselImage(index)"
        />
      </swiper-item>
    </swiper>

    <!-- 自定义指示点 -->
    <view class="custom-dots">
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

// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()

const current = ref(0)
const city_name = ref('杭州市')
const isScrolled = ref(false)
const swiperList = ref([
  'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1761400451663_fftrq5_DyizCwLSzUmZ4997263b4aa81bef19a14dffccff1587.png',
  'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1761400474176_lox43t_CXPFQu8evhwUb5e0942ed9f1a1f583206eb02e7880f4.png',
  'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1761400488042_f5k6zf_rPQgwS3qQe3z93f8db9e1adc88f8f2c7e4c31341484a.png',
])

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
  current.value = e.detail.current
}

// 点击图片预览
const handlePreviewCarouselImage = (index: number): void => {
  previewImage(
    swiperList.value[index] || '',
    swiperList.value.map((item: string) => item),
  )
}

onShow(() => {
  loadCity()
})
</script>

<style lang="scss">
.swiper-header {
  width: 100%;
  height: 55vh;
  background-color: #fff;
  position: relative;

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

  .swiper {
    width: 100%;
    height: 100%;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
