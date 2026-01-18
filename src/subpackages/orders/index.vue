<template>
  <view class="container">
    <!-- Tabs -->
    <view class="tabs-container">
      <view
        v-for="(tab, index) in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: currentIndex === index }"
        @click="switchTab(index)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- Swiper -->
    <swiper
      class="swiper-container"
      :current="currentIndex"
      @change="onSwiperChange"
      :duration="300"
    >
      <swiper-item v-for="(tab, index) in tabs" :key="tab.key" class="swiper-item">
        <scroll-view
          class="scroll-view"
          scroll-y
          refresher-enabled
          :refresher-triggered="refresherTriggered[index]"
          @refresherrefresh="() => refresh(index)"
        >
          <!-- Order List -->
          <view
            v-for="order in orderMap[tab.status]"
            :key="order.id"
            class="order-card"
            @click="goDetail(order.id)"
          >
            <!-- Tags -->
            <view class="order-tags">
              <view class="house-type-tag" :class="houseTypeMap[order.houseType]?.class">
                {{ houseTypeMap[order.houseType]?.text }}
              </view>
              <view class="status-tag" :class="statusClassMap[order.order_status]">
                {{ order.order_status_name }}
              </view>
            </view>

            <!-- Title -->
            <view class="order-title">
              {{ order.work_kind_name || '订单' }}
            </view>

            <!-- Details -->
            <view class="order-details">
              <view class="detail-item">
                <uni-icons type="calendar" size="14" color="#999" />
                <text class="detail-text">
                  {{ formatDate(order.createdAt) }}
                </text>
              </view>
              <view class="detail-item">
                <uni-icons type="home" size="14" color="#999" />
                <text class="detail-text">
                  {{ formatLocation(order) }}
                </text>
              </view>
            </view>

            <view class="arrow-icon">
              <uni-icons type="arrow-right" size="16" color="#ccc" />
            </view>
          </view>

          <!-- Empty -->
          <empty-state v-if="!orderMap[tab.status]?.length" />
        </scroll-view>
      </swiper-item>
    </swiper>

    <contact-service />
  </view>
</template>

<script setup lang="ts">
import contactService from '@/components/contact-service.vue'
import emptyState from '@/components/empty-state.vue'
import { getOrderListService } from './service'

/* ================= Tabs ================= */
const tabs = [
  { key: 'construction', name: '施工中', status: 2 },
  { key: 'pending', name: '待开工', status: 1 },
  { key: 'cancelled', name: '已取消', status: 4 },
  { key: 'completed', name: '已完工', status: 3 },
]

/* ================= 映射配置 ================= */
const houseTypeMap: Record<string, { text: string; class: string }> = {
  new: { text: '新房', class: 'house-type-new' },
  old: { text: '旧房', class: 'house-type-old' },
}

const statusClassMap: Record<number, string> = {
  1: 'status-pending',
  2: 'status-construction',
  3: 'status-completed',
  4: 'status-cancelled',
}

/* ================= State ================= */
const currentIndex = ref(0)
const orderList = ref<any[]>([])
const refresherTriggered = ref<boolean[]>(tabs.map(() => false))

/* ================= Computed ================= */
/** 按订单状态分组，避免模板中重复 filter */
const orderMap = computed<Record<number, any[]>>(() => {
  const map: Record<number, any[]> = {}
  tabs.forEach((tab) => (map[tab.status] = []))
  orderList.value.forEach((order) => {
    map[order.order_status]?.push(order)
  })
  return map
})

/* ================= Actions ================= */
const switchTab = (index: number): void => {
  currentIndex.value = index
}

const onSwiperChange = (e: any): void => {
  currentIndex.value = e.detail.current
}

const goDetail = (id: string): void => {
  wx.navigateTo({
    url: `/subpackages/order-detail/index?id=${id}`,
  })
}

const refresh = async (index: number): Promise<void> => {
  refresherTriggered.value[index] = true
  await fetchOrders()
  refresherTriggered.value[index] = false
}

const fetchOrders = async (): Promise<void> => {
  const { success, data } = await getOrderListService()
  if (success) {
    orderList.value = data || []
  }
}

/* ================= Utils ================= */
const formatDate = (date?: string): string => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

const formatLocation = (order: any): string =>
  [order.location, order.roomType].filter(Boolean).join(' ') || '暂无信息'

onLoad(fetchOrders)
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Tabs */
.tabs-container {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .tab {
    flex: 1;
    padding: 16px 0;
    text-align: center;
    font-size: 15px;
    color: #999;
    position: relative;

    &.active {
      color: #333;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 2px;
        background: #00cec9;
      }
    }
  }
}

/* Swiper */
.swiper-container,
.swiper-item {
  flex: 1;
  height: 100%;
}

.scroll-view {
  height: 100%;
  padding: 12px 0;
}

/* Order Card */
.order-card {
  position: relative;
  background: #fff;
  margin: 0 16px 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .order-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .house-type-tag,
  .status-tag {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 12px;
  }

  .house-type-new {
    background: #00cec9;
    color: #fff;
  }

  .house-type-old {
    background: #ff6b9d;
    color: #fff;
  }

  .status-pending {
    background: rgba(253, 203, 110, 0.15);
    color: rgb(253, 203, 110);
  }

  .status-construction {
    background: rgba(0, 206, 201, 0.15);
    color: rgb(0, 206, 201);
  }

  .status-completed {
    background: rgba(85, 239, 196, 0.15);
    color: rgb(85, 239, 196);
  }

  .status-cancelled {
    background: rgba(223, 230, 233, 0.15);
    color: rgb(160, 160, 160);
  }

  .order-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-right: 30px;
  }

  .order-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 30px;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #666;
  }

  .arrow-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
