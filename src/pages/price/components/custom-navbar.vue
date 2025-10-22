<template>
  <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
    <view class="content">
      <view class="icon">
        <uni-icons type="gear" size="20" color="#fff" />
      </view>
      <view class="text">
        <text class="title">工种工价</text>
        <text class="subtitle">透明报价·专业施工</text>
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
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .text {
      .title {
        display: block;
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 2px;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.85);
        line-height: 1.2;
      }
    }
  }
}
</style>
