<template>
  <custom-card>
    <section-header title="施工进度" />

    <view class="progress-list">
      <view
        v-for="(item, index) in reversedProgress"
        :key="index"
        class="progress-item"
        :class="{ 'last-item': index === reversedProgress.length - 1 }"
      >
        <view class="progress-timeline">
          <view class="timeline-dot"></view>
          <view v-if="index !== reversedProgress.length - 1" class="timeline-line"></view>
        </view>

        <view class="progress-content">
          <view class="progress-header">
            <text class="progress-time">{{ formatProgressTime(item.start_time, item.end_time) }}</text>
            <text class="progress-location">{{ item.location }}</text>
          </view>

          <view v-if="item.photos && item.photos.length > 0" class="progress-photos">
            <view
              v-for="(photo, photoIndex) in item.photos"
              :key="photoIndex"
              class="photo-item"
              @click="previewImage(photo, item.photos)"
            >
              <image :src="photo" mode="aspectFill" class="photo-image" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import customCard from '@/components/custom-card.vue'
import sectionHeader from '@/components/section-header.vue'
import { previewImage } from '@/utils'
import dayjs from 'dayjs'

const props = defineProps<{
  progress: any[]
}>()

// 反转进度数组，最新的显示在最上面
const reversedProgress = computed(() => {
  return [...props.progress].reverse()
})

// 格式化进度时间
const formatProgressTime = (startTime: string, endTime: string): string => {
  if (!startTime) return ''
  const start = dayjs(startTime)
  const end = endTime ? dayjs(endTime) : null

  if (end) {
    return `${start.format('MM-DD HH:mm')} - ${end.format('MM-DD HH:mm')}`
  }
  return start.format('MM-DD HH:mm')
}
</script>

<style lang="scss" scoped>
.progress-list {
  display: flex;
  flex-direction: column;

  .progress-item {
    display: flex;
    gap: 16px;
    padding-bottom: 20px;

    &.last-item {
      padding-bottom: 0;
    }

    .progress-timeline {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;

      .timeline-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00cec9, #00b4d8);
        border: 2px solid #fff;
        box-shadow: 0 0 0 2px rgba(0, 206, 201, 0.2);
      }

      .timeline-line {
        width: 2px;
        flex: 1;
        background: linear-gradient(180deg, #00cec9, #e9ecef);
        margin-top: 4px;
        min-height: 40px;
      }
    }

    .progress-content {
      flex: 1;
      min-width: 0;

      .progress-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 12px;

        .progress-time {
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
        }

        .progress-location {
          font-size: 12px;
          color: #666;
        }
      }

      .progress-photos {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;

        .photo-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;

          .photo-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

