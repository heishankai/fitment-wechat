<template>
  <custom-card>
    <section-header title="施工现场" />

    <view class="construction-grid">
      <view
        v-for="(image, index) in props.caseDetail?.construction_image"
        :key="index"
        class="construction-item"
        @click="previewImage(image, props.caseDetail?.construction_image)"
      >
        <image :src="image" mode="aspectFill" class="construction-image" />
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
.construction-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  .construction-item {
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;

    .construction-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
