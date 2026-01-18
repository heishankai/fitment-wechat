<template>
  <view class="custom-card" :class="{ 'has-bottom-margin': showBottomMargin }">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showBottomMargin?: boolean
  }>(),
  {
    showBottomMargin: false,
  },
)
</script>

<style lang="scss" scoped>
.custom-card {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  // 参考 Tailwind CSS 的阴影效果，多层阴影叠加
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.05);

  &.has-bottom-margin {
    margin-bottom: 12px;
  }
}
</style>
