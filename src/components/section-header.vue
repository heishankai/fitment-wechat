<template>
  <view class="section-header">
    <view class="section-left">
      <view v-if="showBar" class="section-bar" :style="{ background: color }"></view>
      <text class="section-title" :style="{ color: color }">{{ title }}</text>
    </view>
    <view v-if="$slots.right" class="section-right">
      <slot name="right" />
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    color?: string
    showBar?: boolean
  }>(),
  {
    color: '#00cec9',
    showBar: true,
  }
)
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .section-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .section-bar {
    width: 4px;
    height: 20px;
    border-radius: 2px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
  }

  .section-right {
    flex-shrink: 0;
    margin-left: 16px;
  }
}
</style>
