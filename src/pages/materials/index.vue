<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-bar" @click="navigateToSearch">
        <uni-icons type="search" color="#00cec9" size="18" />
        <text class="search-placeholder">搜索您想要的商品...</text>
      </view>
    </view>

    <!-- 品类选择组件 -->
    <category-selector @category-change="onCategoryChange" ref="categorySelectorRef" />

    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
      :scroll-with-animation="true"
      :enable-flex="true"
      @scroll="onScroll"
    >
      <!-- 商品瀑布流组件 -->
      <product-waterfall
        :selected-category="selectedCategory"
        ref="productWaterfallRef"
        @content-transitioning="onContentTransitioning"
      />
    </scroll-view>
    <contact-service :scrollTop="scrollTop" />
    <!-- <tabbar selected="3"></tabbar> -->
  </view>
</template>

<script setup lang="ts">
// components
// import tabbar from '@/components/custom-tab-bar.vue'
import categorySelector from './components/category-selector.vue'
import productWaterfall from './components/product-waterfall.vue'
import contactService from '@/components/contact-service.vue'
// 类型定义
interface CategorySelectorRef {
  loadCategories: () => Promise<void>
  resetSelection: () => void
}

interface ProductWaterfallRef {
  loadProducts: () => Promise<void>
  resetProducts: () => void
  getMore: () => void
}

// 响应式数据
const isTriggered = ref(false)
const isContentTransitioning = ref(false)
const selectedCategory = ref<number | null>(null)
const scrollTop = ref<number>(0)

// 组件引用
const categorySelectorRef = ref<CategorySelectorRef>()
const productWaterfallRef = ref<ProductWaterfallRef>()

// 品类变化处理
const onCategoryChange = (categoryId: number | null): void => {
  selectedCategory.value = categoryId
}

// 内容切换动画处理
const onContentTransitioning = (isTransitioning: boolean): void => {
  isContentTransitioning.value = isTransitioning
}

// 跳转搜索页面
const navigateToSearch = (): void => {
  wx.navigateTo({
    url: '/subpackages/search-product/index',
  })
}

// 下拉刷新
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true

  // 重置商品数据并重新加载
  productWaterfallRef.value?.resetProducts()
  await productWaterfallRef.value?.loadProducts()
  isTriggered.value = false
}

// 滚动到底部
const onScrolltolower = (): void => {
  productWaterfallRef.value?.getMore()
}

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}
</script>

<style lang="scss">
/* 主题色变量 */
$primary-color: #00cec9;
$secondary-color: #00b4d8;

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

/* 搜索栏 */
.search-header {
  padding: 20px 20px 16px;
  background: #fff;

  .search-bar {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 25px;
    padding: 14px 20px;
    gap: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 206, 201, 0.2);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4px 16px rgba(0, 206, 201, 0.15);
      border-color: rgba(0, 206, 201, 0.4);
    }

    .search-placeholder {
      color: #999;
      font-size: 15px;
      font-weight: 400;
    }
  }
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
