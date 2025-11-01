<template>
  <view class="function-card" @click="handleClick">
    <view class="card-icon" :style="{ background: iconBgColor }">
      <uni-icons :type="iconType" :size="iconSize" :color="iconColor" />
    </view>
    <view class="card-content">
      <view class="card-title">{{ title }}</view>
      <view class="card-desc">{{ desc }}</view>
    </view>
    <uni-icons type="right" size="16" color="#ccc" />
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
}

const props = withDefaults(defineProps<Props>(), {
  desc: '',
  iconColor: '#00cec9',
  iconSize: 24,
  iconBgColor: 'rgba(0, 206, 201, 0.1)',
  url: '',
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
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.12);
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
  }

  .card-content {
    flex: 1;

    .card-title {
      font-size: 32rpx;
      font-weight: 500;
      color: $uni-text-color;
      margin-bottom: 8rpx;
    }

    .card-desc {
      font-size: 24rpx;
      color: $uni-text-color-placeholder;
    }
  }
}
</style>
