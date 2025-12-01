<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
      @scroll="onScroll"
    >
      <!-- 订单基本信息 -->
      <OrderInfoCard :orderDetail="orderDetail" />
      <view class="divider-view"></view>

      <!-- 工匠信息 -->
      <CraftsmanCard v-if="orderDetail?.craftsman_user" :craftsman="orderDetail.craftsman_user" />
      <view v-if="orderDetail?.craftsman_user" class="divider-view"></view>

      <!-- 费用明细 -->
      <OrderCostCard v-if="orderDetail?.work_prices" :orderDetail="orderDetail" />
      <view class="divider-view"></view>

      <!-- 施工进度 -->
      <ConstructionProgressCard
        v-if="orderDetail?.construction_progress && orderDetail.construction_progress.length > 0"
        :progress="orderDetail.construction_progress"
      />
    </scroll-view>
    <view class="footer">
      <button class="consult-btn" @click="handleConsult">
        <uni-icons type="chat" size="20" color="#fff" />联系工匠
      </button>
    </view>

    <ContactService :scrollTop="scrollTop" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import OrderInfoCard from './components/order-info-card.vue'
import OrderCostCard from './components/order-cost-card.vue'
import CraftsmanCard from './components/craftsman-card.vue'
import ConstructionProgressCard from './components/construction-progress-card.vue'
import ContactService from '@/components/contact-service.vue'
import { getOrderDetailService } from './service'
import { handleContactUser } from './utils'

// 响应式数据
const orderDetail = ref<any>(null)
const scrollTop = ref<number>(0)

// 加载订单详情
const loadOrderDetail = async (id: number | string): Promise<void> => {
  const { success, data } = await getOrderDetailService(id)
  if (!success) return
  orderDetail.value = data
}

// 处理滚动事件
const onScroll = (e: any): void => (scrollTop.value = e.detail.scrollTop)

const handleConsult = (): void => {
  uni?.vibrateShort()
  handleContactUser(orderDetail.value?.craftsman_user)
}

// 页面加载
onLoad((options) => {
  const { id } = options ?? {}
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

  .consult-btn {
    width: 100%;
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
}
</style>
