<template>
    <view class="container">
        <scroll-view :show-scrollbar="false" :enhanced="true" class="scroll-view" scroll-y>
            <view v-for="item in 200" :key="item" class="item">
                <text>{{ item }}</text>
            </view>
        </scroll-view>
        <view>
            <text>1111</text>
        </view>
    </view>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
page {
    height: 100vh;
}

.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.scroll-view {
    flex: 1;
    overflow: hidden;
}
</style>