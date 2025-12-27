<template>
  <view class="container">
    <!-- 顶部搜索框 -->
    <view
      class="search-section"
      :style="{ paddingTop: safeArea.top + 'px', paddingRight: menuButtonWidth + 'px' }"
    >
      <view class="search-box">
        <uni-icons type="search" size="18" color="#999" />
        <input
          v-model="searchKeyword"
          placeholder="搜索工价名称..."
          class="search-input"
          @input="onSearchInput"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <uni-icons type="clear" size="16" color="#999" />
        </view>
      </view>
    </view>

    <!-- 左右分栏布局 -->
    <view class="content-wrapper">
      <!-- 左侧工种列表 -->
      <view class="left-sidebar">
        <scroll-view scroll-y class="tabs-scroll">
          <view class="tabs-container">
            <view
              class="tab-item"
              v-for="kind in workKindList"
              :key="kind.id"
              :class="{ active: selectedWorkKindId === kind.id }"
              hover-class="none"
              @click="selectWorkKind(kind.id)"
            >
              <text>{{ kind.work_kind_name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 右侧工价列表 -->
      <view class="right-content">
        <scroll-view
          enable-back-to-top
          refresher-enabled
          @refresherrefresh="onRefresherrefresh"
          :refresher-triggered="isTriggered"
          @scrolltolower="onScrolltolower"
          class="scroll-view"
          scroll-y
          @scroll="onScroll"
        >
          <work-list ref="workListRef" />
        </scroll-view>
      </view>
    </view>
    <contact-service :scrollTop="scrollTop" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash-es'
// components
import workList from './components/work-list.vue'
import contactService from '@/components/contact-service.vue'
import { getWorkKindListService } from './service'

// 获取屏幕边界到安全区域距离和胶囊按钮信息
const systemInfo = wx.getSystemInfoSync()
const { safeArea } = systemInfo
const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
// 计算右侧需要留出的空间（胶囊按钮宽度 + 间距）
const menuButtonWidth = systemInfo.windowWidth - menuButtonInfo.left + 8

// 工种列表
interface WorkKind {
  id: number
  work_kind_name: string
}

const workKindList = ref<WorkKind[]>([])
const selectedWorkKindId = ref<number | null>(null)
const searchKeyword = ref('')
const workListRef = ref<any>()
const scrollTop = ref<number>(0)
const isTriggered = ref(false)

// 加载工种列表
const loadWorkKindList = async (): Promise<void> => {
  try {
    const { data, success } = await getWorkKindListService()
    if (success && data) {
      workKindList.value = data
      // 默认选中"工长"
      const foremanKind = data.find((kind: WorkKind) => kind.work_kind_name === '工长')
      if (foremanKind) {
        selectedWorkKindId.value = foremanKind.id
        // 加载工长的工价列表
        workListRef.value?.resetData()
        workListRef.value?.loadWorkList('', foremanKind.id)
      }
    }
  } catch (error) {
    console.error('加载工种列表失败:', error)
  }
}

// 选择工种
// 注意：工种列表中的 work_kind_name 对应工价列表中 work_kind.label
// 筛选时使用 work_kind.id 来匹配工价列表中的 work_kind.id
const selectWorkKind = (kindId: number): void => {
  selectedWorkKindId.value = kindId
  // 重置并重新加载工价列表
  workListRef.value?.resetData()
  workListRef.value?.loadWorkList(searchKeyword.value, kindId)
}

// 滚动到底部事件
const onScrolltolower = (): void => {
  workListRef.value?.getMore()
}

// 搜索输入处理
const onSearchInput = (e: any): void => {
  const value = e.detail.value
  searchKeyword.value = value

  // 如果输入框为空，重置数据
  if (!value.trim()) {
    workListRef.value?.resetData()
    workListRef.value?.loadWorkList('', selectedWorkKindId.value)
    return
  }

  // 使用防抖搜索
  debouncedSearch()
}

// 防抖搜索函数
const debouncedSearch = debounce(() => {
  workListRef.value?.resetData()
  workListRef.value?.loadWorkList(searchKeyword.value, selectedWorkKindId.value)
}, 500)

// 清空搜索
const clearSearch = (): void => {
  searchKeyword.value = ''
  workListRef.value?.resetData()
  workListRef.value?.loadWorkList('', selectedWorkKindId.value)
}

// 自定义下拉刷新被触发
const onRefresherrefresh = async (): Promise<void> => {
  // 开始动画
  isTriggered.value = true

  // 重置工价列表数据
  workListRef.value?.resetData()
  await workListRef.value?.loadWorkList(searchKeyword.value, selectedWorkKindId.value)

  // 关闭动画
  isTriggered.value = false
}

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}

// 初始化
onMounted(() => {
  loadWorkKindList()
})
</script>

<style lang="scss">
/* 主题色 */
$primary-color: #00cec9;
$text-primary: #333;
$text-secondary: #666;
$text-muted: #999;
$bg-primary: #f8f9fa;
$bg-card: #ffffff;
$border-color: #e9ecef;

page {
  height: 100%;
  overflow: hidden;
  background: $bg-card;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-sidebar {
  width: 100px;
  background: #fff;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs-scroll {
  flex: 1;
  overflow: hidden;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

/* 顶部搜索框 */
.search-section {
  padding: 12px 16px;
  padding-bottom: 12px;
  background: linear-gradient(135deg, $primary-color 0%, #00b4d8 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  .search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 10px 16px;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .search-input {
      flex: 1;
      font-size: 14px;
      color: $text-primary;
      background: transparent;
      border: none;
      outline: none;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ddd;
    }
  }
}

/* 左侧工种列表 */
.tabs-container {
  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: 6px;
    color: #666;
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
    transition: all 0.2s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    border: none;
    min-height: 40px;
    text-align: center;

    &.active {
      background: $primary-color;
      color: #fff;
      font-weight: 500;
    }

    text {
      line-height: 1.4;
    }
  }
}
</style>
