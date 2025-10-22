<template>
  <view class="product-list">
    <view
      class="product-item"
      v-for="product in products"
      :key="product.id"
      @click="navigateToDetail(product)"
    >
      <view class="product-image">
        <image :src="product.commodity_cover" mode="aspectFill" class="image" />
      </view>
      <view class="product-info">
        <view class="product-name">{{ product.commodity_name }}</view>
        <view class="product-desc">{{ product.commodity_description }}</view>
        <view class="product-price">¥{{ product.commodity_price }}</view>
      </view>
      <view class="product-arrow">
        <uni-icons type="right" size="16" color="#00cec9" />
      </view>
    </view>
  </view>

  <!-- 没有更多数据 -->
  <view class="no-more" v-if="finish && products.length > 0">
    <text>没有更多商品了~</text>
  </view>

  <!-- 空数据状态 -->
  <view class="empty-state" v-if="!loading && products.length === 0">
    <uni-icons type="shop" size="60" color="#00cec9" />
    <text>暂无商品</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCommodityListService } from '../service'

// 类型定义
interface Product {
  id: number
  commodity_name: string
  commodity_price: number
  commodity_description: string
  commodity_cover: string
  category_name: string
  category_id: number
}

interface PageParams {
  pageIndex: number
  pageSize: number
}

// 定义属性
interface Props {
  searchKeyword?: string
}

const props = defineProps<Props>()

// 响应式数据
const products = ref<Product[]>([])
const loading = ref(false)
const finish = ref(false)
const pageParams = ref<PageParams>({
  pageIndex: 1,
  pageSize: 10,
})

// 加载商品数据
const loadProducts = async (): Promise<void> => {
  if (finish.value || loading.value) {
    if (finish.value) {
      uni.showToast({
        icon: 'none',
        title: '没有更多数据~',
        duration: 1500,
      })
    }
    return
  }

  loading.value = true

  const params = {
    ...pageParams.value,
    commodity_name: props.searchKeyword || '',
  }

  console.log('请求商品数据参数:', params)
  const { data, success } = await getCommodityListService(params)

  if (!success) {
    finish.value = true
    return
  }

  const newData = data || []

  if (newData.length === 0) {
    finish.value = true
    return
  }

  products.value.push(...newData)
  pageParams.value.pageIndex++

  loading.value = false
}

// 重置商品数据
const resetProducts = (): void => {
  pageParams.value.pageIndex = 1
  products.value = []
  finish.value = false
  loading.value = false
}

// 跳转商品详情
const navigateToDetail = (product: any): void => {
  wx.navigateTo({
    url: `/subpackages/product-detail/index?id=${product.id}`,
  })
}

// 暴露方法
defineExpose({
  loadProducts,
  resetProducts,
  getMore: loadProducts,
})

// 初始化加载商品
loadProducts()
</script>

<style lang="scss">
.product-list {
  padding: 16px;
  background: #f5f5f5;

  .product-item {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .product-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 16px;
      flex-shrink: 0;

      .image {
        width: 100%;
        height: 100%;
      }
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .product-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-desc {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-price {
        font-size: 18px;
        font-weight: 700;
        color: #00cec9;
        margin-top: 4px;
      }
    }

    .product-arrow {
      margin-left: 12px;
      flex-shrink: 0;
    }
  }
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #ccc;
  font-size: 16px;
  gap: 12px;
}
</style>
