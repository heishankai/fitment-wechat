<template>
  <custom-card>
    <!-- 卡片头部 -->
    <view class="card-header">
      <uni-icons type="wallet" color="#00cec9" size="20" />
      <text class="card-title">费用清单</text>
    </view>

    <!-- 费用列表 -->
    <view class="cost-list">
      <!-- 按工种分组显示 -->
      <view
        v-for="(group, groupIndex) in groupedWorkPrices"
        :key="groupIndex"
        class="work-price-section"
      >
        <!-- 工种标题 -->
        <view class="work-kind-header">
          <text class="work-kind-name">{{ group.workKindName }}</text>
        </view>

        <!-- 工价项列表 -->
        <view
          v-for="(priceItem, priceIndex) in group.items"
          :key="priceItem.id"
          class="cost-item-wrapper"
          :class="{ 'no-border': priceIndex === group.items.length - 1 }"
        >
          <view class="cost-item">
            <view class="cost-item-left">
              <text class="cost-label">{{ priceItem.work_title }}</text>

              <view class="cost-meta">
                <text class="cost-quantity"
                  >数量: {{ priceItem.quantity }}/{{ priceItem.labour_cost_name }}</text
                >

                <text v-if="showMinimum(priceItem)" class="cost-minimum">
                  最低价: ¥{{ formatCost(priceItem.minimum_price) }}
                </text>
              </view>
            </view>

            <text class="cost-value">¥{{ formatCost(priceItem.settlement_amount) }}</text>
          </view>

          <!-- 验收状态按钮和辅材查看按钮 -->
          <view class="action-buttons-view">
            <button
              class="action-btn acceptance-btn"
              :class="{ accepted: priceItem.is_accepted }"
              :disabled="priceItem.is_accepted"
              @click="handleAcceptOrderWorkPrice(priceItem.id)"
            >
              <uni-icons
                type="checkmarkempty"
                :size="14"
                :color="priceItem.is_accepted ? '#07c160' : '#ff9800'"
              />
              <text class="action-btn-text" :class="priceItem.is_accepted ? 'accepted' : 'pending'">
                {{ priceItem.is_accepted ? '已验收' : '确认验收' }}
              </text>
            </button>

            <!-- 查看辅材按钮（当 assigned_craftsman_id 存在时显示） -->
            <button
              v-if="priceItem.assigned_craftsman_id"
              class="action-btn materials-btn"
              @click="handleViewMaterials(priceItem)"
            >
              <uni-icons type="shop" size="14" color="#00cec9" />
              <text class="action-btn-text">查看辅材</text>
              <uni-icons type="right" size="12" color="#00cec9" />
            </button>
          </view>
        </view>
      </view>

      <!-- 工价汇总区域 -->
      <view class="work-price-summary">
        <view class="summary-row">
          <text class="summary-label">工价合计：</text>
          <text class="summary-value">¥{{ formatCost(props.orderDetail?.total_price || 0) }}</text>
        </view>

        <view class="summary-row">
          <text class="summary-label">工长工费：</text>
          <text class="summary-value"
            >¥{{ formatCost(props.orderDetail?.gangmaster_cost || 0) }}</text
          >
        </view>

        <view class="summary-row" v-if="props.orderDetail?.work_kind_name === '工长'">
          <text class="summary-label">工长上门次数：</text>
          <text class="summary-value">{{ props.orderDetail?.visiting_service_num || 0 }}</text>
        </view>

        <view class="summary-row">
          <text class="summary-label">平台服务费：</text>
          <text class="summary-value"
            >¥{{ formatCost(props.orderDetail?.total_service_fee || 0) }}</text
          >
        </view>

        <view class="summary-row final-total">
          <text class="summary-label">总计：</text>
          <text class="summary-value final-price"> ¥{{ calculateFinalTotal() }} </text>
        </view>

        <view class="tag-view">
          <uni-tag
            :text="props.orderDetail?.is_paid ? '已支付' : '待支付'"
            :type="props.orderDetail?.is_paid ? 'success' : 'warning'"
          />
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import customCard from '@/components/custom-card.vue'
import { formatCost } from '@/utils'
import { acceptOrderWorkPriceService } from '../service'

const props = defineProps<{ orderDetail: any }>()
const emit = defineEmits<{ refresh: [] }>()

// 按工种分组工价项
const groupedWorkPrices = computed(() => {
  const groups: Record<string, { workKindName: string; items: any[] }> = {}
  const workPrices = props.orderDetail?.parent_work_price_groups || []

  workPrices.forEach((item: any) => {
    const workKindName = item.work_kind_name || '其他'
    if (!groups[workKindName]) {
      groups[workKindName] = {
        workKindName,
        items: [],
      }
    }
    groups[workKindName].items.push(item)
  })

  return Object.values(groups)
})

// 验收单个工价项
const handleAcceptOrderWorkPrice = async (work_price_item_id: number): Promise<any> => {
  // 二次确认
  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认验收',
      content: '确定要验收此项工价吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#00cec9',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  const { success } = await acceptOrderWorkPriceService({
    work_price_item_id,
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    emit('refresh')
  }
}

// 最低价规则
const showMinimum = (item: any): boolean =>
  item.is_set_minimum_price === '1' && item.minimum_price && parseFloat(item.quantity) <= 1

// 计算最终总价（工价合计 + 工长费用 + 平台服务费）
const calculateFinalTotal = (): number => {
  // 施工费用
  const totalPrice = parseFloat(String(props.orderDetail?.total_price || 0)) || 0
  // 工长费用
  const gangmasterCost = parseFloat(String(props.orderDetail?.gangmaster_cost || 0)) || 0
  // 平台服务费：
  const serviceFee = parseFloat(String(props.orderDetail?.total_service_fee || 0)) || 0

  return totalPrice + gangmasterCost + serviceFee
}

// 跳转到辅材清单页面
const handleViewMaterials = (priceItem: any): void => {
  uni?.vibrateShort()
  const assignedCraftsmanId = priceItem.assigned_craftsman_id || ''
  uni.navigateTo({
    url: `/subpackages/work-price-materials/index?workPriceItemId=${priceItem.id}&orderId=${props.orderDetail?.id || ''}&assignedCraftsmanId=${assignedCraftsmanId}`,
  })
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

    .work-kind-header {
      padding: 8px 0;
      margin-bottom: 8px;
      border-bottom: 2px solid rgba(0, 206, 201, 0.2);

      .work-kind-name {
        font-size: 16px;
        font-weight: 600;
        color: #00cec9;
      }
    }

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

    .action-buttons-view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      width: 100%;

      .action-btn {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
        outline: none;
        box-sizing: border-box;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

        &::after {
          border: none;
        }

        &:active:not(:disabled) {
          transform: scale(0.96);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
        }

        &:disabled {
          opacity: 1;
        }

        .action-btn-text {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
      }

      .materials-btn {
        background: linear-gradient(135deg, rgba(0, 206, 201, 0.1), rgba(0, 180, 216, 0.08));
        border: 1px solid rgba(0, 206, 201, 0.25);
        box-shadow: 0 2px 4px rgba(0, 206, 201, 0.08);

        &:active {
          background: linear-gradient(135deg, rgba(0, 206, 201, 0.15), rgba(0, 180, 216, 0.12));
          box-shadow: 0 1px 2px rgba(0, 206, 201, 0.12);
        }

        .action-btn-text {
          color: #00cec9;
        }
      }

      .acceptance-btn {
        background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.08));
        border: 1px solid rgba(255, 152, 0, 0.25);
        box-shadow: 0 2px 4px rgba(255, 152, 0, 0.08);

        &:active:not(:disabled) {
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.12));
          box-shadow: 0 1px 2px rgba(255, 152, 0, 0.12);
        }

        &.accepted {
          background: linear-gradient(135deg, rgba(7, 193, 96, 0.1), rgba(7, 193, 96, 0.08));
          border: 1px solid rgba(7, 193, 96, 0.25);
          box-shadow: 0 2px 4px rgba(7, 193, 96, 0.08);

          &:active {
            background: linear-gradient(135deg, rgba(7, 193, 96, 0.15), rgba(7, 193, 96, 0.12));
            box-shadow: 0 1px 2px rgba(7, 193, 96, 0.12);
          }
        }

        .action-btn-text {
          &.pending {
            color: #ff9800;
          }

          &.accepted {
            color: #07c160;
          }
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
</style>
