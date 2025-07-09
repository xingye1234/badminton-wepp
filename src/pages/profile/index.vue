<template>
  <view class="min-h-screen bg-[#f6fbff] pb-6 box-border overflow-hidden">

    <!-- 顶部渐变背景 -->
    <view class="w-full bg-gradient-to-r from-blue-500 to-green-400 pt-12 pb-16 px-4">
      <view class="flex items-center">
        <text class="i-mdi:account-circle text-2xl text-white mr-2" />
        <text class="text-xl text-white font-bold">个人信息</text>
      </view>
    </view>

    <!-- 个人信息卡片 -->
    <view class="mx-4 -mt-12 bg-white rounded-xl shadow-lg p-5 flex items-center relative">
      <view class="relative">
        <view class="w-120 h-120 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg mb-2">
          <text v-if="!editMode">{{ nickname.charAt(0) }}</text>
          <text v-else class="i-mdi:camera text-3xl"></text>
          <!-- 编辑图标 -->
          <view v-if="editMode" class="absolute bottom-45 right-24 w-fit h-fit rounded-full flex items-center justify-center" @click="onUploadAvatar">
            <!-- <text class="i-mdi:pencil text-xs text-white"></text> -->
            <wd-icon name="cloud-upload" size="40px" color="#fff"></wd-icon>
          </view>
        </view>
      </view>
      <view class="flex flex-col relative ml-5">
        <view class="flex flex-col items-center mb-2">
          <template v-if="!editMode">
            <text class="text-xl font-bold text-gray-900">{{ nickname }}</text>
          </template>
          <template v-else>
            <input v-model="editNickname" class="border-b-2 border-blue-400 outline-none text-xl font-bold text-gray-900 bg-transparent px-1 text-left" maxlength="12" />
          </template>
        </view>
        <view class="flex items-center mb-2">
          <text class="i-mdi:calendar text-gray-400 mr-1" />
          <text class="text-xs text-gray-500">加入时间: 2025/7/8</text>
        </view>
        <view class="px-3 py-1 bg-green-100 rounded-full w-fit">
          <text class="text-xs text-green-600 font-medium">活跃用户</text>
        </view>
        
        <!-- 编辑按钮 -->
        <view v-if="!editMode" class="absolute top-0 -right-[100%]" @click="onEdit">
          <!-- <text class="i-mdi:pencil text-xl text-gray-400"></text> -->
          <wd-icon name="edit" size="22px" color="green"></wd-icon>
        </view>
      </view>
    </view>

    <!-- 本月训练目标卡片 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg p-5 mt-4">
      <view class="flex items-center justify-between">
        <view class="flex items-center">
          <text class="i-mdi:target text-xl text-blue-500 mr-2" />
          <text class="text-base font-bold">本月训练目标</text>
        </view>
        <!-- <text class="i-mdi:pencil text-lg text-gray-400" @click="editGoal = true" v-if="!editGoal"></text> -->
        <wd-icon name="edit" size="22px" color="green" @click="editGoal = true" v-if="!editGoal"></wd-icon>
      </view>
      
      <view v-if="!editGoal">
        <view class="flex justify-between items-center mt-3">
          <text class="text-sm text-gray-600">进度</text>
          <text class="text-sm text-gray-700 font-bold">{{ stats.totalDays }} / {{ monthlyGoal }} 天</text>
        </view>
        <view class="w-full h-2 bg-gray-100 rounded-full overflow-hidden my-2">
          <view class="h-2 bg-blue-500 rounded-full" :style="`width: ${goalProgress}%`"></view>
        </view>
        <view class="flex justify-between items-center">
          <text class="text-sm text-gray-600">完成率</text>
          <text class="text-sm text-blue-500 font-bold">{{ goalProgress }}%</text>
        </view>
      </view>
      
      <view v-else class="mt-3">
        <view class="flex items-center mb-3">
          <text class="text-sm text-gray-600 w-1/4">目标天数：</text>
          <input v-model="editMonthlyGoal" type="number" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <!-- <wd-input type="number" v-model="editMonthlyGoal" placeholder="请输入" /> -->
        </view>
        <view class="flex gap-3">
          <button @click="saveGoal" class="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm">保存</button>
          <button @click="cancelEditGoal" class="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">取消</button>
        </view>
      </view>
    </view>

    <!-- 累计统计卡片 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg mt-4 p-4 grid grid-cols-2 gap-3">
      <view class="flex flex-col items-center justify-center py-3 border-r border-gray-100">
        <text class="text-4xl font-bold text-blue-500">{{ allRecords.length }}</text>
        <text class="text-sm text-gray-500 mt-1">累计打卡</text>
      </view>
      <view class="flex flex-col items-center justify-center py-3">
        <text class="text-4xl font-bold text-green-500">{{ totalTrainingHours }}h</text>
        <text class="text-sm text-gray-500 mt-1">训练时长</text>
      </view>
    </view>

    <!-- 成就徽章模块 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg mt-4 p-5">
      <view class="flex items-center justify-between mb-4">
        <view class="flex items-center">
          <text class="i-mdi:medal text-xl text-yellow-500 mr-2" />
          <text class="text-lg font-bold">成就徽章</text>
        </view>
        <view class="px-2 py-1 bg-yellow-100 rounded-full">
          <text class="text-xs text-yellow-700">{{ unlocked }}/{{ achievements.length }}</text>
        </view>
      </view>
      <view class="grid grid-cols-2 gap-4 mb-4">
        <view v-for="(item, idx) in achievements" :key="item.title" :class="[
          'rounded-lg p-4 flex flex-col justify-center items-center min-h-[120px] shadow-sm transition-all',
          item.unlocked
            ? 'bg-yellow-50 border-l-4 border-yellow-400'
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
            <text class="text-xs text-yellow-600 font-bold">✨已解锁</text>
          </template>
          <template v-else>
            <wd-progress :percentage="Math.round((item.progress / item.goal) * 100)" stroke-width="8" color="#3b82f6"
              track-color="#f3f4f6" :show-text="false" hide-text class="w-full mb-1" />
            <text class="text-xs text-gray-500 font-medium">{{
              item.progressLabel
            }}</text>
          </template>
        </view>
      </view>
      <!-- 成就完成度 -->
      <view class="bg-yellow-50 rounded-lg p-4 mt-2 flex items-center">
        <text class="font-medium text-yellow-700 mr-3 text-sm w-2/7">完成度</text>
        <wd-progress :percentage="achievementPercent" stroke-width="8" color="#3b82f6" track-color="#f3f4f6"
          :show-text="false" class="flex-1" hide-text custom-class="progress" />
        <text class="text-lg font-bold text-yellow-600 ml-4">{{ achievementPercent }}%</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="mx-4 mt-6 mb-8" v-if="editMode">
      <view class="flex gap-4">
        <button class="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl shadow-md" @click="onSave">保存</button>
        <button class="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl shadow-md" @click="onCancel">取消</button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { 
  getAllRecords, 
  getCurrentMonthStats, 
  getMonthlyTarget,
  setMonthlyTarget,
  ClockInRecord,
  TrainingStats
} from '@/utils/storage'

const nickname = ref('羽毛球爱好者')
const editMode = ref(false)
const editNickname = ref('羽毛球爱好者')
const monthlyGoal = ref(20)
const editMonthlyGoal = ref('20')
const editGoal = ref(false)

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

// 计算累计训练时长（小时）
const totalTrainingHours = computed(() => {
  const totalMinutes = allRecords.value.reduce((total, record) => total + record.duration, 0);
  return (totalMinutes / 60).toFixed(1);
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
  // 加载所有记录
  allRecords.value = getAllRecords();
  
  // 加载本月统计
  stats.value = getCurrentMonthStats();
  
  // 加载每月目标天数
  monthlyGoal.value = getMonthlyTarget();
  editMonthlyGoal.value = String(monthlyGoal.value);
  
  // 更新成就数据
  updateAchievements();
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
  const monthlyHours = (monthlyMinutes / 60).toFixed(1);
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
  const totalHours = (totalMinutes / 60).toFixed(1);
  achievements.value[5].progress = totalMinutes;
  achievements.value[5].progressLabel = `${totalMinutes}/3000`;
  achievements.value[5].unlocked = totalMinutes >= 3000;
  achievements.value[5].desc = `累计训练 ${totalHours} 小时`;
  achievements.value[5].iconColor = achievements.value[5].unlocked ? 'text-yellow-500' : 'text-gray-400';
}

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

const goalProgress = computed(() => {
  return Math.min(100, Math.round((stats.value.totalDays / monthlyGoal.value) * 100));
})

function onEdit() {
  editNickname.value = nickname.value
  editMode.value = true
}

function onSave() {
  nickname.value = editNickname.value.trim() || '羽毛球爱好者'
  editMode.value = false
}

function onCancel() {
  editMode.value = false
}

function saveGoal() {
  const goal = parseInt(editMonthlyGoal.value);
  if (goal > 0 && goal <= 31) {
    monthlyGoal.value = goal;
    setMonthlyTarget(goal);
    editGoal.value = false;
  } else {
    uni.showToast({
      title: '请输入1-31的有效天数',
      icon: 'none'
    });
  }
}

function cancelEditGoal() {
  editMonthlyGoal.value = String(monthlyGoal.value);
  editGoal.value = false;
}

function onUploadAvatar() {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
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
</style>
