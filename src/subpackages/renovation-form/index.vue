<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y>
      <!-- 介绍区域 -->
      <view class="intro-section">
        <view class="service-tag">
          <view class="tag-dot" />
          <text class="tag-text">专业顾问服务</text>
        </view>
        <view class="intro-title">填写信息，开启您的装修之旅</view>
        <view class="intro-desc">我们将为您提供专业的装修方案和报价</view>
      </view>

      <!-- 表单内容 -->
      <view class="form-content">
        <!-- 装修位置 -->
        <view class="form-item">
          <view class="item-label">
            <uni-icons type="location" size="20" color="#00cec9" />
            <text class="label-text">装修位置</text>
          </view>
          <input disabled class="form-input" v-model="formData.location" placeholder="请输入小区名称或详细地址"
            placeholder-style="color:#999" />
        </view>

        <!-- 房屋类型 -->
        <view class="form-item">
          <view class="item-label">
            <uni-icons type="home" size="20" color="#00cec9" />
            <text class="label-text">房屋类型</text>
          </view>
          <view class="house-type-group">
            <view v-for="item in houseTypes" :key="item.value" class="house-type-btn"
              :class="{ active: formData.houseType === item.value }" @click="selectHouseType(item.value)">
              {{ item.label }}
            </view>
          </view>
        </view>

        <!-- 户型 -->
        <view class="form-item">
          <view class="item-label">
            <uni-icons type="map" size="20" color="#00cec9" />
            <text class="label-text">户型</text>
          </view>
          <input class="form-input" v-model="formData.roomType" placeholder="例如：三室两厅一卫" placeholder-style="color:#999"
            :cursor-spacing="50" confirm-type='done' />
        </view>

        <!-- 建筑面积 -->
        <view class="form-item">
          <view class="item-label">
            <uni-icons custom-prefix="iconfont" type="icon-chizi_o" size="20" color="#00cec9" />
            <text class="label-text">面积</text>
          </view>
          <view class="area-input-wrapper">
            <input class="form-input area-input" v-model="formData.area" type="number" placeholder="请输入面积"
              placeholder-style="color:#999" :cursor-spacing="50" />
            <text class="area-unit">m²</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="form-footer">
      <button class="submit-btn" @getphonenumber="handleSubmit" open-type="getPhoneNumber">
        <text class="submit-text">立即预约</text>
        <uni-icons type="arrow-right" size="18" color="#fff" />
      </button>
      <view class="footer-tip">提交后，我们将会尽快与您联系</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  loginService,
  getUserPhoneNumberService,
  getReverseGeocodeService,
  getQuoteService,
} from './service'
import { getUserLocation } from '@/utils'

const formData = ref({
  location: '',
  houseType: '',
  roomType: '',
  area: '',
})

const houseTypes = [
  { label: '新房', value: 'new' },
  { label: '老房', value: 'old' },
]

const selectHouseType = (value: string): void => {
  formData.value.houseType = value
}

const validate = (): boolean => {
  const rules = [
    { key: 'location', msg: '请输入装修位置' },
    { key: 'roomType', msg: '请输入户型' },
    { key: 'area', msg: '请输入建筑面积' },
  ]

  for (const rule of rules) {
    if (!formData.value[rule.key].trim()) {
      uni.showToast({ title: rule.msg, icon: 'none' })
      return false
    }
  }
  return true
}

const initLocation = async (): Promise<void> => {
  const location = await getUserLocation()
  if (!location) return

  const { success, data } = await getReverseGeocodeService(location)
  if (!success) return
  console.log(data, 'data')

  formData.value.location = data?.address ?? ''
}

const handleSubmit = async (e: any): Promise<void> => {
  if (!validate()) return
  const { code: phoneCode, errMsg } = e?.detail ?? {}

  if (errMsg !== 'getPhoneNumber:ok') {
    wx.showToast({ title: '需要手机号授权才能登录', icon: 'none' })
    return
  }

  try {
    // // 开始显示 loading
    wx.showLoading({ title: '加载中...', mask: true })

    // 先获取登录凭证
    const { code } = await new Promise<{ code: string }>((resolve, reject) => {
      wx.login({
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      })
    })

    // 调用后端接口登录 获取用户信息
    const { success, data } = await loginService({ code })

    if (!success) {
      wx.hideLoading()
      return
    }

    // 调用后端接口解密手机号
    const { success: phoneSuccess, data: phoneData } = await getUserPhoneNumberService({
      code: phoneCode,
      openid: data.openid,
    })

    if (!phoneSuccess) {
      wx.hideLoading()
      return
    }

    wx.setStorageSync('userInfo', phoneData)

    // 调用后端接口获取报价
    const { success: quoteSuccess } = await getQuoteService({
      phone: phoneData?.phone,
      ...formData.value,
    })

    if (!quoteSuccess) {
      wx.hideLoading()
      return
    }

    // 成功获取报价，延迟隐藏 loading，让用户能看到提示信息
    wx.hideLoading()

    wx.showToast({ title: '提交成功，工作人员将尽快联系您', icon: 'none', duration: 2000 })
  } catch {
    wx.hideLoading()
    wx.showToast({ title: '操作失败，请稍后重试', icon: 'none' })
  }
}

onLoad((options: any) => {
  const { houseType } = options ?? {}
  formData.value.houseType = houseType
  initLocation()
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  height: 0;
  overflow: hidden;
}

/* ===== 介绍区域 ===== */
.intro-section {
  background: #00cec9;
  padding: 12px;

  .service-tag {
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    padding: 8rpx 16rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20rpx;
    margin-bottom: 12rpx;

    .tag-dot {
      width: 8rpx;
      height: 8rpx;
      background: #fff;
      border-radius: 50%;
    }

    .tag-text {
      font-size: 22rpx;
      color: #fff;
      font-weight: 500;
    }
  }

  .intro-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12rpx;
    line-height: 1.4;
  }

  .intro-desc {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.5;
  }
}

.form-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 16px 24px max(16px, env(safe-area-inset-bottom)) 24px;
  box-shadow: 0 -6rpx 20rpx rgba(0, 0, 0, 0.06);

  .submit-btn {
    padding: 12px 0;
    width: 100%;
    border-radius: 48rpx;
    background: linear-gradient(135deg, #00cec9, #00a8a3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    box-shadow: 0 6rpx 20rpx rgba(0, 206, 201, 0.35);
  }

  .submit-btn::after {
    border: none;
  }

  .submit-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }

  .footer-tip {
    margin-top: 18rpx;
    text-align: center;
    font-size: 24rpx;
    color: #999;
  }
}

.form-content {
  padding: 12px;
}

.form-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.label-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.form-input {
  height: 88rpx;
  background: #f7f8fa;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s ease;
}

.form-input:focus {
  background: #fff;
  box-shadow: 0 0 0 2rpx rgba(0, 206, 201, 0.2);
}

.form-input[disabled] {
  background: #f5f5f5;
  color: #999;
  opacity: 0.6;
  cursor: not-allowed;
}

/* 房屋类型 */
.house-type-group {
  display: flex;
  gap: 20rpx;
}

.house-type-btn {
  flex: 1;
  height: 88rpx;
  background: #f7f8fa;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.house-type-btn.active {
  background: linear-gradient(135deg, #00cec9, #00a8a3);
  color: #fff;
  box-shadow: 0 4rpx 14rpx rgba(0, 206, 201, 0.35);
}

/* 面积 */
.area-input-wrapper {
  position: relative;
}

.area-input {
  padding-right: 80rpx;
}

.area-unit {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 26rpx;
  color: #999;
}
</style>
