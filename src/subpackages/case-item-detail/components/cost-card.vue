<template>
  <custom-card>
    <!-- 卡片头部 -->
    <view class="card-header">
      <uni-icons type="wallet" color="#00cec9" size="20" />
      <text class="card-title">费用明细</text>
    </view>

    <!-- 费用列表 -->
    <view class="cost-list" aria-label="费用明细">
      <view class="cost-item">
        <text class="cost-label">施工费用</text>
        <text class="cost-value">¥{{ formatCost(caseDetail?.construction_cost) }}</text>
      </view>

      <view class="cost-item no-border">
        <text class="cost-label">辅材费用</text>
        <text class="cost-value">¥{{ formatCost(caseDetail?.auxiliary_material_cost) }}</text>
      </view>

      <view class="cost-item total">
        <text class="cost-label">总费用</text>
        <text class="cost-value total-cost">¥{{ formatCost(totalCost) }}</text>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import customCard from '@/components/custom-card.vue'
import { formatCost } from '@/utils'

const props = defineProps<{ caseDetail: Record<string, any> }>()

/** 计算总费用 */
const totalCost = computed(() => {
  const { construction_cost = 0, auxiliary_material_cost = 0 } = props.caseDetail || {}
  return Number(construction_cost) + Number(auxiliary_material_cost)
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
  }
}

.cost-list {
  display: flex;
  flex-direction: column;

  .cost-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    &.no-border {
      border-bottom: none; /* 去掉双线问题 */
    }

    &.total {
      margin-top: 6px;
      padding-top: 14px;
      border-top: 1px solid #e9ecef; /* 总费用顶部线 */
      border-bottom: none;

      .cost-label {
        font-weight: 700;
      }

      .total-cost {
        color: #00cec9;
        font-weight: 700;
        font-size: 18px;
      }
    }

    .cost-label {
      font-size: 15px;
      color: #495057;
    }

    .cost-value {
      font-size: 15px;
      font-weight: 600;
      color: #2c3e50;
    }
  }
}
</style>
