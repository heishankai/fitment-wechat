<template>
  <custom-card>
    <view class="property-card">
      <view class="property-header">
        <view class="community-info">
          <text class="community-name">{{ props.caseDetail?.housing_name }}</text>
          <view class="location">
            <uni-icons type="location" color="#00cec9" size="16" />
            <text class="location-text">{{ props.caseDetail?.city_name }}</text>
          </view>
        </view>
        <view class="renovation-tag" :class="{ old: props.caseDetail?.remodel_type !== 1 }">
          {{ props.caseDetail?.remodel_type === 1 ? '新房装修' : '旧房改造' }}
        </view>
      </view>

      <!-- 两边对齐的详情 -->
      <view class="property-details">
        <view class="detail-item">
          <view class="detail-icon">
            <uni-icons type="home" color="#00cec9" size="20" />
          </view>
          <view class="detail-content">
            <text class="detail-label">户型</text>
            <text class="detail-value">{{ props.caseDetail?.housing_type }}</text>
          </view>
        </view>

        <view class="detail-item">
          <view class="detail-icon">
            <uni-icons type="map" color="#00cec9" size="20" />
          </view>
          <view class="detail-content">
            <text class="detail-label">面积</text>
            <text class="detail-value">{{ props.caseDetail?.square_number }}m²</text>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'

const props = defineProps<{ caseDetail: any }>()
</script>

<style lang="scss" scoped>
.property-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  .community-info {
    flex: 1;

    .community-name {
      font-size: 20px;
      font-weight: 700;
      color: #2c3e50;
      display: block;
      margin-bottom: 8px;
    }

    .location {
      display: flex;
      align-items: center;

      .location-text {
        font-size: 14px;
        color: #6c757d;
        margin-left: 4px;
      }
    }
  }

  .renovation-tag {
    background: linear-gradient(135deg, #00cec9, #00b4d8);
    color: #fff;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;

    &.old {
      background: #f275b3;
    }
  }
}

/* ✅ 改良后的布局 */
.property-details {
  display: flex;
  justify-content: space-between;
  /* 两边对齐 */
  align-items: flex-start;
  width: 100%;

  .detail-item {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-start;

    &:last-child {
      justify-content: flex-end;
      /* 右边的靠右对齐 */
    }

    .detail-icon {
      width: 40px;
      height: 40px;
      background: rgba(0, 206, 201, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }

    .detail-content {
      text-align: left;

      .detail-label {
        font-size: 12px;
        color: #6c757d;
        display: block;
        margin-bottom: 2px;
      }

      .detail-value {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
      }
    }
  }
}
</style>
