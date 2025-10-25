<template>
  <view class="info-item" :class="{ clickable: clickable }" @click="handleClick">
    <view class="info-label">
      <uni-icons :type="icon" size="18" color="#666" />
      <text>{{ label }}</text>
    </view>
    <view class="info-content">
      <text class="info-value">{{ value || placeholder }}</text>
      <uni-icons v-if="clickable" type="right" size="16" color="#ccc" />
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  icon: any
  label: string
  value?: string
  placeholder?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '未设置',
  clickable: false,
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = (): void => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &.clickable {
    &:active {
      background-color: #f8f9fa;
    }
  }

  .info-label {
    display: flex;
    align-items: center;
    gap: 16rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }

  .info-content {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .info-value {
      font-size: 28rpx;
      color: #666;
    }
  }
}
</style>
