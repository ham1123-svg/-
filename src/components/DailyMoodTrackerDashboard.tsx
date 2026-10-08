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
  Award
} from 'lucide-react';
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

  // SVG Chart Dimensions & Calculations
  const chartHeight = 220;
  const chartPaddingX = 35;
  const chartPaddingY = 30;

  // Generate SVG coordinates for trend line
  const { points, linePath, areaPath } = useMemo(() => {
    const count = analytics.trendPoints.length;
    if (count === 0) return { points: [], linePath: '', areaPath: '' };

    const svgWidth = 800; // virtual width
    const usableWidth = svgWidth - chartPaddingX * 2;
    const usableHeight = chartHeight - chartPaddingY * 2;

    const coords = analytics.trendPoints.map((pt, idx) => {
      const x = chartPaddingX + (idx / Math.max(1, count - 1)) * usableWidth;
      // score 1 to 10 mapped to y (10 is top, 1 is bottom)
      const normalizedScore = (pt.score - 1) / 9; // 0 to 1
      const y = chartHeight - chartPaddingY - normalizedScore * usableHeight;
      return { x, y, data: pt };
    });

    if (coords.length === 1) {
      const p = coords[0];
      return {
        points: coords,
        linePath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y}`,
        areaPath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y} L ${p.x + 20} ${chartHeight - chartPaddingY} L ${p.x - 20} ${chartHeight - chartPaddingY} Z`,
      };
    }

    // Build smooth cubic Bezier curve
    let line = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      line += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const first = coords[0];
    const last = coords[coords.length - 1];
    const baselineY = chartHeight - chartPaddingY;
    const area = `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;

    return { points: coords, linePath: line, areaPath: area };
  }, [analytics.trendPoints]);

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

        {/* 3. Main Chart: Smooth Trajectory & Area Chart */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white border border-brand-green/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-brown flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-sage" />
                <span>감정 밸런스 궤적 꺾은선 차트</span>
                <span className="text-xs font-normal text-brand-brown/50">
                  ({period === 'weekly' ? '최근 7일간' : '최근 30일간'} 일별 지수 변화)
                </span>
              </h3>
              <p className="text-xs text-brand-brown/60 font-serif mt-0.5">
                데이터 노트를 마우스로 가리키거나 터치하면 해당 일자의 상세 감정과 메모를 확인하실 수 있습니다.
              </p>
            </div>

            {/* Reference Zones Legend */}
            <div className="flex items-center gap-3 text-[11px] font-serif text-brand-brown/70">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>안정권(7~10)</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>보통(4~6)</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>케어필요(1~3)</span>
              </span>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="relative w-full overflow-x-auto pt-2 pb-1">
            <div className="min-w-[620px] w-full">
              <svg
                viewBox={`0 0 800 ${chartHeight}`}
                className="w-full h-52 sm:h-60 overflow-visible select-none"
              >
                <defs>
                  {/* Gradient for area fill */}
                  <linearGradient id="moodAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A8B7B" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#2A8B7B" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#2A8B7B" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Horizontal grid lines */}
                  <linearGradient id="gridLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E8F3E8" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#2A8B7B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#E8F3E8" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Background Score Gridlines */}
                {[10, 7, 4, 1].map((val) => {
                  const usableHeight = chartHeight - chartPaddingY * 2;
                  const normalizedScore = (val - 1) / 9;
                  const y = chartHeight - chartPaddingY - normalizedScore * usableHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={chartPaddingX}
                        y1={y}
                        x2={800 - chartPaddingX}
                        y2={y}
                        stroke="#2A8B7B"
                        strokeOpacity="0.12"
                        strokeDasharray={val === 7 ? "none" : "3 3"}
                        strokeWidth="1"
                      />
                      <text
                        x={chartPaddingX - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        fontSize="9"
                        fill="#3C271C"
                        fillOpacity="0.45"
                        fontFamily="sans-serif"
                      >
                        {val}점
                      </text>
                    </g>
                  );
                })}

                {/* Soft Area Under Curve */}
                {areaPath && (
                  <path d={areaPath} fill="url(#moodAreaGradient)" />
                )}

                {/* Main Curved Trajectory Line */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2A8B7B"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-xs"
                  />
                )}

                {/* Interactive Data Points */}
                {points.map((p, idx) => {
                  const isHovered = activeTooltip?.date === p.data.date;
                  const moodConfig = MOOD_DEFINITIONS[p.data.moodId];
                  const hasNote = Boolean(p.data.note);

                  return (
                    <g
                      key={p.data.date}
                      className="cursor-pointer group"
                      onMouseEnter={() => setActiveTooltip(p.data)}
                      onClick={() => handleOpenAddModal(p.data.date)}
                    >
                      {/* Vertical indicator line on hover */}
                      {isHovered && (
                        <line
                          x1={p.x}
                          y1={chartPaddingY - 10}
                          x2={p.x}
                          y2={chartHeight - chartPaddingY}
                          stroke="#2A8B7B"
                          strokeOpacity="0.35"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Pulse circle when hovered */}
                      {isHovered && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="14"
                          fill={moodConfig.color}
                          fillOpacity="0.2"
                          className="animate-ping"
                        />
                      )}

                      {/* Outer Ring */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 8 : 6}
                        fill="#FFFFFF"
                        stroke={moodConfig.color}
                        strokeWidth={isHovered ? 3.5 : 2.5}
                        className="transition-all duration-150"
                      />

                      {/* Small center dot */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="2.5"
                        fill={moodConfig.color}
                      />

                      {/* Note indicator dot above marker */}
                      {hasNote && (
                        <circle
                          cx={p.x + 5}
                          cy={p.y - 5}
                          r="2.5"
                          fill="#E65100"
                        />
                      )}

                      {/* Bottom X-axis Day Label */}
                      <text
                        x={p.x}
                        y={chartHeight - 10}
                        textAnchor="middle"
                        fontSize={period === 'weekly' ? '11' : '9.5'}
                        fontWeight={isHovered ? 'bold' : 'normal'}
                        fill={isHovered ? '#2A8B7B' : '#3C271C'}
                        fillOpacity={isHovered ? 1 : 0.65}
                        fontFamily="serif"
                      >
                        {period === 'weekly' ? p.data.dayLabel : p.data.shortDate}
                      </text>

                      {/* Emoji label on top of point for weekly view */}
                      {period === 'weekly' && (
                        <text
                          x={p.x}
                          y={p.y - 12}
                          textAnchor="middle"
                          fontSize="13"
                        >
                          {p.data.emoji}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Dynamic Hover / Selected Info Tooltip Banner */}
          <div className="p-3.5 rounded-2xl bg-brand-green/15 border border-brand-green/30 min-h-[56px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-serif">
            {activeTooltip ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xl">{activeTooltip.emoji}</span>
                <div>
                  <span className="font-bold text-brand-brown">
                    {activeTooltip.date} ({formatDayOfWeek(activeTooltip.date)}요일):
                  </span>{' '}
                  <span className="text-brand-sage font-extrabold">
                    {activeTooltip.shortLabel}
                  </span>{' '}
                  <span className="text-brand-brown/60">
                    (지수 {activeTooltip.score}점)
                  </span>
                  {activeTooltip.note && (
                    <span className="ml-2 italic text-brand-brown/80 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/20">
                      "{activeTooltip.note}"
                    </span>
                  )}
                </div>
                {activeTooltip.tags && activeTooltip.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {activeTooltip.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.2 rounded-md bg-white text-[10px] text-brand-sage border border-brand-green/30 font-sans"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-brand-brown/60 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-brand-sage" />
                <span>차트 상의 점을 클릭하거나 마우스를 올리면 해당 일자의 상세 감정 기록과 메모를 보실 수 있습니다.</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleOpenAddModal(activeTooltip?.date)}
              className="text-brand-sage font-bold hover:underline inline-flex items-center gap-1 shrink-0 self-end sm:self-center cursor-pointer"
            >
              <span>{activeTooltip ? '해당 일자 기록 수정' : '오늘 감정 추가'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
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
