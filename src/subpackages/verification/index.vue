<template>
  <scroll-view
    class="container"
    enable-back-to-top
    :scroll-with-animation="true"
    :show-scrollbar="false"
    scroll-y
  >
    <view class="content">
      <view style="background: #fff; padding: 20rpx">
        <view class="rich-text-container">
          <MpHtml :content="richContent" :preview-img="false" :show-img-menu="false" />
        </view>
      </view>

      <view class="action-buttons">
        <!-- <button class="pay-btn" @click="onPay">支付{{ formattedPrice }}元</button> -->
        <button class="order-btn" @click="onOrderVerification">立即预约验房</button>
      </view>
    </view>

    <!-- 预约验房表单弹窗 -->
    <uni-popup ref="verificationFormRef" type="bottom" :safe-area="false" :z-index="9999">
      <view class="form-popup">
        <!-- 顶部装饰 -->
        <view class="header-bg">
          <view class="header-decoration"></view>
        </view>

        <scroll-view class="scroll-view" scroll-y>
          <!-- 页面标题 -->
          <view class="page-header">
            <text class="page-title">预约验房服务</text>
            <text class="page-subtitle">填写您的房屋信息，我们将为您安排验房服务</text>
            <view class="close-btn" @click="hideVerificationForm">
              <uni-icons type="close" size="20" color="#fff" />
            </view>
          </view>

          <!-- 表单卡片 -->
          <view class="form-card">
            <view class="form-item clickable" @click="getLocation">
              <view class="item-left">
                <view class="icon-wrapper location-icon">
                  <uni-icons type="location" size="20" color="#00cec9" />
                </view>
                <text class="label">位置</text>
              </view>
              <view class="value-box">
                <text class="value" :class="{ placeholder: !formData.location }">
                  {{ formData.location || '请选择位置' }}
                </text>
                <uni-icons type="arrow-right" size="16" color="#c0c4cc" />
              </view>
            </view>

            <view class="divider"></view>

            <view class="form-item">
              <view class="item-left">
                <view class="icon-wrapper house-icon">
                  <uni-icons type="home" size="20" color="#00cec9" />
                </view>
                <text class="label">房屋类型</text>
              </view>
              <radio-group @change="formData.houseType = $event.detail.value" class="radio-group">
                <label class="radio-item" v-for="item in houseTypes" :key="item.value">
                  <radio
                    :value="item.value"
                    :checked="formData.houseType === item.value"
                    color="#00cec9"
                    class="radio-hidden"
                  />
                  <view class="radio-custom" :class="{ active: formData.houseType === item.value }">
                    <view class="radio-dot" v-if="formData.houseType === item.value"></view>
                  </view>
                  <text class="radio-text">{{ item.label }}</text>
                </label>
              </radio-group>
            </view>

            <view class="divider"></view>

            <view class="form-item clickable" @click="showRoomTypePicker">
              <view class="item-left">
                <view class="icon-wrapper room-icon">
                  <uni-icons type="list" size="20" color="#00cec9" />
                </view>
                <text class="label">户型</text>
              </view>
              <view class="value-box">
                <text class="value" :class="{ placeholder: !formData.roomType }">
                  {{ formData.roomType || '请选择户型' }}
                </text>
                <uni-icons type="arrow-right" size="16" color="#c0c4cc" />
              </view>
            </view>

            <view class="divider"></view>

            <view class="form-item">
              <view class="item-left">
                <view class="icon-wrapper area-icon">
                  <uni-icons type="compose" size="20" color="#00cec9" />
                </view>
                <text class="label">面积</text>
              </view>
              <view class="input-box">
                <input
                  v-model="formData.area"
                  type="number"
                  placeholder="请输入面积"
                  class="input"
                  placeholder-style="color: #c0c4cc"
                />
                <text class="unit">m²</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="footer">
          <button class="submit-btn" @click="handleVerificationSubmit">
            <text class="btn-text">提交预约</text>
            <uni-icons type="paperplane" size="18" color="#fff" />
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- 户型选择器 -->
    <RoomTypePicker ref="roomTypePickerRef" @select="handleRoomTypeSelect" />
  </scroll-view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import {
  getIndependentPageService,
  checkUnusedOrderService,
  createAndgetPaySignService,
  getReverseGeocodeService,
  createOrderService,
  setOrderUsedService,
} from './service'
import { ref } from 'vue'
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue'
import RoomTypePicker from '@/subpackages/contact-craftsman/components/room-type-picker.vue'
import { getUserLocation } from '@/utils'
import { validateCraftsmanForm } from '@/subpackages/contact-craftsman/utils'

const pageInfo = ref<any>(null)
const richContent = ref<string>('')
const price = ref<number>(0)
const verificationFormRef = ref<any>(null)
const roomTypePickerRef = ref<any>(null)

// 表单数据（支持联系工匠和验房）
const formData = <any>ref({
  // 详细位置
  location: '',
  // 房屋类型
  houseType: '',
  // 户型
  roomType: '',
  // 面积
  area: '',
  // 省份
  province: '',
  // 城市
  city: '',
  // 区县
  district: '',
  // 纬度
  latitude: null,
  // 经度
  longitude: null,
  // 工种名称
  work_kind_name: '工长',
  // 工种id
  work_kind_id: '7',
})

const houseTypes = [
  { label: '新房', value: 'new' },
  { label: '老房', value: 'old' },
]

// 支付按钮
const onPay = async (orderData: any): Promise<void> => {
  wx.showLoading({ title: '支付中...', mask: true })

  // const paymentData = await getPaySign()

  // 检查是否有未使用的订单
  const res =await checkUnusedOrderService()
  if(res.success){
    if(res.data.flag){
      // 存在未使用的订单，直接使用
      console.log('存在未使用的订单', res.data.order_no)
      await createOrder(orderData, res.data.order_no)
      // 延迟1秒
      await new Promise(resolve => setTimeout(resolve, 1000))
      return;
    }
  }

  const { success, data, message, code } = await createAndgetPaySignService()
  if (!success) {
    if (code === 10001) {
      // 直接创建订单
      // 延迟1秒
      setTimeout(async () => {
        await createOrder(orderData, data.order_no)
      }, 1000)
    }
    wx.hideLoading()
    wx.showToast({ title: message || '支付失败', icon: 'none' })
  } else {
    wx.requestPayment({
      ...data.paySign,
      async success(res) {
        // 支付成功后检查是否可以预约验房
        console.log('支付成功', res)
        uni.showToast({ icon: 'none', title: '支付成功，创建订单中...', duration: 2000 })
        // 创建订单
        await createOrder(orderData, data.order_no)
      },
      fail(res) {
        console.log('支付失败', res)
      },
    })
  }
  // console.log(data.paySign)

  wx.hideLoading()
}
// 创建订单
const createOrder = async (orderData: any, order_no: string): Promise<void> => {
  console.log('createOrder', orderData)
  console.log('创建订单')
  try {
    // 创建订单
    const { success, data, message } = await createOrderService(orderData)
    wx.hideLoading()

    if (success && data) {
      const body = {
        order_no: order_no,
        main_order_id: data.order.id,
      }
      await setOrderUsedService(body)
      wx.showToast({
        title: '订单已发送，请前往我的订单查看',
        icon: 'none',
      })
      wx.navigateTo({
        url: '/subpackages/orders/index',
      })
    } else {
      wx.showToast({
        title: message || '发送失败，请重试',
        icon: 'none',
      })
    }
  } catch (error: any) {
    console.error('发送订单失败:', error)
    wx.hideLoading()
    wx.showToast({
      title: '发送失败，请重试',
      icon: 'none',
    })
  }
}

// 立即预约验房
const onOrderVerification = (): void => {
  verificationFormRef.value?.open()
}
// 获取地址
const getLocation = async (): Promise<void> => {
  const location = await getUserLocation()
  if (!location) return
  const { success, data } = await getReverseGeocodeService(location)
  if (!success) return
  const { city, district, province } = data
  formData.value.location = `${province} ${city} ${district}`
  formData.value.province = province
  formData.value.city = city
  formData.value.district = district
  formData.value.latitude = location.latitude
  formData.value.longitude = location.longitude
}

// 获取页面信息
const loadPageInfo = async (): Promise<void> => {
  const { success, data } = await getIndependentPageService()

  if (success) {
    pageInfo.value = data
    richContent.value = data.content
    price.value = Number(data.price)
    // console.log(data.content)
    // 动态设置导航栏标题
    uni.setNavigationBarTitle({
      title: data.title,
    })
  }
}
// // 检查是否可以预约验房
// const getIfUnusedOrder = async (): Promise<void> => {
//   const { success, data } = await checkUnusedOrderService()
//   if (success) {
//     if_unused_order.value = data
//   }
// }

// // 格式化价格
// const formattedPrice = computed(() => {
//   return price.value % 1 === 0 ? price.value.toString() : price.value.toString()
// })
// 获得paySign
// const getPaySign = async (): Promise<any> => {
//   const { success, data, message, code } = await createAndgetPaySignService()
//   if (success === true) {
//     return data.paySign
//   } else if (code === 10001) {
//     wx.hideLoading()
//     uni.showModal({
//       title: '提示',
//       content: message || '请求错误',
//       confirmText: '确定',
//     })
//     console.log(message)
//   }
// }

// 关闭预约表单

const hideVerificationForm = (): void => {
  verificationFormRef.value?.close()
}

// 显示户型选择器
const showRoomTypePicker = (): void => {
  roomTypePickerRef.value?.showPicker()
}

// 处理户型选择
const handleRoomTypeSelect = (roomType: any): void => {
  formData.value.roomType = roomType.name
  roomTypePickerRef.value?.hidePicker()
}

// 提交预约验房表单
const handleVerificationSubmit = async (): Promise<void> => {
  uni?.vibrateShort()

  // 校验表单
  if (!validateCraftsmanForm(formData.value)) {
    return
  }

  // 显示加载提示
  wx.showLoading({ title: '提交中...', mask: true })

  try {
    const verificationData = {
      area: formData.value.area,
      city: formData.value.city,
      district: formData.value.district,
      houseType: formData.value.houseType,
      roomType: formData.value.roomType,
      location: formData.value.location,
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      province: formData.value.province,
      work_kind_name: formData.value.work_kind_name,
      work_kind_id: formData.value.work_kind_id,
    }

    // 支付
    onPay(verificationData)
  } catch (error: any) {
    console.error('预约验房失败:', error)
    wx.hideLoading()
    wx.showToast({
      title: '预约失败，请重试',
      icon: 'none',
    })
  }
}

// 页面加载
onLoad(() => {
  loadPageInfo()
  getLocation()
})
</script>

<style lang="scss">
page {
  background-color: #f8f9fa;
  height: 100vh;
}

.container {
  height: 100vh;
  background: linear-gradient(180deg, #fff 0%, #f8f9fa 100%);
}

.content {
  padding-bottom: 40rpx;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 40rpx;
  margin-top: 40rpx;

  .pay-btn {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 50rpx;
    height: 100rpx;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 4rpx 15rpx rgba(76, 175, 80, 0.3);

    &:active {
      opacity: 0.9;
    }
  }

  .order-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
    color: white;
    border: none;
    border-radius: 50rpx;
    height: 100rpx;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.3);

    // &:active {
    //   opacity: 0.9;
    // }

    // &.disabled-btn {
    //   background: #ccc !important;
    //   box-shadow: none !important;
    //   color: #999 !important;

    //   &:active {
    //     opacity: 1 !important;
    //   }
    // }
  }
}

.rich-text-container {
  width: 100%;
}

/* 预约验房表单弹窗样式 */
.form-popup {
  position: relative;
  height: 90vh;
  background: linear-gradient(180deg, #f0f9ff 0%, #f5f6fa 100%);
  display: flex;
  flex-direction: column;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300rpx;
  background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
  z-index: 0;
  overflow: hidden;

  .header-decoration {
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 400rpx;
    height: 400rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.page-header {
  padding: 40rpx 24rpx 32rpx;
  color: #fff;
  position: relative;

  .page-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    margin-bottom: 16rpx;
    letter-spacing: 1rpx;
  }

  .page-subtitle {
    display: block;
    font-size: 26rpx;
    opacity: 0.9;
    line-height: 1.6;
  }

  .close-btn {
    position: absolute;
    top: 40rpx;
    right: 24rpx;
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: background 0.2s;
  }

  .close-btn:active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.form-card {
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  margin: 0 24rpx 32rpx;
  overflow: hidden;
  box-shadow: 0 -4rpx 32rpx rgba(0, 0, 0, 0.08);
  padding: 16rpx 0;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 32rpx;
  transition: background 0.2s;

  &.clickable:active {
    background: #f8f9fa;
  }

  .item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;

    .icon-wrapper {
      width: 64rpx;
      height: 64rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.location-icon {
        background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
      }

      &.house-icon {
        background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      }

      &.room-icon {
        background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      }

      &.area-icon {
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      }
    }

    .label {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
    }
  }

  .value-box {
    display: flex;
    align-items: center;
    gap: 16rpx;
    max-width: 50%;

    .value {
      font-size: 30rpx;
      color: #333;
      max-width: 300rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;

      &.placeholder {
        color: #c0c4cc;
        font-weight: 400;
      }
    }
  }

  .radio-group {
    display: flex;
    gap: 48rpx;

    .radio-item {
      display: flex;
      align-items: center;
      gap: 16rpx;
      cursor: pointer;

      .radio-hidden {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }

      .radio-custom {
        width: 40rpx;
        height: 40rpx;
        border: 3rpx solid #dcdfe6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        flex-shrink: 0;

        &.active {
          border-color: #00cec9;
          background: #00cec9;
        }

        .radio-dot {
          width: 20rpx;
          height: 20rpx;
          background: #fff;
          border-radius: 50%;
        }
      }

      .radio-text {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }

  .input-box {
    display: flex;
    align-items: center;
    gap: 12rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    padding: 16rpx 24rpx;
    min-width: 200rpx;

    .input {
      flex: 1;
      font-size: 30rpx;
      color: #333;
      text-align: right;
      border: none;
      background: transparent;
      font-weight: 500;
    }

    .unit {
      font-size: 28rpx;
      color: #909399;
      font-weight: 500;
    }
  }
}

.divider {
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, #f0f0f0 20%, #f0f0f0 80%, transparent 100%);
  margin: 0 32rpx;
}

.footer {
  padding: 24rpx;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  flex-shrink: 0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 206, 201, 0.4);
  transition: all 0.3s;

  &::after {
    border: none;
  }

  .btn-text {
    font-size: 32rpx;
    font-weight: 600;
  }

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(0, 206, 201, 0.3);
  }
}
</style>
