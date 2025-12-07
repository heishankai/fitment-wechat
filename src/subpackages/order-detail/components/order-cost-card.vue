<template>
  <custom-card>
    <!-- 卡片头部 -->
    <view class="card-header">
      <uni-icons type="wallet" color="#00cec9" size="20" />
      <text class="card-title">费用清单</text>
    </view>

    <!-- 费用列表 -->
    <view class="cost-list">
      <view
        v-for="(workPrice, index) in props.orderDetail?.work_prices"
        :key="index"
        class="work-price-section"
      >
        <!-- 工价项列表 -->
        <view
          v-for="(priceItem, priceIndex) in workPrice.prices_list"
          :key="priceItem.id"
          class="cost-item-wrapper"
          :class="{ 'no-border': priceIndex === workPrice.prices_list.length - 1 }"
        >
          <view class="cost-item">
            <view class="cost-item-left">
              <text class="cost-label">{{ priceItem.work_title }}</text>

              <view class="cost-meta">
                <text class="cost-quantity">数量: {{ priceItem.quantity }}</text>

                <text v-if="showMinimum(priceItem)" class="cost-minimum">
                  最低价: ¥{{ formatCost(priceItem.minimum_price) }}
                </text>
              </view>
            </view>

            <text class="cost-value">¥{{ formatCost(priceItem.work_price) }}</text>
          </view>

          <!-- 验收状态按钮（简化后） -->
          <view v-if="needShowAcceptButton(workPrice, priceItem)" class="acceptance-button-view">
            <button
              v-if="isWireman(workPrice, priceItem)"
              class="acceptance-btn-small wireman-btn"
              :class="{ accepted: priceItem.is_accepted }"
              :disabled="priceItem.is_accepted"
              @click="handleAcceptOrderWorkPrice(priceIndex)"
            >
              <text :class="priceItem.is_accepted ? 'accepted' : 'pending'">
                {{ priceItem.is_accepted ? '已验收' : '确认验收' }}
              </text>
            </button>

            <button
              v-if="isMason(workPrice, priceItem)"
              class="acceptance-btn-small mason-btn"
              :class="{ accepted: priceItem.is_accepted }"
              :disabled="priceItem.is_accepted"
              @click="handleAcceptOrderWorkPrice(priceIndex)"
            >
              <text :class="priceItem.is_accepted ? 'accepted' : 'pending'">
                {{ priceItem.is_accepted ? '已验收' : '确认验收' }}
              </text>
            </button>
          </view>
        </view>

        <!-- 工价汇总区域 -->
        <view class="work-price-summary">
          <view class="summary-row">
            <text class="summary-label">工价合计：</text>
            <text class="summary-value">¥{{ formatCost(workPrice?.total_price || 0) }}</text>
          </view>

          <view class="summary-row">
            <text class="summary-label">工长工费：</text>
            <text class="summary-value">¥{{ formatCost(workPrice?.gangmaster_cost || 0) }}</text>
          </view>

          <view class="summary-row" v-if="workPrice?.craftsman_user_work_kind_name === '工长'">
            <text class="summary-label">工长上门次数：</text>
            <text class="summary-value">{{ workPrice?.visiting_service_num || 0 }}</text>
          </view>

          <view class="summary-row">
            <text class="summary-label">平台服务费：</text>
            <text class="summary-value"
              >¥{{ formatCost(calculateGangmasterServiceFee(workPrice)) }}</text
            >
          </view>

          <view class="summary-row final-total">
            <text class="summary-label">总计：</text>
            <text class="summary-value final-price"> ¥{{ calculateFinalTotal(workPrice) }} </text>
          </view>

          <view class="tag-view">
            <uni-tag
              :text="workPrice.is_paid ? '已支付' : '待支付'"
              :type="workPrice.is_paid ? 'success' : 'warning'"
            />
          </view>

          <button
            v-if="workPrice.total_is_accepted !== undefined"
            class="acceptance-btn"
            :class="{ accepted: workPrice.total_is_accepted }"
            :disabled="workPrice.total_is_accepted"
            @click="handleTotalAcceptOrderWorkPrice"
          >
            <text>{{ workPrice.total_is_accepted ? '已验收' : '确认验收' }}</text>
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

const props = defineProps<{ orderDetail: any }>()
const emit = defineEmits<{ refresh: [] }>()

// 验收订单
const handleAcceptOrderWorkPrice = async (priceIndex: number): Promise<any> => {
  const { success } = await acceptOrderWorkPriceService({
    order_id: props?.orderDetail?.id,
    accepted_type: 'work_prices',
    prices_item: priceIndex,
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    emit('refresh')
  }
}

// 验收订单
const handleTotalAcceptOrderWorkPrice = async (): Promise<any> => {
  const { success } = await acceptOrderWorkPriceService({
    order_id: props?.orderDetail?.id,
    accepted_type: 'work_prices',
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    emit('refresh')
  }
}

// 工长 + 水电
const isWireman = (wp: any, item: any): boolean =>
  wp.craftsman_user_work_kind_name === '工长' && item.work_kind?.work_kind_name === '水电'

// 工长 + 泥瓦工
const isMason = (wp: any, item: any): boolean =>
  wp.craftsman_user_work_kind_name === '工长' && item.work_kind?.work_kind_name === '泥瓦工'

// 是否显示任意验收按钮
const needShowAcceptButton = (wp: any, item: any): boolean =>
  isWireman(wp, item) || isMason(wp, item)

// 最低价规则
const showMinimum = (item: any): boolean =>
  item.is_set_minimum_price === '1' && item.minimum_price && item.quantity <= 1

// 计算平台服务费
const calculateGangmasterServiceFee = (group: any): number => {
  const gangmasterCost = parseFloat(String(group?.gangmaster_cost || 0)) || 0
  return gangmasterCost * 0.1 + (group?.total_service_fee || 0)
}

// 计算最终总价（工价合计 + 服务费 + 工长费用 ）
const calculateFinalTotal = (group: any): number => {
  // 施工费用
  const totalPrice = parseFloat(String(group?.total_price || 0)) || 0
  // 平台服务费
  const serviceFee = parseFloat(String(group?.total_service_fee || 0)) || 0
  // 工长费用
  const gangmasterCost = parseFloat(String(group?.gangmaster_cost || 0)) || 0
  // 工长平台服务费 （10%）
  const gangmasterServiceFee = gangmasterCost * 0.1

  return totalPrice + serviceFee + gangmasterCost + gangmasterServiceFee
}
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
  gap: 16px;

  .work-price-section {
    padding: 12px;
    background: #fafafa;
    border-radius: 12px;
    border: 1px solid #f0f0f0;

    .cost-item-wrapper {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;

      &.no-border {
        border-bottom: none;
      }
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

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

    .acceptance-button-view {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      width: fit-content;

      .acceptance-btn-small {
        display: inline-flex !important;
        width: auto !important;

        align-items: center;
        justify-content: center;
        border-radius: 6px;
        border: none;
        outline: none;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 500;
        flex-shrink: 0;

        &::after {
          border: none;
        }

        &.wireman-btn,
        &.mason-btn {
          background: rgba(255, 152, 0, 0.1);
        }

        &.accepted {
          background: rgba(7, 193, 96, 0.1);
        }

        &:disabled {
          opacity: 1;
        }

        &:active:not(:disabled) {
          opacity: 0.8;
        }

        text {
          font-size: 12px;
          font-weight: 500;

          &.accepted {
            color: #07c160;
          }

          &.pending {
            color: #ff9800;
          }
        }
      }
    }

    .work-price-summary {
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

        &:not(:last-child) {
          border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
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

        &.accepted {
          background: rgba(7, 193, 96, 0.1);
          color: #07c160;
          border-color: #07c160;
          box-shadow: 0 2px 8px rgba(7, 193, 96, 0.1);
        }

        &:active:not(:disabled) {
          background: #fff3e0;
          transform: scale(0.98);
          box-shadow: 0 1px 4px rgba(255, 152, 0, 0.15);
        }

        &:disabled {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
