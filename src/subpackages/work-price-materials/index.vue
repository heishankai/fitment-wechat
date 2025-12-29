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
      <!-- 辅材清单 -->
      <MaterialsListCard
        v-if="materialsList?.commodity_list?.length"
        :materials-data="materialsList"
        :order-detail="orderDetail"
        @refresh="loadMaterials"
      />

      <!-- 空状态 -->
      <view v-else class="empty-container">
        <empty-state />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MaterialsListCard from '../order-detail/components/materials-list-card.vue'
import EmptyState from '@/components/empty-state.vue'
import { getMaterialsByWorkPriceItemIdAndCraftsman } from '../order-detail/service'

// 响应式数据
const workPriceItemId = ref<number | string>('')
const assignedCraftsmanId = ref<number | string>('')
const materialsList = ref<any>(null)
const orderDetail = ref<any>({})
const isTriggered = ref(false)
const loading = ref(false)

// 加载辅材列表
const loadMaterials = async (): Promise<void> => {
  if (!workPriceItemId.value || !assignedCraftsmanId.value) return

  loading.value = true

  const { success, data } = await getMaterialsByWorkPriceItemIdAndCraftsman(
    workPriceItemId.value,
    assignedCraftsmanId.value,
  )

  if (success) {
    materialsList.value = data || null
  }

  loading.value = false
}

// 下拉刷新
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true
  await loadMaterials()
  isTriggered.value = false
}

// 页面加载
onLoad((options) => {
  const { workPriceItemId: id, orderId: oid, assignedCraftsmanId: craftsmanId } = options ?? {}

  if (!id || !craftsmanId) {
    uni.showToast({
      title: '参数错误',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }

  workPriceItemId.value = id
  assignedCraftsmanId.value = craftsmanId

  if (oid) {
    orderDetail.value = { id: oid }
  }

  loadMaterials()
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

.empty-container {
  padding: 40px 0;
}
</style>
