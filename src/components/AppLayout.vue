<template>
  <view class="app-layout" :style="{ paddingBottom: safeAreaInsetBottom + 'px' }">
    <!-- 自定义顶部区域插槽 -->
    <slot name="header"></slot>

    <!-- 主要内容区域 -->
    <view class="app-layout__content">
      <slot></slot>
    </view>

    <!-- 自定义底部区域插槽 -->
    <slot name="footer"></slot>

    <!-- 底部安全区域占位 -->
    <!-- <view class="safe-area-inset-bottom" :style="{ height: safeAreaInsetBottom + 'px' }"></view> -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 底部安全区域高度
const safeAreaInsetBottom = ref(0)

// 在组件挂载时获取安全区域信息
onMounted(() => {
  calculateSafeAreaInset()
})

// 计算底部安全区域
const calculateSafeAreaInset = () => {
  // 获取系统信息
  uni.getSystemInfo({
    success: (res) => {
      // 获取底部安全区域高度
      if (res.safeAreaInsets) {
        safeAreaInsetBottom.value = res.safeAreaInsets.bottom || 0
      } else {
        // 兼容处理：如果没有safeAreaInsets，计算近似值
        const isIPhoneX = /iphone/gi.test(res.model) && 
                         (res.screenHeight >= 812 && res.screenWidth >= 375)
        safeAreaInsetBottom.value = isIPhoneX ? 34 : 0
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f6fbff;

  &__content {
    flex: 1;
  }

  .safe-area-inset-bottom {
    width: 100%;
  }
}
</style> 