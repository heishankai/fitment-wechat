<template>
  <view class="welcome-container">
    <!-- 背景图 -->
    <image class="background-image" :src="welcomeInfo.background_image" mode="aspectFill" />

    <!-- 中间内容 -->
    <view class="content-container">
      <view class="logo-container">
        <image class="logo" :src="welcomeInfo.logo" mode="aspectFit" />
      </view>

      <text class="main-title">{{ welcomeInfo.title }}</text>
      <text class="subtitle">{{ welcomeInfo.subtitle }}</text>
    </view>

    <!-- 版权 -->
    <view class="copyright">
      <text class="copyright-text">{{ welcomeInfo.copyright }}</text>
    </view>

    <!-- 跳过 -->
    <view class="skip-button" @click="handleSkip">
      <text class="skip-text">跳过 {{ countdown }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import dayjs from 'dayjs'
import { onLoad } from '@dcloudio/uni-app'
import { getWelcomeInfoService } from './service'
import { useCountdown } from '@/hooks/useCountdown'

/** 本地存储 key */
const STORAGE_KEY = 'welcome_page_shown_date'

/** 欢迎页配置 */
const welcomeInfo = reactive({
  logo: '',
  background_image: '',
  title: '',
  subtitle: '',
  count_down: 5,
  copyright: '',
})

/** 获取今天日期 */
const getTodayDateString = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

/** 跳转首页 */
const navigateToHome = (): void => {
  try {
    uni.setStorageSync(STORAGE_KEY, getTodayDateString())
  } catch (e) {
    console.error('保存欢迎页展示记录失败', e)
  }

  uni.switchTab({
    url: '/pages/house/index',
  })
}

/** 使用倒计时 hook */
const { countdown, start, stop } = useCountdown({
  seconds: welcomeInfo.count_down,
  autoStart: false,
  onFinish: () => {
    navigateToHome()
  },
})

/** 跳过 */
const handleSkip = (): void => {
  stop()
  navigateToHome()
}

/** 获取欢迎页配置 */
const getWelcomeInfo = async (): Promise<void> => {
  try {
    const { data } = await getWelcomeInfoService()
    if (data) {
      Object.assign(welcomeInfo, {
        logo: data.logo || '',
        background_image: data.background_image || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        count_down: data.count_down || 5,
        copyright: data.copyright || '',
      })
    }
  } catch (error) {
    console.error('获取欢迎页配置失败', error)
  } finally {
    // 启动倒计时（无论接口成功失败）
    start()
  }
}

onLoad(() => {
  getWelcomeInfo()
})
</script>

<style lang="scss" scoped>
.welcome-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.content-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 40rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100%;
  height: 100%;
}

.main-title {
  font-size: 56rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #fff;
  opacity: 0.9;
}

.copyright {
  position: absolute;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
}

.copyright-text {
  font-size: 24rpx;
  color: #fff;
  opacity: 0.8;
}

.skip-button {
  position: absolute;
  right: 40rpx;
  bottom: 80rpx;
  padding: 16rpx 32rpx;
  border-radius: 50rpx;
  background: rgba(255, 255, 255, 0.3);
  border: 2rpx solid #fff;
  backdrop-filter: blur(10rpx);
}

.skip-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}
</style>
