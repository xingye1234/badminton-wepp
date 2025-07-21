<template>
  <app-layout>
    <view
      class="bg-gradient h-screen"
      :class="[showIntensityHelp ? 'overflow-hidden' : '']"
    >
      <!-- 训练时长 -->
      <view
        class="card-container bg-white rounded-2xl mx-4 p-6 mb-4 flex flex-col"
      >
        <div class="shimmer-bg"></div>
        <view class="flex items-center mb-2">
          <text class="i-mdi:clock-outline text-lg text-blue-500 mr-2" />
          <text class="text-base font-bold">训练时长</text>
        </view>
        <view class="text-center my-2">
          <text class="text-4xl font-bold text-blue-600 animate-bounce-in">{{
            duration
          }}</text>
          <text class="block text-gray-400 mt-1">分钟</text>
        </view>
        <view class="slider-container my-2">
          <wd-slider
            v-model="duration"
            :min="15"
            :max="240"
            :step="5"
            active-color="#2563eb"
            inactive-color="#e5e7eb"
            hide-label
            class="z-10 relative"
          />
        </view>
        <view class="flex justify-between text-xs text-gray-400 mt-1">
          <text>15分钟</text>
          <text>240分钟</text>
        </view>
      </view>

      <!-- 训练强度 -->
      <view
        class="card-container bg-white rounded-2xl mx-4 p-6 mb-4 flex flex-col"
      >
        <div class="shimmer-bg"></div>
        <view class="flex items-center mb-2 justify-between">
          <view class="flex items-center">
            <text class="i-mdi:flash-outline text-lg text-orange-500 mr-2" />
            <text class="text-base font-bold">训练强度</text>
          </view>
          <view @click="showIntensityHelp = true">
            <wd-icon name="help" size="22px"></wd-icon>
          </view>
        </view>
        <view class="flex flex-col gap-3 mt-2">
          <view
            v-for="item in intensityList"
            :key="item.value"
            :class="[
              'intensity-card flex items-center justify-between p-4 rounded-xl transition-all duration-200',
              selectedIntensity === item.value
                ? 'ring-blue-600 bg-[#f3f8ff] ring-2 active'
                : 'ring-gray-200 bg-white ring-2',
            ]"
            @click="selectedIntensity = item.value"
          >
            <view class="flex items-center">
              <view
                :class="[
                  'intensity-dot w-20 h-20 rounded-full mr-3 flex-shrink-0',
                  item.dot,
                  selectedIntensity === item.value ? 'active' : '',
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
              class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 font-bold animate-bounce-in"
              >已选择</view
            >
          </view>
        </view>
      </view>

      <!-- 体重设置已改为弹窗形式 -->

      <!-- 预估消耗 -->
      <view class="calorie-card rounded-2xl mx-4 p-6 mb-6 relative">
        <div class="shimmer-bg"></div>
        <view class="flex items-center justify-between mb-2 z-10 relative">
          <view class="flex items-center">
            <text class="i-mdi:target text-lg text-green-600 mr-2" />
            <text class="text-base font-bold">预估消耗</text>
          </view>
          <view
            class="weight-toggle-btn px-2 py-1 rounded-full"
            @click="showWeightInput = true"
          >
            <text class="text-xs">体重设置</text>
          </view>
        </view>
        <view class="flex items-center flex-col z-10 relative">
          <text class="text-3xl font-bold text-green-600"
            >{{ estimateCalorie }} 卡路里</text
          >
          <text class="text-xs text-gray-500 mt-1"
            >基于{{ weight }}kg体重 · {{ currentMets }}METs强度计算</text
          >
        </view>
      </view>
    </view>
  </app-layout>
  
  <!-- 完成按钮 -->
  <view
    class="fixed-bottom-btn left-0 bottom-0 w-full z-50 flex justify-center items-center bg-white py-4 pb-safe shadow-lg-up"
    :class="{ 'opacity-0': showIntensityHelp }"
  >
    <button
      class="w-[90%] py-3 rounded-xl text-white text-lg font-bold shadow-lg submit-button"
      @click="handleSubmit"
    >
      <text class="i-mdi:check-circle text-xl mr-2 z-10 relative"></text>
      <text class="z-10 relative">完成打卡</text>
    </button>
  </view>
  
  <wd-toast />
  <!-- 体重设置弹窗 -->
  <wd-popup
    v-model="showWeightInput"
    round
    position="bottom"
    :style="{ height: '45%' }"
  >
    <view class="p-5 flex flex-col h-full">
      <view class="flex justify-between items-center mb-4">
        <view class="flex items-center">
          <text class="i-mdi:scale text-lg text-purple-500 mr-2" />
          <text class="text-xl font-bold">体重设置</text>
        </view>
        <wd-icon name="close" @click="showWeightInput = false"></wd-icon>
      </view>
      
      <!-- 体重显示 -->
      <view class="text-center my-5">
        <text class="text-4xl font-bold text-purple-600">{{ weight }}kg</text>
      </view>
      
      <!-- 滑块 -->
      <view class="my-4">
        <wd-slider
          v-model="weight"
          :min="30"
          :max="150"
          :step="1"
          active-color="#9333ea"
          inactive-color="#e5e7eb"
          hide-label
          class="z-10 relative"
        />
        <view class="flex justify-between text-xs text-gray-400 mt-2">
          <text>30kg</text>
          <text>150kg</text>
        </view>
      </view>
      
      <view class="text-center text-xs text-gray-500 my-3">
        用于更准确计算消耗的卡路里
      </view>
      
      <!-- 确认按钮 -->
      <button
        class="py-3 px-10 mt-auto rounded-lg bg-purple-500 text-white text-base font-bold weight-confirm-button"
        @click="saveWeight"
      >
        确认
      </button>
      <view class="h-40"/>
    </view>
  </wd-popup>
  
  <!-- 训练强度说明弹窗 -->
  <wd-popup
    v-model="showIntensityHelp"
    round
    position="bottom"
    :style="{ height: '60%' }"
  >
    <view class="p-5 flex flex-col h-full">
      <view class="flex justify-between items-center mb-4">
        <text class="text-xl font-bold">训练强度说明</text>
        <wd-icon name="close" @click="showIntensityHelp = false"></wd-icon>
      </view>

      <scroll-view scroll-y class="flex-1 overflow-auto">
        <view class="mb-6">
          <view class="flex items-center mb-2">
            <view
              class="w-16 h-16 rounded-full bg-green-500 flex-shrink-0 mr-3"
            ></view>
            <text class="text-lg font-bold text-green-700">轻松训练</text>
          </view>
          <text class="text-sm text-gray-600 block mb-2"
            >轻松训练主要为低强度活动，适合热身、技术练习或恢复性训练。</text
          >
          <view class="bg-gray-50 p-3 rounded-lg">
            <text class="text-xs text-gray-500 block mb-1">• 基础步法练习</text>
            <text class="text-xs text-gray-500 block mb-1"
              >• 基本击球技术练习</text
            >
            <text class="text-xs text-gray-500 block mb-1"
              >• 休闲放松性对打</text
            >
            <text class="text-xs text-gray-500 block">• 拉伸恢复训练</text>
          </view>
        </view>

        <view class="mb-6">
          <view class="flex items-center mb-2">
            <view
              class="w-16 h-16 rounded-full bg-yellow-400 flex-shrink-0 mr-3"
            ></view>
            <text class="text-lg font-bold text-yellow-700">中等强度</text>
          </view>
          <text class="text-sm text-gray-600 block mb-2"
            >中等强度训练是日常训练的主要强度，有一定运动量但不会过度疲劳。</text
          >
          <view class="bg-gray-50 p-3 rounded-lg">
            <text class="text-xs text-gray-500 block mb-1">• 常规对打训练</text>
            <text class="text-xs text-gray-500 block mb-1"
              >• 技战术组合练习</text
            >
            <text class="text-xs text-gray-500 block mb-1">• 半场单打训练</text>
            <text class="text-xs text-gray-500 block"
              >• 多球训练（中等速度）</text
            >
          </view>
        </view>

        <view class="mb-2">
          <view class="flex items-center mb-2">
            <view
              class="w-16 h-16 rounded-full bg-red-500 flex-shrink-0 mr-3"
            ></view>
            <text class="text-lg font-bold text-red-700">高强度训练</text>
          </view>
          <text class="text-sm text-gray-600 block mb-2"
            >高强度训练是挑战性训练，需要全力以赴，会有明显的疲劳感。</text
          >
          <view class="bg-gray-50 p-3 rounded-lg">
            <text class="text-xs text-gray-500 block mb-1"
              >• 比赛或模拟比赛</text
            >
            <text class="text-xs text-gray-500 block mb-1">• 高速多球训练</text>
            <text class="text-xs text-gray-500 block mb-1">• 专项体能训练</text>
            <text class="text-xs text-gray-500 block">• 全场移动训练</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useToast } from "wot-design-uni";
import AppLayout from "@/components/AppLayout.vue";
import {
  saveClockInRecord,
  getRecordByDate,
  getTodayString,
} from "@/utils/storage";

const toast = useToast();
const duration = ref(60);
const selectedIntensity = ref("medium");
// 默认体重(kg)
const weight = ref(60);
// 是否显示体重输入框
const showWeightInput = ref(false);
// 是否显示训练强度说明弹窗
const showIntensityHelp = ref(false);

const intensityList = [
  {
    value: "easy",
    label: "轻松",
    desc: "热身或恢复训练",
    dot: "bg-green-500",
    mets: 4.5, // 轻松强度的METs值
  },
  {
    value: "medium",
    label: "中等",
    desc: "常规训练强度",
    dot: "bg-yellow-400",
    mets: 7.0, // 中等强度的METs值
  },
  {
    value: "hard",
    label: "高强度",
    desc: "挑战性训练",
    dot: "bg-red-500",
    mets: 9.0, // 高强度的METs值
  },
];

// 检查是否已经有今天的记录
onMounted(() => {
  const todayRecord = getRecordByDate(getTodayString());
  if (todayRecord) {
    duration.value = todayRecord.duration;
    selectedIntensity.value = todayRecord.intensity;
  }

  // 从本地存储读取用户体重设置
  const savedWeight = uni.getStorageSync("user_weight");
  if (savedWeight) {
    weight.value = savedWeight;
  }
});

// 获取当前选择强度的METs值
const currentMets = computed(() => {
  const intensity = intensityList.find(
    (item) => item.value === selectedIntensity.value
  );
  return intensity ? intensity.mets : 7.0;
});

// 判断是否有弹窗正在显示
const showPopup = computed(() => {
  // 现在仅用于内部逻辑，按钮显示单独控制
  return showIntensityHelp.value;
});

// 卡路里计算公式：卡路里 = METs值 × 体重(kg) × 时长(小时)
const estimateCalorie = computed(() => {
  // 将时长转换为小时
  const hours = duration.value / 60;
  // 使用公式：卡路里 = METs值 × 体重(kg) × 时长(小时)
  const calories = currentMets.value * weight.value * hours;
  return Math.round(calories);
});

// 保存用户体重设置
function saveWeight() {
  if (weight.value < 30 || weight.value > 150) {
    toast.error("请输入有效的体重（30-150kg）");
    return;
  }

  uni.setStorageSync("user_weight", weight.value);
  showWeightInput.value = false;
  toast.success("体重设置已保存");
}

function handleSubmit() {
  // 校验时长
  if (duration.value < 15) {
    toast.error("打卡失败，时长不能小于15分钟");
    return;
  }

  // 保存打卡数据
  const record = {
    date: getTodayString(),
    duration: duration.value,
    intensity: selectedIntensity.value as "easy" | "medium" | "hard",
    calorie: estimateCalorie.value,
  };

  saveClockInRecord(record);
  toast.success("打卡成功");

  setTimeout(() => {
    uni.navigateBack();
  }, 1000);
}
</script>

<style lang="scss" scoped>
.slider-container {
  position: relative;
}

.slider-container::after {
  content: "";
  position: absolute;
  top: calc(50% - 10px);
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  animation: slider-wave 2s linear infinite;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

@keyframes slider-wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.intensity-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.intensity-card.active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  animation: intensity-pulse 1.5s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes intensity-pulse {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

.intensity-card:hover {
  transform: translateY(-3px);
}

.intensity-dot {
  transition: transform 0.3s ease;
  position: relative;
}

// .intensity-dot::after {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   border-radius: 50%;
//   box-shadow: 0 0 10px currentColor;
//   opacity: 0.5;
//   z-index: -1;
// }

.intensity-dot.active {
  transform: scale(1.1);
}

.card-container {
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  z-index: 1;
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

.weight-toggle-btn {
  position: relative;
  overflow: hidden;
  background: #fff;
  color: #4b5563;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.weight-toggle-btn.active {
  background: #8b5cf6;
  color: #fff;
  box-shadow: 0 2px 5px rgba(139, 92, 246, 0.3);
}

.weight-toggle-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  animation: button-shine 2s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes button-shine {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

.submit-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #10b981, #f59e0b);
  transition: all 0.3s ease;
}

.submit-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  transform: translateX(-100%);
  animation: submit-shine 3s infinite;
  z-index: 0;
}

@keyframes submit-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.submit-button:active {
  transform: scale(0.98);
}

.bg-gradient {
  background: linear-gradient(135deg, #ebf5ff, #f0fffc);
}

.calorie-card {
  background: linear-gradient(135deg, #dcfce7, #dbeafe);
  position: relative;
  overflow: hidden;
}

/* 固定底部按钮的样式 */
.fixed-bottom-btn {
  transition: opacity 0.3s ease;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

/* 体重设置卡片样式 */
.weight-card {
  animation: fade-in 0.3s ease;
  position: relative;
  z-index: 5;
}

.weight-confirm-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #8b5cf6, #c084fc);
  transition: all 0.3s ease;
}

.weight-confirm-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  transform: translateX(-100%);
  animation: submit-shine 3s infinite;
  z-index: 0;
}

.weight-confirm-button:active {
  transform: scale(0.98);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
