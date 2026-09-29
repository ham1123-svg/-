import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { 
  TrendingUp, BarChart3, Layers, Calendar, User, Users, 
  ClipboardCheck, Building2, GraduationCap, ArrowUpRight, ArrowDownRight,
  RefreshCw, Check, Info, FileSpreadsheet, Eye, EyeOff
} from 'lucide-react';
import { Reservation, ReservationTrendAnalytics, CategoryMonthlyTrend, CategorySummaryStat } from '../types';

interface AdminReservationTrendChartProps {
  reservations: Reservation[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

// Category visual configuration with psychology clinic brand aesthetic
export const CATEGORY_CONFIG: { 
  [key: string]: { 
    color: string; 
    lightColor: string; 
    borderColor: string; 
    icon: React.ElementType; 
    description: string;
  } 
} = {
  '개인상담': {
    color: '#4B6354', // Brand Sage
    lightColor: '#EDF2EE',
    borderColor: '#3D5245',
    icon: User,
    description: '청소년 및 성인 1:1 심층 치유 (우울·불안·스트레스)'
  },
  '부부상담': {
    color: '#C87D55', // Terracotta Warm Coral
    lightColor: '#FDF4EF',
    borderColor: '#B36A44',
    icon: Users,
    description: '부부 갈등, 가족 관계 회복 및 의사소통 개선'
  },
  '심리검사': {
    color: '#4A6984', // Slate Steel Indigo
    lightColor: '#EEF3F8',
    borderColor: '#3B556C',
    icon: ClipboardCheck,
    description: '종합 심리평가, TCI, MMPI-2 객관적 정밀 진단'
  },
  '기업상담': {
    color: '#8C6D46', // Warm Ochre Brown
    lightColor: '#F8F4EE',
    borderColor: '#735835',
    icon: Building2,
    description: 'EAP 근로자 지원 프로그램, 직장인 번아웃 케어'
  },
  '집단/교육': {
    color: '#795B78', // Muted Lavender Plum
    lightColor: '#F7F2F6',
    borderColor: '#634762',
    icon: GraduationCap,
    description: '소그룹 테마 집단상담, 학부모 및 마음 코칭 워크숍'
  }
};

const CATEGORIES = ['개인상담', '부부상담', '심리검사', '기업상담', '집단/교육'] as const;

export default function AdminReservationTrendChart({
  reservations,
  onRefresh,
  isLoading = false
}: AdminReservationTrendChartProps) {
  // Chart visual display mode
  const [chartType, setChartType] = useState<'stacked-area' | 'grouped-bar' | 'line'>('stacked-area');
  
  // Category visibility toggles (client interactive filtering)
  const [visibleCategories, setVisibleCategories] = useState<{ [key: string]: boolean }>({
    '개인상담': true,
    '부부상담': true,
    '심리검사': true,
    '기업상담': true,
    '집단/교육': true
  });

  // Selected month drilldown
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Tabular summary toggle
  const [showDataTable, setShowDataTable] = useState(false);

  // Compute 6 months data directly from reservations list (guarantee real-time reactivity with any admin edits)
  const analyticsData = useMemo<ReservationTrendAnalytics>(() => {
    // Generate 6 months sequence ending at current month (or latest reservation date)
    const now = new Date();
    // Default base: 2026-09
    const baseYear = 2026;
    const baseMonth = 8; // September (0-indexed)

    const months: string[] = [];
    const monthLabels: { [key: string]: string } = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(baseYear, baseMonth - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${yyyy}-${mm}`;
      months.push(key);
      monthLabels[key] = `${d.getMonth() + 1}월`;
    }

    // Initialize map
    const monthlyMap: { [month: string]: CategoryMonthlyTrend } = {};
    months.forEach(m => {
      monthlyMap[m] = {
        month: m,
        monthLabel: monthLabels[m],
        '개인상담': 0,
        '부부상담': 0,
        '심리검사': 0,
        '기업상담': 0,
        '집단/교육': 0,
        total: 0
      };
    });

    // Bucket reservations into months
    reservations.forEach(r => {
      if (!r.preferred_date) return;
      const monthPrefix = r.preferred_date.substring(0, 7);
      if (monthlyMap[monthPrefix]) {
        // Resolve category
        let cat = '개인상담';
        const title = r.program_title || '';
        const catProp = r.program_category || '';

        if (catProp && CATEGORIES.includes(catProp as any)) {
          cat = catProp;
        } else if (title.includes('부부') || title.includes('가족')) {
          cat = '부부상담';
        } else if (title.includes('검사') || title.includes('해석')) {
          cat = '심리검사';
        } else if (title.includes('기업') || title.includes('EAP')) {
          cat = '기업상담';
        } else if (title.includes('집단') || title.includes('교육')) {
          cat = '집단/교육';
        } else if (title.includes('개인') || title.includes('청소년') || title.includes('성인')) {
          cat = '개인상담';
        }

        monthlyMap[monthPrefix][cat] = (monthlyMap[monthPrefix][cat] || 0) + 1;
        monthlyMap[monthPrefix].total += 1;
      }
    });

    const monthlyData = months.map(m => monthlyMap[m]);

    // Aggregate totals per category
    const catCounts: { [cat: string]: number } = {
      '개인상담': 0,
      '부부상담': 0,
      '심리검사': 0,
      '기업상담': 0,
      '집단/교육': 0
    };

    let grandTotal = 0;
    monthlyData.forEach(md => {
      CATEGORIES.forEach(c => {
        catCounts[c] += md[c];
      });
      grandTotal += md.total;
    });

    const categoryTotals: CategorySummaryStat[] = CATEGORIES.map(c => {
      const count = catCounts[c];
      const percentage = grandTotal > 0 ? Math.round((count / grandTotal) * 1000) / 10 : 0;
      
      // Calculate growth from 5th to 6th month for this category
      const prevM = monthlyData[monthlyData.length - 2]?.[c] || 0;
      const currM = monthlyData[monthlyData.length - 1]?.[c] || 0;
      const growth = prevM > 0 ? Math.round(((currM - prevM) / prevM) * 100) : 0;

      return {
        category: c,
        count,
        percentage,
        color: CATEGORY_CONFIG[c]?.color || '#4B6354',
        secondaryColor: CATEGORY_CONFIG[c]?.lightColor || '#EDF2EE',
        iconName: c,
        growthMoM: growth
      };
    });

    // Top Category
    let topCategory = categoryTotals[0];
    categoryTotals.forEach(ct => {
      if (ct.count > topCategory.count) {
        topCategory = ct;
      }
    });

    // MoM Growth
    const prevTotal = monthlyData[monthlyData.length - 2]?.total || 0;
    const currTotal = monthlyData[monthlyData.length - 1]?.total || 0;
    const momGrowth = prevTotal > 0 
      ? Math.round(((currTotal - prevTotal) / prevTotal) * 1000) / 10 
      : 0;

    // Highest Month
    let highestMonth = { monthLabel: monthlyData[0]?.monthLabel || '', count: monthlyData[0]?.total || 0 };
    monthlyData.forEach(md => {
      if (md.total > highestMonth.count) {
        highestMonth = { monthLabel: md.monthLabel, count: md.total };
      }
    });

    return {
      months,
      monthlyData,
      categoryTotals,
      summary: {
        totalReservations: grandTotal,
        monthlyAverage: Math.round(grandTotal / (months.length || 1)),
        topCategory: {
          category: topCategory.category,
          count: topCategory.count,
          percentage: topCategory.percentage
        },
        momGrowth,
        highestMonth
      }
    };
  }, [reservations]);

  // Toggle category visibility
  const toggleCategory = (cat: string) => {
    setVisibleCategories(prev => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      // Prevent disabling all
      if (prev[cat] && activeCount <= 1) return prev;
      return { ...prev, [cat]: !prev[cat] };
    });
  };

  // Reset all categories to visible
  const showAllCategories = () => {
    setVisibleCategories({
      '개인상담': true,
      '부부상담': true,
      '심리검사': true,
      '기업상담': true,
      '집단/교육': true
    });
  };

  // Filtered chart data based on visibility
  const filteredChartData = useMemo(() => {
    return analyticsData.monthlyData.map(item => {
      const copy: any = {
        month: item.month,
        monthLabel: item.monthLabel,
        total: 0
      };
      CATEGORIES.forEach(c => {
        if (visibleCategories[c]) {
          copy[c] = item[c];
          copy.total += item[c];
        }
      });
      return copy;
    });
  }, [analyticsData.monthlyData, visibleCategories]);

  // Active drilldown month data
  const currentMonthDetail = useMemo(() => {
    if (!selectedMonth) {
      return analyticsData.monthlyData[analyticsData.monthlyData.length - 1];
    }
    return analyticsData.monthlyData.find(m => m.month === selectedMonth) || analyticsData.monthlyData[analyticsData.monthlyData.length - 1];
  }, [analyticsData.monthlyData, selectedMonth]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const monthData = analyticsData.monthlyData.find(m => m.monthLabel === label);
      const totalInMonth = monthData?.total || 1;

      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-green/30 shadow-lg min-w-[220px]">
          <div className="flex items-center justify-between border-b border-brand-green/15 pb-2 mb-2.5">
            <span className="font-serif font-bold text-brand-brown text-sm">
              {monthData?.month ? `${monthData.month.split('-')[0]}년 ${monthData.month.split('-')[1]}월` : label}
            </span>
            <span className="text-xs font-mono font-bold text-brand-sage">
              총 {monthData?.total ?? 0}건
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {payload.map((entry: any) => {
              const catName = entry.dataKey;
              const val = entry.value;
              const pct = Math.round((val / totalInMonth) * 100);
              const color = CATEGORY_CONFIG[catName]?.color || entry.color;

              return (
                <div key={catName} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: color }} 
                    />
                    <span className="text-brand-brown/80 font-medium">{catName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-brand-brown">{val}건</span>
                    <span className="text-[10px] text-brand-brown/50">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-brand-green/15 text-[11px] text-brand-brown/60 flex items-center justify-between">
            <span>클릭하여 월별 상세 보기</span>
            <span className="text-brand-sage font-bold">✓ 선택</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-green/25 p-5 sm:p-7 shadow-xs space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-brand-green/20 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-sage uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Monthly Consultation Demand & Trend Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
            <span>최근 6개월 상담 분야별 예약 추이</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage">
              2026.04 ~ 2026.09 (6개월)
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-brown/70 font-serif mt-1">
            개인상담, 부부상담, 심리검사, 기업 EAP, 집단/교육 등 5개 전문 분야의 월별 수요 변화와 예약 점유율을 시각화합니다.
          </p>
        </div>

        {/* Action Controls: Refresh, Data Table Toggle, Chart Type Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-brand-beige/50 hover:bg-brand-beige border border-brand-green/25 text-brand-brown rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="최신 예약 데이터 새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-sage' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDataTable(!showDataTable)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showDataTable 
                ? 'bg-brand-brown text-white border-brand-brown shadow-2xs' 
                : 'bg-white hover:bg-brand-beige/40 text-brand-brown/80 border-brand-green/25'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{showDataTable ? '차트 집중 모드' : '월별 수치표 보기'}</span>
          </button>

          {/* Chart Type Segmented Control (Interactive Filter Tabs) */}
          <div className="flex items-center gap-1 p-1 bg-brand-green/15 rounded-xl border border-brand-green/20">
            <button
              type="button"
              onClick={() => setChartType('stacked-area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'stacked-area'
                  ? 'bg-white text-brand-sage shadow-2xs'
                  : 'text-brand-brown/70 hover:text-brand-brown'
              }`}
              title="누적 영역 차트 (전체 규모 및 비중 추이)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>누적 영역</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType('grouped-bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'grouped-bar'
                  ? 'bg-white text-brand-sage shadow-2xs'
                  : 'text-brand-brown/70 hover:text-brand-brown'
              }`}
              title="그룹 막대 차트 (분야별 직접 비교)"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>분야별 막대</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'line'
                  ? 'bg-white text-brand-sage shadow-2xs'
                  : 'text-brand-brown/70 hover:text-brand-brown'
              }`}
              title="추세선 차트 (성장 궤적 비교)"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>추세선</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Summary KPI Metrics Strip (4 Pillars) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total 6M Reservations */}
        <div className="p-4 rounded-2xl bg-brand-green/10 border border-brand-green/20">
          <div className="flex items-center justify-between text-xs text-brand-brown/65 mb-1 font-serif">
            <span>6개월 누적 총 예약</span>
            <Calendar className="w-4 h-4 text-brand-sage" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-brand-brown">
              {analyticsData.summary.totalReservations.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-brand-brown/60">건</span>
          </div>
          <div className="text-[11px] text-brand-brown/60 mt-1">
            월평균 <strong className="text-brand-brown font-mono">{analyticsData.summary.monthlyAverage}</strong>건의 임상 상담 진행
          </div>
        </div>

        {/* Top Demand Category */}
        <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-brand-brown/65 mb-1 font-serif">
            <span>최다 예약 상담 분야</span>
            <User className="w-4 h-4 text-brand-sage" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold font-serif text-brand-sage truncate">
              {analyticsData.summary.topCategory.category}
            </span>
            <span className="text-xs font-bold text-brand-brown/70 font-mono">
              ({analyticsData.summary.topCategory.percentage}%)
            </span>
          </div>
          <div className="text-[11px] text-brand-brown/60 mt-1">
            6개월 누적 <strong className="text-brand-brown font-mono">{analyticsData.summary.topCategory.count}</strong>건으로 1위 유지
          </div>
        </div>

        {/* Month-over-Month Growth */}
        <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-brand-brown/65 mb-1 font-serif">
            <span>전월 대비 증감률 (MoM)</span>
            {analyticsData.summary.momGrowth >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${
              analyticsData.summary.momGrowth >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {analyticsData.summary.momGrowth >= 0 ? `+${analyticsData.summary.momGrowth}%` : `${analyticsData.summary.momGrowth}%`}
            </span>
          </div>
          <div className="text-[11px] text-brand-brown/60 mt-1">
            8월 대비 9월 예약 수요 추세
          </div>
        </div>

        {/* Peak Demand Month */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
          <div className="flex items-center justify-between text-xs text-amber-900/70 mb-1 font-serif">
            <span>최대 예약 집중 달</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-amber-950">
              {analyticsData.summary.highestMonth.monthLabel}
            </span>
            <span className="text-xs font-bold text-amber-800 font-mono">
              ({analyticsData.summary.highestMonth.count}건)
            </span>
          </div>
          <div className="text-[11px] text-amber-800/70 mt-1">
            추석 전후 심리 치유 및 가족 상담 증가
          </div>
        </div>
      </div>

      {/* 3. Category Interactive Legend & Filter Toggles */}
      <div className="bg-brand-beige/30 rounded-2xl p-3.5 border border-brand-green/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
          <div className="text-xs font-bold text-brand-brown/80 font-serif flex items-center gap-1.5">
            <span>상담 분야 필터링 (클릭하여 차트 표시/숨김)</span>
            <span className="text-[11px] text-brand-brown/50">· 최소 1개 분야 필수 선택</span>
          </div>
          <button
            type="button"
            onClick={showAllCategories}
            className="text-[11px] text-brand-sage hover:text-brand-brown font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            모든 분야 한눈에 보기
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CATEGORIES.map(cat => {
            const config = CATEGORY_CONFIG[cat];
            const isVisible = visibleCategories[cat];
            const stat = analyticsData.categoryTotals.find(c => c.category === cat);
            const Icon = config.icon;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isVisible 
                    ? 'bg-white shadow-2xs border-brand-green/30' 
                    : 'bg-white/40 border-dashed border-gray-300 opacity-50'
                }`}
                title={`${cat} ${isVisible ? '숨기기' : '표시하기'}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: isVisible ? config.color : '#CBD5E1' }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-brand-brown truncate">{cat}</div>
                    <div className="text-[10px] text-brand-brown/60 font-mono">
                      {stat?.count || 0}건 ({stat?.percentage || 0}%)
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-brand-brown/40">
                  {isVisible ? <Eye className="w-3 h-3 text-brand-sage" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Chart Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recharts Dynamic Canvas (8 cols on large) */}
        <div className="lg:col-span-8 bg-brand-beige/10 rounded-2xl p-4 sm:p-5 border border-brand-green/15">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-brown font-serif">
                {chartType === 'stacked-area' && '📊 누적 영역 추이 (월별 전체 예약 규모 & 구성)'}
                {chartType === 'grouped-bar' && '📊 월별 상담 분야 직접 비교 (Grouped Bars)'}
                {chartType === 'line' && '📈 6개월 성장 추세선 (Trendlines)'}
              </span>
            </div>
            <span className="text-[11px] text-brand-brown/50 font-mono">단위: 예약 건수(건)</span>
          </div>

          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'stacked-area' ? (
                <AreaChart
                  data={filteredChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      setSelectedMonth(data.activePayload[0].payload.month);
                    }
                  }}
                >
                  <defs>
                    {CATEGORIES.map(cat => (
                      <linearGradient key={cat} id={`color-${cat}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CATEGORY_CONFIG[cat].color} stopOpacity={0.85} />
                        <stop offset="95%" stopColor={CATEGORY_CONFIG[cat].color} stopOpacity={0.15} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3DCD2" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fill: '#4A3B32', fontSize: 12, fontFamily: 'serif' }}
                    axisLine={{ stroke: '#C8BEAF' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#4A3B32', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {CATEGORIES.map(cat => {
                    if (!visibleCategories[cat]) return null;
                    return (
                      <Area
                        key={cat}
                        type="monotone"
                        dataKey={cat}
                        stackId="1"
                        stroke={CATEGORY_CONFIG[cat].color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#color-${cat})`}
                      />
                    );
                  })}
                </AreaChart>
              ) : chartType === 'grouped-bar' ? (
                <BarChart
                  data={filteredChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      setSelectedMonth(data.activePayload[0].payload.month);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3DCD2" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fill: '#4A3B32', fontSize: 12, fontFamily: 'serif' }}
                    axisLine={{ stroke: '#C8BEAF' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#4A3B32', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {CATEGORIES.map(cat => {
                    if (!visibleCategories[cat]) return null;
                    return (
                      <Bar
                        key={cat}
                        dataKey={cat}
                        fill={CATEGORY_CONFIG[cat].color}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    );
                  })}
                </BarChart>
              ) : (
                <LineChart
                  data={filteredChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      setSelectedMonth(data.activePayload[0].payload.month);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3DCD2" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fill: '#4A3B32', fontSize: 12, fontFamily: 'serif' }}
                    axisLine={{ stroke: '#C8BEAF' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#4A3B32', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {CATEGORIES.map(cat => {
                    if (!visibleCategories[cat]) return null;
                    return (
                      <Line
                        key={cat}
                        type="monotone"
                        dataKey={cat}
                        stroke={CATEGORY_CONFIG[cat].color}
                        strokeWidth={2.5}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6, stroke: CATEGORY_CONFIG[cat].color, strokeWidth: 2, fill: '#fff' }}
                      />
                    );
                  })}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-brand-brown/60 pt-2 border-t border-brand-green/15">
            <span>💡 특정 월의 데이터 포인트를 클릭하면 우측에 해당 월의 세부 통계가 포커스됩니다.</span>
            <span className="font-mono text-brand-sage font-bold">Total: {analyticsData.summary.totalReservations}건</span>
          </div>
        </div>

        {/* Right: Pie Distribution & Focused Month Detail (4 cols on large) */}
        <div className="lg:col-span-4 space-y-4">
          {/* 6-Month Aggregate Proportions (Pie / Donut Chart) */}
          <div className="bg-brand-beige/15 rounded-2xl p-4 sm:p-5 border border-brand-green/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-brown font-serif">6개월 누적 점유율 (Share)</span>
              <span className="text-[10px] text-brand-brown/50">전체 100% 기준</span>
            </div>

            <div className="w-full h-[160px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.categoryTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="category"
                  >
                    {analyticsData.categoryTotals.map(entry => (
                      <Cell 
                        key={entry.category} 
                        fill={entry.color} 
                        stroke="#fff" 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `${value}건 (${Math.round((Number(value) / analyticsData.summary.totalReservations) * 100)}%)`, 
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Compact Legend Rows */}
            <div className="space-y-1.5 mt-2">
              {analyticsData.categoryTotals.map(item => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-brand-brown/80 font-serif">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-brand-brown">{item.count}건</span>
                    <span className="text-[11px] text-brand-brown/50">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focused Month Drilldown Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-green/25 shadow-2xs">
            <div className="flex items-center justify-between border-b border-brand-green/15 pb-2.5 mb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Month Focus</span>
                <h4 className="font-serif font-bold text-brand-brown text-base">
                  {currentMonthDetail.month.split('-')[0]}년 {currentMonthDetail.month.split('-')[1]}월 상세 분석
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-brand-sage/10 text-brand-sage font-mono font-bold text-xs">
                총 {currentMonthDetail.total}건
              </span>
            </div>

            <div className="space-y-2">
              {CATEGORIES.map(cat => {
                const count = currentMonthDetail[cat] || 0;
                const pct = currentMonthDetail.total > 0 
                  ? Math.round((count / currentMonthDetail.total) * 100) 
                  : 0;
                const config = CATEGORY_CONFIG[cat];

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif text-brand-brown/80">{cat}</span>
                      <span className="font-mono font-bold text-brand-brown">
                        {count}건 <span className="font-normal text-brand-brown/50 text-[10px]">({pct}%)</span>
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 bg-brand-beige/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${pct}%`, 
                          backgroundColor: config.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-brand-green/15 text-[11px] text-brand-brown/65 leading-relaxed">
              <strong>임상 분석 노트:</strong> {currentMonthDetail.month.split('-')[1]}월은 {
                currentMonthDetail['개인상담'] >= currentMonthDetail['부부상담'] 
                  ? '개인 성인 및 청소년의 정서적 회복 의뢰가 가장 높게 집계되었습니다.'
                  : '부부 갈등 및 가족 관계 개선 상담의 비중이 뚜렷하게 상승하였습니다.'
              }
            </div>
          </div>
        </div>
      </div>

      {/* 5. Optional Tabular Breakdown View (Toggled via button) */}
      {showDataTable && (
        <div className="mt-4 pt-4 border-t border-brand-green/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-brand-brown text-sm sm:text-base flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-brand-sage" />
              <span>최근 6개월 월별 / 분야별 예약 수치 요약표 (Detailed Data Grid)</span>
            </h3>
            <span className="text-xs text-brand-brown/60 font-serif">정밀 통계 보고서 데이터</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-brand-green/20 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-beige/40 text-brand-brown font-serif border-b border-brand-green/20">
                  <th className="p-3 font-bold">상담 분야 / 구분</th>
                  {analyticsData.monthlyData.map(m => (
                    <th key={m.month} className="p-3 text-center font-bold">
                      {m.monthLabel}
                    </th>
                  ))}
                  <th className="p-3 text-center font-bold bg-brand-green/20 text-brand-brown">
                    6개월 누적 총계
                  </th>
                  <th className="p-3 text-center font-bold">점유 비중</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/15 text-brand-brown/85 font-mono">
                {CATEGORIES.map(cat => {
                  const stat = analyticsData.categoryTotals.find(c => c.category === cat);
                  const config = CATEGORY_CONFIG[cat];

                  return (
                    <tr key={cat} className="hover:bg-brand-beige/20 transition-colors">
                      <td className="p-3 font-serif font-bold flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                        <span>{cat}</span>
                      </td>
                      {analyticsData.monthlyData.map(m => (
                        <td key={m.month} className="p-3 text-center">
                          {m[cat]}건
                        </td>
                      ))}
                      <td className="p-3 text-center font-bold bg-brand-green/10 text-brand-brown">
                        {stat?.count || 0}건
                      </td>
                      <td className="p-3 text-center font-bold text-brand-sage">
                        {stat?.percentage || 0}%
                      </td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr className="bg-brand-green/15 font-bold font-mono text-brand-brown border-t-2 border-brand-green/30">
                  <td className="p-3 font-serif">월간 전체 총계 (Total)</td>
                  {analyticsData.monthlyData.map(m => (
                    <td key={m.month} className="p-3 text-center text-sm font-extrabold text-brand-sage">
                      {m.total}건
                    </td>
                  ))}
                  <td className="p-3 text-center text-sm font-extrabold bg-brand-green/30 text-brand-brown">
                    {analyticsData.summary.totalReservations}건
                  </td>
                  <td className="p-3 text-center text-sm font-extrabold text-brand-sage">
                    100.0%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
