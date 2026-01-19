<template>
  <view class="waterfall-container">
    <view class="waterfall-column" v-for="(column, index) in waterfallColumns" :key="index">
      <view class="case-item" v-for="caseItem in column" :key="caseItem.id" @click="navigateToCaseDetail(caseItem.id)">
        <view class="case-image" :style="{ height: caseItem.imageHeight + 'px' }">
          <image :src="caseItem.drawingroom_image[0]" mode="aspectFill" class="image" />
          <view class="case-tag" :class="{ old: caseItem.remodel_type !== 1 }">
            {{ caseItem.remodel_type === 1 ? '新房装修' : '旧房改造' }}
          </view>
        </view>
        <view class="case-info">
          <view class="case-title">{{ caseItem.housing_type }}</view>
          <view class="case-desc">{{ caseItem.city_name }} · {{ caseItem.square_number }}m²</view>
        </view>
      </view>
    </view>
  </view>

  <!-- 没有更多数据 -->
  <view class="no-more" v-if="finish && allCaseList.length > 0">
    <text>没有更多案例了~</text>
  </view>

  <!-- 空数据状态 -->
  <empty-state v-if="!allCaseList?.length" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// components
import emptyState from '@/components/empty-state.vue'
// service
import { getCaseListService } from '../service'

// 类型定义
interface CaseItem {
  id: number
  housing_name: string
  housing_type: string
  city_name: string
  remodel_type: number
  square_number: number
  drawingroom_image: string[]
  imageHeight?: number
  descLength?: number
  isLongName?: boolean
}

// 响应式数据
const allCaseList = ref<CaseItem[]>([])

const loading = ref(false)
const finish = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10,
})

// 常量定义
const HEIGHT_VARIATIONS = [100, 150, 200, 250, 120, 180, 160, 220] as const
const BASE_HEIGHT = 180
const MAX_DESC_HEIGHT = 100
const LONG_NAME_THRESHOLD = 20

// 为案例添加高度信息
const addHeightInfo = (caseItem: CaseItem, index: number): CaseItem => {
  const descLength = caseItem.housing_type?.length || 0
  const isLongName = caseItem.housing_type?.length > LONG_NAME_THRESHOLD

  return {
    ...caseItem,
    imageHeight: HEIGHT_VARIATIONS[index % HEIGHT_VARIATIONS.length],
    descLength,
    isLongName,
  }
}

// 计算案例预估高度
const calculateCaseHeight = (caseItem: CaseItem): number => {
  const descHeight = Math.min((caseItem.descLength || 0) * 2, MAX_DESC_HEIGHT)
  const nameHeight = caseItem.isLongName ? 50 : 35
  const subtitleHeight = 20

  return BASE_HEIGHT + (caseItem.imageHeight || 0) + descHeight + nameHeight + subtitleHeight + 40
}

// 瀑布流布局 - 计算属性
const waterfallColumns = computed(() => {
  const columns: CaseItem[][] = [[], []]
  const columnHeights = [0, 0] // 记录每列的高度

  allCaseList.value.forEach((caseItem, index) => {
    const caseWithHeight = addHeightInfo(caseItem, index)

    // 找到高度最小的列
    const minHeightIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1

    // 将案例添加到高度最小的列
    columns[minHeightIndex].push(caseWithHeight)

    // 计算并更新列高度
    const estimatedHeight = calculateCaseHeight(caseWithHeight)
    columnHeights[minHeightIndex] += estimatedHeight
  })

  return columns
})

// 获取案例列表数据
const getCaseListData = async (): Promise<void> => {
  if (finish.value || loading.value) {
    if (finish.value) {
      // uni.showToast({
      //   icon: 'none',
      //   title: '没有更多数据~',
      //   duration: 1500,
      // })
    }
    return
  }

  loading.value = true

  try {
    const { data, success } = await getCaseListService(pageParams.value)

    if (!success) {
      finish.value = true
      return
    }

    const newData = data || []

    if (newData.length === 0) {
      finish.value = true
      return
    }

    allCaseList.value.push(...newData)
    pageParams.value.pageIndex++
  } catch (error) {
    console.error('获取案例列表失败:', error)
    finish.value = true
  } finally {
    loading.value = false
  }
}

// 重置案例数据
const resetData = (): void => {
  pageParams.value.pageIndex = 1
  allCaseList.value = []
  finish.value = false
  loading.value = false
}

// 跳转案例详情
const navigateToCaseDetail = (id: number): void => {
  uni.navigateTo({
    url: `/subpackages/case-item-detail/index?id=${id}`,
  })
}

// 暴露方法
defineExpose({
  resetData,
  getMore: getCaseListData,
})

// 初始化加载
getCaseListData()
</script>

<style lang="scss">
/* 主题色变量 */
$primary-color: #00cec9;

/* 瀑布流布局 */
.waterfall-container {
  display: flex;
  gap: 8px;
  padding: 0 8px;
  align-items: flex-start;
  /* 确保列从顶部开始对齐 */

  .waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
    /* 确保案例卡片填满列宽 */

    .case-item {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      margin-bottom: 8px;
      position: relative;

      &:active {
        transform: scale(0.98);
      }

      .case-image {
        position: relative;
        width: 100%;

        .image {
          width: 100%;
          height: 100%;
        }

        .case-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba($primary-color, 0.9);
          color: #fff;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 500;

          &.old {
            background: #f275b3;
          }
        }
      }

      .case-info {
        padding: 12px;

        .case-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .case-desc {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
