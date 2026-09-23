import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine
} from 'recharts';
import { 
  Activity, ShieldCheck, Heart, Brain, Sparkles, RotateCcw, 
  Download, Printer, Share2, CheckCircle2, AlertTriangle, 
  Info, ArrowRight, ArrowUpRight, Calendar, Compass, BarChart3, 
  Check, FileText, ChevronRight, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

export interface DimensionData {
  key: string;
  name: string;
  fullName: string;
  score: number; // 0 ~ 100 (Higher = Healthier balance)
  stressScore: number; // 0 ~ 100 (Higher = More distress)
  benchmark: number; // Normal healthy population standard (80)
  status: 'healthy' | 'caution' | 'vulnerable';
  statusText: string;
  statusBadge: string;
  badgeBg: string;
  barColor: string;
  description: string;
  prescription: string;
  strengthsSummary: string;
  matchedQuestions: string[];
}

export interface TestCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  description: string;
  questions: { id: number; text: string }[];
  recommendedProgram: {
    title: string;
    description: string;
    badge: string;
    features: string[];
  };
}

interface SelfDiagnosisResultsDashboardProps {
  category: TestCategory;
  answers: Record<number, number>;
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  result: {
    level: string;
    color: string;
    badgeBg: string;
    barColor: string;
    headline: string;
    summary: string;
    advice: string;
    recProgram: {
      title: string;
      reason: string;
      badge: string;
    };
  };
  onReset: () => void;
}

// Custom Tooltip for Recharts Radar & Bar Charts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DimensionData;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-brand-brown/15 text-xs z-50 max-w-xs">
        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-brand-green/20">
          <span className="font-bold text-brand-brown text-sm font-serif">{data.fullName || label}</span>
          <span className={cn("px-2 py-0.5 rounded-md font-bold text-[10px]", data.badgeBg)}>
            {data.statusText}
          </span>
        </div>
        <div className="space-y-1 my-2">
          <div className="flex justify-between items-center text-brand-brown/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-sage inline-block" />
              내 마음 균형도:
            </span>
            <span className="font-bold text-brand-sage font-mono text-xs">{data.score}점 / 100</span>
          </div>
          <div className="flex justify-between items-center text-brand-brown/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-brown/30 inline-block" />
              건강 표준 기준선:
            </span>
            <span className="font-mono text-xs">80점</span>
          </div>
        </div>
        <p className="text-[11px] text-brand-brown/70 leading-relaxed border-t border-brand-green/10 pt-1.5">
          {data.description}
        </p>
      </div>
    );
  }
  return null;
};

export default function SelfDiagnosisResultsDashboard({
  category,
  answers,
  totalScore,
  maxScore,
  scorePercentage,
  result,
  onReset
}: SelfDiagnosisResultsDashboardProps) {
  const { isHighContrast } = useHighContrast();
  const [chartView, setChartView] = useState<'radar' | 'bar'>('radar');
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Map category answers to 5 psychological dimensions
  const dimensionData: DimensionData[] = useMemo(() => {
    // 5 Dimensional Pillars
    // 1. emotional: 정서 안정성 (Emotional Stability)
    // 2. resilience: 스트레스 완충력 (Stress Resilience)
    // 3. vitality: 신체 활력 & 수면 (Vitality & Sleep)
    // 4. selfEsteem: 자아 존중감 (Self-Esteem & Efficacy)
    // 5. connection: 대인관계 조화 (Interpersonal Harmony)

    let qMap: Record<string, number[]> = {
      emotional: [1, 2],
      resilience: [3],
      vitality: [4, 9],
      selfEsteem: [6, 7],
      connection: [5, 8]
    };

    if (category.id === 'depression') {
      qMap = {
        emotional: [1, 2],
        resilience: [6],
        vitality: [3, 5],
        selfEsteem: [4],
        connection: [7]
      };
    } else if (category.id === 'anxiety') {
      qMap = {
        emotional: [2, 6],
        resilience: [3],
        vitality: [1, 5],
        selfEsteem: [7],
        connection: [4]
      };
    } else if (category.id === 'relationship') {
      qMap = {
        emotional: [7],
        resilience: [1, 3],
        vitality: [6],
        selfEsteem: [4],
        connection: [2, 5]
      };
    }

    const calcDimension = (
      key: string,
      name: string,
      fullName: string,
      qIds: number[],
      desc: string,
      presc: string,
      strength: string
    ): DimensionData => {
      const matchedTexts = qIds
        .map(id => category.questions.find(q => q.id === id)?.text)
        .filter(Boolean) as string[];

      let sum = 0;
      let count = 0;
      qIds.forEach(id => {
        if (answers[id] !== undefined) {
          sum += answers[id];
          count++;
        }
      });

      // Default score if unaddressed
      const maxPossible = (count || 1) * 3;
      const distressRatio = count > 0 ? sum / maxPossible : 0.2;
      const stressScore = Math.round(distressRatio * 100);
      const balanceScore = Math.max(10, Math.min(100, Math.round(100 - stressScore)));

      let status: 'healthy' | 'caution' | 'vulnerable' = 'healthy';
      let statusText = '균형 양호';
      let statusBadge = '🟢 양호';
      let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      let barColor = '#3F5E4D'; // brand-sage

      if (balanceScore < 50) {
        status = 'vulnerable';
        statusText = '취약 영역 (집중 케어)';
        statusBadge = '🔴 취약';
        badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
        barColor = '#e11d48';
      } else if (balanceScore < 75) {
        status = 'caution';
        statusText = '관심 필요 (가벼운 피로)';
        statusBadge = '🟡 관심';
        badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
        barColor = '#d97706';
      }

      return {
        key,
        name,
        fullName,
        score: balanceScore,
        stressScore,
        benchmark: 80,
        status,
        statusText,
        statusBadge,
        badgeBg,
        barColor,
        description: desc,
        prescription: presc,
        strengthsSummary: strength,
        matchedQuestions: matchedTexts
      };
    };

    return [
      calcDimension(
        'emotional',
        '정서 안정',
        '정서적 안정성 (Emotional Balance)',
        qMap.emotional,
        '우울감과 공허함을 조율하고 일상 속 긍정 정서를 유지하는 능력입니다.',
        '하루 10분 온전한 내 감정을 판단 없이 적어보는 감정 일기 작성과 햇볕 산책을 권장합니다.',
        '감정의 소용돌이에 휩쓸리지 않고 스스로를 다독이는 정서적 유연성이 건강하게 보존되어 있습니다.'
      ),
      calcDimension(
        'resilience',
        '스트레스 대처',
        '스트레스 완충력 (Stress Resilience)',
        qMap.resilience,
        '외부 압박이나 긴장 상황 속에서 평정심을 유지하고 회복하는 탄력성입니다.',
        '긴장 시 4-7-8 복식호흡법을 시행하고, 모든 문제를 당장 해결하려는 통제 욕구를 잠시 내려놓으세요.',
        '예기치 못한 상황에서도 쉽게 무너지지 않는 건강한 회복 탄력성을 지니고 계십니다.'
      ),
      calcDimension(
        'vitality',
        '신체 활력/수면',
        '신체 활력 및 수면 (Vitality & Sleep)',
        qMap.vitality,
        '충분한 숙면과 규칙적인 생체 리듬을 통해 심신의 에너지를 충전하는 신체 지표입니다.',
        '취침 1시간 전 스마트폰 블루라이트 차단, 따뜻한 온수 샤워 및 규칙적인 기상 루틴을 지켜주세요.',
        '수면과 신체적 회복 기능이 원활하여 마음을 지탱하는 탄탄한 체력적 기반을 갖추고 있습니다.'
      ),
      calcDimension(
        'selfEsteem',
        '자아 존중감',
        '자아 존중감 & 집중 (Self-Esteem & Efficacy)',
        qMap.selfEsteem,
        '스스로에 대한 신뢰감, 자책으로부터의 자유로움, 인지적 집중력 상태입니다.',
        '"나는 완벽하지 않아도 소중한 존재"라는 자기자비(Self-Compassion) 긍정 확언을 매일 3회 소리 내어 낭독하세요.',
        '자신의 고유한 가치와 역량을 인정하는 단단한 자기 신뢰가 마음의 중심을 잡아주고 있습니다.'
      ),
      calcDimension(
        'connection',
        '대인관계 조화',
        '대인관계 조화도 (Interpersonal Harmony)',
        qMap.connection,
        '가족, 연인, 동료와의 건강한 소통 및 거절에 대한 과도한 불안 없이 친밀감을 나누는 지표입니다.',
        '상대방에게 내 진짜 욕구와 감정을 비폭력 대화(NVC) 방식으로 솔직하고 부드럽게 표현해보세요.',
        '주변 사람들과의 따뜻한 정서적 유대가 든든한 심리적 안전망 역할을 해주고 있습니다.'
      )
    ];
  }, [category, answers]);

  // Overall psychological balance index (Average of balance scores)
  const balanceIndex = useMemo(() => {
    const avg = dimensionData.reduce((acc, cur) => acc + cur.score, 0) / dimensionData.length;
    return Math.round(avg);
  }, [dimensionData]);

  // Identify highest dimension (protective resource) and lowest dimension (vulnerability)
  const sortedDimensions = useMemo(() => {
    return [...dimensionData].sort((a, b) => b.score - a.score);
  }, [dimensionData]);

  const strongestDimension = sortedDimensions[0];
  const vulnerableDimension = sortedDimensions[sortedDimensions.length - 1];

  // Active selected dimension for deep inspection
  const activeDimension = useMemo(() => {
    if (!selectedDimensionKey) return vulnerableDimension;
    return dimensionData.find(d => d.key === selectedDimensionKey) || vulnerableDimension;
  }, [selectedDimensionKey, dimensionData, vulnerableDimension]);

  // Handle Save to DB
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/self-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim() || '익명 내담자',
          test_type: `${category.title} (심리 밸런스 ${balanceIndex}점)`,
          score: totalScore,
          result: `${result.level} - 마음균형: ${balanceIndex}점 / 100`
        })
      });
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save self-diagnosis result:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Print / PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle Share link
  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch (e) {
      // Fallback
    }
  };

  return (
    <div className="w-full" ref={printRef}>
      {/* 1. Header Overview Banner */}
      <div className={cn(
        "rounded-3xl p-6 sm:p-8 border mb-8 transition-all relative overflow-hidden",
        isHighContrast 
          ? "bg-white border-brand-brown text-brand-brown shadow-lg" 
          : "bg-gradient-to-br from-white via-brand-beige/25 to-brand-green/15 border-brand-green/30 shadow-md"
      )}>
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-sage/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs",
                result.badgeBg
              )}>
                <Activity className="w-3.5 h-3.5" />
                종합 평가: {result.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-beige text-brand-brown/80 border border-brand-green/20">
                검사 유형: {category.title}
              </span>
              <span className="text-xs text-brand-brown/60 font-mono">
                검사 완료 일시: {new Date().toLocaleDateString('ko-KR')}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown leading-tight">
              {result.headline}
            </h3>

            <p className="text-sm text-brand-brown/80 max-w-2xl leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Big Psychological Balance Score Wheel */}
          <div className="flex sm:flex-col items-center justify-center bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-brand-green/30 shadow-xs shrink-0 min-w-[200px] text-center">
            <span className="text-[11px] font-bold text-brand-sage tracking-wider uppercase mb-1">
              마음 균형 지수 (Balance)
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-brand-brown font-serif tracking-tight">
                {balanceIndex}
              </span>
              <span className="text-sm font-bold text-brand-brown/50">/ 100점</span>
            </div>
            <p className="text-[11px] text-brand-brown/70 font-medium">
              {balanceIndex >= 75 ? '안정적인 심리적 균형' : balanceIndex >= 50 ? '주의 및 정서 완충 필요' : '전문 상담 개입 적극 권고'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Charts & Visualizations */}
      <div className={cn(
        "rounded-3xl p-6 sm:p-8 border mb-8 bg-white shadow-md",
        isHighContrast ? "border-brand-brown" : "border-brand-green/30"
      )}>
        {/* Chart Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-brand-green/20">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-sage/15 text-brand-sage">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-brand-brown">
                5대 심리 균형 다이어그램 (Psychological Balance)
              </h4>
            </div>
            <p className="text-xs text-brand-brown/70 mt-1">
              내담자의 응답 패턴을 분석하여 5가지 핵심 심리 역량의 균형 상태를 시각화했습니다.
            </p>
          </div>

          {/* Toggle between Radar Chart and Bar Chart */}
          <div className="flex items-center p-1 bg-brand-beige/50 rounded-xl border border-brand-green/30 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setChartView('radar')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all",
                chartView === 'radar'
                  ? "bg-brand-brown text-white shadow-xs"
                  : "text-brand-brown/70 hover:text-brand-brown"
              )}
              aria-label="방사형 스파이더 차트로 보기"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>방사형 (스파이더)</span>
            </button>
            <button
              type="button"
              onClick={() => setChartView('bar')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all",
                chartView === 'bar'
                  ? "bg-brand-brown text-white shadow-xs"
                  : "text-brand-brown/70 hover:text-brand-brown"
              )}
              aria-label="항목별 막대 그래프로 보기"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>영역별 막대그래프</span>
            </button>
          </div>
        </div>

        {/* Screen Reader Accessible Data Summary */}
        <div className="sr-only">
          <h5>심리 검사 5대 영역별 점수표 (스크린 리더용)</h5>
          <table>
            <caption>5대 심리 균형도 측정 결과</caption>
            <thead>
              <tr>
                <th scope="col">영역명</th>
                <th scope="col">내담자 균형점수 (100점 만점)</th>
                <th scope="col">건강 표준선</th>
                <th scope="col">평가 등급</th>
                <th scope="col">소견</th>
              </tr>
            </thead>
            <tbody>
              {dimensionData.map((d) => (
                <tr key={d.key}>
                  <th scope="row">{d.fullName}</th>
                  <td>{d.score}점</td>
                  <td>80점</td>
                  <td>{d.statusText}</td>
                  <td>{d.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Rendering Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Chart Container (7 cols) */}
          <div className="lg:col-span-7 w-full h-[320px] sm:h-[360px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'radar' ? (
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="75%" 
                  data={dimensionData}
                  className="focus:outline-none"
                >
                  <PolarGrid stroke="#6B8E7B" strokeOpacity={0.25} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: '#4A3E3D', fontSize: 12, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#4A3E3D', fontSize: 10, opacity: 0.6 }}
                  />
                  {/* Benchmark standard line (80 points) */}
                  <Radar
                    name="건강 표준선"
                    dataKey="benchmark"
                    stroke="#b3c5bb"
                    strokeDasharray="4 4"
                    fill="#6B8E7B"
                    fillOpacity={0.08}
                  />
                  {/* User's psychological balance */}
                  <Radar
                    name="내 마음 균형도"
                    dataKey="score"
                    stroke="#3F5E4D"
                    strokeWidth={2.5}
                    fill="#3F5E4D"
                    fillOpacity={0.45}
                  />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => (
                      <span className="text-xs font-medium text-brand-brown/80">{val}</span>
                    )}
                  />
                </RadarChart>
              ) : (
                <BarChart
                  data={dimensionData}
                  layout="vertical"
                  margin={{ top: 10, right: 25, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#6B8E7B" strokeOpacity={0.2} horizontal={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    tick={{ fill: '#4A3E3D', fontSize: 11 }}
                    unit="점"
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fill: '#4A3E3D', fontSize: 12, fontWeight: 600 }}
                    width={80}
                  />
                  <ReferenceLine 
                    x={80} 
                    stroke="#3F5E4D" 
                    strokeDasharray="4 4" 
                    label={{ value: '건강 기준선 (80점)', fill: '#3F5E4D', fontSize: 10, position: 'insideTopRight' }} 
                  />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Bar 
                    dataKey="score" 
                    name="내 마음 균형도"
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                  >
                    {dimensionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.barColor}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => setSelectedDimensionKey(entry.key)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Interactive Dimension Selector List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-[11px] font-bold text-brand-brown/60 uppercase tracking-wider block mb-2">
              영역별 세부 지표 (클릭 시 처방전 확인)
            </span>
            {dimensionData.map((d) => {
              const isSelected = activeDimension.key === d.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDimensionKey(d.key)}
                  className={cn(
                    "w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3",
                    isSelected
                      ? "bg-brand-beige/40 border-brand-sage ring-2 ring-brand-sage/20 shadow-xs"
                      : "bg-white hover:bg-brand-beige/20 border-brand-green/20"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-brand-brown truncate">
                        {d.name}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0", d.badgeBg)}>
                        {d.statusBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-brown/60 line-clamp-1">
                      {d.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-brand-brown font-mono">
                      {d.score}
                    </span>
                    <span className="text-[10px] text-brand-brown/50">/100점</span>
                    <div className="w-16 h-1.5 bg-brand-beige rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${d.score}%`, backgroundColor: d.barColor }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Deep-Dive Focused Dimension Card */}
        <div className="mt-8 pt-6 border-t border-brand-green/20">
          <div className="bg-brand-beige/30 rounded-2xl p-5 sm:p-6 border border-brand-green/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-sage uppercase tracking-wider">
                  집중 심층 분석
                </span>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", activeDimension.badgeBg)}>
                  {activeDimension.statusText}
                </span>
              </div>
              <h5 className="text-base sm:text-lg font-serif font-bold text-brand-brown">
                {activeDimension.fullName} ({activeDimension.score}점)
              </h5>
              <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed">
                <strong>박미경 원장의 맞춤 처방:</strong> {activeDimension.prescription}
              </p>
            </div>

            <div className="shrink-0 bg-white p-3 rounded-xl border border-brand-green/20 text-center min-w-[140px]">
              <span className="text-[10px] font-bold text-brand-brown/60 block">정상 대비 격차</span>
              <span className={cn(
                "text-base font-extrabold font-mono block mt-0.5",
                activeDimension.score >= 80 ? "text-emerald-700" : "text-rose-600"
              )}>
                {activeDimension.score >= 80 ? `+${activeDimension.score - 80}점 우수` : `${activeDimension.score - 80}점 부족`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Strengths & Vulnerabilities Dual Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Most Vulnerable Area Card */}
        <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>우선적 정서 돌봄이 필요한 영역</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-brand-brown mb-2 flex items-center justify-between">
              <span>{vulnerableDimension.name}</span>
              <span className="text-rose-600 font-mono text-base font-extrabold">{vulnerableDimension.score}점</span>
            </h4>
            <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed mb-3">
              현재 {vulnerableDimension.fullName} 지수가 가장 낮게 측정되어 일상적인 스트레스나 피로감이 이 영역을 통해 먼저 체감되고 있을 가능성이 높습니다.
            </p>
          </div>
          <div className="text-[11px] bg-white/80 p-3 rounded-xl border border-rose-200 text-brand-brown/80">
            <strong>추천 치유 포인트:</strong> {vulnerableDimension.prescription}
          </div>
        </div>

        {/* Strongest Protective Resource Card */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>내면의 가장 든든한 지지 자원</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-brand-brown mb-2 flex items-center justify-between">
              <span>{strongestDimension.name}</span>
              <span className="text-emerald-700 font-mono text-base font-extrabold">{strongestDimension.score}점</span>
            </h4>
            <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed mb-3">
              {strongestDimension.strengthsSummary} 힘든 순간에도 이 강점을 디딤돌 삼아 건강하게 회복해 나갈 수 있습니다.
            </p>
          </div>
          <div className="text-[11px] bg-white/80 p-3 rounded-xl border border-emerald-200 text-brand-brown/80">
            <strong>치유 활용 팁:</strong> 일상에서 {strongestDimension.name} 자원을 의식적으로 활용하여 취약 영역의 회복 에너지를 보충하세요.
          </div>
        </div>
      </div>

      {/* 5. Counselor's Clinical Advice Box */}
      <div className={cn(
        "bg-white rounded-3xl p-6 sm:p-7 border mb-8 flex items-start gap-4 shadow-xs",
        isHighContrast ? "border-brand-brown" : "border-brand-green/30"
      )}>
        <div className="w-12 h-12 rounded-2xl bg-brand-green/30 text-brand-sage flex items-center justify-center shrink-0 mt-1">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="font-serif font-bold text-brand-brown text-base sm:text-lg">
              박미경 원장의 임상 해석 & 심리 처방
            </h4>
            <span className="text-xs font-normal text-brand-brown/50">행복바람 대표 원장 / 교육학 박사</span>
          </div>
          <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed">
            "{result.advice}"
          </p>
          <p className="text-[11px] text-brand-brown/60 pt-1">
            * 본 검사 결과는 자가 점검용 스크리닝 도구로, 정밀한 심리 상태 파악을 위해서는 연구소의 1:1 초기 상담 및 종합심리검사(Full Battery)를 권장합니다.
          </p>
        </div>
      </div>

      {/* 6. Recommended Counseling Program Card */}
      <div className="bg-gradient-to-br from-brand-beige/60 via-white to-brand-green/20 rounded-3xl p-6 sm:p-8 border-2 border-brand-sage/40 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-brand-green/30">
          <div>
            <span className="text-xs font-bold text-brand-sage uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              내담자 맞춤 추천 심리상담 솔루션
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown mt-1">
              {result.recProgram.title}
            </h4>
          </div>
          <span className="inline-block self-start sm:self-auto px-3.5 py-1 bg-brand-sage text-white text-xs font-bold rounded-full shadow-xs">
            {result.recProgram.badge}
          </span>
        </div>

        <p className="text-sm text-brand-brown/80 mb-6 leading-relaxed">
          <strong>추천 사유:</strong> {result.recProgram.reason}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to={`/reservation?program=${encodeURIComponent(result.recProgram.title)}`}
            className="flex-1 py-3.5 px-5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-center text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>추천 프로그램으로 즉시 예약 신청하기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/programs"
            className="py-3.5 px-5 bg-white hover:bg-brand-beige/40 text-brand-brown font-semibold rounded-xl text-center text-sm border border-brand-green/40 transition-all flex items-center justify-center gap-1.5"
          >
            <span>상담 프로그램 둘러보기</span>
            <ArrowUpRight className="w-4 h-4 text-brand-sage" />
          </Link>
        </div>
      </div>

      {/* 7. Bottom Utility Bar (Save, Print, Share, Retest) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-green/20">
        {/* Save to DB */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="결과 보관용 닉네임 (선택)"
            disabled={isSaved}
            className="px-3.5 py-2 text-xs rounded-xl border border-brand-green/30 bg-brand-beige/10 outline-none focus:border-brand-sage text-brand-brown w-full sm:w-48"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved || isSaving}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0",
              isSaved
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-brand-brown text-white hover:bg-brand-brown/90 shadow-xs"
            )}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>저장 완료</span>
              </>
            ) : (
              <span>{isSaving ? '저장 중...' : '결과 저장'}</span>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-brand-green/30 bg-white hover:bg-brand-beige/30 text-brand-brown text-xs font-medium flex items-center gap-1.5 transition-all"
            title="결과 인쇄 또는 PDF 저장"
          >
            <Printer className="w-3.5 h-3.5 text-brand-sage" />
            <span>결과 인쇄 / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl border border-brand-green/30 bg-white hover:bg-brand-beige/30 text-brand-brown text-xs font-medium flex items-center gap-1.5 transition-all"
            title="자가진단 링크 복사"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">링크 복사됨!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-brand-sage" />
                <span>링크 공유</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-brand-beige/50 hover:bg-brand-beige text-brand-brown text-xs font-bold flex items-center gap-1.5 transition-all ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 검사하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
