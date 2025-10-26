<template>
  <uni-popup ref="popupRef" type="bottom" :safe-area="false" :z-index="9999">
    <view class="picker-content">
      <!-- 顶部区域（头部 + 搜索框） -->
      <view class="picker-top">
        <view class="picker-header">
          <text class="header-title">选择城市</text>
          <view class="close-btn" @click="hidePicker">
            <uni-icons type="close" size="20" color="#666" />
          </view>
        </view>

        <view class="picker-search">
          <uni-icons type="search" size="18" color="#999" />
          <input
            class="search-input"
            type="text"
            placeholder="请输入城市名称搜索"
            v-model="keyword"
            @input="handleSearch"
            confirm-type="search"
          />
        </view>
      </view>

      <!-- 滚动区域（城市列表） -->
      <scroll-view
        class="picker-scroll"
        scroll-y
        :scroll-with-animation="true"
        :enable-back-to-top="true"
      >
        <view
          v-for="item in filteredList"
          :key="item.city_code"
          class="picker-item"
          @click="handleSelect(item)"
        >
          <text class="item-text">{{ item.city_name }}</text>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { getCityListService } from './service'

const emit = defineEmits(['select'])
const popupRef = ref()
const locationList = ref<any[]>([])
const keyword = ref('')

/** 搜索过滤 */
const filteredList = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  return key
    ? locationList.value.filter((item) => item.city_name?.toLowerCase().includes(key))
    : locationList.value
})

/** 输入搜索 */
const handleSearch = (e: any): void => {
  keyword.value = e.detail.value
}

/** 选择城市 */
const handleSelect = (location: any): void => {
  emit('select', location)
  popupRef.value?.close()
}

/** 关闭弹窗 */
const hidePicker = (): void => popupRef.value?.close()

/** 暴露方法给父组件 */
defineExpose({
  showPicker: () => {
    popupRef.value?.open()
    keyword.value = ''
  },
  hidePicker,
})

/** 获取城市数据 */
onLoad(() => {
  getCityListService().then(({ success, data }) => {
    if (success) locationList.value = data
  })
})
</script>

<style scoped lang="scss">
.picker-content {
  z-index: 9999;
  width: 100%;
  height: 65vh;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

/* 顶部部分（头部 + 搜索） */
.picker-top {
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 固定顶部 */
  background: #fff;
  border-bottom: 1rpx solid #f1f1f1;
  z-index: 10;
}

/* ===== 头部 ===== */
.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx 20rpx;
}

.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #222;
}

.close-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f7f9;
  border-radius: 50%;
  transition: background 0.2s;
}
.close-btn:active {
  background: #eee;
}

/* ===== 搜索栏 ===== */
.picker-search {
  display: flex;
  align-items: center;
  margin: 0 32rpx 20rpx;
  padding: 10rpx 20rpx;
  background: #f7f8fa;
  border-radius: 999rpx;
  box-shadow: inset 0 0 6rpx rgba(0, 0, 0, 0.05);
}

.search-input {
  flex: 1;
  height: 60rpx;
  border: none;
  background: transparent;
  font-size: 28rpx;
  color: #333;
  margin-left: 12rpx;
}

/* ===== 滚动区域 ===== */
.picker-scroll {
  flex: 1;
  padding: 0 32rpx;
  height: 0; /* 关键：设置高度为0，让flex:1生效 */
}

/* ===== 城市项 ===== */
.picker-item {
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 30rpx;
  color: #333;
  transition: background 0.2s;
}

.picker-item:active {
  background: #f8f8f8;
}
</style>
