<template>
  <view class="bg-[#f6fbff] min-h-screen">

    <view class="pt-10 pb-4 flex flex-col items-center">
      <text class="text-base text-gray-400 mb-2">管理你的个人信息和设置</text>
    </view>

    <!-- 顶部渐变栏 -->
    <!-- <view class="w-full h-120 rounded-b-2xl flex items-center px-6" style="background: linear-gradient(90deg, #2193b0 0%, #25b96f 100%);">
      <text class="i-mdi:account-circle-outline text-2xl text-white mr-2" />
      <text class="text-xl font-bold text-white">个人信息</text>
    </view> -->

    <!-- 个人信息卡片 -->
    <view class="mx-4 bg-white rounded-2xl shadow-lg mt-8 p-4 flex items-center relative">
      <view class="relative">
        <view class="w-100 h-100 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
          羽
        </view>
        <view class="w-6 h-6 rounded-full bg-white flex items-center justify-center absolute right-0 bottom-2">
          <view class="w-4 h-4 rounded-full bg-green-400 border-2 border-white"></view>
        </view>
      </view>
      <view class="flex-1 ml-6">
        <view class="flex items-center mb-1">
          <template v-if="!editMode">
            <text class="text-xl font-bold text-gray-900">{{ nickname }}</text>
          </template>
          <template v-else>
            <input v-model="editNickname" class="border-b-2 border-blue-400 outline-none text-xl font-bold text-gray-900 bg-transparent px-1" maxlength="12" />
          </template>
        </view>
        <view class="flex items-center mb-1">
          <text class="i-mdi:calendar-blank-outline text-gray-400 mr-1" />
          <text class="text-xs text-gray-500">加入时间: 2025/7/5</text>
        </view>
        <view class="mt-1">
          <view class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-bold inline-block">活跃用户</view>
        </view>
      </view>
    </view>

    <!-- 本月训练目标卡片 -->
    <view class="mx-4 bg-gradient-to-br from-[#f6fff6] to-[#f6fbff] rounded-xl border border-blue-100 p-4 mb-4 mt-4 shadow">
      <view class="flex items-center mb-2">
        <text class="i-mdi:target-variant text-lg text-blue-500 mr-2" />
        <text class="font-bold text-base">本月训练目标</text>
      </view>
      <view class="flex justify-between items-center mb-1">
        <text class="text-xs text-gray-500">进度</text>
        <text class="text-xs text-gray-700 font-bold">0 / 20 天</text>
      </view>
      <view class="w-full h-2 bg-blue-50 rounded-full overflow-hidden mb-1">
        <view class="h-2 bg-blue-300 rounded-full" style="width: 0%"></view>
      </view>
      <view class="flex justify-between items-center">
        <text class="text-xs text-gray-500">完成率</text>
        <text class="text-xs text-blue-500 font-bold">0%</text>
      </view>
    </view>

    <!-- 编辑资料按钮 -->
    <view class="mx-4 mb-4">
      <button
        class="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold py-2 rounded-xl flex items-center justify-center shadow-md text-base"
        @click="onEdit"
        v-if="!editMode"
      >
        <text class="i-mdi:cog-outline text-base mr-2" />编辑资料
      </button>
      <view v-else class="flex gap-4">
        <button class="flex-1 bg-blue-500 text-white font-bold py-2 rounded-xl shadow-md" @click="onSave">保存</button>
        <button class="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-xl shadow-md" @click="onCancel">取消</button>
      </view>
    </view>

    <!-- 累计打卡/训练时长卡片 -->
    <view class="mx-4 grid grid-cols-2 gap-4">
      <view class="bg-blue-50 rounded-xl flex flex-col items-center justify-center py-6 shadow border border-blue-100">
        <text class="i-mdi:trophy-outline text-2xl text-blue-400 mb-2" />
        <text class="text-2xl font-extrabold text-blue-600">45</text>
        <text class="text-xs text-gray-500 mt-1">累计打卡</text>
      </view>
      <view class="bg-green-50 rounded-xl flex flex-col items-center justify-center py-6 shadow border border-green-100">
        <text class="i-mdi:clock-outline text-2xl text-green-400 mb-2" />
        <text class="text-2xl font-extrabold text-green-600">156h 156</text>
        <text class="text-lg font-bold text-green-600">小时</text>
        <text class="text-xs text-gray-500 mt-1">训练时长</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const nickname = ref('羽毛球爱好者')
const editMode = ref(false)
const editNickname = ref('羽毛球爱好者')
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
</script>
<style scoped lang="scss">
.bg-blue-50 { background-color: #e8f1ff; }
.bg-green-50 { background-color: #e8fdf3; }
</style>
