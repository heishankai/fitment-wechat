<template>
  <view class="address-list">
    <view class="address-item" v-for="item in addressListData" :key="item.id">
      <view class="address-content">
        <view class="user-info">
          <text class="name">{{ item.owner_name }}</text>
          <text class="phone">{{ item.owner_phone }}</text>
          <text class="default-tag" v-if="item.default">默认</text>
        </view>
        <view class="address-detail">
          {{ item.city_name }} {{ item.detailed_address }} {{ item.community_name }}
          {{ item.building_number }}
        </view>
      </view>
      <view class="actions">
        <view class="arrow-icon" @click.stop="editAddress(item)">
          <uni-icons type="arrow-right" size="20" color="#999" />
        </view>
        <view class="delete-icon" @click.stop="deleteAddress(item.id)">
          <uni-icons type="trash" size="20" color="#ff4757" />
        </view>
      </view>
    </view>
  </view>
  <empty-state v-if="!addressListData?.length" />
</template>

<script setup lang="ts">
import { getAddressListService, deleteAddressService } from '../service'
import emptyState from '@/components/empty-state.vue'

const userInfo = wx.getStorageSync('userInfo') ?? {}

const addressListData = ref<any[]>([])
const finish = ref(false)

const pageParams = ref<{
  pageIndex: number
  pageSize: number
  wechat_user_id: number
}>({
  pageIndex: 1,
  pageSize: 10,
  wechat_user_id: userInfo?.id,
})

// 获取案例列表数据
const getHomeGetRecommendData = async (): Promise<void> => {
  // 退出分页判断
  if (finish.value === true) {
    wx.showToast({ icon: 'none', title: '没有更多数据~' })
    return
  }

  wx.showLoading({ title: '加载中...', mask: true })

  const { success, data } = await getAddressListService({ ...pageParams.value })
  if (!success) return

  // 数组追加到全部数据中
  addressListData.value.push(...(data ?? []))

  // 分页条件
  if (pageParams.value.pageIndex) {
    // 页码累加
    pageParams.value.pageIndex++
  }

  if (!data?.length) {
    finish.value = true
  }
  wx.hideLoading()
}

// 重置数据
const resetData = (): void => {
  pageParams.value.pageIndex = 1
  addressListData.value = []
  finish.value = false
}

// 编辑地址
const editAddress = (item: any): void => {
  wx.navigateTo({
    url: `/subpackages/address-form/index?id=${item.id}&type=edit`,
  })
}

// 删除地址
const deleteAddress = async (id: string): Promise<void> => {
  wx.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: async ({ confirm }) => {
      if (!confirm) return
      const { success } = await deleteAddressService(id)
      if (!success) return
      addressListData.value = addressListData.value.filter((item) => item.id !== id)
      wx.showToast({ title: '删除成功', icon: 'none' })
    },
  })
}

// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeGetRecommendData,
})

onLoad(() => {
  getHomeGetRecommendData()
})
</script>

<style lang="scss" scoped>
.address-list {
  padding: 32rpx 24rpx;
  min-height: 100%;
}

.address-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border: 1rpx solid #f0f0f0;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6rpx;
    height: 100%;
    background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
  }

  .address-content {
    flex: 1;
    margin-right: 24rpx;

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      gap: 20rpx;
      flex-wrap: wrap;

      .name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }

      .phone {
        font-size: 28rpx;
        color: #666;
        background: #f8f9fa;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
      }

      .default-tag {
        background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
        color: #fff;
        font-size: 22rpx;
        font-weight: 500;
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 206, 201, 0.3);
      }
    }

    .address-detail {
      font-size: 30rpx;
      color: #555;
      line-height: 1.6;
      background: #f8f9fa;
      padding: 20rpx;
      border-radius: 16rpx;
      border-left: 4rpx solid #00cec9;
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 32rpx;
    align-items: center;

    .arrow-icon,
    .delete-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .arrow-icon {
      background: #f8f9fa;
      opacity: 0.8;

      &:active {
        background: #e9ecef;
        transform: scale(0.95);
      }
    }

    .delete-icon {
      background: #fff5f5;
      opacity: 0.8;

      &:active {
        background: #ffe6e6;
        transform: scale(0.95);
      }
    }
  }

  // 移除地址项的点击效果
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500rpx;
  padding: 60rpx 40rpx;
  background: #fff;
  margin: 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .empty-icon {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  }

  .empty-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
  }

  .empty-desc {
    font-size: 28rpx;
    color: #666;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
