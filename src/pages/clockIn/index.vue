<template>
  <view class="bg-[#f6fbff] min-h-screen pb-12">
    <!-- 训练时长 -->
    <view class="bg-white rounded-2xl mx-4 p-6 mb-4 shadow flex flex-col">
      <view class="flex items-center mb-2">
        <text class="i-mdi:clock-outline text-lg text-blue-500 mr-2" />
        <text class="text-base font-bold">训练时长</text>
      </view>
      <view class="text-center my-2">
        <text class="text-4xl font-bold text-blue-600">{{ duration }}</text>
        <text class="block text-gray-400 mt-1">分钟</text>
      </view>
      <wd-slider
        v-model="duration"
        :min="15"
        :max="240"
        :step="5"
        active-color="#2563eb"
        inactive-color="#e5e7eb"
        hide-label
        class="my-2"
      />
      <view class="flex justify-between text-xs text-gray-400 mt-1">
        <text>15分钟</text>
        <text>240分钟</text>
      </view>
    </view>

    <!-- 训练强度 -->
    <view class="bg-white rounded-2xl mx-4 p-6 mb-4 shadow flex flex-col">
      <view class="flex items-center mb-2">
        <text class="i-mdi:flash-outline text-lg text-orange-500 mr-2" />
        <text class="text-base font-bold">训练强度</text>
      </view>
      <view class="flex flex-col gap-3 mt-2">
        <view
          v-for="item in intensityList"
          :key="item.value"
          :class="[
            'flex items-center justify-between p-4 rounded-xl transition-all duration-200',
            selectedIntensity === item.value
              ? 'ring-blue-600 bg-[#f3f8ff] ring-2'
              : 'ring-gray-200 bg-white ring-2',
          ]"
          @click="selectedIntensity = item.value"
        >
          <view class="flex items-center">
            <view
              :class="[
                'w-20 h-20 rounded-full mr-3',
                item.dot,
                'flex-shrink-0',
              ]"
            />
            <view>
              <text class="text-base font-bold">{{ item.label }}</text>
              <text class="block text-xs text-gray-400 mt-1">{{
                item.desc
              }}</text>
            </view>
          </view>
          <view
            v-if="selectedIntensity === item.value"
            class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 font-bold"
            >已选择</view
          >
        </view>
      </view>
    </view>

    <!-- 预估消耗 -->
    <view
      class="bg-gradient-to-r from-[#e8f5e9] to-[#e3f2fd] rounded-2xl mx-4 p-6 mb-6 flex flex-col items-center"
    >
      <view class="flex items-center mb-2">
        <text class="i-mdi:target text-lg text-green-600 mr-2" />
        <text class="text-base font-bold">预估消耗</text>
      </view>
      <text class="text-3xl font-bold text-green-600"
        >{{ estimateCalorie }} 卡路里</text
      >
    </view>

    <!-- 完成按钮 -->
    <view
      class="fixed left-0 bottom-0 w-full z-50 pb-safe flex justify-center items-center"
      style="pointer-events: none"
    >
      <button
        class="w-[90%] py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white text-lg font-bold mt-2 shadow-lg mb-safe"
        style="pointer-events: auto"
        @click="handleSubmit"
      >
        完成打卡
      </button>
    </view>
  </view>
  <wd-toast />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from 'wot-design-uni';

const toast = useToast();
const duration = ref(60);
const selectedIntensity = ref("medium");
const intensityList = [
  {
    value: "easy",
    label: "轻松",
    desc: "热身或恢复训练",
    dot: "bg-green-500",
  },
  {
    value: "medium",
    label: "中等",
    desc: "常规训练强度",
    dot: "bg-yellow-400",
  },
  {
    value: "hard",
    label: "高强度",
    desc: "挑战性训练",
    dot: "bg-red-500",
  },
];

const estimateCalorie = computed(() => {
  // 简单估算公式：基础值*时长*强度系数
  const base = 4; // 每分钟基础消耗
  const factor =
    selectedIntensity.value === "easy"
      ? 1
      : selectedIntensity.value === "medium"
      ? 1.25
      : 1.5;
  return Math.round(duration.value * base * factor);
});

function handleSubmit() {
  // 假设有校验逻辑，演示成功和失败
  if (duration.value < 15) {
    toast.error('打卡失败，时长不能小于15分钟');
    return;
  }
  toast.success('打卡成功');
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<wd-toast />
