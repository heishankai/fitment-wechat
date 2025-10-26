<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      :class="['tab-bar-item', { center: index === 2 }]"
      @click="switchTab(item)"
    >
      <!-- 中间的房屋图标特殊处理 -->
      <view v-if="index === 2" class="house-container">
        <image 
          :src="selected === item?.selected ? item?.selectedIconPath : item?.iconPath" 
          class="house-icon building-animation"
        />
        <!-- 建造动画效果 - 一直显示 -->
        <view class="building-effects">
          <view class="brick brick-1"></view>
          <view class="brick brick-2"></view>
          <view class="brick brick-3"></view>
          <view class="sparkle sparkle-1"></view>
          <view class="sparkle sparkle-2"></view>
        </view>
      </view>
      <!-- 其他普通图标 -->
      <image v-else :src="selected === item?.selected ? item?.selectedIconPath : item?.iconPath" />
      <text :style="{ color: selected === item?.selected ? selectedColor : color }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
const color = '#2D3748'
const selectedColor = '#00cec9'

defineProps({
  selected: {
    type: String,
    default: '0',
  },
})

const tabList = ref([
  {
    selected: '0',
    pagePath: '/pages/home/index',
    text: '首页',
    iconPath: '/static/tabbar/home.png',
    selectedIconPath: '/static/tabbar/home_selected.png',
  },
  {
    selected: '1',
    pagePath: '/pages/price/index',
    text: '工种',
    iconPath: '/static/tabbar/price.png',
    selectedIconPath: '/static/tabbar/price_selected.png',
  },
  {
    selected: '2',
    pagePath: '/pages/house/index',
    text: '',
    iconPath: '/static/tabbar/house.png',
    selectedIconPath: '/static/tabbar/house.png',
    isAnimated: true,
  },
  {
    selected: '3',
    pagePath: '/pages/materials/index',
    text: '辅材',
    iconPath: '/static/tabbar/materials.png',
    selectedIconPath: '/static/tabbar/materials_selected.png',
  },
  {
    selected: '4',
    pagePath: '/pages/mine/index',
    text: '我的',
    iconPath: '/static/tabbar/profile.png',
    selectedIconPath: '/static/tabbar/profile_selected.png',
  },
])

// 跳转 tabBar 菜单栏
const switchTab = (item): void => {
  uni.vibrateShort()
  uni.switchTab({ url: item?.pagePath })
}
</script>

<style lang="scss" scoped>
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  padding: 10rpx 10rpx env(safe-area-inset-bottom) 10rpx;
  position: relative;
  z-index: 50;
}

.tab-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  image {
    width: 48rpx;
    height: 48rpx;
  }

  text {
    padding-top: 10rpx;
    font-size: 22rpx;
    font-weight: 400;
  }
}

/* 中间的 tab 设置为圆形并上浮，同时增加白色外边框 */
.tab-bar-item.center {
  flex: none; /* 取消父级的 flex: 1 影响 */
  z-index: 100;
  margin-top: -50rpx; /* 上浮效果 */
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: $uni-bg-color;
  border: 20rpx solid #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;

  image {
    width: 60rpx;
    height: 60rpx;
  }
}

/* 房屋容器 */
.house-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 房屋图标动画 */
.house-icon {
  transition: all 0.3s ease;
}

.house-icon.building-animation {
  animation: buildingPulse 2s ease-in-out infinite;
}

/* 建造效果容器 */
.building-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 砖块动画 */
.brick {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background-color: #00cec9;
  border-radius: 2rpx;
  opacity: 0;
}

.brick-1 {
  top: 20rpx;
  left: 30rpx;
  animation: brickFall 1.5s ease-in-out infinite;
}

.brick-2 {
  top: 15rpx;
  right: 25rpx;
  animation: brickFall 1.5s ease-in-out infinite 0.3s;
}

.brick-3 {
  bottom: 25rpx;
  left: 50%;
  transform: translateX(-50%);
  animation: brickFall 1.5s ease-in-out infinite 0.6s;
}

/* 闪光效果 */
.sparkle {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  background-color: #FFD700;
  border-radius: 50%;
  opacity: 0;
}

.sparkle-1 {
  top: 10rpx;
  left: 20rpx;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle-2 {
  bottom: 15rpx;
  right: 20rpx;
  animation: sparkle 2s ease-in-out infinite 0.8s;
}

/* 动画关键帧 */
@keyframes buildingPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes brickFall {
  0% {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(20rpx);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
