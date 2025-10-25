<template>
  <view class="case-header">
    <view class="tabs">
      <view
        v-for="tab in props.tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: props.selectedTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.name }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface TabItem {
  key: string
  name: string
  remodelType?: number | null  // 装修类型：1-新房装修，2-旧房改造，null-全部
}

interface Props {
  selectedTab: string
  tabs?: TabItem[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedTab: '0',
  tabs: () => [
    { key: '0', name: '完工案例', remodelType: null },
    { key: '1', name: '新房装修', remodelType: 1 },
    { key: '2', name: '旧房改造', remodelType: 2 },
  ],
})

const emit = defineEmits<{
  switchTab: [value: string, remodelType: number | null]
}>()

// 选择 tab 方法
const switchTab = (value: string): void => {
  const selectedTab = props.tabs.find(tab => tab.key === value)
  emit('switchTab', value, selectedTab?.remodelType || null)
}
</script>

<style lang="scss">
/* 主题色变量 */
$primary-color: #00cec9;
$secondary-color: #00b4d8;
$accent-color: #00a8cc;

.case-header {
  margin: 8px;

  .tabs {
    display: flex;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba($primary-color, 0.1);
    position: relative;

    .tab {
      flex: 1;
      padding: 12px 16px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;
      position: relative;
      z-index: 2;
      cursor: pointer;
      transform: scale(1);

      &:hover {
        transform: scale(1.02);
        color: #495057;
      }

      &.active {
        background: linear-gradient(135deg, $primary-color, $secondary-color);
        color: #fff;
        font-weight: 600;
        box-shadow: 0 6px 20px rgba($primary-color, 0.4);
        transform: scale(1.05);
        z-index: 3;

        &::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, $primary-color, $secondary-color);
          border-radius: 10px;
          z-index: -1;
          opacity: 0.3;
          filter: blur(8px);
        }
      }
    }
  }
}
</style>
