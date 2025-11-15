<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
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
          <swiper-item v-for="(image, index) in productDetail?.commodity_images || []" :key="index">
            <image
              class="carousel-image"
              :src="image"
              mode="aspectFill"
              @click="handlePreviewCarouselImage(index)"
            />
          </swiper-item>
        </swiper>
      </view>
      <view class="divider-view"></view>

      <view class="content-area">
        <view class="category-tag">地砖瓷砖</view>

        <view class="divider-view"></view>

        <view class="product-title">{{ productDetail?.commodity_name }}</view>

        <view class="divider-view"></view>

        <view class="product-price">
          <text class="product-price-value">¥{{ productDetail?.commodity_price }}</text>
          <text class="product-price-unit">/片</text>
        </view>

        <view class="divider-view"></view>

        <custom-card>
          <view class="card-header">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-anquanbaozhang"
              color="#00cec9"
              size="20"
            />
            <text class="card-title">服务保障</text>
          </view>
          <view class="card-content">
            {{ productDetail?.service_guarantee }}
          </view>
        </custom-card>

        <view class="divider-view"></view>

        <custom-card>
          <view class="card-header">
            <uni-icons custom-prefix="iconfont" type="icon-zanwushuju" color="#00cec9" size="20" />
            <text class="card-title">商品描述</text>
          </view>
          <view class="card-content">
            {{ productDetail?.commodity_description }}
          </view>
        </custom-card>

        <view class="divider-view"></view>

        <custom-card>
          <view class="section-title">商品详情</view>
          <view
            class="detail-item"
            v-for="(item, index) in productDetail?.commodity_details || []"
            :key="index"
          >
            <section-header v-if="item.title" :title="item.title" />
            <image
              v-for="(image, imgIndex) in item.image || []"
              :key="imgIndex"
              class="detail-image"
              :src="image"
              mode="widthFix"
              :class="{ 'has-title': item.title }"
              @click="handlePreviewImage(image, item.image)"
            />
            <view class="detail-desc" v-if="item.desc">
              {{ item.desc }}
            </view>
          </view>
        </custom-card>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { previewImage } from '@/utils'
import customCard from '@/components/custom-card.vue'
import sectionHeader from '@/components/section-header.vue'
// service
import { getCommodityDetailService } from './service'

const productDetail = ref<any>(null)

// 加载商品详情
const loadProductDetail = async (id: string): Promise<void> => {
  const { success, data } = await getCommodityDetailService(id)
  if (!success) return

  productDetail.value = data
}

// 查看轮播图图片
const handlePreviewCarouselImage = (index: number): void => {
  previewImage(
    productDetail.value?.commodity_images?.[index] || '',
    productDetail.value?.commodity_images?.map((item: string) => item) || [''],
  )
}

// 查看图片详情
const handlePreviewImage = (currentImage: string, images: string[]): void => {
  const allImages =
    productDetail.value?.commodity_details?.flatMap((item: any) => item.image || []) || []
  previewImage(currentImage, allImages.length > 0 ? allImages : images)
}

// 页面加载
onLoad((options) => {
  const { id } = options ?? {}
  if (id) {
    loadProductDetail(id)
  }
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
  background: #fff;
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

.content-area {
  padding: 16px;
}

.category-tag {
  width: fit-content;
  background: linear-gradient(135deg, #00cec9, #00b4d8);
  color: #fff;
  padding: 6px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
}

.product-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.5;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 4px;

  .product-price-value {
    font-size: 24px;
    font-weight: 600;
    color: #00cec9;
  }

  .product-price-unit {
    font-size: 16px;
    font-weight: 400;
    color: #2c3e50;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
  }
}

.card-content {
  font-size: 15px;
  line-height: 1.8;
  color: #555;
  word-break: break-all;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0;
}

// 商品详情
.detail-item {
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }

  .detail-image {
    width: 100%;
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }

    &.has-title {
      margin-top: 16px;
    }
  }

  .detail-desc {
    font-size: 15px;
    line-height: 1.8;
    color: #555;
    padding: 0;
    word-break: break-all;
    position: relative;
  }
}
</style>
