import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CalendarCheck, 
  MessageSquareHeart, 
  FileText,
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Smile, 
  Users, 
  Briefcase, 
  GraduationCap, 
  User, 
  Award,
  RefreshCw,
  Check,
  ListChecks,
  Compass,
  Star,
  Lock,
  RotateCcw,
  Zap,
  Info,
  CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export type ConcernType = 'INDIVIDUAL' | 'COUPLE' | 'BURNOUT' | 'YOUTH' | 'ASSESSMENT' | 'CORPORATE_EAP';

export type CounselingServiceKey = 
  | 'ALL'             // 전체 기본 로드맵
  | 'INDIVIDUAL'      // 개인 심리상담 (청소년 & 성인 1:1)
  | 'COUPLES'         // 부부 및 가족상담
  | 'ASSESSMENT'      // 종합심리검사 (Full Battery)
  | 'YOUTH'           // 청소년 및 아동상담
  | 'CORPORATE_EAP';  // 기업 및 기관 EAP 상담

export interface CounselingServiceInfo {
  key: CounselingServiceKey;
  label: string;
  shortLabel: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryStep: number;
  coreSteps: number[];
  targetAudience: string;
  highlightReason: string;
  recommendedDuration: string;
}

export const COUNSELING_SERVICES: CounselingServiceInfo[] = [
  {
    key: 'ALL',
    label: '전체 기본 절차',
    shortLabel: '전체 플로우',
    badge: '표준 5단계 치유 로드맵',
    icon: Compass,
    primaryStep: 1,
    coreSteps: [1, 2, 3, 4, 5],
    targetAudience: '상담 전체 이용 과정과 표준 흐름을 확인하고 싶으신 분',
    highlightReason: '접수부터 초기면담, 검사, 심층치료, 사후관리까지의 5단계 표준 치유 로드맵입니다.',
    recommendedDuration: '개인 50분 / 부부 80분'
  },
  {
    key: 'INDIVIDUAL',
    label: '개인 심리상담',
    shortLabel: '개인상담',
    badge: '1:1 심층 정서 치유 & 자아 회복',
    icon: User,
    primaryStep: 2,
    coreSteps: [2, 4],
    targetAudience: '우울, 불안, 만성 스트레스, 자존감 저하, 대인관계 상처 치유',
    highlightReason: '개인 심리상담은 안전한 라포를 형성하는 [STEP 02: 1:1 초기면담]과 내면 근육을 강화하는 [STEP 04: 심층 치료]가 핵심 단계입니다.',
    recommendedDuration: '1회 50분 (주 1회 정기 세션)'
  },
  {
    key: 'COUPLES',
    label: '부부 및 가족상담',
    shortLabel: '부부·가족',
    badge: '부부 갈등 중재 & 건강한 애착 소통',
    icon: Users,
    primaryStep: 2,
    coreSteps: [2, 4],
    targetAudience: '반복되는 부부 싸움, 소통 단절, 성격 차이, 외도 상처, 가족 갈등',
    highlightReason: '부부상담은 중립적 공간에서 두 사람의 상호작용 역동을 파악하는 [STEP 02: 부부 초기면담(80분)]과 [STEP 04: 비폭력 대화 실습]이 중심입니다.',
    recommendedDuration: '1회 80분 심층 세션'
  },
  {
    key: 'ASSESSMENT',
    label: '종합심리검사',
    shortLabel: '심리검사',
    badge: '지능·정서·기질 과학적 정밀 진단',
    icon: FileText,
    primaryStep: 3,
    coreSteps: [3],
    targetAudience: '나의 타고난 기질과 성격, 인지 기능 및 정서 상태를 객관적으로 파악하고 싶은 분',
    highlightReason: '종합심리검사 서비스는 표준화 검사(MMPI-2, TCI 등) 및 교육학 박사의 1:1 정밀 해석 상담이 이루어지는 [STEP 03: 심리검사]가 핵심 단계입니다.',
    recommendedDuration: '검사 40~60분 + 전문 해석 상담 50분'
  },
  {
    key: 'YOUTH',
    label: '청소년 및 아동상담',
    shortLabel: '청소년·아동',
    badge: '학업·교우 스트레스 & 부모 코칭',
    icon: GraduationCap,
    primaryStep: 2,
    coreSteps: [2, 3],
    targetAudience: '학업 스트레스, 등교 거부, 또래 갈등, 사춘기 반항, 정서 불안 청소년 및 학부모',
    highlightReason: '청소년 상담은 자녀의 속마음을 듣는 [STEP 02: 자녀 면담(40분)+부모 피드백(10분)]과 객관적 발달을 짚는 [STEP 03: 기질/학습검사]가 연계됩니다.',
    recommendedDuration: '1회 50분 (자녀 40분 + 양육자 10분)'
  },
  {
    key: 'CORPORATE_EAP',
    label: '기업 및 기관 EAP',
    shortLabel: '기업 EAP',
    badge: '100% 비공개 직무 소진 & 번아웃 케어',
    icon: Briefcase,
    primaryStep: 4,
    coreSteps: [1, 4],
    targetAudience: '직무 스트레스, 번아웃(탈진), 직장 내 대인관계 갈등, 임직원 심리적 소진',
    highlightReason: '기업 EAP 상담은 회사에 절대 통보되지 않는 [STEP 01: 100% 비공개 접수]와 빠른 직무 복귀를 돕는 [STEP 04: 단기 솔루션 심층치료]가 핵심입니다.',
    recommendedDuration: '1회 50분 (단기 4~8회기 집중 솔루션)'
  }
];

export const SERVICE_STEP_TAGS: Record<CounselingServiceKey, Record<number, { tag: string; isCore: boolean; customSubtitle: string }>> = {
  ALL: {
    1: { tag: '01단계: 접수 & 예약', isCore: false, customSubtitle: '접수 및 일정 확정' },
    2: { tag: '02단계: 초기 면담', isCore: false, customSubtitle: '1:1 심층 면담 & 목표 수립' },
    3: { tag: '03단계: 심리 검사', isCore: false, customSubtitle: '객관적 심리평가 & 과학적 진단' },
    4: { tag: '04단계: 심층 상담', isCore: false, customSubtitle: '정기 심층 치료 & 회복 체화' },
    5: { tag: '05단계: 사후 관리', isCore: false, customSubtitle: '목표 달성 종결 & 부스터 케어' },
  },
  INDIVIDUAL: {
    1: { tag: '독립 세션 예약', isCore: false, customSubtitle: '1인 독립 세션 확보 (F코드 무등록)' },
    2: { tag: '★ 핵심: 1:1 라포 형성', isCore: true, customSubtitle: '박사 소장 1:1 심층 경청 & 치유 목표' },
    3: { tag: '선택형 정서 검사', isCore: false, customSubtitle: '기질(TCI) 및 정서 상태 진단' },
    4: { tag: '★ 핵심: 내면 근육 강화', isCore: true, customSubtitle: '인지왜곡 교정 & 자아 존중감 회복' },
    5: { tag: '자가 심리 핸드북', isCore: false, customSubtitle: '평생 소장 자가 심리 관리 가이드' },
  },
  COUPLES: {
    1: { tag: '부부 동반 일정 조율', isCore: false, customSubtitle: '토요일/야간 부부 동반 슬롯 확보' },
    2: { tag: '★ 핵심: 부부 갈등 역동 (80분)', isCore: true, customSubtitle: '중립적 환경에서 부부 상호작용 심층 평가' },
    3: { tag: '부부 기질 상호 비교', isCore: false, customSubtitle: '두 사람의 TCI 기질 프로파일 대조' },
    4: { tag: '★ 핵심: 비폭력 대화 훈련', isCore: true, customSubtitle: '안전한 정서 중심 부부 애착 대화 실습' },
    5: { tag: '가정 소통 규칙 확립', isCore: false, customSubtitle: '갈등 재발 방지 부부 협력 매뉴얼' },
  },
  ASSESSMENT: {
    1: { tag: '사전 질문지 수령', isCore: false, customSubtitle: '온라인 사전 검사 및 평가 일정 확보' },
    2: { tag: '호소 문제 정밀 파악', isCore: false, customSubtitle: '임상적 증상에 맞춘 검사군 선별' },
    3: { tag: '★ 핵심: 종합심리평가 & 1:1 해석', isCore: true, customSubtitle: 'MMPI-2, TCI 등 풀배터리 객관적 진단' },
    4: { tag: '검사 기반 타깃 치료', isCore: false, customSubtitle: '기질적 취약점 보완 집중 심층 세션' },
    5: { tag: '정밀 결과지 영구 소장', isCore: false, customSubtitle: '종합 결과 프로파일 리포트 제공' },
  },
  YOUTH: {
    1: { tag: '자녀 거부감 완화 접수', isCore: false, customSubtitle: '방과후/주말 청소년 안심 일정 예약' },
    2: { tag: '★ 핵심: 자녀 면담+부모 피드백', isCore: true, customSubtitle: '자녀 1:1(40분) + 양육자 피드백(10분)' },
    3: { tag: '★ 핵심: 기질 & 학습 평가', isCore: true, customSubtitle: '청소년 인성(MMPI-A) & 학습 기질 진단' },
    4: { tag: '자존감 & 또래 적응', isCore: false, customSubtitle: '부정 감정 해소 및 학교 생활 코칭' },
    5: { tag: '가정 내 소통 문화 정착', isCore: false, customSubtitle: '부모-자녀 지지형 환경 점검' },
  },
  CORPORATE_EAP: {
    1: { tag: '★ 핵심: 100% 사내 비공개 접수', isCore: true, customSubtitle: '회사에 일절 통보 없는 익명 비밀 보장' },
    2: { tag: '직무 스트레스 긴급 진단', isCore: false, customSubtitle: '업무 소진 및 조직 갈등 요인 탐색' },
    3: { tag: '번아웃 척도 객관 평가', isCore: false, customSubtitle: '심리적 방전 상태 및 스트레스 척도 측정' },
    4: { tag: '★ 핵심: 단기 솔루션 코칭', isCore: true, customSubtitle: '업무 경계선 구축 & 회복탄력성 강화' },
    5: { tag: '지속 가능한 워라밸 유지', isCore: false, customSubtitle: '직무 복귀 적응도 및 비상 핫라인 지원' },
  },
};

export interface InfographicStep {
  id: string;
  stepNumber: number;
  stageName: string;
  stageNameEn: string;
  flowTitle: string;
  title: string;
  shortDesc: string;
  durationText: string;
  phaseGoal: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  keyActivities: string[];
  deliverables: string[];
  safetyGuarantees: string[];
  prepTip: string;
  checklistItems: string[];
  actionLabel: string;
  actionUrl: string;
  scenarioExamples: Record<ConcernType, {
    focus: string;
    action: string;
    outcome: string;
  }>;
}

export const COUNSELING_INFOGRAPHIC_STEPS: InfographicStep[] = [
  {
    id: 'application',
    stepNumber: 1,
    stageName: '신청 및 예약',
    stageNameEn: 'Application',
    flowTitle: '접수 및 일정 확정',
    title: '신청 및 프라이빗 일정 확정',
    shortDesc: '온라인 대화형 캘린더 또는 직통 전화를 통해 원하는 일정을 간편하게 선택하고 1인 독립 세션을 확보합니다.',
    durationText: '신청 1~2분 소요 · 당일 확정',
    phaseGoal: '내담자의 심리적 안정감 확보, 1일 5회 정원제 독립 세션 예약 및 100% 비의료 비밀보장 서약',
    icon: CalendarCheck,
    accentColor: '#10b981',
    bgLight: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-700',
    checklistItems: [
      '온라인 캘린더에서 실시간 잔여 슬롯(평일 야간/토요일 포함) 확인',
      '상담 유형(개인 심리 / 부부·가족 / 심리검사 / 청소년 / 기업) 선택',
      '희망 진행 방식(독립 대면 내원 또는 비대면 Zoom 화상) 지정',
      '예약 완료 후 전송되는 확정 알림톡 및 오시는 길(무료 주차 안내) 확인'
    ],
    actionLabel: '대화형 캘린더로 예약하기',
    actionUrl: '/reservation',
    keyActivities: [
      '온라인 캘린더에서 실시간 잔여 슬롯(평일 야간/토요일 포함) 확인 후 선택',
      '상담 유형 선택 (개인 심리 / 부부·가족 / 심리검사 / 청소년 / 기업)',
      '진행 방식 선택 (편안한 독립 대면 내원 또는 비대면 Zoom 화상)',
      '박미경 소장이 직접 일정 확인 후 프라이빗 확인 문자 발송'
    ],
    deliverables: [
      '예약 확정 안내문 및 오시는 길(KTX역세권 지상 전용 무료 주차)',
      '100% 비의료 기록(건강보험 F코드 미생성) 비밀보장 확인서',
      '방문 24시간 전 리마인드 알림톡'
    ],
    safetyGuarantees: [
      '회원가입 없이 비회원으로 간편 접수 가능',
      '1일 5회 완전 예약제로 내담자 간 동선이 절대 겹치지 않는 안심 동선 보장',
      '24시간 전 연락 시 100% 무료 일정 변경 지원'
    ],
    prepTip: '사전에 복잡한 고민 내용을 길게 적거나 서류를 준비하실 필요가 없습니다. 편안한 마음으로 일정만 잡아주세요.',
    scenarioExamples: {
      INDIVIDUAL: {
        focus: '우울·불안·자존감 회복 일정 확보',
        action: '내가 가장 편안하게 이야기할 수 있는 주간 또는 퇴근 후 야간 시간대 선택',
        outcome: '단독 대기실과 독립 상담실 100% 확보 및 안심 안내문 수신'
      },
      COUPLE: {
        focus: '부부 동반 방문 가능 일정 조율',
        action: '두 분 모두 시간 여유가 있는 주말(토요일) 또는 평일 저녁 80분 세션 신청',
        outcome: '서로 비난하지 않고 마주 앉을 수 있는 중립적 안전 공간 확정'
      },
      BURNOUT: {
        focus: '긴급한 정서적 휴식 및 일정 확보',
        action: '업무 스트레스가 극에 달했을 때 대기 없이 바로 가능한 가장 빠른 슬롯 예약',
        outcome: '회사나 인사팀에 절대 통보되지 않는 100% 비공개 상담 시간 확정'
      },
      YOUTH: {
        focus: '청소년 및 학부모 동반 일정 접수',
        action: '방과 후 또는 주말 시간대 지정 및 자녀의 심리적 저항감을 낮추는 사전 안내',
        outcome: '자녀가 심리적 거부감 없이 방문할 수 있도록 친절한 사전 접수 완료'
      },
      ASSESSMENT: {
        focus: '종합심리검사 희망일 및 사전 작성 질문지 수령',
        action: '지능·정서·기질 통합 검사를 위한 일정 예약 및 사전 온라인 설문 확인',
        outcome: '검사 진행에 필요한 정숙한 독립 평가실 및 사전 질문지 세트 확보'
      },
      CORPORATE_EAP: {
        focus: '사내 EAP 협약 기반 100% 비공개 단독 접수',
        action: '회사 인사팀이나 동료에게 노출되지 않는 프라이빗 슬롯 예약',
        outcome: '익명성이 철저히 보장되는 1:1 독립 심층 상담 시간 확보'
      }
    }
  },
  {
    id: 'interview',
    stepNumber: 2,
    stageName: '초기 면담',
    stageNameEn: 'Initial Interview',
    flowTitle: '1:1 심층 면담 & 목표 수립',
    title: '1:1 초기 면담 및 치유 목표 수립',
    shortDesc: '교육학 박사 박미경 소장과 안전한 독립 공간에서 마주하여 현재의 아픔을 온전히 수용받고 맞춤 회복 목표를 설정합니다.',
    durationText: '1~2회기 (개인 50분 / 부부 80분)',
    phaseGoal: '심리적 안전감(라포) 형성, 핵심 고통의 기저 요인 규명 및 개별화된 치료 로드맵 합의',
    icon: MessageSquareHeart,
    accentColor: '#3b82f6',
    bgLight: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-700',
    checklistItems: [
      '말을 조리 있게 꾸며낼 필요 없이 떠오르는 감정을 편안하게 털어놓기',
      '상담실 예약 시간 10~15분 전 여유 있게 도착하여 따뜻한 웰컴티 마시기',
      '현재 나를 가장 괴롭히는 감정과 상황의 배경 솔직하게 나누기',
      '소장님과 함께 이번 상담을 통해 이루고 싶은 구체적 변화 목표 1~2가지 합의'
    ],
    actionLabel: '상담실 오시는 길 & 찾아오기',
    actionUrl: '/reservation',
    keyActivities: [
      '판단 없는 경청과 깊은 공감을 통해 마음의 짐 덜어내기',
      '현재 겪는 증상의 촉발 원인 및 내면의 심리적 배경 탐색',
      '내담자의 성향과 호소 문제에 부합하는 향후 상담 방향 안내',
      '내담자와 소장님이 함께 현실적이고 명확한 상담 목표(Goal) 설정'
    ],
    deliverables: [
      '전문적인 심리 평가 피드백 및 내담자 맞춤형 회기 로드맵',
      '상담 윤리강령에 의거한 공식 비밀보장 서약서 작성 및 교부',
      '일상에서 당장 시도해볼 수 있는 초기 정서 안정화 팁'
    ],
    safetyGuarantees: [
      '조리 있게 설명하지 않아도 되며 침묵과 눈물도 자연스러운 치유의 과정으로 존중',
      '강요된 장기 패키지 결제 일절 없음 (초기 상담 후 지속 여부 전적인 자율 결정)',
      '철저한 독립 공간으로 방음 시설 완비'
    ],
    prepTip: '평소 입으시는 가장 편안한 복장으로 오시면 됩니다. 상담실에 유기농 웰컴티와 아로마 테라피가 준비되어 있습니다.',
    scenarioExamples: {
      INDIVIDUAL: {
        focus: '내 마음속 무기력과 불안의 근원 진단',
        action: '언제부터 마음이 힘들었는지 안전하게 털어놓고 감정 패턴 점검',
        outcome: '“내가 이상한 게 아니었구나”라는 깊은 안도감과 명확한 치유 목표 수립'
      },
      COUPLE: {
        focus: '반복되는 부부 싸움의 악순환 패턴 발견',
        action: '각자의 성장 배경과 애착 욕구 탐색 및 상대방의 진짜 감정(빙산 아래) 이해',
        outcome: '비난과 방어의 고리를 끊어낼 수 있다는 희망과 1차 대화 규칙 합의'
      },
      BURNOUT: {
        focus: '만성 피로와 무기력의 심리적 방전 상태 측정',
        action: '완벽주의 성향, 거절 못 하는 습관, 직장 내 경계선 붕괴 원인 분석',
        outcome: '에너지 고갈 수준을 객관적으로 인지하고 즉각적인 긴급 에너지 보호선 설정'
      },
      YOUTH: {
        focus: '자녀의 학업 스트레스 및 부모와의 소통 단절 원인 파악',
        action: '청소년 1:1 비밀보장 면담(40분) + 부모 양육 태도 전문 피드백(10분)',
        outcome: '자녀의 속마음 이해 및 가정 내 대화 분위기 전환의 첫 단추 마련'
      },
      ASSESSMENT: {
        focus: '호소 문제와 심리적 고통에 부합하는 맞춤형 검사 패키지 구성',
        action: '현재 겪는 어려움의 성격에 맞춰 불필요한 비용 없이 꼭 필요한 검사군 선별',
        outcome: '나에게 꼭 맞는 과학적 검사 포트폴리오 확정 및 검사 가이드 수령'
      },
      CORPORATE_EAP: {
        focus: '직무 스트레스, 조직 내 관계 갈등 및 번아웃 긴급 진단',
        action: '업무상 심리적 탈진과 심신 소진 상태를 안전하게 털어놓고 경청받기',
        outcome: '긴급 정서 안정화 및 직무 복귀를 위한 맞춤형 단기 목표 수립'
      }
    }
  },
  {
    id: 'testing',
    stepNumber: 3,
    stageName: '심리검사',
    stageNameEn: 'Testing',
    flowTitle: '객관적 심리평가 & 과학적 진단',
    title: '표준화 심리검사 및 과학적 심층 진단',
    shortDesc: '다면적인성검사(MMPI-2), 기질검사(TCI), 문장완성검사(SCT) 등 객관적 도구를 통해 나를 객관적으로 입체 조망합니다.',
    durationText: '검사 40~60분 · 전문 해석 세션 50분',
    phaseGoal: '내담자의 타고난 기질과 성격, 무의식적 방어기제 및 스트레스 취약 요인의 과학적 분석',
    icon: FileText,
    accentColor: '#f59e0b',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-700',
    checklistItems: [
      '정답이나 점수가 없으므로 남의 시선을 의식하지 않고 솔직하게 답변하기',
      '조용하고 방해받지 않는 독립된 공간에서 집중하여 질문지 응답',
      '타고난 기질(자극추구, 위험회피 등)과 후천적 성격의 상호작용 이해하기',
      '심리검사 종합 결과 보고서를 바탕으로 1:1 심층 해석 상담 진행'
    ],
    actionLabel: '심리검사 프로그램 살펴보기',
    actionUrl: '/programs',
    keyActivities: [
      'MMPI-2(다면적 인성검사)를 통한 현재 정서 불안 및 적응 수준 측정',
      'TCI(기질 및 성격검사)로 타고난 유전적 기질과 성격 성숙도 규명',
      'SCT(문장완성검사) 및 그림검사(HTP)로 무의식적 갈등 파악',
      '교육학 박사의 체계적인 결과 프로파일 분석 및 1:1 전문 해석 상담'
    ],
    deliverables: [
      '정밀 심리검사 결과 프로파일 리포트 (영구 보관 가능)',
      '나의 기질에 맞는 맞춤형 스트레스 관리 및 감정 조절 가이드',
      '향후 심층 상담에서 집중적으로 다룰 핵심 타깃 영역 도출'
    ],
    safetyGuarantees: [
      '결과를 평가하거나 단정 짓지 않으며, 나를 더 깊이 이해하기 위한 나침반으로만 활용',
      '검사 결과 및 기록은 법정 보안 규정에 따라 철저히 비공개 암호화 보관',
      '내담자의 상황에 꼭 필요한 핵심 검사만 선별하여 불필요한 비용 부담 배제'
    ],
    prepTip: '좋은 사람으로 보이려 꾸미지 않고, 있는 그대로의 솔직한 내 모습을 기록해 주실 때 가장 정확한 치유의 열쇠를 찾을 수 있습니다.',
    scenarioExamples: {
      INDIVIDUAL: {
        focus: '기질적 위험회피 성향과 내면 비판자 측정',
        action: 'TCI/MMPI-2 검사를 통해 내가 왜 유독 스트레스에 취약했는지 객관적 데이터 확인',
        outcome: '“내가 유약한 탓이 아니라 기질적 특성이었구나”라는 안도감과 자기 이해'
      },
      COUPLE: {
        focus: '부부 간 기질 차이와 상반된 스트레스 반응 양식 비교',
        action: '두 사람의 TCI 기질 프로파일을 대조하여 왜 같은 상황에서 엇갈렸는지 시각적 확인',
        outcome: '상대방의 행동이 나를 공격하려는 게 아니라 기질적 방어였음을 이해하고 공감'
      },
      BURNOUT: {
        focus: '완벽주의적 초자아와 소진(Burnout) 지표 정밀 측정',
        action: '에너지 방전 척도 및 만성 불안 수치를 객관적 통계로 직면',
        outcome: '단순한 게으름이나 의지 박약이 아닌 임상적 휴식이 시급함을 확인'
      },
      YOUTH: {
        focus: '학업 스트레스 저항도, 정서적 불안 및 자아존중감 측정',
        action: '청소년 인성검사(MMPI-A)와 학습 기질 검사로 자녀의 학습 피로 원인 파악',
        outcome: '부모가 몰랐던 자녀의 마음속 고통과 학습 압박감의 객관적 파악'
      },
      ASSESSMENT: {
        focus: '지능, 성격, 정서, 투사검사를 아우르는 Full Battery 정밀 평가',
        action: '전문 평가 환경에서 MMPI-2, TCI, K-WAIS, SCT, HTP 등 표준화 검사 수행',
        outcome: '교육학 박사의 다각도 임상 분석이 담긴 종합 심리평가 리포트 및 1:1 심층 해석 세션'
      },
      CORPORATE_EAP: {
        focus: '직무 소진(MBI) 및 스트레스 대처 양식 정밀 측정',
        action: '객관적 척도로 측정된 업무 피로도 및 기질적 취약 요인 확인',
        outcome: '단순 개인의 나약함이 아닌 직무 환경과 기질의 상호작용 객관화'
      }
    }
  },
  {
    id: 'counseling',
    stepNumber: 4,
    stageName: '심층 상담',
    stageNameEn: 'Counseling',
    flowTitle: '정기 심층 치료 & 회복 체화',
    title: '정기 심층 치료 및 내면 근육 강화',
    shortDesc: '합의된 목표를 바탕으로 인지왜곡 교정, 정서 조절, 소통 훈련 등 실질적인 삶의 변화를 만들어가는 심층 세션입니다.',
    durationText: '주 1회 정기 세션 (단기 4~8회 / 심층 12~15회+)',
    phaseGoal: '오래된 부정적 정서·인지 패턴 해체 및 일상 속 회복탄력성과 대처 능력 체화',
    icon: Sparkles,
    accentColor: '#8b5cf6',
    bgLight: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-700',
    checklistItems: [
      '상담실에서 배운 마음 진정 기술(복식호흡, 감정 그라운딩) 일상 적용',
      '나를 옭아매던 자동적 부정적 사고를 합리적이고 따뜻한 생각으로 재구성',
      '상담사와 함께 정한 가벼운 일상 실천 과제(Homework) 시도해보기',
      '회기마다 느끼는 마음의 작은 변화와 감정을 메모해두기'
    ],
    actionLabel: '내담자 상담 후기 둘러보기',
    actionUrl: '/reviews',
    keyActivities: [
      '인지정서행동치료(REBT) 및 게슈탈트, 정신역동 통합 치료 적용',
      '과거의 미해결 과제(내면아이, 상처 기억)와 안전하게 작별하기',
      '일상에서 실천 가능한 단계별 과제(Homework) 코칭 및 점검',
      '회기별 심리 안정도 변화를 함께 모니터링하며 유연하게 속도 조율'
    ],
    deliverables: [
      '자가 감정 조절 및 건강한 인지 전환 워크시트',
      '일상 대화 및 갈등 대처 맞춤 가이드라인',
      '회기별 성찰 메모 및 중간 점검 피드백'
    ],
    safetyGuarantees: [
      '내담자의 변화 속도를 100% 존중하며 무리한 직면을 강요하지 않음',
      '회기 중 발생하는 심리적 저항이나 불안도 세심하게 다루는 안전망 유지',
      '언제든 회기 간격이나 방향성에 대해 솔직하게 의견을 나눌 수 있는 열린 구조'
    ],
    prepTip: '상담실에서 얻은 통찰을 일상에서 한 걸음씩 가볍게 시도해 보는 열린 태도가 큰 도움이 됩니다.',
    scenarioExamples: {
      INDIVIDUAL: {
        focus: '자동적 부정적 생각(자동적 사고) 교정 & 자기 수용',
        action: '스스로를 갉아먹던 자책 대신 따뜻한 자기 대화 훈련 및 감정 조절 기술 체화',
        outcome: '불안이 밀려와도 휘둘리지 않고 스스로를 다독일 수 있는 내면의 힘 체득'
      },
      COUPLE: {
        focus: '안전한 정서 중심 부부 애착 대화 실습',
        action: '상담사의 중재 아래 상처받은 마음을 비폭력 대화법으로 전달하고 사과 수용 훈련',
        outcome: '서로의 취약성을 보듬어줄 수 있는 깊은 친밀감과 새로운 소통 문화 정착'
      },
      BURNOUT: {
        focus: '건강한 심리적 경계선(Boundary) 구축 및 회복 루틴 실천',
        action: '타인의 기대와 내 욕구를 분리하는 거절 연습 및 나만의 쉼 리추얼 확립',
        outcome: '직장과 일상에서 과도한 죄책감 없이 나를 먼저 지키는 평온한 일상 회복'
      },
      YOUTH: {
        focus: '감정 표현력 신장, 자존감 회복, 또래 관계 기술 훈련',
        action: '부정적 감정을 건강하게 배출하는 법과 자신만의 강점 찾기 프로젝트 진행',
        outcome: '스스로에 대한 긍정적 자아상 확립 및 등교 거부·무기력 해소'
      },
      ASSESSMENT: {
        focus: '심리검사 결과에서 도출된 핵심 취약 영역 집중 케어',
        action: '기질적 특성에 기반한 인지행동 치료 및 자가 감정 조절 훈련',
        outcome: '검사 데이터 기반의 정밀하고 빠른 심리적 회복과 내면 힘 체화'
      },
      CORPORATE_EAP: {
        focus: '건강한 업무 경계선 설정 및 회복탄력성 강화 솔루션',
        action: '직장 내 갈등 소통 기술 및 직무 스트레스 해소 실천 과제 훈련',
        outcome: '번아웃 극복 및 직무 만족도, 일상 활력의 건강한 회복'
      }
    }
  },
  {
    id: 'followup',
    stepNumber: 5,
    stageName: '사후관리',
    stageNameEn: 'Follow-up',
    flowTitle: '목표 달성 종결 & 부스터 케어',
    title: '목표 달성 점검, 합의 종결 및 사후관리',
    shortDesc: '처음 세운 치유 목표의 달성도를 확인하고, 상담사 없이도 스스로 삶을 이끌어갈 수 있는 단단한 자생력을 다집니다.',
    durationText: '종결 회기 (50분) · 1~3개월 후 부스터 케어',
    phaseGoal: '성장 여정 통합, 재발 방지 안전 계획 수립 및 지속 가능한 심리적 웰빙 유지',
    icon: HeartHandshake,
    accentColor: '#0ea5e9',
    bgLight: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-700',
    checklistItems: [
      '상담 시작 시점 대비 나의 심리 척도 및 정서 안정도 재평가',
      '향후 스트레스 위기가 왔을 때 스스로 대처할 나만의 비상 행동 매뉴얼 완성',
      '종결 1~3개월 후 무료 안부 점검 및 일상 적응도 체크',
      '필요 시 언제든 1회성 쉼표를 찍을 수 있는 우선 예약 핫라인 번호 저장'
    ],
    actionLabel: '비밀보장 및 사후관리 원칙 확인',
    actionUrl: '/confidentiality',
    keyActivities: [
      '상담 시작 시점 대비 심리 척도 및 정서 안정도 재평가',
      '변화된 나의 생각 패턴과 관계 대처 자원 총정리',
      '미래에 스트레스나 위기가 닥쳤을 때 적용할 재발 방지 비상 계획 수립',
      '따뜻한 상호 감사의 나눔과 건강한 작별 의식'
    ],
    deliverables: [
      '상담 종결 요약서 및 평생 소장 가능한 자가 심리 관리 핸드북',
      '종결 1~3개월 후 무료 안부 점검 및 일상 적응도 체크',
      '위기 발생 시 언제든 우선 예약이 가능한 핫라인 통로'
    ],
    safetyGuarantees: [
      '일방적인 종결이 아닌, 내담자와 상담사의 충분한 사전 상의와 합의 하에 결정',
      '종결 이후에도 언제든 마음의 쉼표가 필요할 때 1회성 부스터 세션 이용 가능',
      '상담 기록은 법정 보안 기간 동안 암호화되어 안전하게 영구 보호'
    ],
    prepTip: '그동안 포기하지 않고 자신의 마음을 마주해 온 스스로의 용기와 성장을 칭찬해 주세요.',
    scenarioExamples: {
      INDIVIDUAL: {
        focus: '온전한 자립과 단단해진 자아상 축하',
        action: '변화된 나의 모습을 돌아보고 앞으로 혼자서도 마음을 돌볼 수 있는 확신 점검',
        outcome: '상담실 문을 나서며 세상과 마주할 때 느껴지는 가벼운 발걸음과 평온'
      },
      COUPLE: {
        focus: '독립적인 부부 대화 규칙 완성 및 지속성 확인',
        action: '갈등이 생겼을 때 상담사 없이도 두 사람만의 합의된 소통 프로토콜 가동 훈련',
        outcome: '서로를 상처 주지 않고 협력하는 평생의 동반자로서의 끈끈한 유대감'
      },
      BURNOUT: {
        focus: '지속 가능한 워라밸 시스템 정착 및 방전 방지 장치',
        action: '업무 속에서 번아웃의 초기 경고 신호를 감지하고 스스로 멈출 줄 아는 능력 점검',
        outcome: '일에 매몰되지 않고 내 삶의 주권을 되찾아 활력 넘치는 일상 복귀'
      },
      YOUTH: {
        focus: '자율적인 성장 동기 확립 및 부모-자녀 간 신뢰 회복',
        action: '자녀의 학업 스트레스 대처력 확인 및 부모의 지속적인 지지형 양육 환경 점검',
        outcome: '자신감을 되찾은 자녀와 가정이 서로를 신뢰하며 미래로 나아가는 도약'
      },
      ASSESSMENT: {
        focus: '종합 평가 리포트 영구 소장 및 주기적 추적 상담',
        action: '평생 참고할 수 있는 나의 기질 프로파일 핸드북 제공 및 3개월 후 점검',
        outcome: '자기 이해에 기반한 지속 가능한 심리적 자기결정권 확립'
      },
      CORPORATE_EAP: {
        focus: '직무 복귀 후 안정적 적응도 및 스트레스 재발 방지',
        action: '조직 생활 중 재발 위기 시 즉각 대처할 수 있는 비상 핫라인 안내',
        outcome: '지속 가능한 직무 몰입과 건강한 워라밸 자생력 확립'
      }
    }
  }
];

const SITUATION_PRESETS = [
  { stepNumber: 1, label: '상담을 고민 중이거나 예약 일정을 잡고 싶어요', desc: '1단계: 신청 및 예약' },
  { stepNumber: 2, label: '예약 완료 후 첫 1:1 심층 면담을 앞두고 있어요', desc: '2단계: 초기 면담' },
  { stepNumber: 3, label: '나를 과학적으로 파악할 심리검사를 진행/해석 중이에요', desc: '3단계: 심리검사' },
  { stepNumber: 4, label: '정기적인 심층 상담 세션으로 마음 근육을 키우고 있어요', desc: '4단계: 심층 상담' },
  { stepNumber: 5, label: '상담 목표를 달성하고 종결 및 사후관리를 점검해요', desc: '5단계: 사후관리' },
];

const STEP_STORAGE_KEY = 'happywind_counseling_current_step';
const SERVICE_STORAGE_KEY = 'happywind_counseling_selected_service';

export interface CounselingProcessInfographicProps {
  className?: string;
  defaultStep?: number;
  initialService?: CounselingServiceKey;
  showTitle?: boolean;
}

export default function CounselingProcessInfographic({
  className = '',
  defaultStep = 1,
  initialService = 'ALL',
  showTitle = true
}: CounselingProcessInfographicProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Counseling Service
  const [selectedService, setSelectedService] = useState<CounselingServiceKey>(() => {
    // 1. Check URL param first
    const paramService = searchParams.get('service') || searchParams.get('program');
    if (paramService) {
      const lower = paramService.toLowerCase();
      if (lower.includes('assess') || lower.includes('test') || lower.includes('검사')) return 'ASSESSMENT';
      if (lower.includes('couple') || lower.includes('부부') || lower.includes('가족')) return 'COUPLES';
      if (lower.includes('youth') || lower.includes('청소년') || lower.includes('아동')) return 'YOUTH';
      if (lower.includes('eap') || lower.includes('corp') || lower.includes('기업')) return 'CORPORATE_EAP';
      if (lower.includes('indiv') || lower.includes('개인') || lower.includes('성인')) return 'INDIVIDUAL';
    }
    // 2. Initial service prop
    if (initialService && initialService !== 'ALL') return initialService;
    // 3. LocalStorage
    try {
      const saved = localStorage.getItem(SERVICE_STORAGE_KEY) as CounselingServiceKey;
      if (saved && COUNSELING_SERVICES.some(s => s.key === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'ALL';
  });

  // Current viewing step (Active State highlight in flowchart & deep-dive panel)
  const [activeStepNumber, setActiveStepNumber] = useState<number>(() => {
    // If URL step is provided
    const paramStep = searchParams.get('step') || searchParams.get('currentStep');
    if (paramStep) {
      const parsed = parseInt(paramStep, 10);
      if (parsed >= 1 && parsed <= 5) return parsed;
    }
    // If service has primary step
    const s = COUNSELING_SERVICES.find(srv => srv.key === selectedService);
    if (s && s.key !== 'ALL') {
      return s.primaryStep;
    }
    return defaultStep;
  });

  // User's self-reported current position in their counseling journey
  const [userCurrentStep, setUserCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STEP_STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 5) return parsed;
      }
      // Check if user has a recent reservation stored
      const hasRecentRes = localStorage.getItem('hbbr_last_reservation');
      if (hasRecentRes) {
        return 2; // Auto-advance to Step 2: Initial Interview
      }
    } catch {
      // ignore
    }
    return defaultStep;
  });

  const [hasRecentReservation, setHasRecentReservation] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showSituationFinder, setShowSituationFinder] = useState(false);
  const [lastAutoTriggerReason, setLastAutoTriggerReason] = useState<string | null>(null);

  // Sync state with URL params & localStorage
  useEffect(() => {
    try {
      const lastRes = localStorage.getItem('hbbr_last_reservation');
      if (lastRes) {
        setHasRecentReservation(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen to external triggers (e.g. from Programs, Reservation, or Navbar)
  useEffect(() => {
    const handleServiceSelectEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ service?: CounselingServiceKey; step?: number }>;
      if (customEvent.detail?.service) {
        handleServiceSelect(customEvent.detail.service);
      }
      if (customEvent.detail?.step) {
        handleSetUserStep(customEvent.detail.step);
      }
    };

    window.addEventListener('counseling-service-selected', handleServiceSelectEvent);
    return () => window.removeEventListener('counseling-service-selected', handleServiceSelectEvent);
  }, []);

  // Persist userCurrentStep
  useEffect(() => {
    try {
      localStorage.setItem(STEP_STORAGE_KEY, userCurrentStep.toString());
    } catch {
      // ignore
    }
  }, [userCurrentStep]);

  // Persist selectedService
  useEffect(() => {
    try {
      localStorage.setItem(SERVICE_STORAGE_KEY, selectedService);
    } catch {
      // ignore
    }
  }, [selectedService]);

  const currentServiceInfo = COUNSELING_SERVICES.find(s => s.key === selectedService) || COUNSELING_SERVICES[0];
  const activeStep = COUNSELING_INFOGRAPHIC_STEPS.find(s => s.stepNumber === activeStepNumber) || COUNSELING_INFOGRAPHIC_STEPS[0];
  const userStepData = COUNSELING_INFOGRAPHIC_STEPS.find(s => s.stepNumber === userCurrentStep) || COUNSELING_INFOGRAPHIC_STEPS[0];
  
  // Scenario matching
  const scenarioKey: ConcernType = 
    selectedService === 'INDIVIDUAL' ? 'INDIVIDUAL' :
    selectedService === 'COUPLES' ? 'COUPLE' :
    selectedService === 'YOUTH' ? 'YOUTH' :
    selectedService === 'ASSESSMENT' ? 'ASSESSMENT' :
    selectedService === 'CORPORATE_EAP' ? 'CORPORATE_EAP' : 'INDIVIDUAL';

  const activeScenario = activeStep.scenarioExamples[scenarioKey] || activeStep.scenarioExamples.INDIVIDUAL;

  // Handle service change: Automatically activates the primary step for this service!
  const handleServiceSelect = (serviceKey: CounselingServiceKey) => {
    setSelectedService(serviceKey);
    const serviceInfo = COUNSELING_SERVICES.find(s => s.key === serviceKey);
    if (serviceInfo) {
      if (serviceKey === 'ALL') {
        setActiveStepNumber(userCurrentStep || 1);
        setLastAutoTriggerReason(`전체 5단계 표준 치유 로드맵으로 복귀했습니다.`);
      } else {
        // Automatically highlight corresponding process step (Active State)
        setActiveStepNumber(serviceInfo.primaryStep);
        setLastAutoTriggerReason(
          `선택하신 [${serviceInfo.label}] 서비스에 맞춰 STEP 0${serviceInfo.primaryStep} (${serviceInfo.badge}) 단계가 자동으로 강조 표시(Active)되었습니다.`
        );
      }
    }
  };

  const handleSetUserStep = (stepNum: number) => {
    setUserCurrentStep(stepNum);
    setActiveStepNumber(stepNum);
    setShowSituationFinder(false);
    setLastAutoTriggerReason(`사용자 현재 진행 단계가 [STEP 0${stepNum}]로 설정되어 자동으로 활성화되었습니다.`);
  };

  const handleToggleChecklist = (itemKey: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const completedChecklistCount = activeStep.checklistItems.filter(
    (_, idx) => !!checkedItems[`${activeStep.id}-${idx}`]
  ).length;

  return (
    <section 
      aria-label="상담 이용 절차 인터랙티브 플로우 차트"
      className={cn("w-full py-16 sm:py-20 bg-gradient-to-b from-white via-brand-beige/15 to-white border-y border-brand-green/20 relative", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        {showTitle && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-serif text-brand-sage font-bold uppercase tracking-wider mb-3">
              <Compass className="w-4 h-4 text-brand-sage animate-spin-slow" />
              <span>Interactive Counseling Flowchart</span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span>스마트 단계 자동 감지 &amp; 맞춤 로드맵</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4 leading-snug">
              상담 이용 절차 <span className="text-brand-sage">인터랙티브 플로우 차트</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-brand-brown/75 font-serif leading-relaxed">
              <strong>신청(Application) ➔ 초기면담(Initial Interview) ➔ 심리검사(Testing) ➔ 심층상담(Counseling) ➔ 사후관리(Follow-up)</strong><br className="hidden sm:inline" />
              상담 서비스 또는 나의 현재 단계를 선택하면 해당 프로세스가 <strong>자동으로 강조 표시(Active State)</strong>됩니다.
            </p>

            {/* Quick Metrics */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-brand-brown/70 font-serif">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% 비의료기록 (F코드 없음)</span>
              </span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-sage" />
                <span>1일 5회 독립 정원제</span>
              </span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>교육학 박사 1:1 책임 전담</span>
              </span>
            </div>
          </div>
        )}

        {/* 1. COUNSELING SERVICE SELECTOR BAR (자동 활성화 트리거) */}
        <div className="mb-8 bg-white p-5 sm:p-6 rounded-3xl border border-brand-green/35 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-brand-green/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold font-serif text-brand-sage tracking-wider uppercase block">
                  서비스별 프로세스 자동 강조 (Service Active Selector)
                </span>
                <h3 className="text-sm sm:text-base font-bold font-serif text-brand-brown">
                  원하시는 상담 서비스를 선택하세요 — 해당 단계가 자동으로 활성화됩니다:
                </h3>
              </div>
            </div>

            {selectedService !== 'ALL' && (
              <button
                type="button"
                onClick={() => handleServiceSelect('ALL')}
                className="self-start md:self-auto text-xs font-serif text-brand-brown/60 hover:text-brand-sage flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>전체 기본 플로우로 복귀</span>
              </button>
            )}
          </div>

          {/* 6 Interactive Service Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {COUNSELING_SERVICES.map((srv) => {
              const IconComp = srv.icon;
              const isSelected = selectedService === srv.key;
              return (
                <button
                  key={srv.key}
                  type="button"
                  onClick={() => handleServiceSelect(srv.key)}
                  aria-pressed={isSelected}
                  className={cn(
                    "p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden",
                    isSelected
                      ? "bg-brand-sage text-white border-brand-sage shadow-md ring-2 ring-brand-sage/30 scale-[1.02]"
                      : "bg-brand-beige/20 hover:bg-brand-green/20 text-brand-brown border-brand-green/25 hover:border-brand-sage/40"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                        isSelected ? "bg-white/20 text-white" : "bg-white text-brand-sage shadow-2xs"
                      )}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/25 text-white font-bold animate-pulse">
                          Active
                        </span>
                      ) : srv.key !== 'ALL' ? (
                        <span className="text-[9px] px-1 py-0.2 rounded-md bg-brand-green/40 text-brand-brown/70 font-mono">
                          STEP 0{srv.primaryStep}
                        </span>
                      ) : null}
                    </div>
                    <div className={cn(
                      "font-serif font-bold text-xs sm:text-sm leading-snug",
                      isSelected ? "text-white" : "text-brand-brown group-hover:text-brand-sage"
                    )}>
                      {srv.shortLabel}
                    </div>
                  </div>
                  <div className={cn(
                    "text-[10px] mt-1.5 truncate leading-tight",
                    isSelected ? "text-white/80" : "text-brand-brown/55"
                  )}>
                    {srv.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Auto-Trigger Notice Banner */}
          <AnimatePresence mode="wait">
            {lastAutoTriggerReason && (
              <motion.div
                key={lastAutoTriggerReason}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 p-3 rounded-xl bg-brand-sage/10 border border-brand-sage/25 text-xs font-serif text-brand-brown flex items-center gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-brand-sage text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="flex-grow">
                  <span className="font-bold text-brand-sage mr-1">[자동 강조 알림]</span>
                  <span>{lastAutoTriggerReason}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. USER'S CURRENT STEP TRACKER STRIP */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-sage text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-brand-sage font-serif uppercase tracking-wider">
                  나의 현재 진행 단계 (Current Progress)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                  STEP 0{userCurrentStep} ({userStepData.stageNameEn})
                </span>
                <span className="text-xs text-brand-brown/60 font-serif hidden sm:inline">
                  진행률 {userCurrentStep * 20}%
                </span>
                {hasRecentReservation && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    ✓ 예약 접수 확인됨
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-brand-brown font-serif mt-0.5">
                현재 내담자님의 위치는 <span className="text-brand-sage underline underline-offset-4 font-extrabold">{userStepData.stageName} ({userStepData.title})</span> 단계입니다.
              </p>
            </div>
          </div>

          {/* Quick Situation Finder & Reset Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
            <button
              type="button"
              onClick={() => setShowSituationFinder(prev => !prev)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-brand-beige/50 hover:bg-brand-sage hover:text-white text-brand-brown border border-brand-green/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>상황으로 내 단계 찾기</span>
            </button>

            {userCurrentStep !== 1 && (
              <button
                type="button"
                onClick={() => handleSetUserStep(1)}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-serif text-brand-brown/60 hover:text-brand-brown hover:bg-brand-beige/30 transition-all flex items-center gap-1 cursor-pointer"
                title="1단계로 리셋하기"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">처음으로 리셋</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Situation Finder Drawer */}
        <AnimatePresence>
          {showSituationFinder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-brand-beige/30 p-5 rounded-2xl border border-brand-green/30 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-green/20">
                  <span className="text-xs font-serif font-bold text-brand-brown flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-brand-sage" />
                    <span>현재 나의 상황에 가장 가까운 항목을 클릭하시면 해당 단계가 자동으로 활성화됩니다:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSituationFinder(false)}
                    className="text-xs text-brand-brown/50 hover:text-brand-brown font-serif cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {SITUATION_PRESETS.map((item) => (
                    <button
                      key={item.stepNumber}
                      type="button"
                      onClick={() => handleSetUserStep(item.stepNumber)}
                      className={cn(
                        "p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between text-xs font-serif",
                        userCurrentStep === item.stepNumber
                          ? "bg-brand-sage text-white border-brand-sage shadow-2xs font-bold"
                          : "bg-white hover:bg-brand-green/15 text-brand-brown border-brand-green/20"
                      )}
                    >
                      <div className="text-[11px] opacity-80 mb-1">{item.desc}</div>
                      <div className="font-semibold leading-snug">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. 5-STEP INTERACTIVE VISUAL FLOW CHART PIPELINE */}
        <div className="mb-10 sm:mb-12">
          
          {/* Visual Progress Connector Pipeline Line (Desktop) */}
          <div className="relative mb-8 hidden lg:block px-8">
            <div className="h-2.5 w-full bg-brand-green/20 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-brand-sage transition-all duration-500 rounded-full"
                style={{ width: `${(activeStepNumber / 5) * 100}%` }}
              />
            </div>
            
            {/* Pulsing indicator marker at active step percentage */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-brand-sage shadow-md flex items-center justify-center transition-all duration-500 z-10"
              style={{ left: `calc(${((activeStepNumber - 0.5) / 5) * 100}% + 2rem)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-brand-sage animate-ping" />
            </div>
          </div>

          {/* 5 Interactive Flowchart Node Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {COUNSELING_INFOGRAPHIC_STEPS.map((step) => {
              const Icon = step.icon;
              const isViewing = activeStepNumber === step.stepNumber;
              const isUserCurrent = userCurrentStep === step.stepNumber;
              const isCompleted = userCurrentStep > step.stepNumber;
              const isServiceCore = currentServiceInfo.coreSteps.includes(step.stepNumber);
              const isServicePrimary = currentServiceInfo.primaryStep === step.stepNumber && selectedService !== 'ALL';
              
              // Active State: step is either actively selected, user's current step, or primary for selected service
              const isActivelyHighlighted = isViewing;
              const stepTagInfo = SERVICE_STEP_TAGS[selectedService]?.[step.stepNumber] || SERVICE_STEP_TAGS.ALL[step.stepNumber];

              return (
                <div
                  key={step.id}
                  className="relative flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setActiveStepNumber(step.stepNumber)}
                    aria-pressed={isActivelyHighlighted}
                    className={cn(
                      "text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between h-full w-full",
                      isActivelyHighlighted
                        ? "bg-white border-brand-sage shadow-xl ring-4 ring-brand-sage/30 scale-[1.03] z-20"
                        : isUserCurrent
                          ? "bg-white border-emerald-500/70 shadow-md ring-2 ring-emerald-500/30 scale-[1.01] z-10"
                          : isServiceCore
                            ? "bg-emerald-50/30 border-brand-sage/50 hover:bg-white shadow-xs"
                            : isCompleted
                              ? "bg-emerald-50/20 hover:bg-white border-emerald-500/25 text-brand-brown/85"
                              : "bg-white/80 hover:bg-brand-beige/25 border-brand-green/20 text-brand-brown/70 hover:border-brand-green/40"
                    )}
                  >
                    {/* Top: Step Badge & Status */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-colors",
                            isActivelyHighlighted
                              ? "bg-brand-sage text-white shadow-2xs font-extrabold"
                              : isUserCurrent
                                ? "bg-emerald-600 text-white"
                                : isCompleted
                                  ? "bg-emerald-600/80 text-white"
                                  : "bg-brand-brown/10 text-brand-brown/70 group-hover:bg-brand-sage/10 group-hover:text-brand-sage"
                          )}>
                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${step.stepNumber}`}
                          </span>
                          <span className="text-[11px] font-mono text-brand-brown/50 font-bold uppercase tracking-wider">
                            {step.stageNameEn}
                          </span>
                        </div>

                        {/* Status Pills */}
                        {isActivelyHighlighted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-brand-sage font-extrabold bg-brand-sage/15 px-2 py-0.5 rounded-full border border-brand-sage/30 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
                            <span>Active</span>
                          </span>
                        ) : isUserCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-extrabold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-400">
                            <span>내 위치</span>
                          </span>
                        ) : isServicePrimary ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 font-bold bg-amber-100/70 px-1.5 py-0.5 rounded-md">
                            <span>★ 핵심</span>
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.5 rounded-md">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>완료</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-brand-brown/40 font-medium">
                            예정
                          </span>
                        )}
                      </div>

                      {/* Icon & Korean Title */}
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                          step.bgLight,
                          step.borderColor,
                          step.textColor
                        )}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <h3 className={cn(
                            "text-xs sm:text-sm font-bold font-serif leading-snug line-clamp-1 transition-colors",
                            isActivelyHighlighted 
                              ? "text-brand-sage font-extrabold" 
                              : isUserCurrent 
                                ? "text-brand-brown font-extrabold" 
                                : "text-brand-brown group-hover:text-brand-sage"
                          )}>
                            {step.stageName}
                          </h3>
                          <p className="text-[11px] text-brand-brown/70 font-serif line-clamp-2 mt-0.5 leading-tight">
                            {stepTagInfo.customSubtitle || step.flowTitle}
                          </p>
                        </div>
                      </div>

                      {/* Service Core Badge */}
                      {isServiceCore && selectedService !== 'ALL' && (
                        <div className="mt-1">
                          <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300">
                            {stepTagInfo.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Duration & Details Indicator */}
                    <div className="mt-3 pt-2 border-t border-brand-green/15 flex items-center justify-between text-[11px] font-serif text-brand-brown/60">
                      <span className="flex items-center gap-1 text-[10px] truncate max-w-[110px]">
                        <Clock className="w-3 h-3 text-brand-sage shrink-0" />
                        <span>{step.durationText}</span>
                      </span>
                      <ChevronRight className={cn(
                        "w-3.5 h-3.5 transition-transform shrink-0",
                        isActivelyHighlighted ? "text-brand-sage translate-x-1" : "text-brand-brown/30 group-hover:text-brand-sage group-hover:translate-x-0.5"
                      )} />
                    </div>
                  </button>

                  {/* Flow connecting arrow on desktop */}
                  {step.stepNumber < 5 && (
                    <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-30 w-5 h-5 rounded-full bg-white border border-brand-green/30 items-center justify-center text-brand-sage shadow-2xs pointer-events-none">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}

                  {/* Quick "이 단계로 내 위치 지정" button below card */}
                  <div className="mt-1.5 text-center">
                    {isUserCurrent ? (
                      <span className="text-[10px] font-bold text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>현재 내 진행 단계</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetUserStep(step.stepNumber);
                        }}
                        className="text-[10px] font-serif text-brand-brown/60 hover:text-brand-sage hover:underline cursor-pointer transition-colors"
                      >
                        이 단계로 내 위치 지정
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. SELECTED STEP SPOTLIGHT DEEP-DIVE INFOGRAPHIC PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeStep.id}-${selectedService}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl border border-brand-green/30 shadow-md p-6 sm:p-8 md:p-10 mb-10 overflow-hidden relative"
          >
            {/* Top Step Banner & Current Step Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-green/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs",
                  activeStep.bgLight,
                  activeStep.borderColor,
                  activeStep.textColor
                )}>
                  {React.createElement(activeStep.icon, { className: "w-6 h-6 sm:w-7 sm:h-7" })}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-serif text-brand-sage font-bold tracking-wider mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage">
                      STEP 0{activeStep.stepNumber}
                    </span>
                    <span aria-hidden="true" className="text-brand-brown/30">·</span>
                    <span className="text-brand-brown/80 font-mono uppercase">{activeStep.stageNameEn}</span>
                    <span aria-hidden="true" className="text-brand-brown/30">·</span>
                    <span className="text-brand-brown/80">{activeStep.stageName}</span>
                    {userCurrentStep === activeStep.stepNumber && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        ★ 현재 나의 단계 (Active)
                      </span>
                    )}
                    {selectedService !== 'ALL' && currentServiceInfo.coreSteps.includes(activeStep.stepNumber) && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        ★ {currentServiceInfo.shortLabel} 핵심 단계
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                    {activeStep.title}
                  </h3>
                </div>
              </div>

              {/* Progress & Set as My Step Action */}
              <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
                <div className="bg-brand-beige/40 px-3.5 py-2 rounded-xl border border-brand-green/20 text-xs font-serif text-brand-brown/80 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-sage" />
                  <span>{activeStep.durationText}</span>
                </div>
                
                {userCurrentStep !== activeStep.stepNumber ? (
                  <button
                    type="button"
                    onClick={() => handleSetUserStep(activeStep.stepNumber)}
                    className="px-3.5 py-2 rounded-xl text-xs font-serif font-bold bg-brand-sage hover:bg-brand-sage/90 text-white transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>이 단계로 내 위치 지정</span>
                  </button>
                ) : (
                  <div className="px-3 py-2 rounded-xl text-xs font-serif font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>현재 진행 중인 나의 단계</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service-Tailored Context Banner */}
            {selectedService !== 'ALL' && (
              <div className="mt-6 p-4 rounded-2xl bg-brand-sage/10 border border-brand-sage/25 flex items-start gap-3">
                <Info className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-serif">
                  <span className="font-bold text-brand-brown">
                    [{currentServiceInfo.label}] 서비스 안내:
                  </span>{' '}
                  <span className="text-brand-brown/80">
                    {currentServiceInfo.highlightReason} (권장 시간: {currentServiceInfo.recommendedDuration})
                  </span>
                </div>
              </div>
            )}

            {/* Core Objective Callout */}
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-brand-beige/25 border border-brand-green/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-brand-sage uppercase font-serif block mb-0.5">
                  단계 핵심 목표 (Phase Objective)
                </span>
                <p className="text-sm sm:text-base font-serif text-brand-brown font-medium leading-relaxed">
                  {activeStep.phaseGoal}
                </p>
              </div>
            </div>

            {/* Interactive Checklist for this Step */}
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/50 via-white to-brand-beige/25 border border-emerald-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-emerald-500/15">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-sm sm:text-base font-serif font-bold text-brand-brown">
                    0{activeStep.stepNumber}단계 내담자 실천 체크리스트 (Action Checklist)
                  </h4>
                </div>
                <div className="text-xs font-serif text-emerald-800 font-bold bg-emerald-100/70 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  완료: {completedChecklistCount} / {activeStep.checklistItems.length} 항목
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeStep.checklistItems.map((item, idx) => {
                  const itemKey = `${activeStep.id}-${idx}`;
                  const isChecked = !!checkedItems[itemKey];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleChecklist(itemKey)}
                      className={cn(
                        "p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 text-xs font-serif",
                        isChecked
                          ? "bg-emerald-50/80 border-emerald-400 text-emerald-950 font-medium"
                          : "bg-white hover:bg-brand-beige/20 border-brand-green/20 text-brand-brown/80"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors",
                        isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-brand-brown/30 bg-white"
                      )}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={cn(isChecked && "line-through text-brand-brown/50")}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-Column Infographic Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Column 1: 주요 진행 내용 (Key Activities) */}
              <div className="bg-brand-beige/15 p-5 rounded-2xl border border-brand-green/20 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/15">
                    <FileText className="w-4 h-4 text-brand-sage" />
                    <span>주요 진행 활동</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {activeStep.keyActivities.map((act, idx) => (
                      <li key={idx} className="text-xs text-brand-brown/80 font-serif flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-sage shrink-0 mt-1.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2: 내담자 안심 보장 (Safety & Assurance) */}
              <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-emerald-800 flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/15">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>안심 보장 원칙</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {activeStep.safetyGuarantees.map((safe, idx) => (
                      <li key={idx} className="text-xs text-brand-brown/80 font-serif flex items-start gap-2 leading-relaxed">
                        <Smile className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{safe}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: 산출물 & 준비 팁 (Deliverables & Tips) */}
              <div className="bg-sky-500/5 p-5 rounded-2xl border border-sky-500/20 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-sky-800 flex items-center gap-2 mb-3 pb-2 border-b border-sky-500/15">
                    <Award className="w-4 h-4 text-sky-600" />
                    <span>제공 산출물 &amp; 준비 팁</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-sky-700 block mb-1">제공 및 안내 자료</span>
                      <ul className="space-y-1.5">
                        {activeStep.deliverables.map((item, idx) => (
                          <li key={idx} className="text-xs text-brand-brown/75 font-serif flex items-start gap-1.5 leading-relaxed">
                            <span className="text-sky-500">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-sky-500/15">
                      <span className="text-[11px] font-bold text-brand-brown/80 block mb-1">내담자 준비 팁</span>
                      <p className="text-xs text-brand-brown/70 font-serif leading-relaxed">
                        {activeStep.prepTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Service-Specific Scenario Simulation Preview */}
            <div className="bg-gradient-to-r from-brand-beige/30 via-white to-brand-beige/30 rounded-2xl p-5 sm:p-6 border border-brand-green/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-sage" />
                  <span className="text-xs sm:text-sm font-serif font-bold text-brand-brown">
                    선택 서비스에 맞춘 0{activeStep.stepNumber}단계 진행 시뮬레이션
                  </span>
                </div>
                <div className="text-xs font-serif text-brand-sage font-bold bg-white px-2.5 py-1 rounded-full border border-brand-green/30">
                  적용 서비스: {currentServiceInfo.label}
                </div>
              </div>

              {/* Dynamic Scenario Result Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-serif">
                <div className="p-3.5 rounded-xl bg-white border border-brand-green/15">
                  <span className="text-[10px] text-brand-sage font-bold block mb-1">이 단계의 주 초점</span>
                  <p className="font-bold text-brand-brown leading-snug">{activeScenario.focus}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-brand-green/15">
                  <span className="text-[10px] text-blue-600 font-bold block mb-1">구체적 상담 활동</span>
                  <p className="text-brand-brown/85 leading-relaxed">{activeScenario.action}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-brand-green/15">
                  <span className="text-[10px] text-emerald-600 font-bold block mb-1">내담자가 얻는 변화</span>
                  <p className="text-brand-brown/85 leading-relaxed">{activeScenario.outcome}</p>
                </div>
              </div>
            </div>

            {/* Bottom Controls & Navigation */}
            <div className="mt-8 pt-6 border-t border-brand-green/20 flex flex-wrap items-center justify-between gap-4">
              {/* Prev / Next Step Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeStepNumber === 1}
                  onClick={() => setActiveStepNumber(prev => Math.max(1, prev - 1))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1 border cursor-pointer",
                    activeStepNumber === 1
                      ? "opacity-40 cursor-not-allowed bg-brand-beige/20 text-brand-brown/40 border-brand-green/10"
                      : "bg-white hover:bg-brand-beige/30 text-brand-brown border-brand-green/30"
                  )}
                >
                  <span>이전 단계</span>
                </button>
                <button
                  type="button"
                  disabled={activeStepNumber === 5}
                  onClick={() => setActiveStepNumber(prev => Math.min(5, prev + 1))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1 border cursor-pointer",
                    activeStepNumber === 5
                      ? "opacity-40 cursor-not-allowed bg-brand-beige/20 text-brand-brown/40 border-brand-green/10"
                      : "bg-brand-sage hover:bg-brand-sage/90 text-white border-brand-sage"
                  )}
                >
                  <span>다음 단계</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Jump Links */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to={activeStep.actionUrl}
                  className="px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-serif font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                >
                  <span>{activeStep.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/reservation"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-brand-beige/30 text-brand-brown text-xs font-serif font-semibold border border-brand-green/30 transition-all flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-brand-sage" />
                  <span>일정 확인 &amp; 예약</span>
                </Link>
                <Link
                  to="/confidentiality"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-brand-beige/30 text-brand-brown text-xs font-serif font-semibold border border-brand-green/30 transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-brand-sage" />
                  <span>비밀보장원칙</span>
                </Link>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
