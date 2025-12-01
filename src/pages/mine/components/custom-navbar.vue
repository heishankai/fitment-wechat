<template>
  <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
    <view class="content">
      <view class="icon" @click="handleNotificationClick">
        <uni-icons type="notification" size="30" color="#fff" />
        <!-- 消息角标 -->
        <view class="badge" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()

// 点击通知图标
const handleNotificationClick = (): void => {
  // 跳转到消息列表
  wx.navigateTo({
    url: '/subpackages/message-list/index',
  })
}

// 暴露方法给父组件
defineExpose({
  handleNotificationClick,
})
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
      position: relative;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      .badge {
        position: absolute;
        top: 0px;
        right: -6px;
        min-width: 20rpx;
        height: 16rpx;
        background: #ff4757;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
        animation: pulse 2s infinite;

        .badge-text {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
          padding: 0 4px;
        }
      }
    }
  }
}

/* 角标动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 71, 87, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
  }
}
</style>
