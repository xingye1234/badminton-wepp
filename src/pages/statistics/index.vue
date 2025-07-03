<template>
  <view class="bg-[#f6fbff] min-h-screen pb-6">
    <!-- 标题区 -->
    <view class="pt-8 pb-2 flex flex-col items-center">
      <text class="text-2xl font-bold mb-2">训练统计</text>
      <text class="text-base text-gray-500 mb-2">分析你的训练数据和趋势</text>
      <view class="flex items-center mt-1">
        <view class="w-3 h-3 rounded-full bg-green-400 mr-2" />
        <text class="text-xs text-green-500">数据实时更新</text>
      </view>
    </view>

    <!-- 本月统计 -->
    <view class="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
      <view class="flex items-center mb-4">
        <text class="i-mdi:chart-line text-lg text-blue-500 mr-2" />
        <text class="text-lg font-bold">本月统计</text>
      </view>
      <view class="grid grid-cols-3 gap-2 mb-2">
        <view class="flex flex-col items-center">
          <text class="text-2xl font-bold text-blue-500">{{ monthDays }}</text>
          <text class="text-xs text-gray-500 mt-1">训练天数</text>
        </view>
        <view class="flex flex-col items-center">
          <text class="text-2xl font-bold text-purple-500">{{ monthHours }}h</text>
          <text class="text-xs text-gray-500 mt-1">总时长</text>
        </view>
        <view class="flex flex-col items-center">
          <text class="text-2xl font-bold text-orange-500">{{ monthCalories }}</text>
          <text class="text-xs text-gray-500 mt-1">总卡路里</text>
        </view>
      </view>
    </view>

    <!-- 强度分布 -->
    <view class="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
      <view class="flex items-center mb-4">
        <text class="i-mdi:flash-outline text-lg text-yellow-500 mr-2" />
        <text class="text-lg font-bold">强度分布</text>
      </view>
      <view class="flex flex-col gap-3">
        <view class="flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50">
          <view class="flex items-center">
            <view class="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <text class="font-bold text-green-700">轻松训练</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-xs text-gray-500">{{ easyHours }}小时</text>
            <text class="text-lg font-bold text-green-600 ml-2">{{ easyDays }}</text>
            <text class="text-xs text-gray-500">天</text>
          </view>
        </view>
        <view class="flex items-center justify-between p-4 rounded-xl border border-yellow-200 bg-yellow-50">
          <view class="flex items-center">
            <view class="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
            <text class="font-bold text-yellow-700">中等强度</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-xs text-gray-500">{{ mediumHours }}小时</text>
            <text class="text-lg font-bold text-yellow-600 ml-2">{{ mediumDays }}</text>
            <text class="text-xs text-gray-500">天</text>
          </view>
        </view>
        <view class="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
          <view class="flex items-center">
            <view class="w-3 h-3 rounded-full bg-red-500 mr-2" />
            <text class="font-bold text-red-700">高强度训练</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-xs text-gray-500">{{ hardHours }}小时</text>
            <text class="text-lg font-bold text-red-600 ml-2">{{ hardDays }}</text>
            <text class="text-xs text-gray-500">天</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 成就徽章模块 -->
    <view class="bg-white rounded-2xl shadow mx-4 mt-6 p-4">
      <view class="flex items-center justify-between mb-4">
        <view class="flex items-center">
          <text class="i-mdi:medal text-lg text-yellow-500 mr-2" />
          <text class="text-lg font-bold">成就徽章</text>
        </view>
        <text class="text-xs text-gray-500">{{ unlocked }}/{{ achievements.length }}</text>
      </view>
      <view class="grid grid-cols-2 gap-3 mb-4">
        <view
          v-for="(item, idx) in achievements"
          :key="item.title"
          :class="[
            'rounded-xl p-4 flex flex-col justify-between min-h-[100px] border',
            item.unlocked ? 'bg-yellow-50 border-yellow-200 shadow' : 'bg-[#f8fafc] border-gray-100',
          ]"
        >
          <view class="flex items-center mb-2">
            <text :class="['text-2xl mr-2', item.iconColor]">{{ item.icon }}</text>
            <text class="font-bold text-base">{{ item.title }}</text>
          </view>
          <text class="text-xs text-gray-500 mb-1">{{ item.desc }}</text>
          <template v-if="item.unlocked">
            <text class="text-xs text-yellow-600 font-bold">✨已解锁</text>
          </template>
          <template v-else>
            <wd-progress
              :percentage="Math.round(item.progress / item.goal * 100)"
              stroke-width="10"
              color="#2563eb"
              track-color="#e5e7eb"
              :show-text="false"
              class="mb-1"
            />
            <text class="text-xs text-gray-400">{{ item.progressLabel }}</text>
          </template>
        </view>
      </view>
      <!-- 成就完成度 -->
      <view class="bg-yellow-50 rounded-xl p-4 mt-2">
        <view class="flex items-center mb-2">
          <text class="font-bold text-yellow-700">成就完成度</text>
        </view>
        <view class="flex items-center gap-2">
          <wd-progress
            :percentage="achievementPercent"
            stroke-width="8"
            color="#2563eb"
            track-color="#e5e7eb"
            :show-text="false"
            class="flex-1"
          />
          <text class="text-base font-bold text-yellow-600 ml-2">{{ achievementPercent }}%</text>
        </view>
      </view>
    </view>

    <!-- wd-tabs放在最底部，内容用插槽+v-for渲染 -->
    <wd-tabs :tabs="tabs" :current="currentTab" @change="onTabChange" class="mx-4 mt-4 mb-2">
      <wd-tab v-for="(tab, index) in tabs" :key="tab.name" :title="tab.name" v-show="currentTab === index">
        <view v-if="index === 0">
          <!-- 训练建议内容 -->
          <view class="bg-white rounded-2xl shadow mx-4 p-4 mt-6">
            <view class="flex items-center mb-3">
              <text class="i-mdi:lightbulb-on-outline text-lg text-yellow-400 mr-2" />
              <text class="text-lg font-bold">智能训练建议</text>
            </view>
            <view class="bg-[#f6faff] border-l-4 border-blue-400 rounded-xl p-4">
              <view class="flex items-center mb-2">
                <text class="i-mdi:lightbulb-on-outline text-base text-blue-500 mr-1" />
                <text class="font-bold text-blue-600">开始你的训练之旅</text>
              </view>
              <text class="text-sm text-gray-600 mb-2 block">本月还没有训练记录，建议制定一个合理的训练计划。</text>
              <view class="text-sm text-gray-700 mt-2">
                <view>• 每周安排3-4次训练</view>
                <view>• 从轻松强度开始，逐步适应</view>
                <view>• 每次训练45-60分钟为宜</view>
                <view>• 保持规律的训练节奏</view>
              </view>
            </view>
          </view>
        </view>
        <view v-else-if="index === 1">
          <!-- 训练计划内容 -->
          <view class="bg-white rounded-2xl shadow mx-4 p-4 mt-6">
            <view class="flex items-center justify-between mb-4">
              <view class="flex items-center">
                <text class="i-mdi:calendar-outline text-lg text-purple-500 mr-2" />
                <text class="text-lg font-bold">下周训练计划</text>
              </view>
              <button v-if="!showPlan" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center" @click="generatePlan">
                <text class="i-mdi:refresh text-base mr-1" />生成计划
              </button>
            </view>
            <view v-if="!showPlan" class="flex flex-col items-center justify-center py-8">
              <text class="i-mdi:calendar-outline text-5xl text-gray-300 mb-4" />
              <text class="text-gray-400 mb-2">点击"生成计划"按钮，根据你的训练数据智能制定下周训练安排</text>
              <button class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center mt-4" @click="generatePlan">
                <text class="i-mdi:play-circle-outline text-base mr-1" />开始制定计划
              </button>
            </view>
            <view v-else>
              <view v-for="(item, idx) in weekPlan" :key="item.week" :class="[
                'rounded-2xl p-4 mb-4',
                item.color === 'green' ? 'bg-[#e8f5e9] border border-green-200' : '',
                item.color === 'yellow' ? 'bg-[#fffde7] border border-yellow-300' : '',
                item.color === 'red' ? 'bg-[#ffebee] border border-red-300' : '',
                item.color === 'gray' ? 'bg-gray-50 border border-gray-200' : '',
              ]">
                <view class="flex justify-between items-center mb-2">
                  <text class="font-bold">{{ item.week }}</text>
                  <text class="text-gray-500">{{ item.date }}</text>
                  <view v-if="item.level" :class="[
                    'px-2 py-1 rounded text-xs font-bold',
                    item.color === 'green' ? 'bg-green-400 text-white' : '',
                    item.color === 'yellow' ? 'bg-yellow-400 text-white' : '',
                    item.color === 'red' ? 'bg-red-400 text-white' : '',
                  ]">{{ item.level }}</view>
                  <view v-else class="text-gray-400">休息日</view>
                </view>
                <view v-if="item.type !== '休息日'">
                  <view class="flex items-center mb-1">
                    <text class="i-mdi:play-circle-outline text-base mr-1" />
                    <text class="font-bold">{{ item.type }}</text>
                    <text class="i-mdi:clock-outline text-base ml-2 mr-1" />
                    <text>{{ item.duration }}分钟</text>
                  </view>
                  <text class="text-gray-500 text-sm mb-1 block">{{ item.desc }}</text>
                  <view class="flex flex-wrap gap-2 mt-1">
                    <view v-for="tag in item.tags" :key="tag" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{{ tag }}</view>
                  </view>
                </view>
                <view v-else class="text-center text-gray-400 py-4">休息日</view>
              </view>
            </view>
          </view>
        </view>
        <view v-else>
          <!-- 训练趋势内容 -->
          <view class="bg-white rounded-2xl shadow mx-4 p-4 mt-6">
            <view class="flex items-center mb-4">
              <text class="i-mdi:chart-line text-lg text-purple-500 mr-2" />
              <text class="text-lg font-bold">训练趋势</text>
            </view>
            <view class="flex flex-col gap-2">
              <view class="flex justify-between items-center">
                <text>周平均训练时长</text>
                <text class="font-bold">暂无数据</text>
              </view>
              <view class="flex justify-between items-center">
                <text>最长连续打卡</text>
                <text class="font-bold">8天</text>
              </view>
              <view class="flex justify-between items-center">
                <text>最喜欢的训练强度</text>
                <view class="bg-green-100 text-green-700 px-2 py-1 rounded">轻松</view>
              </view>
              <view class="flex justify-between items-center">
                <text>累计消耗卡路里</text>
                <text class="font-bold">3950卡</text>
              </view>
              <view class="flex justify-between items-center">
                <text>平均训练时长</text>
                <text class="font-bold text-green-600">暂无数据</text>
              </view>
              <view class="flex justify-between items-center">
                <text>本月训练频率</text>
                <text class="font-bold text-blue-600">0%</text>
              </view>
            </view>
          </view>
        </view>
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// 静态 mock 数据，后续可替换为接口数据
const monthDays = ref(0)
const monthHours = ref(0)
const monthCalories = ref(0)
const easyHours = ref(0)
const easyDays = ref(0)
const mediumHours = ref(0)
const mediumDays = ref(0)
const hardHours = ref(0)
const hardDays = ref(0)

// 成就徽章静态数据
const achievements = ref([
  {
    title: '连续打卡7天',
    desc: '当前连续 0 天',
    icon: '🔥',
    iconColor: 'text-gray-400',
    progress: 0,
    goal: 7,
    progressLabel: '0/7',
    unlocked: false,
  },
  {
    title: '单月训练20小时',
    desc: '本月已训练 0 小时',
    icon: '⏰',
    iconColor: 'text-gray-400',
    progress: 0,
    goal: 1200, // 60分钟*20小时
    progressLabel: '0/1200',
    unlocked: false,
  },
  {
    title: '高强度训练10次',
    desc: '已完成 5 次高强度训练',
    icon: '🦢',
    iconColor: 'text-gray-400',
    progress: 5,
    goal: 10,
    progressLabel: '5/10',
    unlocked: false,
  },
  {
    title: '完美一周',
    desc: '最长连续 8 天！',
    icon: '⭐',
    iconColor: 'text-yellow-500',
    progress: 8,
    goal: 7,
    progressLabel: '✨已解锁',
    unlocked: true,
  },
  {
    title: '训练达人',
    desc: '累计训练 11 天',
    icon: '🏆',
    iconColor: 'text-gray-400',
    progress: 11,
    goal: 30,
    progressLabel: '11/30',
    unlocked: false,
  },
  {
    title: '时间管理大师',
    desc: '累计训练 13.2 小时',
    icon: '⌚',
    iconColor: 'text-gray-400',
    progress: 792, // 13.2小时*60分钟
    goal: 3000, // 50小时*60分钟
    progressLabel: '792/3000',
    unlocked: false,
  },
])
const unlocked = computed(() => achievements.value.filter(a => a.unlocked).length)
const achievementPercent = computed(() => Math.round(unlocked.value / achievements.value.length * 100))

// Tab切换
interface TabChangeEvent {
  index: number
  [key: string]: any
}
const tabs = [
  { name: '训练建议' },
  { name: '训练计划' },
  { name: '训练趋势' },
]
const currentTab = ref(0)
function onTabChange(e: TabChangeEvent) {
  currentTab.value = e.index
}

// 训练计划相关
const showPlan = ref(false)
const weekPlan = ref<any[]>([])

function generatePlan() {
  // 生成7天计划，日期为下周一到周日
  const today = new Date()
  const day = today.getDay() || 7 // 周日为0，转为7
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + (8 - day))
  const planList = [
    {
      week: '周一',
      date: getDateStr(nextMonday, 0),
      type: '技术训练',
      duration: 45,
      level: '轻松',
      desc: '专注于基本技术动作的练习和改进',
      tags: ['发球练习', '正反手挥拍', '步法训练', '网前技术'],
      color: 'green',
    },
    {
      week: '周二',
      date: getDateStr(nextMonday, 1),
      type: '体能训练',
      duration: 60,
      level: '中等',
      desc: '提升身体素质和运动能力',
      tags: ['有氧耐力', '爆发力训练', '敏捷性练习', '核心力量'],
      color: 'yellow',
    },
    {
      week: '周三',
      date: getDateStr(nextMonday, 2),
      type: '基础训练',
      duration: 45,
      level: '轻松',
      desc: '基础动作和体能的入门训练',
      tags: ['基本动作', '体能基础', '规则学习', '兴趣培养'],
      color: 'green',
    },
    {
      week: '周四',
      date: getDateStr(nextMonday, 3),
      type: '专项训练',
      duration: 60,
      level: '高强度',
      desc: '针对薄弱环节进行专项提升',
      tags: ['后场高远球', '杀球练习', '防守反击', '体能冲刺'],
      color: 'red',
    },
    {
      week: '周五',
      date: getDateStr(nextMonday, 4),
      type: '实战演练',
      duration: 60,
      level: '中等',
      desc: '模拟比赛，提升实战能力',
      tags: ['对抗练习', '战术演练', '临场应变'],
      color: 'yellow',
    },
    {
      week: '周六',
      date: getDateStr(nextMonday, 5),
      type: '恢复训练',
      duration: 45,
      level: '轻松',
      desc: '拉伸放松，身体恢复',
      tags: ['拉伸', '放松', '低强度活动'],
      color: 'green',
    },
    {
      week: '周日',
      date: getDateStr(nextMonday, 6),
      type: '休息日',
      duration: 0,
      level: '',
      desc: '休息日',
      tags: [],
      color: 'gray',
    },
  ]
  weekPlan.value = planList
  showPlan.value = true
}
function getDateStr(base: Date, offset: number) {
  const d = new Date(base)
  d.setDate(base.getDate() + offset)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>

<style scoped>
.bg-green-50 { background-color: #f0fdf4; }
.bg-yellow-50 { background-color: #fefce8; }
.bg-red-50 { background-color: #fef2f2; }
.border-green-200 { border-color: #bbf7d0; }
.border-yellow-200 { border-color: #fef08a; }
.border-red-200 { border-color: #fecaca; }
.min-h-100px { min-height: 100px; }

:deep(.wd-tabs){
    background-color: transparent !important;
}
:deep(.wd-tabs__nav){
    background-color: transparent !important;
}
</style>
