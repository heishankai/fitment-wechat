<template>
  <view class="section-header">
    <view class="section-bar"></view>
    <text class="section-title">{{ title }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .section-bar {
    width: 4px;
    height: 20px;
    background: #00cec9;
    border-radius: 2px;
    margin-right: 12px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #00cec9;
  }
}
</style>
