<template>
  <view>
    <transition name="fade-slide">
      <view v-if="visible" class="contact-service" @click="handleContactService">
        <view class="contact-card" :class="{ 'is-collapsed': collapsed }">
          <!-- 头像 -->
          <view class="avatar">
            <image :src="avatarUrl" mode="aspectFill" class="avatar-image" />
            <view class="online-indicator"></view>
          </view>

          <!-- 文本 -->
          <view v-if="!collapsed" class="content">
            <text class="title">{{ title }}</text>
            <text class="subtitle">{{ subtitle }}</text>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  avatarUrl?: string
  url?: string
  scrollTop?: number // ✅ 新增：由父组件传入页面滚动值
}

const props = withDefaults(defineProps<Props>(), {
  title: '在线咨询',
  subtitle: '家装顾问',
  avatarUrl:
    'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1761469415017_rsphlq_FAjuAgoU7jdB31cda42cf9a444f4b52822fde259a12e.png',
  url: '/subpackages/customer-service/index',
  scrollTop: 0,
})

const visible = ref(true)
const collapsed = ref(false)
let lastScrollTop = 0
let hideTimer: any = null

/** 点击客服按钮 */
const handleContactService = (): void => {
  wx.navigateTo({ url: props.url })
}

/** 根据 scrollTop 判断展开或收起 */
watch(
  () => props.scrollTop,
  (scrollTop) => {
    const delta = scrollTop - lastScrollTop

    if (delta > 10) {
      // 向下滚动 → 收起
      collapsed.value = true
    } else if (delta < -10) {
      // 向上滚动 → 展开
      collapsed.value = false
    }

    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      collapsed.value = false
    }, 500)

    lastScrollTop = scrollTop
  },
)
</script>

<style scoped lang="scss">
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(60rpx);
}

.contact-service {
  position: fixed;
  right: 24rpx;
  bottom: calc(8vh + env(safe-area-inset-bottom));
  z-index: 999;
}

.contact-card {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.88);
  border-radius: 60rpx;
  padding: 16rpx 22rpx;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  overflow: hidden;

  &.is-collapsed {
    width: 80rpx;
    padding: 10rpx;
    border-radius: 50%;
    justify-content: center;
  }
}

.avatar {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16rpx;
  flex-shrink: 0;
  border: 2rpx solid rgba(0, 206, 201, 0.15);

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .online-indicator {
    position: absolute;
    bottom: 4rpx;
    right: 4rpx;
    width: 14rpx;
    height: 14rpx;
    background-color: #00cec9;
    border: 2rpx solid #fff;
    border-radius: 50%;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
  }

  .subtitle {
    font-size: 22rpx;
    color: #666;
    margin-top: 4rpx;
  }
}
</style>
