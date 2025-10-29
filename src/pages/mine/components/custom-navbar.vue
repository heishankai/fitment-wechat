<template>
  <view class="navbar" :style="{ paddingTop: safeArea.top + 'px' }">
    <view class="content">
      <view class="icon" @click="handleNotificationClick">
        <uni-icons type="notification" size="30" color="#fff" />
        <!-- 消息角标 -->
        <view v-if="messageCount > 0" class="badge">
          <text class="badge-text">{{ messageCount > 99 ? '99+' : messageCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeArea } = wx.getSystemInfoSync()

// 消息数量
const messageCount = ref(5) // 示例数据，实际应该从接口获取

// 点击通知图标
const handleNotificationClick = (): void => {
  // 跳转到消息页面
  uni.navigateTo({
    url: '/subpackages/customer-service/index'
  })
  
  // 点击后清除角标
  messageCount.value = 0
}

// 暴露方法给父组件
defineExpose({
  messageCount,
  handleNotificationClick
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
        top: -6px;
        right: -6px;
        min-width: 20px;
        height: 20px;
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
