<template>
  <view class="content-area">
    <view class="renovation-tag"> {{ workTypeDetail?.work_title }} </view>

    <view class="divider-view"></view>

    <view class="work-price">
      <text class="work-price-value">{{ workTypeDetail?.work_price }}</text>
      <text class="work-price-unit">元</text>
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
      <section-header title="服务详情" />
      <view
        class="service-detail-item"
        v-for="(item, index) in workTypeDetail?.service_details"
        :key="index"
      >
        <image 
          :src="item.service_image" 
          mode="aspectFill" 
          class="service-detail-image"
          @click="handlePreviewImage(item.service_image)"
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

const handlePreviewImage = (currentImage: string): void => {
  const serviceDetails = props.workTypeDetail?.service_details || []
  const imageUrls = serviceDetails.map((item: any) => item.service_image || item).filter(Boolean)
  previewImage(currentImage, imageUrls)
}
</script>

<style lang="scss" scoped>
.content-area {
  padding: 16px;
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

.service-detail-item {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:last-child {
    margin-bottom: 0;
  }

  .service-detail-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid #f5f5f5;
  }

  .service-detail-desc {
    font-size: 14px;
    line-height: 1.8;
    color: #333;
    padding: 0;
    word-break: break-all;
    position: relative;
  }
}

.renovation-tag {
  width: fit-content;
  background: linear-gradient(135deg, #00cec9, #00b4d8);
  color: #fff;
  padding: 6px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;

  &.old {
    background: linear-gradient(135deg, #6c757d, #495057);
  }
}

.work-price {
  display: flex;
  align-items: center;
  gap: 4px;

  .work-price-value {
    font-size: 24px;
    font-weight: 600;
    color: #00cec9;
  }

  .work-price-unit {
    font-size: 16px;
    font-weight: 400;
    color: #2c3e50;
  }
}
</style>
