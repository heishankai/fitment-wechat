<template>
  <view class="footer">
    <button class="consult-btn">立即咨询</button>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
// 底部按钮
.footer {
  padding: 16px 20px;
  background: #fff;
  border-top: 2px solid #f0f0f0;
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
