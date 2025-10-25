<template>
  <view class="container">
    <scroll-view class="scroll-view" scroll-y>
      <!-- 用户头像区域 -->
      <view class="avatar-section">
        <view class="avatar-container" @click="handleAvatarEdit">
          <image v-if="userInfo?.avatar" class="avatar" :src="userInfo.avatar" mode="aspectFill" />
          <view v-else class="avatar default-avatar">
            <uni-icons type="person" size="60" color="#ccc" />
          </view>
          <view class="avatar-edit-overlay">
            <uni-icons type="camera" size="24" color="#fff" />
            <text class="edit-text">点击更换头像</text>
          </view>
        </view>
      </view>

      <!-- 用户信息卡片 -->
      <view class="info-card">
        <info-item
          icon="person"
          label="昵称"
          :value="userInfo?.nickname"
          placeholder="未设置"
          :clickable="true"
          @click="handleNicknameEdit"
        />

        <info-item
          icon="phone"
          label="手机号"
          :value="formatPhone(userInfo?.phone)"
          placeholder="未绑定"
          :clickable="false"
        />
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <button class="logout-btn" @click="handleLogout">
          <uni-icons type="close" size="18" color="#ff4757" />
          <text>退出登录</text>
        </button>
      </view>
    </scroll-view>

    <!-- 昵称编辑弹窗 -->
    <uni-popup ref="nicknamePopup" type="center">
      <view class="popup-content">
        <view class="popup-title">修改昵称</view>
        <input
          class="popup-input"
          v-model="editNickname"
          placeholder="请输入昵称"
          :maxlength="20"
        />
        <view class="popup-buttons">
          <button class="popup-btn cancel-btn" @click="cancelNicknameEdit">取消</button>
          <button class="popup-btn confirm-btn" @click="confirmNicknameEdit">确定</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { formatPhone } from '@/utils'
import InfoItem from './components/info-item.vue'
// services
import { uploadFileService } from '@/utils/request'
import { updateUserInfoService } from './service'

const userInfo = ref<any>({})
const editNickname = ref('')
const nicknamePopup = ref()

// 页面显示时加载用户信息
onLoad(() => {
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = (): void => {
  const data = wx.getStorageSync('userInfo')
  if (data) {
    userInfo.value = data
  }
}

// 处理头像编辑
const handleAvatarEdit = (): void => {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'], // 使用压缩图
    sourceType: ['album', 'camera'], // // 相册+拍照
    success: async (res) => {
      const { success, data } = await uploadFileService(res.tempFilePaths[0])
      if (!success) return
      const res1 = await updateUserInfoService(userInfo.value.id, { avatar: data?.url })
      if (!res1?.success) return
      saveUserInfo(res1?.data)
    },
  })
}

// 处理昵称编辑
const handleNicknameEdit = (): void => {
  editNickname.value = userInfo.value.nickname || ''
  nicknamePopup.value.open()
}

// 取消昵称编辑
const cancelNicknameEdit = (): void => {
  nicknamePopup.value.close()
}

// 确认昵称编辑
const confirmNicknameEdit = async (): Promise<void> => {
  if (!editNickname.value.trim()) {
    wx.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }

  const { success, data } = await updateUserInfoService(userInfo.value.id, {
    nickname: editNickname.value.trim(),
  })

  if (!success) return

  saveUserInfo(data)

  nicknamePopup.value.close()
}

// 保存用户信息
const saveUserInfo = (data: any): void => {
  if (!data) return
  userInfo.value = data
  wx.setStorageSync('userInfo', data)
}

// 退出登录
const handleLogout = (): void => {
  wx.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: ({ confirm }) => {
      if (!confirm) return
      wx.removeStorageSync('userInfo')
      wx.navigateTo({
        url: '/subpackages/login/index',
      })
    },
  })
}
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
  background: #f8f9fa;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  padding: 0 32rpx;
  box-sizing: border-box;
}

// 头像区域
.avatar-section {
  display: flex;
  justify-content: center;
  padding: 60rpx 0 40rpx;

  .avatar-container {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    overflow: hidden;
    border: 4rpx solid #fff;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;

      &.default-avatar {
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .avatar-edit-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;

      .edit-text {
        color: #fff;
        font-size: 24rpx;
        margin-top: 8rpx;
      }
    }

    &:active .avatar-edit-overlay {
      opacity: 1;
    }
  }
}

// 信息卡片
.info-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

// 退出登录区域
.logout-section {
  padding: 40rpx 0 60rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    background: #fff;
    border: 2rpx solid #ff4757;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    font-size: 28rpx;
    color: #ff4757;
    font-weight: 500;
    box-sizing: border-box;

    &::after {
      border: none;
    }

    &:active {
      background: #fff5f5;
    }
  }
}

// 弹窗样式
.popup-content {
  width: 600rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;

  .popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 32rpx;
  }

  .popup-input {
    width: 100%;
    height: 80rpx;
    border: 2rpx solid #eee;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    margin-bottom: 32rpx;

    &:focus {
      border-color: #00cec9;
    }
  }

  .popup-buttons {
    display: flex;
    gap: 24rpx;

    .popup-btn {
      flex: 1;
      height: 72rpx;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 500;

      &::after {
        border: none;
      }

      &.cancel-btn {
        background: #f5f5f5;
        color: #666;
      }

      &.confirm-btn {
        background: #00cec9;
        color: #fff;
      }
    }
  }
}
</style>
