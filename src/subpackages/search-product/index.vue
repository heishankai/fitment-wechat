<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-header">
      <view class="search-box">
        <uni-icons type="search" size="18" color="#999" />
        <input
          v-model="searchKeyword"
          placeholder="搜索商品名称"
          class="search-input"
          @confirm="onSearch"
          @input="onSearchInput"
          confirm-type="search"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <uni-icons type="clear" size="16" color="#999" />
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
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
    >
      <!-- 商品列表 -->
      <product-list ref="productListRef" :search-keyword="searchKeyword" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { debounce } from 'lodash-es'
import ProductList from './components/product-list.vue'

// 搜索相关状态
const searchKeyword = ref('')
const isSearchMode = ref(false)
const isTriggered = ref(false)
const productListRef = ref<any>()

// 执行搜索的函数
const performSearch = async (): Promise<void> => {
  if (productListRef.value) {
    productListRef.value.resetProducts()
    await productListRef.value.loadProducts()
  }
}

// 防抖搜索函数
const debouncedSearch = debounce(performSearch, 500)

// 搜索输入处理
const onSearchInput = (e: any): void => {
  const value = e.detail.value
  searchKeyword.value = value

  // 如果输入框为空，退出搜索模式
  if (!value.trim()) {
    isSearchMode.value = false
    productListRef.value?.resetProducts()
    return
  }

  // 输入时直接搜索
  isSearchMode.value = true

  // 使用防抖搜索
  debouncedSearch()
}

// 执行搜索
const onSearch = async (): Promise<void> => {
  isSearchMode.value = true

  // 等待下一个tick确保组件状态更新
  await new Promise((resolve) => setTimeout(resolve, 0))

  if (productListRef.value) {
    productListRef.value.resetProducts()
    await productListRef.value.loadProducts()
  }
}

// 清空搜索
const clearSearch = (): void => {
  searchKeyword.value = ''
  isSearchMode.value = false
  productListRef.value?.resetProducts()
}

// 滚动触底事件
const onScrolltolower = (): void => {
  productListRef.value?.getMore()
}

// 下拉刷新
const onRefresherrefresh = async (): Promise<void> => {
  isTriggered.value = true

  if (productListRef.value) {
    productListRef.value.resetProducts()
    await productListRef.value.loadProducts()
  }

  isTriggered.value = false
}
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.search-header {
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  .search-box {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 16px;
    gap: 8px;

    .search-input {
      flex: 1;
      font-size: 14px;
      color: #333;
      background: transparent;
      border: none;
      outline: none;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ddd;
    }
  }
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
