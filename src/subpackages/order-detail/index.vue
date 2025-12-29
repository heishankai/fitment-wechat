<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
      @scroll="onScroll"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <!-- 订单基本信息 -->
      <OrderInfoCard :orderDetail="orderDetail" />
      <view class="divider-view"></view>

      <!-- 工匠信息 -->
      <CraftsmanCard v-if="orderDetail?.craftsman_user" :craftsman="orderDetail.craftsman_user" />
      <view v-if="orderDetail?.craftsman_user" class="divider-view"></view>

      <!-- 费用清单 -->
      <OrderCostCard
        v-if="orderDetail?.parent_work_price_groups?.length"
        :orderDetail="orderDetail"
        @refresh="() => orderId && loadOrderDetail(orderId)"
      />
      <view v-if="orderDetail?.parent_work_price_groups?.length" class="divider-view"></view>

      <!-- 子费用清单 -->
      <SubWorkPriceList
        v-if="subWorkPricesList?.length"
        :sub-work-prices="subWorkPricesList"
        :order-detail="orderDetail"
        @refresh="() => orderId && loadOrderDetail(orderId)"
      />
      <view v-if="subWorkPricesList?.length" class="divider-view"></view>

      <!-- 辅材清单 -->
      <MaterialsListCard
        v-if="materialsList && materialsList.commodity_list?.length"
        :materials-data="materialsList"
        :order-detail="orderDetail"
        @refresh="() => orderId && loadOrderDetail(orderId)"
      />
      <view v-if="materialsList && materialsList.commodity_list?.length" class="divider-view"></view>

      <!-- 施工进度 -->
      <ConstructionProgressCard
        v-if="constructionProgress && constructionProgress.length > 0"
        :progress="constructionProgress"
      />
    </scroll-view>
    <view class="footer">
      <!-- 待接单状态：显示取消订单和联系工匠按钮 -->
      <template v-if="orderDetail?.order_status === 1">
        <button class="cancel-btn" @click="handleCancelOrder">
          <uni-icons type="close" size="20" color="#ff6b6b" />取消订单
        </button>
        <button class="consult-btn" @click="handleConsult">
          <uni-icons type="chat" size="20" color="#fff" />联系工匠
        </button>
      </template>
      <!-- 其他状态：只显示联系工匠按钮 -->
      <template v-else>
        <button class="consult-btn" @click="handleConsult">
          <uni-icons type="chat" size="20" color="#fff" />联系工匠
        </button>
      </template>
    </view>

    <ContactService :scrollTop="scrollTop" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import OrderInfoCard from './components/order-info-card.vue'
import OrderCostCard from './components/order-cost-card.vue'
import SubWorkPriceList from './components/sub-work-price-list.vue'
import MaterialsListCard from './components/materials-list-card.vue'
import CraftsmanCard from './components/craftsman-card.vue'
import ConstructionProgressCard from './components/construction-progress-card.vue'
import ContactService from '@/components/contact-service.vue'
import {
  getOrderDetailService,
  cancelOrderService,
  getConstructionProgressByOrderId,
  getMaterialsByOrderId,
  getSubWorkPricesByOrderId,
} from './service'
import { handleContactUser } from './utils'

// 响应式数据
const orderDetail = ref<any>({})
const subWorkPricesList = ref<any[]>([])
const scrollTop = ref<number>(0)
const isTriggered = ref(false)
const orderId = ref<number | string>('')
const constructionProgress = ref<any[]>([])
const materialsList = ref<any>(null)

// 加载订单详情
const loadOrderDetail = async (id: number | string): Promise<void> => {
  const { success, data } = await getOrderDetailService(id)
  if (!success) return
  orderDetail.value = data

  // 加载施工进度
  const { success: progressSuccess, data: progressData } =
    await getConstructionProgressByOrderId(id)
  if (progressSuccess) {
    constructionProgress.value = progressData || []
  }

  // 加载辅材列表
  const { success: materialsSuccess, data: materialsData } = await getMaterialsByOrderId(id)
  if (materialsSuccess) {
    materialsList.value = materialsData || null
  }

  // 加载子工价列表
  const { success: subWorkPricesSuccess, data: subWorkPricesData } =
    await getSubWorkPricesByOrderId(id)
  if (subWorkPricesSuccess) {
    subWorkPricesList.value = subWorkPricesData || []
  }
}

// 处理滚动事件
const onScroll = (e: any): void => (scrollTop.value = e.detail.scrollTop)

// 下拉刷新
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  if (orderId.value) {
    await loadOrderDetail(orderId.value)
  }
  isTriggered.value = false
}

const handleConsult = (): void => {
  uni?.vibrateShort()
  handleContactUser(orderDetail.value?.craftsman_user)
}

// 取消订单
const handleCancelOrder = async (): Promise<void> => {
  uni?.vibrateShort()

  // 确认取消
  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此订单吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  wx.showLoading({ title: '取消中...', mask: true })

  try {
    const { success, message } = await cancelOrderService({
      orderId: Number(orderId.value),
    })

    wx.hideLoading()

    if (!success) {
      wx.showToast({
        title: message || '取消失败，请重试',
        icon: 'none',
      })
      return
    }

    wx.showToast({ title: '订单已取消', icon: 'success' })

    // 刷新订单详情
    if (orderId.value) {
      await loadOrderDetail(orderId.value)
    }

    // 延迟返回上一页，让用户看到更新后的状态
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  } catch (error: any) {
    console.error('取消订单失败:', error)
    wx.hideLoading()
  }
}

// 页面加载
onLoad((options) => {
  const { id } = options ?? {}
  orderId.value = id
  loadOrderDetail(id)
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
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
  padding: 16px;
  box-sizing: border-box;
}

.divider-view {
  height: 16px;
}

// 底部按钮
.footer {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0; // 防止按钮被压缩
  display: flex;
  gap: 12px;

  .cancel-btn {
    flex: 1;
    height: 48px;
    background: #fff;
    color: #ff6b6b;
    border: 1px solid #ff6b6b;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:active {
      opacity: 0.8;
      background: #fff5f5;
    }
  }

  .consult-btn {
    flex: 1;
    height: 48px;
    background: linear-gradient(135deg, #00cec9, #00b4d8);
    color: #fff;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:active {
      opacity: 0.8;
    }
  }

  // 当只有一个按钮时，占满宽度
  button:only-child {
    flex: 1;
    width: 100%;
  }
}
</style>
