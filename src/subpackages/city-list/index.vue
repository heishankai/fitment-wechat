<template>
  <view class="city-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <uni-icons type="search" color="#999" size="18" />
        <input
          v-model="searchKeyword"
          placeholder="搜索城市"
          placeholder-style="color: #999"
          @input="onSearchInput"
          focus
        />
      </view>
    </view>

    <!-- 城市列表 -->
    <scroll-view class="city-scroll" scroll-y>
      <!-- 搜索结果 -->
      <view v-if="isSearching" class="search-results">
        <view
          v-for="city in searchResults"
          :key="city.id"
          class="city-item"
          @click="selectCity(city)"
        >
          <text class="city-name">{{ city.city_name }}</text>
        </view>
        <view v-if="searchResults.length === 0" class="no-result">
          <text>未找到相关城市</text>
        </view>
      </view>

      <!-- 全部城市列表 -->
      <view v-else class="all-cities">
        <view v-for="city in cityList" :key="city.id" class="city-item" @click="selectCity(city)">
          <text class="city-name">{{ city.city_name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCityListService, type CityData } from './service'

// 响应式数据
const cityList = ref<CityData[]>([])
const searchKeyword = ref('')
const isSearching = ref(false)

// 搜索结果
const searchResults = computed(() => {
  if (!searchKeyword.value.trim()) return []

  return cityList.value.filter((city) => city.city_name.includes(searchKeyword.value.trim()))
})

// 搜索输入处理
const onSearchInput = (): void => {
  isSearching.value = searchKeyword.value.trim().length > 0
}

// 选择城市
const selectCity = (city: CityData): void => {
  // 存储选中的城市到本地
  wx.setStorageSync('selectedCity', city)
  // 返回上一页
  wx.navigateBack()
}

// 页面加载
onLoad(() => {
  getCityListService().then(({ success, data }) => {
    if (success && data?.length) {
      cityList.value = data
    }
  })
})
</script>

<style lang="scss" scoped>
.city-list-page {
  height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.search-bar {
  background: #fff;
  padding: 20px 16px;
  border-bottom: 1px solid #eee;

  .search-input {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 12px 16px;

    input {
      flex: 1;
      margin-left: 8px;
      font-size: 16px;
      color: #333;
    }
  }
}

.city-scroll {
  flex: 1;
  height: 0;
}

.search-results,
.all-cities {
  padding: 16px 0;

  .city-item {
    margin-top: 12px;
    background: #fff;
    padding: 16px 20px;
    margin-bottom: 1px;
    border-radius: 0;
    transition: background-color 0.2s;

    &:active {
      background: #f8f9fa;
    }

    .city-name {
      font-size: 16px;
      color: #333;
    }
  }
}

.no-result {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
