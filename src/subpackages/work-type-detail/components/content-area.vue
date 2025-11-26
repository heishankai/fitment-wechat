<template>
  <view class="content-area">
    <!-- 基本信息 -->
    <view class="basic-info">
      <view class="info-row">
        <view class="info-label">工种</view>
        <view class="info-value tag-value">{{ workTypeDetail?.work_kind?.label }}</view>
      </view>
      <view class="info-row">
        <view class="info-label">工价名称</view>
        <view class="info-value tag-value">{{ workTypeDetail?.work_title }}</view>
      </view>
      <view class="info-row">
        <view class="info-label">工价</view>
        <view class="info-value tag-value">
          <text>¥{{ formatPrice(workTypeDetail?.work_price) }}</text>
          <text>/{{ workTypeDetail?.labour_cost?.labour_cost_name }} </text>
        </view>
      </view>
    </view>

    <view class="divider-view"></view>

    <custom-card>
      <view class="card-header">
        <uni-icons custom-prefix="iconfont" type="icon-shouye2" color="#00cec9" size="20" />
        <text class="card-title">计价说明</text>
      </view>
      <view class="card-content">
        {{ workTypeDetail?.pricing_description }}
      </view>
    </custom-card>

    <view class="divider-view"></view>

    <custom-card>
      <view class="card-header">
        <uni-icons custom-prefix="iconfont" type="icon-duanlashuoming" color="#00cec9" size="20" />
        <text class="card-title">服务范围</text>
      </view>
      <view class="card-content">
        {{ workTypeDetail?.service_scope }}
      </view>
    </custom-card>

    <view class="divider-view"></view>
    <custom-card>
      <view class="section-title">服务详情</view>
      <view
        class="service-detail-item"
        v-for="(item, index) in workTypeDetail?.service_details"
        :key="index"
      >
        <section-header v-if="item.service_title" :title="item.service_title" />
        <image
          :src="item.service_image[0]"
          mode="aspectFill"
          class="service-detail-image"
          :class="{ 'has-title': item.service_title }"
          @click="handlePreviewImage(item.service_image[0])"
        />
        <view class="service-detail-desc" v-if="item.service_desc">
          {{ item.service_desc }}
        </view>
      </view>
    </custom-card>
  </view>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import sectionHeader from '@/components/section-header.vue'
import { previewImage } from '@/utils'

const props = defineProps<{ workTypeDetail: Record<string, any> }>()

// 格式化价格
const formatPrice = (price: string | number): string => {
  if (!price) return '0'
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const handlePreviewImage = (currentImage: string): void => {
  const serviceDetails = props.workTypeDetail?.service_details || []
  const imageUrls = serviceDetails.flatMap((item: any) => item.service_image || [])
  previewImage(currentImage, imageUrls)
}
</script>

<style lang="scss" scoped>
.content-area {
  padding: 0px 16px 16px 16px;
}
.divider-view {
  height: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
  }
}

.card-content {
  white-space: pre-line;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.service-detail-item {
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }

  .service-detail-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid #f5f5f5;

    &.has-title {
      margin-top: 16px;
    }
  }

  .service-detail-desc {
    font-size: 15px;
    line-height: 1.8;
    color: #555;
    padding: 0;
    word-break: break-all;
    white-space: pre-line;
    position: relative;
  }
}

// 基本信息
.basic-info {
  background: #fff;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 16px;
      color: #999;
      font-weight: 400;
      min-width: 80px;
    }

    .info-value {
      font-size: 20px;
      color: #333;
      font-weight: 700;
      text-align: right;
      flex: 1;

      &.tag-value {
        padding: 5px 14px;
        background: rgba(0, 206, 201, 0.1);
        color: #00cec9;
        border-radius: 14px;
        font-size: 16px;
        font-weight: 600;
        display: inline-block;
        width: fit-content;
        margin-left: auto;
      }
    }
  }
}
</style>
