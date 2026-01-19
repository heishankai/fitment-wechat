<template>
  <view class="function-card" :class="{ 'grid-layout': isGrid }" @click="handleClick">
    <view class="card-icon" :style="{ background: iconBgColor }">
      <uni-icons :type="iconType" :size="iconSize" :color="iconColor" />
    </view>
    <view class="card-content">
      <view class="card-title">{{ title }}</view>
      <view class="card-desc">{{ desc }}</view>
    </view>
    <uni-icons v-if="!isGrid" type="right" size="16" color="#ccc" />
  </view>
</template>

<script setup lang="ts">
interface Props {
  title: string // 标题
  desc?: string // 描述
  iconType: string // 图标类型
  iconColor?: string // 图标颜色
  iconSize?: number // 图标大小
  iconBgColor?: string // 图标背景色
  url?: string // 跳转链接
  isGrid?: boolean // 是否为网格布局
}

const props = withDefaults(defineProps<Props>(), {
  desc: '',
  iconColor: '#00cec9',
  iconSize: 24,
  iconBgColor: 'rgba(0, 206, 201, 0.1)',
  url: '',
  isGrid: false,
})

const emit = defineEmits<{
  click: []
}>()

// 处理点击事件
const handleClick = (): void => {
  if (props.url) {
    uni.navigateTo({
      url: props.url,
    })
  }
  emit('click')
}
</script>

<style lang="scss" scoped>
.function-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 206, 201, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(90deg, #00cec9 0%, #00b4d8 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    flex-shrink: 0;
    position: relative;
  }

  .card-content {
    flex: 1;
    text-align: left;

    .card-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8rpx;
      line-height: 1.4;
    }

    .card-desc {
      font-size: 24rpx;
      color: #6b7280;
      line-height: 1.4;
    }
  }

  // 网格布局样式
  &.grid-layout {
    flex-direction: column;
    padding: 32rpx 24rpx;
    margin-bottom: 0;
    text-align: center;

    .card-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 20rpx;
      margin-right: 0;
      margin-bottom: 20rpx;
    }

    .card-content {
      text-align: center;
      width: 100%;

      .card-title {
        font-size: 28rpx;
      }

      .card-desc {
        font-size: 22rpx;
      }
    }
  }
}
</style>
