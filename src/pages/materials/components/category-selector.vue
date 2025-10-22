<template>
  <view class="category-section">
    <view class="section-header">
      <text class="section-title">热门品类</text>
      <!-- <text class="more-btn" @click="navigateToAllCategories">更多 ></text> -->
    </view>
    <scroll-view 
      class="category-scroll" 
      scroll-x
      @scrolltolower="onScrolltolower"
      :scroll-with-animation="true"
      :show-scrollbar="false"
      :enable-flex="true"
    >
      <view class="category-list">
        <!-- 全部选项 -->
        <view
          class="category-item"
          :class="{ active: selectedCategory === null }"
          @click="selectCategory(null)"
        >
          <view class="category-image all-category">
            <uni-icons type="checkmarkempty" color="#fff" size="24" />
          </view>
          <text class="category-name">全部</text>
        </view>

        <!-- 品类选项 -->
        <view
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
        >
          <image :src="category.category_image" mode="aspectFill" class="category-image" />
          <text class="category-name">{{ category.category_name }}</text>
        </view>
        
        <!-- 占位元素，确保最后一个品类不被遮挡 -->
        <view class="spacer-item"></view>
        
        <!-- 加载更多指示器 -->
        <view v-if="loading" class="loading-item">
          <view class="loading-spinner">
            <uni-icons type="spinner-cycle" size="20" color="#00cec9" />
          </view>
          <text class="loading-text">加载中...</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryListService } from '../service'

// 类型定义
interface Category {
  id: number
  category_name: string
  category_image: string
}

// 定义事件
const emit = defineEmits<{
  categoryChange: [categoryId: number | null]
}>()

// 响应式数据
const categories = ref<Category[]>([])
const loading = ref(false)
const finish = ref(false)
const selectedCategory = ref<number | null>(null)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10,
})

// 加载品类数据
const loadCategories = async (): Promise<void> => {
  if (loading.value || finish.value) return

  loading.value = true

  const { success, data } = await getCategoryListService({
    pageIndex: pageParams.value.pageIndex,
    pageSize: pageParams.value.pageSize,
  })

  if (success) {
    const newData = data || []
    
    if (newData.length === 0) {
      finish.value = true
    } else {
      categories.value.push(...newData)
      pageParams.value.pageIndex++
    }
  } else {
    finish.value = true
  }

  loading.value = false
}

// 滚动到底部加载更多
const onScrolltolower = (): void => {
  loadCategories()
}

// 选择品类
const selectCategory = (categoryId: number | null): void => {
  if (selectedCategory.value === categoryId) return

  selectedCategory.value = categoryId
  emit('categoryChange', categoryId)
}

// 跳转全部品类页面
// const navigateToAllCategories = (): void => {
//   wx.navigateTo({
//     url: '/subpackages/categories/index',
//   })
// }

// 暴露方法
defineExpose({
  loadCategories,
  resetSelection: () => {
    selectedCategory.value = null
  },
})

onMounted(() => {
  loadCategories()
})
</script>

<style lang="scss">
/* 主题色变量 */
$primary-color: #00cec9;

/* 品类展示 */
.category-section {
  background: #fff;
  margin-bottom: 8px;
  padding: 20px 0;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 16px;

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #2c3e50;
    }

    /* .more-btn {
      font-size: 14px;
      color: $primary-color;
      font-weight: 600;
    } */
  }

  .category-scroll {
    white-space: nowrap;
    padding: 0 20px 0 20px;

    .category-list {
      display: flex;
      gap: 16px;
      min-width: max-content;

      .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 70px;
        cursor: pointer;
        transition: all 0.3s ease;

        .category-image {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;

          &.all-category {
            background: linear-gradient(135deg, $primary-color 0%, #00b4d8 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba($primary-color, 0.3);
          }
        }

        .category-name {
          font-size: 13px;
          color: #666;
          text-align: center;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        &.active {
          // 让整个容器适应选中状态的变化
          padding: 3px; // 为边框和缩放留出空间

          .category-image {
            border: 3px solid $primary-color;
            box-shadow: 0 6px 20px rgba($primary-color, 0.4);
            transform: scale(1.05);

            &.all-category {
              background: linear-gradient(135deg, $primary-color 0%, #00b4d8 100%);
              box-shadow: 0 8px 25px rgba($primary-color, 0.5);
            }
          }

          .category-name {
            color: $primary-color;
            font-weight: 700;
          }
        }

        &:not(.active) {
          .category-image {
            &:hover {
              transform: scale(1.02);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
          }
        }
      }
      
      .loading-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 70px;
        padding: 16px 8px;
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 206, 201, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          animation: spin 1s linear infinite;
        }
        
        .loading-text {
          font-size: 12px;
          color: #999;
          text-align: center;
        }
      }
      
      .spacer-item {
        width: 40px;
        flex-shrink: 0;
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
