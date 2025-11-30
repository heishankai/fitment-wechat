<template>
  <view class="calculate-price">
    <!-- 位置选择 -->
    <view class="form-row" @click="showLocationPicker">
      <view class="label">位置</view>
      <view class="value-container">
        <text class="value" :class="{ placeholder: !formData.location }">
          {{ formData.location || '请选择位置' }}
        </text>
        <uni-icons type="arrow-down" size="14" color="#999" />
      </view>
    </view>

    <view class="divider"></view>

    <!-- 新房老房选择 -->
    <view class="form-row">
      <view class="label">房屋类型</view>
      <radio-group @change="handleHouseTypeChange" class="radio-group">
        <label class="radio-item" v-for="item in houseTypes" :key="item.value">
          <radio :value="item.value" :checked="formData.houseType === item.value" color="#00cec9" />
          <text class="radio-text">{{ item.label }}</text>
        </label>
      </radio-group>
    </view>

    <view class="divider"></view>

    <!-- 户型选择 -->
    <view class="form-row" @click="showRoomTypePicker">
      <view class="label">户型</view>
      <view class="value-container">
        <text class="value" :class="{ placeholder: !formData.roomType }">
          {{ formData.roomType || '请选择户型' }}
        </text>
        <uni-icons type="arrow-down" size="14" color="#999" />
      </view>
    </view>

    <view class="divider"></view>

    <!-- 面积输入 -->
    <view class="form-row">
      <view class="label">面积</view>
      <view class="input-container">
        <input v-model="formData.area" type="number" placeholder="请输入面积" class="area-input" />
        <text class="unit">m²</text>
      </view>
    </view>

    <!-- 计算按钮 -->
    <button class="calculate-btn" @click="handleCalculate">免费获取报价</button>

    <!-- 位置选择弹窗 -->
    <LocationPicker ref="locationPickerRef" @select="selectLocation" />

    <!-- 户型选择弹窗 -->
    <RoomTypePicker ref="roomTypePickerRef" @select="selectRoomType" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LocationPicker from '@/components/location-picker.vue'
import RoomTypePicker from './room-type-picker.vue'

/** 表单数据 */
const formData = ref({
  location: '',
  houseType: '',
  roomType: '',
  area: '',
})

/** 房屋类型选项 */
const houseTypes = ref([
  { label: '新房', value: 'new' },
  { label: '老房', value: 'old' },
])

/** 弹窗引用 */
const locationPickerRef = ref<any>(null)
const roomTypePickerRef = ref<any>(null)

/** 打开位置选择器 */
const showLocationPicker = (): void => locationPickerRef.value?.showPicker()

/** 打开户型选择器 */
const showRoomTypePicker = (): void => roomTypePickerRef.value?.showPicker()

/** 房屋类型变化 */
const handleHouseTypeChange = (e: any): void => (formData.value.houseType = e.detail.value)

/** 选中位置 */
const selectLocation = (location: any): void => {
  console.log('选择位置：', location)
  formData.value.location = location.city_name
}

/** 选中户型 */
const selectRoomType = (roomType: any): void => {
  console.log('选中户型', roomType)
  formData.value.roomType = roomType.name
  roomTypePickerRef.value?.close()
}

/** 计算价格 */
const handleCalculate = (): void => {
  console.log(formData.value)
}
</script>

<style lang="scss" scoped>
.calculate-price {
  background: #fff;
  border-radius: 16rpx;
  padding: 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  margin: 24rpx 16rpx;

  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 16rpx;

    .label {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }

    .value-container {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .value {
        font-size: 30rpx;
        color: #333;

        &.placeholder {
          color: #999;
        }
      }
    }

    .radio-group {
      display: flex;
      gap: 40rpx;

      .radio-item {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .radio-text {
          font-size: 30rpx;
          color: #333;
        }
      }
    }

    .input-container {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .area-input {
        font-size: 30rpx;
        color: #333;
        text-align: right;
        width: 200rpx;
        border: none;
        background: transparent;
      }

      .unit {
        font-size: 30rpx;
        color: #333;
      }
    }
  }

  .divider {
    height: 1rpx;
    background: #f0f0f0;
    margin: 0 24rpx;
  }

  .calculate-btn {
    width: 100%;
    height: 88rpx;
    background: #333;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    border-radius: 0 0 16rpx 16rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0;

    &::after {
      border: none;
    }

    &.disabled {
      background: #ccc;
      color: #999;
    }
  }

  .picker-content {
    z-index: 9999;
    width: 100%;
    height: 50vh;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    display: flex;
    flex-direction: column;
    position: relative;

    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx;
      border-bottom: 1rpx solid #eee;

      .header-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .close-btn {
        width: 50rpx;
        height: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border-radius: 50%;
      }
    }

    .picker-scroll {
      flex: 1;
      padding: 0 24rpx;
      height: 0;

      .picker-item {
        padding: 24rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        display: flex;
        align-items: center;

        &:last-child {
          border-bottom: none;
        }

        .item-text {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }
}
</style>
