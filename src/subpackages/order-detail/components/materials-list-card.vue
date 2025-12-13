<template>
  <custom-card v-if="materialsList?.length">
    <!-- 辅材清单标题 -->
    <view class="materials-section-header">
      <uni-icons type="shop" color="#00cec9" size="18" />
      <text class="materials-section-title">辅材清单</text>
    </view>

    <view class="materials-list">
      <view
        v-for="(materialGroup, groupIndex) in materialsList"
        :key="groupIndex"
        class="material-group-section"
      >
        <!-- 商品列表 -->
        <view
          v-for="(commodity, commodityIndex) in materialGroup.commodity_list"
          :key="commodity.id"
          class="commodity-item"
          :class="{ 'no-border': isLastCommodity(materialGroup, commodityIndex) }"
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

            <text class="commodity-price">¥{{ formatCost(commodity.commodity_price) }}</text>
          </view>
        </view>

        <!-- 汇总区域 -->
        <view class="material-summary">
          <view class="summary-row">
            <text class="summary-label">辅材合计：</text>
            <text class="summary-value">¥{{ formatCost(materialGroup.total_price) }}</text>
          </view>

          <view class="summary-row final-total">
            <text class="summary-label">总计：</text>
            <text class="summary-value final-price">
              ¥{{ formatCost(materialGroup.total_price) }}
            </text>
          </view>

          <!-- 支付状态 -->
          <view class="tag-view">
            <uni-tag
              :text="materialGroup.is_paid ? '已支付' : '待支付'"
              :type="materialGroup.is_paid ? 'success' : 'warning'"
            />
          </view>

          <!-- 验收按钮 -->
          <button
            v-if="materialGroup.total_is_accepted !== undefined"
            class="acceptance-btn"
            :class="{ accepted: materialGroup.total_is_accepted }"
            :disabled="materialGroup.total_is_accepted"
            @click="handleTotalAcceptMaterial(materialGroup)"
          >
            <text>{{ materialGroup.total_is_accepted ? '已验收' : '确认验收' }}</text>
          </button>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import { formatCost, previewImage } from '@/utils'
import { acceptOrderMaterialsService } from '../service'

const props = defineProps<{ materialsList?: any[]; orderDetail?: any }>()
const emit = defineEmits<{ refresh: [] }>()

const isLastCommodity = (materialGroup: any, index: number): boolean =>
  index === materialGroup.commodity_list.length - 1

// 验收辅材清单
const handleTotalAcceptMaterial = async (material: any): Promise<any> => {
  const { success } = await acceptOrderMaterialsService({
    order_id: props?.orderDetail?.id,
    materials_id: material.id,
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

        .commodity-price {
          font-size: 15px;
          font-weight: 600;
          color: #2c3e50;
          flex-shrink: 0;
          margin-left: 8px;
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
