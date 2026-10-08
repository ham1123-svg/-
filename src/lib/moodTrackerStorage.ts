import {
  MoodId,
  MoodLogEntry,
  MoodAnalyticsData,
  TrendDataPoint,
  MOOD_DEFINITIONS,
} from '../types/moodTracker';

const STORAGE_KEY = 'happywind_daily_mood_logs_v1';
const QUICK_POLL_STORAGE_KEY = 'happywind_quick_poll_voted';

// Format Date to YYYY-MM-DD in local time
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

// Generate realistic 30-day starter logs for rich, immediate visualization
export function generateSeedMoodLogs(): MoodLogEntry[] {
  const logs: MoodLogEntry[] = [];
  const today = new Date();

  // Pattern simulates a realistic emotional journey over 30 days
  const patterns: { daysAgo: number; moodId: MoodId; score: number; intensity: number; tags: string[]; note?: string }[] = [
    { daysAgo: 0, moodId: 'peaceful', score: 8, intensity: 8, tags: ['자기돌봄', '수면/휴식'], note: '차 한 잔과 함께 온전히 나에게 집중한 저녁.' },
    { daysAgo: 1, moodId: 'happy', score: 9, intensity: 9, tags: ['운동/산책', '대인관계'], note: '동료와 점심 후 가벼운 공원 산책, 기분 좋은 대화.' },
    { daysAgo: 2, moodId: 'tired', score: 4, intensity: 5, tags: ['직장/업무', '수면/휴식'], note: '프로젝트 마감으로 야근. 어깨가 무겁지만 잘 마쳤다.' },
    { daysAgo: 3, moodId: 'anxious', score: 3, intensity: 4, tags: ['직장/업무', '학업/시험'], note: '중요한 미팅 전 긴장감. 복식호흡으로 가라앉힘.' },
    { daysAgo: 4, moodId: 'confused', score: 5, intensity: 6, tags: ['대인관계', '가족/가정'], note: '가족과의 대화에서 서운함이 있었지만 한 걸음 물러서서 생각함.' },
    { daysAgo: 5, moodId: 'peaceful', score: 8, intensity: 8, tags: ['자기돌봄', '운동/산책'], note: '주말 아침 햇살과 스트레칭.' },
    { daysAgo: 6, moodId: 'happy', score: 9, intensity: 9, tags: ['수면/휴식', '가족/가정'], note: '푹 자고 일어나서 가족들과 맛있는 식사.' },
    { daysAgo: 7, moodId: 'peaceful', score: 7, intensity: 7, tags: ['자기돌봄'], note: '조용히 책 읽으며 보낸 일요일 오후.' },
    { daysAgo: 8, moodId: 'tired', score: 4, intensity: 5, tags: ['직장/업무'], note: '월요병과 함께 쌓인 이메일 처리.' },
    { daysAgo: 9, moodId: 'anxious', score: 4, intensity: 5, tags: ['직장/업무', '수면/휴식'], note: '일정 조율 스트레스. 밤에 잠들기 조금 어려웠음.' },
    { daysAgo: 10, moodId: 'confused', score: 6, intensity: 6, tags: ['학업/시험'], note: '방향성에 대해 고민이 많았던 수요일.' },
    { daysAgo: 11, moodId: 'peaceful', score: 8, intensity: 8, tags: ['대인관계', '식사/영양'], note: '오랜 친구와의 편안한 통화로 마음 환기.' },
    { daysAgo: 12, moodId: 'happy', score: 8, intensity: 8, tags: ['직장/업무', '운동/산책'], note: '작은 성취를 이뤄내고 퇴근길 가벼운 발걸음.' },
    { daysAgo: 13, moodId: 'happy', score: 9, intensity: 9, tags: ['자기돌봄', '수면/휴식'], note: '금요일 밤의 해방감과 감사한 하루.' },
    { daysAgo: 14, moodId: 'peaceful', score: 8, intensity: 8, tags: ['가족/가정', '자기돌봄'], note: '주말 청소 후 정돈된 방에서 느끼는 평온.' },
    { daysAgo: 15, moodId: 'heavy', score: 2, intensity: 4, tags: ['신체건강', '수면/휴식'], note: '환절기 감기 기운으로 온종일 가라앉음.' },
    { daysAgo: 16, moodId: 'tired', score: 4, intensity: 5, tags: ['신체건강'], note: '몸살 회복 중. 따뜻한 생강차 마시기.' },
    { daysAgo: 17, moodId: 'confused', score: 5, intensity: 6, tags: ['직장/업무'], note: '새로운 업무 분장으로 혼란스러웠던 하루.' },
    { daysAgo: 18, moodId: 'peaceful', score: 7, intensity: 7, tags: ['대인관계'], note: '차분하게 상황을 정리하고 마음 가다듬기.' },
    { daysAgo: 19, moodId: 'happy', score: 8, intensity: 8, tags: ['운동/산책', '자기돌봄'], note: '저녁 조깅 30분, 땀 흘리니 머리가 맑아짐.' },
    { daysAgo: 20, moodId: 'peaceful', score: 8, intensity: 8, tags: ['수면/휴식'], note: '일찍 잠자리에 들기 전 감사 일기 3줄 작성.' },
    { daysAgo: 21, moodId: 'happy', score: 9, intensity: 9, tags: ['가족/가정', '운동/산책'], note: '날씨가 좋아 근교 숲길 걷기.' },
    { daysAgo: 22, moodId: 'peaceful', score: 7, intensity: 7, tags: ['자기돌봄'], note: '마음의 여유를 되찾은 주말.' },
    { daysAgo: 23, moodId: 'tired', score: 4, intensity: 5, tags: ['직장/업무'], note: '월요일 출근, 피로감 누적.' },
    { daysAgo: 24, moodId: 'anxious', score: 3, intensity: 4, tags: ['직장/업무', '대인관계'], note: '부서 간 의견 차이로 긴장감 고조.' },
    { daysAgo: 25, moodId: 'confused', score: 5, intensity: 5, tags: ['자기돌봄'], note: '내 감정을 온전히 수용하려 노력함.' },
    { daysAgo: 26, moodId: 'peaceful', score: 7, intensity: 7, tags: ['수면/휴식'], note: '상담 칼럼 읽고 마음의 짐 조금 덜어냄.' },
    { daysAgo: 27, moodId: 'happy', score: 8, intensity: 8, tags: ['대인관계', '운동/산책'], note: '따뜻한 격려를 주고받은 하루.' },
    { daysAgo: 28, moodId: 'happy', score: 9, intensity: 9, tags: ['자기돌봄', '수면/휴식'], note: '스스로에게 건넨 칭찬 한마디.' },
    { daysAgo: 29, moodId: 'peaceful', score: 8, intensity: 8, tags: ['가족/가정'], note: '평화로운 한 달 전 기록의 시작.' },
  ];

  for (const item of patterns) {
    const d = new Date(today);
    d.setDate(d.getDate() - item.daysAgo);
    const dateStr = formatDateKey(d);

    logs.push({
      id: `seed-${dateStr}`,
      date: dateStr,
      time: '21:30',
      moodId: item.moodId,
      score: item.score,
      intensity: item.intensity,
      tags: item.tags,
      note: item.note,
      createdAt: new Date(d.setHours(21, 30, 0, 0)).toISOString(),
    });
  }

  return logs;
}

// Load logs from localStorage or initialize with seed data
export function getStoredMoodLogs(): MoodLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = generateSeedMoodLogs();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const seed = generateSeedMoodLogs();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return generateSeedMoodLogs();
  }
}

// Save or update mood entry
export function saveMoodLog(entry: Omit<MoodLogEntry, 'id' | 'createdAt'> & { id?: string }): MoodLogEntry {
  const currentLogs = getStoredMoodLogs();
  const dateKey = entry.date;
  const existingIndex = currentLogs.findIndex((log) => log.date === dateKey);

  const fullEntry: MoodLogEntry = {
    id: entry.id || `mood-${dateKey}-${Date.now()}`,
    date: dateKey,
    time: entry.time || new Date().toTimeString().slice(0, 5),
    moodId: entry.moodId,
    score: entry.score,
    intensity: entry.intensity,
    tags: entry.tags,
    note: entry.note,
    createdAt: new Date().toISOString(),
  };

  let updatedLogs: MoodLogEntry[];
  if (existingIndex >= 0) {
    updatedLogs = [...currentLogs];
    updatedLogs[existingIndex] = fullEntry;
  } else {
    updatedLogs = [fullEntry, ...currentLogs];
  }

  // Sort newest first
  updatedLogs.sort((a, b) => b.date.localeCompare(a.date));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    // Also sync today's vote with MentalHealthQuickPoll if the entry is for today
    const todayStr = formatDateKey(new Date());
    if (dateKey === todayStr) {
      localStorage.setItem(QUICK_POLL_STORAGE_KEY, fullEntry.moodId);
    }
  } catch (err) {
    console.error('Failed to save mood log to localStorage:', err);
  }

  // Async push to server backend for database persistence
  fetch('/api/mood/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fullEntry),
  }).catch(() => {});

  return fullEntry;
}

// Delete log entry
export function deleteMoodLog(dateStr: string): void {
  const currentLogs = getStoredMoodLogs();
  const filtered = currentLogs.filter((log) => log.date !== dateStr);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete mood log:', err);
  }

  fetch(`/api/mood/log/${dateStr}`, { method: 'DELETE' }).catch(() => {});
}

// Calculate weekly and monthly analytics
export function calculateMoodAnalytics(
  logs: MoodLogEntry[],
  period: 'weekly' | 'monthly' = 'weekly'
): MoodAnalyticsData {
  const totalDays = period === 'weekly' ? 7 : 30;
  const today = new Date();

  // Create lookup map by date
  const logMap = new Map<string, MoodLogEntry>();
  logs.forEach((log) => logMap.set(log.date, log));

  const trendPoints: TrendDataPoint[] = [];
  const distribution: Record<MoodId, number> = {
    peaceful: 0,
    happy: 0,
    tired: 0,
    anxious: 0,
    heavy: 0,
    confused: 0,
  };

  const tagCounts: Record<string, number> = {};
  let totalScore = 0;
  let recordedDays = 0;
  const scoreList: number[] = [];

  // Generate continuous timeline for past N days (oldest to newest for charts)
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const dayName = formatDayOfWeek(dateStr);
    const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
    const dayLabel = `${dayName}(${shortDate})`;

    const log = logMap.get(dateStr);
    if (log) {
      recordedDays++;
      totalScore += log.score;
      scoreList.push(log.score);
      distribution[log.moodId] = (distribution[log.moodId] || 0) + 1;

      if (log.tags) {
        log.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }

      const moodConfig = MOOD_DEFINITIONS[log.moodId];
      trendPoints.push({
        date: dateStr,
        dayLabel,
        shortDate,
        score: log.score,
        moodId: log.moodId,
        emoji: moodConfig.emoji,
        shortLabel: moodConfig.shortLabel,
        color: moodConfig.color,
        tags: log.tags || [],
        note: log.note,
      });
    } else {
      // Missing day: interpolate or default
      const defaultScore = 6;
      trendPoints.push({
        date: dateStr,
        dayLabel,
        shortDate,
        score: defaultScore,
        moodId: 'peaceful',
        emoji: '🌿',
        shortLabel: '미기록',
        color: '#9CA3AF',
        tags: [],
        note: undefined,
      });
    }
  }

  const averageScore = recordedDays > 0 ? Number((totalScore / recordedDays).toFixed(1)) : 7.0;

  // Previous period comparison (e.g. days [totalDays*2 - 1] to totalDays)
  let prevTotalScore = 0;
  let prevRecordedDays = 0;
  for (let i = totalDays * 2 - 1; i >= totalDays; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const log = logMap.get(dateStr);
    if (log) {
      prevRecordedDays++;
      prevTotalScore += log.score;
    }
  }
  const prevAvg = prevRecordedDays > 0 ? prevTotalScore / prevRecordedDays : averageScore - 0.4;
  const scoreDifference = Number((averageScore - prevAvg).toFixed(1));

  // Stability Index: Variance-based formula (100 - standard deviation * 15)
  let stabilityIndex = 80;
  if (scoreList.length >= 2) {
    const variance =
      scoreList.reduce((acc, val) => acc + Math.pow(val - averageScore, 2), 0) / scoreList.length;
    const stdDev = Math.sqrt(variance);
    stabilityIndex = Math.min(98, Math.max(45, Math.round(100 - stdDev * 16)));
  }

  // Consecutive streak days
  let streakDays = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    if (logMap.has(dateStr)) {
      streakDays++;
    } else {
      break;
    }
  }

  // Dominant emotion
  let dominantMood: MoodId = 'peaceful';
  let maxCount = -1;
  const distributionPercentages: Record<MoodId, number> = {
    peaceful: 0,
    happy: 0,
    tired: 0,
    anxious: 0,
    heavy: 0,
    confused: 0,
  };

  const totalEmotionsRecorded = Object.values(distribution).reduce((a, b) => a + b, 0);
  for (const [key, count] of Object.entries(distribution)) {
    const moodKey = key as MoodId;
    if (count > maxCount) {
      maxCount = count;
      dominantMood = moodKey;
    }
    distributionPercentages[moodKey] =
      totalEmotionsRecorded > 0 ? Math.round((count / totalEmotionsRecorded) * 100) : 0;
  }

  const dominantPercentage =
    totalEmotionsRecorded > 0 ? Math.round((maxCount / totalEmotionsRecorded) * 100) : 0;

  // Top tags sorted
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Clinical Psychological Insight Report (by Dr. Park Mi-kyeong)
  let resilienceLevel: '높음 (안정 회복)' | '양호 (자기 조절 중)' | '주의 (휴식 필요)' | '집중 케어 (전문 상담 권장)' = '양호 (자기 조절 중)';
  let summary = '';
  let detailedAnalysis = '';
  let recommendedAction = '';

  const negativeMoodsCount =
    distribution.tired + distribution.anxious + distribution.heavy;
  const positiveMoodsCount = distribution.peaceful + distribution.happy;

  if (averageScore >= 7.5 && positiveMoodsCount >= negativeMoodsCount * 1.5) {
    resilienceLevel = '높음 (안정 회복)';
    summary = `${period === 'weekly' ? '이번 주' : '이번 달'} 전반적으로 긍정적이고 평온한 마음 밸런스를 훌륭하게 유지하고 계십니다.`;
    detailedAnalysis = `평균 감정 지수 ${averageScore}점, 안정도 ${stabilityIndex}%로 내면의 정서적 완충력이 매우 탄탄합니다. 특히 '${MOOD_DEFINITIONS[dominantMood].shortLabel}' 감정이 주를 이루며, 스트레스 요인이 발생해도 빠르게 평정심으로 복귀하는 회복 탄력성(Resilience)이 돋보입니다.`;
    recommendedAction = `현재의 건강한 수면과 자기돌봄 루틴을 계속 지켜나가세요. 주변의 소중한 사람들과 이 따뜻한 온기를 나누시는 것도 추천합니다.`;
  } else if (averageScore >= 5.5) {
    resilienceLevel = '양호 (자기 조절 중)';
    summary = `주중 업무와 대인관계 속에서 자연스러운 감정 기복이 있었으나, 자기 조절력이 잘 작동하고 있습니다.`;
    detailedAnalysis = `평균 점수는 ${averageScore}점이며, 피로·긴장 후 휴식을 통해 감정을 회복하는 패턴이 관찰됩니다. 상위 영향 요인으로 [${topTags.map((t) => t.tag).join(', ') || '일상 스트레스'}]이(가) 나타났습니다.`;
    recommendedAction = `퇴근 후 스마트폰을 내려놓고 15분간 가벼운 산책이나 4-4-6 복식호흡을 통해 긴장된 신체를 이완해 주세요.`;
  } else if (averageScore >= 4.0) {
    resilienceLevel = '주의 (휴식 필요)';
    summary = `지속적인 피로와 긴장 상태가 누적되어 있어, 심리적 배터리 충전이 절실히 필요한 시기입니다.`;
    detailedAnalysis = `피로·번아웃과 불안 감정의 비율이 다소 높게 관찰됩니다(부정 정서 빈도 ${negativeMoodsCount}회). 일상의 스트레스 자극이 연속적으로 이어져 뇌의 편도체가 과열되어 있을 가능성이 높습니다.`;
    recommendedAction = `주말 동안 일체의 업무 연락을 차단하고 충분한 수면을 취하세요. 심리 간이 자가진단을 통해 번아웃 척도를 점검해 보시길 권장합니다.`;
  } else {
    resilienceLevel = '집중 케어 (전문 상담 권장)';
    summary = `마음의 무거움과 우울감이 길어지고 있습니다. 혼자 버티지 마시고 따뜻한 도움의 손길을 잡아주세요.`;
    detailedAnalysis = `감정 지수가 ${averageScore}점으로 저하되어 있으며, 마음의 에너지가 고갈된 상태입니다. 감정의 터널 속에서는 객관적 시야를 확보하기 어려우므로 전문가의 온전한 지지와 공감이 큰 힘이 됩니다.`;
    recommendedAction = `국민건강보험 진료코드 미등록으로 100% 비밀이 보장되는 연구소의 1:1 심층 상담 예약을 적극 고려해 보세요.`;
  }

  return {
    period,
    totalDays,
    recordedDays,
    averageScore,
    scoreDifference,
    stabilityIndex,
    streakDays,
    dominantMood,
    dominantPercentage,
    distribution,
    distributionPercentages,
    trendPoints,
    topTags,
    clinicalInsight: {
      summary,
      detailedAnalysis,
      recommendedAction,
      resilienceLevel,
    },
  };
}
