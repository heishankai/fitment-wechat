<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y>
      <view class="form-container">
        <!-- 业主姓名 -->
        <view class="form-item">
          <view class="label">业主姓名 <text class="required">*</text></view>
          <input
            class="input"
            v-model="formData.owner_name"
            placeholder="请输入业主姓名"
            :maxlength="20"
          />
        </view>

        <!-- 手机号码 -->
        <view class="form-item">
          <view class="label">手机号码 <text class="required">*</text></view>
          <input
            class="input"
            v-model="formData.owner_phone"
            placeholder="请输入手机号码"
            type="number"
            :maxlength="11"
          />
        </view>

        <!-- 城市 -->
        <view class="form-item" @click="showCityPicker">
          <view class="label">城市 <text class="required">*</text></view>
          <view class="city-selector">
            <text class="city-text" :class="{ placeholder: !formData.city_name }">
              {{ formData.city_name || '请选择城市' }}
            </text>
            <uni-icons type="arrow-right" size="16" color="#999" />
          </view>
        </view>

        <!-- 区域 -->
        <view class="form-item">
          <view class="label">区域 <text class="required">*</text></view>
          <input
            class="input"
            v-model="formData.detailed_address"
            placeholder="请输入详细地址"
            :maxlength="100"
          />
        </view>

        <!-- 小区 -->
        <view class="form-item">
          <view class="label">小区 <text class="required">*</text></view>
          <input
            class="input"
            v-model="formData.community_name"
            placeholder="请输入小区名称"
            :maxlength="50"
          />
        </view>

        <!-- 楼栋房号 -->
        <view class="form-item">
          <view class="label">楼栋房号 <text class="required">*</text></view>
          <input
            class="input"
            v-model="formData.building_number"
            placeholder="请输入楼栋房号"
            :maxlength="100"
          />
        </view>

        <!-- 是否默认地址 -->
        <view class="form-item">
          <view class="label">设为默认地址</view>
          <switch
            class="switch"
            :checked="formData.default"
            @change="handleDefaultChange"
            color="#00cec9"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 城市选择弹窗 -->
    <uni-popup ref="cityPicker" type="bottom" :safe-area="false">
      <view class="city-picker-content">
        <view class="city-picker-header">
          <text class="header-title">选择城市</text>
          <view class="close-btn" @click="hideCityPicker">
            <uni-icons type="close" size="20" color="#666" />
          </view>
        </view>

        <!-- 搜索栏 -->
        <view class="search-bar">
          <view class="search-input">
            <uni-icons type="search" color="#999" size="18" />
            <input v-model="searchKeyword" placeholder="搜索城市" placeholder-style="color: #999" />
          </view>
        </view>

        <!-- 城市列表 -->
        <scroll-view class="city-scroll" scroll-y>
          <view
            v-for="city in filteredCities"
            :key="city.id"
            class="city-item"
            @click="selectCity(city)"
          >
            <text class="city-name">{{ city.city_name }}</text>
          </view>
          <view v-if="filteredCities.length === 0" class="no-result">
            <text>未找到相关城市</text>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button class="save-btn" @click="handleSave" :disabled="!isFormValid">保存地址</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { addAddressService, getAddressDetailService, editAddressService } from './service'
import { getCityListService, type CityData } from '../city-list/service'

const userInfo = wx.getStorageSync('userInfo') ?? {}

// 表单数据
const formData = ref({
  owner_name: '',
  owner_phone: '',
  city_name: '',
  city_code: '',
  detailed_address: '',
  community_name: '',
  building_number: '',
  default: false,
  id: null,
})

// 城市选择相关
const cityPicker = ref()
const cityList = ref<CityData[]>([])
const searchKeyword = ref('')
const pageType = ref<'add' | 'edit'>('add')

// 过滤后的城市列表
const filteredCities = computed(() => {
  if (!searchKeyword.value.trim()) return cityList.value
  return cityList.value.filter((city) => city.city_name.includes(searchKeyword.value.trim()))
})

// 表单验证
const isFormValid = computed(() => {
  return (
    formData.value.owner_name.trim() &&
    formData.value.owner_phone.trim() &&
    formData.value.city_name.trim() &&
    formData.value.detailed_address.trim() &&
    formData.value.community_name.trim() &&
    formData.value.building_number.trim() &&
    /^1[3-9]\d{9}$/.test(formData.value.owner_phone)
  )
})

// 处理默认地址切换
const handleDefaultChange = (e: any): void => {
  formData.value.default = e.detail.value
}

// 显示城市选择器
const showCityPicker = async (): Promise<void> => {
  const { success, data } = await getCityListService()
  if (!success) return

  cityList.value = data
  // 显示弹窗
  cityPicker.value?.open()
}

// 隐藏城市选择器
const hideCityPicker = (): void => {
  cityPicker.value?.close()
  searchKeyword.value = ''
}

// 选择城市
const selectCity = (city: CityData): void => {
  formData.value.city_name = city.city_name
  formData.value.city_code = city.city_code
  hideCityPicker()
}

// 保存地址
const handleSave = async (): Promise<void> => {
  if (!isFormValid.value) {
    wx.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  const addressPromise =
    pageType.value === 'edit'
      ? editAddressService(formData.value.id, formData.value)
      : addAddressService({
          ...formData.value,
          wechat_user_id: userInfo.id,
        })

  const { success } = await addressPromise

  if (!success) return

  // 返回上一页
  wx.navigateBack()
}

const loadAddressDetail = async (id: number): Promise<void> => {
  const { success, data } = await getAddressDetailService(id)
  if (!success) return

  formData.value = data

  console.log(formData.value, 'dddd')
}

onLoad((options) => {
  const { id, type } = options ?? {}

  pageType.value = type

  if (type) {
    loadAddressDetail(id)
  }
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  background: #f8f9fa;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.form-container {
  padding: 24rpx;
}

.form-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .label {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;

    .required {
      color: #ff4757;
      margin-left: 4rpx;
    }
  }

  .input {
    width: 100%;
    font-size: 28rpx;
    color: #333;
    background: transparent;
    border: none;
    outline: none;
  }

  .switch {
    transform: scale(0.8);
  }

  .city-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    cursor: pointer;

    .city-text {
      font-size: 28rpx;
      color: #333;

      &.placeholder {
        color: #999;
      }
    }
  }
}

.bottom-bar {
  padding: 24rpx;
  background: #fff;
  border-top: 1rpx solid #eee;

  .save-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #00cec9 0%, #00b4d8 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 44rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      border: none;
    }

    &[disabled] {
      background: #ccc;
      color: #999;
    }
  }
}

// 城市选择弹窗样式
.city-picker-content {
  width: 100%;
  height: 70vh;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  display: flex;
  flex-direction: column;

  .city-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx;
    border-bottom: 1rpx solid #eee;

    .header-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }

    .close-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f5f5f5;
    }
  }

  .search-bar {
    padding: 24rpx;

    .search-input {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-radius: 40rpx;
      padding: 20rpx 24rpx;
      gap: 16rpx;

      input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        background: transparent;
        border: none;
        outline: none;
      }
    }
  }

  .city-scroll {
    flex: 1;
    height: 0;

    .city-item {
      padding: 32rpx 24rpx;
      border-bottom: 1rpx solid #f5f5f5;
      transition: background-color 0.2s;

      &:active {
        background: #f8f9fa;
      }

      .city-name {
        font-size: 28rpx;
        color: #333;
      }
    }

    .no-result {
      text-align: center;
      padding: 80rpx 24rpx;
      color: #999;
      font-size: 28rpx;
    }
  }
}
</style>
