<template>
  <card :show-bottom-margin="true">
    <section_header title="施工清单" color="#0a0a0a" :showBar="false">
      <template #right>
        <view v-if="orderDetail?.order_type !== 'gangmaster'" class="header-materials-btn"
          @click="handleViewMaterialsByOrderId()">
          <text class="btn-text">辅材清单</text>
          <uni-icons type="right" size="14" color="#00cec9" />
        </view>
      </template>
    </section_header>

    <view v-for="(group, groupIndex) in groupedWorkPrices" :key="groupIndex" class="cost-item">
      <view class="group-item-header" v-if="orderDetail?.order_type === 'gangmaster'">
        <view class="header-left">
          <view class="avatar-wrapper">
            <image v-if="group.craftsman?.avatar" class="avatar" :src="group.craftsman.avatar" mode="aspectFill" />
            <view v-else class="avatar-placeholder">
              <uni-icons type="person" size="20" color="#00cec9" />
            </view>
          </view>
          <view class="header-info">
            <view class="craftsman-name">{{ group.craftsmanName }}</view>
            <view class="phone-info">
              <uni-icons type="phone" size="14" color="#6b7280" />
              <text class="phone-number">{{ formatPhone(group.craftsman?.phone) || '暂无' }}</text>
            </view>
          </view>
        </view>
        <view v-if="group.items[0]?.assigned_craftsman_id" class="materials-btn"
          @click="handleViewMaterials(group.items[0])">
          <text class="btn-text">辅材清单</text>
          <uni-icons type="right" size="14" color="#00cec9" />
        </view>
      </view>

      <view class="group-item" v-for="(item, itemIndex) in group.items" :key="itemIndex">
        <view class="row">
          <view class="title">{{ item?.work_title }}</view>
          <view class="price">¥{{ formatCost(item?.work_price) }}</view>
        </view>
        <view class="group-item-container">
          <view>
            <view class="unit-price"> 数量：{{ item?.quantity }} </view>
            <view class="unit-price">单位：{{ item?.labour_cost_name }}</view>
            <view v-if="item?.is_set_minimum_price === '1'" class="minimum-price-badge">
              最低起步价：¥{{ formatCost(item?.minimum_price) }}
            </view>
          </view>
          <button class="accept-btn" :class="{ accepted: item?.is_accepted }" :disabled="item?.is_accepted"
            @click="handleAcceptOrderWorkPrice(item?.id)">
            <uni-icons v-if="item?.is_accepted" type="checkmarkempty" size="12" color="#07c160" />
            <text>{{ item?.is_accepted ? '已验收' : '确认验收' }}</text>
          </button>
        </view>
      </view>

      <!-- 施工进度（只展示第一个item的） -->
      <view v-if="group.items[0]?.latest_construction_progress" class="construction-progress">
        <view class="progress-header">
          <view class="progress-title">
            <uni-icons type="calendar" size="14" color="#6b7280" />
            <text class="progress-title-text">最新施工进度</text>
          </view>
          <view class="view-more-btn" @click="handleViewMoreProgress(group.items[0])">
            查看更多
          </view>
        </view>
        <view class="content-card">
          <!-- 日期和时间 -->
          <view class="date-time-row">
            <text class="date-time-text">
              {{
                formatDateTimeRange(
                  group.items[0].latest_construction_progress.start_time,
                  group.items[0].latest_construction_progress.end_time,
                )
              }}
            </text>
          </view>

          <!-- 地址 -->
          <view v-if="group.items[0]?.latest_construction_progress?.location" class="location-row">
            <text class="location-text">{{
              group.items[0].latest_construction_progress.location
              }}</text>
          </view>

          <!-- 工作描述 -->
          <view v-if="group.items[0]?.latest_construction_progress?.description" class="description">
            {{ group.items[0].latest_construction_progress.description }}
          </view>

          <!-- 照片网格 -->
          <view v-if="group.items[0]?.latest_construction_progress?.photos?.length" class="photos-grid">
            <view v-for="(photo, photoIndex) in getProgressPhotos(
              group.items[0].latest_construction_progress.photos,
            )" :key="photoIndex" class="photo-item" @click="
              handlePreviewImage(group.items[0].latest_construction_progress.photos, photoIndex)
              ">
              <image :src="photo" mode="aspectFill" class="photo-image" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 费用汇总底部 -->
    <view class="cost-summary">
      <view class="summary-divider"></view>

      <!-- 费用明细 -->
      <view class="summary-items">
        <view class="summary-item">
          <text class="summary-label">工价合计</text>
          <text class="summary-value">¥{{ formatCost(orderDetail?.total_price || 0) }}</text>
        </view>

        <view class="summary-item" v-if="orderDetail?.order_type === 'gangmaster'">
          <text class="summary-label">
            工长工费<text v-if="orderDetail?.visiting_service_num" class="visit-count">
              (上门{{ orderDetail.visiting_service_num }}次)</text>
          </text>
          <text class="summary-value">¥{{ formatCost(orderDetail?.gangmaster_cost || 0) }}</text>
        </view>

        <view class="summary-item">
          <text class="summary-label">平台服务费</text>
          <text class="summary-value">¥{{ formatCost(orderDetail?.total_service_fee || 0) }}</text>
        </view>
      </view>

      <!-- 总计 -->
      <view class="total-row">
        <text class="total-label">总计</text>
        <text class="total-amount">¥{{ formatCost(calculateFinalTotal()) }}</text>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="pending-pay" :class="{ paid: orderDetail?.is_paid }">
          <text>{{ orderDetail?.is_paid ? '已支付' : '待支付' }}</text>
          <uni-icons v-if="orderDetail?.is_paid" type="checkmarkempty" size="14" color="#07c160" />
        </view>
      </view>
    </view>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import card from '@/components/custom-card.vue'
import section_header from '@/components/section-header.vue'
import { formatCost, formatPhone, previewImage, formatDateTimeRange } from '@/utils'
import { acceptOrderWorkPriceService } from '../service'
const props = defineProps<{ orderDetail: any }>()
const emit = defineEmits<{ refresh: [] }>()

/**
 * 按工匠分组工价
 * - 同一个 assigned_craftsman.id → 一组
 * - 没有分配工匠 → 统一放到「未分配」
 */
const groupedWorkPrices = computed(() => {
  const map: Record<
    string | number,
    {
      craftsmanName: string
      craftsman: any
      items: any[]
    }
  > = {}

  const list = props.orderDetail?.parent_work_price_groups || []

  list.forEach((item: any) => {
    const craftsman = item.assigned_craftsman
    const key = craftsman?.id ?? 'unassigned'

    if (!map[key]) {
      map[key] = {
        craftsmanName: craftsman?.nickname || '未分配',
        craftsman: craftsman || null,
        items: [],
      }
    }

    map[key].items.push(item)
  })

  console.log(JSON.stringify(Object.values(map)), 'map')

  return Object.values(map)
})

// 验收单个工价项
const handleAcceptOrderWorkPrice = async (work_price_item_id: number): Promise<any> => {
  // 二次确认
  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认验收',
      content: '确定要验收此项工价吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#00cec9',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  const { success } = await acceptOrderWorkPriceService({
    work_price_item_id,
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    emit('refresh')
  }
}

// 计算最终总价（工价合计 + 工长费用 + 平台服务费）
const calculateFinalTotal = (): number => {
  // 施工费用
  const totalPrice = parseFloat(String(props.orderDetail?.total_price || 0)) || 0
  // 工长费用
  const gangmasterCost = parseFloat(String(props.orderDetail?.gangmaster_cost || 0)) || 0
  // 平台服务费：
  const serviceFee = parseFloat(String(props.orderDetail?.total_service_fee || 0)) || 0

  return totalPrice + gangmasterCost + serviceFee
}

// 跳转到辅材清单页面
const handleViewMaterials = (priceItem: any): void => {
  uni?.vibrateShort()
  const assignedCraftsmanId = priceItem.assigned_craftsman_id || ''
  const orderType = props.orderDetail?.order_type || ''

  uni.navigateTo({
    url: `/subpackages/work-price-materials/index?workPriceItemId=${priceItem.id}&orderId=${props.orderDetail?.id || ''}&assignedCraftsmanId=${assignedCraftsmanId}&orderType=${orderType}`,
  })
}

const handleViewMaterialsByOrderId = (): void => {
  uni?.vibrateShort()
  const { id, orderType } = props.orderDetail || {}
  uni.navigateTo({
    url: `/subpackages/work-price-materials/index?orderId=${id || ''}&orderType=${orderType}`,
  })
}

// 获取施工进度图片（最多3张）
const getProgressPhotos = (photos: string[]): string[] => {
  if (!photos || !Array.isArray(photos)) return []
  return photos.slice(0, 3)
}

// 预览图片
const handlePreviewImage = (urls: string[], currentIndex: number | string): void => {
  const index = typeof currentIndex === 'string' ? parseInt(currentIndex, 10) : currentIndex
  previewImage(urls[index], urls)
}

// 查看更多施工进度
const handleViewMoreProgress = (item: any): void => {
  uni?.vibrateShort()

  if (!item?.id || !item?.assigned_craftsman_id) {
    uni.showToast({
      title: '参数错误',
      icon: 'none',
    })
    return
  }

  uni.navigateTo({
    url: `/subpackages/construction-progress/index?workPriceItemId=${item.id}&craftsmanId=${item.assigned_craftsman_id}`,
  })
}
</script>

<style lang="scss" scoped>
.header-materials-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  background-color: #f0fdfa;
  flex-shrink: 0;

  .btn-text {
    font-size: 24rpx;
    font-weight: 500;
    color: #00cec9;
  }
}

.group-item {
  border: 1px solid #f5f5f5;
  border-radius: 12rpx;
  padding: 32rpx;
  background-color: rgba(249, 250, 251, 0.5);

  margin-bottom: 24rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
}

.group-item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
}

.title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  min-width: 0;
}

.unit-price {
  font-size: 24rpx;
  color: #4b5563;
}

.minimum-price-badge {
  display: inline-block;
  font-size: 24rpx;
  color: #00cec9;
  background-color: rgba(0, 206, 201, 0.05);
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  margin-top: 16rpx;
}

.price {
  font-size: 32rpx;
  font-weight: bold;
  color: #00cec9;
  flex-shrink: 0;
  white-space: nowrap;
}

.accept-btn {
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #fff;
  background-color: #00cec9;
  box-shadow: 0 2rpx 8rpx rgba(0, 206, 201, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;

  &.accepted {
    background-color: transparent;
    color: #07c160;
    box-shadow: none;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 4rpx;
    font-size: 24rpx;
    font-weight: 400;
  }
}

.construction-progress {
  margin-top: 24rpx;
  margin-bottom: 24rpx;

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .progress-title {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #6b7280;

      .progress-title-text {
        font-size: 24rpx;
        color: #6b7280;
      }
    }

    .view-more-btn {
      font-size: 24rpx;
      color: #00cec9;
    }
  }

  .content-card {
    flex: 1;
    background-color: #f9fafb;
    border-radius: 16px;
    padding: 16px;
    min-width: 0;
  }

  .date-time-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
  }

  .date-time-text {
    font-size: 24rpx;
    color: #666;
    flex: 1;
    word-break: break-all;
    line-height: 1.5;
  }

  .location-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    font-size: 24rpx;
    color: #666;
  }

  .location-text {
    font-size: 14px;
    color: #666;
    flex: 1;
    line-height: 1.5;
  }

  .description {
    margin-bottom: 12px;
    font-size: 15px;
    color: #374151;
    font-weight: 500;
    line-height: 1.5;
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .photo-item {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    transition: opacity 0.2s;

    .photo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.group-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 24rpx;

  .header-left {
    display: flex;
    align-items: center;
    gap: 24rpx;
    flex: 1;
    min-width: 0;

    .avatar-wrapper {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      flex-shrink: 0;
      background-color: #f9fafb;

      .avatar {
        width: 100%;
        height: 100%;
      }

      .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0fdfa;
      }
    }

    .header-info {
      flex: 1;
      min-width: 0;

      .craftsman-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #111827;
        line-height: 1.4;
        margin-bottom: 8rpx;
      }

      .phone-info {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #6b7280;
        line-height: 1.4;

        .phone-number {
          font-size: 24rpx;
          color: #6b7280;
        }
      }
    }
  }

  .materials-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    border-radius: 12rpx;
    background-color: #f0fdfa;
    flex-shrink: 0;
    margin-left: auto;

    .btn-text {
      font-size: 24rpx;
      font-weight: 500;
      color: #00cec9;
    }
  }
}

.cost-summary {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 2px solid #e5e7eb;

  .summary-divider {
    display: none;
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    margin-bottom: 32rpx;

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .summary-label {
        font-size: 24rpx;
        color: #6b7280;
        font-weight: 400;

        .visit-count {
          font-size: 24rpx;
          color: #6b7280;
          font-weight: 400;
        }
      }

      .summary-value {
        font-size: 24rpx;
        color: #111827;
        font-weight: 600;
      }
    }
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;
    border-top: 1px solid #e5e7eb;
    margin-bottom: 32rpx;

    .total-label {
      font-size: 28rpx;
      color: #111827;
      font-weight: 600;
    }

    .total-amount {
      font-size: 48rpx;
      color: #00cec9;
      font-weight: 700;
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32rpx;

    .pending-pay {
      padding: 8rpx 24rpx;
      border-radius: 16rpx;
      font-size: 24rpx;
      font-weight: 600;
      background-color: rgba(253, 203, 110, 0.125);
      color: rgb(253, 203, 110);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;

      &.paid {
        background-color: rgba(7, 193, 96, 0.1);
        color: #07c160;
        box-shadow: none;
      }
    }
  }
}
</style>
