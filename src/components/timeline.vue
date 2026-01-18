<template>
  <view class="timeline-item" :class="{ 'last-item': isLast }">
    <view class="progress-timeline">
      <view class="timeline-dot" :class="{ completed: completed }"></view>
      <view v-if="!isLast" class="timeline-line"></view>
    </view>

    <view class="timeline-content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  completed?: boolean // 是否已完成
  isLast?: boolean // 是否是最后一项
}

withDefaults(defineProps<Props>(), {
  completed: false,
  isLast: false,
})
</script>

<style lang="scss" scoped>
.timeline-item {
  display: flex;
  gap: 16px;
  padding-bottom: 20px;

  &.last-item {
    padding-bottom: 0;
  }
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

    &:not(.completed) {
      background: #d1d5db;
      box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.2);
    }
  }

  .timeline-line {
    width: 2px;
    flex: 1;
    background: linear-gradient(180deg, #00cec9, #e9ecef);
    margin-top: 4px;
    min-height: 40px;
  }
}

.timeline-content {
  flex: 1;
  min-width: 0;
}
</style>
