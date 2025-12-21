<template>
  <custom-card>
    <view class="section-title">完工效果</view>
    <view class="room-section">
      <section-header title="客厅及走廊" />
      <view class="room-grid">
        <view
          v-for="(image, index) in props.caseDetail?.drawingroom_image"
          :key="index"
          class="room-item"
          @click="previewImage(image, props.caseDetail?.drawingroom_image)"
        >
          <image :src="image" mode="aspectFill" class="room-image" />
        </view>
      </view>
    </view>
    <view class="room-section">
      <section-header title="阳台" />
      <view class="room-grid">
        <view
          v-for="(image, index) in props.caseDetail?.balcony_image"
          :key="index"
          class="room-item"
          @click="previewImage(image, props.caseDetail?.balcony_image)"
        >
          <image :src="image" mode="aspectFill" class="room-image" />
        </view>
      </view>
    </view>

    <view class="room-section">
      <section-header title="主卧" />
      <view class="room-grid">
        <view
          v-for="(image, index) in props?.caseDetail?.master_bedroom_image"
          :key="index"
          class="room-item"
          @click="previewImage(image, props.caseDetail?.master_bedroom_image)"
        >
          <image :src="image" mode="aspectFill" class="room-image" />
        </view>
      </view>
    </view>

    <view class="room-section">
      <section-header title="厨房" />
      <view class="room-grid">
        <view
          v-for="(image, index) in props?.caseDetail?.kitchen_image"
          :key="index"
          class="room-item"
          @click="previewImage(image, props.caseDetail?.kitchen_image)"
        >
          <image :src="image" mode="aspectFill" class="room-image" />
        </view>
      </view>
    </view>

    <view class="room-section">
      <section-header title="次卧" />
      <view class="room-grid">
        <view
          v-for="(image, index) in props.caseDetail?.secondary_bedroom_image"
          :key="index"
          class="room-item"
          @click="previewImage(image, props.caseDetail?.secondary_bedroom_image)"
        >
          <image :src="image" mode="aspectFill" class="room-image" />
        </view>
      </view>
    </view>

    <view class="room-section">
      <section-header title="卫生间" />
      <view class="room-grid">
        <view
          v-for="(image, index) in props.caseDetail?.bathroom_image"
          :key="index"
          class="room-item"
          @click="previewImage(image, props.caseDetail?.bathroom_image)"
        >
          <image :src="image" mode="aspectFill" class="room-image" />
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import sectionHeader from '@/components/section-header.vue'
import { previewImage } from '@/utils'

const props = defineProps<{
  caseDetail: any
}>()
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.room-section {
  margin-top: 24px;

  .room-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    .room-item {
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;

      .room-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
