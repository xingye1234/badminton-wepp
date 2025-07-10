<template>
  <view class="bg-[#f8faff] min-h-screen">
    <!-- 顶部标题区 -->
    <view class="pt-8 pb-2 flex flex-col items-center">
      <text class="text-base text-gray-500 mt-2">查看你的训练记录和进度</text>
      <view class="flex items-center mt-1">
        <view class="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-1 animate-pulse" />
        <text class="text-xs text-gray-400">共 <text class="font-bold text-blue-600">{{ recordCount }}</text> 条记录</text>
      </view>
    </view>

    <!-- 日历卡片 -->
    <view class="calendar-card bg-white rounded-2xl shadow-lg mx-4 mt-4 p-4 relative overflow-hidden">
      <div class="shimmer-bg"></div>
      <view class="flex items-center justify-between mb-8">
        <view class="nav-button" @click="prevMonth">
          <wd-icon name="arrow-left" size="22px"></wd-icon>
        </view>
        <view class="flex-1 flex justify-center">
          <text class="text-xl font-bold text-center calendar-title">{{ year }}年 {{ month + 1 }}月</text>
        </view>
        <view class="nav-button" @click="nextMonth">
          <wd-icon name="arrow-right" size="22px"></wd-icon>
        </view>
      </view>
      <view class="grid grid-cols-7 text-center text-gray-400 mb-2">
        <text v-for="w in weekList" :key="w" class="week-day">{{ w }}</text>
      </view>
      <view>
        <view v-for="(row, rIdx) in calendarRows" :key="rIdx" class="grid grid-cols-7 mb-1 gap-2">
          <view v-for="(cell, cIdx) in row" :key="cIdx" class="flex items-center justify-center h-96">
            <view v-if="cell" :class="[
              'calendar-day w-96 h-78 flex flex-col items-center justify-center relative transition-all duration-200 rounded-lg',
              cell.strength === 'easy' && cell.isCurrentMonth ? 'intensity-easy' : '',
              cell.strength === 'medium' && cell.isCurrentMonth ? 'intensity-medium' : '',
              cell.strength === 'hard' && cell.isCurrentMonth ? 'intensity-hard' : '',
              selectedDay.year === year && selectedDay.month === month && selectedDay.day === cell.day && cell.isCurrentMonth ? 'selected' : '',
              !cell.isCurrentMonth ? 'text-gray-300' : ''
            ]" style="box-sizing: border-box;" @click="selectDay(cell)">
              <text
                :class="['font-bold text-base', 
                  selectedDay.year === year && selectedDay.month === month && selectedDay.day === cell.day && cell.isCurrentMonth ? 'text-blue-600' : '',
                  cell.isToday ? 'today-text' : ''
                ]">{{
                cell.day }}</text>
              <!-- 小圆点，8px，绝对定位在数字下方 -->
              <view v-if="cell.strength && cell.isCurrentMonth" class="absolute left-1/2 -translate-x-1/2"
                style="top: 36px;">
                <view :class="[
                  'intensity-dot w-12 h-12 rounded-full',
                  cell.strength === 'easy' ? 'bg-green-500' : '',
                  cell.strength === 'medium' ? 'bg-yellow-400' : '',
                  cell.strength === 'hard' ? 'bg-red-500' : ''
                ]"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 图例 -->
    <view class="legend-card bg-white rounded-2xl shadow-lg mx-4 mt-6 p-4 flex items-center justify-center gap-8 relative">
      <div class="shimmer-bg"></div>
      <view class="flex items-center gap-2 legend-item">
        <view class="w-16 h-16 rounded-full bg-green-500 legend-circle" />
        <text class="text-green-600 font-bold">轻松</text>
      </view>
      <view class="flex items-center gap-2 legend-item">
        <view class="w-16 h-16 rounded-full bg-yellow-400 legend-circle" />
        <text class="text-yellow-600 font-bold">中等</text>
      </view>
      <view class="flex items-center gap-2 legend-item">
        <view class="w-16 h-16 rounded-full bg-red-500 legend-circle" />
        <text class="text-red-600 font-bold">高强度</text>
      </view>
    </view>
    
    <!-- 日期详情弹窗 -->
    <wd-popup v-model="showDetail" round position="bottom" :style="{ height: '30%' }" @click-overlay="showDetail = false">
      <view class="p-5">
        <view class="flex justify-between items-center mb-4">
          <text class="text-lg font-bold">{{detailDate}}</text>
          <wd-icon name="close" @click="showDetail = false"></wd-icon>
        </view>
        <view v-if="selectedRecord" class="record-details">
          <view class="flex items-center mb-3">
            <view class="detail-icon w-8 h-8 rounded-full mr-3" :class="[
              selectedRecord.intensity === 'easy' ? 'bg-green-500' : '',
              selectedRecord.intensity === 'medium' ? 'bg-yellow-400' : '',
              selectedRecord.intensity === 'hard' ? 'bg-red-500' : '',
            ]"></view>
            <text class="font-bold">{{getIntensityLabel(selectedRecord.intensity)}}</text>
          </view>
          <view class="flex justify-between mb-2 detail-item">
            <text class="text-gray-500">训练时长</text>
            <text class="font-bold">{{selectedRecord.duration}} 分钟</text>
          </view>
          <view class="flex justify-between detail-item">
            <text class="text-gray-500">消耗卡路里</text>
            <text class="font-bold text-green-600">{{selectedRecord.calorie}} 卡</text>
          </view>
        </view>
        <view v-else class="flex flex-col items-center justify-center py-6">
          <text class="i-mdi:calendar-blank text-6xl text-gray-200 mb-3 empty-icon"></text>
          <text class="text-gray-500">这一天还没有训练记录</text>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAllRecords, ClockInRecord, formatDate } from '@/utils/storage'

const weekList = ['日', '一', '二', '三', '四', '五', '六']
const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth()) // 0-based
const selectedDay = ref({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() })

// 训练数据
const records = ref<ClockInRecord[]>([])
const recordCount = computed(() => records.value.length)
const showDetail = ref(false)
const selectedRecord = ref<ClockInRecord | null>(null)
const detailDate = ref('')

// 获取所有记录
onMounted(() => {
  loadRecords()
})

// 页面显示时重新加载数据
onShow(() => {
  loadRecords()
})

function loadRecords() {
  records.value = getAllRecords()
}

function getIntensityLabel(intensity: string): string {
  switch (intensity) {
    case 'easy': return '轻松训练'
    case 'medium': return '中等强度'
    case 'hard': return '高强度训练'
    default: return '未知强度'
  }
}

// 根据日期获取强度
function getStrengthByDate(dateStr: string): string | null {
  const record = records.value.find(r => r.date === dateStr)
  return record ? record.intensity : null
}

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

function getFirstDayOfWeek(y: number, m: number) {
  return new Date(y, m, 1).getDay()
}

function isToday(date: { year: number, month: number, day: number }) {
  const now = new Date()
  return now.getFullYear() === date.year && 
         now.getMonth() === date.month && 
         now.getDate() === date.day
}

const calendarRows = computed(() => {
  const days = getDaysInMonth(year.value, month.value)
  const firstDay = getFirstDayOfWeek(year.value, month.value)
  const rows = []
  let row = []
  // 补前空
  for (let i = 0; i < firstDay; i++) row.push(null)
  for (let d = 1; d <= days; d++) {
    const dateStr = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    row.push({
      day: d,
      isCurrentMonth: true,
      strength: getStrengthByDate(dateStr),
      isToday: isToday({year: year.value, month: month.value, day: d})
    })
    if (row.length === 7) {
      rows.push(row)
      row = []
    }
  }
  // 补后空
  if (row.length) {
    while (row.length < 7) row.push(null)
    rows.push(row)
  }
  return rows
})

function prevMonth() {
  if (month.value === 0) {
    year.value--
    month.value = 11
  } else {
    month.value--
  }
}

function nextMonth() {
  if (month.value === 11) {
    year.value++
    month.value = 0
  } else {
    month.value++
  }
}

function selectDay(cell: any) {
  if (cell && cell.isCurrentMonth) {
    selectedDay.value = { 
      year: year.value, 
      month: month.value, 
      day: cell.day 
    }
    
    // 格式化日期并查找记录
    const date = new Date(year.value, month.value, cell.day)
    const dateStr = formatDate(date)
    detailDate.value = `${year.value}年${month.value + 1}月${cell.day}日`
    
    // 查找该日期的记录
    selectedRecord.value = records.value.find(r => r.date === dateStr) || null
    showDetail.value = true
  }
}
</script>
<style lang="scss" scoped>
.border_line {
  border: 1px solid;
}

.calendar-card {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.calendar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.legend-card {
  transition: all 0.3s ease;
  position: relative;
}

.legend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.legend-item {
  transition: all 0.3s ease;
}

.legend-item:hover {
  transform: scale(1.05);
}

.legend-circle {
  position: relative;
  transition: all 0.3s ease;
}

.legend-circle::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.legend-item:hover .legend-circle::after {
  opacity: 0.5;
}

.calendar-day {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.calendar-day:hover {
  transform: scale(1.05);
  z-index: 10;
}

.calendar-title {
  background: linear-gradient(90deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}

.week-day {
  font-weight: bold;
  transition: all 0.3s ease;
}

.intensity-dot {
  transition: all 0.3s ease;
  position: relative;
}

.intensity-dot::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255,255,255,0.5);
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.intensity-easy {
  background: linear-gradient(145deg, #e9f7ef, #e8f5e9);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.intensity-medium {
  background: linear-gradient(145deg, #fefce8, #fffde7);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.intensity-hard {
  background: linear-gradient(145deg, #fee2e2, #ffebee);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.selected {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.today-text {
  position: relative;
  color: #3b82f6;
}

.today-text::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #f3f4f6;
}

.nav-button:hover {
  background-color: #e5e7eb;
  transform: scale(1.1);
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

.animate-pulse {
  animation: pulse-opacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-opacity {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.record-details {
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-item {
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.detail-item:hover {
  background-color: #f9fafb;
}

.detail-icon {
  transition: all 0.3s ease;
}

.detail-icon:hover {
  transform: scale(1.1);
}

.empty-icon {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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
</style>