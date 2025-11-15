<template>
  <view class="work-list">
    <view class="service-list">
      <view
        class="service-card"
        v-for="work in workList"
        :key="work.id"
        @click="navigateToDetail(work)"
      >
        <!-- 服务标签 -->
        <view class="service-tags">
          <view class="service-tag primary">{{ work.work_kind?.label }}</view>
        </view>

        <!-- 服务内容区域 -->
        <view class="service-content-wrapper">
          <!-- 工种头像展示 -->
          <view class="work-avatar" v-if="work.display_images?.[0]">
            <image
              :src="work.display_images[0]"
              mode="aspectFill"
              class="avatar-image"
              @click.stop="previewImage(work.display_images[0], work.display_images)"
            />
          </view>

          <!-- 服务内容 -->
          <view class="service-content">
            <view class="service-title">
              {{ work.work_title }}
            </view>
            <view class="service-desc">{{ work.pricing_description }}</view>
          </view>
        </view>

        <!-- 价格和操作 -->
        <view class="service-footer">
          <view class="service-price">
            <text class="price-value">¥{{ formatPrice(work.work_price) }}</text>
            <text class="price-unit">/{{ work?.labour_cost?.labour_cost_name }}</text>
          </view>
          <view class="service-action">
            <text class="action-text">查看详情</text>
            <uni-icons type="right" size="12" color="#00cec9" />
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <uni-icons type="spinner-cycle" size="20" color="#00cec9" />
        <text>加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-if="finish && workList.length > 0" class="no-more">
        <text>没有更多数据了~</text>
      </view>

      <!-- 空数据状态 -->
      <empty-state v-if="!workList?.length" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPriceListService } from '../service'
import emptyState from '@/components/empty-state.vue'

// 类型定义
interface WorkItem {
  id: number
  work_title: string
  work_price: string
  pricing_description: string
  service_scope: string
  display_images: string[]
  work_kind?: {
    id: number
    label: string
    work_kind_name: string
  }
  labour_cost?: {
    id: number
    labour_cost_name: string
  }
}

// 响应式数据
const allWorkList = ref<WorkItem[]>([]) // 存储所有原始数据
const workList = ref<WorkItem[]>([]) // 显示的数据（经过筛选）
const loading = ref(false)
const finish = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10,
})
const currentSearchKeyword = ref<string>('')
const currentWorkKindId = ref<number | null>(null)

// 格式化价格
const formatPrice = (price: string): string => {
  const num = parseFloat(price)
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// 筛选工价列表（前端筛选，仅按工种筛选）
const filterWorkList = (isLoadMore = false): void => {
  let filtered = [...allWorkList.value]

  // 按工种筛选
  if (currentWorkKindId.value !== null && currentWorkKindId.value !== undefined) {
    filtered = filtered.filter((item) => item.work_kind?.id === currentWorkKindId.value)
  }

  // 如果不是加载更多，重置分页
  if (!isLoadMore) {
    pageParams.value.pageIndex = 1
    workList.value = []
    finish.value = false
  }

  // 分页处理
  const startIndex = (pageParams.value.pageIndex - 1) * pageParams.value.pageSize
  const endIndex = startIndex + pageParams.value.pageSize
  const pageData = filtered.slice(startIndex, endIndex)

  if (pageData.length === 0) {
    finish.value = true
  } else {
    workList.value.push(...pageData)
    pageParams.value.pageIndex++

    // 检查是否还有更多数据
    if (endIndex >= filtered.length) {
      finish.value = true
    }
  }
}

// 加载工价列表
// 如果有搜索关键词：调用接口查询
// 如果没有搜索关键词：前端筛选（按工种）
const loadWorkList = async (searchKeyword?: string, workKindId?: number | null): Promise<void> => {
  // 如果是新的搜索或筛选，重置分页和显示数据
  if (
    currentSearchKeyword.value !== (searchKeyword || '') ||
    currentWorkKindId.value !== (workKindId ?? null)
  ) {
    resetData()
    currentSearchKeyword.value = searchKeyword || ''
    currentWorkKindId.value = workKindId ?? null
  }

  // 如果有搜索关键词，调用接口查询
  if (searchKeyword && searchKeyword.trim()) {
    if (loading.value || finish.value) return
    loading.value = true

    try {
      const { data, success } = await getPriceListService({
        pageIndex: pageParams.value.pageIndex,
        pageSize: pageParams.value.pageSize,
        work_title: searchKeyword.trim(),
      })

      if (!success) {
        finish.value = true
        return
      }

      const newData = data || []

      // 如果有工种筛选，对接口返回的数据进行前端筛选
      let filteredData = newData
      if (workKindId !== null && workKindId !== undefined) {
        filteredData = newData.filter((item: WorkItem) => item.work_kind?.id === workKindId)
      }

      if (filteredData.length === 0) {
        finish.value = true
      } else {
        workList.value.push(...filteredData)
        pageParams.value.pageIndex++
      }
    } catch (error) {
      console.error('加载失败:', error)
      uni.showToast({ icon: 'none', title: '加载失败，请重试' })
    } finally {
      loading.value = false
    }
    return
  }

  // 如果没有搜索关键词，使用前端筛选（需要先加载所有数据）
  if (allWorkList.value.length === 0) {
    if (loading.value) return
    loading.value = true

    try {
      // 加载所有数据，使用较大的 pageSize 或分页加载
      let allData: WorkItem[] = []
      let currentPage = 1
      let hasMore = true

      while (hasMore) {
        const { data, success } = await getPriceListService({
          pageIndex: currentPage,
          pageSize: 100, // 使用较大的 pageSize 一次性加载更多数据
        })

        if (!success || !data || data.length === 0) {
          hasMore = false
          break
        }

        allData.push(...data)

        // 如果返回的数据少于 pageSize，说明没有更多数据了
        if (data.length < 100) {
          hasMore = false
        } else {
          currentPage++
        }
      }

      allWorkList.value = allData
    } catch (error) {
      console.error('加载失败:', error)
      uni.showToast({ icon: 'none', title: '加载失败，请重试' })
      loading.value = false
      return
    } finally {
      loading.value = false
    }
  }

  // 应用前端筛选并分页显示
  filterWorkList()
}

// 重置数据
const resetData = (): void => {
  pageParams.value.pageIndex = 1
  workList.value = []
  finish.value = false
  // 注意：不重置 loading，因为可能正在加载原始数据
}

// 加载更多
const getMore = (): void => {
  // 如果有搜索关键词，调用接口加载更多
  if (currentSearchKeyword.value && currentSearchKeyword.value.trim()) {
    loadWorkList(currentSearchKeyword.value, currentWorkKindId.value)
  } else {
    // 如果没有搜索关键词，使用前端筛选加载更多
    if (allWorkList.value.length > 0) {
      filterWorkList(true)
    } else {
      // 如果原始数据还没加载，继续加载
      loadWorkList(currentSearchKeyword.value, currentWorkKindId.value)
    }
  }
}

// 跳转详情
const navigateToDetail = (work: WorkItem): void => {
  wx.navigateTo({
    url: `/subpackages/work-type-detail/index?id=${work.id}`,
  })
}

// 预览图片
const previewImage = (current: string, urls: string[]): void => {
  wx.previewImage({
    current,
    urls,
  })
}

// 暴露方法
defineExpose({
  loadWorkList,
  resetData,
  getMore,
})

// 初始化加载
onMounted(() => {
  loadWorkList()
})
</script>

<style lang="scss">
$primary: #00cec9;
$text-primary: #333;
$text-secondary: #666;
$text-muted: #999;

.work-list {
  background: #f8f9fa;
  min-height: 100vh;

  .service-list {
    padding: 16px;

    .service-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
      }

      .service-tags {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;

        .service-tag {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;

          &.primary {
            background: rgba($primary, 0.1);
            color: $primary;
          }

          &.secondary {
            background: rgba($text-muted, 0.1);
            color: $text-muted;
          }
        }
      }

      .service-content-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 16px;

        .work-avatar {
          flex-shrink: 0;

          .avatar-image {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;

            &:active {
              transform: scale(0.95);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
          }
        }

        .service-content {
          flex: 1;
          margin-bottom: 0;

          .service-title {
            font-size: 16px;
            font-weight: 600;
            color: $text-primary;
            line-height: 1.4;
            margin-bottom: 8px;

            .unit-text {
              font-size: 14px;
              font-weight: 400;
              color: $text-muted;
            }
          }

          .service-desc {
            font-size: 14px;
            color: $text-secondary;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }

      .service-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .service-price {
          .price-value {
            font-size: 20px;
            font-weight: 700;
            color: $primary;
          }

          .price-unit {
            font-size: 14px;
            color: $text-muted;
            margin-left: 4px;
          }
        }

        .service-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: rgba($primary, 0.1);
          border-radius: 16px;

          .action-text {
            font-size: 12px;
            color: $primary;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
}

.no-more {
  text-align: center;
  padding: 20px;
  color: $text-muted;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: $text-muted;
  font-size: 16px;
  gap: 12px;
}
</style>
