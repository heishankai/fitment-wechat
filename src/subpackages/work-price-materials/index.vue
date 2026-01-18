<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <view v-if="materialsList?.commodity_list?.length" class="materials-container">
        <view class="materials-list">
          <view
            v-for="commodity in materialsList.commodity_list"
            :key="commodity.id"
            class="material-item"
          >
            <!-- 商品图片 -->
            <image
              v-if="commodity.commodity_cover && commodity.commodity_cover.length > 0"
              :src="commodity.commodity_cover[0]"
              mode="aspectFill"
              class="material-image"
              @click.stop="previewImage(commodity.commodity_cover[0], commodity.commodity_cover)"
            />
            <view v-else class="material-image-placeholder">
              <uni-icons type="shop" size="32" color="#ccc" />
            </view>

            <!-- 商品信息 -->
            <view class="material-info">
              <text class="material-name">{{ commodity.commodity_name }}</text>
              <text class="material-meta">
                ¥{{ formatCost(getUnitPrice(commodity)) }}/{{ commodity.commodity_unit }} ×
                {{ commodity.quantity }} {{ commodity.commodity_unit }}
              </text>
              <view class="material-footer">
                <text class="material-total-price"
                  >¥{{ formatCost(commodity.settlement_amount) }}</text
                >
                <view v-if="commodity.is_accepted" class="accepted-status">
                  <uni-icons type="checkmarkempty" size="12" color="#07c160" />
                  <text class="accepted-text">已验收</text>
                </view>
                <button
                  v-else
                  class="accept-btn"
                  @click.stop="handleAcceptMaterial(Number(commodity.id))"
                >
                  确认验收
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <empty-state v-else text="暂无辅材清单" />
    </scroll-view>

    <!-- 底部统计栏 -->
    <view v-if="materialsList?.commodity_list?.length" class="bottom-bar">
      <view class="bottom-content">
        <view class="summary-row">
          <text class="summary-label">辅材合计</text>
          <text class="summary-count">共 {{ totalQuantity }} 件</text>
        </view>
        <view class="summary-row total-row">
          <text class="total-label">总价</text>
          <text class="total-price">¥{{ formatCost(materialsList?.total_price || 0) }}</text>
        </view>
        <button v-if="hasUnacceptedMaterials" class="batch-accept-btn" @click="handleBatchAccept">
          全部确认验收
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import emptyState from '@/components/empty-state.vue'
import {
  getMaterialsByWorkPriceItemIdAndCraftsman,
  getMaterialsByOrderId,
  acceptOrderMaterialsService,
  batchAcceptOrderMaterialsService,
} from '../order-detail/service'
import { formatCost, previewImage } from '@/utils'

// 响应式数据
const workPriceItemId = ref<number | string>('')
const assignedCraftsmanId = ref<number | string>('')
const orderId = ref<number | string>('')
const orderType = ref<string>('')
const materialsList = ref<any>(null)
const isTriggered = ref(false)

// 计算总数量
const totalQuantity = computed(() => {
  if (!materialsList.value?.commodity_list) return 0
  return materialsList.value.commodity_list.reduce((sum: number, item: any) => {
    return sum + (Number(item.quantity) || 0)
  }, 0)
})

// 检查是否有未验收的辅材
const hasUnacceptedMaterials = computed(() => {
  if (!materialsList.value?.commodity_list) return false
  return materialsList.value.commodity_list.some((commodity: any) => !commodity.is_accepted)
})

// 计算单价
const getUnitPrice = (commodity: any): number => {
  if (!commodity.quantity || commodity.quantity === 0) return 0
  return Number(commodity.settlement_amount) / Number(commodity.quantity)
}

// 加载辅材列表
const loadMaterials = async (): Promise<void> => {
  // 根据 order_type 选择不同的接口
  if (orderType.value === 'gangmaster') {
    // 工长订单：使用工价项ID和工匠ID获取辅材
    if (!workPriceItemId.value || !assignedCraftsmanId.value) return

    const { success, data } = await getMaterialsByWorkPriceItemIdAndCraftsman(
      workPriceItemId.value,
      assignedCraftsmanId.value,
    )

    if (success) {
      materialsList.value = data || null
    }
  } else {
    // 其他订单类型：使用订单ID获取辅材
    if (!orderId.value) return

    const { success, data } = await getMaterialsByOrderId(orderId.value)

    if (success) {
      materialsList.value = data || null
    }
  }
}

// 下拉刷新
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadMaterials()
  isTriggered.value = false
}

// 验收单个辅材商品
const handleAcceptMaterial = async (materialsId: number): Promise<any> => {
  uni?.vibrateShort()

  // 二次确认
  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认验收',
      content: '确定要验收此项辅材吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#00cec9',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  const { success } = await acceptOrderMaterialsService({
    materialsId,
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    await loadMaterials()
  }
}

// 一键验收所有辅材
const handleBatchAccept = async (): Promise<void> => {
  uni?.vibrateShort()

  if (!materialsList.value?.commodity_list) {
    wx.showToast({ title: '辅材信息错误', icon: 'none' })
    return
  }

  // 收集未验收的辅材ID
  const unacceptedMaterialsIds = materialsList.value.commodity_list
    .filter((commodity: any) => !commodity.is_accepted)
    .map((commodity: any) => Number(commodity.id))

  if (unacceptedMaterialsIds.length === 0) {
    wx.showToast({ title: '没有未验收的辅材', icon: 'none' })
    return
  }

  // 二次确认
  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认一键验收',
      content: `确定要验收 ${unacceptedMaterialsIds.length} 项辅材吗？`,
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#00cec9',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  wx.showLoading({ title: '验收中...', mask: true })

  try {
    const { success, message } = await batchAcceptOrderMaterialsService({
      materialsIds: unacceptedMaterialsIds,
    })

    wx.hideLoading()

    if (!success) {
      wx.showToast({
        title: message || '验收失败，请重试',
        icon: 'none',
      })
      return
    }

    wx.showToast({ title: '验收成功', icon: 'success' })
    await loadMaterials()
  } catch (error: any) {
    console.error('批量验收失败:', error)
    wx.hideLoading()
    wx.showToast({
      title: '验收失败，请重试',
      icon: 'none',
    })
  }
}

// 页面加载
onLoad((options) => {
  const {
    workPriceItemId: id,
    assignedCraftsmanId: craftsmanId,
    orderId: oId,
    orderType: oType,
  } = options ?? {}

  workPriceItemId.value = id || ''
  assignedCraftsmanId.value = craftsmanId || ''
  orderId.value = oId || ''
  orderType.value = oType || ''

  loadMaterials()
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 0;
}

.materials-container {
  padding: 16px;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.material-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.material-image {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.material-image-placeholder {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.material-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.material-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.material-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.material-total-price {
  font-size: 18px;
  font-weight: 600;
  color: #00cec9;
}

.accepted-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.accepted-text {
  font-size: 12px;
  color: #07c160;
}

.accept-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #fff;
  background-color: #00cec9;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }

  &:active {
    opacity: 0.9;
  }
}

.bottom-bar {
  flex-shrink: 0;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.bottom-content {
  max-width: 100%;
  margin: 0 auto;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  &.total-row {
    margin-bottom: 12px;
  }
}

.summary-label {
  font-size: 14px;
  color: #666;
}

.summary-count {
  font-size: 12px;
  color: #999;
}

.total-label {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #00cec9;
}

.batch-accept-btn {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #00cec9 0%, #0fb9b1 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }

  &:active {
    opacity: 0.9;
  }
}
</style>
