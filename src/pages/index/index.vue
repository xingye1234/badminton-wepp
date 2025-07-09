<template>
  <view class="bg-[#f6fbff] h-screen">
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
      <view v-if="todayRecord" class="w-full mb-4 p-4 bg-blue-50 rounded-xl">
        <view class="flex justify-between items-center mb-2">
          <text class="font-bold">{{getIntensityLabel(todayRecord.intensity)}}</text>
          <text class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold">已完成</text>
        </view>
        <view class="flex justify-between text-sm text-gray-500">
          <text>时长: {{todayRecord.duration}}分钟</text>
          <text>消耗: {{todayRecord.calorie}}卡</text>
        </view>
      </view>
      <button
        class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white text-lg font-bold flex items-center justify-center"
        @click="handleNavTo"
      >
        <text class="i-mdi:play-circle-outline text-xl mr-2" />
        {{ todayRecord ? '修改打卡记录' : '开始训练打卡' }}
      </button>
    </view>

    <!-- 本月进度卡片 -->
    <view class="bg-white rounded-2xl shadow p-6 mx-4 mt-4">
      <view class="flex items-baseline mb-2 flex-col">
        <text class="text-lg font-bold mr-2">本月进度</text>
        <text class="text-gray-500 text-sm"
          >已训练 {{stats.totalDays}} 天 / 目标 {{monthlyTarget}} 天 · 连续 {{stats.streak}} 天</text
        >
      </view>
      <view class="flex items-center justify-between mb-2 mt-2">
        <text class="text-gray-500 text-sm">完成进度</text>
        <text class="text-black text-sm font-bold">{{percentage}}%</text>
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
          <text :class="percentage >= 25 ? 'text-blue-600 font-bold' : ''">25%</text>
          <text>{{Math.round(monthlyTarget * 0.25)}}天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text :class="percentage >= 50 ? 'text-blue-600 font-bold' : ''">50%</text>
          <text>{{Math.round(monthlyTarget * 0.5)}}天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text :class="percentage >= 75 ? 'text-blue-600 font-bold' : ''">75%</text>
          <text>{{Math.round(monthlyTarget * 0.75)}}天</text>
        </view>
        <view class="flex flex-col items-center w-1/5">
          <text>{{monthlyTarget}}天</text>
        </view>
      </view>
    </view>

    <!-- 最近记录 -->
    <view v-if="recentRecords.length > 0" class="bg-white rounded-2xl shadow p-6 mx-4 mt-4">
      <text class="text-lg font-bold mb-4">最近记录</text>
      <view>
        <view
          v-for="(record, index) in recentRecords"
          :key="record.date"
          class="flex justify-between items-center p-4 bg-[#f8fafc] rounded-xl mb-3"
        >
          <view>
            <text class="text-base font-medium">{{getIntensityLabel(record.intensity)}}</text>
            <text class="block text-xs text-gray-400 mt-1">{{formatDateDisplay(record.date)}}</text>
          </view>
          <text class="text-lg font-bold text-gray-800">{{record.duration}}分钟</text>
        </view>
      </view>
    </view>

    <MilestoneMask v-model:show="showMilestone" :percentage="percentage" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { onShow } from '@dcloudio/uni-app';
import MilestoneMask from "@/components/MilestoneMask.vue";
import { 
  getAllRecords, 
  getTodayString, 
  getRecordByDate, 
  getCurrentMonthStats, 
  getMonthlyTarget,
  ClockInRecord
} from "@/utils/storage";

function getTodayStr() {
  const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const week = weekMap[now.getDay()];
  return `${month}月${date}日星期${week}`;
}

const todayStr = ref(getTodayStr());
const todayRecord = ref<ClockInRecord | null>(null);
const allRecords = ref<ClockInRecord[]>([]);
const stats = ref({
  totalDays: 0,
  totalDuration: 0,
  totalCalorie: 0,
  easyDays: 0,
  mediumDays: 0,
  hardDays: 0,
  easyDuration: 0,
  mediumDuration: 0,
  hardDuration: 0,
  streak: 0,
  maxStreak: 0
});
const monthlyTarget = ref(20);
const recentRecords = computed(() => {
  return allRecords.value.slice(0, 3);
});

// 加载数据
onMounted(() => {
  loadData();
});

// 页面显示时重新加载数据
onShow(() => {
  loadData();
});

function loadData() {
  // 加载今日打卡记录
  todayRecord.value = getRecordByDate(getTodayString());
  
  // 加载所有记录
  allRecords.value = getAllRecords();
  
  // 加载本月统计
  stats.value = getCurrentMonthStats();
  
  // 加载每月目标天数
  monthlyTarget.value = getMonthlyTarget();
}

function getIntensityLabel(intensity: string): string {
  switch (intensity) {
    case 'easy': return '轻松训练';
    case 'medium': return '中等强度';
    case 'hard': return '高强度训练';
    default: return '未知强度';
  }
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

// 进度相关
const percentage = computed(() => {
  return Math.min(100, Math.round((stats.value.totalDays / monthlyTarget.value) * 100));
});
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
  });
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
