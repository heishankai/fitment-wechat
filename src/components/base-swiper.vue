<template>
  <view v-if="list?.length" class="swiper-wrapper">
    <swiper class="swiper" :current="innerCurrent" :autoplay="autoplay" :interval="interval" :duration="duration"
      :circular="circular" :vertical="vertical" :easing-function="easingFunction" :disable-touch="disableTouch"
      :indicator-dots="false" @animationfinish="handleChange">
      <swiper-item v-for="(item, index) in list" :key="index" class="swiper-item">
        <image class="image" :src="item" mode="scaleToFill" @click="handleClick(index)" />
      </swiper-item>
    </swiper>

    <!-- Dot -->
    <view v-if="showDots && list?.length > 1" class="dots">
      <view v-for="(_, index) in list" :key="index" class="dot" :class="{ active: innerCurrent === index }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { previewImage } from '@/utils'
import type { SwiperEasingFunction } from '@uni-helper/uni-app-types'

interface Props {
  list: string[]

  current?: number
  autoplay?: boolean
  interval?: number
  duration?: number
  circular?: boolean
  vertical?: boolean
  easingFunction?: SwiperEasingFunction
  disableTouch?: boolean

  showDots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],

  current: 0,
  autoplay: true,
  interval: 4000,
  duration: 500,
  circular: true,
  vertical: false,
  easingFunction: 'default',
  disableTouch: false,

  showDots: true,
})

/**
 * 内部 current
 * - 支持外部受控
 * - 同步 swiper change
 */
const innerCurrent = ref(props.current)

watch(
  () => props.current,
  (val) => {
    innerCurrent.value = val
  },
)

watch(
  () => props.list,
  () => {
    innerCurrent.value = 0
  },
)

const handleChange = (e: any): void => {
  innerCurrent.value = e.detail.current
}

const handleClick = (index: number): void => {
  previewImage(props.list[index], props.list)
}
</script>

<style lang="scss" scoped>
.swiper-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
}

.dots {
  position: absolute;
  bottom: 48rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0;
}

.dot {
  // width: 16rpx;
  // height: 8rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 4rpx;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 6rpx;
  transform: scale(1);
  transition: all 0.3s ease;
}

.dot.active {
  // width: 32rpx;

  background-color: #fff;
  transform: scale(1.2);
}
</style>
