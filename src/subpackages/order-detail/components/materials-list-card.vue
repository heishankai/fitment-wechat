<template>
  <custom-card v-if="materialsData?.commodity_list?.length">
    <!-- 辅材清单标题 -->
    <view class="materials-section-header">
      <uni-icons type="shop" color="#00cec9" size="18" />
      <text class="materials-section-title">辅材清单</text>
    </view>

    <view class="materials-list">
      <view class="material-group-section">
        <!-- 商品列表 -->
        <view
          v-for="(commodity, commodityIndex) in materialsData.commodity_list"
          :key="commodity.id"
          class="commodity-item"
          :class="{ 'no-border': isLastCommodity(commodityIndex) }"
        >
          <view class="commodity-content">
            <!-- 商品图片 -->
            <view
              v-if="commodity.commodity_cover && commodity.commodity_cover.length > 0"
              class="commodity-image-wrapper"
              @click="previewImage(commodity.commodity_cover[0], commodity.commodity_cover)"
            >
              <image
                :src="commodity.commodity_cover[0]"
                mode="aspectFill"
                class="commodity-image"
              />
            </view>

            <view class="commodity-info">
              <text class="commodity-name">{{ commodity.commodity_name }}</text>
              <view class="commodity-meta">
                <text class="commodity-quantity">
                  数量: {{ commodity.quantity }} {{ commodity.commodity_unit }}
                </text>
              </view>
            </view>

            <view class="commodity-right">
              <text class="commodity-price">¥{{ formatCost(commodity.settlement_amount) }}</text>
              <!-- 单个商品验收按钮 -->
              <view class="commodity-acceptance-view">
                <button
                  class="acceptance-btn-small"
                  :class="{ accepted: commodity.is_accepted }"
                  :disabled="commodity.is_accepted"
                  @click="handleAcceptMaterial(commodity.id)"
                >
                  <text :class="commodity.is_accepted ? 'accepted' : 'pending'">
                    {{ commodity.is_accepted ? '已验收' : '验收' }}
                  </text>
                </button>
              </view>
            </view>
          </view>
        </view>

        <!-- 汇总区域 -->
        <view class="material-summary">
          <view class="summary-row">
            <text class="summary-label">辅材合计：</text>
            <text class="summary-value">¥{{ formatCost(materialsData.total_price) }}</text>
          </view>

          <view class="summary-row final-total">
            <text class="summary-label">总计：</text>
            <text class="summary-value final-price">
              ¥{{ formatCost(materialsData.total_price) }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import { formatCost, previewImage } from '@/utils'
import { acceptOrderMaterialsService } from '../service'

const props = defineProps<{ materialsData?: any; orderDetail?: any }>()
const emit = defineEmits<{ refresh: [] }>()

const isLastCommodity = (index: number): boolean => {
  if (!props.materialsData?.commodity_list) return false
  return index === props.materialsData.commodity_list.length - 1
}

// 验收单个辅材商品
const handleAcceptMaterial = async (materialsId: number): Promise<any> => {
  // 二次确认
  const res = await new Promise<boolean>((resolve) => {
    wx.showModal({
      title: '确认验收',
      content: '确定要验收此项辅材吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#00cec9',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

  if (!res) return

  const { success } = await acceptOrderMaterialsService({
    materialsId,
  })

  if (success) {
    wx.showToast({ title: '验收成功', icon: 'none' })
    emit('refresh')
  }
}
</script>

<style lang="scss" scoped>
.materials-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .materials-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
  }
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .material-group-section {
    padding: 12px;
    background: #fafafa;
    border-radius: 12px;
    border: 1px solid #f0f0f0;

    .commodity-item {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &.no-border {
        border-bottom: none;
      }

      .commodity-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .commodity-image-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f0f0;

          .commodity-image {
            width: 100%;
            height: 100%;
          }
        }

        .commodity-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;

          .commodity-name {
            font-size: 15px;
            color: #495057;
            font-weight: 500;
            word-break: break-all;
          }

          .commodity-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .commodity-quantity {
              font-size: 12px;
              color: #999;
            }
          }
        }

        .commodity-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
          margin-left: 8px;

          .commodity-price {
            font-size: 15px;
            font-weight: 600;
            color: #2c3e50;
          }

          .commodity-acceptance-view {
            display: flex;
            justify-content: flex-end;

            .acceptance-btn-small {
              display: inline-flex !important;
              width: auto !important;
              padding: 4px 12px;
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

              background: rgba(255, 152, 0, 0.1);

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
        }
      }
    }

    .material-summary {
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
