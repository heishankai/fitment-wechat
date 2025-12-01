<template>
  <custom-card>
    <section-header title="工匠信息" />

    <view class="craftsman-info">
      <image :src="props.craftsman.avatar" mode="aspectFill" class="craftsman-avatar" />
      <view class="craftsman-details">
        <text class="craftsman-name">{{ props.craftsman.nickname }}</text>
        <view class="craftsman-meta">
          <view class="meta-item">
            <uni-icons type="phone" size="14" color="#666" />
            <text class="meta-text">{{ formatPhone(props.craftsman.phone) }}</text>
          </view>
          <view class="meta-item" v-if="props.craftsman.city">
            <uni-icons type="location" size="14" color="#666" />
            <text class="meta-text">{{ props.craftsman.city }}</text>
          </view>
        </view>
        <view class="craftsman-badges">
          <view v-if="props.craftsman.isVerified" class="badge verified">
            <uni-icons type="checkmarkempty" size="12" color="#fff" />
            <text>已认证</text>
          </view>
          <view v-if="props.craftsman.isSkillVerified" class="badge skill">
            <uni-icons type="star" size="12" color="#fff" />
            <text>技能认证</text>
          </view>
        </view>
      </view>
    </view>
  </custom-card>
</template>

<script setup lang="ts">
import customCard from '@/components/custom-card.vue'
import sectionHeader from '@/components/section-header.vue'
import { formatPhone } from '@/utils'

const props = defineProps<{
  craftsman: any
}>()
</script>

<style lang="scss" scoped>
.craftsman-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;

  .craftsman-avatar {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .craftsman-details {
    flex: 1;
    min-width: 0;

    .craftsman-name {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
      display: block;
      margin-bottom: 12px;
    }

    .craftsman-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;

        .meta-text {
          font-size: 14px;
          color: #666;
        }
      }
    }

    .craftsman-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;

        &.verified {
          background: linear-gradient(135deg, #00cec9, #00b4d8);
        }

        &.skill {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
        }
      }
    }
  }
}
</style>

