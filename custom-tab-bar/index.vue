<template>
  <view class="custom-tab-bar">
    <view 
      class="tab-item" 
      v-for="(item, index) in tabList" 
      :key="index"
      :class="{ active: current === index }"
      @click="switchTab(index, item.pagePath)"
    >
      <view class="tab-content" :class="{ 'center-tab': index === 2 }">
        <view class="tab-icon">
          <text class="icon">{{ item.icon }}</text>
        </view>
        <text class="tab-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const current = ref(0)

const tabList = ref([
  {
    pagePath: '/pages/home/index',
    text: '首页',
    icon: '🏠'
  },
  {
    pagePath: '/pages/price/index',
    text: '工价',
    icon: '💰'
  },
  {
    pagePath: '/pages/house/index',
    text: '我的房子',
    icon: '🏡'
  },
  {
    pagePath: '/pages/materials/index',
    text: '辅材',
    icon: '🔧'
  },
  {
    pagePath: '/pages/profile/index',
    text: '我的',
    icon: '👤'
  }
])

onMounted(() => {
  // 获取当前页面路径，设置对应的tab
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentPath = '/' + currentPage.route
  
  const currentIndex = tabList.value.findIndex(item => item.pagePath === currentPath)
  if (currentIndex !== -1) {
    current.value = currentIndex
  }
})

const switchTab = (index: number, pagePath: string) => {
  current.value = index
  
  uni.switchTab({
    url: pagePath,
    fail: () => {
      // 如果switchTab失败，使用navigateTo
      uni.navigateTo({
        url: pagePath
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &.center-tab {
    position: relative;
    
    .tab-icon {
      position: relative;
      z-index: 2;
      background: linear-gradient(45deg, #00cec9, #00b4d8);
      border-radius: 50%;
      width: 100rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 24rpx rgba(0, 206, 201, 0.4);
      margin-bottom: 8rpx;
      
      .icon {
        font-size: 40rpx;
        color: #fff;
      }
    }
    
    .tab-text {
      font-size: 20rpx;
      color: #00cec9;
      font-weight: 600;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: -20rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 120rpx;
      height: 120rpx;
      background: #fff;
      border-radius: 50%;
      z-index: 1;
      box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    }
  }
}

.tab-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  .icon {
    font-size: 32rpx;
    color: #999;
    transition: all 0.3s ease;
  }
}

.tab-text {
  font-size: 20rpx;
  color: #999;
  transition: all 0.3s ease;
}

.tab-item.active {
  .tab-content:not(.center-tab) {
    .tab-icon {
      background: rgba(0, 206, 201, 0.1);
      
      .icon {
        color: #00cec9;
        transform: scale(1.1);
      }
    }
    
    .tab-text {
      color: #00cec9;
      font-weight: 600;
    }
  }
}

.tab-item:active {
  .tab-content:not(.center-tab) {
    transform: scale(0.95);
  }
}
</style>
