<template>
  <app-layout>
    <view class="bg-[#f6fbff] min-h-screen pb-5">
    <!-- 顶部标题区 -->
    <view class="pt-8 pb-2 flex flex-col items-center">
      <text class="text-base text-gray-500 mt-2">坚持训练，成就更好的自己</text>
      <view class="flex items-center mt-1">
        <view class="w-10 h-10 rounded-full bg-green-400 mr-1" />
        <text class="text-xs text-gray-400">数据已同步</text>
      </view>
    </view>

    <!-- 今日训练卡片 -->
    <view class="today-training rounded-2xl shadow p-6 mx-4 mt-4 flex flex-col items-center relative">
      <div class="shimmer"></div>
      <view class="flex items-center mb-2 z-10">
        <text class="i-mdi:target text-xl text-white mr-2" />
        <text class="text-xl font-bold text-white">今日训练</text>
      </view>
      <text class="text-gray-100 mb-4 z-10">{{ todayStr }}</text>
      <view v-if="todayRecord" class="w-full mb-4 p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl z-10">
        <view class="flex justify-between items-center mb-2">
          <view :class="[
            'intensity-tag px-3 py-1 rounded-full text-white font-bold',
            todayRecord.intensity === 'easy' ? 'easy' : '',
            todayRecord.intensity === 'medium' ? 'medium' : '',
            todayRecord.intensity === 'hard' ? 'hard' : ''
          ]">
            {{getIntensityLabel(todayRecord.intensity)}}
          </view>
          <view class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <text class="i-mdi:check-circle mr-1 animate-check"></text>
            已完成
          </view>
        </view>
        <view class="flex justify-between text-sm text-gray-100">
          <text>时长: {{todayRecord.duration}}分钟</text>
          <text class="font-bold text-white calorie-pulse">消耗: {{todayRecord.calorie}}卡</text>
        </view>
      </view>
      <button
        class="action-button w-full py-3 text-white text-lg font-bold flex items-center justify-center z-10"
        @click="handleNavTo"
      >
        <text class="i-mdi:play-circle-outline text-xl mr-2" />
        {{ todayRecord ? '修改打卡记录' : '开始训练打卡' }}
      </button>
    </view>

    <!-- 本月进度卡片 -->
    <view class="bg-white rounded-2xl shadow p-6 mx-4 mt-4 relative">
      <view class="flex items-baseline mb-2 flex-col">
        <text class="text-lg font-bold mr-2">本月进度</text>
        <view class="flex items-center">
          <text class="text-gray-500 text-sm">已训练 {{stats.totalDays}} 天 / 目标 {{monthlyTarget}} 天</text>
          <view v-if="stats.streak > 1" class="ml-3 bg-yellow-100 px-2 py-1 rounded-full flex items-center">
            <text class="i-mdi:fire text-yellow-500 mr-1"></text>
            <text class="text-xs text-yellow-600 font-bold">连续{{stats.streak}}天</text>
          </view>
        </view>
      </view>
      
      <view v-if="stats.totalDays < monthlyTarget" class="text-sm text-blue-500 font-medium mb-2">
        再坚持{{monthlyTarget - stats.totalDays}}天，完成本月目标!
      </view>
      <view v-else class="text-sm text-green-500 font-medium mb-2 flex items-center">
        <text class="i-mdi:trophy text-yellow-500 mr-1"></text>
        恭喜你已完成本月训练目标!
      </view>
      
      <view class="flex items-center justify-between mb-2 mt-2">
        <text class="text-gray-500 text-sm">完成进度</text>
        <text class="text-black text-sm font-bold animate-number">{{percentage}}%</text>
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
      <div class="text-lg font-bold mb-4">最近记录</div>
      <view>
        <view
          v-for="(record, index) in recentRecords"
          :key="record.date"
          :class="[
            'record-item flex justify-between items-center p-4 rounded-xl mb-3',
            record.intensity === 'easy' ? 'bg-green-50 border-l-4 border-green-400' : '',
            record.intensity === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-400' : '',
            record.intensity === 'hard' ? 'bg-red-50 border-l-4 border-red-400' : '',
            !record.intensity ? 'bg-[#f8fafc]' : ''
          ]"
          @click="showRecordDetail(record)"
        >
          <view>
            <text class="text-base font-medium">{{getIntensityLabel(record.intensity)}}</text>
            <text class="block text-xs text-gray-400 mt-1">
              <text class="text-xs text-gray-400">{{formatDateMonth(record.date)}}</text>
              <text class="text-xs">{{formatDateDay(record.date)}}</text>
            </text>
          </view>
          <text class="text-lg font-bold" :class="[
            record.intensity === 'easy' ? 'text-green-700' : '',
            record.intensity === 'medium' ? 'text-yellow-700' : '',
            record.intensity === 'hard' ? 'text-red-700' : 'text-gray-800'
          ]">{{record.duration}}分钟</text>
        </view>
      </view>
    </view>
    
    <AICoachCard 
      :ai-coach-message="aiCoachMessage"
      :daily-training-recommendations="dailyTrainingRecommendations"
      :diet-recommendation="dietRecommendation"
      @start-training="handleNavTo"
    />

    <!-- 社交分享功能 -->
    <view class="bg-white rounded-2xl shadow p-6 mx-4 mt-4">
      <view class="flex items-center mb-4">
        <text class="i-mdi:share-variant text-xl text-purple-500 mr-2" />
        <text class="text-lg font-bold">分享成就</text>
      </view>
      
      <!-- 分享卡片预览 -->
      <view class="relative">
        <view class="bg-gradient-to-br from-purple-100 to-blue-50 rounded-lg p-5 border border-purple-200 mb-4 share-card">
          <view class="flex items-center">
            <image v-if="avatarUrl" :src="avatarUrl" class="w-88 h-88 rounded-full" />
            <view v-else class="w-88 h-88 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xl font-bold">
              {{ nickname.charAt(0) }}
            </view>
            <view class="ml-4">
              <text class="text-lg font-bold">{{ nickname }}</text>
              <view class="flex items-center">
                <text class="text-xs text-gray-500">本月目标完成率</text>
                <text class="text-lg font-bold ml-2 text-purple-600">{{ percentage }}%</text>
              </view>
            </view>
          </view>
          
          <view class="my-4">
            <view class="w-full h-15 bg-gray-100 rounded-full overflow-hidden">
              <view class="h-15 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" :style="`width: ${percentage}%`"></view>
            </view>
          </view>
          
          <view class="flex items-center justify-between">
            <view class="flex items-center">
              <text class="i-mdi:calendar-check text-green-500 mr-1"></text>
              <text class="text-sm">已打卡{{ stats.totalDays }}天</text>
            </view>
            <view class="flex items-center">
              <text class="i-mdi:clock-outline text-blue-500 mr-1"></text>
              <text class="text-sm">累计{{ totalTrainingHours }}小时</text>
            </view>
          </view>
          
          <view class="absolute top-2 right-2 bg-yellow-400 px-2 py-1 rounded-full transform rotate-12">
            <text class="text-xs font-bold text-white">来挑战我！</text>
          </view>
          
          <view class="mt-3 pt-3 border-t border-purple-100 flex justify-center">
            <text class="text-xs text-gray-500">扫码加入羽毛球打卡挑战</text>
          </view>
        </view>
      </view>
      
      <!-- 分享按钮 -->
      <view class="flex justify-center gap-6">
        <view class="wechat-btn flex flex-col items-center" @click="shareToWechat">
          <view class="wechat-icon mb-1">
            <image src="@/static/images/wechat.png" mode="aspectFit" class="w-48 h-48"></image>
          </view>
          <text class="text-xs text-gray-600">微信好友</text>
        </view>
        <view class="moments-btn flex flex-col items-center" @click="shareToMoments">
          <view class="moments-icon mb-1">
            <image src="@/static/images/moment.png" mode="aspectFit" class="w-48 h-48"></image>
          </view>
          <text class="text-xs text-gray-600">朋友圈</text>
        </view>
      </view>
    </view>

    <!-- 记录详情弹窗 -->
    <wd-popup v-model="showDetail" round position="bottom" :style="{ height: '30%' }">
      <view class="p-5" v-if="selectedRecord">
        <view class="flex justify-between items-center mb-4">
          <text class="text-lg font-bold">{{formatDateDisplay(selectedRecord.date)}}</text>
          <wd-icon name="close" @click="showDetail = false"></wd-icon>
        </view>
        <view>
          <view class="flex items-center mb-3">
            <view class="w-8 h-8 rounded-full mr-3" :class="[
              selectedRecord.intensity === 'easy' ? 'bg-green-500' : '',
              selectedRecord.intensity === 'medium' ? 'bg-yellow-400' : '',
              selectedRecord.intensity === 'hard' ? 'bg-red-500' : '',
            ]"></view>
            <text class="font-bold">{{getIntensityLabel(selectedRecord.intensity)}}</text>
          </view>
          <view class="flex justify-between mb-2">
            <text class="text-gray-500">训练时长</text>
            <text class="font-bold">{{selectedRecord.duration}} 分钟</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-500">消耗卡路里</text>
            <text class="font-bold text-green-600">{{selectedRecord.calorie}} 卡</text>
          </view>
        </view>
      </view>
    </wd-popup>

    <MilestoneMask v-model:show="showMilestone" :percentage="percentage" />
  </view>
  </app-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import AppLayout from "@/components/AppLayout.vue";
import MilestoneMask from "@/components/MilestoneMask.vue";
import AICoachCard from "@/components/AICoachCard.vue";
import { 
  getAllRecords, 
  getTodayString, 
  getRecordByDate, 
  getCurrentMonthStats, 
  getMonthlyTarget,
  getTodayAdvice,
  saveMonthlyAdvice
} from "@/utils/storage";
import type { ClockInRecord, CoachAdvice } from "@/utils/storage";

// 用户基础信息
const nickname = ref('羽毛球爱好者');
const avatarUrl = ref('');

// AI教练与社交分享
const aiCoachMessage = ref('根据你最近的训练数据分析，你的正手击球力量有所提升，但反手技巧还需加强。建议今天侧重反手训练。')
const dailyTrainingRecommendations = ref(['反手高远球练习', '步法训练', '手腕力量', '网前技巧'])
const dietRecommendation = ref('训练前: 香蕉或能量棒提供快速能量；训练后: 蛋白质饮料帮助肌肉恢复，搭配全谷物碳水。')
// 分享信息
const shareInfo = ref<any>({
  title: '',
  path: '',
  summary: '',
  imageUrl: ''
});

// 社交分享方法
function shareToWechat() {
  // 微信小程序分享API
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline'],
    success: function() {
      uni.showToast({
        title: '请点击右上角分享',
        icon: 'none'
      });
    }
  });
  
  // 定义分享内容
  shareInfo.value = {
    title: '我的羽毛球训练成就',
    path: '/pages/index/index',
    summary: `本月已训练${stats.value.totalDays}天，目标完成率${percentage.value}%`,
    imageUrl: '@/static/images/wechat.png'
  };
}

function shareToMoments() {
  // 分享到朋友圈
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareTimeline'],
    success: function() {
      uni.showToast({
        title: '请点击右上角分享到朋友圈',
        icon: 'none'
      });
    }
  });
  
  // 定义朋友圈分享内容
  shareInfo.value = {
    title: `我已坚持羽毛球训练${stats.value.totalDays}天，本月目标完成率${percentage.value}%，一起来打卡吧！`,
    path: '/pages/index/index',
    imageUrl: '@/static/images/moment.png'
  };
}

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

// 计算累计训练时长（小时）
const totalTrainingHours = computed(() => {
  const totalMinutes = allRecords.value.reduce((total, record) => total + record.duration, 0);
  return (totalMinutes / 60).toFixed(1);
});

// 记录详情弹窗
const showDetail = ref(false);
const selectedRecord = ref<ClockInRecord | null>(null);

function showRecordDetail(record: ClockInRecord) {
  selectedRecord.value = record;
  showDetail.value = true;
}

// 加载数据
onMounted(() => {
  loadData();
  
  // 生成一个月的AI教练建议（仅在首次加载时生成）
  try {
    const adviceExists = uni.getStorageSync('badminton_coach_advice');
    if (!adviceExists) {
      saveMonthlyAdvice();
    }
  } catch (e) {
    console.error('初始化AI教练建议失败:', e);
    saveMonthlyAdvice();
  }
  
  // 设置页面分享处理函数
  // @ts-ignore
  uni.$scope && (uni.$scope.onShareAppMessage = function() {
    return {
      title: shareInfo.value.title,
      path: shareInfo.value.path,
      imageUrl: shareInfo.value.imageUrl
    };
  });
  
  // 设置朋友圈分享处理函数
  // @ts-ignore
  uni.$scope && (uni.$scope.onShareTimeline = function() {
    return {
      title: shareInfo.value.title,
      query: `from=timeline`,
      imageUrl: shareInfo.value.imageUrl
    };
  });
});

// 页面显示时重新加载数据
onShow(() => {
  loadData();
});

function loadData() {
  // 加载本地存储的用户信息
  loadUserProfile();

  // 加载今日打卡记录
  todayRecord.value = getRecordByDate(getTodayString());
  
  // 加载所有记录
  allRecords.value = getAllRecords();
  
  // 加载本月统计
  stats.value = getCurrentMonthStats();
  
  // 加载每月目标天数
  monthlyTarget.value = getMonthlyTarget();
  
  // 加载今日AI教练建议
  loadTodayAdvice();
}

// 加载今日AI教练建议
function loadTodayAdvice() {
  try {
    const advice = getTodayAdvice();
    
    // 更新AI教练建议内容
    aiCoachMessage.value = advice.message;
    dailyTrainingRecommendations.value = advice.trainingTips;
    dietRecommendation.value = advice.dietTip;
  } catch (e) {
    console.error('加载AI教练建议失败:', e);
    // 保留默认值
  }
}

function loadUserProfile() {
  try {
    const storedNickname = uni.getStorageSync('user_nickname');
    if (storedNickname) {
      nickname.value = storedNickname;
    }
    const storedAvatarUrl = uni.getStorageSync('user_avatar');
    if (storedAvatarUrl) {
      avatarUrl.value = storedAvatarUrl;
    }
  } catch (e) {
    console.error('读取用户信息失败:', e);
  }
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
  return `${year}年${month}月${day}日`;
}

function formatDateDay(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  return `${day}日`;
}

function formatDateMonth(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
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
  background: linear-gradient(90deg, #f44336, #ff9800, #ffeb3b, #4caf50);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  position: relative;
  overflow: hidden;
}

:deep(.wd-progress .wd-progress__outer) {
  height: 10px;
  border-radius: 5px;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-check {
  animation: check-bounce 0.5s ease-out;
}

@keyframes check-bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-wave {
  position: relative;
  overflow: hidden;
}

.animate-wave::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  animation: wave 3s linear infinite;
  z-index: 0;
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-number {
  animation: number-grow 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
}

@keyframes number-grow {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}

.today-training {
  background: linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6);
  position: relative;
  overflow: hidden;
}

.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.calorie-pulse {
  animation: calorie-pulse 1.5s ease-in-out infinite;
}

@keyframes calorie-pulse {
  0% {
    text-shadow: 0 0 5px rgba(52, 211, 153, 0.5);
  }
  50% {
    text-shadow: 0 0 12px rgba(52, 211, 153, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(52, 211, 153, 0.5);
  }
}

.intensity-tag {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.intensity-tag.easy {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.intensity-tag.medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.intensity-tag.hard {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.record-item {
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}

.record-item:active {
  transform: scale(0.98);
}

.record-item::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
  transform: scale(0);
  transform-origin: center;
  animation: ripple 0.6s ease-out;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

.record-item:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.action-button {
  position: relative;
  background: linear-gradient(90deg, #10b981, #f59e0b);
  overflow: hidden;
  border-radius: 12px;
  z-index: 1;
}

.action-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  transform: translateX(-100%);
  animation: button-shimmer 3s infinite;
  z-index: -1;
}

@keyframes button-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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

/* 里程碑弹出效果 */
.milestone-popup {
  animation: milestone-popup 0.5s ease-in-out;
}

@keyframes milestone-popup {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 分享卡片动画 */
.share-card {
  transition: all 0.3s ease;
  transform: perspective(1000px) rotateY(0deg);
}

.share-card:hover, .share-card:active {
  transform: perspective(1000px) rotateY(5deg) translateY(-5px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
}
</style>
