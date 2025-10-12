<template>
  <view class="describe-header">
    <!-- 标题区域 -->
    <view class="focus-container">
      <view class="focus-title">{{ headerData.title }}</view>
      <view class="focus-subtitle">{{ headerData.subtitle }}</view>
    </view>

    <!-- 统计数据区域 -->
    <view class="serve-introduce">
      <view class="stats-row">
        <template v-for="(stat, index) in statsData" :key="index">
          <view class="stat-card">
            <view class="stat-icon">
              <uni-icons :type="stat.icon as any" color="#fff" size="20" />
            </view>
            <view class="stat-content">
              <text class="stat-text">{{ stat.text }}</text>
            </view>
          </view>
          <view v-if="index < statsData.length - 1" class="stat-divider"></view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 响应式数据
const headerData = {
  title: '专注家装13年',
  subtitle: '让每一个家都有温度',
}

const statsData = [
  {
    icon: 'vip',
    text: '13年经验',
  },
  {
    icon: 'staff',
    text: '10000+客户',
  },
  {
    icon: 'medal',
    text: '100%品质保障',
  },
]
</script>

<style lang="scss">
.focus-container {
  margin-left: 12px;
  margin-top: 24px;

  .focus-title {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.1;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .focus-subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.5px;
  }
}

.serve-introduce {
  margin: 24px 0px 0px 12px;

  .stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 16px 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .stat-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .stat-icon {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        backdrop-filter: blur(5px);
      }

      .stat-content {
        display: flex;
        align-items: center;
        justify-content: center;

        .stat-text {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          line-height: 1;
          text-align: center;
        }
      }
    }

    .stat-divider {
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 8px;
    }
  }
}
</style>
