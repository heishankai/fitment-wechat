<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
      @scroll="onScroll"
    >
      1111
    </scroll-view>
    <contact-service :scrollTop="scrollTop" />
  </view>
</template>

<script setup lang="ts">
import contactService from '@/components/contact-service.vue'

const scrollTop = ref<number>()

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
