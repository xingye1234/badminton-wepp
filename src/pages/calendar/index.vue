<template>
  <view class="bg-[#f6fbff] min-h-screen">
    <!-- 顶部标题区 -->
    <view class="pt-8 pb-2 flex flex-col items-center">
      <text class="text-base text-gray-500 mt-2">查看你的训练记录和进度</text>
      <view class="flex items-center mt-1">
        <view class="w-10 h-10 rounded-full bg-green-400 mr-1" />
        <text class="text-xs text-gray-400">共 {{ recordCount }} 条记录</text>
      </view>
    </view>

    <!-- 日历卡片 -->
    <view class="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
      <view class="flex items-center justify-between mb-8">
        <wd-icon name="arrow-left" size="22px" @click="prevMonth"></wd-icon>
        <view class="flex-1 flex justify-center">
          <text class="text-xl font-bold text-center">{{ year }}年 {{ month + 1 }}月</text>
        </view>
        <wd-icon name="arrow-right" size="22px" @click="nextMonth"></wd-icon>
      </view>
      <view class="grid grid-cols-7 text-center text-gray-400 mb-2">
        <text v-for="w in weekList" :key="w">{{ w }}</text>
      </view>
      <view>
        <view v-for="(row, rIdx) in calendarRows" :key="rIdx" class="grid grid-cols-7 mb-1 gap-2">
          <view v-for="(cell, cIdx) in row" :key="cIdx" class="flex items-center justify-center h-96">
            <view v-if="cell" :class="[
              'w-96 h-78 flex flex-col items-center justify-center relative transition-all duration-200 rounded-lg',
              cell.strength === 'easy' && cell.isCurrentMonth ? 'bg-[#e8f5e9]  ring-green-200 ring-2' : '',
              cell.strength === 'medium' && cell.isCurrentMonth ? 'bg-[#fffde7]  ring-yellow-200 ring-2' : '',
              cell.strength === 'hard' && cell.isCurrentMonth ? 'bg-[#ffebee]  ring-red-200 ring-2' : '',
              selectedDay.year === year && selectedDay.month === month && selectedDay.day === cell.day && cell.isCurrentMonth ? ' bg-blue-100' : '',
              !cell.isCurrentMonth ? 'text-gray-300' : ''
            ]" style="box-sizing: border-box;" @click="selectDay(cell)">
              <text
                :class="['font-bold text-base', selectedDay.year === year && selectedDay.month === month && selectedDay.day === cell.day && cell.isCurrentMonth ? 'text-blue-600' : 'text-black']">{{
                cell.day }}</text>
              <!-- 小圆点，8px，绝对定位在数字下方 -->
              <view v-if="cell.strength && cell.isCurrentMonth" class="absolute left-1/2 -translate-x-1/2"
                style="top: 36px;">
                <view :class="[
                  'w-12 h-12 rounded-full',
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
    <view class="bg-white rounded-2xl shadow mx-4 mt-6 p-4 flex items-center justify-center gap-8">
      <view class="flex items-center gap-2">
        <view class="w-16 h-16 rounded-full bg-green-500" /><text class="text-green-500 font-bold">轻松</text>
      </view>
      <view class="flex items-center gap-2">
        <view class="w-16 h-16 rounded-full bg-yellow-400" /><text class="text-yellow-400 font-bold">中等</text>
      </view>
      <view class="flex items-center gap-2">
        <view class="w-16 h-16 rounded-full bg-red-500" /><text class="text-red-500 font-bold">高强度</text>
      </view>
    </view>
    
    <!-- 日期详情弹窗 -->
    <wd-popup v-model="showDetail" round position="bottom" :style="{ height: '30%' }" @click-overlay="showDetail = false">
      <view class="p-5">
        <view class="flex justify-between items-center mb-4">
          <text class="text-lg font-bold">{{detailDate}}</text>
          <wd-icon name="close" @click="showDetail = false"></wd-icon>
        </view>
        <view v-if="selectedRecord">
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
        <view v-else class="flex flex-col items-center justify-center py-6">
          <text class="i-mdi:calendar-blank text-6xl text-gray-200 mb-3"></text>
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
      strength: getStrengthByDate(dateStr)
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

function isToday(y: number, m: number) {
  const now = new Date()
  return now.getFullYear() === y && now.getMonth() === m
}

function prevMonth() {
  if (month.value === 0) {
    year.value--
    month.value = 11
  } else {
    month.value--
  }
  if (isToday(year.value, month.value)) {
    selectedDay.value = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
  }
}

function nextMonth() {
  if (month.value === 11) {
    year.value++
    month.value = 0
  } else {
    month.value++
  }
  if (isToday(year.value, month.value)) {
    selectedDay.value = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }
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
</style>