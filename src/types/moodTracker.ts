export type MoodId = 'peaceful' | 'happy' | 'tired' | 'anxious' | 'heavy' | 'confused';

export interface MoodConfig {
  id: MoodId;
  emoji: string;
  label: string;
  shortLabel: string;
  defaultScore: number; // 1 to 10
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}

export const MOOD_DEFINITIONS: Record<MoodId, MoodConfig> = {
  peaceful: {
    id: 'peaceful',
    emoji: '🌿',
    label: '평온하고 안정돼요',
    shortLabel: '평온함',
    defaultScore: 8,
    color: '#10B981',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-700',
    gradientFrom: '#10B981',
    gradientTo: '#34D399',
    description: '마음이 고요하고 평온한 상태',
  },
  happy: {
    id: 'happy',
    emoji: '☀️',
    label: '활기차고 기분 좋아요',
    shortLabel: '활기참',
    defaultScore: 9,
    color: '#F59E0B',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-700',
    gradientFrom: '#F59E0B',
    gradientTo: '#FCD34D',
    description: '긍정적인 에너지와 성취감이 넘치는 상태',
  },
  tired: {
    id: 'tired',
    emoji: '🌧️',
    label: '지치고 번아웃 상태예요',
    shortLabel: '피로·번아웃',
    defaultScore: 4,
    color: '#64748B',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-700',
    gradientFrom: '#64748B',
    gradientTo: '#94A3B8',
    description: '에너지가 방전되어 온전한 쉼이 필요한 상태',
  },
  anxious: {
    id: 'anxious',
    emoji: '⚡',
    label: '불안하고 가슴이 뛰어요',
    shortLabel: '불안·긴장',
    defaultScore: 3,
    color: '#F97316',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-300',
    textClass: 'text-orange-700',
    gradientFrom: '#F97316',
    gradientTo: '#FDBA74',
    description: '과도한 긴장과 스트레스로 가슴이 두근거리는 상태',
  },
  heavy: {
    id: 'heavy',
    emoji: '☁️',
    label: '마음이 무겁고 울적해요',
    shortLabel: '우울·무거움',
    defaultScore: 2,
    color: '#3B82F6',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-300',
    textClass: 'text-blue-700',
    gradientFrom: '#3B82F6',
    gradientTo: '#93C5FD',
    description: '의욕이 저하되고 마음 한구석이 쓸쓸한 상태',
  },
  confused: {
    id: 'confused',
    emoji: '🌪️',
    label: '생각이 많고 복잡해요',
    shortLabel: '복잡함',
    defaultScore: 5,
    color: '#8B5CF6',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-300',
    textClass: 'text-purple-700',
    gradientFrom: '#8B5CF6',
    gradientTo: '#C4B5FD',
    description: '선택의 기로에서 머릿속 생각이 안개처럼 뒤엉킨 상태',
  },
};

export interface MoodLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  moodId: MoodId;
  score: number; // 1 to 10
  intensity: number; // 1 to 10
  tags: string[];
  note?: string;
  createdAt: string;
}

export interface TrendDataPoint {
  date: string;
  dayLabel: string;
  shortDate: string;
  score: number;
  moodId: MoodId;
  emoji: string;
  shortLabel: string;
  color: string;
  tags: string[];
  note?: string;
}

export interface MoodAnalyticsData {
  period: 'weekly' | 'monthly';
  totalDays: number;
  recordedDays: number;
  averageScore: number;
  scoreDifference: number; // compared to previous week/month
  stabilityIndex: number; // 0 to 100 (%)
  streakDays: number;
  dominantMood: MoodId;
  dominantPercentage: number;
  distribution: Record<MoodId, number>;
  distributionPercentages: Record<MoodId, number>;
  trendPoints: TrendDataPoint[];
  topTags: { tag: string; count: number }[];
  clinicalInsight: {
    summary: string;
    detailedAnalysis: string;
    recommendedAction: string;
    resilienceLevel: '높음 (안정 회복)' | '양호 (자기 조절 중)' | '주의 (휴식 필요)' | '집중 케어 (전문 상담 권장)';
  };
}

export const MOOD_TAG_OPTIONS = [
  '수면/휴식',
  '직장/업무',
  '대인관계',
  '가족/가정',
  '신체건강',
  '학업/시험',
  '자기돌봄',
  '운동/산책',
  '식사/영양',
  '감정표현',
];
