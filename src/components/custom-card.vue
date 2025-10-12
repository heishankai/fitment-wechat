<template>
  <view class="custom-card">
    <slot></slot>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.custom-card {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>
