<template>
  <card :show-bottom-margin="true">
    <section_header title="订单信息" color="#0a0a0a" :showBar="false" />

    <!-- 订单号 -->
    <view v-if="orderNo" class="order-no" @click="handleCopyOrderNo">
      <view class="order-no-content">
        <text class="order-no-label">订单号 <text class="copy-hint">点击复制</text></text>
        <view class="order-no-value-wrapper">
          <text class="order-no-value">{{ orderNo }}</text>
        </view>
      </view>
    </view>

    <view class="craftsman">
      <!-- Avatar -->
      <image class="avatar" :src="craftsman?.avatar" mode="aspectFill" />

      <!-- Info -->
      <view class="info">
        <text class="name">{{ craftsman?.nickname }}</text>

        <view class="meta">
          <view class="meta-item">
            <view class="icon-wrapper">
              <uni-icons type="phone" size="14" color="#00cec9" />
            </view>
            <text>{{ formatPhone(craftsman?.phone) }}</text>
          </view>
        </view>

        <view class="badges">
          <view v-if="craftsman?.isVerified" class="badge verified">
            <view class="badge-icon-wrapper">
              <uni-icons type="checkmarkempty" size="10" color="#fff" />
            </view>
            <text>实名认证</text>
          </view>

          <view v-if="craftsman?.isSkillVerified" class="badge skill">
            <view class="badge-icon-wrapper">
              <uni-icons type="checkmarkempty" size="10" color="#fff" />
            </view>
            <text>技能认证</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 施工进度（只展示第一组） -->
    <view v-if="firstProgress" class="construction-progress">
      <view class="progress-header">
        <view class="progress-title">
          <view class="progress-icon-wrapper">
            <uni-icons type="calendar" size="16" color="#00cec9" />
          </view>
          <text class="progress-title-text">最新施工进度</text>
        </view>
        <view class="view-more-btn" @click="handleViewAllProgress">
          <text>查看全部</text>
          <uni-icons type="right" size="12" color="#00cec9" />
        </view>
      </view>
      <view class="content-card">
        <!-- 日期和时间 -->
        <view class="date-time-row">
          <uni-icons type="calendar" size="14" color="#9ca3af" />
          <text class="date-time-text">
            {{
              formatDateTimeRange(
                firstProgress.start_time,
                firstProgress.end_time,
              )
            }}
          </text>
        </view>

        <!-- 地址 -->
        <view v-if="firstProgress?.location" class="location-row">
          <uni-icons type="location" size="14" color="#9ca3af" />
          <text class="location-text">{{ firstProgress.location }}</text>
        </view>

        <!-- 工作描述 -->
        <view v-if="firstProgress?.description" class="description">
          {{ firstProgress.description }}
        </view>

        <!-- 照片网格 -->
        <view v-if="firstProgress?.photos?.length" class="photos-grid">
          <view v-for="(photo, photoIndex) in getProgressPhotos(firstProgress.photos)" :key="photoIndex"
            class="photo-item" @click="handlePreviewImage(firstProgress.photos, photoIndex)">
            <image :src="photo" mode="aspectFill" class="photo-image" />
            <view v-if="photoIndex === 2 && firstProgress.photos.length > 3" class="photo-overlay">
              <text class="photo-count">+{{ firstProgress.photos.length - 3 }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import card from '@/components/custom-card.vue'
import section_header from '@/components/section-header.vue'
import { formatPhone, previewImage, formatDateTimeRange } from '@/utils'
import { getConstructionProgressByOrderId } from '../service'

const props = defineProps<{
  craftsman: {
    avatar?: string
    nickname?: string
    phone?: string
    city?: string
    isVerified?: boolean
    isSkillVerified?: boolean
  }
  orderId?: number | string
  orderNo?: string
}>()

const constructionProgress = ref<any[]>([])
const firstProgress = computed(() => {
  if (!constructionProgress.value || constructionProgress.value.length === 0) return null
  // 返回第一组数据（最新的）
  return constructionProgress.value[0]
})

// 加载施工进度
const loadConstructionProgress = async (): Promise<void> => {
  if (!props.orderId) return

  const { success, data } = await getConstructionProgressByOrderId(props.orderId)
  if (success && data && Array.isArray(data) && data.length > 0) {
    constructionProgress.value = data
  }
}

// 获取施工进度图片（最多3张）
const getProgressPhotos = (photos: string[]): string[] => {
  if (!photos || !Array.isArray(photos)) return []
  return photos.slice(0, 3)
}

// 预览图片
const handlePreviewImage = (urls: string[], currentIndex: number | string): void => {
  const index = typeof currentIndex === 'string' ? parseInt(currentIndex, 10) : currentIndex
  previewImage(urls[index], urls)
}

// 查看全部施工进度
const handleViewAllProgress = (): void => {
  uni?.vibrateShort()
  if (!props.orderId) return

  uni.navigateTo({
    url: `/subpackages/construction-progress/index?orderId=${props.orderId}`,
  })
}

// 复制订单号
const handleCopyOrderNo = (): void => {
  if (!props.orderNo) return

  uni.setClipboardData({
    data: props.orderNo,
    success: () => {
      uni.showToast({
        title: '订单号已复制',
        icon: 'none',
        duration: 2000,
      })
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'none',
      })
    },
  })
}

onMounted(() => {
  loadConstructionProgress()
})
</script>

<style lang="scss" scoped>
.order-no {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  background: linear-gradient(135deg, rgba(0, 206, 201, 0.05) 0%, rgba(0, 180, 216, 0.03) 100%);
  border-radius: 12rpx;
  border: 1px solid rgba(0, 206, 201, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background: linear-gradient(135deg, rgba(0, 206, 201, 0.1) 0%, rgba(0, 180, 216, 0.06) 100%);
    transform: scale(0.98);
    border-color: rgba(0, 206, 201, 0.2);
  }


  .order-no-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .order-no-label {
      font-size: 22rpx;
      color: #6b7280;
      font-weight: 400;

      .copy-hint {
        font-size: 20rpx;
        color: #00cec9;
        margin-left: 8rpx;
      }
    }

    .order-no-value-wrapper {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .order-no-value {
        font-size: 26rpx;
        color: #111827;
        font-weight: 600;
        word-break: break-all;
        flex: 1;
        min-width: 0;
      }
    }
  }
}

.craftsman {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  background: linear-gradient(135deg, rgba(0, 206, 201, 0.03) 0%, rgba(255, 255, 255, 1) 100%);
  border-radius: 16rpx;
  border: 1px solid rgba(0, 206, 201, 0.08);

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 20rpx;
    background: #f0f0f0;
    flex-shrink: 0;
    border: 3rpx solid rgba(0, 206, 201, 0.1);
    box-shadow: 0 4rpx 12rpx rgba(0, 206, 201, 0.1);
  }

  .info {
    flex: 1;
    min-width: 0;

    .name {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16rpx;
      line-height: 1.3;
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 12rpx;
      margin-bottom: 16rpx;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 12rpx;
        font-size: 26rpx;
        color: #6b7280;
        line-height: 1.4;

        .icon-wrapper {
          width: 48rpx;
          height: 48rpx;
          background: linear-gradient(135deg, rgba(0, 206, 201, 0.12) 0%, rgba(0, 180, 216, 0.08) 100%);
          border-radius: 10rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      }
    }

    .badges {
      display: flex;
      gap: 12rpx;
      flex-wrap: wrap;

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6rpx;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        font-weight: 500;
        color: #fff;
        line-height: 1;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

        .badge-icon-wrapper {
          width: 28rpx;
          height: 28rpx;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        &.verified {
          background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
        }

        &.skill {
          background: linear-gradient(135deg, #6c5ce7 0%, #5a4fcf 100%);
        }
      }
    }
  }
}

.construction-progress {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 1px solid #f0f0f0;

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .progress-title {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .progress-icon-wrapper {
        width: 48rpx;
        height: 48rpx;
        background: linear-gradient(135deg, rgba(0, 206, 201, 0.1) 0%, rgba(0, 180, 216, 0.08) 100%);
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .progress-title-text {
        font-size: 28rpx;
        color: #111827;
        font-weight: 600;
      }
    }

    .view-more-btn {
      display: flex;
      align-items: center;
      gap: 4rpx;
      padding: 8rpx 16rpx;
      font-size: 24rpx;
      color: #00cec9;
      font-weight: 500;
    }
  }

  .content-card {
    flex: 1;
    background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    border-radius: 16rpx;
    padding: 24rpx;
    min-width: 0;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }

  .date-time-row {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px solid #f0f0f0;

    .date-time-text {
      font-size: 26rpx;
      color: #374151;
      flex: 1;
      word-break: break-all;
      line-height: 1.6;
      font-weight: 500;
    }
  }

  .location-row {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    margin-bottom: 16rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px solid #f0f0f0;

    .location-text {
      font-size: 26rpx;
      color: #6b7280;
      flex: 1;
      line-height: 1.6;
    }
  }

  .description {
    margin-bottom: 20rpx;
    padding: 16rpx;
    background: rgba(0, 206, 201, 0.03);
    border-radius: 12rpx;
    border-left: 4rpx solid #00cec9;
    font-size: 28rpx;
    color: #374151;
    font-weight: 400;
    line-height: 1.6;
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
  }

  .photo-item {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12rpx;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .photo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;

      .photo-count {
        font-size: 32rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
</style>
