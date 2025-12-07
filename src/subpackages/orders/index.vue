<template>
  <view class="container">
    <!-- Tab 切换 -->
    <view class="tabs-container">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="handleTabSwitch(tab.key)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- 订单列表 - 使用 swiper 支持滑动切换 -->
    <swiper
      class="swiper-container"
      :current="currentIndex"
      @change="handleSwiperChange"
      :duration="300"
    >
      <swiper-item v-for="(tab, tabIndex) in tabs" :key="tab.key" class="swiper-item">
        <scroll-view
          class="scroll-view"
          scroll-y
          refresher-enabled
          :refresher-triggered="refresherTriggered[tabIndex]"
          @refresherrefresh="() => handleRefresherRefresh(tabIndex)"
        >
          <view
            v-for="order in getOrderListByStatus(tab.status)"
            :key="order.id"
            class="order-card"
            @click="handleOrderClick(order)"
          >
            <!-- 订单头部 -->
            <view class="order-header">
              <view class="order-info">
                <text class="order-title">{{ order.work_kind_name || '订单' }}</text>
                <text class="order-status" :class="getStatusClass(order.order_status)">
                  {{ order.order_status_name }}
                </text>
              </view>
              <text class="order-time">{{ formatTime(order.createdAt) }}</text>
            </view>

            <!-- 订单详情 -->
            <view class="order-details">
              <view class="detail-item">
                <uni-icons type="location" size="14" color="#666" />
                <text class="detail-text">{{ order.location }}</text>
              </view>
              <view class="detail-item">
                <uni-icons type="home" size="14" color="#666" />
                <text class="detail-text">{{ order.roomType }} · {{ order.area }}m²</text>
              </view>
            </view>

            <!-- 工匠信息（如果有） -->
            <view v-if="order.craftsman_user" class="craftsman-info">
              <image
                :src="order.craftsman_user.avatar"
                mode="aspectFill"
                class="craftsman-avatar"
              />
              <text class="craftsman-name">{{ order.craftsman_user.nickname }}</text>
            </view>
          </view>

          <!-- 空状态 -->
          <empty-state v-if="!getOrderListByStatus(tab.status).length" />
        </scroll-view>
      </swiper-item>
    </swiper>

    <contact-service />
  </view>
</template>

<script setup lang="ts">
import contactService from '@/components/contact-service.vue'
import emptyState from '@/components/empty-state.vue'
import { formatTime } from '@/utils'
import { getOrderListService } from './service'

// Tab 配置
const tabs = [
  { key: '0', name: '全部', status: null },
  { key: '1', name: '待接单', status: 1 },
  { key: '2', name: '已接单', status: 2 },
  { key: '3', name: '已完成', status: 3 },
  { key: '4', name: '已取消', status: 4 },
]

const activeTab = ref('0')
const currentIndex = ref(0)
const orderList = ref<any[]>([])
const refresherTriggered = ref<boolean[]>(new Array(5).fill(false))

// 根据状态获取订单列表
const getOrderListByStatus = (status: number | null): any[] => {
  if (status === null) {
    return orderList.value
  }
  return orderList.value.filter((order) => order.order_status === status)
}

// Tab 切换
const handleTabSwitch = (key: string): void => {
  const index = tabs.findIndex((tab) => tab.key === key)
  if (index !== -1) {
    currentIndex.value = index
    activeTab.value = key
  }
}

// Swiper 滑动切换
const handleSwiperChange = (e: any): void => {
  const index = e.detail.current
  currentIndex.value = index
  activeTab.value = tabs[index].key
}

// 获取状态样式类
const getStatusClass = (status: number): string => {
  const statusMap: Record<number, string> = {
    1: 'status-pending',
    2: 'status-accepted',
    3: 'status-completed',
    4: 'status-cancelled',
  }
  return statusMap[status] || ''
}

// 点击订单
const handleOrderClick = (order: any): void => {
  if (order?.id) {
    wx.navigateTo({
      url: `/subpackages/order-detail/index?id=${order.id}`,
    })
  }
}

// 获取订单列表
const getOrderList = async (): Promise<void> => {
  const { success, data } = await getOrderListService()
  if (success && data) {
    orderList.value = data
  }
}

// 下拉刷新
const handleRefresherRefresh = async (tabIndex: number): Promise<void> => {
  refresherTriggered.value[tabIndex] = true
  await getOrderList()
  refresherTriggered.value[tabIndex] = false
}

onLoad(() => {
  getOrderList()
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

// Tab 切换
.tabs-container {
  background: #fff;
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  .tab {
    flex: 1;
    padding: 16px 0;
    text-align: center;
    font-size: 15px;
    color: #666;
    transition: all 0.3s;
    font-weight: 500;
    position: relative;

    &.active {
      color: #00cec9;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 3px;
        background: linear-gradient(135deg, #00cec9, #00b4d8);
        border-radius: 2px 2px 0 0;
      }
    }
  }
}

.swiper-container {
  flex: 1;
  width: 100%;
  height: 100%;
}

.swiper-item {
  width: 100%;
  height: 100%;
}

.scroll-view {
  height: 100%;
  overflow: hidden;
  padding: 16px 0;
  box-sizing: border-box;
}

// 订单卡片
.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .order-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .order-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .order-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.status-pending {
          background: #fff3cd;
          color: #856404;
        }

        &.status-accepted {
          background: #d1ecf1;
          color: #0c5460;
        }

        &.status-completed {
          background: #d4edda;
          color: #155724;
        }

        &.status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }
      }
    }

    .order-time {
      font-size: 12px;
      color: #999;
    }
  }

  .order-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;

    .detail-item {
      display: flex;
      align-items: center;
      gap: 6px;

      .detail-text {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .craftsman-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 8px;

    .craftsman-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .craftsman-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
