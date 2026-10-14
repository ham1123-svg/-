import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, Heart, BookOpen, User, ShieldCheck, 
  HelpCircle, ArrowDown, ChevronRight, AlertCircle, Smile, MessageSquareText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ClientTargetType } from '../types';

export interface TargetTypeMeta {
  type: ClientTargetType;
  title: string;
  ageRange: string;
  tagline: string;
  description: string;
  badgeText: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBorder: string;
  activeBg: string;
  subGroupLabel: string;
  subGroupOptions: string[];
  accompanimentLabel: string;
  accompanimentOptions: string[];
  priorExpOptions: string[];
  symptomChips: string[];
  recommendedCategory: string;
  notePlaceholder: string;
  counselorTip: string;
}

export const TARGET_META_MAP: Record<ClientTargetType, TargetTypeMeta> = {
  '아동': {
    type: '아동',
    title: '아동 상담',
    ageRange: '만 4세 ~ 만 12세',
    tagline: '영유아 및 초등학생 자녀',
    description: '놀이치료, 발달 및 정서 평가, 떼쓰기/공격성 훈육 코칭, 또래관계 및 부모 초기 면담',
    badgeText: '부모 초기 면담 포함',
    icon: Smile,
    accentColor: 'text-amber-700',
    activeBorder: 'border-amber-400 ring-2 ring-amber-400/30',
    activeBg: 'bg-amber-50/60',
    subGroupLabel: '아동 연령 및 발달 단계',
    subGroupOptions: [
      '영유아 (만 4~6세)',
      '초등 저학년 (1~3학년)',
      '초등 고학년 (4~6학년)'
    ],
    accompanimentLabel: '상담 시 동반 보호자',
    accompanimentOptions: [
      '부모님 모두 동반',
      '어머니만 동반',
      '아버지만 동반',
      '조부모 또는 기타 보호자'
    ],
    priorExpOptions: [
      '처음 상담 신청',
      '이전 발달/심리검사 경험 있음',
      '타 기관 놀이치료/상담 경험 있음'
    ],
    symptomChips: [
      '분리불안 · 등원/등교 거부',
      '주의산만 · 과잉행동 (ADHD 경향)',
      '공격성 · 떼쓰기 · 분노조절 어려움',
      '또래관계 · 사회성 부족',
      '위축 · 소심함 · 우울/불안',
      '발달 및 언어 표현 지연',
      '야뇨 · 배변 · 수면 어려움',
      '틱(Tic) 증상 의심',
      '부모-자녀 애착 및 양육 갈등',
      '기타 행동/정서 고민'
    ],
    recommendedCategory: '아동상담',
    notePlaceholder: '아이의 현재 상황이나 행동 특성, 상담사에게 미리 알리고 싶은 이야기를 편안하게 적어주세요. (예: 언제부터 시작되었는지, 어떤 순간에 특히 힘들어하는지 등)',
    counselorTip: '아동 상담은 첫 회기 부모 면담(30분) 및 아동 놀이 관찰(20분)로 입체적인 초기 평가를 진행합니다.'
  },
  '청소년': {
    type: '청소년',
    title: '청소년 상담',
    ageRange: '만 13세 ~ 만 18세',
    tagline: '중·고등학생 및 수험생',
    description: '학업·진로 스트레스, 교우관계 갈등, 부모 대화 단절, 감정조절, 스마트폰 과몰입, 자존감 회복',
    badgeText: '100% 비밀보장 원칙',
    icon: BookOpen,
    accentColor: 'text-indigo-700',
    activeBorder: 'border-indigo-400 ring-2 ring-indigo-400/30',
    activeBg: 'bg-indigo-50/60',
    subGroupLabel: '학교급 및 학년',
    subGroupOptions: [
      '중학교 1~2학년',
      '중학교 3학년',
      '고등학교 1~2학년',
      '고등학교 3학년 (수험생)',
      '학교 밖 청소년 / N수생'
    ],
    accompanimentLabel: '청소년 본인의 상담 참여 의지',
    accompanimentOptions: [
      '본인이 원해서 적극 신청',
      '부모님 권유로 동의하고 방문',
      '약간 망설여지나 이야기 나눠보고 싶음'
    ],
    priorExpOptions: [
      '처음 상담 신청',
      'Wee클래스 / 청소년상담복지센터 경험',
      '정신건강의학과 진료 또는 기타 상담 경험'
    ],
    symptomChips: [
      '학업 스트레스 · 시험 불안',
      '진로/진학 고민 · 미래 무기력감',
      '친구관계 갈등 · 따돌림 · 대인기피',
      '부모님과의 갈등 · 대화 단절',
      '스마트폰 · 게임 · SNS 과몰입',
      '우울감 · 감정기복 · 자책감',
      '불안 · 공황 · 신체화(두통/복통)',
      '분노 조절 · 충동성 · 자해 충동',
      '자아정체성 혼란 · 자존감 저하',
      '기타 학교/심리 고민'
    ],
    recommendedCategory: '개인상담',
    notePlaceholder: '학교생활이나 가정에서 겪고 있는 고민, 상담사에게 바라는 점을 편하게 적어주세요. (청소년 본인의 비밀이 철저히 보장됩니다)',
    counselorTip: '청소년 상담은 본인의 사생활과 비밀보장 권리를 최우선으로 존중하며 안전하고 비판 없는 환경을 보장합니다.'
  },
  '성인': {
    type: '성인',
    title: '성인 상담',
    ageRange: '만 19세 이상',
    tagline: '대학생 · 직장인 · 주부 · 중장년',
    description: '우울·무기력, 공황·불안, 직장 번아웃, 대인관계, 부부·가족 갈등, 자아탐색 및 1:1 심층 상담',
    badgeText: '1:1 독립 심층 세션',
    icon: User,
    accentColor: 'text-emerald-800',
    activeBorder: 'border-brand-sage ring-2 ring-brand-sage/30',
    activeBg: 'bg-brand-green/20',
    subGroupLabel: '연령대 및 생애주기',
    subGroupOptions: [
      '20대 (대학생 / 취업준비생 / 사회초년생)',
      '30대 (직장인 / 신혼 / 육아기)',
      '40대 (중년 / 커리어 / 가족 문제)',
      '50대 이상 (생애전환 / 은퇴 / 빈둥지)'
    ],
    accompanimentLabel: '희망 상담 형태',
    accompanimentOptions: [
      '1:1 개인 심층 심리상담',
      '부부 / 커플 동반 상담',
      '객관적 심리검사(MMPI-2/TCI) 병행',
      '직장인 EAP 심리지원 상담'
    ],
    priorExpOptions: [
      '심리상담 처음',
      '과거 심리상담 경험 있음',
      '정신건강의학과 진료/약물 병행 중'
    ],
    symptomChips: [
      '우울감 · 무기력 · 삶의 의미 상실',
      '공황장애 · 예기불안 · 과호흡',
      '직장 스트레스 · 번아웃(소진)',
      '대인관계 갈등 · 사회 불안',
      '부부 갈등 · 연인/이별 문제',
      '불면증 · 수면장애 · 만성 피로',
      '원가족 상처 · 내면아이 치유',
      '자존감 저하 · 자의식 과잉',
      '트라우마(PTSD) · 상실과 애도',
      '기타 일상 및 심리 고민'
    ],
    recommendedCategory: '개인상담',
    notePlaceholder: '현재 가장 마음이 무겁거나 상담을 통해 해결하고 싶은 핵심 고민을 적어주세요. (건강보험공단 기록 미등재, 100% 비밀 보장)',
    counselorTip: '성인 상담은 공인 1급 수련감독자 박미경 소장의 직강 및 100% 비의료 독립 상담으로 기록 걱정 없이 안심하실 수 있습니다.'
  }
};

interface ReservationIntakeSurveyProps {
  clientType: ClientTargetType;
  onSelectClientType: (type: ClientTargetType) => void;
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  subGroup: string;
  onChangeSubGroup: (val: string) => void;
  accompanimentOrMotivation: string;
  onChangeAccompaniment: (val: string) => void;
  priorExperience: string;
  onChangePriorExperience: (val: string) => void;
  detailedNote: string;
  onChangeDetailedNote: (val: string) => void;
  onProceedToSchedule?: () => void;
  recommendedProgramTitle?: string;
  className?: string;
}

export default function ReservationIntakeSurvey({
  clientType,
  onSelectClientType,
  selectedSymptoms,
  onToggleSymptom,
  subGroup,
  onChangeSubGroup,
  accompanimentOrMotivation,
  onChangeAccompaniment,
  priorExperience,
  onChangePriorExperience,
  detailedNote,
  onChangeDetailedNote,
  onProceedToSchedule,
  recommendedProgramTitle,
  className
}: ReservationIntakeSurveyProps) {
  const currentMeta = TARGET_META_MAP[clientType];

  return (
    <div className={cn("space-y-8", className)}>
      {/* Step 1: 대상자 유형 먼저 선택 (아동 / 청소년 / 성인) */}
      <section 
        aria-labelledby="intake-target-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-4 border-b border-brand-green/20">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sage text-white shadow-2xs">
                STEP 01
              </span>
              <span className="text-xs font-bold text-brand-sage tracking-wider uppercase">
                Target Selection
              </span>
            </div>
            <h2 id="intake-target-heading" className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
              상담 대상자 유형을 먼저 선택해 주세요
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-brown/70">
            대상자 유형에 맞춰 전문 상담 프로그램과 구체적인 사전 설문이 맞춤 제공됩니다.
          </p>
        </div>

        {/* 3 Interactive Target Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['아동', '청소년', '성인'] as ClientTargetType[]).map((type) => {
            const meta = TARGET_META_MAP[type];
            const isSelected = clientType === type;
            const Icon = meta.icon;

            return (
              <motion.button
                key={type}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectClientType(type)}
                className={cn(
                  "relative p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between group",
                  isSelected
                    ? cn("shadow-md", meta.activeBorder, meta.activeBg)
                    : "bg-brand-beige/10 hover:bg-white border-brand-green/25 hover:border-brand-sage/60 hover:shadow-xs"
                )}
                aria-pressed={isSelected}
              >
                <div>
                  {/* Top Badge & Age */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs",
                      isSelected
                        ? "bg-white text-brand-brown border-brand-green/30"
                        : "bg-white/80 text-brand-brown/60 border-brand-green/20"
                    )}>
                      {meta.ageRange}
                    </span>

                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-md",
                      isSelected
                        ? "bg-brand-sage text-white"
                        : "bg-brand-green/20 text-brand-brown/70"
                    )}>
                      {meta.badgeText}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs",
                      isSelected 
                        ? "bg-white text-brand-sage" 
                        : "bg-white text-brand-brown/70 border border-brand-green/20"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-brand-brown">
                        {meta.title}
                      </h3>
                      <p className="text-xs text-brand-brown/60 font-medium">
                        {meta.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-brand-brown/75 leading-relaxed line-clamp-2 mt-1">
                    {meta.description}
                  </p>
                </div>

                {/* Bottom Selection Indicator */}
                <div className="mt-4 pt-3 border-t border-brand-green/15 flex items-center justify-between text-xs">
                  <span className={cn(
                    "font-bold flex items-center gap-1",
                    isSelected ? "text-brand-sage" : "text-brand-brown/50 group-hover:text-brand-brown/80"
                  )}>
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>선택됨 (맞춤 설문 활성화)</span>
                      </>
                    ) : (
                      <span>선택하기</span>
                    )}
                  </span>
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    isSelected ? "translate-x-0.5 text-brand-sage" : "text-brand-brown/30 group-hover:translate-x-0.5"
                  )} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Step 2: 맞춤 사전 설문 (상담 내용 구체화) */}
      <AnimatePresence mode="wait">
        <motion.section 
          key={clientType}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          aria-labelledby="intake-survey-heading"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs space-y-7"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-brand-green/20">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sage text-white shadow-2xs">
                  STEP 02
                </span>
                <span className="text-xs font-bold text-brand-sage tracking-wider uppercase">
                  Pre-Consultation Survey
                </span>
              </div>
              <h2 id="intake-survey-heading" className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2 flex-wrap">
                <span>[{currentMeta.title}] 맞춤 사전 설문</span>
                <span className="text-xs sm:text-sm font-sans font-normal text-brand-brown/60">
                  (상담 내용 구체화)
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-brown/70">
              미리 체크해 주시면 첫 회기 초기 면담 시 더욱 정밀하고 신속한 맞춤 치유가 가능합니다.
            </p>
          </div>

          {/* 1. 주요 고민 및 호소 증상 태그 칩 선택 (복수 선택) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-bold text-brand-brown flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
                <span>주요 고민 및 호소 증상</span>
                <span className="text-xs font-normal text-brand-brown/60">(해당하는 항목을 모두 선택해 주세요)</span>
              </label>
              <span className="text-xs font-semibold text-brand-sage bg-brand-green/20 px-2.5 py-0.5 rounded-full">
                선택된 항목: <strong>{selectedSymptoms.length}</strong>개
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {currentMeta.symptomChips.map((chip) => {
                const isChecked = selectedSymptoms.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => onToggleSymptom(chip)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-95",
                      isChecked
                        ? "bg-brand-sage text-white border-brand-sage shadow-xs ring-2 ring-brand-sage/20"
                        : "bg-brand-beige/15 text-brand-brown/85 border-brand-green/25 hover:bg-brand-green/15 hover:border-brand-sage/50"
                    )}
                  >
                    <span className={cn(
                      "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] shrink-0",
                      isChecked ? "bg-white text-brand-sage font-bold" : "border border-brand-brown/30"
                    )}>
                      {isChecked ? '✓' : ''}
                    </span>
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 & 3. 세부 구분 & 동반/참여의지 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 세부 연령 / 학년 / 생애주기 */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-brand-brown flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sage"></span>
                <span>{currentMeta.subGroupLabel}</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {currentMeta.subGroupOptions.map((opt) => {
                  const isChecked = subGroup === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChangeSubGroup(opt)}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between",
                        isChecked
                          ? "bg-brand-green/25 text-brand-brown font-bold border-brand-sage ring-1 ring-brand-sage/30 shadow-2xs"
                          : "bg-white text-brand-brown/75 border-brand-green/25 hover:bg-brand-beige/30"
                      )}
                    >
                      <span>{opt}</span>
                      <span className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center text-[10px]",
                        isChecked ? "border-brand-sage bg-brand-sage text-white font-bold" : "border-brand-brown/30 bg-white"
                      )}>
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 동반 보호자 / 참여 의지 / 상담 형태 */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-brand-brown flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sage"></span>
                <span>{currentMeta.accompanimentLabel}</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {currentMeta.accompanimentOptions.map((opt) => {
                  const isChecked = accompanimentOrMotivation === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChangeAccompaniment(opt)}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between",
                        isChecked
                          ? "bg-brand-green/25 text-brand-brown font-bold border-brand-sage ring-1 ring-brand-sage/30 shadow-2xs"
                          : "bg-white text-brand-brown/75 border-brand-green/25 hover:bg-brand-beige/30"
                      )}
                    >
                      <span>{opt}</span>
                      <span className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center text-[10px]",
                        isChecked ? "border-brand-sage bg-brand-sage text-white font-bold" : "border-brand-brown/30 bg-white"
                      )}>
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. 이전 상담 / 심리검사 경험 유무 */}
          <div className="space-y-2.5 pt-2">
            <label className="text-sm font-bold text-brand-brown flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sage"></span>
              <span>이전 심리상담 또는 병원 진료 경험</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentMeta.priorExpOptions.map((opt) => {
                const isChecked = priorExperience === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChangePriorExperience(opt)}
                    className={cn(
                      "px-3.5 py-2.5 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer flex items-center justify-center gap-2",
                      isChecked
                        ? "bg-brand-sage text-white font-bold border-brand-sage shadow-xs"
                        : "bg-white text-brand-brown/75 border-brand-green/25 hover:bg-brand-beige/30"
                    )}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 상담사에게 미리 전하고 싶은 구체적인 이야기 (자유 서술) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="intake-detailed-note" className="text-sm font-bold text-brand-brown flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sage"></span>
                <span>상담사에게 미리 전하고 싶은 구체적인 이야기</span>
                <span className="text-xs font-normal text-brand-brown/60">(선택 사항)</span>
              </label>
              <span className="text-[11px] text-brand-brown/50">
                {detailedNote.length}자 / 최대 500자
              </span>
            </div>

            <textarea
              id="intake-detailed-note"
              rows={3}
              maxLength={500}
              placeholder={currentMeta.notePlaceholder}
              value={detailedNote}
              onChange={(e) => onChangeDetailedNote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-brand-green/30 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-none text-xs sm:text-sm bg-brand-beige/10 leading-relaxed placeholder:text-brand-brown/40 resize-y"
            />

            {/* Privacy Assurance & Counselor Tip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-brand-brown/70">
              <div className="flex items-center gap-1.5 text-brand-sage font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>건강보험공단 진료 기록 미등재 · 100% 철저한 비밀 보장</span>
              </div>
              <div className="text-[11px] text-brand-brown/60 italic font-serif">
                {currentMeta.counselorTip}
              </div>
            </div>
          </div>

          {/* Bottom Program Recommendation & Proceed to Calendar Link Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-beige/40 via-white to-brand-green/20 border border-brand-green/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-sage text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-brand-brown">
                  {currentMeta.title} 맞춤 프로그램 자동 연계
                </div>
                <div className="text-[11px] text-brand-brown/70">
                  {recommendedProgramTitle ? (
                    <span>추천 프로그램: <strong className="text-brand-sage">{recommendedProgramTitle}</strong></span>
                  ) : (
                    <span>선택하신 대상자({clientType})에 알맞은 프로그램을 아래 신청 폼에서 확인하실 수 있습니다.</span>
                  )}
                </div>
              </div>
            </div>

            {onProceedToSchedule && (
              <button
                type="button"
                onClick={onProceedToSchedule}
                className="px-4 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>3단계: 희망 일시 선택하기</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
