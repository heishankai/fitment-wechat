<template>
  <custom-card>
    <view class="order-info-card">
      <view class="order-header">
        <view class="order-title-section">
          <text class="order-title">{{ props.orderDetail?.work_kind_name || '订单' }}</text>
          <view class="order-status-badge" :class="getStatusClass(props.orderDetail?.order_status)">
            {{ props.orderDetail?.order_status_name }}
          </view>
        </view>
        <text class="order-time">{{ formatTime(props.orderDetail?.createdAt) }}</text>
      </view>

      <!-- 订单详情 -->
      <view class="order-details">
        <view class="detail-item">
          <view class="detail-icon">
            <uni-icons type="location" color="#00cec9" size="20" />
          </view>
          <view class="detail-content">
            <text class="detail-label">位置</text>
            <text class="detail-value">{{ props.orderDetail?.location }}</text>
          </view>
        </view>

        <view class="detail-item">
          <view class="detail-icon">
            <uni-icons type="home" color="#00cec9" size="20" />
          </view>
          <view class="detail-content">
            <text class="detail-label">户型</text>
            <text class="detail-value">{{ props.orderDetail?.roomType }}</text>
          </view>
        </view>

        <view class="detail-item">
          <view class="detail-icon">
            <uni-icons type="map" color="#00cec9" size="20" />
          </view>
          <view class="detail-content">
            <text class="detail-label">面积</text>
            <text class="detail-value">{{ props.orderDetail?.area }}m²</text>
          </view>
        </view>

        <view class="detail-item">
          <view class="detail-icon">
            <uni-icons type="home" color="#00cec9" size="20" />
          </view>
          <view class="detail-content">
            <text class="detail-label">房屋类型</text>
            <text class="detail-value">{{ props.orderDetail?.houseType === 'new' ? '新房' : '老房' }}</text>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import { formatTime } from '@/utils'

const props = defineProps<{ orderDetail: any }>()

// 获取状态样式类
const getStatusClass = (status: number): string => {
  const statusMap: Record<number, string> = {
    1: 'status-pending',
    2: 'status-accepted',
    3: 'status-completed',
    4: 'status-cancelled',
  }
  return statusMap[status] || ''
}
</script>

<style lang="scss" scoped>
.order-info-card {
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;

    .order-title-section {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;

      .order-title {
        font-size: 20px;
        font-weight: 700;
        color: #2c3e50;
      }

      .order-status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.status-pending {
          background: #fff3cd;
          color: #856404;
        }

        &.status-accepted {
          background: #d1ecf1;
          color: #0c5460;
        }

        &.status-completed {
          background: #d4edda;
          color: #155724;
        }

        &.status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }
      }
    }

    .order-time {
      font-size: 12px;
      color: #999;
    }
  }

  .order-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .detail-item {
      display: flex;
      align-items: center;

      .detail-icon {
        width: 40px;
        height: 40px;
        background: rgba(0, 206, 201, 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .detail-content {
        flex: 1;
        min-width: 0;

        .detail-label {
          font-size: 12px;
          color: #6c757d;
          display: block;
          margin-bottom: 2px;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
          word-break: break-all;
        }
      }
    }
  }
}
</style>

