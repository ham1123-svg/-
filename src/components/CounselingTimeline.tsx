import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquareHeart, 
  CalendarClock, 
  FileSearch, 
  Sparkles, 
  HeartHandshake, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Clock,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { FAQCategory } from './FAQ';

export interface ProcessTimelineStep {
  id: string;
  stepNumber: number;
  stageBadge: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  summary: string;
  keyActivities: string[];
  deliverables: string;
  clientPreparation: string;
  relatedFaqCategory: FAQCategory;
  relatedFaqId: string;
  faqPromptText: string;
}

export const TIMELINE_STEPS: ProcessTimelineStep[] = [
  {
    id: 'step-inquiry',
    stepNumber: 1,
    stageBadge: 'STEP 01. 접수 & 소통',
    title: '초기 문의 및 사전 접수',
    subtitle: 'Initial Inquiry & Pre-Intake',
    duration: '10~15분 소요 (상시 접수)',
    icon: <MessageSquareHeart className="w-6 h-6" />,
    accentColor: 'text-brand-sage',
    bgColor: 'bg-brand-sage/10 border-brand-sage/30',
    summary: '온라인 간편 예약 신청 또는 대표 전화(052-254-0230)를 통해 방문 희망 일시와 주 호소 문제를 접수합니다.',
    keyActivities: [
      '온라인 예약 폼 작성 또는 직통 전화 접수',
      '상담 유형 선택 (개인 / 부부·가족 / 청소년 / 심리검사)',
      '대면(내원) 또는 비대면(화상/전화) 희망 방식 선택',
      '원하는 요일 및 시간대 조율 (1일 5회 정원제)'
    ],
    deliverables: '상담실 안내 문자, 오시는 길 및 무료 주차 안내, 사전 확인서 전송',
    clientPreparation: '특별한 사전 서류 준비 없이 편안한 마음으로 문의해 주시면 됩니다.',
    relatedFaqCategory: 'PROCESS',
    relatedFaqId: 'faq-process-4',
    faqPromptText: '첫 방문 시 무엇을 준비해야 하나요?'
  },
  {
    id: 'step-schedule',
    stepNumber: 2,
    stageBadge: 'STEP 02. 일정 확정 & 비밀보장',
    title: '일정 확정 및 비밀보장 서약',
    subtitle: 'Scheduling & Confidentiality Pledge',
    duration: '예약 확정 즉시',
    icon: <CalendarClock className="w-6 h-6" />,
    accentColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    summary: '상담 일정을 확정하고, 내담자의 신상과 대화 내용이 안전하게 보호됨을 확인하는 공식 서약 절차를 준비합니다.',
    keyActivities: [
      '1일 5회 정원제에 따른 독립 상담 시간 100% 확보',
      '내담자 간 동선이 겹치지 않도록 전후 20분 완충 시간 배정',
      '한국상담학회 윤리강령에 의거한 100% 비밀보장 원칙 사전 안내',
      '병원 F코드(의료보험 질병기록) 미생성 원칙 확인'
    ],
    deliverables: '예약 확정 알림톡/문자, 방문 전 주의사항 안내',
    clientPreparation: '일정 변경이 필요하실 경우 예약 24시간 전까지 연락 주시면 100% 무료 변경 가능합니다.',
    relatedFaqCategory: 'PRIVACY',
    relatedFaqId: 'faq-privacy-1',
    faqPromptText: '상담 기록이 병원이나 건강보험공단에 남나요?'
  },
  {
    id: 'step-intake',
    stepNumber: 3,
    stageBadge: 'STEP 03. 1~2회기 면담',
    title: '초기 면담 및 심층 평가',
    subtitle: 'Intake Assessment & Goal Setting',
    duration: '1회기 50분 (부부 80분)',
    icon: <FileSearch className="w-6 h-6" />,
    accentColor: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    summary: '교육학 박사 박미경 소장님과 1:1로 직접 마주하여 현재의 주 호소 문제, 정서적 상태, 성장 배경을 종합적으로 탐색합니다.',
    keyActivities: [
      '심리적 안전감을 주는 라포(Rapport) 형성 및 경청',
      '현재 겪는 심리적 고통의 촉발 요인과 기저 원인 파악',
      '필요시 객관적 심리평가(MMPI-2, TCI, 부부관계검사 등) 병행',
      '내담자와 함께 구체적인 상담 목표(Goal) 및 방향성 합의'
    ],
    deliverables: '심리 상태에 대한 전문적 피드백 및 맞춤 상담 계획 제안',
    clientPreparation: '솔직하고 편안하게 마음속 이야기를 꺼내놓으실 수 있는 편안한 복장 권장',
    relatedFaqCategory: 'PROCESS',
    relatedFaqId: 'faq-process-1',
    faqPromptText: '상담은 어떤 절차로 진행되나요?'
  },
  {
    id: 'step-regular',
    stepNumber: 4,
    stageBadge: 'STEP 04. 3회기 이후',
    title: '정기 심층 심리상담 진행',
    subtitle: 'In-depth Therapeutic Counseling',
    duration: '주 1회 정기 세션 (단기 4~8회 / 심층 15회+)',
    icon: <Sparkles className="w-6 h-6" />,
    accentColor: 'text-sky-700',
    bgColor: 'bg-sky-50 border-sky-200',
    summary: '합의된 목표를 바탕으로 인지왜곡 교정, 정서 조절, 대화법 코칭, 내면아이 치유 등 근본적인 심리 회복 작업을 진행합니다.',
    keyActivities: [
      '인지정서행동치료(REBT) 및 게슈탈트, 대상관계 통합 접근',
      '부부/가족: 비난-방어의 악순환 단절 및 안전한 애착 소통 훈련',
      '일상 생활에서 적용할 수 있는 실천 과제(Homework) 점검 및 코칭',
      '회기별 심리적 진전도 모니터링 및 필요시 전략 재조정'
    ],
    deliverables: '자가 감정 관리 일지, 일상 소통 가이드라인, 회기별 성찰 기록',
    clientPreparation: '상담실에서 나눈 통찰을 일상에서 한 걸음씩 시도해 보는 열린 태도',
    relatedFaqCategory: 'PROCESS',
    relatedFaqId: 'faq-process-2',
    faqPromptText: '상담은 보통 몇 회기 정도 받아야 하나요?'
  },
  {
    id: 'step-termination',
    stepNumber: 5,
    stageBadge: 'STEP 05. 목표 달성 & 합의',
    title: '상담 종결 및 성장 평가',
    subtitle: 'Consolidation & Termination',
    duration: '종결 회기 (1회기 50분)',
    icon: <HeartHandshake className="w-6 h-6" />,
    accentColor: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    summary: '초기에 세운 목표의 달성도를 점검하고, 상담 과정에서 얻은 내면의 힘과 문제 해결 자원을 확고히 다지는 합의 종결을 진행합니다.',
    keyActivities: [
      '상담 시작 시점 대비 심리적 척도 및 정서 안정도 재평가',
      '새롭게 형성된 긍정적 사고 패턴과 관계 대처 방식 강화',
      '재발 방지 계획 수립 및 미래 예상 스트레스 대처 전략 점검',
      '충분한 상호 감사의 나눔과 따뜻한 작별 의식'
    ],
    deliverables: '상담 종결 요약서(희망 시) 및 자가 심리 건강 관리 지침',
    clientPreparation: '그동안의 변화 여정을 되돌아보고 스스로를 격려하는 마음가짐',
    relatedFaqCategory: 'PROCESS',
    relatedFaqId: 'faq-process-1',
    faqPromptText: '종결은 언제 어떻게 이루어지나요?'
  },
  {
    id: 'step-followup',
    stepNumber: 6,
    stageBadge: 'STEP 06. 사후 관리',
    title: '사후 관리 및 부스터 세션 (Follow-up)',
    subtitle: 'Post-Care & Booster Check-up',
    duration: '종결 후 1~3개월 후 (필요 시 예약)',
    icon: <Compass className="w-6 h-6" />,
    accentColor: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    summary: '상담 종결 후 일상생활 적응 상태를 확인하고, 새로운 스트레스 상황에 흔들리지 않도록 정기적인 사후 관리와 부스터 세션을 지원합니다.',
    keyActivities: [
      '종결 1~3개월 후 일상 적응도 모니터링 안부 연락 및 체크',
      '새로운 삶의 전환기(이직, 출산, 승진, 퇴직 등) 맞춤 부스터 세션 제공',
      '지속 가능한 심리적 웰빙을 위한 행복바람 오픈 상담 자원 지원',
      '위기 발생 시 우선 예약 창구 항시 개방'
    ],
    deliverables: '사후 심리 점검 체크리스트 및 핫라인 연결 창구',
    clientPreparation: '언제든 마음의 휴식이 필요할 때 다시 편안하게 문을 두드려주시면 됩니다.',
    relatedFaqCategory: 'PROCESS',
    relatedFaqId: 'faq-process-1',
    faqPromptText: '종결 이후에도 다시 찾아갈 수 있나요?'
  }
];

interface CounselingTimelineProps {
  onSelectFaqCategory?: (category: FAQCategory, faqId?: string) => void;
  className?: string;
}

export default function CounselingTimeline({
  onSelectFaqCategory,
  className = ''
}: CounselingTimelineProps) {
  const [activeStepId, setActiveStepId] = useState<string>('step-inquiry');
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);

  const activeStep = TIMELINE_STEPS.find(s => s.id === activeStepId) || TIMELINE_STEPS[0];

  const handleFaqNavigation = (category: FAQCategory, faqId: string) => {
    if (onSelectFaqCategory) {
      onSelectFaqCategory(category, faqId);
    }
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold tracking-wider uppercase border border-brand-sage/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Step-by-Step Counseling Journey</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown">
          초기 문의부터 사후 관리까지 <span className="text-brand-sage">전 과정 한눈에 보기</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-brand-brown/75 leading-relaxed font-serif">
          행복바람은 첫 예약 문의부터 초기 심층 평가, 정기 상담, 합의 종결 및 사후 관리(Follow-up)까지<br className="hidden sm:inline" />
          철저한 비밀보장과 1일 5회 정원제 원칙 아래 투명하고 체계적인 6단계 로드맵으로 함께합니다.
        </p>
      </div>

      {/* Interactive Horizontal Timeline Navigation (Desktop & Tablet) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-green/30 shadow-xs">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {TIMELINE_STEPS.map((step, idx) => {
            const isActive = step.id === activeStepId;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex-1 min-w-[120px] sm:min-w-0 p-3 sm:p-4 rounded-2xl transition-all text-left flex flex-col items-center sm:items-start gap-2 cursor-pointer border group",
                    isActive
                      ? "bg-brand-sage text-white border-brand-sage shadow-sm scale-[1.02]"
                      : "bg-brand-beige/20 hover:bg-brand-green/20 text-brand-brown border-brand-green/20"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn(
                      "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-colors",
                      isActive ? "bg-white/20 text-white" : "bg-white text-brand-sage border border-brand-green/30"
                    )}>
                      0{step.stepNumber}
                    </span>
                    <span className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                      isActive ? "text-white" : step.accentColor
                    )}>
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <div className={cn(
                      "text-xs sm:text-sm font-bold truncate leading-tight",
                      isActive ? "text-white" : "text-brand-brown"
                    )}>
                      {step.title}
                    </div>
                    <div className={cn(
                      "text-[11px] truncate mt-0.5 font-serif",
                      isActive ? "text-white/80" : "text-brand-brown/60"
                    )}>
                      {step.stageBadge.split('. ')[1] || step.stageBadge}
                    </div>
                  </div>
                </button>

                {idx < TIMELINE_STEPS.length - 1 && (
                  <div className="hidden xl:flex items-center justify-center text-brand-green/40 shrink-0 px-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Featured Active Stage Detailed Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-brand-green/30 shadow-md p-6 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Stage Identification */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border", activeStep.bgColor, activeStep.accentColor)}>
                  {activeStep.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-sage uppercase tracking-wider block">
                    {activeStep.stageBadge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                    {activeStep.title}
                  </h3>
                  <p className="text-xs text-brand-brown/55 font-mono">
                    {activeStep.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-brown">
                  <Clock className="w-4 h-4 text-brand-sage" />
                  <span>예상 소요 시간 / 회기 주기</span>
                </div>
                <p className="text-xs text-brand-brown/80 font-serif leading-relaxed">
                  {activeStep.duration}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-brown">
                  <ShieldCheck className="w-4 h-4 text-brand-sage" />
                  <span>내담자 안심 보증</span>
                </div>
                <p className="text-xs text-brand-brown/80 font-serif leading-relaxed">
                  교육학 박사 박미경 소장 1:1 직접 진행 &amp; 100% 철저한 비밀보장
                </p>
              </div>

              {/* Connected FAQ Jump Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleFaqNavigation(activeStep.relatedFaqCategory, activeStep.relatedFaqId)}
                  className="w-full p-3.5 rounded-2xl bg-white hover:bg-brand-sage/5 border border-brand-green/40 hover:border-brand-sage text-left flex items-center justify-between gap-3 group transition-all shadow-2xs cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-brand-sage block">
                        관련 FAQ 바로 확인하기
                      </span>
                      <span className="text-xs text-brand-brown/80 font-medium group-hover:text-brand-brown transition-colors">
                        "{activeStep.faqPromptText}"
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-brand-sage/60 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>
            </div>

            {/* Right Column: Detailed Workflow & Concrete Tasks */}
            <div className="lg:col-span-8 space-y-6">
              {/* Summary */}
              <div className="bg-brand-green/10 p-5 rounded-2xl border border-brand-green/20">
                <h4 className="text-xs font-bold text-brand-sage uppercase tracking-wider mb-1">
                  단계 개요 및 핵심 목표
                </h4>
                <p className="text-sm sm:text-base text-brand-brown font-serif leading-relaxed">
                  {activeStep.summary}
                </p>
              </div>

              {/* Concrete Key Activities */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-brand-brown flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-sage" />
                  <span>진행되는 핵심 상담 활동 (Key Activities)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeStep.keyActivities.map((act, aIdx) => (
                    <div 
                      key={aIdx} 
                      className="p-3.5 rounded-xl bg-white border border-brand-green/20 shadow-2xs flex items-start gap-2.5 text-xs text-brand-brown/85 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables & Client Preparation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-brand-beige/25 border border-brand-green/20 space-y-1.5">
                  <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    제공 및 안내 사항
                  </span>
                  <p className="text-xs text-brand-brown/75 leading-relaxed font-serif">
                    {activeStep.deliverables}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-beige/25 border border-brand-green/20 space-y-1.5">
                  <span className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-brand-sage" />
                    내담자 준비 및 유의 사항
                  </span>
                  <p className="text-xs text-brand-brown/75 leading-relaxed font-serif">
                    {activeStep.clientPreparation}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Call-to-Actions for This Stage */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-brand-green/20">
                <div className="text-xs text-brand-brown/65">
                  궁금한 점이 있으신가요? 전화 문의 시 친절히 안내해 드립니다.
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:052-254-0230"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-brand-beige/40 text-brand-brown text-xs font-bold border border-brand-green/30 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-brand-sage" />
                    <span>052-254-0230</span>
                  </a>
                  <Link
                    to="/reservation"
                    className="px-4 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>온라인 예약 신청</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Visual Timeline Cards Grid (All 6 Steps at a glance) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-brand-brown flex items-center gap-2">
            <span>6단계 전 과정 상세 로드맵 펼쳐보기</span>
            <span className="text-xs font-normal text-brand-brown/60">
              (각 단계를 클릭하여 자세한 정보와 FAQ를 바로 확인하세요)
            </span>
          </h3>
          <span className="text-xs font-semibold text-brand-sage">
            총 6단계 (1~6)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIMELINE_STEPS.map((step) => {
            const isSelected = step.id === activeStepId;
            const isDetailOpen = expandedDetailId === step.id;

            return (
              <div
                key={step.id}
                className={cn(
                  "bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between group",
                  isSelected
                    ? "border-brand-sage shadow-md ring-2 ring-brand-sage/20"
                    : "border-brand-green/30 hover:border-brand-sage/50 shadow-xs"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage border border-brand-sage/20">
                      {step.stageBadge}
                    </span>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", step.bgColor, step.accentColor)}>
                      {step.icon}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-brand-brown mb-1 group-hover:text-brand-sage transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-brand-brown/55 font-mono mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed mb-4 line-clamp-3">
                    {step.summary}
                  </p>

                  <div className="text-[11px] text-brand-brown/70 bg-brand-beige/30 p-2.5 rounded-xl border border-brand-green/20 mb-4 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                    <span className="font-semibold">{step.duration}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-brand-green/15">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveStepId(step.id)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer",
                        isSelected
                          ? "bg-brand-sage text-white shadow-2xs"
                          : "bg-brand-beige/40 hover:bg-brand-green/30 text-brand-brown"
                      )}
                    >
                      {isSelected ? "선택됨 (상단 상세 보기)" : "상세 보기 선택"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFaqNavigation(step.relatedFaqCategory, step.relatedFaqId)}
                      title="관련 FAQ로 바로 이동"
                      aria-label={`${step.title} 관련 FAQ 이동`}
                      className="p-2 rounded-xl bg-white hover:bg-brand-green/20 border border-brand-green/30 text-brand-sage transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedDetailId(isDetailOpen ? null : step.id)}
                    className="w-full text-[11px] text-brand-brown/65 hover:text-brand-sage flex items-center justify-center gap-1 py-1 font-medium transition-colors cursor-pointer"
                  >
                    <span>{isDetailOpen ? "간략히 닫기" : "활동 목록 미리보기"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isDetailOpen && "rotate-180")} />
                  </button>

                  {isDetailOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2 space-y-1.5 text-xs text-brand-brown/80"
                    >
                      {step.keyActivities.map((act, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-brand-sage shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
