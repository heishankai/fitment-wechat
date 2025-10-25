<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y> 我的订单 </scroll-view>
  </view>
</template>

<script setup lang="ts">
onLoad(() => {})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
