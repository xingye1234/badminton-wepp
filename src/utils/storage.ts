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

// 存储键名
const STORAGE_KEYS = {
  RECORDS: 'badminton_training_records',
  MONTHLY_TARGET: 'badminton_monthly_target'
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