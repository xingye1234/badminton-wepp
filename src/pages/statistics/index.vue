<template>
  <view class="min-h-screen bg-[#f6fbff] overflow-hidden">
    <!-- 顶部渐变背景 -->
    <view class="w-full header-bg pt-12 pb-16 px-4">
      <view class="flex items-center">
        <text class="i-mdi:chart-box text-2xl text-white mr-2" />
        <text class="text-xl text-white font-bold">训练统计</text>
      </view>
      <text class="text-sm text-white opacity-80 mt-2">分析你的训练数据和趋势</text>
    </view>

    <!-- 本月统计卡片 -->
    <view class="mx-4 -mt-12 card-container p-5 z-10 relative">
      <div class="shimmer-bg"></div>
      <view class="flex items-center mb-4">
        <text class="i-mdi:chart-line text-xl text-blue-500 mr-2" />
        <text class="text-lg font-bold">本月统计</text>
      </view>
      <view class="grid grid-cols-3 gap-4 mb-2">
        <view class="flex flex-col items-center">
          <text class="stat-number stat-number-delay-1 text-3xl font-bold text-blue-500">{{
            monthDays
          }}</text>
          <text class="text-xs text-gray-500 mt-1">训练天数</text>
        </view>
        <view class="flex flex-col items-center">
          <text class="stat-number stat-number-delay-2 text-3xl font-bold text-purple-500">{{ monthHours }}h</text>
          <text class="text-xs text-gray-500 mt-1">总时长</text>
        </view>
        <view class="flex flex-col items-center">
          <text class="stat-number stat-number-delay-3 text-3xl font-bold text-orange-500">{{
            monthCalories
          }}</text>
          <text class="text-xs text-gray-500 mt-1">总卡路里</text>
        </view>
      </view>
    </view>

    <!-- 强度分布卡片 -->
    <view class="mx-4 card-container mt-4 p-5">
      <div class="shimmer-bg"></div>
      <view class="flex items-center mb-4">
        <text class="i-mdi:flash text-xl text-yellow-500 mr-2" />
        <text class="text-lg font-bold">强度分布</text>
      </view>
      <view class="flex flex-col gap-4">
        <view class="intensity-card flex items-center justify-between p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
          <view class="flex items-center">
            <view class="intensity-icon w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <text class="i-mdi:walk text-2xl text-green-600"></text>
            </view>
            <text class="font-medium text-gray-800">轻松训练</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-gray-500 mr-2">{{ easyHours }}小时</text>
            <text class="stat-number text-xl font-bold text-green-600">{{
              easyDays
            }}</text>
            <text class="text-sm text-gray-500 ml-1">天</text>
          </view>
        </view>
        
        <view class="intensity-card flex items-center justify-between p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
          <view class="flex items-center">
            <view class="intensity-icon w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
              <text class="i-mdi:run text-2xl text-yellow-600"></text>
            </view>
            <text class="font-medium text-gray-800">中等强度</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-gray-500 mr-2">{{ mediumHours }}小时</text>
            <text class="stat-number text-xl font-bold text-yellow-600">{{
              mediumDays
            }}</text>
            <text class="text-sm text-gray-500 ml-1">天</text>
          </view>
        </view>
        
        <view class="intensity-card flex items-center justify-between p-4 rounded-lg bg-red-50 border-l-4 border-red-400">
          <view class="flex items-center">
            <view class="intensity-icon w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mr-3">
              <text class="i-mdi:run-fast text-2xl text-red-600"></text>
            </view>
            <text class="font-medium text-gray-800">高强度训练</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-gray-500 mr-2">{{ hardHours }}小时</text>
            <text class="stat-number text-xl font-bold text-red-600">{{
              hardDays
            }}</text>
            <text class="text-sm text-gray-500 ml-1">天</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容选项卡 -->
    <view class="mx-4 mt-4 mb-4">
      <view class="bg-gray-100 rounded-xl p-1 flex justify-between">
        <view 
          v-for="(tab, index) in tabs" 
          :key="index" 
          @click="currentTab = index" 
          :class="[
            'tab-item flex-1 py-2 px-4 rounded-lg text-center',
            currentTab === index ? 'bg-white text-blue-500 shadow-sm active' : 'text-gray-500'
          ]">
          <text class="text-sm font-medium">{{ tab.name }}</text>
        </view>
      </view>
    </view>

    <view class="mx-4 mb-6">
      <view v-show="currentTab === 0">
        <!-- 训练建议内容 -->
        <view class="card-container p-5">
          <div class="shimmer-bg"></div>
          <view class="flex items-center mb-4">
            <text class="i-mdi:lightbulb-on text-xl text-yellow-500 mr-2 animate-pulse" />
            <text class="text-lg font-bold">智能训练建议</text>
          </view>
          <view class="bg-blue-50 rounded-lg p-4">
            <view class="flex items-center mb-2">
              <text class="i-mdi:lightbulb-on text-lg text-blue-500 mr-2" />
              <text class="font-bold text-blue-600 text-base" v-if="stats.totalDays === 0">开始你的训练之旅</text>
              <text class="font-bold text-blue-600 text-base" v-else>训练分析与建议</text>
            </view>
            <text class="text-sm text-gray-700 mb-3 block" v-if="stats.totalDays === 0">本月还没有训练记录，建议制定一个合理的训练计划。</text>
            <text class="text-sm text-gray-700 mb-3 block" v-else>本月已完成 {{stats.totalDays}} 次训练，以下是针对你的训练数据的个性化建议。</text>
            <view class="bg-white rounded-lg p-3 space-y-2" v-if="stats.totalDays === 0">
              <view class="flex items-center">
                <text class="i-mdi:check-circle text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">每周安排3-4次训练</text>
              </view>
              <view class="flex items-center">
                <text class="i-mdi:check-circle text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">从轻松强度开始，逐步适应</text>
              </view>
              <view class="flex items-center">
                <text class="i-mdi:check-circle text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">每次训练45-60分钟为宜</text>
              </view>
              <view class="flex items-center">
                <text class="i-mdi:check-circle text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">保持规律的训练节奏</text>
              </view>
            </view>
            <view class="bg-white rounded-lg p-3 space-y-2" v-else>
              <!-- 针对训练次数的建议 -->
              <view class="flex items-center" v-if="stats.totalDays < 8">
                <text class="i-mdi:trending-up text-blue-500 mr-2"></text>
                <text class="text-sm text-gray-700">建议增加训练频率，每周至少安排3-4次训练</text>
              </view>
              <view class="flex items-center" v-else-if="stats.totalDays >= 15">
                <text class="i-mdi:shield-check text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">训练频率优秀，注意保持适当休息，避免过度训练</text>
              </view>
              <view class="flex items-center" v-else>
                <text class="i-mdi:thumb-up text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">训练频率良好，保持稳定性</text>
              </view>
              
              <!-- 针对训练时长的建议 -->
              <view class="flex items-center" v-if="stats.totalDuration / stats.totalDays < 45">
                <text class="i-mdi:clock-plus text-yellow-500 mr-2"></text>
                <text class="text-sm text-gray-700">单次训练时间偏短，建议延长至45-60分钟</text>
              </view>
              <view class="flex items-center" v-else-if="stats.totalDuration / stats.totalDays > 120">
                <text class="i-mdi:clock-alert text-orange-500 mr-2"></text>
                <text class="text-sm text-gray-700">单次训练时间较长，注意强度控制和充分休息</text>
              </view>
              <view class="flex items-center" v-else>
                <text class="i-mdi:check-circle text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">训练时长合理，保持良好节奏</text>
              </view>
              
              <!-- 针对训练强度的建议 -->
              <view class="flex items-center" v-if="favoriteIntensity === 'easy'">
                <text class="i-mdi:trending-up text-blue-500 mr-2"></text>
                <text class="text-sm text-gray-700">可以尝试适当增加中等强度训练，提升训练效果</text>
              </view>
              <view class="flex items-center" v-else-if="favoriteIntensity === 'hard'">
                <text class="i-mdi:shield-half-full text-orange-500 mr-2"></text>
                <text class="text-sm text-gray-700">高强度训练占比较高，注意恢复和伤病预防</text>
              </view>
              <view class="flex items-center" v-else>
                <text class="i-mdi:check-circle text-green-500 mr-2"></text>
                <text class="text-sm text-gray-700">训练强度分配合理，继续保持</text>
              </view>
              
              <!-- 针对连续训练的建议 -->
              <view class="flex items-center" v-if="stats.streak >= 5">
                <text class="i-mdi:fire text-red-500 mr-2"></text>
                <text class="text-sm text-gray-700">连续训练{{stats.streak}}天，注意安排休息日，避免过度训练</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="currentTab === 1">
        <!-- 训练计划内容 -->
        <view class="card-container p-5">
          <div class="shimmer-bg"></div>
          <view class="flex items-center justify-between mb-4">
            <view class="flex items-center">
              <text class="i-mdi:calendar text-xl text-purple-500 mr-2" />
              <text class="text-lg font-bold">下周训练计划</text>
            </view>
          </view>
          <view v-if="!showPlan" class="flex flex-col items-center justify-center py-10">
            <text class="i-mdi:calendar-outline text-6xl text-gray-200 mb-4" />
            <text class="text-gray-500 mb-4 text-sm text-center">点击生成计划按钮，智能制定下周训练安排</text>
            <button class="py-2 px-4 rounded-lg generate-button text-white text-base" @click="generatePlan">
              <text class="i-mdi:magic text-xl mr-2"></text>
              <text>开始制定计划</text>
            </button>
          </view>
          <view v-else>
            <view v-for="(item, idx) in weekPlan" :key="item.week" :class="[
              'plan-item rounded-lg p-4 mb-3 border-l-4',
              item.color === 'green' ? 'bg-green-50 border-green-400' : '',
              item.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' : '',
              item.color === 'red' ? 'bg-red-50 border-red-400' : '',
              item.color === 'gray' ? 'bg-gray-50 border-gray-300' : '',
            ]">
              <view class="flex justify-between items-center mb-2">
                <view class="flex items-center">
                  <text class="font-medium text-gray-800 mr-2">{{ item.week }}</text>
                  <text class="text-gray-500 text-xs">{{ item.date }}</text>
                </view>
                <view v-if="item.level" :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.color === 'green' ? 'bg-green-100 text-green-600' : '',
                  item.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : '',
                  item.color === 'red' ? 'bg-red-100 text-red-600' : '',
                ]">{{ item.level }}</view>
                <view v-else class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">休息日</view>
              </view>
              <view v-if="item.type !== '休息日'">
                <view class="flex items-center mb-2">
                  <text class="i-mdi:play-circle text-base mr-2 text-blue-500" />
                  <text class="font-medium text-gray-800">{{ item.type }}</text>
                  <text class="mx-2 text-gray-400">·</text>
                  <text class="i-mdi:clock text-base mr-1 text-gray-500" />
                  <text class="text-gray-700">{{ item.duration }}分钟</text>
                </view>
                <text class="text-gray-600 text-sm mb-2 block">{{
                  item.desc
                }}</text>
                <view class="flex flex-wrap gap-2 mt-2">
                  <view v-for="tag in item.tags" :key="tag"
                    class="tag-item bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{{
                    tag }}</view>
                </view>
              </view>
              <view v-else class="flex items-center justify-center py-3">
                <text class="i-mdi:sleep text-xl text-gray-400 mr-2"></text>
                <text class="text-gray-500">今日休息，恢复体力</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="currentTab === 2">
        <!-- 训练趋势内容 -->
        <view class="card-container p-5">
          <div class="shimmer-bg"></div>
          <view class="flex items-center mb-4">
            <text class="i-mdi:chart-line text-xl text-purple-500 mr-2" />
            <text class="text-lg font-bold">训练趋势</text>
          </view>
          <view class="flex flex-col divide-y divide-gray-100">
            <view class="trend-item flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="trend-icon w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:timer-outline text-blue-500"></text>
                </view>
                <text class="text-sm text-gray-700">周平均训练时长</text>
              </view>
              <text class="text-base font-medium text-gray-800" v-if="stats.totalDays > 0">
                {{ (stats.totalDuration / Math.ceil(stats.totalDays / 7)).toFixed(0) }}分钟
              </text>
              <text class="text-base font-medium text-gray-800" v-else>暂无数据</text>
            </view>
            <view class="trend-item flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="trend-icon w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:fire text-green-500"></text>
                </view>
                <text class="text-sm text-gray-700">最长连续打卡</text>
              </view>
              <text class="text-base font-medium text-green-600">{{stats.maxStreak}}天</text>
            </view>
            <view class="trend-item flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="trend-icon w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:heart-pulse text-purple-500"></text>
                </view>
                <text class="text-sm text-gray-700">最喜欢的训练强度</text>
              </view>
              <view v-if="favoriteIntensity" :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                favoriteIntensity === 'easy' ? 'bg-green-100 text-green-700' : '',
                favoriteIntensity === 'medium' ? 'bg-yellow-100 text-yellow-700' : '',
                favoriteIntensity === 'hard' ? 'bg-red-100 text-red-700' : '',
              ]">
                {{ favoriteIntensity === 'easy' ? '轻松' : favoriteIntensity === 'medium' ? '中等' : '高强度' }}
              </view>
              <view v-else class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">暂无数据</view>
            </view>
            <view class="trend-item flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="trend-icon w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:fire text-orange-500"></text>
                </view>
                <text class="text-sm text-gray-700">累计消耗卡路里</text>
              </view>
              <text class="text-base font-medium text-orange-600">{{stats.totalCalorie}}卡</text>
            </view>
            <view class="trend-item flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="trend-icon w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:clock-time-four text-blue-500"></text>
                </view>
                <text class="text-sm text-gray-700">平均训练时长</text>
              </view>
              <text class="text-base font-medium text-gray-400">暂无数据</text>
            </view>
            <view class="trend-item flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="trend-icon w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:calendar-check text-blue-500"></text>
                </view>
                <text class="text-sm text-gray-700">本月训练频率</text>
              </view>
              <text class="text-base font-medium text-gray-400">0%</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { 
  getCurrentMonthStats, 
  getMonthStats,
  ClockInRecord,
  TrainingStats,
  getAllRecords,
} from '@/utils/storage'

const tabs = [
  { name: '训练建议' },
  { name: '训练计划' },
  { name: '训练趋势' }
]
const currentTab = ref(0)

// 统计数据
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

// 转换为小时显示
const monthDays = computed(() => stats.value.totalDays)
const monthHours = computed(() => (stats.value.totalDuration / 60).toFixed(1))
const monthCalories = computed(() => stats.value.totalCalorie)

const easyDays = computed(() => stats.value.easyDays)
const mediumDays = computed(() => stats.value.mediumDays)
const hardDays = computed(() => stats.value.hardDays)

const easyHours = computed(() => (stats.value.easyDuration / 60).toFixed(1))
const mediumHours = computed(() => (stats.value.mediumDuration / 60).toFixed(1))
const hardHours = computed(() => (stats.value.hardDuration / 60).toFixed(1))

// 获取最喜欢的训练强度
const favoriteIntensity = computed(() => {
  const intensities = [
    { type: 'easy', days: stats.value.easyDays },
    { type: 'medium', days: stats.value.mediumDays },
    { type: 'hard', days: stats.value.hardDays }
  ]
  
  // 按天数排序
  intensities.sort((a, b) => b.days - a.days)
  
  // 如果有记录，返回最多的那个强度，否则返回null
  return intensities[0]?.days > 0 ? intensities[0].type : null
})

// 加载数据
onMounted(() => {
  loadData()
})

// 页面显示时重新加载数据
onShow(() => {
  loadData()
})

function loadData() {
  // 加载本月统计
  stats.value = getCurrentMonthStats()
}

// 周训练计划
const showPlan = ref(false)
const weekPlan = [
  {
    week: '周一',
    date: '5月20日',
    level: '轻松',
    type: '基础步法训练',
    duration: 60,
    color: 'green',
    desc: '专注基础步法练习，巩固移动能力',
    tags: ['步法', '基础', '移动能力']
  },
  {
    week: '周二',
    date: '5月21日',
    level: '',
    type: '休息日',
    duration: 0,
    color: 'gray',
    desc: '',
    tags: []
  },
  {
    week: '周三',
    date: '5月22日',
    level: '中等',
    type: '击球技术训练',
    duration: 80,
    color: 'yellow',
    desc: '专注高远球和网前球的技术训练',
    tags: ['高远球', '网前球', '技术']
  },
  {
    week: '周四',
    date: '5月23日',
    level: '轻松',
    type: '恢复性训练',
    duration: 45,
    color: 'green',
    desc: '轻松训练，恢复肌肉',
    tags: ['恢复', '技术练习']
  },
  {
    week: '周五',
    date: '5月24日',
    level: '高强度',
    type: '比赛训练',
    duration: 90,
    color: 'red',
    desc: '模拟比赛环境，提高实战能力',
    tags: ['比赛', '实战', '战术']
  },
  {
    week: '周六',
    date: '5月25日',
    level: '',
    type: '休息日',
    duration: 0,
    color: 'gray',
    desc: '',
    tags: []
  },
  {
    week: '周日',
    date: '5月26日',
    level: '中等',
    type: '综合训练',
    duration: 70,
    color: 'yellow',
    desc: '综合技术训练，注重连贯性',
    tags: ['综合', '连贯性', '灵活性']
  }
]

function generatePlan() {
  showPlan.value = true
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

:deep(.wd-tabs) {
  background-color: transparent !important;
}

:deep(.wd-tabs__nav) {
  background-color: transparent !important;
}

.header-bg {
  background: linear-gradient(135deg, #4f46e5, #06b6d4, #3b82f6);
  position: relative;
  overflow: hidden;
}

.header-bg::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  animation: header-wave 3s linear infinite;
  z-index: 0;
}

@keyframes header-wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.stat-number {
  animation: number-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: scale(0.8);
}

@keyframes number-pop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.stat-number-delay-1 {
  animation-delay: 0.1s;
}

.stat-number-delay-2 {
  animation-delay: 0.2s;
}

.stat-number-delay-3 {
  animation-delay: 0.3s;
}

.intensity-card {
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.intensity-card:hover {
  transform: translateY(-3px);
}

.intensity-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.intensity-card:hover::after {
  opacity: 0.3;
}

.intensity-icon {
  transition: all 0.3s ease;
  position: relative;
}

.intensity-icon::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.intensity-icon:hover::after {
  opacity: 1;
}

.tab-item {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tab-item::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.tab-item.active::before {
  width: 70%;
}

.card-container {
  border-radius: 1rem;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-container:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.plan-item {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plan-item:hover {
  transform: translateY(-3px);
}

.trend-item {
  transition: all 0.3s ease;
}

.trend-item:hover {
  background-color: #f9fafb;
}

.trend-icon {
  transition: all 0.3s ease;
}

.trend-item:hover .trend-icon {
  transform: scale(1.1);
}

.generate-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  transition: all 0.3s ease;
}

.generate-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  transform: translateX(-100%);
  animation: button-shine 3s infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes button-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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

.tag-item {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.shimmer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer-bg 3s infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes shimmer-bg {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
