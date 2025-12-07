<template>
  <custom-card v-if="subWorkPrices?.length">
    <!-- 子费用标题 -->
    <view class="sub-section-header">
      <uni-icons type="list" color="#00cec9" size="18" />
      <text class="sub-section-title">子费用清单</text>
    </view>

    <view class="sub-cost-list">
      <view
        v-for="(subWorkPrice, subIndex) in subWorkPrices"
        :key="subIndex"
        class="sub-work-price-section"
      >
        <!-- 子工价项列表 -->
        <view
          v-for="(priceItem, priceIndex) in subWorkPrice.prices_list"
          :key="priceItem.id"
          class="cost-item"
          :class="{ 'no-border': isLastPrice(subWorkPrice, priceIndex) }"
        >
          <view class="cost-item-left">
            <text class="cost-label">{{ priceItem.work_title }}</text>
            <view class="cost-meta">
              <text class="cost-quantity">数量: {{ priceItem.quantity }}</text>
              <text v-if="showMinimumPrice(priceItem)" class="cost-minimum">
                最低价: ¥{{ formatCost(priceItem.minimum_price) }}
              </text>
            </view>
          </view>
          <text class="cost-value">¥{{ formatCost(priceItem.work_price) }}</text>
        </view>

        <!-- 汇总区域 -->
        <view class="sub-price-summary">
          <view class="summary-row">
            <text class="summary-label">工价合计：</text>
            <text class="summary-value">¥{{ formatCost(subWorkPrice.total_price) }}</text>
          </view>

          <view class="summary-row">
            <text class="summary-label">平台服务费：</text>
            <text class="summary-value">¥{{ formatCost(subWorkPrice.total_service_fee) }}</text>
          </view>

          <view class="summary-row final-total">
            <text class="summary-label">总计：</text>
            <text class="summary-value final-price">
              ¥{{ formatCost(totalWithFee(subWorkPrice)) }}
            </text>
          </view>

          <!-- 支付状态 -->
          <view class="tag-view">
            <uni-tag
              :text="subWorkPrice.is_paid ? '已支付' : '待支付'"
              :type="subWorkPrice.is_paid ? 'success' : 'warning'"
            />
          </view>

          <!-- 验收按钮 -->
          <button
            v-if="subWorkPrice.total_is_accepted !== undefined"
            class="acceptance-btn"
            :class="{ accepted: subWorkPrice.total_is_accepted }"
            :disabled="subWorkPrice.total_is_accepted"
            @click="handleTotalAcceptSubWorkPrice(subIndex)"
          >
            <text>{{ subWorkPrice.total_is_accepted ? '已验收' : '确认验收' }}</text>
          </button>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import { formatCost } from '@/utils'
import { acceptOrderWorkPriceService } from '../service'

const props = defineProps<{ subWorkPrices?: any[]; orderDetail?: any }>()
const emit = defineEmits<{ refresh: [] }>()

const showMinimumPrice = (item: any): boolean =>
  item.is_set_minimum_price === '1' && item.minimum_price && item.quantity <= 1

const isLastPrice = (subWorkPrice: any, index: number): boolean =>
  index === subWorkPrice.prices_list.length - 1

const totalWithFee = (subWorkPrice: any): number =>
  Number(subWorkPrice.total_price || 0) + Number(subWorkPrice.total_service_fee || 0)

// 验收订单
const handleTotalAcceptSubWorkPrice = async (subIndex: number): Promise<any> => {
  const { success } = await acceptOrderWorkPriceService({
    order_id: props?.orderDetail?.id,
    accepted_type: 'sub_work_prices',
    prices_item: subIndex,
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    emit('refresh')
  }
}
</script>

<style lang="scss" scoped>
.sub-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .sub-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
  }
}

.sub-cost-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .sub-work-price-section {
    padding: 12px;
    background: #fafafa;
    border-radius: 12px;
    border: 1px solid #f0f0f0;

    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;

      &.no-border {
        border-bottom: none;
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
        flex-shrink: 0;
        margin-left: 12px;
      }
    }

    .sub-price-summary {
      margin-top: 12px;
      padding: 12px;
      background: #fff;
      border: 1px solid rgba(0, 206, 201, 0.1);
      border-radius: 8px;

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        font-size: 14px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.06);

        &:last-child {
          border-bottom: none;
        }

        .summary-label {
          color: #646566;
          font-weight: 500;
        }

        .summary-value {
          color: #323233;
          font-weight: 600;
          font-size: 15px;

          &.final-price {
            font-size: 18px;
            font-weight: 700;
            color: #00cec9;
          }
        }

        &.final-total {
          margin-top: 4px;
          padding-top: 10px;
          border-top: 2px solid rgba(0, 206, 201, 0.2);
          border-bottom: none;

          .summary-label {
            font-size: 15px;
            font-weight: 600;
            color: #323233;
          }
        }
      }

      .tag-view {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
        padding: 12px 0;
        border-top: 1px solid #f0f0f0;
      }

      .acceptance-btn {
        width: 100%;
        height: 48px;
        background: #fff8f0;
        color: #ff9800;
        border: 1.5px solid #ff9800;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
        transition: all 0.3s ease;
        outline: none;
        padding: 0;
        margin: 0;
        box-sizing: border-box;

        &::after {
          border: none;
        }

        &:active {
          background: #fff3e0;
          transform: scale(0.98);
          box-shadow: 0 1px 4px rgba(255, 152, 0, 0.15);
        }

        &.accepted {
          background: rgba(7, 193, 96, 0.1);
          color: #07c160;
          border-color: #07c160;
          box-shadow: 0 2px 8px rgba(7, 193, 96, 0.1);
        }

        &:disabled {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
