<template>
  <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
    <view class="content">
      <view class="icon">
        <uni-icons type="notification" size="30" color="#fff" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()
</script>

<style lang="scss">
$primary: #00cec9;
$secondary: #00b4d8;

.navbar {
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
  padding: 0 16px 8px 16px;

  .content {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }
  }
}
</style>
