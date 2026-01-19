<template>
  <uni-popup ref="popupRef" type="center" :z-index="9999" mask-background-color="rgba(0,0,0,0.55)">
    <view class="popup-wrapper">
      <!-- Swiper -->
      <swiper class="swiper" :circular="false" :indicator-dots="false" previous-margin="40rpx" next-margin="40rpx"
        @change="onChange">
        <swiper-item v-for="item in activity_list" :key="item.id" class="swiper-item">
          <view class="card-wrapper">
            <view class="card">
              <view class="image-wrapper">
                <image class="product-image" :src="item.image" mode="scaleToFill" />
              </view>

              <view class="title-en">{{ item.title }}</view>
              <view class="title-sub">{{ item.description }}</view>

              <view class="btn" @click="handleAction(item)">{{ item.linkText }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <!-- 指示器 -->
      <view class="indicator">
        <view v-for="(_, index) in activity_list" :key="index" class="bar" :class="{ active: index === current }" />
      </view>

      <!-- 关闭 -->
      <view class="close" @click="close">
        <uni-icons type="closeempty" size="20" color="#fff" />
      </view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { getActivityListService } from '../service'

interface ActivityItem {
  id: number
  title: string
  description: string
  image: string
  linkText: string
  linkUrl: string
  createdAt: string
  updatedAt: string
}

const popupRef = ref<any>(null)
const current = ref<number>(0)
const activity_list = ref<ActivityItem[]>([])

// 存储键名
const STORAGE_KEY = 'activity_popup_last_show_date'

const onChange = (e: { detail: { current: number } }): void => {
  current.value = e.detail.current
}

const close = (): void => {
  popupRef.value?.close()
}

/**
 * 检查今天是否已经显示过弹窗
 * @returns true 表示今天已显示过，false 表示今天未显示过
 */
const hasShownToday = (): boolean => {
  try {
    const lastShowDate = uni.getStorageSync(STORAGE_KEY)
    const today = dayjs().format('YYYY-MM-DD')
    return lastShowDate === today
  } catch (error) {
    console.error('检查弹窗显示记录失败:', error)
    return false
  }
}

/**
 * 记录今天已显示弹窗
 */
const markAsShownToday = (): void => {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    uni.setStorageSync(STORAGE_KEY, today)
  } catch (error) {
    console.error('保存弹窗显示记录失败:', error)
  }
}

const loadActivityList = async (): Promise<void> => {
  // 检查今天是否已经显示过
  if (hasShownToday()) {
    return
  }

  const { success, data } = await getActivityListService()
  if (success && data) {
    activity_list.value = data
    popupRef.value?.open()
    // 标记今天已显示
    markAsShownToday()
  }
}

const handleAction = (item: ActivityItem): void => {
  if (item?.linkUrl) {
    // 可以在这里添加跳转逻辑，例如：
    wx.navigateTo({ url: item?.linkUrl })
  }
}

onMounted(() => {
  loadActivityList()
})
</script>

<style scoped lang="scss">
.popup-wrapper {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* swiper */
  .swiper {
    width: 100%;
    height: 820rpx;
  }

  /* swiper-item 内容 */
  .card-wrapper {
    height: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    .card {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 36rpx;
      padding-bottom: 40rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      /* 图片 */
      .image-wrapper {
        width: 100%;
        height: 488rpx;
        border-radius: 36rpx 36rpx 0 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        .product-image {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      /* 文案 */
      .title-en {
        margin-top: 40rpx;
        font-size: 40rpx;
        font-weight: 700;
        letter-spacing: 6rpx;
      }

      .title-sub {
        padding: 0 30rpx;
        margin-top: 12rpx;
        font-size: 28rpx;
        color: #666;
      }

      /* 按钮 */
      .btn {
        margin: 24rpx 0;
        width: 280rpx;
        padding: 20rpx 0;
        line-height: 28rpx;
        // background: #000;
        background: #00cec9;
        color: #fff;
        border-radius: 34rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  /* 指示器 */
  .indicator {
    margin-top: 24rpx;
    display: flex;
    gap: 12rpx;

    .bar {
      width: 24rpx;
      height: 6rpx;
      border-radius: 3rpx;
      background: rgba(255, 255, 255, 0.4);
      transition: all 0.3s;

      &.active {
        width: 40rpx;
        background: #fff;
      }
    }
  }

  /* 关闭按钮 */
  .close {
    margin-top: 32rpx;
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
