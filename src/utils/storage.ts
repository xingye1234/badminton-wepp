// 打卡记录数据接口
export interface ClockInRecord {
  date: string; // 日期，格式为YYYY-MM-DD
  duration: number; // 训练时长（分钟）
  intensity: 'easy' | 'medium' | 'hard'; // 训练强度
  calorie: number; // 消耗的卡路里
}

// 训练统计接口
export interface TrainingStats {
  totalDays: number;
  totalDuration: number;
  totalCalorie: number;
  easyDays: number;
  mediumDays: number;
  hardDays: number;
  easyDuration: number;
  mediumDuration: number;
  hardDuration: number;
  streak: number; // 连续训练天数
  maxStreak: number; // 最长连续训练天数
}

// AI教练建议接口
export interface CoachAdvice {
  date: string; // 日期，格式为YYYY-MM-DD
  message: string; // 教练主要建议
  trainingTips: string[]; // 训练建议列表
  dietTip: string; // 饮食建议
}

// 存储键名
const STORAGE_KEYS = {
  RECORDS: 'badminton_training_records',
  MONTHLY_TARGET: 'badminton_monthly_target',
  COACH_ADVICE: 'badminton_coach_advice'
};

// 获取所有打卡记录
export function getAllRecords(): ClockInRecord[] {
  const recordsStr = uni.getStorageSync(STORAGE_KEYS.RECORDS);
  return recordsStr ? JSON.parse(recordsStr) : [];
}

// 保存打卡记录
export function saveClockInRecord(record: ClockInRecord): void {
  const records = getAllRecords();
  
  // 检查是否已经存在同一天的记录，如果有则替换
  const index = records.findIndex(r => r.date === record.date);
  
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  
  // 根据日期排序
  records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  uni.setStorageSync(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

// 获取指定日期的打卡记录
export function getRecordByDate(date: string): ClockInRecord | null {
  const records = getAllRecords();
  const record = records.find(r => r.date === date);
  return record || null;
}

// 获取指定月份的打卡记录
export function getRecordsByMonth(year: number, month: number): ClockInRecord[] {
  const records = getAllRecords();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  return records.filter(record => record.date.startsWith(monthPrefix));
}

// 获取当前月份的统计数据
export function getCurrentMonthStats(): TrainingStats {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  return getMonthStats(year, month);
}

// 获取指定月份的统计数据
export function getMonthStats(year: number, month: number): TrainingStats {
  const records = getRecordsByMonth(year, month);
  
  const stats: TrainingStats = {
    totalDays: records.length,
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
  };
  
  // 统计各类数据
  records.forEach(record => {
    stats.totalDuration += record.duration;
    stats.totalCalorie += record.calorie;
    
    if (record.intensity === 'easy') {
      stats.easyDays++;
      stats.easyDuration += record.duration;
    } else if (record.intensity === 'medium') {
      stats.mediumDays++;
      stats.mediumDuration += record.duration;
    } else if (record.intensity === 'hard') {
      stats.hardDays++;
      stats.hardDuration += record.duration;
    }
  });
  
  // 计算连续训练天数
  const allRecords = getAllRecords();
  let currentStreak = 0;
  let maxStreak = 0;
  
  if (allRecords.length > 0) {
    // 按日期排序（从新到旧）
    allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let prevDate = today;
    
    for (const record of allRecords) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      
      // 计算日期差
      const diffTime = prevDate.getTime() - recordDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      // 如果是连续的日期或者是今天的记录
      if (diffDays === 1 || (currentStreak === 0 && diffDays === 0)) {
        currentStreak++;
      } else if (diffDays > 1) {
        // 连续中断
        break;
      }
      
      prevDate = recordDate;
    }
    
    // 计算历史最长连续打卡记录
    let tempStreak = 1;
    for (let i = 1; i < allRecords.length; i++) {
      const curr = new Date(allRecords[i].date);
      const prev = new Date(allRecords[i - 1].date);
      
      const diffTime = prev.getTime() - curr.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, tempStreak);
  }
  
  stats.streak = currentStreak;
  stats.maxStreak = maxStreak;
  
  return stats;
}

// 设置每月目标训练天数
export function setMonthlyTarget(days: number): void {
  uni.setStorageSync(STORAGE_KEYS.MONTHLY_TARGET, days);
}

// 获取每月目标训练天数
export function getMonthlyTarget(): number {
  const target = uni.getStorageSync(STORAGE_KEYS.MONTHLY_TARGET);
  return target || 20; // 默认20天
}

// 生成当前日期字符串 (YYYY-MM-DD)
export function getTodayString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化日期对象为字符串 (YYYY-MM-DD)
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
} 

// ----- AI教练建议相关功能 -----

// 获取所有AI教练建议
export function getAllCoachAdvice(): CoachAdvice[] {
  const adviceStr = uni.getStorageSync(STORAGE_KEYS.COACH_ADVICE);
  return adviceStr ? JSON.parse(adviceStr) : [];
}

// 保存AI教练建议
export function saveCoachAdvice(advice: CoachAdvice): void {
  const allAdvice = getAllCoachAdvice();
  
  // 检查是否已经存在同一天的建议，如果有则替换
  const index = allAdvice.findIndex(a => a.date === advice.date);
  
  if (index >= 0) {
    allAdvice[index] = advice;
  } else {
    allAdvice.push(advice);
  }
  
  // 根据日期排序
  allAdvice.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  uni.setStorageSync(STORAGE_KEYS.COACH_ADVICE, JSON.stringify(allAdvice));
}

// 获取指定日期的AI教练建议
export function getAdviceByDate(date: string): CoachAdvice | null {
  const allAdvice = getAllCoachAdvice();
  const advice = allAdvice.find(a => a.date === date);
  return advice || null;
}

// 随机生成AI教练建议
export function generateRandomAdvice(date: string): CoachAdvice {
  // 基础建议消息库
  const baseMessages = [
    "根据你最近的训练数据分析，你的正手击球力量有所提升，但反手技巧还需加强。建议今天侧重反手训练。",
    "我注意到你近期的步法移动速度略有下降，建议强化脚步训练，提高场地覆盖能力。",
    "你的网前技术表现出色，但后场高远球仍需改进。今天可以多安排后场击球练习。",
    "分析显示你在长时间对抗后体能下降明显，建议增强有氧训练和耐力练习。",
    "你的击球准确性有提升空间，今天可以专注于控球练习和精准落点训练。",
    "数据显示你的手腕力量比平均水平低10%，多进行手腕力量训练可以提升击球威力。",
    "你的扑球和勾对技术进步显著，但杀球力量仍需加强，建议今日加入力量训练。",
    "近期你的平抽球成功率较高，但高远球质量偏低，建议今天练习高质量高远球技术。",
    "你在比赛中的前三拍处理能力很强，但中后段表现不稳定，建议加强耐力和战术训练。",
    "分析表明你的发球质量有待提升，建议今天专注于多种发球技术的练习。"
  ];
  
  // 训练建议库
  const trainingTipsPool = [
    "正手高远球练习", "反手高远球练习", "网前技巧训练", "步法移动训练", 
    "杀球力量练习", "勾对球技巧", "发球多样性训练", "平抽球练习",
    "手腕力量训练", "前场放网练习", "后场吊球训练", "对角线移动训练",
    "多拍连续击球练习", "防守反攻转换训练", "扑球技术练习", "搓球控制训练",
    "上肢力量训练", "下肢爆发力训练", "核心肌群强化", "耐力提升训练",
    "反应速度训练", "平衡性训练", "假动作训练", "比赛战术演练"
  ];
  
  // 饮食建议库
  const dietTips = [
    "训练前: 香蕉或能量棒提供快速能量；训练后: 蛋白质饮料帮助肌肉恢复，搭配全谷物碳水。",
    "今日饮食建议：保持充足水分摄入，适量碳水化合物提供能量，补充瘦蛋白和深色蔬菜。",
    "训练日营养重点：适量摄入优质蛋白质，如鸡胸肉、鱼和豆类，确保肌肉恢复。",
    "今日营养提醒：保证充足蔬果摄入，补充维生素和抗氧化物，促进身体恢复。",
    "赛前饮食：富含碳水化合物的食物，如燕麦、糙米、全麦面包，提供持久能量。",
    "恢复期饮食：富含镁的食物（如坚果、菠菜）可以帮助肌肉放松，减轻疲劳。",
    "今日注意：训练结束后30分钟内补充蛋白质和碳水，黄金恢复期不要错过。",
    "高强度训练日：确保足够电解质摄入，香蕉、椰子水或电解质饮料是良好选择。",
    "休息日饮食：适当减少碳水摄入，保持蛋白质摄入，多吃蔬菜水果。",
    "今日饮食建议：避免油腻食物，选择清淡易消化的餐食，保证训练质量。"
  ];

  // 随机选择主要建议消息
  const randomMessage = baseMessages[Math.floor(Math.random() * baseMessages.length)];
  
  // 随机选择3-4个训练建议
  const shuffledTips = trainingTipsPool.sort(() => 0.5 - Math.random());
  const selectedTips = shuffledTips.slice(0, Math.floor(Math.random() * 2) + 3); // 3-4个
  
  // 随机选择一条饮食建议
  const randomDietTip = dietTips[Math.floor(Math.random() * dietTips.length)];
  
  return {
    date,
    message: randomMessage,
    trainingTips: selectedTips,
    dietTip: randomDietTip
  };
}

// 生成一个月的随机AI教练建议
export function generateMonthlyAdvice(): CoachAdvice[] {
  const advice: CoachAdvice[] = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // 确定当月天数
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // 生成当月每天的建议
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = formatDate(date);
    
    // 生成随机建议
    advice.push(generateRandomAdvice(dateStr));
  }
  
  return advice;
}

// 保存一个月的AI教练建议
export function saveMonthlyAdvice(): void {
  const monthlyAdvice = generateMonthlyAdvice();
  uni.setStorageSync(STORAGE_KEYS.COACH_ADVICE, JSON.stringify(monthlyAdvice));
}

// 获取今日AI教练建议，如果不存在则生成
export function getTodayAdvice(): CoachAdvice {
  const todayStr = getTodayString();
  let advice = getAdviceByDate(todayStr);
  
  // 如果今日建议不存在，则生成并保存
  if (!advice) {
    advice = generateRandomAdvice(todayStr);
    saveCoachAdvice(advice);
  }
  
  return advice;
} 