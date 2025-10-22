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
        <swiper class="swiper" :indicator-dots="true" :autoplay="false" :circular="true">
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

      <!-- 商品基本信息 -->
      <custom-card>
        <view class="product-info">
          <view class="category-tag">地砖瓷砖</view>
          <view class="product-title">{{ productDetail?.commodity_name }}</view>
          <view class="product-price">¥{{ productDetail?.commodity_price }}/片</view>
        </view>
      </custom-card>
      <view class="divider-view"></view>

      <!-- 服务保障 -->
      <custom-card>
        <view class="service-guarantee">
          <view class="section-header">
            <view class="icon-wrapper">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-anquanbaozhang"
                color="#00cec9"
                size="20"
              />
            </view>
            <text class="title">服务保障</text>
          </view>
          <view class="guarantee-content">
            {{ productDetail?.service_guarantee }}
          </view>
        </view>
      </custom-card>
      <view class="divider-view"></view>

      <!-- 商品描述 -->
      <custom-card>
        <view class="product-description">
          <view class="section-header">
            <view class="icon-wrapper">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-zanwushuju"
                color="#00cec9"
                size="20"
              />
            </view>
            <text class="title">商品描述</text>
          </view>
          <view class="description-content">
            {{ productDetail?.commodity_description }}
          </view>
        </view>
      </custom-card>
      <view class="divider-view"></view>

      <!-- 商品详情图片 -->
      <custom-card>
        <view class="product-details">
          <view class="section-header">
            <view class="separator"></view>
            <text class="title">商品详情</text>
          </view>
          <view class="detail-images">
            <image
              v-for="(image, index) in productDetail?.commodity_detail_images || []"
              :key="index"
              class="detail-image"
              :src="image"
              mode="widthFix"
              @click="handlePreviewImage(index)"
            />
          </view>
        </view>
      </custom-card>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { previewImage } from '@/utils'
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
const handlePreviewImage = (index: number): void => {
  previewImage(
    productDetail.value?.commodity_detail_images?.[index] || '',
    productDetail.value?.commodity_detail_images?.map((item: string) => item) || [''],
  )
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

// 商品基本信息
.product-info {
  padding: 0px 16px;

  .category-tag {
    display: inline-block;
    padding: 12rpx 24rpx;
    background-color: #00cec9;
    color: #fff;
    font-size: 26rpx;
    border-radius: 30rpx;
    margin-bottom: 24rpx;
    font-weight: 500;
  }

  .product-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    line-height: 1.5;
    margin-bottom: 24rpx;
  }

  .product-price {
    font-size: 40rpx;
    font-weight: 700;
    color: #00cec9;
  }
}

// 服务保障
.service-guarantee {
  margin: 0px 16px;

  background-color: #f8f9fa;
  border: 1rpx solid #f0f0f0;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .icon-wrapper {
      width: 70rpx;
      height: 70rpx;
      background-color: #e8f8f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
    }

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .guarantee-content {
    font-size: 30rpx;
    color: #666;
    line-height: 1.8;
    text-align: justify;
  }
}

// 商品描述
.product-description {
  margin: 0px 16px;
  background-color: #f8f9fa;
  border: 1rpx solid #f0f0f0;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .icon-wrapper {
      width: 70rpx;
      height: 70rpx;
      background-color: #e8f8f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
    }

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .description-content {
    font-size: 30rpx;
    color: #666;
    line-height: 1.8;
    text-align: justify;
  }
}

// 商品详情
.product-details {
  margin: 0px 16px;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;

    .separator {
      width: 8rpx;
      height: 36rpx;
      background-color: #00cec9;
      margin-right: 24rpx;
      border-radius: 4rpx;
    }

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .detail-images {
    .detail-image {
      width: 100%;
      margin-bottom: 24rpx;
      border-radius: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
