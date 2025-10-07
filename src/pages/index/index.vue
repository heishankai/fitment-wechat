<template>首页</template>

<script setup lang="ts">
import { getUserInfoService } from './service'

onLoad(() => {
  getUserInfoService().then((res) => {
    console.log('res', res)
  })
  console.log('发送请求')
})
</script>

<style lang="scss"></style>
