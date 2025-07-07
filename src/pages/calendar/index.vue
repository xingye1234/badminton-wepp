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
            ]" style="box-sizing: border-box;">
              <!-- @click="selectDay(cell)" -->
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const weekList = ['日', '一', '二', '三', '四', '五', '六']
const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth()) // 0-based
const selectedDay = ref({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() })

// 训练强度数据结构适配任意年月（可对接后端）
// key为'YYYY-MM-DD'，value为强度
const strengthMap: Record<string, string> = {
  '2025-05-10': 'easy',
  '2025-05-15': 'medium',
  '2025-05-20': 'hard',
  '2025-06-01': 'medium',
  '2025-06-09': 'hard',
  '2025-06-10': 'easy',
  '2025-06-15': 'hard',
  '2025-06-16': 'medium',
  '2025-06-17': 'hard',
  '2025-06-18': 'easy',
  '2025-06-19': 'medium',
  '2025-06-20': 'hard',
  '2025-06-21': 'medium',
  '2025-06-22': 'hard',
  '2025-06-29': 'medium',
  '2025-07-03': 'easy',
  '2025-07-04': 'medium',
  '2025-07-05': 'easy',
  '2025-07-06': 'hard',
}
const recordCount = computed(() => Object.keys(strengthMap).length)

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
      strength: strengthMap[dateStr] || null
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
// function selectDay(cell: any) {
//   if (cell && cell.isCurrentMonth) selectedDay.value = cell.day
// }
</script>
<style lang="scss" scoped>
.border_line {
  border: 1px solid;
}
</style>