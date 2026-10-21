import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Heart,
  Plus,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Activity,
  Smile,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Award,
  Layers,
  Check,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ReferenceArea,
  Legend
} from 'recharts';
import {
  MoodId,
  MoodLogEntry,
  MOOD_DEFINITIONS,
  MOOD_TAG_OPTIONS,
  MoodAnalyticsData,
  TrendDataPoint,
} from '../types/moodTracker';
import {
  getStoredMoodLogs,
  saveMoodLog,
  deleteMoodLog,
  calculateMoodAnalytics,
  formatDateKey,
  formatDayOfWeek,
} from '../lib/moodTrackerStorage';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

interface DailyMoodTrackerDashboardProps {
  className?: string;
  defaultPeriod?: 'weekly' | 'monthly';
  onLogUpdated?: () => void;
}

export default function DailyMoodTrackerDashboard({
  className,
  defaultPeriod = 'weekly',
  onLogUpdated,
}: DailyMoodTrackerDashboardProps) {
  const { isHighContrast } = useHighContrast();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>(defaultPeriod);
  const [logs, setLogs] = useState<MoodLogEntry[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<TrendDataPoint | null>(null);
  const [selectedDayDetail, setSelectedDayDetail] = useState<MoodLogEntry | null>(null);
  
  // Modal state for recording/editing mood
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>(formatDateKey(new Date()));
  const [modalMoodId, setModalMoodId] = useState<MoodId>('peaceful');
  const [modalScore, setModalScore] = useState<number>(8);
  const [modalIntensity, setModalIntensity] = useState<number>(8);
  const [modalTags, setModalTags] = useState<string[]>(['수면/휴식', '자기돌봄']);
  const [modalNote, setModalNote] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Recharts interactive display options
  const [chartMetric, setChartMetric] = useState<'score' | 'both'>('score');
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showAverageLine, setShowAverageLine] = useState<boolean>(true);

  // Load logs on mount
  useEffect(() => {
    refreshLogs();
  }, []);

  const refreshLogs = () => {
    const data = getStoredMoodLogs();
    setLogs(data);
    if (onLogUpdated) {
      onLogUpdated();
    }
  };

  // Calculate analytics based on current period and logs
  const analytics: MoodAnalyticsData = useMemo(() => {
    return calculateMoodAnalytics(logs, period);
  }, [logs, period]);

  // Handle open modal for new or existing entry
  const handleOpenAddModal = (targetDate?: string) => {
    const dateToUse = targetDate || formatDateKey(new Date());
    setModalDate(dateToUse);

    // If entry exists for this date, prefill
    const existing = logs.find((l) => l.date === dateToUse);
    if (existing) {
      setModalMoodId(existing.moodId);
      setModalScore(existing.score);
      setModalIntensity(existing.intensity);
      setModalTags(existing.tags || []);
      setModalNote(existing.note || '');
    } else {
      setModalMoodId('peaceful');
      setModalScore(8);
      setModalIntensity(8);
      setModalTags(['수면/휴식']);
      setModalNote('');
    }

    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    saveMoodLog({
      date: modalDate,
      moodId: modalMoodId,
      score: modalScore,
      intensity: modalIntensity,
      tags: modalTags,
      note: modalNote.trim() ? modalNote.trim() : undefined,
    });

    setIsModalOpen(false);
    refreshLogs();
  };

  const handleDeleteLog = (date: string) => {
    if (window.confirm(`${date}의 감정 기록을 삭제하시겠습니까?`)) {
      deleteMoodLog(date);
      refreshLogs();
      setSelectedDayDetail(null);
    }
  };

  const toggleTag = (tag: string) => {
    if (modalTags.includes(tag)) {
      setModalTags(modalTags.filter((t) => t !== tag));
    } else {
      setModalTags([...modalTags, tag]);
    }
  };

  // Copy clinical summary report to clipboard
  const handleCopyReport = () => {
    const text = `[행복바람 심리상담연구소 - 데일리 무드 트래커 분석 리포트]
기간: ${period === 'weekly' ? '최근 7일(주간)' : '최근 30일(월간)'}
평균 감정 지수: ${analytics.averageScore} / 10점 (안정도: ${analytics.stabilityIndex}%)
지배적 감정: ${MOOD_DEFINITIONS[analytics.dominantMood].shortLabel} (${analytics.dominantPercentage}%)
회복 탄력성 평가: ${analytics.clinicalInsight.resilienceLevel}
임상 분석: ${analytics.clinicalInsight.summary}
권장 케어: ${analytics.clinicalInsight.recommendedAction}
자세히 보기: https://www.hbbr.kr/self-diagnosis`;

    navigator.clipboard.writeText(text);
    setCopiedNotification('분석 리포트가 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Prepared data for Recharts Line/Area Chart
  const chartData = useMemo(() => {
    return analytics.trendPoints.map((pt) => ({
      ...pt,
      scoreValue: pt.score,
      intensityValue: pt.intensity ?? pt.score,
    }));
  }, [analytics.trendPoints]);

  // Derived Trend Highlights (Peak Day, Valley Day, High Stability Ratio)
  const { peakDay, valleyDay, highMoodRatio } = useMemo(() => {
    const recorded = analytics.trendPoints.filter((p) => p.isRecorded);
    if (recorded.length === 0) {
      return { peakDay: null, valleyDay: null, highMoodRatio: 0 };
    }

    let peak = recorded[0];
    let valley = recorded[0];
    let highCount = 0;

    recorded.forEach((p) => {
      if (p.score > peak.score) peak = p;
      if (p.score < valley.score) valley = p;
      if (p.score >= 7) highCount++;
    });

    const highRatio = Math.round((highCount / recorded.length) * 100);
    return { peakDay: peak, valleyDay: valley, highMoodRatio: highRatio };
  }, [analytics.trendPoints]);

  // Recharts Custom Tooltip Component
  const CustomRechartsTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data: TrendDataPoint = payload[0].payload;
      if (!data) return null;
      const moodConfig = MOOD_DEFINITIONS[data.moodId] || MOOD_DEFINITIONS.peaceful;
      const isRecorded = data.isRecorded;

      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-brand-green/30 text-xs font-serif min-w-[220px] max-w-xs space-y-2.5 z-50">
          <div className="flex items-center justify-between gap-2 border-b border-brand-green/20 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{data.emoji}</span>
              <div>
                <span className="font-bold text-brand-brown text-sm">
                  {data.date}
                </span>
                <span className="text-brand-brown/60 ml-1 text-[11px]">
                  ({formatDayOfWeek(data.date)})
                </span>
              </div>
            </div>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                isRecorded
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              )}
            >
              {isRecorded ? '기록 완료' : '미기록'}
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-brand-brown/70">감정 상태:</span>
              <span className="font-bold text-brand-brown flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                  style={{ backgroundColor: isRecorded ? moodConfig.color : '#9CA3AF' }}
                />
                {data.shortLabel}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-brand-brown/70">기분 점수:</span>
              <span className="font-bold text-brand-sage font-mono text-sm">
                {data.score} / 10점
              </span>
            </div>

            {chartMetric === 'both' && (
              <div className="flex items-center justify-between">
                <span className="text-brand-brown/70">감정 강도:</span>
                <span className="font-bold text-orange-600 font-mono text-sm">
                  {data.intensity ?? data.score} / 10점
                </span>
              </div>
            )}

            {data.tags && data.tags.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-1">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-md bg-brand-beige text-[10px] text-brand-brown/80 border border-brand-green/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {data.note && (
              <div className="p-2 rounded-lg bg-brand-green/10 text-brand-brown/90 italic text-[11px] leading-relaxed border border-brand-green/20">
                "{data.note}"
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-brand-green/15 flex items-center justify-between text-[11px] text-brand-sage font-bold">
            <span>클릭하여 기록 수정</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      );
    }
    return null;
  };

  // Recharts Custom Dot for Line Chart
  const renderCustomDot = (dotProps: any) => {
    const { cx, cy, payload } = dotProps;
    if (cx === undefined || cy === undefined || !payload) return null;
    const isSelected = activeTooltip?.date === payload.date;
    const moodConfig = MOOD_DEFINITIONS[payload.moodId as MoodId] || MOOD_DEFINITIONS.peaceful;
    const isRecorded = payload.isRecorded;
    const hasNote = Boolean(payload.note);

    return (
      <g
        key={`dot-${payload.date}`}
        className="cursor-pointer group"
        onClick={() => {
          setActiveTooltip(payload);
          handleOpenAddModal(payload.date);
        }}
      >
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={14}
            fill={moodConfig.color}
            fillOpacity={0.25}
            className="animate-ping"
          />
        )}

        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 7 : isRecorded ? 5.5 : 4}
          fill={isRecorded ? '#FFFFFF' : '#F3F4F6'}
          stroke={isRecorded ? moodConfig.color : '#9CA3AF'}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={isRecorded ? 'none' : '2 2'}
        />

        {isRecorded && (
          <circle
            cx={cx}
            cy={cy}
            r={2.5}
            fill={moodConfig.color}
          />
        )}

        {hasNote && (
          <circle
            cx={cx + 4.5}
            cy={cy - 4.5}
            r={2.5}
            fill="#E65100"
            stroke="#FFFFFF"
            strokeWidth={1}
          />
        )}

        {period === 'weekly' && isRecorded && (
          <text
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            fontSize="12"
            className="select-none pointer-events-none"
          >
            {payload.emoji}
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      id="mood-tracker-dashboard"
      className={cn(
        "rounded-3xl border border-brand-green/30 bg-white shadow-xl overflow-hidden transition-all",
        isHighContrast ? "bg-neutral-900 border-neutral-700 text-white" : "",
        className
      )}
    >
      {/* 1. Header Banner & View Controls */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-beige/50 via-white to-brand-green/20 border-b border-brand-green/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-serif font-bold mb-2 border border-brand-sage/20">
              <Activity className="w-3.5 h-3.5" />
              <span>정서 궤적 시각화 대시보드</span>
              <span className="text-brand-brown/30">·</span>
              <span>임상 심리 통계 분석</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown tracking-tight">
              나의 감정 변화 추이 <span className="text-brand-sage">대시보드</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-brown/70 font-serif mt-1">
              매일의 마음 날씨 기록을 바탕으로 주간 및 월간 감정 밸런스와 회복 탄력성 추이를 분석합니다.
            </p>
          </div>

          {/* Action Buttons: Period Switcher & Record Button */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Weekly / Monthly Toggle */}
            <div className="inline-flex p-1 rounded-2xl bg-brand-beige border border-brand-green/40 text-xs font-serif font-bold">
              <button
                type="button"
                onClick={() => setPeriod('weekly')}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer",
                  period === 'weekly'
                    ? "bg-brand-sage text-white shadow-xs"
                    : "text-brand-brown/70 hover:text-brand-brown"
                )}
              >
                주간 추이 (7일)
              </button>
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer",
                  period === 'monthly'
                    ? "bg-brand-sage text-white shadow-xs"
                    : "text-brand-brown/70 hover:text-brand-brown"
                )}
              >
                월간 추이 (30일)
              </button>
            </div>

            {/* Quick Add Log Button */}
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-brown hover:bg-brand-brown/90 text-brand-beige text-xs font-serif font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>오늘 감정 기록하기</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* 2. Top Metric Cards (4 KPI Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Average Emotional Score */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-beige/30 border border-brand-green/30 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[11px] sm:text-xs font-serif text-brand-brown/60 block mb-1">
                평균 감정 지수 ({period === 'weekly' ? '최근 7일' : '최근 30일'})
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
                  {analytics.averageScore}
                </span>
                <span className="text-xs text-brand-brown/50 font-serif">/ 10.0</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-brand-green/20 flex items-center gap-1 text-[11px] font-serif">
              {analytics.scoreDifference >= 0 ? (
                <span className="text-emerald-700 font-bold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
                  이전 대비 +{analytics.scoreDifference}점
                </span>
              ) : (
                <span className="text-orange-600 font-bold flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-0.5 inline" />
                  이전 대비 {analytics.scoreDifference}점
                </span>
              )}
              <span className="text-brand-brown/40">변화</span>
            </div>
          </div>

          {/* Card 2: Emotional Stability Index */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-beige/30 border border-brand-green/30 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[11px] sm:text-xs font-serif text-brand-brown/60 block mb-1">
                감정 안정도 (변동성 제어)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-brand-sage">
                  {analytics.stabilityIndex}%
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-brand-green/20 flex items-center gap-1.5 text-[11px] font-serif">
              <span className="w-2 h-2 rounded-full bg-brand-sage" />
              <span className="text-brand-brown/70 font-semibold">
                {analytics.stabilityIndex >= 80 ? '매우 안정적 균형' : analytics.stabilityIndex >= 65 ? '자연스러운 기복' : '기복 완화 돌봄 필요'}
              </span>
            </div>
          </div>

          {/* Card 3: Dominant Emotion */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-beige/30 border border-brand-green/30 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[11px] sm:text-xs font-serif text-brand-brown/60 block mb-1">
                가장 많이 느낀 감정
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">
                  {MOOD_DEFINITIONS[analytics.dominantMood].emoji}
                </span>
                <span className="text-base sm:text-lg font-serif font-bold text-brand-brown truncate">
                  {MOOD_DEFINITIONS[analytics.dominantMood].shortLabel}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-brand-green/20 text-[11px] font-serif text-brand-brown/70">
              전체 기록 중 <strong>{analytics.dominantPercentage}%</strong> 비중 차지
            </div>
          </div>

          {/* Card 4: Check-in Streak */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-beige/30 border border-brand-green/30 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[11px] sm:text-xs font-serif text-brand-brown/60 block mb-1">
                연속 마음 체크인
              </span>
              <div className="flex items-baseline gap-1.5">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">
                  {analytics.streakDays}일
                </span>
                <span className="text-xs text-brand-brown/50 font-serif">연속</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-brand-green/20 text-[11px] font-serif text-brand-brown/70">
              총 {analytics.recordedDays}일간의 정서 데이터 축적
            </div>
          </div>
        </div>

        {/* 3. Main Chart: Recharts Trend Line Graph Report */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white border border-brand-green/30 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage text-[11px] font-bold font-serif border border-brand-sage/20">
                  <TrendingUp className="w-3 h-3" />
                  Recharts 정서 분석 엔진
                </span>
                <span className="text-xs font-serif font-bold text-brand-brown/50">
                  {period === 'weekly' ? '주간 7일간 리포트' : '월간 30일간 리포트'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-brown flex items-center gap-2">
                <span>감정 밸런스 궤적 선 그래프 리포트</span>
              </h3>
              <p className="text-xs text-brand-brown/65 font-serif mt-0.5">
                일자별 감정 지수(1~10점) 및 강도의 변화 추이를 선 그래프로 한눈에 확인하고, 포인트 클릭 시 상세 내용을 수정할 수 있습니다.
              </p>
            </div>

            {/* Interactive Chart Options: Metric, Zones, Average */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-serif">
              {/* Metric Selector */}
              <div className="inline-flex p-1 rounded-xl bg-brand-beige/80 border border-brand-green/40">
                <button
                  type="button"
                  onClick={() => setChartMetric('score')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    chartMetric === 'score'
                      ? "bg-brand-sage text-white shadow-2xs"
                      : "text-brand-brown/70 hover:text-brand-brown"
                  )}
                >
                  기분 지수
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('both')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    chartMetric === 'both'
                      ? "bg-brand-sage text-white shadow-2xs"
                      : "text-brand-brown/70 hover:text-brand-brown"
                  )}
                >
                  지수 + 강도(듀얼)
                </button>
              </div>

              {/* Zone Guide Toggle */}
              <button
                type="button"
                onClick={() => setShowZones((prev) => !prev)}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold",
                  showZones
                    ? "bg-brand-green/20 border-brand-green/50 text-brand-sage"
                    : "bg-white border-brand-green/20 text-brand-brown/50 hover:bg-brand-beige/30"
                )}
                title="안정권/주의권 배경 색상 가이드 표시 토글"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>안정권 가이드</span>
              </button>

              {/* Average Line Toggle */}
              <button
                type="button"
                onClick={() => setShowAverageLine((prev) => !prev)}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold",
                  showAverageLine
                    ? "bg-brand-sage/10 border-brand-sage/40 text-brand-sage"
                    : "bg-white border-brand-green/20 text-brand-brown/50 hover:bg-brand-beige/30"
                )}
                title="기간 평균 점수 기준선 토글"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>평균선 ({analytics.averageScore}점)</span>
              </button>
            </div>
          </div>

          {/* Reference Zones Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-brand-green/15 text-[11px] font-serif text-brand-brown/70">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                <span className="font-semibold text-emerald-800">안정·평온권 (7~10점)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-2xs" />
                <span className="font-semibold text-amber-800">일상·보통권 (4~6점)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-2xs" />
                <span className="font-semibold text-blue-800">심리 케어권 (1~3점)</span>
              </span>
              {chartMetric === 'both' && (
                <span className="inline-flex items-center gap-1.5 text-orange-600 font-semibold">
                  <span className="w-3 h-0.5 bg-orange-500 inline-block border-b border-dashed" />
                  <span>감정 강도</span>
                </span>
              )}
            </div>

            <div className="text-[11px] text-brand-brown/50 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-brand-sage" />
              <span>그래프의 포인트를 클릭하면 해당 일자의 감정을 즉시 수정할 수 있습니다.</span>
            </div>
          </div>

          {/* Recharts Canvas Container */}
          <div className="w-full h-72 sm:h-80 pt-2 pb-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 18, left: -14, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const item = e.activePayload[0].payload as TrendDataPoint;
                    setActiveTooltip(item);
                  }
                }}
              >
                <defs>
                  <linearGradient id="rechartsMoodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A8B7B" stopOpacity={0.32} />
                    <stop offset="60%" stopColor="#2A8B7B" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#2A8B7B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#2A8B7B" strokeOpacity={0.12} strokeDasharray="3 3" vertical={false} />

                {/* Optional Reference Areas for Emotional Health Zones */}
                {showZones && (
                  <>
                    <ReferenceArea
                      y1={7}
                      y2={10}
                      fill="#10B981"
                      fillOpacity={0.05}
                      strokeOpacity={0}
                    />
                    <ReferenceArea
                      y1={4}
                      y2={7}
                      fill="#F59E0B"
                      fillOpacity={0.04}
                      strokeOpacity={0}
                    />
                    <ReferenceArea
                      y1={1}
                      y2={4}
                      fill="#3B82F6"
                      fillOpacity={0.04}
                      strokeOpacity={0}
                    />
                  </>
                )}

                {/* Average Score Reference Line */}
                {showAverageLine && (
                  <ReferenceLine
                    y={analytics.averageScore}
                    stroke="#2A8B7B"
                    strokeDasharray="4 4"
                    strokeWidth={1.6}
                    label={{
                      value: `평균 ${analytics.averageScore}점`,
                      position: 'insideTopRight',
                      fill: '#2A8B7B',
                      fontSize: 11,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                    }}
                  />
                )}

                <XAxis
                  dataKey={period === 'weekly' ? 'dayLabel' : 'shortDate'}
                  stroke="#3C271C"
                  strokeOpacity={0.4}
                  tick={{ fontSize: period === 'weekly' ? 11 : 9.5, fill: '#3C271C', fontFamily: 'serif' }}
                  tickLine={{ stroke: '#2A8B7B', strokeOpacity: 0.2 }}
                  interval={period === 'weekly' ? 0 : 2}
                />

                <YAxis
                  domain={[1, 10]}
                  ticks={[1, 4, 7, 10]}
                  stroke="#3C271C"
                  strokeOpacity={0.4}
                  tick={{ fontSize: 10, fill: '#3C271C', fontFamily: 'sans-serif' }}
                  tickLine={{ stroke: '#2A8B7B', strokeOpacity: 0.2 }}
                  tickFormatter={(val) => `${val}점`}
                />

                <RechartsTooltip content={<CustomRechartsTooltip />} />

                {/* Smooth Area Under Curve */}
                <Area
                  type="monotone"
                  dataKey="scoreValue"
                  stroke="none"
                  fill="url(#rechartsMoodGradient)"
                  isAnimationActive={true}
                />

                {/* Mood Score Primary Trend Line */}
                <Line
                  type="monotone"
                  dataKey="scoreValue"
                  name="기분 밸런스 지수"
                  stroke="#2A8B7B"
                  strokeWidth={3}
                  dot={renderCustomDot}
                  activeDot={{
                    r: 7,
                    stroke: '#2A8B7B',
                    strokeWidth: 3,
                    fill: '#FFFFFF',
                    className: 'animate-pulse',
                  }}
                  isAnimationActive={true}
                />

                {/* Optional Intensity Line */}
                {chartMetric === 'both' && (
                  <Line
                    type="monotone"
                    dataKey="intensityValue"
                    name="감정 강도"
                    stroke="#F97316"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#F97316', stroke: '#FFFFFF', strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: '#F97316' }}
                    isAnimationActive={true}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Hover / Selected Info Tooltip Banner */}
          <div className="p-3.5 rounded-2xl bg-brand-green/15 border border-brand-green/30 min-h-[58px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-serif">
            {activeTooltip ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xl">{activeTooltip.emoji}</span>
                <div>
                  <span className="font-bold text-brand-brown">
                    {activeTooltip.date} ({formatDayOfWeek(activeTooltip.date)}요일):
                  </span>{' '}
                  <span className="text-brand-sage font-extrabold">
                    {activeTooltip.shortLabel}
                  </span>{' '}
                  <span className="text-brand-brown/70 font-mono font-bold">
                    (지수 {activeTooltip.score}점)
                  </span>
                  {activeTooltip.note && (
                    <span className="ml-2 italic text-brand-brown/85 bg-white/90 px-2 py-0.5 rounded-md border border-brand-green/20">
                      "{activeTooltip.note}"
                    </span>
                  )}
                </div>
                {activeTooltip.tags && activeTooltip.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {activeTooltip.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded-md bg-white text-[10px] text-brand-sage border border-brand-green/30 font-sans"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-brand-brown/65 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-brand-sage" />
                <span>선 그래프의 데이터 포인트를 클릭하거나 마우스를 올리면 해당 일자의 상세 기록을 확인할 수 있습니다.</span>
              </div>
            )}

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleOpenAddModal(activeTooltip?.date)}
                className="text-brand-sage font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{activeTooltip ? '해당 일자 기록 수정' : '오늘 감정 추가'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Trend Report Highlights: Peak Day, Lowest Day, Stable Zone Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-brand-beige/40 border border-brand-green/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                {peakDay ? peakDay.emoji : '🌿'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-brand-brown/60 block font-serif">가장 편안했던 날 (Peak Day)</span>
                <p className="text-xs font-bold text-brand-brown truncate font-serif">
                  {peakDay ? `${peakDay.shortDate} (${peakDay.score}점, ${peakDay.shortLabel})` : '기록 필요'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-brand-beige/40 border border-brand-green/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-lg shrink-0">
                {valleyDay ? valleyDay.emoji : '🌧️'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-brand-brown/60 block font-serif">가장 주의 깊었던 날 (Valley Day)</span>
                <p className="text-xs font-bold text-brand-brown truncate font-serif">
                  {valleyDay ? `${valleyDay.shortDate} (${valleyDay.score}점, ${valleyDay.shortLabel})` : '기록 필요'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-brand-beige/40 border border-brand-green/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-bold font-mono text-xs">
                {highMoodRatio}%
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-brand-brown/60 block font-serif">안정권(7점 이상) 유지 비율</span>
                <p className="text-xs font-bold text-brand-sage font-serif">
                  {highMoodRatio >= 60 ? '안정적인 심리적 회복세' : '휴식과 재충전 추천'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Second Row: Emotion Distribution Breakdown & Daily Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Emotion Breakdown Stack & Proportion */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white border border-brand-green/30 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-brand-brown flex items-center gap-2 mb-1">
                <Smile className="w-4 h-4 text-brand-sage" />
                <span>감정 상태 구성 비율</span>
              </h3>
              <p className="text-xs text-brand-brown/60 font-serif mb-4">
                선택된 {period === 'weekly' ? '주간 7일' : '월간 30일'} 동안 느낀 6가지 감정 빈도 분포입니다.
              </p>

              {/* Stacked Percentage Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-brand-beige/50 border border-brand-green/20 mb-5 shadow-inner">
                {Object.entries(analytics.distributionPercentages).map(([moodKey, pct]) => {
                  if (pct === 0) return null;
                  const config = MOOD_DEFINITIONS[moodKey as MoodId];
                  return (
                    <div
                      key={moodKey}
                      style={{ width: `${pct}%`, backgroundColor: config.color }}
                      className="h-full relative group transition-all duration-300"
                      title={`${config.shortLabel}: ${pct}%`}
                    />
                  );
                })}
              </div>

              {/* List Breakdown Cards */}
              <div className="space-y-2">
                {Object.entries(MOOD_DEFINITIONS).map(([key, config]) => {
                  const count = analytics.distribution[key as MoodId] || 0;
                  const pct = analytics.distributionPercentages[key as MoodId] || 0;
                  const isDominant = analytics.dominantMood === key;

                  return (
                    <div
                      key={key}
                      className={cn(
                        "p-2.5 rounded-xl border flex items-center justify-between text-xs font-serif transition-all",
                        isDominant
                          ? "bg-brand-sage/5 border-brand-sage/40 ring-1 ring-brand-sage/30"
                          : "bg-white border-brand-green/20 hover:bg-brand-beige/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.emoji}</span>
                        <span className="font-bold text-brand-brown">
                          {config.shortLabel}
                        </span>
                        {isDominant && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-brand-sage text-white font-mono">
                            최다 빈도
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-brown/50 text-[11px]">
                          {count}일
                        </span>
                        <span className="font-mono font-bold text-brand-brown w-9 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Influencing Life Context Tags */}
            <div className="pt-3 border-t border-brand-green/20">
              <span className="text-[11px] font-serif font-bold text-brand-brown/70 block mb-2">
                주요 영향 요인 (상위 태그):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics.topTags.length > 0 ? (
                  analytics.topTags.map((item) => (
                    <span
                      key={item.tag}
                      className="px-2 py-1 rounded-lg bg-brand-beige text-brand-brown text-xs border border-brand-green/30 font-serif"
                    >
                      #{item.tag}{' '}
                      <strong className="text-brand-sage font-mono">
                        ({item.count}회)
                      </strong>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-brand-brown/40 font-serif">
                    기록된 태그가 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Daily Mood Matrix Calendar Grid */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white border border-brand-green/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-brand-brown flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-sage" />
                  <span>일자별 감정 히트맵 매트릭스</span>
                </h3>
                <p className="text-xs text-brand-brown/60 font-serif mt-0.5">
                  날짜 타일을 클릭하여 해당 일자의 감정을 즉시 확인하거나 수정할 수 있습니다.
                </p>
              </div>

              <span className="text-xs text-brand-sage font-bold font-serif">
                {analytics.recordedDays} / {analytics.totalDays}일 완료
              </span>
            </div>

            {/* Matrix Tile Grid */}
            <div
              className={cn(
                "grid gap-2 select-none",
                period === 'weekly'
                  ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-7"
                  : "grid-cols-3 sm:grid-cols-5 md:grid-cols-6"
              )}
            >
              {analytics.trendPoints.map((pt) => {
                const isSelected = selectedDayDetail?.date === pt.date;
                const moodConfig = MOOD_DEFINITIONS[pt.moodId];
                const isToday = pt.date === formatDateKey(new Date());

                return (
                  <motion.button
                    key={pt.date}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const found = logs.find((l) => l.date === pt.date);
                      if (found) {
                        setSelectedDayDetail(found);
                      } else {
                        handleOpenAddModal(pt.date);
                      }
                    }}
                    className={cn(
                      "p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative",
                      isSelected
                        ? "ring-2 ring-brand-sage border-brand-sage shadow-md bg-brand-green/20"
                        : "border-brand-green/25 hover:border-brand-sage/60 bg-white hover:bg-brand-beige/30",
                      isToday ? "border-amber-400/80 ring-1 ring-amber-300/40" : ""
                    )}
                  >
                    {isToday && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-sans font-bold shadow-2xs">
                        오늘
                      </span>
                    )}

                    <span className="text-[10px] font-serif text-brand-brown/60 font-medium mb-1">
                      {pt.dayLabel}
                    </span>

                    <span className="text-2xl my-1">{pt.emoji}</span>

                    <span className="text-[11px] font-serif font-bold text-brand-brown truncate max-w-full">
                      {pt.shortLabel}
                    </span>

                    <span
                      className="text-[10px] font-mono font-bold mt-1 px-1.5 py-0.2 rounded-md"
                      style={{
                        backgroundColor: `${moodConfig.color}20`,
                        color: moodConfig.color,
                      }}
                    >
                      {pt.score}점
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Selected Day Expanded Detail Card (If any clicked) */}
            <AnimatePresence>
              {selectedDayDetail && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-4 rounded-2xl bg-brand-beige/50 border border-brand-green/40 text-xs font-serif space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {MOOD_DEFINITIONS[selectedDayDetail.moodId].emoji}
                      </span>
                      <div>
                        <span className="font-bold text-brand-brown text-sm">
                          {selectedDayDetail.date} ({formatDayOfWeek(selectedDayDetail.date)}요일)
                        </span>
                        <div className="text-brand-sage font-bold">
                          {MOOD_DEFINITIONS[selectedDayDetail.moodId].label} · {selectedDayDetail.score}점 (강도 {selectedDayDetail.intensity}/10)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(selectedDayDetail.date)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-brand-green/30 text-brand-brown hover:text-brand-sage font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>수정</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLog(selectedDayDetail.date)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>삭제</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDayDetail(null)}
                        className="p-1 text-brand-brown/50 hover:text-brand-brown cursor-pointer"
                        aria-label="닫기"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {selectedDayDetail.note && (
                    <div className="p-2.5 rounded-xl bg-white border border-brand-green/20 text-brand-brown/85 italic">
                      "{selectedDayDetail.note}"
                    </div>
                  )}

                  {selectedDayDetail.tags && selectedDayDetail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedDayDetail.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-brand-green/30 text-brand-sage text-[11px]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 5. Clinical Psychological Analysis Report & Prescription (Dr. Park Mi-kyeong) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-sage/10 via-white to-brand-green/20 border border-brand-sage/30 shadow-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-sage/20">
            <div className="flex items-start sm:items-center gap-3.5">
              <img
                src="/images/counselor_park.jpg"
                alt="박미경 소장"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-sage/40 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-brand-brown">
                    박미경 소장의 정서 케어 리포트
                  </h4>
                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-brand-sage text-white">
                    교육학 박사 · 한국상담학회 1급 슈퍼바이저
                  </span>
                </div>
                <p className="text-xs text-brand-brown/70 font-serif mt-0.5">
                  내담자의 심리 데이터에 기반한 맞춤형 임상 피드백과 회복 솔루션입니다.
                </p>
              </div>
            </div>

            {/* Resilience Badge */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-white px-3.5 py-1.5 rounded-2xl border border-brand-sage/30 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-serif text-brand-brown/70">회복 탄력성:</span>
              <span className="text-xs font-serif font-bold text-brand-sage">
                {analytics.clinicalInsight.resilienceLevel}
              </span>
            </div>
          </div>

          {/* Feedback Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-serif">
            <div className="p-4 rounded-2xl bg-white/90 border border-brand-green/30 space-y-2">
              <span className="text-xs font-bold text-brand-sage flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>정서 변화 패턴 심층 분석</span>
              </span>
              <p className="text-brand-brown/85 leading-relaxed">
                {analytics.clinicalInsight.summary}
              </p>
              <p className="text-brand-brown/75 leading-relaxed text-xs pt-1">
                {analytics.clinicalInsight.detailedAnalysis}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-brand-green/30 space-y-2">
              <span className="text-xs font-bold text-brand-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>추천 자기 돌봄 가이드 (Action Tip)</span>
              </span>
              <p className="text-brand-brown/85 leading-relaxed">
                {analytics.clinicalInsight.recommendedAction}
              </p>
              <div className="pt-2 text-[11px] text-brand-brown/60 leading-normal">
                ※ 감정 기복이 심하거나 피로가 지속될 경우, 연구소의 대면 초기 상담을 통해 객관적 심리 척도(MMPI-2/TCI)를 확인해 보시는 것을 권장합니다.
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/60">
              <ShieldCheck className="w-4 h-4 text-brand-sage" />
              <span>모든 기록은 브라우저에 안전하게 보관되며 외부 유출 없이 100% 비밀이 보장됩니다.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-brand-beige border border-brand-green/40 text-brand-brown font-serif font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
              >
                <Share2 className="w-3.5 h-3.5 text-brand-sage" />
                <span>리포트 복사</span>
              </button>

              <Link
                to="/reservation"
                className="px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white font-serif font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
              >
                <span>내 감정 추이 공유하며 상담 예약</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Copy Toast Alert */}
          {copiedNotification && (
            <div className="p-2.5 rounded-xl bg-brand-brown text-white text-xs font-serif text-center shadow-lg animate-fade-in">
              {copiedNotification}
            </div>
          )}
        </div>
      </div>

      {/* 6. Mood Log Input/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-brand-green/30 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-brand-sage" />
                  <h3 className="text-xl font-serif font-bold text-brand-brown">
                    마음 날씨 기록하기
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-brand-brown/50 hover:text-brand-brown hover:bg-brand-beige cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-5">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    기록 날짜
                  </label>
                  <input
                    type="date"
                    value={modalDate}
                    max={formatDateKey(new Date())}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/40 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-sage/30 bg-brand-beige/20"
                    required
                  />
                </div>

                {/* Mood Selection (6 Emojis) */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    오늘 나의 감정 선택
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(MOOD_DEFINITIONS).map(([key, item]) => {
                      const isSelected = modalMoodId === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setModalMoodId(key as MoodId);
                            setModalScore(item.defaultScore);
                          }}
                          className={cn(
                            "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center",
                            isSelected
                              ? "bg-brand-sage/10 border-brand-sage ring-2 ring-brand-sage/20 shadow-xs"
                              : "border-brand-green/30 bg-white hover:bg-brand-beige/30"
                          )}
                        >
                          <span className="text-2xl mb-1">{item.emoji}</span>
                          <span className="text-xs font-serif font-bold text-brand-brown">
                            {item.shortLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score Slider (1 to 10) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-serif font-bold text-brand-brown mb-1.5">
                    <span>마음 밸런스 점수</span>
                    <span className="text-brand-sage font-extrabold text-sm font-mono">
                      {modalScore}점 / 10점
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={modalScore}
                    onChange={(e) => setModalScore(Number(e.target.value))}
                    className="w-full accent-brand-sage cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-brand-brown/50 font-serif mt-1">
                    <span>1 (매우 힘듦)</span>
                    <span>5 (보통)</span>
                    <span>10 (최상의 평온)</span>
                  </div>
                </div>

                {/* Tags Selection */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    영향 요인 태그 (복수 선택 가능)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOOD_TAG_OPTIONS.map((tag) => {
                      const active = modalTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer",
                            active
                              ? "bg-brand-sage text-white shadow-2xs"
                              : "bg-brand-beige text-brand-brown/70 border border-brand-green/30 hover:border-brand-sage/50"
                          )}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Note / Journal */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    오늘 나에게 전하는 한 줄 메모 (선택)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="오늘 어떤 일이 있었나요? 스스로에게 따뜻한 한마디를 건네보세요."
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-green/40 text-xs sm:text-sm font-serif focus:outline-none focus:ring-2 focus:ring-brand-sage/30 bg-brand-beige/20 resize-none"
                    maxLength={140}
                  />
                  <div className="text-right text-[10px] text-brand-brown/50">
                    {modalNote.length} / 140자
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-green/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-brand-green/40 text-brand-brown font-serif text-xs hover:bg-brand-beige transition-all cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white font-serif font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    안전하게 저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
