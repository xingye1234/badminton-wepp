<template>
  <view class="bg-white rounded-2xl shadow p-6 mx-4 mt-4">
    <view class="flex items-center justify-between mb-4">
      <view class="flex items-center">
        <text class="i-mdi:robot text-xl text-blue-500 mr-2" />
        <text class="text-lg font-bold">AI教练建议</text>
      </view>
      <view class="px-2 py-1 bg-blue-50 rounded-full">
        <text class="text-xs text-blue-600">每日更新</text>
      </view>
    </view>
    
    <!-- AI教练建议内容 -->
    <view class="bg-blue-50 rounded-lg p-4 relative">
      <view class="absolute -top-3 -left-3 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
        <text class="text-white text-xl">🤖</text>
      </view>
      <text class="text-sm text-gray-700 mb-3">{{ aiCoachMessage }}</text>
      
      <!-- 训练建议 -->
      <view class="bg-white rounded-lg p-3 mt-2">
        <view class="flex items-center mb-2">
          <text class="i-mdi:arm-flex text-blue-500 mr-2"></text>
          <text class="text-sm font-bold">今日推荐训练</text>
        </view>
        <view class="flex flex-wrap gap-2 mt-2">
          <view v-for="(item, idx) in dailyTrainingRecommendations" :key="idx" 
                class="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700">
            {{ item }}
          </view>
        </view>
      </view>
      
      <!-- 饮食建议 -->
      <view class="bg-white rounded-lg p-3 mt-2">
        <view class="flex items-center mb-2">
          <text class="i-mdi:food-apple text-green-500 mr-2"></text>
          <text class="text-sm font-bold">营养搭配建议</text>
        </view>
        <text class="text-xs text-gray-600">{{ dietRecommendation }}</text>
      </view>
    </view>
    
    <!-- 开始训练按钮 -->
    <view class="flex justify-center mt-4">
      <view class="px-4 py-2 bg-blue-500 text-white rounded-full text-sm flex items-center" @click="handleStartTraining">
        <text class="i-mdi:check-circle mr-2"></text>
        <text>开始训练</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  aiCoachMessage: {
    type: String,
    default: ''
  },
  dailyTrainingRecommendations: {
    type: Array as () => string[],
    default: () => []
  },
  dietRecommendation: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['start-training']);

const handleStartTraining = () => {
  emit('start-training');
};
</script>

<style scoped>
</style> 