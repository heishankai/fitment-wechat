<template>
  <view class="case-list">
    <view class="case-item" v-for="item in caseList" :key="item.id">
      <view class="case-image">
        <image :src="item?.drawingroom_image[0]" mode="aspectFill" class="image" />
        <view class="case-tag" :class="{ old: item?.remodel_type !== 1 }">
          {{ item?.remodel_type === 1 ? '新房装修' : '旧房改造' }}
        </view>
      </view>
      <view class="case-info">
        <view class="case-title">{{ item?.housing_type }}</view>
        <view class="case-desc">{{ item?.city_name }} · {{ item?.square_number }}m²</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCaseListService } from '../service'

// 类型定义
interface CaseItem {
  id: string | number
  remodel_type: number
  drawingroom_image: string[]
  housing_type: string
  city_name: string
  square_number: number
}

interface PageParams {
  pageIndex: number
  pageSize: number
}

// 响应式数据
const allCaseList = ref<CaseItem[]>([]) // 存储所有数据
const finish = ref(false)
const currentFilter = ref<number | null>(null)
const loading = ref(false)

const pageParams = ref<PageParams>({
  pageIndex: 1,
  pageSize: 10,
})

// 计算属性 - 筛选后的数据
const caseList = computed(() => {
  if (currentFilter.value === null) {
    return allCaseList.value
  }
  return allCaseList.value.filter((item) => item.remodel_type === currentFilter.value)
})

// 获取案例列表数据
const loadCaseData = async (): Promise<void> => {
  if (finish.value || loading.value) {
    if (finish.value) {
      uni.showToast({ icon: 'none', title: '没有更多数据~' })
    }
    return
  }

  loading.value = true

  try {
    const { success, data } = await getCaseListService({ ...pageParams.value })

    if (success && data?.length) {
      // 存储到全部数据中
      allCaseList.value.push(...data)

      // 更新分页参数
      pageParams.value.pageIndex++

      // 检查是否还有更多数据
      if (data.length < pageParams.value.pageSize) {
        finish.value = true
      }
    } else {
      finish.value = true
    }
  } catch {
    uni.showToast({ icon: 'none', title: '加载失败，请重试' })
  } finally {
    loading.value = false
  }
}

// 重置数据
const resetData = (): void => {
  pageParams.value.pageIndex = 1
  allCaseList.value = []
  finish.value = false
  loading.value = false
}

// 切换筛选条件
const switchFilter = (remodelType: number | null): void => {
  currentFilter.value = remodelType
  // 使用计算属性，无需手动筛选
}

// 暴露方法
defineExpose({
  resetData,
  getMore: loadCaseData,
  switchFilter,
})

onLoad(() => {
  loadCaseData()
})
</script>

<style lang="scss">
.case-list {
  padding: 24px 12px;
  background: #f8f9fa;

  .case-item {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);

    .case-image {
      position: relative;
      width: 100%;
      height: 200px;

      .image {
        width: 100%;
        height: 100%;
      }

      .case-tag {
        position: absolute;
        top: 12px;
        left: 12px;
        background: #00cec9;
        color: #fff;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.old {
          background: #f5f5f5;
          color: #666;
        }
      }
    }

    .case-info {
      padding: 16px;

      .case-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 6px;
        line-height: 1.3;
      }

      .case-desc {
        font-size: 13px;
        color: #999;
        line-height: 1.2;
      }
    }
  }
}
</style>
