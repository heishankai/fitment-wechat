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
      <!-- 房源信息卡片 -->
      <property-card :caseDetail="caseDetail" />
      <view class="divider-view"></view>

      <!-- 费用明细卡片 -->
      <cost-card :caseDetail="caseDetail" />
      <view class="divider-view"></view>

      <!-- 完工效果 -->
      <completion-section :caseDetail="caseDetail" />
      <view class="divider-view"></view>

      <!-- 施工现场 -->
      <construction-section :caseDetail="caseDetail" />
    </scroll-view>

    <contact-service :scrollTop="scrollTop" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import propertyCard from './components/property-card.vue'
import costCard from './components/cost-card.vue'
import constructionSection from './components/construction-section.vue'
import completionSection from './components/completion-section.vue'
import contactService from '@/components/contact-service.vue'
// service
import { getCaseDetailService } from './sevice'

// 响应式数据
const caseDetail = ref<any>(null)
const scrollTop = ref<number>()

// 加载案例详情
const loadCaseDetail = async (id: number): Promise<void> => {
  const { success, data } = await getCaseDetailService(id)
  if (success && data) {
    caseDetail.value = data
    console.log('案例详情加载成功:', data)
  }
}

// 处理滚动事件
const onScroll = (e: any): void => {
  scrollTop.value = e.detail.scrollTop
}

// 页面加载
onLoad((options) => {
  const { id } = options ?? {}
  if (id) {
    loadCaseDetail(id)
  }
})
</script>

<style lang="scss" scoped>
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
  padding: 16px;
  box-sizing: border-box;
}

.divider-view {
  height: 16px;
}
</style>
