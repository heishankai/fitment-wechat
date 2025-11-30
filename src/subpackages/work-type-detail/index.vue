<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
      @scroll="onScroll"
    >
      <!-- 商品轮播图 -->
      <view class="product-carousel">
        <swiper
          class="swiper"
          :indicator-dots="true"
          :autoplay="true"
          :circular="true"
          :duration="500"
          :interval="3000"
        >
          <swiper-item v-for="(image, index) in workTypeDetail?.display_images || []" :key="index">
            <image
              class="carousel-image"
              :src="image"
              mode="aspectFill"
              @click="previewImage(image, workTypeDetail?.display_images)"
            />
          </swiper-item>
        </swiper>
      </view>

      <view class="divider-view"></view>

      <content-area :workTypeDetail="workTypeDetail" />
    </scroll-view>
    <contact-service :scrollTop="scrollTop" />

    <!-- 底部咨询按钮 -->
    <view class="footer">
      <button class="consult-btn" @click="handleConsult">联系工匠</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { previewImage } from '@/utils'
import { getWorkTypeDetailService } from './service'
import contentArea from './components/content-area.vue'
import contactService from '@/components/contact-service.vue'

const workTypeDetail = ref<any>(null)
const scrollTop = ref<number>()

onLoad((options) => {
  const { id } = options ?? {}
  if (id) {
    loadWorkTypeDetail(id)
  }
})

const loadWorkTypeDetail = async (id: string): Promise<void> => {
  const { success, data } = await getWorkTypeDetailService(id)
  if (success && data) {
    workTypeDetail.value = data
    console.log('工种详情加载成功:', data)
  }
}

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}

// 联系工匠
const handleConsult = (): void => {
  uni.vibrateShort()

  console.log(workTypeDetail.value, 'workTypeDetail.value')
  const { work_kind_name, id } = workTypeDetail.value.work_kind ?? {}

  wx.navigateTo({
    url: `/subpackages/contact-craftsman/index?work_kind_name=${encodeURIComponent(work_kind_name)}&id=${id}`,
  })
}
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

.divider-view {
  height: 16px;
}

// 商品轮播图
.product-carousel {
  width: 100vw;
  height: 600rpx;
  background-color: #fff;
  position: relative;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // 自定义指示点样式
  :deep(.wx-swiper-dot) {
    width: 16rpx;
    height: 8rpx;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4rpx;
    margin: 0 6rpx;
  }

  :deep(.wx-swiper-dot-active) {
    width: 32rpx;
    height: 8rpx;
    background-color: #00cec9;
    border-radius: 4rpx;
    margin: 0 6rpx;
  }
}

// 全局指示点样式（备用方案）
.wx-swiper-dot {
  width: 16rpx !important;
  height: 8rpx !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
  border-radius: 4rpx !important;
  margin: 0 6rpx !important;
}

.wx-swiper-dot-active {
  width: 32rpx !important;
  height: 8rpx !important;
  background-color: #00cec9 !important;
  border-radius: 4rpx !important;
  margin: 0 6rpx !important;
}

// 底部按钮
.footer {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0; // 防止按钮被压缩

  .consult-btn {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #00cec9, #00b4d8);
    color: #fff;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
