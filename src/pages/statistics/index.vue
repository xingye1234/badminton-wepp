<template>
  <view class="min-h-screen bg-[#f6fbff] overflow-hidden">
    <!-- 顶部渐变背景 -->
    <view class="w-full bg-gradient-to-r from-blue-500 to-green-400 pt-12 pb-16 px-4">
      <view class="flex items-center">
        <text class="i-mdi:chart-box text-2xl text-white mr-2" />
        <text class="text-xl text-white font-bold">训练统计</text>
      </view>
      <text class="text-sm text-white opacity-80 mt-2">分析你的训练数据和趋势</text>
    </view>

    <!-- 本月统计卡片 -->
    <view class="mx-4 -mt-12 bg-white rounded-xl shadow-lg p-5">
      <view class="flex items-center mb-4">
        <text class="i-mdi:chart-line text-xl text-blue-500 mr-2" />
        <text class="text-lg font-bold">本月统计</text>
      </view>
      <view class="grid grid-cols-3 gap-4 mb-2">
        <view class="flex flex-col items-center">
          <text class="text-3xl font-bold text-blue-500">{{
            monthDays
          }}</text>
          <text class="text-xs text-gray-500 mt-1">训练天数</text>
        </view>
        <view class="flex flex-col items-center">
          <text class="text-3xl font-bold text-purple-500">{{ monthHours }}h</text>
          <text class="text-xs text-gray-500 mt-1">总时长</text>
        </view>
        <view class="flex flex-col items-center">
          <text class="text-3xl font-bold text-orange-500">{{
            monthCalories
          }}</text>
          <text class="text-xs text-gray-500 mt-1">总卡路里</text>
        </view>
      </view>
    </view>

    <!-- 强度分布卡片 -->
    <view class="mx-4 bg-white rounded-xl shadow-lg mt-4 p-5">
      <view class="flex items-center mb-4">
        <text class="i-mdi:flash text-xl text-yellow-500 mr-2" />
        <text class="text-lg font-bold">强度分布</text>
      </view>
      <view class="flex flex-col gap-4">
        <view class="flex items-center justify-between p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
          <view class="flex items-center">
            <view class="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <text class="i-mdi:walk text-2xl text-green-600"></text>
            </view>
            <text class="font-medium text-gray-800">轻松训练</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-gray-500 mr-2">{{ easyHours }}小时</text>
            <text class="text-xl font-bold text-green-600">{{
              easyDays
            }}</text>
            <text class="text-sm text-gray-500 ml-1">天</text>
          </view>
        </view>
        
        <view class="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
          <view class="flex items-center">
            <view class="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
              <text class="i-mdi:run text-2xl text-yellow-600"></text>
            </view>
            <text class="font-medium text-gray-800">中等强度</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-gray-500 mr-2">{{ mediumHours }}小时</text>
            <text class="text-xl font-bold text-yellow-600">{{
              mediumDays
            }}</text>
            <text class="text-sm text-gray-500 ml-1">天</text>
          </view>
        </view>
        
        <view class="flex items-center justify-between p-4 rounded-lg bg-red-50 border-l-4 border-red-400">
          <view class="flex items-center">
            <view class="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mr-3">
              <text class="i-mdi:run-fast text-2xl text-red-600"></text>
            </view>
            <text class="font-medium text-gray-800">高强度训练</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-gray-500 mr-2">{{ hardHours }}小时</text>
            <text class="text-xl font-bold text-red-600">{{
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
        <view class="flex-1 py-2 px-4 rounded-lg text-center" 
          v-for="(tab, index) in tabs" 
          :key="index" 
          @click="currentTab = index" 
          :class="[currentTab === index ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500']">
          <text class="text-sm font-medium">{{ tab.name }}</text>
        </view>
      </view>
    </view>

    <view class="mx-4 mb-6">
      <view v-show="currentTab === 0">
        <!-- 训练建议内容 -->
        <view class="bg-white rounded-xl shadow-lg p-5">
          <view class="flex items-center mb-4">
            <text class="i-mdi:lightbulb-on text-xl text-yellow-500 mr-2" />
            <text class="text-lg font-bold">智能训练建议</text>
          </view>
          <view class="bg-blue-50 rounded-lg p-4">
            <view class="flex items-center mb-2">
              <text class="i-mdi:lightbulb-on text-lg text-blue-500 mr-2" />
              <text class="font-bold text-blue-600 text-base">开始你的训练之旅</text>
            </view>
            <text class="text-sm text-gray-700 mb-3 block">本月还没有训练记录，建议制定一个合理的训练计划。</text>
            <view class="bg-white rounded-lg p-3 space-y-2">
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
          </view>
        </view>
      </view>
      <view v-show="currentTab === 1">
        <!-- 训练计划内容 -->
        <view class="bg-white rounded-xl shadow-lg p-5">
          <view class="flex items-center justify-between mb-4">
            <view class="flex items-center">
              <text class="i-mdi:calendar text-xl text-purple-500 mr-2" />
              <text class="text-lg font-bold">下周训练计划</text>
            </view>
            <wd-button type="primary" size="small" @click="generatePlan" v-show="!showPlan">生成计划</wd-button>
          </view>
          <view v-if="!showPlan" class="flex flex-col items-center justify-center py-10">
            <text class="i-mdi:calendar-outline text-6xl text-gray-200 mb-4" />
            <text class="text-gray-500 mb-4 text-sm text-center">点击生成计划按钮，智能制定下周训练安排</text>
            <wd-button type="primary" @click="generatePlan">开始制定计划</wd-button>
          </view>
          <view v-else>
            <view v-for="(item, idx) in weekPlan" :key="item.week" :class="[
              'rounded-lg p-4 mb-3 border-l-4',
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
                    class="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{{
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
        <view class="bg-white rounded-xl shadow-lg p-5">
          <view class="flex items-center mb-4">
            <text class="i-mdi:chart-line text-xl text-purple-500 mr-2" />
            <text class="text-lg font-bold">训练趋势</text>
          </view>
          <view class="flex flex-col divide-y divide-gray-100">
            <view class="flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:timer-outline text-blue-500"></text>
                </view>
                <text class="text-sm text-gray-700">周平均训练时长</text>
              </view>
              <text class="text-base font-medium text-gray-800">暂无数据</text>
            </view>
            <view class="flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:fire text-green-500"></text>
                </view>
                <text class="text-sm text-gray-700">最长连续打卡</text>
              </view>
              <text class="text-base font-medium text-green-600">8天</text>
            </view>
            <view class="flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:heart-pulse text-purple-500"></text>
                </view>
                <text class="text-sm text-gray-700">最喜欢的训练强度</text>
              </view>
              <view class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">轻松</view>
            </view>
            <view class="flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:fire text-orange-500"></text>
                </view>
                <text class="text-sm text-gray-700">累计消耗卡路里</text>
              </view>
              <text class="text-base font-medium text-orange-600">3950卡</text>
            </view>
            <view class="flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <text class="i-mdi:clock-time-four text-blue-500"></text>
                </view>
                <text class="text-sm text-gray-700">平均训练时长</text>
              </view>
              <text class="text-base font-medium text-gray-400">暂无数据</text>
            </view>
            <view class="flex justify-between items-center py-3">
              <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
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
import { ref, computed } from "vue";
// 静态 mock 数据，后续可替换为接口数据
const monthDays = ref(0);
const monthHours = ref(0);
const monthCalories = ref(0);
const easyHours = ref(0);
const easyDays = ref(0);
const mediumHours = ref(0);
const mediumDays = ref(0);
const hardHours = ref(0);
const hardDays = ref(0);

// Tab切换
interface TabChangeEvent {
  index: number;
  [key: string]: any;
}
const tabs = [{ name: "训练建议" }, { name: "训练计划" }, { name: "训练趋势" }];
const currentTab = ref(0);
function onTabChange(e: TabChangeEvent) {
  currentTab.value = e.index;
}

// 训练计划相关
const showPlan = ref(false);
const weekPlan = ref<any[]>([]);

function generatePlan() {
  // 生成7天计划，日期为下周一到周日
  const today = new Date();
  const day = today.getDay() || 7; // 周日为0，转为7
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + (8 - day));
  const planList = [
    {
      week: "周一",
      date: getDateStr(nextMonday, 0),
      type: "技术训练",
      duration: 45,
      level: "轻松",
      desc: "专注于基本技术动作的练习和改进",
      tags: ["发球练习", "正反手挥拍", "步法训练", "网前技术"],
      color: "green",
    },
    {
      week: "周二",
      date: getDateStr(nextMonday, 1),
      type: "体能训练",
      duration: 60,
      level: "中等",
      desc: "提升身体素质和运动能力",
      tags: ["有氧耐力", "爆发力训练", "敏捷性练习", "核心力量"],
      color: "yellow",
    },
    {
      week: "周三",
      date: getDateStr(nextMonday, 2),
      type: "基础训练",
      duration: 45,
      level: "轻松",
      desc: "基础动作和体能的入门训练",
      tags: ["基本动作", "体能基础", "规则学习", "兴趣培养"],
      color: "green",
    },
    {
      week: "周四",
      date: getDateStr(nextMonday, 3),
      type: "专项训练",
      duration: 60,
      level: "高强度",
      desc: "针对薄弱环节进行专项提升",
      tags: ["后场高远球", "杀球练习", "防守反击", "体能冲刺"],
      color: "red",
    },
    {
      week: "周五",
      date: getDateStr(nextMonday, 4),
      type: "实战演练",
      duration: 60,
      level: "中等",
      desc: "模拟比赛，提升实战能力",
      tags: ["对抗练习", "战术演练", "临场应变"],
      color: "yellow",
    },
    {
      week: "周六",
      date: getDateStr(nextMonday, 5),
      type: "恢复训练",
      duration: 45,
      level: "轻松",
      desc: "拉伸放松，身体恢复",
      tags: ["拉伸", "放松", "低强度活动"],
      color: "green",
    },
    {
      week: "周日",
      date: getDateStr(nextMonday, 6),
      type: "休息日",
      duration: 0,
      level: "",
      desc: "休息日",
      tags: [],
      color: "gray",
    },
  ];
  weekPlan.value = planList;
  showPlan.value = true;
}
function getDateStr(base: Date, offset: number) {
  const d = new Date(base);
  d.setDate(base.getDate() + offset);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
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
</style>
