<template>
  <view class="container">
    <scroll-view
      enable-back-to-top
      :scroll-with-animation="true"
      :show-scrollbar="false"
      scroll-y
      class="scroll-view"
    >
      <!-- 房源信息卡片 -->
      <property-card :caseDetail="caseDetail" />
      <view class="divider-view"></view>

      <!-- 费用明细卡片 -->
      <cost-card :caseDetail="caseDetail" />
      <view class="divider-view"></view>

      <!-- 施工现场 -->
      <construction-section :caseDetail="caseDetail" />
      <view class="divider-view"></view>

      <!-- 完工效果 -->
      <completion-section :caseDetail="caseDetail" />
    </scroll-view>

    <!-- 底部咨询按钮 -->
    <view class="footer">
      <button class="consult-btn" @click="handleConsult">立即咨询</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import propertyCard from './components/property-card.vue'
import costCard from './components/cost-card.vue'
import constructionSection from './components/construction-section.vue'
import completionSection from './components/completion-section.vue'
// service
import { getCaseDetailService } from './sevice'

// 响应式数据
const caseDetail = ref<any>(null)

// 处理咨询
const handleConsult = (): void => {
  uni.showToast({
    title: '咨询功能开发中',
    icon: 'none',
  })
}

// 页面加载
onLoad((options) => {
  const { id } = options ?? {}
  if (id) {
    loadCaseDetail(id)
  }
})

// 加载案例详情
const loadCaseDetail = async (id: number): Promise<void> => {
  const { success, data } = await getCaseDetailService(id)
  if (success && data) {
    caseDetail.value = data
    console.log('案例详情加载成功:', data)
  }
}
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
