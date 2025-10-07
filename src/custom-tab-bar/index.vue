<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      :class="['tab-bar-item', { center: index === 2 }]"
      @click="switchTab(item)"
    >
      <image :src="selected === item?.selected ? item?.selectedIconPath : item?.iconPath" />
      <text :style="{ color: selected === item?.selected ? selectedColor : color }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
const color = '#C8BFBF'
const selectedColor = '#151515'

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
    iconPath: '../static/tabbar/index.png',
    selectedIconPath: '../static/tabbar/index_on.png',
  },
  {
    selected: '1',
    pagePath: '/pages/price/index',
    text: '工价',
    iconPath: '../static/tabbar/copywriter.png',
    selectedIconPath: '../static/tabbar/copywriter_on.png',
  },
  {
    selected: '2',
    pagePath: '/pages/house/index',
    text: '我的房子',
    iconPath: '../static/tabbar/taletelling.png',
    selectedIconPath: '../static/tabbar/taletelling_on.png',
  },
  {
    selected: '3',
    pagePath: '/pages/materials/index',
    text: '辅材',
    iconPath: '../static/tabbar/order.png',
    selectedIconPath: '../static/tabbar/order_on.png',
  },
  {
    selected: '4',
    pagePath: '/pages/profile/index',
    text: '我的',
    iconPath: '../static/tabbar/mine.png',
    selectedIconPath: '../static/tabbar/mine_on.png',
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
  z-index: 9999;
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

  image {
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
