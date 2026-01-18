<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <view v-if="progressList?.length" class="progress-container">
        <view class="progress-list">
          <timeline
            v-for="(item, index) in progressList"
            :key="index"
            :completed="isCompleted(item)"
            :is-last="index === progressList.length - 1"
          >
            <!-- 内容卡片 -->
            <view class="content-card">
              <!-- 日期和时间 -->
              <view class="date-time-row">
                <uni-icons type="calendar" size="16" color="#666" />
                <text class="date-time-text">
                  {{ formatDateTimeRange(item.start_time, item.end_time) }}
                </text>
              </view>

              <!-- 地址 -->
              <view v-if="item.location" class="location-row">
                <uni-icons type="location" size="16" color="#666" />
                <text class="location-text">{{ item.location }}</text>
              </view>

              <!-- 工作描述 -->
              <view v-if="item.description" class="description">
                {{ item?.description }}
              </view>

              <!-- 照片网格 -->
              <view v-if="item?.photos?.length" class="photos-grid">
                <view
                  v-for="(photo, photoIndex) in item.photos"
                  :key="photoIndex"
                  class="photo-item"
                  @click="previewImage(photo, item?.photos)"
                >
                  <image :src="photo" mode="aspectFill" class="photo-image" />
                </view>
              </view>
            </view>
          </timeline>
        </view>
      </view>

      <empty-state v-else text="暂无施工进度记录" />
    </scroll-view>

    <!-- 底部统计栏 -->
    <view v-if="progressList?.length" class="bottom-bar">
      <view class="bottom-content">
        <text class="bottom-text">共记录 {{ progressList.length }} 次施工进度</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import emptyState from '@/components/empty-state.vue'
import timeline from '@/components/timeline.vue'
import { getConstructionProgress, getConstructionProgressByOrderId } from './service'
import { previewImage, formatDateTimeRange } from '@/utils'

// 响应式数据
const params = ref<any>({
  workPriceItemId: '',
  craftsmanId: '',
  orderId: '',
})

const progressList = ref<any[]>([])
const isTriggered = ref(false)

// 判断是否已完成（可以根据实际业务逻辑调整）
const isCompleted = (item: any): boolean => {
  // 如果有结束时间，或者有照片，或者有其他完成标识，可以判断为已完成
  // 这里假设有 end_time 或 photos 就表示已完成
  return !!(item.end_time || (item.photos && item.photos.length > 0))
}

// 加载施工进度列表
const loadProgress = async (params: any): Promise<void> => {
  // 如果传入了 orderId，使用订单ID获取
  if (params.orderId) {
    const { success, data } = await getConstructionProgressByOrderId(params.orderId)
    if (success) {
      progressList.value = data || []
    }
    return
  }

  // 否则使用工价项ID和工匠ID获取
  const { workPriceItemId, craftsmanId } = params
  const { success, data } = await getConstructionProgress(workPriceItemId, craftsmanId)
  if (success) {
    progressList.value = data || []
  }
}

// 下拉刷新
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadProgress(params?.value)
  isTriggered.value = false
}

// 页面加载
onLoad((options) => {
  params.value = options
  loadProgress(options)
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 0; // 确保 flex 子元素可以收缩
  background-color: #f5f5f5;
}

.progress-container {
  padding: 16px;
  background-color: #f5f5f5;
}

.progress-list {
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.content-card {
  flex: 1;
  background-color: #f9fafb;
  border-radius: 16px;
  padding: 16px;
  min-width: 0;
}

.date-time-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.date-time-text {
  font-size: 14px;
  color: #666;
  flex: 1;
  word-break: break-all;
  line-height: 1.5;
}

.location-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.location-text {
  font-size: 14px;
  color: #666;
  flex: 1;
  line-height: 1.5;
}

.description {
  margin-bottom: 12px;
  font-size: 15px;
  color: #374151;
  font-weight: 500;
  line-height: 1.5;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  transition: opacity 0.2s;

  .photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bottom-bar {
  flex-shrink: 0;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

  .bottom-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .bottom-text {
    font-size: 14px;
    color: #666;
    text-align: center;
  }
}
</style>
