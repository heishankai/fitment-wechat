<template>
  <custom-card>
    <!-- 卡片头部 -->
    <view class="card-header">
      <uni-icons type="wallet" color="#00cec9" size="20" />
      <text class="card-title">费用明细</text>
    </view>

    <!-- 费用列表 -->
    <view class="cost-list">
      <view
        v-for="(workPrice, index) in props.orderDetail?.work_prices"
        :key="index"
        class="work-price-section"
      >
        <!-- <view class="work-price-header">
          <text class="work-price-title">{{ workPrice.work_kind_name?.label || '工种' }}</text>
          <text class="work-price-total">¥{{ formatCost(workPrice.total_price) }}</text>
        </view> -->

        <view
          v-for="(priceItem, priceIndex) in workPrice.prices_list"
          :key="priceItem.id"
          class="cost-item"
          :class="{ 'no-border': priceIndex === workPrice.prices_list.length - 1 }"
        >
          <view class="cost-item-left">
            <text class="cost-label">{{ priceItem.work_title }}</text>
            <view class="cost-meta">
              <text class="cost-quantity">数量: {{ priceItem.quantity }}</text>
              <text
                v-if="priceItem.is_set_minimum_price === '1' && priceItem.minimum_price"
                class="cost-minimum"
              >
                最低价: ¥{{ formatCost(priceItem.minimum_price) }}
              </text>
            </view>
          </view>
          <text class="cost-value">¥{{ formatCost(priceItem.work_price) }}</text>
        </view>
      </view>

      <view class="cost-item total">
        <text class="cost-label">总费用含(10%平台服务费)</text>
        <text class="cost-value total-cost">¥{{ formatCost(totalCost) }}</text>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import customCard from '@/components/custom-card.vue'
import { formatCost } from '@/utils'

const props = defineProps<{ orderDetail: any }>()

/** 计算总费用 */
const totalCost = computed(() => {
  const workPrices = props.orderDetail?.work_prices || []
  return workPrices.reduce((sum: number, workPrice: any) => {
    return sum + Number(workPrice.total_price || 0)
  }, 0)
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

  .work-price-section {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .work-price-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .work-price-title {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
      }

      .work-price-total {
        font-size: 16px;
        font-weight: 600;
        color: #00cec9;
      }
    }
  }

  .cost-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    &.no-border {
      border-bottom: none;
    }

    &.total {
      margin-top: 6px;
      padding-top: 14px;
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

    .cost-item-left {
      flex: 1;
      min-width: 0;

      .cost-label {
        font-size: 15px;
        color: #495057;
        display: block;
        margin-bottom: 4px;
        word-break: break-all;
      }

      .cost-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 4px;

        .cost-quantity {
          font-size: 12px;
          color: #999;
        }

        .cost-minimum {
          font-size: 12px;
          color: #ff6b6b;
          font-weight: 500;
        }
      }
    }

    .cost-value {
      font-size: 15px;
      font-weight: 600;
      color: #2c3e50;
      margin-left: 12px;
      flex-shrink: 0;
    }
  }
}
</style>
