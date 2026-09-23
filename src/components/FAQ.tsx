import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, ChevronDown, Search, ShieldCheck, 
  Calendar, CreditCard, Clock, Phone, MapPin, 
  Sparkles, CheckCircle2, MessageSquare, ArrowRight,
  RefreshCw, FileText, ChevronUp, AlertCircle, Award,
  Users, User, Heart, DollarSign
} from 'lucide-react';
import { useHighContrast } from '../context/HighContrastContext';
import { cn } from '../lib/utils';

export type FAQCategory = 'ALL' | 'PROCESS' | 'FEE' | 'PRIVACY' | 'RESERVATION' | 'REMOTE';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  badge?: string;
  feeInfo?: {
    item: string;
    price: string;
    duration: string;
  };
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-process-1',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 진행',
    question: '상담은 신청부터 종결까지 어떤 절차(프로세스)로 진행되나요?',
    badge: '필독 안내',
    answer: '행복바람심리상담연구소의 모든 상담은 전문적이고 체계적인 4단계 프로세스로 이루어집니다.\n\n1단계 [상담 접수 및 사전 예약]: 온라인 예약 폼 또는 전화(052-254-0230)를 통해 호소 문제와 희망 일정을 접수합니다.\n2단계 [초기 상담 & 심층 평가 (1~2회기)]: 현재 겪고 계신 심리적 어려움의 배경을 파악하고, 필요 시 간이/종합심리검사를 병행하여 구체적인 치유 목표를 함께 세웁니다.\n3단계 [정기 심층 상담 (주 1회)]: 개인 성향과 문제 유형에 맞춘 맞춤형 심리치료(인지행동, 게슈탈트, 정서중심 등)를 진행합니다.\n4단계 [상담 종결 및 사후 관리]: 내면의 자아 탄력성과 대처 능력이 확립되었을 때 상의 하에 종결하며, 일상 적응 상태를 점검합니다.',
    highlights: ['사전 예약제 접수', '1~2회기 초기 면담 및 목표 설정', '주 1회 정기 심층 상담', '상호 합의를 통한 건강한 종결']
  },
  {
    id: 'faq-fee-1',
    category: 'FEE',
    categoryLabel: '상담 비용 & 수수료',
    question: '상담 프로그램별 공식 비용과 회기당 소요 시간은 얼마인가요?',
    badge: '공식 비용표',
    answer: '행복바람심리상담연구소는 투명하고 정직한 정찰제 비용 정책을 준수합니다.\n\n• 개인 심리상담 (청소년 및 성인): 1회기 50분 / 100,000원\n• 부부 및 가족상담: 1회기 80분 / 180,000원\n• 아동 놀이·미술상담: 1회기 50분 (아동 상담 40분 + 부모 양육 피드백 10분) / 90,000원\n• 종합심리검사 (Full Battery): 지능·성격·정서 통합 정밀 검사 및 심층 해석 상담 / 별도 문의 (검사 구성에 따라 산정)\n\n※ 모든 상담은 공인 1급 박사 상담 소장님이 1:1로 직접 전담합니다.',
    highlights: ['개인상담 50분 100,000원', '부부·가족 80분 180,000원', '놀이·미술 50분 90,000원', '정찰제 운영']
  },
  {
    id: 'faq-fee-2',
    category: 'FEE',
    categoryLabel: '상담 비용 & 수수료',
    question: '결제 수단(카드, 울산페이, 현금영수증)과 지원 바우처 사용이 가능한가요?',
    answer: '네, 다양한 결제 수단과 지자체 지원 제도를 이용하실 수 있습니다.\n\n1. 결제 수단: 모든 신용카드, 체크카드, 울산페이(지역화폐 결제 시 캐시백 혜택), 무통장 계좌이체가 가능합니다. 현금 및 계좌이체 시 소득공제용 현금영수증을 100% 의무 발행해 드립니다.\n2. 정부 지원 바우처: 울산시 및 보건복지부 발달재활서비스, 아동·청소년 심리지원 바우처, 청년마음건강지원사업 등 연계가 가능합니다. 바우처 예산 쿼터 및 등록 시기에 따라 차이가 있을 수 있으므로 내원 전 유선(052-254-0230)으로 문의 주시면 신속히 확인해 드립니다.',
    highlights: ['울산페이(지역화폐) 결제 가능', '현금영수증 100% 의무 발행', '정부·지자체 심리지원 바우처 연계 지원']
  },
  {
    id: 'faq-process-2',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 진행',
    question: '상담은 보통 몇 회기 정도 받아야 효과를 체감할 수 있나요?',
    answer: '내담자께서 마주한 심리적 어려움의 깊이와 목표에 따라 유연하게 결정됩니다.\n\n• 단기 상담 (4~8회기): 특정 상황적 스트레스, 긴급한 의사결정, 시험 및 직장 번아웃 완화에 적합합니다.\n• 중기 상담 (10~15회기): 만성적인 대인관계 갈등, 우울·불안의 기저 패턴 완화, 부부 갈등의 구조적 개선에 효과적입니다.\n• 심층 상담 (15회기 이상): 오랜 유년기 결핍, 복합 트라우마 치유, 성격 구조적 변화와 진정한 자아 성장을 목표로 합니다.\n\n초기 상담(1회기) 진행 후 소장님과 내담자의 상황에 가장 최적화된 회기 계획을 자율적으로 상의하여 결정합니다.',
    highlights: ['단기(4~8회기)부터 심층(15회기+)까지 맞춤형', '초기 상담 후 자율적 상의 결정']
  },
  {
    id: 'faq-reservation-1',
    category: 'RESERVATION',
    categoryLabel: '예약 & 취소 규정',
    question: '예약 변경이나 취소, 환불 규정은 어떻게 되나요?',
    badge: '중요 규정',
    answer: '행복바람은 1일 5회 한정 1:1 심층 상담제로 운영되어, 해당 시간대를 오직 한 분의 내담자만을 위해 비워둡니다.\n\n• 예약 시간 24시간 전(전날)까지 취소/변경 시: 100% 무료 일정 변경 및 수수료 없는 전액 환불\n• 당일 직전 취소 또는 노쇼(무단 불참) 시: 상담실 공간 확보 및 다른 위기 내담자의 상담 기회 제한으로 인해 일정 위약 규정이 적용될 수 있습니다.\n\n일정 변경이 필요하신 경우 최소 하루 전 유선(052-254-0230) 또는 카카오 채널로 연락 부탁드립니다.',
    highlights: ['24시간 전 취소 시 100% 무료 변경 & 전액 환불', '1일 5회 정원제 집중 관리']
  },
  {
    id: 'faq-privacy-1',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 기록',
    question: '상담 받은 기록이 병원 진료 기록이나 건강보험공단, 회사, 학교에 남나요?',
    badge: '가장 많이 묻는 질문',
    answer: '전혀 남지 않습니다. 행복바람심리상담연구소는 의료기관(정신건강의학과)이 아닌 전문 심리상담기관입니다.\n\n따라서 국민건강보험공단 전산망이나 의료보험 전산 기록(정신과 질병코드 F코드)이 일절 생성되거나 공유되지 않습니다. 한국상담학회 및 한국상담심리학회 윤리강령에 의거하여 내담자의 신상정보와 상담 내용은 100% 철저히 비밀이 보장됩니다.\n\n※ 단, 본인 또는 타인의 생명에 중대한 위해를 가할 우려가 있는 법률상 필수 예외 상황에만 극히 제한적으로 적용됩니다.',
    highlights: ['의료기록 / F코드 일절 미생성', '건강보험공단 전산 미등록', '100% 철저한 비밀보장']
  },
  {
    id: 'faq-privacy-3',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 원칙',
    question: '상담 중 나눈 대화 내용과 개인정보는 구체적으로 어떻게 보호되나요?',
    badge: '비밀보장 원칙',
    answer: '내담자께서 안심하고 마음을 털어놓으실 수 있도록 3중 보안 원칙을 엄격히 준수합니다.\n\n1. 철저한 비밀보장 서약: 초기 상담 시작 전 상담사와 내담자 간 비밀보장 원칙 및 권리에 대한 공식 서약서를 작성하고 교부합니다.\n2. 암호화 분리 보관: 상담 기록 및 심리검사 결과지는 법정 의무 보관 기준에 맞춰 안전한 별도 분리 암호화 보관 체계로 관리됩니다.\n3. 비밀보장의 예외 (법적 필수 사항): 내담자 본인 또는 제3자의 생명이나 신체에 긴급한 위험(자해, 타해 위험)이 있거나, 법률에 의해 법원의 소환 명령이 있는 특수한 법정 사유를 제외하고는 가족, 배우자, 직장 등 어떠한 제3자에게도 동의 없이 공개되지 않습니다.',
    highlights: ['공식 비밀보장 서약서 작성', '상담기록 암호화 분리 보관', '가족·회사 등 제3자 비공개']
  },
  {
    id: 'faq-privacy-2',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 자격',
    question: '상담을 진행해주시는 상담사님의 공인 자격과 전문성은 어떠한가요?',
    badge: '전문성 보증',
    answer: '행복바람심리상담연구소의 모든 상담은 학회 및 국가 공인 최고 등급 자격을 보유한 박미경 소장님이 1:1로 직접 책임 전담합니다.\n\n• 학력: 교육학 박사 (상담 심리 및 교육 심리 전공)\n• 학회 자격: (사)한국상담학회 슈퍼바이저 / 전문상담사 1급 (No. 403)\n• 국가 자격: 여성가족부 청소년상담사 1급 국가공인자격\n• 정회원: 한국상담심리학회 정회원, 한국부부가족상담학회 정회원\n\n민간 등록 초보 상담사가 아닌, 학회 공인 슈퍼바이저이자 박사 학위 전문가가 깊은 경청과 임상적 조력을 제공합니다.',
    highlights: ['교육학 박사 (상담심리 전공)', '한국상담학회 수퍼바이저 / 1급 전문상담사', '청소년상담사 1급 국가공인자격']
  },
  {
    id: 'faq-remote-1',
    category: 'REMOTE',
    categoryLabel: '방문 & 비대면',
    question: '거리가 멀거나 직접 방문이 어려운 경우 비대면(화상/전화) 상담도 가능한가요?',
    badge: '전국/해외 가능',
    answer: '네, 전국 및 해외 거주자분들을 위해 비대면 심층 상담을 활발히 운영하고 있습니다.\n\n• 화상 상담: Zoom(줌) 또는 Google Meet을 통한 1:1 대면과 동일한 고화질 비대면 세션\n• 전화 상담: 유선 전화를 통한 심층 정서 상담\n\n대면 상담과 동일하게 1일 5회 사전 예약제로 운영되며, 예약 신청 시 [비대면 희망]을 선택해 주시면 안전한 접속 링크와 안내 문자를 발송해 드립니다.',
    highlights: ['Zoom 화상 및 유선 전화 상담', '대면과 동일한 1일 5회 집중 케어', '전국 및 해외 실시간 진행']
  },
  {
    id: 'faq-process-3',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 진행',
    question: '부부나 가족 상담의 경우 배우자가 상담을 거부하는데 혼자 방문해도 되나요?',
    answer: '네, 배우자가 상담을 망설이거나 거부할 때에는 1인 개인 상담으로 먼저 시작하시는 것을 적극 권장합니다.\n\n부부 갈등은 상호작용의 고리이므로, 한 사람의 변화와 감정 대처 방식만 달라져도 악순환의 고리가 끊어지기 시작합니다. 1인 상담을 통해 배우자의 저항 원인과 상처를 객관적으로 분석하고, 배우자가 방어심 없이 편안하게 상담실로 찾아올 수 있도록 초대하는 전략적 대화법을 소장님과 함께 준비할 수 있습니다.',
    highlights: ['1인 선행 개인상담 가능', '배우자 심리적 저항 원인 분석', '자연스러운 동반 상담 초대 코칭']
  },
  {
    id: 'faq-process-4',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 진행',
    question: '첫 방문 시 무엇을 준비해야 하며, 가족이나 보호자가 대기할 공간이 있나요?',
    answer: '특별한 서류나 준비물은 전혀 필요하지 않습니다. 편안한 마음과 복장으로 내원해 주시면 됩니다.\n\n센터 내부에는 아늑한 웰컴 티 라운지와 개별 대기 공간이 마련되어 있어, 보호자나 동반 가족분들이 편안하게 머무르실 수 있습니다. 또한 상가 전용 무료 지상 주차장을 완비하고 있어 주차 걱정 없이 방문하실 수 있습니다.',
    highlights: ['사전 준비 서류 없음', '아늑한 독립 대기 라운지 & 웰컴 티', '상가 전용 무료 주차장 완비']
  }
];

interface FAQProps {
  initialCategory?: FAQCategory;
  category?: FAQCategory;
  onCategoryChange?: (cat: FAQCategory) => void;
  targetFAQId?: string | null;
  showHeader?: boolean;
  className?: string;
  limit?: number;
  highlightedIds?: string[];
}

export default function FAQ({
  initialCategory = 'ALL',
  category: controlledCategory,
  onCategoryChange,
  targetFAQId,
  showHeader = true,
  className = '',
  limit,
  highlightedIds
}: FAQProps) {
  const { isHighContrast } = useHighContrast();
  const [internalCategory, setInternalCategory] = useState<FAQCategory>(initialCategory);
  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;

  const handleSelectCategory = (cat: FAQCategory) => {
    if (controlledCategory === undefined) {
      setInternalCategory(cat);
    }
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-process-1': true, // Default open Process question
    'faq-fee-1': true,     // Default open Fee question
    'faq-privacy-1': true, // Default open Confidentiality question
  });

  // When targetFAQId is passed, make sure it is expanded and highlighted
  useEffect(() => {
    if (targetFAQId) {
      setOpenIds(prev => ({
        ...prev,
        [targetFAQId]: true
      }));
    }
  }, [targetFAQId]);

  // Ref array for managing focus across accordion headers (W3C APG Accordion Pattern)
  const headerButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const categories = [
    { key: 'ALL', label: '전체 질문' },
    { key: 'PROCESS', label: '상담 절차 & 진행' },
    { key: 'FEE', label: '상담 비용 & 결제' },
    { key: 'PRIVACY', label: '비밀보장 & 자격' },
    { key: 'RESERVATION', label: '예약 & 취소 규정' },
    { key: 'REMOTE', label: '방문 & 비대면' },
  ] as const;

  // Toggle open accordion item
  const toggleItem = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand all / collapse all
  const toggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    FAQ_DATA.forEach(item => {
      newState[item.id] = expand;
    });
    setOpenIds(newState);
  };

  // Filtered FAQs based on category & search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      if (highlightedIds && !highlightedIds.includes(item.id)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inQuestion = item.question.toLowerCase().includes(query);
        const inAnswer = item.answer.toLowerCase().includes(query);
        const inCategory = item.categoryLabel.toLowerCase().includes(query);
        const inHighlights = item.highlights?.some(h => h.toLowerCase().includes(query));
        return inQuestion || inAnswer || inCategory || inHighlights;
      }
      return true;
    }).slice(0, limit || FAQ_DATA.length);
  }, [selectedCategory, searchQuery, limit, highlightedIds]);

  // Keep button refs array length in sync
  useEffect(() => {
    headerButtonRefs.current = headerButtonRefs.current.slice(0, filteredFAQs.length);
  }, [filteredFAQs.length]);

  // Accessible Keyboard Navigation for Accordions (W3C APG Pattern)
  const handleAccordionKeyDown = (e: React.KeyboardEvent, index: number) => {
    const total = filteredFAQs.length;
    if (total === 0) return;

    let targetIndex = -1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (index + 1) % total;
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (index - 1 + total) % total;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = total - 1;
        break;
      default:
        return;
    }

    if (targetIndex >= 0 && headerButtonRefs.current[targetIndex]) {
      headerButtonRefs.current[targetIndex]?.focus();
    }
  };

  // Screen reader announcement status
  const searchStatus = searchQuery.trim()
    ? `검색어 "${searchQuery}"에 대해 총 ${filteredFAQs.length}개의 자주 묻는 질문이 검색되었습니다.`
    : `총 ${filteredFAQs.length}개의 질문이 표시됩니다.`;

  return (
    <section 
      id="faq-accordion-section" 
      aria-label="자주 묻는 질문 (FAQ) 아코디언 안내"
      className={cn("w-full transition-colors", className)}
    >
      {/* Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        {searchStatus}
      </div>

      {showHeader && (
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage font-bold text-xs tracking-wider uppercase mb-3.5 border border-brand-sage/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">
            상담 절차·비용 및 비밀보장 <span className="text-brand-sage">자주 묻는 질문</span>
          </h2>
          <p className="text-sm sm:text-base text-brand-brown/70 max-w-2xl mx-auto leading-relaxed font-serif">
            첫 상담을 준비하시는 분들을 위해 진행 단계, 공식 비용, 비밀보장 원칙 등
            가장 많이 궁금해하시는 사항을 빠르고 정확하게 안내해 드립니다.
          </p>
        </div>
      )}

      {/* Quick Summary Cards: 3 Key Pillars (Process, Cost & Confidentiality Quick Glance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Process Quick Pillar */}
        <div className={cn(
          "p-5 rounded-2xl border transition-all flex items-start gap-3.5",
          isHighContrast
            ? "bg-black text-white border-white/60"
            : "bg-white border-brand-green/30 shadow-xs"
        )}>
          <div className="w-10 h-10 rounded-xl bg-brand-sage/10 text-brand-sage flex items-center justify-center shrink-0 border border-brand-sage/20">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-brown">진행 절차 핵심</span>
              <button
                type="button"
                onClick={() => handleSelectCategory('PROCESS')}
                className="text-[11px] text-brand-sage font-bold hover:underline cursor-pointer"
              >
                질문 보기 →
              </button>
            </div>
            <p className="text-brand-brown/70 leading-relaxed font-serif text-xs">
              <strong>접수 → 초기 면담 → 정기 상담 → 종결</strong>의 4단계이며, 1일 5회 사전 예약제로 운영됩니다.
            </p>
          </div>
        </div>

        {/* Fee Quick Pillar */}
        <div className={cn(
          "p-5 rounded-2xl border transition-all flex items-start gap-3.5",
          isHighContrast
            ? "bg-black text-white border-white/60"
            : "bg-white border-brand-green/30 shadow-xs"
        )}>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-brown">비용 정책 핵심</span>
              <button
                type="button"
                onClick={() => handleSelectCategory('FEE')}
                className="text-[11px] text-brand-sage font-bold hover:underline cursor-pointer"
              >
                비용 보기 →
              </button>
            </div>
            <p className="text-brand-brown/70 leading-relaxed font-serif text-xs">
              개인 10만원, 부부 18만원 정찰제이며, <strong>울산페이·카드·현금영수증 100%</strong> 지원됩니다.
            </p>
          </div>
        </div>

        {/* Confidentiality Quick Pillar */}
        <div className={cn(
          "p-5 rounded-2xl border transition-all flex items-start gap-3.5",
          isHighContrast
            ? "bg-black text-white border-white/60"
            : "bg-white border-brand-green/30 shadow-xs"
        )}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-brown">비밀보장 원칙</span>
              <button
                type="button"
                onClick={() => handleSelectCategory('PRIVACY')}
                className="text-[11px] text-brand-sage font-bold hover:underline cursor-pointer"
              >
                보장 보기 →
              </button>
            </div>
            <p className="text-brand-brown/70 leading-relaxed font-serif text-xs">
              의료기록·보험공단(F코드) 일절 남지 않으며, <strong>100% 철저한 비밀보장 서약</strong>을 준수합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Accessible Search Input Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <label htmlFor="faq-search-input" className="sr-only">
            자주 묻는 질문 키워드 검색
          </label>
          <Search 
            aria-hidden="true" 
            className="w-5 h-5 text-brand-sage absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" 
          />
          <input
            id="faq-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="궁금한 키워드를 입력해 보세요 (예: 비용, 절차, 울산페이, 비밀보장, 시간, 취소)"
            aria-describedby="faq-search-desc"
            className={cn(
              "w-full pl-12 pr-12 py-3.5 rounded-2xl border transition-all shadow-xs text-sm text-brand-brown placeholder:text-brand-brown/40 outline-hidden",
              isHighContrast
                ? "bg-white text-black border-2 border-black focus:ring-4 focus:ring-black"
                : "bg-white border-brand-green/30 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20"
            )}
          />
          <span id="faq-search-desc" className="sr-only">
            원하는 키워드를 입력하면 질문과 답변 목록이 실시간으로 필터링됩니다.
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="검색어 초기화"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-brand-brown/50 hover:text-brand-brown bg-brand-beige/60 hover:bg-brand-beige px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs & Quick Expand Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-2 border-b border-brand-green/20">
        <div 
          role="tablist" 
          aria-label="자주 묻는 질문 카테고리 선택"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                role="tab"
                id={`tab-${cat.key}`}
                aria-selected={isSelected}
                aria-controls="faq-accordion-container"
                onClick={() => handleSelectCategory(cat.key)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border",
                  isSelected
                    ? isHighContrast
                      ? "bg-black text-white border-white ring-2 ring-white"
                      : "bg-brand-sage text-white border-brand-sage shadow-xs"
                    : isHighContrast
                      ? "bg-white text-black border-black hover:bg-gray-200"
                      : "bg-white hover:bg-brand-green/20 text-brand-brown/75 hover:text-brand-brown border-brand-green/30"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Counter and Expand/Collapse All Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center text-xs text-brand-brown/65">
          <span>
            표시 항목: <strong className="text-brand-brown font-bold">{filteredFAQs.length}</strong>건
          </span>
          <span className="text-brand-green/40" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => toggleAll(true)}
            aria-label="모든 질문 답변 펼치기"
            className="hover:text-brand-sage font-medium transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            모두 펼치기
          </button>
          <span className="text-brand-green/40" aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            aria-label="모든 질문 답변 접기"
            className="hover:text-brand-sage font-medium transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            모두 접기
          </button>
        </div>
      </div>

      {/* Accordion List Container */}
      <div id="faq-accordion-container" className="space-y-3.5">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-brand-green/20 space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-beige/50 flex items-center justify-center mx-auto text-brand-brown/40">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-brand-brown">일치하는 질문을 찾지 못했습니다</h3>
            <p className="text-xs sm:text-sm text-brand-brown/65 max-w-md mx-auto leading-relaxed">
              '{searchQuery}' 관련 질문을 찾을 수 없습니다. 다른 단어로 검색하시거나 상담소 전화(052-254-0230)로 문의하시면 바로 안내해 드립니다.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                handleSelectCategory('ALL');
              }}
              className="mt-2 px-5 py-2.5 bg-brand-sage text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-sage/90 transition-colors cursor-pointer"
            >
              전체 질문으로 돌아가기
            </button>
          </div>
        ) : (
          filteredFAQs.map((faq, idx) => {
            const isOpen = !!openIds[faq.id];
            const headerId = `faq-header-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs",
                  isOpen 
                    ? isHighContrast
                      ? "border-2 border-black ring-2 ring-black"
                      : "border-brand-sage shadow-md ring-1 ring-brand-sage/25" 
                    : isHighContrast
                      ? "border-2 border-gray-600 hover:border-black"
                      : "border-brand-green/25 hover:border-brand-sage/50"
                )}
              >
                {/* Accordion Trigger Header */}
                <h3 className="text-base font-normal m-0 p-0">
                  <button
                    type="button"
                    id={headerId}
                    ref={(el) => { headerButtonRefs.current[idx] = el; }}
                    onClick={() => toggleItem(faq.id)}
                    onKeyDown={(e) => handleAccordionKeyDown(e, idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full px-5 sm:px-6 py-4.5 flex items-start justify-between gap-4 text-left transition-colors cursor-pointer group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-sage"
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                      {/* Q Icon Badge */}
                      <span 
                        aria-hidden="true"
                        className={cn(
                          "w-7 h-7 rounded-xl font-serif font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 border transition-colors",
                          isOpen
                            ? "bg-brand-sage text-white border-brand-sage"
                            : "bg-brand-sage/10 text-brand-sage border-brand-sage/20 group-hover:bg-brand-sage group-hover:text-white"
                        )}
                      >
                        Q
                      </span>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-md">
                            {faq.categoryLabel}
                          </span>
                          {faq.badge && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{faq.badge}</span>
                            </span>
                          )}
                        </div>

                        <span className="block text-sm sm:text-base font-bold text-brand-brown group-hover:text-brand-sage transition-colors leading-snug">
                          {faq.question}
                        </span>
                      </div>
                    </div>

                    {/* Chevron Indicator */}
                    <div 
                      aria-hidden="true"
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200",
                        isOpen 
                          ? "rotate-180 bg-brand-sage text-white" 
                          : "bg-brand-beige/50 text-brand-brown/60 group-hover:bg-brand-green/30"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                </h3>

                {/* Accordion Region Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-brand-green/15 bg-brand-beige/10">
                        <div className="flex items-start gap-3.5 sm:gap-4 pt-3.5">
                          {/* A Icon Badge */}
                          <span 
                            aria-hidden="true"
                            className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-serif font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200"
                          >
                            A
                          </span>

                          <div className="space-y-3.5 flex-1 text-xs sm:text-sm text-brand-brown/85 leading-relaxed font-serif">
                            <p className="whitespace-pre-line leading-relaxed">
                              {faq.answer}
                            </p>

                            {/* Key Highlight Badges */}
                            {faq.highlights && faq.highlights.length > 0 && (
                              <div className="pt-2 flex flex-wrap items-center gap-1.5 font-sans">
                                {faq.highlights.map((highlight, hIdx) => (
                                  <span 
                                    key={hIdx}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-brand-green/30 text-[11px] font-medium text-brand-brown/80 shadow-2xs"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>{highlight}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Direct Assistance CTA Box */}
      <div className="mt-12 bg-gradient-to-br from-white via-brand-beige/40 to-brand-green/20 rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sage bg-white px-3 py-1 rounded-full border border-brand-green/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
            <span>친절한 1:1 안내 상담</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-brown">
            더 자세한 일정이나 개별 비용 견적이 궁금하신가요?
          </h3>
          <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed max-w-xl font-serif">
            편안한 마음으로 문의해 주세요. 내담자의 상황에 맞춰 가장 효과적인 상담 방향과 비용을 따뜻하게 안내해 드립니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full sm:w-auto">
          <a
            href="tel:052-254-0230"
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-brand-beige/40 text-brand-brown font-bold text-xs sm:text-sm rounded-xl border border-brand-green/30 transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            <Phone className="w-4 h-4 text-brand-sage group-hover:scale-110 transition-transform" />
            <span>052-254-0230 (전화 연결)</span>
          </a>

          <Link
            to="/reservation"
            className="w-full sm:w-auto px-6 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>온라인 상담 예약</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
