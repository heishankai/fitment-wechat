<template>
  <custom-card>
    <section-header title="工种详情" />

    <view class="work-prices-list">
      <view
        v-for="(workPrice, index) in props.workPrices"
        :key="index"
        class="work-price-card"
      >
        <view class="work-price-header">
          <view class="work-kind-info">
            <text class="work-kind-name">{{ workPrice.work_kind?.label || '工种' }}</text>
            <text class="work-price-total">¥{{ formatCost(workPrice.total_price) }}</text>
          </view>
        </view>

        <view class="prices-list">
          <view
            v-for="(priceItem) in workPrice.prices_list"
            :key="priceItem.id"
            class="price-item"
          >
            <view class="price-item-header">
              <text class="price-item-title">{{ priceItem.work_title }}</text>
              <text class="price-item-price">¥{{ formatCost(priceItem.work_price) }}</text>
            </view>

            <view class="price-item-details">
              <view class="detail-row">
                <text class="detail-label">数量:</text>
                <text class="detail-value">{{ priceItem.quantity }} {{ priceItem.labour_cost?.label }}</text>
              </view>
              <view class="detail-row" v-if="priceItem.minimum_price">
                <text class="detail-label">最低价格:</text>
                <text class="detail-value">¥{{ formatCost(priceItem.minimum_price) }}</text>
              </view>
            </view>

            <view v-if="priceItem.service_scope" class="service-scope">
              <text class="service-scope-label">服务范围:</text>
              <text class="service-scope-text">{{ priceItem.service_scope }}</text>
            </view>

            <view v-if="priceItem.display_images && priceItem.display_images.length > 0" class="display-images">
              <view
                v-for="(image, imgIndex) in priceItem.display_images"
                :key="imgIndex"
                class="image-item"
                @click="previewImage(image, priceItem.display_images)"
              >
                <image :src="image" mode="aspectFill" class="display-image" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import sectionHeader from '@/components/section-header.vue'
import { formatCost, previewImage } from '@/utils'

const props = defineProps<{
  workPrices: any[]
}>()
</script>

<style lang="scss" scoped>
.work-prices-list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .work-price-card {
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .work-price-header {
      margin-bottom: 16px;

      .work-kind-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .work-kind-name {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }

        .work-price-total {
          font-size: 18px;
          font-weight: 600;
          color: #00cec9;
        }
      }
    }

    .prices-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .price-item {
        padding: 16px;
        background: #f8f9fa;
        border-radius: 12px;

        .price-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .price-item-title {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            flex: 1;
            min-width: 0;
            word-break: break-all;
          }

          .price-item-price {
            font-size: 16px;
            font-weight: 600;
            color: #00cec9;
            margin-left: 12px;
            flex-shrink: 0;
          }
        }

        .price-item-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;

          .detail-row {
            display: flex;
            align-items: center;
            gap: 8px;

            .detail-label {
              font-size: 14px;
              color: #666;
            }

            .detail-value {
              font-size: 14px;
              color: #2c3e50;
              font-weight: 500;
            }
          }
        }

        .service-scope {
          margin-bottom: 12px;

          .service-scope-label {
            font-size: 14px;
            color: #666;
            display: block;
            margin-bottom: 4px;
          }

          .service-scope-text {
            font-size: 14px;
            color: #2c3e50;
            line-height: 1.6;
            word-break: break-all;
          }
        }

        .display-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;

          .image-item {
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;

            .display-image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

