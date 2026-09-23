import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Compass, 
  BarChart3, 
  Sparkles, 
  Heart, 
  Smile, 
  ArrowUpRight, 
  Info, 
  Zap, 
  Layers,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

// Categories for counseling satisfaction breakdown
export type SatisfactionCategoryKey = 'all' | 'adult' | 'couple' | 'youth' | 'anxiety';

interface MetricDimension {
  key: string;
  name: string;
  fullName: string;
  before: number; // 0 ~ 100
  after: number;  // 0 ~ 100
  benchmark: number; // standard 80
  clientVoice: string;
  clinicalEffect: string;
}

interface CategoryDataset {
  label: string;
  description: string;
  sampleCount: number;
  overallSatisfaction: number;
  recommendationRate: number;
  positiveChangeRate: number;
  dimensions: MetricDimension[];
}

const SATISFACTION_DATASETS: Record<SatisfactionCategoryKey, CategoryDataset> = {
  all: {
    label: '전체 상담 종합 (500인)',
    description: '행복바람 심리상담연구소 종결 내담자 500인의 사후 설문조사 및 표준 임상 척도 분석 결과입니다.',
    sampleCount: 528,
    overallSatisfaction: 98.6,
    recommendationRate: 98.8,
    positiveChangeRate: 94.2,
    dimensions: [
      {
        key: 'emotional',
        name: '정서 안정',
        fullName: '정서 안정 & 불안 완화',
        before: 38,
        after: 91,
        benchmark: 80,
        clientVoice: '“가슴을 짓누르던 원인 모를 불안과 초조감이 사라지고, 편안한 일상 호흡을 되찾았습니다.”',
        clinicalEffect: '자율신경계 과각성 상태 완화 및 감정 조절 능력 정상화'
      },
      {
        key: 'selfEsteem',
        name: '자아 존중감',
        fullName: '자아 존중감 & 효능감',
        before: 41,
        after: 89,
        benchmark: 80,
        clientVoice: '“타인의 평가에 휘둘리며 나를 비난하던 습관에서 벗어나, 스스로를 온전히 인정하게 되었습니다.”',
        clinicalEffect: '비합리적 자기 비하 신념 수정 및 내적 통제 소재 확립'
      },
      {
        key: 'relationship',
        name: '대인관계/소통',
        fullName: '대인관계 & 소통 만족도',
        before: 44,
        after: 88,
        benchmark: 80,
        clientVoice: '“갈등이 생기면 회피하거나 폭발했었는데, 이제는 차분히 내 감정과 욕구를 표현합니다.”',
        clinicalEffect: '비폭력 대화법(NVC) 체득 및 건강한 심리적 경계선 수립'
      },
      {
        key: 'sleepVitality',
        name: '수면/신체활력',
        fullName: '수면의 질 & 신체 활력',
        before: 36,
        after: 87,
        benchmark: 80,
        clientVoice: '“밤새 뒤척이던 만성 불면과 두통이 완화되어, 아침에 개운하게 일어날 수 있습니다.”',
        clinicalEffect: '스트레스 호르몬 감소 및 신체 이완 루틴 정착을 통한 수면 위생 개선'
      },
      {
        key: 'resilience',
        name: '스트레스 대처',
        fullName: '스트레스 대처 & 회복탄력성',
        before: 40,
        after: 92,
        benchmark: 80,
        clientVoice: '“예기치 못한 위기 상황에서도 주저앉지 않고 차분히 해결책을 찾아가는 힘이 생겼습니다.”',
        clinicalEffect: '문제 해결 중심 인지 재구조화 및 스트레스 완충 자원 확보'
      },
      {
        key: 'lifeSatisfaction',
        name: '삶의 만족/희망',
        fullName: '삶의 만족도 & 미래 희망',
        before: 39,
        after: 94,
        benchmark: 80,
        clientVoice: '“내일이 두렵고 무기력했던 삶에서, 다시 꿈을 꾸고 주도적으로 살아갈 용기를 얻었습니다.”',
        clinicalEffect: '자기 효능감 회복 및 주체적 삶의 목표 지향성 확립'
      }
    ]
  },
  adult: {
    label: '성인 번아웃 · 우울',
    description: '직장인 직무 스트레스, 번아웃 증후군, 만성 무기력 및 경도 우울을 경험한 성인 내담자 분석 데이터입니다.',
    sampleCount: 184,
    overallSatisfaction: 98.9,
    recommendationRate: 99.1,
    positiveChangeRate: 95.1,
    dimensions: [
      {
        key: 'emotional',
        name: '정서 안정',
        fullName: '정서 안정 & 무기력 완화',
        before: 35,
        after: 90,
        benchmark: 80,
        clientVoice: '“출근길 숨막힘과 알 수 없는 눈물이 멈추고 감정의 평온을 되찾았습니다.”',
        clinicalEffect: '감정 소진 상태 회복 및 자비로운 자기 수용 태도 정착'
      },
      {
        key: 'selfEsteem',
        name: '자아 존중감',
        fullName: '자아 가치감 & 번아웃 극복',
        before: 38,
        after: 88,
        benchmark: 80,
        clientVoice: '“일의 성과가 곧 내 존재 가치가 아님을 깨닫고 마음에 여유가 생겼습니다.”',
        clinicalEffect: '성과 만능주의 탈피 및 자아 정체성의 다각화'
      },
      {
        key: 'relationship',
        name: '대인관계/소통',
        fullName: '직장 대인관계 & 심리적 경계',
        before: 46,
        after: 87,
        benchmark: 80,
        clientVoice: '“무리한 요구를 거절하지 못해 끙끙 앓던 제가 명확하게 경계를 긋게 되었습니다.”',
        clinicalEffect: '과잉 책임감 탈피 및 건강한 자기주장 훈련 완성'
      },
      {
        key: 'sleepVitality',
        name: '수면/신체활력',
        fullName: '수면 리듬 & 피로 회복',
        before: 32,
        after: 89,
        benchmark: 80,
        clientVoice: '“주말 내내 누워만 있어도 피곤하던 몸이 산책과 가벼운 운동을 즐기게 되었습니다.”',
        clinicalEffect: '신체적 탈진 회복 및 건강한 주말 쉼 루틴 형성'
      },
      {
        key: 'resilience',
        name: '스트레스 대처',
        fullName: '직무 스트레스 대응력',
        before: 37,
        after: 93,
        benchmark: 80,
        clientVoice: '“상사의 피드백에 일희일비하지 않고 객관적으로 상황을 분리해 봅니다.”',
        clinicalEffect: '인지 분리(Cognitive Defusion) 및 탈중심화 능력 증진'
      },
      {
        key: 'lifeSatisfaction',
        name: '삶의 만족/희망',
        fullName: '일-삶의 균형 (워라밸)',
        before: 36,
        after: 92,
        benchmark: 80,
        clientVoice: '“퇴근 후 온전한 제 삶을 누리는 행복이 무엇인지 알게 되었습니다.”',
        clinicalEffect: '삶의 우선순위 재정립 및 지속 가능한 라이프스타일 구축'
      }
    ]
  },
  couple: {
    label: '부부 및 가족 관계',
    description: '의사소통 단절, 반복되는 비난과 상처, 이혼 위기 및 가족 내 갈등을 겪은 부부·가족 내담자 분석 데이터입니다.',
    sampleCount: 112,
    overallSatisfaction: 98.2,
    recommendationRate: 98.5,
    positiveChangeRate: 93.8,
    dimensions: [
      {
        key: 'emotional',
        name: '정서 안정',
        fullName: '가정 내 정서적 안전감',
        before: 42,
        after: 89,
        benchmark: 80,
        clientVoice: '“집에 들어가는 것 자체가 지옥 같았는데, 이제는 따뜻한 보금자리로 느껴집니다.”',
        clinicalEffect: '가정 내 정서적 긴장 완화 및 안정 애착 기저 형성'
      },
      {
        key: 'selfEsteem',
        name: '자아 존중감',
        fullName: '배우자로부터의 상호 인정',
        before: 48,
        after: 86,
        benchmark: 80,
        clientVoice: '“늘 무시당한다고 느꼈는데 서로의 노고를 인정하고 감사하게 되었습니다.”',
        clinicalEffect: '피해 의식 완화 및 상호 존중 상호작용 강화'
      },
      {
        key: 'relationship',
        name: '대인관계/소통',
        fullName: '부부 비폭력 대화 & 공감',
        before: 33,
        after: 93,
        benchmark: 80,
        clientVoice: '“말만 섞으면 싸우던 저희가 비난 대신 ‘내 속마음’을 먼저 털어놓게 되었습니다.”',
        clinicalEffect: '역기능적 의사소통 4대 독소(비난·방어·경멸·담쌓기) 제거'
      },
      {
        key: 'sleepVitality',
        name: '수면/신체활력',
        fullName: '정서적 스트레스 완화',
        before: 45,
        after: 85,
        benchmark: 80,
        clientVoice: '“밤마다 가슴이 답답해 각방을 쓰던 갈등이 풀려 편안히 잠듭니다.”',
        clinicalEffect: '부부간 신체적·정서적 거리감 좁힘 및 긴장 완화'
      },
      {
        key: 'resilience',
        name: '스트레스 대처',
        fullName: '갈등 조율 및 합의력',
        before: 41,
        after: 90,
        benchmark: 80,
        clientVoice: '“의견 차이가 생겨도 파국으로 치닫지 않고 둘만의 룰대로 조율합니다.”',
        clinicalEffect: '부부 협상 프로토콜 및 타임아웃 규칙 확립'
      },
      {
        key: 'lifeSatisfaction',
        name: '삶의 만족/희망',
        fullName: '가족 화목도 & 친밀감',
        before: 40,
        after: 94,
        benchmark: 80,
        clientVoice: '“이혼 서류까지 생각했던 저희 부부가 다시 손을 잡고 주말 데이트를 합니다.”',
        clinicalEffect: '가족 항상성 회복 및 긍정적 정서 연결망 재건'
      }
    ]
  },
  youth: {
    label: '청소년 및 학업 스트레스',
    description: '등교 거부, 학업 압박, 또래 관계 단절, 사춘기 반항 및 부모-자녀 갈등을 극복한 아동·청소년 내담자 분석 데이터입니다.',
    sampleCount: 126,
    overallSatisfaction: 98.4,
    recommendationRate: 98.9,
    positiveChangeRate: 94.6,
    dimensions: [
      {
        key: 'emotional',
        name: '정서 안정',
        fullName: '청소년 정서 안정 & 불안 해소',
        before: 34,
        after: 89,
        benchmark: 80,
        clientVoice: '“시험 때만 되면 배가 아프고 숨이 가빴는데, 편안하게 시험에 임했습니다.”',
        clinicalEffect: '수행 불안 감소 및 자기 진정(Self-Soothing) 기술 습득'
      },
      {
        key: 'selfEsteem',
        name: '자아 존중감',
        fullName: '자기 효능감 & 학업 자존감',
        before: 36,
        after: 91,
        benchmark: 80,
        clientVoice: '“‘난 구제불능이야’라고 생각했던 아이가 다시 목표를 세우고 책상에 앉습니다.”',
        clinicalEffect: '학습된 무기력 탈피 및 성장 마인드셋(Growth Mindset) 장착'
      },
      {
        key: 'relationship',
        name: '대인관계/소통',
        fullName: '부모-자녀 공감 대화',
        before: 40,
        after: 88,
        benchmark: 80,
        clientVoice: '“방문을 쾅 닫고 말 한마디 안 하던 아이가 학교 이야기를 먼저 시작했습니다.”',
        clinicalEffect: '청소년 자율성 존중 및 부모의 경청 코칭을 통한 신뢰 회복'
      },
      {
        key: 'sleepVitality',
        name: '수면/신체활력',
        fullName: '식습관 및 수면 정상화',
        before: 42,
        after: 86,
        benchmark: 80,
        clientVoice: '“밤새 스마트폰만 보며 불면증에 시달리던 생활 패턴이 안정되었습니다.”',
        clinicalEffect: '도파민 디톡스 및 생체 리듬 정상화 유도'
      },
      {
        key: 'resilience',
        name: '스트레스 대처',
        fullName: '또래 관계 갈등 극복력',
        before: 35,
        after: 89,
        benchmark: 80,
        clientVoice: '“친구들의 말 한마디에 상처받아 위축되던 아이가 당당하게 표현합니다.”',
        clinicalEffect: '사회적 기술 훈련 및 거절에 대한 민감성 완화'
      },
      {
        key: 'lifeSatisfaction',
        name: '삶의 만족/희망',
        fullName: '진로 동기 & 학교 적응',
        before: 38,
        after: 93,
        benchmark: 80,
        clientVoice: '“등교를 거부하던 아이가 친구들과 웃으며 교문을 들어서는 기적이 일어났습니다.”',
        clinicalEffect: '학교 적응력 복원 및 자발적 진로 탐색 동기 부여'
      }
    ]
  },
  anxiety: {
    label: '불안 · 공황 · 자존감',
    description: '공황 발작, 사회 공포증, 광장 공포, 극심한 자기 비하와 대인 예민성을 호소하던 내담자 분석 데이터입니다.',
    sampleCount: 106,
    overallSatisfaction: 99.0,
    recommendationRate: 99.3,
    positiveChangeRate: 96.2,
    dimensions: [
      {
        key: 'emotional',
        name: '정서 안정',
        fullName: '공황 완화 & 신체 증상 안정',
        before: 29,
        after: 91,
        benchmark: 80,
        clientVoice: '“지하철과 엘리베이터를 탈 때마다 오던 심장 두근거림이 완벽히 조절됩니다.”',
        clinicalEffect: '공황 파국화 인지 수정 및 점진적 노출을 통한 뇌 편도체 안정화'
      },
      {
        key: 'selfEsteem',
        name: '자아 존중감',
        fullName: '핵심 자존감 & 자기 수용',
        before: 35,
        after: 90,
        benchmark: 80,
        clientVoice: '“내 약점과 상처까지 따뜻하게 안아줄 수 있는 용기가 생겼습니다.”',
        clinicalEffect: '완벽주의적 초자아 완화 및 자기자비(Self-Compassion) 체화'
      },
      {
        key: 'relationship',
        name: '대인관계/소통',
        fullName: '사회 불안 극복 & 시선 자유',
        before: 42,
        after: 86,
        benchmark: 80,
        clientVoice: '“남들의 시선이 더 이상 무섭지 않아 회의에서 편안하게 발언합니다.”',
        clinicalEffect: '조명 효과(Spotlight Effect) 왜곡 수정 및 안전 행동 소거'
      },
      {
        key: 'sleepVitality',
        name: '수면/신체활력',
        fullName: '신체 이완 및 깊은 수면',
        before: 31,
        after: 88,
        benchmark: 80,
        clientVoice: '“항상 긴장해 굳어있던 어깨가 풀리고 수면제 없이 숙면을 취합니다.”',
        clinicalEffect: '점진적 근육 이완법(PMR) 및 복식호흡을 통한 자율신경 균형'
      },
      {
        key: 'resilience',
        name: '스트레스 대처',
        fullName: '불안 내성 & 예기불안 차단',
        before: 34,
        after: 91,
        benchmark: 80,
        clientVoice: '“‘또 발작이 오면 어쩌지’ 하던 예기불안의 악순환을 스스로 끊어냅니다.”',
        clinicalEffect: '예기불안 인지 오류 차단 및 즉각 대처 기술 습득'
      },
      {
        key: 'lifeSatisfaction',
        name: '삶의 만족/희망',
        fullName: '일상 행동 반경 확장 & 활력',
        before: 33,
        after: 92,
        benchmark: 80,
        clientVoice: '“방 안에만 갇혀 있던 제가 혼자 비행기를 타고 여행을 다녀왔습니다.”',
        clinicalEffect: '회피 행동 전면 중단 및 활동적 삶의 영역 전면 회복'
      }
    ]
  }
};

export default function ClientSatisfactionAnalytics() {
  const { isHighContrast } = useHighContrast();
  const [selectedCategory, setSelectedCategory] = useState<SatisfactionCategoryKey>('all');
  const [chartView, setChartView] = useState<'radar' | 'bar'>('radar');
  const [activeDimensionKey, setActiveDimensionKey] = useState<string>('emotional');

  const currentDataset = useMemo(() => {
    return SATISFACTION_DATASETS[selectedCategory];
  }, [selectedCategory]);

  const activeDimension = useMemo(() => {
    return (
      currentDataset.dimensions.find((d) => d.key === activeDimensionKey) ||
      currentDataset.dimensions[0]
    );
  }, [currentDataset, activeDimensionKey]);

  // Average score before and after
  const avgBefore = useMemo(() => {
    const sum = currentDataset.dimensions.reduce((acc, cur) => acc + cur.before, 0);
    return (sum / currentDataset.dimensions.length).toFixed(1);
  }, [currentDataset]);

  const avgAfter = useMemo(() => {
    const sum = currentDataset.dimensions.reduce((acc, cur) => acc + cur.after, 0);
    return (sum / currentDataset.dimensions.length).toFixed(1);
  }, [currentDataset]);

  const avgImprovement = useMemo(() => {
    return (Number(avgAfter) - Number(avgBefore)).toFixed(1);
  }, [avgAfter, avgBefore]);

  return (
    <div className={cn(
      "rounded-3xl p-6 sm:p-9 border mb-10 transition-all",
      isHighContrast
        ? "bg-black text-white border-white"
        : "bg-gradient-to-br from-white via-brand-beige/20 to-brand-sage/5 border-brand-green/25 shadow-sm"
    )}>
      {/* 1. Header Title & Scientific Basis */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 mb-6 border-b border-brand-green/20">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-brand-sage/15 text-brand-sage text-xs font-bold flex items-center gap-1.5 border border-brand-sage/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>실제 내담자 임상 척도 사후 분석</span>
            </span>
            <span className="text-[11px] text-brand-brown/60 font-medium">
              (한국상담심리학회 윤리 기준 준수 · 익명 표본 n={currentDataset.sampleCount})
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
            <span>고객 만족도 및 심리적 변화 분석 리포트</span>
          </h3>
          <p className="text-xs sm:text-sm text-brand-brown/75 mt-1 max-w-2xl leading-relaxed">
            행복바람 심리상담연구소에서 종결된 내담자분들의 상담 전·후 변화를 6대 핵심 심리 척도로 다각도 분석하여 시각화했습니다.
          </p>
        </div>

        {/* View Mode Toggle Switcher: Radar vs Bar */}
        <div className="flex items-center p-1 bg-white/90 rounded-2xl border border-brand-green/25 shadow-2xs self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setChartView('radar')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              chartView === 'radar'
                ? "bg-brand-brown text-white shadow-xs"
                : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
            )}
            aria-label="방사형 레이더 차트로 보기"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>방사형 레이더 차트</span>
          </button>
          <button
            type="button"
            onClick={() => setChartView('bar')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              chartView === 'bar'
                ? "bg-brand-brown text-white shadow-xs"
                : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
            )}
            aria-label="상담 전후 비교 바 차트로 보기"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>상담 전·후 비교 바 차트</span>
          </button>
        </div>
      </div>

      {/* 2. Key Satisfaction Metric Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        {/* Card 1: Overall Satisfaction */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/20 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-brand-brown/60 uppercase tracking-wider">
              종합 상담 만족도
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-brown">
              {currentDataset.overallSatisfaction}%
            </span>
            <span className="text-[11px] text-amber-700 font-bold">5점 만점 환산 4.93</span>
          </div>
          <p className="text-[10px] text-brand-brown/60 mt-1">상담 과정 및 시설 종합 만족</p>
        </div>

        {/* Card 2: Average Score Increase */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/20 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-brand-brown/60 uppercase tracking-wider">
              6대 심리 척도 향상도
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-sage">
              +{avgImprovement}점
            </span>
            <span className="text-[11px] text-brand-brown/50">
              {avgBefore}점 → {avgAfter}점
            </span>
          </div>
          <p className="text-[10px] text-emerald-800 font-medium mt-1">평균 +129% 긍정 호전율</p>
        </div>

        {/* Card 3: Positive Change Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/20 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-brand-brown/60 uppercase tracking-wider">
              일상 회복 체감률
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smile className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-brown">
              {currentDataset.positiveChangeRate}%
            </span>
            <span className="text-[11px] text-blue-700 font-bold">증상 완화</span>
          </div>
          <p className="text-[10px] text-brand-brown/60 mt-1">불안 완화 및 정상 생활 복귀</p>
        </div>

        {/* Card 4: Recommendation Intent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/20 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-brand-brown/60 uppercase tracking-wider">
              지인 및 가족 추천율
            </span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-rose-600">
              {currentDataset.recommendationRate}%
            </span>
            <span className="text-[11px] text-rose-700 font-bold">추천 의사</span>
          </div>
          <p className="text-[10px] text-brand-brown/60 mt-1">신뢰 기반 지인 추천 1위</p>
        </div>
      </div>

      {/* 3. Category Filter Buttons */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Layers className="w-4 h-4 text-brand-sage" />
          <span className="text-xs font-bold text-brand-brown">
            고민 및 상담 유형별 분석 선택:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SATISFACTION_DATASETS) as SatisfactionCategoryKey[]).map((key) => {
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer",
                  isSelected
                    ? "bg-brand-sage text-white border-brand-sage shadow-xs ring-2 ring-brand-sage/20"
                    : "bg-white text-brand-brown/70 border-brand-green/25 hover:border-brand-sage/60 hover:text-brand-brown"
                )}
              >
                <span>{SATISFACTION_DATASETS[key].label}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-brand-brown/60 mt-2">
          * {currentDataset.description}
        </p>
      </div>

      {/* Screen Reader Accessible Data Summary */}
      <div className="sr-only">
        <h4>상담 전후 6대 심리 척도 비교표 (스크린 리더용)</h4>
        <table>
          <caption>{currentDataset.label} 내담자 변화 분석</caption>
          <thead>
            <tr>
              <th scope="col">심리 척도 영역</th>
              <th scope="col">상담 전 점수 (100점 만점)</th>
              <th scope="col">상담 후 점수 (100점 만점)</th>
              <th scope="col">상승폭</th>
              <th scope="col">건강 표준선</th>
            </tr>
          </thead>
          <tbody>
            {currentDataset.dimensions.map((d) => (
              <tr key={d.key}>
                <th scope="row">{d.fullName}</th>
                <td>{d.before}점</td>
                <td>{d.after}점</td>
                <td>+{d.after - d.before}점</td>
                <td>{d.benchmark}점</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Chart & Deep Dive Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Interactive Visual (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-brand-green/20 shadow-2xs relative">
          {/* Chart Sub-header and Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-brand-green/15 text-xs">
            <span className="font-bold text-brand-brown flex items-center gap-1.5">
              {chartView === 'radar' ? (
                <>
                  <Compass className="w-4 h-4 text-brand-sage" />
                  <span>6대 심리 균형 방사형 다이어그램</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 text-brand-sage" />
                  <span>상담 전 vs 상담 후 점수 비교 막대그래프</span>
                </>
              )}
            </span>

            {/* Custom Visual Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500 opacity-80" />
                <span className="text-brand-brown/70 font-medium">상담 전 (Before)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#6B8E7B] border border-[#527161]" />
                <span className="text-brand-brown font-bold">상담 후 (After)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-[#8ba697]" />
                <span className="text-brand-brown/50">건강기준 (80점)</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="w-full h-[320px] sm:h-[360px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'radar' ? (
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="72%" 
                  data={currentDataset.dimensions}
                  className="focus:outline-none"
                >
                  <PolarGrid stroke="#6B8E7B" strokeOpacity={0.25} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: '#4A3E3D', fontSize: 11, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#4A3E3D', fontSize: 10, opacity: 0.5 }}
                  />
                  {/* Standard Health Benchmark (80 pts) */}
                  <Radar
                    name="건강 표준선 (80점)"
                    dataKey="benchmark"
                    stroke="#8ba697"
                    strokeDasharray="4 4"
                    fill="#6B8E7B"
                    fillOpacity={0.06}
                  />
                  {/* Before Counseling (Red/Orange area) */}
                  <Radar
                    name="상담 전 상태"
                    dataKey="before"
                    stroke="#f87171"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    fill="#f87171"
                    fillOpacity={0.25}
                  />
                  {/* After Counseling (Sage Green area) */}
                  <Radar
                    name="상담 후 회복"
                    dataKey="after"
                    stroke="#6B8E7B"
                    strokeWidth={2.5}
                    fill="#6B8E7B"
                    fillOpacity={0.45}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as MetricDimension;
                        const change = item.after - item.before;
                        return (
                          <div className="bg-brand-brown text-white p-3 rounded-xl shadow-lg text-xs max-w-xs border border-brand-green/30">
                            <p className="font-bold text-sm text-amber-300 mb-1">
                              {item.fullName}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-[11px] mb-1.5 pb-1.5 border-b border-white/15">
                              <div>
                                <span className="text-white/60 block">상담 전:</span>
                                <span className="font-bold text-rose-300">{item.before}점</span>
                              </div>
                              <div>
                                <span className="text-white/60 block">상담 후:</span>
                                <span className="font-bold text-emerald-300">{item.after}점 (+{change}점)</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-white/80 leading-snug">
                              {item.clinicalEffect}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              ) : (
                <BarChart
                  data={currentDataset.dimensions}
                  margin={{ top: 20, right: 15, left: -15, bottom: 25 }}
                  className="focus:outline-none"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#6B8E7B" strokeOpacity={0.15} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4A3E3D', fontSize: 11, fontWeight: 700 }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#4A3E3D', fontSize: 10, opacity: 0.6 }}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as MetricDimension;
                        const change = item.after - item.before;
                        return (
                          <div className="bg-brand-brown text-white p-3 rounded-xl shadow-lg text-xs max-w-xs border border-brand-green/30">
                            <p className="font-bold text-sm text-amber-300 mb-1">{item.fullName}</p>
                            <div className="space-y-1 text-[11px] mb-1.5 pb-1.5 border-b border-white/15">
                              <div className="flex justify-between">
                                <span className="text-white/70">상담 전:</span>
                                <span className="font-bold text-rose-300">{item.before}점</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">상담 후:</span>
                                <span className="font-bold text-emerald-300">{item.after}점</span>
                              </div>
                              <div className="flex justify-between text-amber-300 font-bold">
                                <span>호전도:</span>
                                <span>+{change}점 ({Math.round((change / item.before) * 100)}% 증가)</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-white/80 leading-snug">{item.clientVoice}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="before" 
                    name="상담 전" 
                    fill="#fca5a5" 
                    radius={[6, 6, 0, 0]} 
                  />
                  <Bar 
                    dataKey="after" 
                    name="상담 후" 
                    fill="#6B8E7B" 
                    radius={[6, 6, 0, 0]} 
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2 border-t border-brand-green/10 flex items-center justify-between text-[11px] text-brand-brown/60">
            <span>* 차트 영역을 호버하거나 탭하면 상세 수치를 확인할 수 있습니다.</span>
            <span className="font-bold text-brand-sage">100점 만점 기준</span>
          </div>
        </div>

        {/* Right: Interactive 6-Dimension Selector & Clinical Insight (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-brown uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>영역별 세부 변화 확인 (클릭)</span>
              </span>
              <span className="text-[11px] text-brand-brown/50">
                {currentDataset.dimensions.length}개 지표
              </span>
            </div>

            {/* Quick Dimension Pill Selectors */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {currentDataset.dimensions.map((dim) => {
                const isSelected = activeDimensionKey === dim.key;
                const change = dim.after - dim.before;
                return (
                  <button
                    key={dim.key}
                    type="button"
                    onClick={() => setActiveDimensionKey(dim.key)}
                    className={cn(
                      "p-2.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between",
                      isSelected
                        ? "bg-white border-brand-sage shadow-xs ring-2 ring-brand-sage/20"
                        : "bg-white/60 border-brand-green/15 hover:bg-white text-brand-brown/70 hover:text-brand-brown"
                    )}
                  >
                    <span className="text-xs font-bold truncate text-brand-brown mb-1">
                      {dim.name}
                    </span>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-brand-brown/50">{dim.before} → {dim.after}점</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        +{change}점
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Selected Dimension Spotlight Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-brand-green/15">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                    핵심 치유 척도
                  </span>
                  <h4 className="text-base font-bold font-serif text-brand-brown mt-1">
                    {activeDimension.fullName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-brown/50 block">종합 호전도</span>
                  <span className="text-lg font-extrabold text-emerald-700 font-serif">
                    +{activeDimension.after - activeDimension.before}점
                  </span>
                </div>
              </div>

              {/* Progress bar visual for selected metric */}
              <div className="mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-brand-brown/70">
                  <span>상담 전: {activeDimension.before}점</span>
                  <span className="font-bold text-brand-sage">상담 후: {activeDimension.after}점 / 100</span>
                </div>
                <div className="w-full h-3 bg-brand-beige rounded-full overflow-hidden flex relative">
                  {/* Before marker bar */}
                  <div 
                    style={{ width: `${activeDimension.before}%` }}
                    className="h-full bg-rose-300"
                    title={`상담 전 ${activeDimension.before}점`}
                  />
                  {/* Improvement delta bar */}
                  <div 
                    style={{ width: `${activeDimension.after - activeDimension.before}%` }}
                    className="h-full bg-brand-sage"
                    title={`상담 후 +${activeDimension.after - activeDimension.before}점 회복`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-brand-brown/50">
                  <span>0점 (극심한 고통)</span>
                  <span className="text-[#6B8E7B] font-bold">건강선 80점</span>
                  <span>100점 (완전한 평온)</span>
                </div>
              </div>

              {/* Real Client Voice Quote */}
              <div className="p-3 rounded-xl bg-brand-beige/40 border border-brand-green/15 text-xs text-brand-brown mb-2.5">
                <span className="text-[10px] font-bold text-brand-sage block mb-1">
                  내담자가 직접 증언한 변화:
                </span>
                <p className="italic leading-relaxed text-[11px] font-medium text-brand-brown/85">
                  {activeDimension.clientVoice}
                </p>
              </div>

              {/* Professional Clinical Insight */}
              <div className="text-[11px] text-brand-brown/75 flex items-start gap-1.5 bg-brand-sage/5 p-2.5 rounded-xl border border-brand-sage/15">
                <Info className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>임상적 평가:</strong> {activeDimension.clinicalEffect}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom 4-Item Quality Assurance Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/70 border border-brand-green/15 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-brand-brown block text-[11px]">비밀보장 준수율</span>
                <span className="text-[10px] text-brand-brown/60">100% 무결성 유지</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-brand-green/15 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-sage shrink-0" />
              <div>
                <span className="font-bold text-brand-brown block text-[11px]">상담사 공감 지수</span>
                <span className="text-[10px] text-brand-brown/60">99.5% 긍정 응답</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
