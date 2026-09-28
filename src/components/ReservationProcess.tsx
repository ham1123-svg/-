import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  ShieldCheck, 
  Coffee, 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  Smile, 
  Lock, 
  UserCheck, 
  Car, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface ProcessStep {
  step: string;
  stepNumber: number;
  stageName: string;
  title: string;
  subtitle: string;
  timeEstimate: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  iconBg: string;
  description: string;
  actions: string[];
  anxietyRelief: {
    worry: string;
    reassurance: string;
  };
  details: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    stepNumber: 1,
    stageName: '간편 예약',
    title: '부담 없는 일정 신청',
    subtitle: 'Easy & Private Booking',
    timeEstimate: '1~2분 소요',
    icon: CalendarCheck,
    accentColor: 'text-brand-sage',
    iconBg: 'bg-brand-sage/10 text-brand-sage border-brand-sage/25',
    description: '온라인 24시간 실시간 예약 또는 직통 전화(052-254-0230)로 원하시는 날짜와 시간대만 가볍게 선택해 주세요.',
    actions: [
      '온라인 예약 페이지에서 상담 유형(개인/부부/청소년/검사) 선택',
      '원하는 요일(평일 야간, 토요일 포함) 및 시간대 선택',
      '희망 진행 방식(대면 내원 또는 비대면 Zoom 화상) 체크'
    ],
    anxietyRelief: {
      worry: '복잡한 사연이나 고민을 미리 길게 적어야 하나요?',
      reassurance: '전혀 아닙니다. 마음의 짐을 글로 정리하실 필요 없이, 오직 성함과 일정만 남겨주시면 됩니다.'
    },
    details: [
      '별도의 회원가입 없이 비회원으로 간편 접수',
      '1일 5회 정원제 운영으로 대기 없는 1:1 단독 시간 확보',
      '직장인을 위한 평일 19:00 야간 및 토요일 세션 선택 가능'
    ]
  },
  {
    step: '02',
    stepNumber: 2,
    stageName: '사전 확정',
    title: '예약 확정 및 프라이빗 안내',
    subtitle: 'Confirmation & Safety Notice',
    timeEstimate: '당일 또는 24시간 내',
    icon: ShieldCheck,
    accentColor: 'text-emerald-700',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: '박미경 소장이 직접 일정을 확인한 후, 상세 오시는 길과 프라이빗 안내 문자를 정성껏 발송해 드립니다.',
    actions: [
      '예약 확정 문자/알림톡 발송 (주소, 전용 주차장 위치, 네비 링크)',
      '100% 비의료 비밀보장 및 개인정보 보호 서약 안내',
      '일정 변경 및 취소 규정 (24시간 전 100% 무료 변경) 전달'
    ],
    anxietyRelief: {
      worry: '회사나 건강보험 전산에 기록이 남아 불이익을 받지 않을까요?',
      reassurance: '병원 의료기관이 아니므로 건강보험공단 전산망이나 F코드(질병코드)가 일절 생성되지 않으며 완벽히 비밀이 보장됩니다.'
    },
    details: [
      '사전에 준비해 오셔야 할 서류나 검사표 전혀 없음',
      '동행인 없이 혼자 오셔도 온전히 안전하고 편안한 공간',
      '예약 전날 리마인드 알림으로 잊지 않도록 세심한 배려'
    ]
  },
  {
    step: '03',
    stepNumber: 3,
    stageName: '첫 방문',
    title: '프라이빗 라운지 따뜻한 맞이',
    subtitle: 'Warm Welcome & Private Lounge',
    timeEstimate: '세션 10분 전 도착 권장',
    icon: Coffee,
    accentColor: 'text-amber-700',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    description: '다른 내담자와 동선이 겹치지 않는 조용하고 독립된 대기실에서 따뜻한 유기농 웰컴티와 함께 긴장을 내려놓으실 수 있습니다.',
    actions: [
      '지상 전용 무료 주차 후 프라이빗 상담실 입장',
      '정서적 이완을 돕는 유기농 허브티 및 아로마 테라피 제공',
      '첫 방문 접수 확인 및 편안한 독립 대기실 휴식'
    ],
    anxietyRelief: {
      worry: '대기실에서 다른 사람이나 아는 사람과 마주치면 어색할 것 같아요.',
      reassurance: '1일 5회 완전 예약제로 내담자 간 30분 이상의 여유 간격을 두어 다른 분과 마주치지 않는 안심 동선을 보장합니다.'
    },
    details: [
      '차가운 병원 인테리어가 아닌, 아늑한 서재 같은 힐링 공간',
      '따뜻한 차를 마시며 편안하게 호흡을 가다듬을 수 있는 시간',
      '울산 KTX 역세권 인근으로 대중교통 및 자차 접근성 우수'
    ]
  },
  {
    step: '04',
    stepNumber: 4,
    stageName: '첫 상담',
    title: '1:1 심층 대화와 맞춤 회복 설계',
    subtitle: '50-Minute Safe Empathy Session',
    timeEstimate: '개인 50분 / 부부 80분',
    icon: HeartHandshake,
    accentColor: 'text-rose-700',
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    description: '교육학 박사이자 공인 1급 수련감독자인 박미경 소장과 안전한 독립 상담실에서 온전한 수용과 공감을 경험합니다.',
    actions: [
      '어디서부터 시작해도 좋은 자유롭고 편안한 1:1 대화',
      '판단과 비난 없는 경청을 통한 내면의 무게 덜어내기',
      '첫 회기 후 앞으로의 상담 주기 및 방향성에 대한 자율적 상의'
    ],
    anxietyRelief: {
      worry: '말을 조리 있게 잘하지 못하거나 눈물이 쏟아지면 어떡하죠?',
      reassurance: '조리 있게 설명하지 않으셔도 괜찮습니다. 침묵도, 눈물도 자연스러운 치유의 일부이며 소장님이 편안히 길잡이가 되어 드립니다.'
    },
    details: [
      '강요된 다회기 결제 없음 (첫 회기 후 지속 여부 자율 선택)',
      '내담자 고유의 속도와 회복탄력성을 존중하는 동행',
      '필요 시 정밀 심리검사(MMPI-2, TCI)와의 유기적 연계 제안'
    ]
  }
];

const COMMON_WORRIES = [
  {
    question: "Q. 첫 방문 때 어떤 옷을 입고 가야 하며, 지참할 서류가 있나요?",
    answer: "아무런 서류나 증명서 없이 평소 입으시는 가장 편안한 복장으로 오시면 됩니다. 긴장하지 마시고 산책하듯 편안한 발걸음으로 찾아와 주세요."
  },
  {
    question: "Q. 첫 상담을 받고 나서 무조건 다음 회기를 계속 계약해야 하나요?",
    answer: "절대 강요하지 않습니다. 초기 면담 1회를 온전히 받아보신 뒤, 소장님과의 케미와 상담의 효과를 직접 체감하신 후 지속 여부를 스스로 편안하게 결정하시면 됩니다."
  },
  {
    question: "Q. 제 고민이 너무 사소하거나, 반대로 너무 심각해서 창피할까 봐 걱정돼요.",
    answer: "임상 10,000시간을 함께해 온 박미경 소장에게 세상에 사소한 고통이란 없습니다. 그 어떤 아픔과 상처도 편견 없이 온전하게 존중받고 수용됩니다."
  }
];

export default function ReservationProcess({ className }: { className?: string }) {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const currentStepData = PROCESS_STEPS.find(s => s.stepNumber === selectedStep) || PROCESS_STEPS[0];

  return (
    <section 
      aria-label="상담 예약 및 첫 방문 안심 가이드"
      className={cn("py-20 sm:py-24 bg-white border-t border-brand-green/20 relative overflow-hidden", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-serif text-brand-sage uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reservation &amp; Visit Roadmap</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span>첫 상담이 망설여지는 분들을 위한</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            문턱을 낮추는 <span className="text-brand-sage">4단계 안심 동행 로드맵</span>
          </h2>

          <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
            "상담실 문을 열기까지 수없이 망설였을 당신의 용기를 압니다."<br className="hidden sm:inline" />
            예약 신청부터 상담실 문을 열고 마주 앉는 순간까지, 낯설고 불안한 마음이 들지 않도록 투명하게 동행합니다.
          </p>
        </div>

        {/* 4 Interactive Process Steps (Visual Connected Flow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 relative">
          {PROCESS_STEPS.map((stepItem) => {
            const Icon = stepItem.icon;
            const isSelected = selectedStep === stepItem.stepNumber;

            return (
              <motion.div
                key={stepItem.step}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedStep(stepItem.stepNumber)}
                className={cn(
                  "p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative text-left group",
                  isSelected
                    ? "bg-brand-beige/35 border-brand-sage/80 shadow-md ring-2 ring-brand-sage/20"
                    : "bg-white/90 hover:bg-brand-beige/15 border-brand-green/25 hover:border-brand-green/45 shadow-2xs"
                )}
              >
                <div>
                  {/* Top Step Number & Stage Name */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center border transition-colors",
                        isSelected
                          ? "bg-brand-sage text-white border-brand-sage"
                          : "bg-brand-beige/50 text-brand-brown/70 border-brand-green/20 group-hover:bg-brand-sage/10 group-hover:text-brand-sage"
                      )}>
                        {stepItem.step}
                      </span>
                      <span className="text-xs font-serif font-bold text-brand-brown/80">
                        {stepItem.stageName}
                      </span>
                    </div>

                    <span className="text-[11px] font-serif text-brand-brown/60 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-sage" />
                      <span>{stepItem.timeEstimate}</span>
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn(
                      "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all",
                      stepItem.iconBg
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-brand-brown leading-snug group-hover:text-brand-sage transition-colors">
                        {stepItem.title}
                      </h3>
                      <div className="text-[11px] font-serif text-brand-brown/50">
                        {stepItem.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Short description */}
                  <p className="text-xs text-brand-brown/75 font-serif leading-relaxed line-clamp-3 mb-4">
                    {stepItem.description}
                  </p>
                </div>

                {/* Bottom Reassurance Teaser */}
                <div className="pt-3 border-t border-brand-green/15 flex items-center justify-between text-xs font-serif">
                  <span className={cn(
                    "text-[11px] font-bold flex items-center gap-1",
                    isSelected ? "text-brand-sage" : "text-brand-brown/70 group-hover:text-brand-sage"
                  )}>
                    <Smile className="w-3.5 h-3.5 text-emerald-600" />
                    <span>안심 포인트 확인</span>
                  </span>

                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    isSelected ? "translate-x-1 text-brand-sage" : "text-brand-brown/40 group-hover:translate-x-0.5"
                  )} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Step Spotlight Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepData.stepNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-brand-beige/25 rounded-3xl border border-brand-green/30 p-6 sm:p-8 md:p-10 mb-12 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: What Happens (Actions & Details) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-serif text-brand-sage font-bold uppercase tracking-wider mb-1.5">
                    <span>STEP {currentStepData.step} 심층 안내</span>
                    <span aria-hidden="true" className="text-brand-brown/30">·</span>
                    <span>{currentStepData.stageName}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown leading-tight mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-brown/70 font-serif">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Concrete Steps list */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-brand-brown font-serif flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>이 단계에서 진행되는 구체적 과정:</span>
                  </div>
                  <div className="space-y-2">
                    {currentStepData.actions.map((act, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-brand-green/20 text-xs sm:text-sm text-brand-brown/85 font-serif shadow-2xs">
                        <span className="w-5 h-5 rounded-md bg-brand-beige/60 text-brand-brown/80 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional comfort details */}
                <div className="p-4 rounded-2xl bg-white/70 border border-brand-green/20 space-y-1.5">
                  <div className="text-[11px] font-bold text-brand-brown/60 uppercase font-serif mb-1">
                    내담자를 위한 세심한 배려:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-brand-brown/80">
                    {currentStepData.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-sage shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Anxiety Relief & Director's Promise Box */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Anxiety Relief Box */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-green/30 shadow-xs space-y-3.5">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-serif font-bold uppercase tracking-wide">
                    <HeartHandshake className="w-4 h-4 text-rose-600" />
                    <span>가장 많이 하시는 걱정 &amp; 안심 답변</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1.5">
                    <div className="text-xs font-bold text-rose-900 font-serif flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{currentStepData.anxietyRelief.worry}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="text-xs font-bold text-emerald-950 font-serif flex items-start gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>연구소의 안심 답변:</span>
                    </div>
                    <p className="text-xs font-serif text-emerald-900 leading-relaxed pl-5">
                      {currentStepData.anxietyRelief.reassurance}
                    </p>
                  </div>
                </div>

                {/* Director's Personal Promise Note */}
                <div className="p-5 rounded-3xl bg-brand-green/15 border border-brand-green/30 space-y-2.5 text-xs font-serif text-brand-brown/85">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/images/counselor_park.jpg" 
                      alt="박미경 소장" 
                      className="w-9 h-9 rounded-xl object-cover border border-brand-green/30 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-brand-brown text-xs">
                        박미경 소장의 약속
                      </div>
                      <div className="text-[10px] text-brand-brown/65">
                        교육학 박사 · 한국상담학회 1급 수련감독자
                      </div>
                    </div>
                  </div>

                  <p className="italic leading-relaxed text-brand-brown/80 pt-1 border-t border-brand-green/20">
                    "상담은 문제를 파헤쳐 비난하는 자리가 아닙니다. 내담자가 본래 지니고 있던 고유한 힘과 회복탄력성을 되찾도록 가장 따뜻하고 안전한 울타리가 되어 드리겠습니다."
                  </p>
                </div>

                {/* Next Step Selector Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedStep(prev => prev > 1 ? prev - 1 : 4)}
                    className="text-xs font-serif font-semibold text-brand-brown/60 hover:text-brand-brown transition-colors cursor-pointer"
                  >
                    ← 이전 단계
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStep(prev => prev < 4 ? prev + 1 : 1)}
                    className="text-xs font-serif font-bold text-brand-sage hover:text-brand-brown flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>다음 단계 ({selectedStep < 4 ? `STEP 0${selectedStep + 1}` : 'STEP 01'})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* 3 Common Worries & Answers (Expectation vs Reality Accordion/Cards) */}
        <div className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown mb-2">
              첫 상담 전, 머릿속을 맴도는 솔직한 질문들
            </h3>
            <p className="text-xs sm:text-sm text-brand-brown/70 font-serif">
              상담을 망설이게 만드는 가장 큰 마음의 허들을 걷어내 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMON_WORRIES.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 sm:p-6 rounded-3xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-brand-brown mb-3 leading-snug">
                    {item.question}
                  </h4>
                  <p className="text-xs text-brand-brown/75 font-serif leading-relaxed">
                    {item.answer}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-green/15 flex items-center gap-1.5 text-[11px] font-serif text-brand-sage font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% 안심 보장</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick First-Visit Readiness Checklist & Direct Reservation Action Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-brand-green/15 border border-brand-green/30 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-brown">
                첫 방문 준비물: <span className="text-brand-sage">오직 '내 마음을 돌보겠다는 용기' 하나뿐입니다</span>
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-serif text-brand-brown/80 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>지참 서류 일절 없음</span>
              </span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>편안한 평상복 착용</span>
              </span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-brand-sage" />
                <span>지상 무료 전용 주차</span>
              </span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>건강보험 전산 미등재</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:052-254-0230"
              className="px-5 py-3 rounded-2xl border border-brand-green/40 hover:bg-white text-brand-brown text-xs sm:text-sm font-bold font-serif transition-colors shadow-2xs flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-brand-sage" />
              <span>052-254-0230 전화 문의</span>
            </a>

            <Link
              to="/reservation"
              className="px-6 py-3 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold font-serif shadow-md transition-all flex items-center gap-2 active:scale-98"
            >
              <span>1:1 안심 상담 예약하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
