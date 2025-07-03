<template>
  <view
    v-if="show"
    class="fixed left-0 top-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in-out"
  >
    <view
      class="bg-white rounded-2xl px-8 py-6 flex flex-col items-center shadow-lg animate-bounce-in"
    >
      <text class="text-6xl mb-2">🎉</text>
      <text class="font-bold text-xl my-2">里程碑达成！</text>
      <text class="text-lg font-bold text-blue-600">{{
        getMilestoneMessage(percentage)
      }}</text>
      <text class="text-green-600 text-xl my-2 font-bold">{{ percentage }}%</text>
      <text class="text-sm">继续保持你做的很棒！</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { watch, defineProps, defineEmits } from "vue";

const props = defineProps<{
  show: boolean;
  percentage: number;
}>();
const emits = defineEmits(["update:show"]);

const getMilestoneMessage = (milestone: number) => {
  switch (milestone) {
    case 25:
      return "🎉 太棒了！完成了四分之一的目标！";
    case 50:
      return "🔥 amazing！已经完成一半啦！";
    case 75:
      return "💪 incredible！只差最后一步了！";
    case 100:
      return "🏆 恭喜！本月目标完美达成！";
    default:
      return "🎊 里程碑达成！";
  }
};

// 可选：自动关闭逻辑（父组件可选用v-model:show）
watch(
  () => props.show,
  (val) => {
    if (val) {
      setTimeout(() => {
        emits("update:show", false);
      }, 1500);
    }
  }
);
</script>

<style lang="scss" scoped>
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.animate-fade-in-out {
  animation: fade-in-out 1.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.7);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.animate-bounce-in {
  animation: bounce-in 0.5s;
}
</style>
