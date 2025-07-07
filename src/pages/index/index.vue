<template>
  <view class="bg-[#f6fbff] min-h-screen pb-6">
    <!-- 顶部标题区 -->
    <view class="pt-8 pb-2 flex flex-col items-center">
      <text class="text-base text-gray-500 mt-2">坚持训练，成就更好的自己</text>
      <view class="flex items-center mt-1">
        <view class="w-10 h-10 rounded-full bg-green-400 mr-1" />
        <text class="text-xs text-gray-400">数据已同步</text>
      </view>
    </view>

    <!-- 今日训练卡片 -->
    <view
      class="bg-white rounded-2xl shadow p-6 mx-4 mt-4 flex flex-col items-center"
    >
      <view class="flex items-center mb-2">
        <text class="i-mdi:target text-xl text-blue-600 mr-2" />
        <text class="text-xl font-bold">今日训练</text>
      </view>
      <text class="text-gray-500 mb-4">{{ todayStr }}</text>
      <button
        class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white text-lg font-bold flex items-center justify-center"
        @click="handleNavTo"
      >
        <text class="i-mdi:play-circle-outline text-xl mr-2" />
        开始训练打卡
      </button>
    </view>

    <!-- 本月进度卡片 -->
    <view class="bg-white rounded-2xl shadow p-6 mx-4 mt-4">
      <view class="flex items-baseline mb-2 flex-col">
        <text class="text-lg font-bold mr-2">本月进度</text>
        <text class="text-gray-500 text-sm"
          >已训练 11 天 / 目标 20 天 · 连续 0 天</text
        >
      </view>
      <view class="flex items-center justify-between mb-2 mt-2">
        <text class="text-gray-500 text-sm">完成进度</text>
        <text class="text-black text-sm font-bold">55%</text>
      </view>
      <wd-progress
        :percentage="percentage"
        stroke-width="10"
        color="#2563eb"
        hide-text
        track-color="#e5e7eb"
        :show-text="false"
        class="mb-1"
      />
      <view class="flex justify-between text-xs text-gray-400 mt-1">
        <view class="flex flex-col items-center w-1/5">
          <text>0天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text class="text-blue-600 font-bold">25%</text>
          <text>5天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text class="text-blue-600 font-bold">50%</text>
          <text>10天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text class="text-gray-400 font-bold">75%</text>
          <text>15天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text>20天</text>
        </view>
      </view>
    </view>

    <!-- 最近记录 -->
    <view class="bg-white rounded-2xl shadow p-6 mx-4 mt-4">
      <text class="text-lg font-bold mb-4">最近记录</text>
      <view>
        <view
          class="flex justify-between items-center p-4 bg-[#f8fafc] rounded-xl mb-3"
        >
          <view>
            <text class="text-base font-medium">高强度训练</text>
            <text class="block text-xs text-gray-400 mt-1">22025/6/20</text>
          </view>
          <text class="text-lg font-bold text-gray-800">95分钟</text>
        </view>
        <view
          class="flex justify-between items-center p-4 bg-[#f8fafc] rounded-xl mb-3"
        >
          <view>
            <text class="text-base font-medium">高强度训练</text>
            <text class="block text-xs text-gray-400 mt-1">2025/6/22</text>
          </view>
          <text class="text-lg font-bold text-gray-800">90分钟</text>
        </view>
      </view>
    </view>

    <MilestoneMask v-model:show="showMilestone" :percentage="percentage" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MilestoneMask from "@/components/MilestoneMask.vue";

function getTodayStr() {
  const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const week = weekMap[now.getDay()];
  return `${month}月${date}日星期${week}`;
}

const todayStr = ref(getTodayStr());

// 进度相关
const percentage = ref(50);
const milestones = [25, 50, 75, 100];
const triggered = ref([false, false, false, false]);
const showMilestone = ref(false);

watch(percentage, (val) => {
  milestones.forEach((m, idx) => {
    if (val >= m && !triggered.value[idx]) {
      triggered.value[idx] = true;
      showMilestone.value = true;
      setTimeout(() => {
        showMilestone.value = false;
      }, 1500);
    }
  });
});

const handleNavTo = () => {
  uni.navigateTo({
    url:'/pages/clockIn/index'
  })
};
</script>
<style lang="scss" scoped>
:deep(.wd-progress .wd-progress__outer .wd-progress__inner) {
  height: 10px;
  border-radius: 5px;
}
:deep(.wd-progress .wd-progress__outer) {
  height: 10px;
  border-radius: 5px;
}
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.animate-fade-in-out {
  animation: fade-in-out 1.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.7);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.animate-bounce-in {
  animation: bounce-in 0.5s;
}
</style>
