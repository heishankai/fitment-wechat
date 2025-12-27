<template>
  <view class="calculate-price">
    <!-- 位置选择 -->
    <view class="form-row" @click="initLocation">
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
    <button class="calculate-btn" @getphonenumber="handleCalculate" open-type="getPhoneNumber">
      免费获取报价
    </button>

    <!-- 户型选择弹窗 -->
    <RoomTypePicker ref="roomTypePickerRef" @select="selectRoomType" />
  </view>
</template>

<script setup lang="ts">
import RoomTypePicker from './room-type-picker.vue'
import {
  loginService,
  getUserPhoneNumberService,
  getReverseGeocodeService,
  getQuoteService,
} from '../service'
import { getUserLocation } from '@/utils'

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

const roomTypePickerRef = ref<any>(null)

/** 打开户型选择器 */
const showRoomTypePicker = (): void => roomTypePickerRef.value?.showPicker()

/** 房屋类型变化 */
const handleHouseTypeChange = (e: any): void => (formData.value.houseType = e.detail.value)

const initLocation = async (): Promise<void> => {
  const location = await getUserLocation()
  if (!location) return

  const { success, data } = await getReverseGeocodeService(location)
  if (!success) return
  console.log(data, 'data')

  formData.value.location = data?.address ?? ''
}

/** 选中户型 */
const selectRoomType = (roomType: any): void => {
  formData.value.roomType = roomType.name
  roomTypePickerRef.value?.close()
}

/** 计算价格 */
const handleCalculate = async (e: any): Promise<void> => {
  console.log(formData, 'formData')

  // 校验必填字段
  if (!formData.value.location) {
    wx.showToast({ title: '请选择位置', icon: 'none' })
    return
  }

  if (!formData.value.houseType) {
    wx.showToast({ title: '请选择房屋类型', icon: 'none' })
    return
  }

  if (!formData.value.roomType) {
    wx.showToast({ title: '请选择户型', icon: 'none' })
    return
  }

  if (!formData.value.area) {
    wx.showToast({ title: '请输入面积', icon: 'none' })
    return
  }

  const { code: phoneCode, errMsg } = e?.detail ?? {}

  if (errMsg !== 'getPhoneNumber:ok') {
    wx.showToast({ title: '需要手机号授权才能登录', icon: 'none' })
    return
  }

  try {
    // 先获取登录凭证
    const { code } = await new Promise<{ code: string }>((resolve, reject) => {
      wx.login({
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      })
    })

    // 调用后端接口登录 获取用户信息
    const { success, data } = await loginService({ code })

    if (!success) return

    // 调用后端接口解密手机号
    const { success: phoneSuccess, data: phoneData } = await getUserPhoneNumberService({
      code: phoneCode,
      openid: data.openid,
    })

    if (!phoneSuccess) return

    wx.setStorageSync('userInfo', phoneData)

    // 调用后端接口获取报价
    const { success: quoteSuccess } = await getQuoteService({
      phone: phoneData?.phone,
      ...formData.value,
    })

    if (!quoteSuccess) return

    wx.showLoading({ title: '获取报价中,后续将有工作人员联系您,请耐心等待...', mask: true })
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    wx.hideLoading()
  }
}

onLoad(() => {
  initLocation()
})
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
