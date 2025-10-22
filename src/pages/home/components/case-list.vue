<template>
  <view class="case-list">
    <view
      class="case-item"
      v-for="item in caseList"
      :key="item.id"
      @click="navigateToCaseDetail(item.id)"
    >
      <view class="case-image">
        <image :src="item?.drawingroom_image[0]" mode="aspectFill" class="image" />
        <view class="case-tag" :class="{ old: item?.remodel_type !== 1 }">
          {{ item?.remodel_type === 1 ? '新房装修' : '旧房改造' }}
        </view>
      </view>
      <view class="case-info">
        <view class="case-title">{{ item?.housing_type }}</view>
        <view class="case-desc">{{ item?.city_name }} · {{ item?.square_number }}m²</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getCaseListService } from '../service'

// 接收父组件传递的城市信息
interface Props {
  selectedCity: string
}

const props = defineProps<Props>()

// 响应式数据
const allCaseList = ref<any[]>([]) // 存储所有数据
const finish = ref(false)
const currentFilter = ref<number | null>(null)

const pageParams = ref<{ pageIndex: number; pageSize: number }>({
  pageIndex: 1,
  pageSize: 10,
})

// 计算属性 - 筛选后的数据
const caseList = computed(() => {
  if (currentFilter.value === null) {
    return allCaseList.value
  }
  return allCaseList.value?.filter((item) => item?.remodel_type === currentFilter?.value)
})

// 获取案例列表数据
const loadCaseData = async (): Promise<void> => {
  console.log('loadCaseData 被调用', { finish: finish.value, pageIndex: pageParams.value.pageIndex })
  
  if (finish.value) {
    if (finish.value) {
      uni.showToast({ icon: 'none', title: '没有更多数据~' })
    }
    return
  }

  // 构建请求参数，包含城市信息
  const params = {
    ...pageParams.value,
    city_name: props.selectedCity || '杭州', // 默认城市
  }

  console.log('请求参数:', params)
  const { success, data } = await getCaseListService(params)

  if (success && data?.length) {
    // 存储到全部数据中
    allCaseList.value.push(...data)

    // 更新分页参数
    pageParams.value.pageIndex++

    // 检查是否还有更多数据
    if (data.length < pageParams.value.pageSize) {
      finish.value = true
    }
  } else {
    finish.value = true
  }
}

// 重置数据
const resetData = (): void => {
  pageParams.value.pageIndex = 1
  allCaseList.value = []
  finish.value = false
}

// 切换筛选条件
const switchFilter = (remodelType: number | null): void => {
  currentFilter.value = remodelType
}

// 跳转案例详情
const navigateToCaseDetail = (id: number): void => {
  wx.navigateTo({
    url: `/subpackages/case-item-detail/index?id=${id}`,
  })
}

// 监听城市变化，重新加载数据
watch(
  () => props.selectedCity,
  (newCity, oldCity) => {
    console.log('城市监听触发:', { newCity, oldCity, immediate: oldCity === undefined })
    if (newCity && newCity !== oldCity) {
      console.log('城市变化:', oldCity, '->', newCity)
      resetData()
      loadCaseData()
    }
  },
  // 立即执行，处理初始化
  { immediate: true },
)

// 暴露方法
defineExpose({
  resetData,
  getMore: loadCaseData,
  switchFilter,
})
</script>

<style lang="scss">
.case-list {
  padding: 8px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

  .case-item {
    background: #fff;
    border-radius: 16px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 206, 201, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    opacity: 0;
    transform: translateY(30px);
    animation: slideInUp 0.6s ease-out forwards;

    // 为每个列表项添加延迟动画
    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.08}s;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00cec9, #00b4d8);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 16px 50px rgba(0, 206, 201, 0.25);

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(-3px) scale(1.01);
      box-shadow: 0 12px 40px rgba(0, 206, 201, 0.2);
    }

    .case-image {
      position: relative;
      width: 100%;
      height: 200px;

      .image {
        width: 100%;
        height: 100%;
      }

      .case-tag {
        position: absolute;
        top: 12px;
        left: 12px;
        background: linear-gradient(135deg, #00cec9, #00b4d8);
        color: #fff;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 206, 201, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);

        &.old {
          background: linear-gradient(135deg, #6c757d, #495057);
          color: #fff;
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }
      }
    }

    .case-info {
      padding: 20px;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);

      .case-title {
        font-size: 18px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 8px;
        line-height: 1.3;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .case-desc {
        font-size: 14px;
        color: #6c757d;
        line-height: 1.4;
        font-weight: 500;
        display: flex;
        align-items: center;

        &::before {
          content: '📍';
          margin-right: 6px;
          font-size: 12px;
        }
      }
    }
  }
}

/* 列表项进入动画 */
@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
