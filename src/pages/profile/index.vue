<template>
  <app-layout>
    <view class="min-h-screen bg-[#f6fbff] box-border overflow-hidden pb-5">

    <!-- 顶部渐变背景改为动态渐变 -->
    <view class="w-full gradient-animation pt-12 pb-16 px-4">
      <view class="flex items-center">
        <text class="i-mdi:account-circle text-2xl text-white mr-2" />
        <text class="text-xl text-white font-bold">个人信息</text>
      </view>
    </view>

    <!-- 个人信息卡片 -->
    <view class="mx-4 -mt-12 bg-white rounded-xl shadow-lg p-5 flex items-center relative">
      <view class="relative">
        <view class="w-120 h-120 rounded-full pulse-glow flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg mb-2 overflow-hidden">
          <image v-if="avatarUrl" :src="avatarUrl" mode="aspectFill" class="w-full h-full"></image>
          <text v-else-if="!editMode">{{ nickname.charAt(0) }}</text>
          <text v-else class="i-mdi:camera text-3xl"></text>
          <!-- 编辑图标 -->
          <view v-if="editMode" class="absolute bottom-45 right-24 w-fit h-fit rounded-full flex items-center justify-center" @click="onUploadAvatar">
            <!-- <text class="i-mdi:pencil text-xs text-white"></text> -->
            <wd-icon name="cloud-upload" size="40px" :color="avatarUrl ? 'rgba(255,255,255,0.6)' : '#fff'" class="upload-icon"></wd-icon>
          </view>
        </view>
      </view>
      <view class="flex flex-col ml-5">
        <view class="flex flex-col mb-2 items-start">
          <template v-if="!editMode">
            <text class="text-xl font-bold text-gray-900">{{ nickname }}</text>
          </template>
          <template v-else>
            <input v-model="editNickname" class="border-b-2 border-blue-400 outline-none text-xl font-bold text-gray-900 bg-transparent px-1 text-left" maxlength="12" />
          </template>
        </view>
        <view class="flex items-center mb-2">
          <text class="i-mdi:calendar-check text-green-500 mr-1" />
          <text class="text-xs text-gray-500">加入时间: 2025/7/8</text>
        </view>
        <view class="px-3 py-1 dynamic-badge rounded-full w-fit">
          <text class="text-xs text-green-600 font-medium">活跃用户</text>
        </view>
        
        <!-- 编辑按钮 -->
        <view v-if="!editMode" class="absolute top-[18%] right-[5%]" @click="onEdit">
          <!-- <text class="i-mdi:pencil text-xl text-gray-400"></text> -->
          <wd-icon name="edit" size="22px" color="green"></wd-icon>
        </view>
        <!-- 保存/取消按钮 -->
        <view v-if="editMode" class="absolute top-75% right-[5%] flex space-x-4">
          <wd-icon name="check" size="22px" color="green" @click="onSave"></wd-icon>
          <wd-icon name="close" size="22px" color="red" @click="onCancel"></wd-icon>
        </view>
      </view>
    </view>

    <!-- 修改本月训练目标卡片：增强动态进度条、添加分段激励和倒计时提醒 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg p-5 mt-4">
      <view class="flex items-center justify-between">
        <view class="flex items-center">
          <text class="i-mdi:target text-xl text-blue-500 mr-2" />
          <text class="text-base font-bold">{{ goalPeriodType === 'month' ? '本月' : '本周' }}训练目标</text>
        </view>
        <view class="flex items-center">
          <view class="mr-2" @click="showPeriodSelector = true">
            <text class="px-2 py-1 rounded-full bg-gray-50 text-xs text-gray-600">{{ goalPeriodType === 'month' ? '月' : '周' }}</text>
          </view>
          <wd-icon name="edit" size="22px" color="green" @click="editGoal = true" v-if="!editGoal"></wd-icon>
        </view>
      </view>
      
      <view v-if="!editGoal">
        <view class="flex justify-between items-center mt-3">
          <text class="text-sm text-gray-600">进度</text>
          <view class="flex items-center">
            <text class="text-2xl font-bold" :class="progressTextColor">{{ stats.totalDays }}</text>
            <text class="text-sm text-gray-700 ml-1">天</text>
            <text class="i-mdi:calendar-month text-sm text-blue-500 ml-2"></text>
            <text class="text-xs text-gray-500 ml-1">/ {{ monthlyGoal }} 天</text>
          </view>
        </view>
        
        <!-- 进度条 -->
        <view class="w-full h-30 rainbow-progress-bg rounded-full overflow-hidden my-3 relative">
          <view class="h-30 rainbow-progress-fill rounded-full shimmer-effect" :style="`width: ${goalProgress}%`"></view>
          
          <!-- 进度分段标记 -->
          <view v-if="showProgressMilestone" class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <view class="bg-white px-3 py-1 rounded-full shadow-lg milestone-popup">
              <text class="text-sm font-bold" :class="progressTextColor">{{ milestoneCongrats }}</text>
            </view>
          </view>
        </view>
        
        <!-- 进度展示与倒计时 -->
        <view class="flex justify-between items-center">
          <text class="text-sm text-gray-600">目标完成</text>
          <text class="text-sm font-bold" :class="progressTextColor">{{ motivationalMessage }}</text>
        </view>
        
        <!-- 倒计时提醒 -->
        <view class="flex justify-center mt-3">
          <text class="text-xs" :class="countdownTextColor">距离目标结束还有 {{ daysRemainingInPeriod }} 天</text>
        </view>
      </view>
      
      <view v-else class="mt-3">
        <!-- 目标编辑区域 -->
        <view class="flex items-center mb-3">
          <text class="text-sm text-gray-600 w-1/4">周期选择：</text>
          <view class="flex flex-1">
            <wd-radio-group v-model="goalPeriodType" inline shape="dot">
              <wd-radio value="week" class="flex-1 mr-2">按周</wd-radio>
              <wd-radio value="month" class="flex-1">按月</wd-radio>
            </wd-radio-group>
          </view>
        </view>
        
        <view class="flex items-center mb-3">
          <text class="text-sm text-gray-600 w-1/4">目标天数：</text>
          <input v-model="editMonthlyGoal" type="number" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </view>
        
        <!-- 智能推荐 -->
        <view class="bg-blue-50 rounded-lg p-3 mb-3">
          <view class="flex items-start">
            <text class="i-mdi:lightbulb text-yellow-500 mr-2 text-lg"></text>
            <text class="text-xs text-gray-700">根据你的历史数据，建议本{{ goalPeriodType === 'month' ? '月' : '周' }}目标设为 <text class="text-blue-500 font-bold">{{ recommendedGoal }}</text> 天</text>
          </view>
        </view>
        
        <view class="flex gap-3">
          <button @click="saveGoal" class="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm">保存</button>
          <button @click="cancelEditGoal" class="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">取消</button>
        </view>
      </view>
    </view>

    <!-- 累计统计卡片 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg mt-4 p-4 grid grid-cols-2 gap-3">
      <view class="flex flex-col items-center justify-center py-3 relative" @click="toggleRecordDetail('checkin')">
        <view class="circle-progress-container">
          <view class="circle-progress" :style="`--percent: ${circleProgressPercent}%`"></view>
          <view class="circle-content flex flex-col items-center justify-center">
            <text class="text-4xl font-bold text-blue-500 number-animation">{{ allRecords.length }}</text>
            <text class="text-xs text-gray-500">/ {{ monthlyGoal }}</text>
          </view>
        </view>
        <text class="text-sm text-gray-500 mt-3">累计打卡</text>
        <view class="absolute right-0 top-0 text-xs text-blue-500">
          <text class="i-mdi:chevron-down" v-if="!showCheckinDetail"></text>
          <text class="i-mdi:chevron-up" v-if="showCheckinDetail"></text>
        </view>
      </view>
      <view class="flex flex-col items-center justify-center py-3 relative" @click="toggleRecordDetail('duration')">
        <view class="bar-chart-container">
          <view class="bar-chart" :style="`--height: ${barChartHeight}%`"></view>
          <text class="text-4xl font-bold text-green-500 number-animation">{{ totalTrainingHours }}h</text>
        </view>
        <text class="text-sm text-gray-500 mt-3">训练时长</text>
        <view class="absolute right-0 top-0 text-xs text-blue-500">
          <text class="i-mdi:chevron-down" v-if="!showDurationDetail"></text>
          <text class="i-mdi:chevron-up" v-if="showDurationDetail"></text>
        </view>
      </view>
      
      <!-- 打卡详细记录 -->
      <view v-if="showCheckinDetail" class="col-span-2 bg-gray-50 p-3 rounded-lg mt-2 max-h-60 overflow-auto">
        <view class="text-sm font-bold mb-2">最近打卡记录</view>
        <view v-for="(record, idx) in recentRecords" :key="idx" class="flex justify-between items-center py-2 border-b border-gray-100">
          <view class="flex items-center">
            <text class="i-mdi:calendar-check text-green-500 mr-2"></text>
            <text class="text-xs">{{ formatDate(record.date) }}</text>
          </view>
          <view class="flex items-center">
            <text class="text-xs text-gray-500">{{ record.duration }}分钟</text>
            <view class="ml-2 px-2 py-1 rounded-full text-xs" :class="getIntensityClass(record.intensity)">
              {{ getIntensityText(record.intensity) }}
            </view>
          </view>
        </view>
        <view v-if="recentRecords.length === 0" class="text-center py-4 text-gray-400">
          暂无打卡记录
        </view>
      </view>
      
      <!-- 时长详细记录 -->
      <view v-if="showDurationDetail" class="col-span-2 bg-gray-50 p-3 rounded-lg mt-2 max-h-60 overflow-auto">
        <view class="text-sm font-bold mb-2">训练时长统计</view>
        <view class="flex justify-around items-center py-3">
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-blue-500">{{ formatDecimal(stats.easyDuration / 60) }}h</text>
            <text class="text-xs text-gray-500">轻松训练</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-yellow-500">{{ formatDecimal(stats.mediumDuration / 60) }}h</text>
            <text class="text-xs text-gray-500">中等训练</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-lg font-bold text-red-500">{{ formatDecimal(stats.hardDuration / 60) }}h</text>
            <text class="text-xs text-gray-500">高强训练</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 成就徽章模块 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg mt-4 p-5 achievement-container">
      <view class="flex items-center justify-between mb-4">
        <view class="flex items-center">
          <text class="i-mdi:medal text-xl text-yellow-500 mr-2" />
          <text class="text-lg font-bold">成就徽章</text>
        </view>
        <view class="px-2 py-1 bg-yellow-100 rounded-full relative achievement-progress-ring">
          <view class="achievement-progress" :style="`--percent: ${achievementPercent}%`"></view>
          <text class="text-xs text-yellow-700 relative z-10">{{ unlocked }}/{{ achievements.length }}</text>
        </view>
      </view>
      <view class="grid grid-cols-2 gap-4 mb-4">
        <view v-for="(item, idx) in achievements" :key="item.title" :class="[
          'rounded-lg p-4 flex flex-col justify-center items-center min-h-[120px] shadow-sm transition-all',
          item.unlocked
            ? 'bg-yellow-50 border-l-4 border-yellow-400 unlocked-achievement'
            : 'bg-gray-50 border-l-4 border-gray-200',
        ]">
          <view class="flex items-center mb-2 flex-col">
            <text :class="[
              'text-2xl',
              item.unlocked ? 'animate-bounce' : '',
              item.iconColor,
            ]">{{ item.icon }}</text>
            <text class="font-bold text-sm text-center">{{ item.title }}</text>
          </view>
          <text class="text-xs text-gray-500 my-2 text-center">{{ item.desc }}</text>
          <template v-if="item.unlocked">
            <text class="text-xs text-yellow-600 font-bold achievement-unlock">✨已解锁</text>
          </template>
          <template v-else>
            <wd-progress :percentage="Math.round((item.progress / item.goal) * 100)" stroke-width="8" color="#3b82f6"
              track-color="#f3f4f6" :show-text="false" hide-text class="w-full mb-1" />
            <text class="text-xs text-gray-500 font-medium">{{
              item.progressLabel
            }}</text>
            <text class="text-xs text-blue-500 mt-1">{{ getAchievementTip(item) }}</text>
          </template>
        </view>
      </view>
      <!-- 成就完成度 -->
      <view class="bg-yellow-50 rounded-lg p-4 mt-2 flex items-center">
        <text class="font-medium text-yellow-700 mr-3 text-sm w-2/7">完成度</text>
        <wd-progress :percentage="achievementPercent" stroke-width="8" color="#3b82f6" track-color="#f3f4f6"
          :show-text="false" class="flex-1" hide-text custom-class="progress" />
        <text class="text-lg font-bold text-yellow-600 ml-4 number-animation">{{ achievementPercent }}%</text>
      </view>
    </view>

    <!-- 用户反馈入口 -->
    <!-- <view class="mx-4 bg-white rounded-xl shadow-lg mt-4 p-5">
      <view class="flex justify-between">
        <view class="flex items-center" @click="showFeedback = true">
          <text class="i-mdi:message-text-outline text-orange-500 mr-2"></text>
          <text class="text-base">建议与反馈</text>
        </view>
        <text class="i-mdi:chevron-right text-gray-400"></text>
      </view>
    </view> -->

        <!-- 底部操作栏移除 -->
      </view>
    </app-layout>
    <wd-toast />
  </template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useToast } from "wot-design-uni";
import AppLayout from "@/components/AppLayout.vue";
import { 
  getAllRecords, 
  getCurrentMonthStats, 
  getMonthlyTarget,
  setMonthlyTarget
} from "@/utils/storage";
import type { ClockInRecord, TrainingStats } from "@/utils/storage";

const nickname = ref('羽毛球爱好者')
const editMode = ref(false)
const editNickname = ref('羽毛球爱好者')
const monthlyGoal = ref(20)
const editMonthlyGoal = ref('20')
const editGoal = ref(false)
const toast = useToast();

function onStartTrain() {
  uni.navigateTo({
    url: '/pages/clockIn/index'
  })
}

// 训练统计数据
const stats = ref<TrainingStats>({
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
const allRecords = ref<ClockInRecord[]>([]);

// 新增变量
const showCheckinDetail = ref(false)
const showDurationDetail = ref(false)
const recentRecords = ref<ClockInRecord[]>([])

// 格式化方法 - 解决toFixed错误
function formatDecimal(value: number, places: number = 1): string {
  return (Math.round(value * Math.pow(10, places)) / Math.pow(10, places)).toFixed(places)
}

// 计算累计训练时长（小时）
const totalTrainingHours = computed(() => {
  const totalMinutes = allRecords.value.reduce((total, record) => total + record.duration, 0);
  return formatDecimal(totalMinutes / 60);
});

// 目标进度
const goalProgress = computed(() => {
  return Math.min(100, Math.round((stats.value.totalDays / monthlyGoal.value) * 100));
})

const circleProgressPercent = computed(() => Math.min(100, Math.round((allRecords.value.length / monthlyGoal.value) * 100)))
const barChartHeight = computed(() => Math.min(100, parseInt(totalTrainingHours.value) * 10))

// 动态文案和样式计算
const progressTextColor = computed(() => {
  if (goalProgress.value < 30) return 'text-red-500'
  if (goalProgress.value < 70) return 'text-yellow-500'
  return 'text-green-500'
})

const motivationalMessage = computed(() => {
  const remaining = monthlyGoal.value - stats.value.totalDays
  if (remaining <= 0) return '目标已完成！'
  if (goalProgress.value < 30) return `再坚持 ${remaining} 天！`
  if (goalProgress.value < 70) return `继续努力，还差 ${remaining} 天`
  return `即将完成，还差 ${remaining} 天！`
})

// 新增变量 - 目标周期管理
const goalPeriodType = ref<'week' | 'month'>('month')
const showPeriodSelector = ref(false)
const recommendedGoal = computed(() => {
  // 根据历史记录智能推荐目标天数
  if (goalPeriodType.value === 'week') {
    return Math.min(7, Math.max(1, Math.ceil(stats.value.totalDays / 4)))
  } else {
    return Math.min(30, Math.max(4, stats.value.totalDays + 2))
  }
})

// 进度条分段提示
const showProgressMilestone = ref(false)
const milestoneCongrats = computed(() => {
  if (goalProgress.value >= 75) return '即将完成目标！'
  if (goalProgress.value >= 50) return '已完成一半目标！'
  if (goalProgress.value >= 25) return '完成1/4目标！'
  return ''
})

// 监听进度变化，触发里程碑提示
watch(goalProgress, (newVal, oldVal) => {
  // 当进度跨越25%、50%、75%时显示提示
  if ((oldVal < 25 && newVal >= 25) || 
      (oldVal < 50 && newVal >= 50) || 
      (oldVal < 75 && newVal >= 75)) {
    showProgressMilestone.value = true
    setTimeout(() => {
      showProgressMilestone.value = false
    }, 3000)
  }
})

// 倒计时文本颜色
const daysRemainingInPeriod = computed(() => {
  const now = new Date()
  if (goalPeriodType.value === 'week') {
    // 计算本周剩余天数
    const dayOfWeek = now.getDay() || 7 // 周日为0，转换为7
    return 7 - dayOfWeek + 1
  } else {
    // 计算本月剩余天数
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    return lastDay - now.getDate() + 1
  }
})

const countdownTextColor = computed(() => {
  if (daysRemainingInPeriod.value <= 3) return 'text-red-500'
  if (daysRemainingInPeriod.value <= 7) return 'text-orange-500'
  return 'text-gray-400'
})

// 中断记录已移至首页

// 成就徽章静态数据
const achievements = ref([
  {
    title: "连续打卡7天",
    desc: "当前连续 0 天",
    icon: "🔥",
    iconColor: "text-gray-400",
    progress: 0,
    goal: 7,
    progressLabel: "0/7",
    unlocked: false,
  },
  {
    title: "单月训练20小时",
    desc: "本月已训练 0 小时",
    icon: "⏰",
    iconColor: "text-gray-400",
    progress: 0,
    goal: 1200, // 60分钟*20小时
    progressLabel: "0/1200",
    unlocked: false,
  },
  {
    title: "高强度训练10次",
    desc: "已完成 0 次",
    icon: "💪",
    iconColor: "text-gray-400",
    progress: 0,
    goal: 10,
    progressLabel: "0/10",
    unlocked: false,
  },
  {
    title: "完美一周",
    desc: "最长连续 0 天！",
    icon: "⭐",
    iconColor: "text-gray-400",
    progress: 0,
    goal: 7,
    progressLabel: "0/7",
    unlocked: false,
  },
  {
    title: "训练达人",
    desc: "累计训练 0 天",
    icon: "🏆",
    iconColor: "text-gray-400",
    progress: 0,
    goal: 30,
    progressLabel: "0/30",
    unlocked: false,
  },
  {
    title: "时间管理大师",
    desc: "累计训练 0 小时",
    icon: "⌚",
    iconColor: "text-gray-400",
    progress: 0,
    goal: 3000, // 50小时*60分钟
    progressLabel: "0/3000",
    unlocked: false,
  },
]);

const unlocked = computed(
  () => achievements.value.filter((a) => a.unlocked).length
);

const achievementPercent = computed(() =>
  Math.round((unlocked.value / achievements.value.length) * 100)
);

// 加载数据
onMounted(() => {
  loadData();
  // 加载本地存储的用户信息
  loadUserProfile();
});

// 页面显示时重新加载数据
onShow(() => {
  loadData();
});

function loadData() {
  // 加载所有记录
  allRecords.value = getAllRecords();
  
  // 加载本月统计
  stats.value = getCurrentMonthStats();
  
  // 加载每月目标天数
  monthlyGoal.value = getMonthlyTarget();
  editMonthlyGoal.value = String(monthlyGoal.value);
  
  // 更新成就数据
  updateAchievements();
  
  // 加载最近打卡记录
  recentRecords.value = [...allRecords.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
}

// 更新成就徽章数据
function updateAchievements() {
  // 1. 连续打卡7天
  achievements.value[0].progress = stats.value.streak;
  achievements.value[0].progressLabel = `${stats.value.streak}/7`;
  achievements.value[0].unlocked = stats.value.streak >= 7;
  achievements.value[0].desc = `当前连续 ${stats.value.streak} 天`;
  achievements.value[0].iconColor = achievements.value[0].unlocked ? 'text-yellow-500' : 'text-gray-400';
  
  // 2. 单月训练20小时
  const monthlyMinutes = stats.value.totalDuration;
  const monthlyHours = formatDecimal(monthlyMinutes / 60);
  achievements.value[1].progress = monthlyMinutes;
  achievements.value[1].progressLabel = `${monthlyMinutes}/1200`;
  achievements.value[1].unlocked = monthlyMinutes >= 1200;
  achievements.value[1].desc = `本月已训练 ${monthlyHours} 小时`;
  achievements.value[1].iconColor = achievements.value[1].unlocked ? 'text-yellow-500' : 'text-gray-400';
  
  // 3. 高强度训练10次
  achievements.value[2].progress = stats.value.hardDays;
  achievements.value[2].progressLabel = `${stats.value.hardDays}/10`;
  achievements.value[2].unlocked = stats.value.hardDays >= 10;
  achievements.value[2].desc = `已完成 ${stats.value.hardDays} 次`;
  achievements.value[2].iconColor = achievements.value[2].unlocked ? 'text-yellow-500' : 'text-gray-400';
  
  // 4. 完美一周
  achievements.value[3].progress = stats.value.maxStreak;
  achievements.value[3].progressLabel = `${stats.value.maxStreak}/7`;
  achievements.value[3].unlocked = stats.value.maxStreak >= 7;
  achievements.value[3].desc = `最长连续 ${stats.value.maxStreak} 天！`;
  achievements.value[3].iconColor = achievements.value[3].unlocked ? 'text-yellow-500' : 'text-gray-400';
  
  // 5. 训练达人
  achievements.value[4].progress = allRecords.value.length;
  achievements.value[4].progressLabel = `${allRecords.value.length}/30`;
  achievements.value[4].unlocked = allRecords.value.length >= 30;
  achievements.value[4].desc = `累计训练 ${allRecords.value.length} 天`;
  achievements.value[4].iconColor = achievements.value[4].unlocked ? 'text-yellow-500' : 'text-gray-400';
  
  // 6. 时间管理大师
  const totalMinutes = allRecords.value.reduce((total, record) => total + record.duration, 0);
  const totalHours = formatDecimal(totalMinutes / 60);
  achievements.value[5].progress = totalMinutes;
  achievements.value[5].progressLabel = `${totalMinutes}/3000`;
  achievements.value[5].unlocked = totalMinutes >= 3000;
  achievements.value[5].desc = `累计训练 ${totalHours} 小时`;
  achievements.value[5].iconColor = achievements.value[5].unlocked ? 'text-yellow-500' : 'text-gray-400';
}

// 新增方法
function toggleRecordDetail(type: 'checkin' | 'duration') {
  if (type === 'checkin') {
    showCheckinDetail.value = !showCheckinDetail.value;
    if (showDurationDetail.value) showDurationDetail.value = false;
  } else {
    showDurationDetail.value = !showDurationDetail.value;
    if (showCheckinDetail.value) showCheckinDetail.value = false;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getIntensityClass(intensity: string): string {
  switch (intensity) {
    case 'easy': return 'bg-blue-100 text-blue-600';
    case 'medium': return 'bg-yellow-100 text-yellow-600';
    case 'hard': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getIntensityText(intensity: string): string {
  switch (intensity) {
    case 'easy': return '轻松';
    case 'medium': return '适中';
    case 'hard': return '强烈';
    default: return '未知';
  }
}

// 这些中断记录相关功能已移至首页

function getAchievementTip(item: any): string {
  const remaining = item.goal - item.progress;
  if (remaining <= 0) return '';
  
  switch (item.title) {
    case '连续打卡7天':
      return `再连续打卡 ${remaining} 天解锁`;
    case '单月训练20小时':
      return `还需训练 ${formatDecimal(remaining / 60)} 小时`;
    case '高强度训练10次':
      return `还需 ${remaining} 次高强度训练`;
    case '完美一周':
      return `连续打卡满 ${remaining} 天解锁`;
    case '训练达人':
      return `还差 ${remaining} 天`;
    case '时间管理大师':
      return `还需累计 ${formatDecimal(remaining / 60)} 小时`;
    default:
      return '';
  }
}

function onEdit() {
  editNickname.value = nickname.value
  editMode.value = true
}

function onSave() {
  nickname.value = editNickname.value.trim() || '羽毛球爱好者'
  editMode.value = false
  // 保存用户信息到本地
  saveUserProfile()
  toast.success('个人信息已保存')
  
}

function onCancel() {
  // 取消编辑，恢复原值
  editNickname.value = nickname.value
  editMode.value = false
}

function saveGoal() {
  const goal = parseInt(editMonthlyGoal.value);
  if (goal > 0 && goal <= (goalPeriodType.value === 'week' ? 7 : 31)) {
    monthlyGoal.value = goal;
    setMonthlyTarget(goal);
    editGoal.value = false;
  } else {
    toast.error(goalPeriodType.value === 'week' 
        ? '请输入1-7的有效天数' 
        : '请输入1-31的有效天数');
  }
}

function cancelEditGoal() {
  editMonthlyGoal.value = String(monthlyGoal.value);
  editGoal.value = false;
}

// 头像相关
const avatarUrl = ref('')

// 从本地存储加载个人信息
function loadUserProfile() {
  try {
    // 读取昵称
    const storedNickname = uni.getStorageSync('user_nickname')
    if (storedNickname) {
      nickname.value = storedNickname
      editNickname.value = storedNickname
    }
    
    // 读取头像URL
    const storedAvatarUrl = uni.getStorageSync('user_avatar')
    if (storedAvatarUrl) {
      avatarUrl.value = storedAvatarUrl
    }
  } catch (e) {
    console.error('读取用户信息失败:', e)
  }
}

// 保存个人信息到本地存储
function saveUserProfile() {
  try {
    // 保存昵称
    uni.setStorageSync('user_nickname', nickname.value)
    
    // 保存头像URL
    if (avatarUrl.value) {
      uni.setStorageSync('user_avatar', avatarUrl.value)
    }
  } catch (e) {
    console.error('保存用户信息失败:', e)
  }
}

function onUploadAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 获取选择的图片临时路径
      const tempFilePath = res.tempFilePaths[0]
      
      // 更新头像
      avatarUrl.value = tempFilePath
      
      // 保存到本地存储
      try {
        uni.setStorageSync('user_avatar', tempFilePath)
      } catch (e) {
        console.error('保存头像失败:', e)
      }
      
      // 预览图片
      // uni.previewImage({
      //   urls: [tempFilePath],
      //   current: tempFilePath
      // })
      
      toast.success('头像已更新')
    },
    fail: () => {
      toast.error('取消选择')
    }
  })
}
</script>
<style scoped lang="scss">
:deep(.progress .wd-progress__outer) {
  height: 8px !important;
  border-radius: 4px !important;
}

:deep(.progress .wd-progress__inner) {
  height: 8px !important;
  border-radius: 4px !important;
}

/* 动态渐变背景 */
.gradient-animation {
  background: linear-gradient(-45deg, #4f46e5, #38bdf8, #22c55e, #10b981);
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 头像发光效果 */
.pulse-glow {
  background: linear-gradient(135deg, #4ade80, #3b82f6);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
  }
  50% {
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
  }
}

/* 上传图标样式 */
:deep(.upload-icon) {
  backdrop-filter: blur(3px);
  transition: opacity 0.3s ease;
}

/* 当有头像时上传图标的样式 */
:deep(.upload-icon) {
  opacity: 0.7;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

:deep(.upload-icon):hover {
  opacity: 1;
}

/* 活跃用户标签动画 */
.dynamic-badge {
  background: linear-gradient(to right, #dcfce7, #d1fae5);
  animation: badge-pulse 3s infinite;
}

@keyframes badge-pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

/* 彩虹进度条 */
.rainbow-progress-bg {
  background: #f1f5f9;
}

.rainbow-progress-fill {
  background: linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e);
  background-size: 300% 100%;
  animation: rainbow-move 3s linear infinite;
}

.shimmer-effect {
  position: relative;
  overflow: hidden;
}

.shimmer-effect::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes rainbow-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 环形进度条 */
.circle-progress-container {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f1f5f9;
}

.circle-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 0% var(--percent), transparent var(--percent) 100%);
  mask: radial-gradient(transparent 55%, black 55%);
  -webkit-mask: radial-gradient(transparent 55%, black 55%);
}

.circle-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 柱状图 */
.bar-chart-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-chart {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: var(--height);
  max-height: 100%;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(to top, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.8));
  z-index: -1;
}

/* 成就徽章样式 */
.achievement-container {
  position: relative;
}

.achievement-progress-ring {
  position: relative;
  overflow: hidden;
}

.achievement-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--percent);
  background-color: rgba(253, 224, 71, 0.6);
  z-index: 1;
}

.unlocked-achievement {
  animation: achievement-glow 2s infinite alternate;
}

.achievement-unlock {
  position: relative;
  animation: bounce 0.5s ease infinite alternate;
}

@keyframes achievement-glow {
  0% {
    box-shadow: 0 0 5px rgba(253, 224, 71, 0.3);
  }
  100% {
    box-shadow: 0 0 15px rgba(253, 224, 71, 0.6);
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-3px);
  }
}

/* 数字动画效果 */
.number-animation {
  position: relative;
  display: inline-block;
  transition: all 0.5s ease;
}

.number-animation.update {
  animation: number-update 0.5s ease;
}

@keyframes number-update {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 羽毛球入场动画 */
.shuttlecock-enter {
  animation: shuttlecock-enter 1.5s ease-out forwards;
}

@keyframes shuttlecock-enter {
  0% {
    transform: translateY(-100%) rotate(45deg);
    opacity: 0;
  }
  60% {
    transform: translateY(10%) rotate(-15deg);
    opacity: 1;
  }
  80% {
    transform: translateY(-5%) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0);
  }
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

/* AI教练消息动画 */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* 分享卡片动画 */
.share-card {
  transition: all 0.3s ease;
  transform: perspective(1000px) rotateY(0deg);
}

.share-card:hover {
  transform: perspective(1000px) rotateY(5deg) translateY(-5px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
}

/* 为移动设备优化样式 */
@media screen and (max-width: 375px) {
  .circle-progress-container,
  .bar-chart-container {
    width: 70px;
    height: 70px;
  }
}
</style>
