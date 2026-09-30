import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Users, 
  Calendar, 
  Video, 
  HeartHandshake, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

export interface QuickFAQItem {
  id: string;
  category: 'ALL' | 'PRIVACY' | 'FEE' | 'PROCESS' | 'RELATION' | 'SCHEDULE';
  categoryLabel: string;
  concernTag: string;
  question: string;
  quickAnswer: string;
  fullAnswer: string;
  takeaways: string[];
  ctaLabel?: string;
  ctaLink?: string;
}

const FAQ_ITEMS: QuickFAQItem[] = [
  {
    id: 'faq-privacy',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 기록',
    concernTag: '기록 걱정',
    question: '상담 받은 기록이 병원 진료 기록이나 건강보험공단, 회사, 학교에 남나요?',
    quickAnswer: '전혀 남지 않습니다. 의료기관이 아닌 순수 전문 심리상담기관으로 건강보험 전산망에 F코드(정신과 질병코드)가 일절 등록되지 않습니다.',
    fullAnswer: '행복바람심리상담연구소는 병의원이 아닌 순수 민간 전문 심리상담 연구기관입니다. 국민건강보험공단 전산망이나 의료보험 전산 기록이 생성되지 않으며, 직장 검진, 취업, 학교 생활기록부, 민간 보험 가입 시 어떠한 불이익도 없습니다.\n\n한국상담학회 및 한국상담심리학회 윤리강령 제1조에 의거하여, 내담자의 모든 상담 내용과 개인정보는 100% 철저한 법적 비밀보장 서약 속에서 안전하게 암호화 보관됩니다.',
    takeaways: [
      '의료보험 전산 기록 / F코드 일절 미생성',
      '회사·학교·보험 가입 시 열람 불가 100% 안심',
      '학회 공인 1급 슈퍼바이저의 엄격한 비밀보장 서약 준수'
    ],
    ctaLabel: '비밀보장 및 원칙 더 알아보기',
    ctaLink: '/community?tab=faq'
  },
  {
    id: 'faq-fee',
    category: 'FEE',
    categoryLabel: '비용 & 결제',
    concernTag: '비용 안내',
    question: '상담 프로그램별 공식 비용과 회기당 시간, 결제 방식은 어떻게 되나요?',
    quickAnswer: '개인·아동상담 50분 10만원, 부부·가족상담 80분 18만원 정찰제이며, 울산페이·신용카드·현금영수증 100% 가능합니다.',
    fullAnswer: '행복바람은 투명하고 정직한 정찰제 비용 정책을 준수합니다.\n\n• 개인 심리상담 (청소년 및 성인): 1회기 50분 / 100,000원\n• 부부 및 가족상담: 1회기 80분 / 180,000원\n• 아동 상담: 1회기 50분 (아동 상담 40분 + 부모 양육 피드백 10분) / 100,000원\n• 종합심리검사 (Full Battery): 지능·성격·정서 통합 정밀 검사 및 심층 해석 상담 / 별도 안내\n\n모든 상담은 교육학 박사이자 공인 1급 수련감독자인 박미경 대표 소장이 1:1로 직접 전담합니다.',
    takeaways: [
      '개인·아동 50분 10만원 / 부부·가족 80분 18만원 정찰제',
      '울산페이(지역화폐) 결제 및 소득공제용 현금영수증 100% 발행',
      '교육학 박사 대표 원장 1:1 직접 상담 전담'
    ],
    ctaLabel: '프로그램별 비용 상세 확인',
    ctaLink: '/programs'
  },
  {
    id: 'faq-duration',
    category: 'PROCESS',
    categoryLabel: '진행 & 회기',
    concernTag: '상담 기간',
    question: '상담은 보통 몇 회기 정도 받아야 효과를 체감하고 마음이 편안해지나요?',
    quickAnswer: '상황적 스트레스는 단기(4~8회기), 뿌리 깊은 관계·정서 갈등은 중기(10~15회기)에 충분한 회복을 체감하실 수 있습니다.',
    fullAnswer: '내담자께서 마주한 심리적 어려움의 깊이와 목표에 따라 유연하게 결정됩니다.\n\n• 단기 상담 (4~8회기): 특정 상황적 스트레스, 직장 번아웃, 긴급한 의사결정 완화\n• 중기 상담 (10~15회기): 만성적인 대인관계 갈등, 우울·불안의 기저 패턴 완화, 부부 갈등의 구조적 개선\n• 심층 상담 (15회기 이상): 유년기 애착 결핍 치유, 성격 구조적 변화와 자아 탄력성 확립\n\n첫 회기(초기 면담)를 마친 후, 소장님과 내담자의 상황에 가장 최적화된 회기 계획을 자율적 상의 하에 결정하므로 부담 없이 시작하실 수 있습니다.',
    takeaways: [
      '단기(4~8회)부터 심층(15회 이상)까지 내담자 맞춤 설계',
      '강요나 의무 회기 없이 1회기 상담 후 자율적 상의 결정',
      '주 1회 정기 세션 진행으로 체계적인 일상 회복 지원'
    ],
    ctaLabel: '1:1 초기 상담 예약하기',
    ctaLink: '/reservation'
  },
  {
    id: 'faq-couple',
    category: 'RELATION',
    categoryLabel: '부부 & 가족',
    concernTag: '동반 거부',
    question: '부부나 가족 갈등인데, 배우자나 자녀가 방문을 완강히 거부할 땐 어떻게 하나요?',
    quickAnswer: '1인 개인 상담으로 먼저 시작하셔도 충분합니다. 한 사람의 변화와 대처 방식만 달라져도 갈등의 악순환 고리가 끊어집니다.',
    fullAnswer: '부부 갈등은 톱니바퀴처럼 맞물린 상호작용의 고리입니다. 배우자가 상담에 저항하거나 두려워할 때 억지로 데려오기보다는, 문제를 먼저 자각한 한 분이 1인 상담으로 시작하시는 것을 적극 권장합니다.\n\n1인 상담을 통해 배우자의 심리적 저항 원인과 상처를 객관적으로 분석하고, 배우자가 방어심 없이 편안하게 상담실로 찾아올 수 있도록 초대하는 전략적 대화법(비폭력 대화 및 이마고 부부 대화 코칭)을 소장님과 함께 준비할 수 있습니다.',
    takeaways: [
      '배우자 거부 시 1인 선행 개인상담으로 효과적인 접근',
      '갈등 악순환 고리를 끊는 관계 역동 심층 분석',
      '방어심을 허무는 자연스러운 동반 상담 초대 대화법 코칭'
    ],
    ctaLabel: '부부·가족 상담 안내 보기',
    ctaLink: '/programs'
  },
  {
    id: 'faq-cancel',
    category: 'SCHEDULE',
    categoryLabel: '예약 & 취소',
    concernTag: '일정 변경',
    question: '갑작스러운 일정 변경이나 예약 취소, 환불 규정은 어떻게 되나요?',
    quickAnswer: '예약 시간 24시간 전(전날)까지 연락 주시면 수수료 없이 100% 무료 일정 변경 및 전액 환불이 가능합니다.',
    fullAnswer: '행복바람은 1일 5회 한정 1:1 심층 상담제로 운영되어, 해당 시간대를 오직 한 분의 내담자만을 위해 독립 상담실로 비워둡니다.\n\n• 예약 24시간 전까지: 100% 무료 일정 변경 및 전액 환불\n• 당일 직전 취소 또는 노쇼: 공간 확보 및 다른 위기 내담자의 상담 기회 제한으로 인해 일정 위약 규정이 적용될 수 있습니다.\n\n일정 조율이 필요하신 경우 최소 하루 전 유선 전화(052-254-0230) 또는 카카오 채널로 연락 주시면 가장 가까운 시간대로 우선 재배치해 드립니다.',
    takeaways: [
      '24시간 전 연락 시 100% 무료 변경 & 전액 환불',
      '1일 5회 한정 프라이빗 독립 상담실 운영',
      '전화(052-254-0230) 또는 온라인으로 손쉬운 일정 변경'
    ]
  },
  {
    id: 'faq-remote',
    category: 'SCHEDULE',
    categoryLabel: '야간 & 비대면',
    concernTag: '직장인·원격',
    question: '퇴근 후 야간 시간대나 토요일 주말, 혹은 거리가 먼 경우 비대면 상담도 가능한가요?',
    quickAnswer: '네, 직장인을 위한 평일 19:00 야간 세션, 토요일 주말 세션 및 전국·해외 대상 Zoom 화상 상담을 활발히 운영하고 있습니다.',
    fullAnswer: '내담자의 바쁜 일상을 고려하여 다양한 시간대와 진행 방식을 제공합니다.\n\n• 평일 야간 세션: 월~금 매일 저녁 19:00~20:00 (퇴근 후 직장인·수험생 인기 세션)\n• 토요일 주말 세션: 09:00 ~ 17:00 (맞벌이 부부 및 커플 상담 집중 세션)\n• 전국·해외 비대면 화상 상담: Zoom 또는 Google Meet을 통해 대면과 동일한 1:1 심층 세션 진행\n\n대면과 비대면 모두 동일하게 교육학 박사 대표 원장이 직접 전담하며, 예약 시 [비대면 희망]을 선택해 주시면 안전한 접속 링크를 발송해 드립니다.',
    takeaways: [
      '월~금 평일 19:00 야간 세션 & 토요일 주말 세션 운영',
      '전국 및 해외 거주자를 위한 1:1 Zoom 고화질 화상 상담',
      '대면과 동일한 교육학 박사 1급 슈퍼바이저 직접 전담'
    ],
    ctaLabel: '원하는 일정으로 실시간 예약',
    ctaLink: '/reservation'
  },
  {
    id: 'faq-medical',
    category: 'PROCESS',
    categoryLabel: '진행 & 회기',
    concernTag: '병원 vs 상담소',
    question: '정신건강의학과(병원) 약물 치료와 심리상담연구소의 차이점은 무엇인가요?',
    quickAnswer: '병원은 뇌 신경전달물질 조절을 통한 급성 증상 완화, 상담소는 생각·감정·관계의 근본 원인을 찾아 영구적인 회복을 돕습니다.',
    fullAnswer: '정신건강의학과는 의사가 면담 후 약물 처방을 통해 불면, 공황발작, 극심한 불안 등 신체화 증상을 신속히 완화하는 데 탁월합니다.\n\n반면 행복바람 심리상담연구소는 약물 없이 50~80분 동안 내담자의 삶의 서사, 반복되는 감정 패턴, 무의식적 상처, 가족 역동을 심층 탐색하여 내면의 자생력과 대처 기술을 길러줍니다.\n\n약물만으로는 해결되지 않는 관계의 문제나 인지적 왜곡을 근본적으로 교정하며, 필요 시 약물 치료와 심리상담을 병행하여 최상의 시너지를 얻을 수 있도록 안전하게 협력합니다.',
    takeaways: [
      '병원의 약물 대증 치료 vs 상담소의 근본적 심리 치유',
      '50~80분 동안 경청과 공감을 통한 깊이 있는 1:1 대화',
      '약물 치료 중인 분도 안전하게 병행 가능한 맞춤 조력'
    ]
  },
  {
    id: 'faq-parking',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 편의',
    concernTag: '방문 안내',
    question: '첫 방문 시 무엇을 준비해야 하며, 전용 주차장이나 보호자 대기실이 있나요?',
    quickAnswer: '준비 서류는 전혀 없으며, 편안한 복장으로 오시면 됩니다. 건물 지하(B1, B2) 무료 주차장과 아늑한 웰컴티 라운지가 완비되어 있습니다.',
    fullAnswer: '특별한 검사 결과지나 서류는 필요하지 않습니다. 초기 면담에서 필요한 심리검사(MMPI-2, TCI 등)는 소장님의 안내에 따라 연구소 내에서 편안하게 진행됩니다.\n\n• 독립 프라이빗 대기 공간: 다른 내담자와 마주치지 않도록 동선이 배려된 조용한 대기실\n• 프리미엄 웰컴 티 서비스: 긴장을 풀어주는 따뜻한 유기농 허브티 제공\n• 편리한 교통 및 무료 주차: 울산 KTX/SRT 역세권 인근으로 대중교통이 편리하며, 건물 지하(B1, B2) 무료 주차장을 여유롭게 이용하실 수 있습니다.',
    takeaways: [
      '사전 지참 서류 일절 없이 편안한 복장으로 방문',
      '동선 분리 프라이빗 대기 라운지 & 유기농 웰컴티 제공',
      'KTX 역세권 인근 & 건물 지하(B1, B2) 무료 주차장 완비'
    ],
    ctaLabel: '오시는 길 & 약도 확인하기',
    ctaLink: '/guide'
  }
];

const CATEGORY_TABS = [
  { id: 'ALL', label: '전체' },
  { id: 'PRIVACY', label: '비밀보장·기록' },
  { id: 'FEE', label: '비용·결제' },
  { id: 'PROCESS', label: '상담절차·회기' },
  { id: 'RELATION', label: '부부·가족' },
  { id: 'SCHEDULE', label: '일정·야간·비대면' },
];

export default function FrequentlyAskedQuestions({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Accordion open state: Default opens the most critical two questions (Confidentiality & Fee)
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-privacy': true,
    'faq-fee': false,
  });

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    filteredItems.forEach(item => {
      allOpen[item.id] = true;
    });
    setOpenIds(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenIds({});
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inQuestion = item.question.toLowerCase().includes(query);
        const inQuick = item.quickAnswer.toLowerCase().includes(query);
        const inFull = item.fullAnswer.toLowerCase().includes(query);
        const inTag = item.concernTag.toLowerCase().includes(query);
        return inQuestion || inQuick || inFull || inTag;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const allAreOpen = filteredItems.length > 0 && filteredItems.every(i => openIds[i.id]);

  return (
    <section 
      aria-label="자주 묻는 질문 (FAQ) 아코디언" 
      className={cn("w-full transition-colors", className)}
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Header Block: Space-conscious & Typographically confident */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-serif text-brand-sage uppercase tracking-wider mb-2.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span>첫 방문 전 궁금증 해소</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3 leading-tight">
            상담 전 가장 많이 묻는 <span className="text-brand-sage">핵심 궁금증</span>
          </h2>

          <p className="text-xs sm:text-sm text-brand-brown/70 font-serif leading-relaxed">
            비밀보장 원칙부터 공식 비용, 진행 절차까지 내담자분들이 가장 궁금해하시는 핵심 내용을
            빠르고 명확하게 확인하실 수 있도록 아코디언으로 정리했습니다.
          </p>
        </div>

        {/* 3 Key Assurance Highlights (High Confidence Anchor) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">100% 비의료 비밀보장</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">건강보험 전산 F코드 일절 미등재</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">정찰제 비용 &amp; 영수증</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">개인 10만 / 부부 18만 / 울산페이</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-sage/10 text-brand-sage flex items-center justify-center shrink-0 border border-brand-sage/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">1일 5회 사전 예약제</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">대기 없는 1:1 프라이빗 세션</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar: Category Segmented Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white/90 backdrop-blur-xs rounded-xl border border-brand-green/30 w-full sm:w-auto shadow-2xs">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-serif font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-brand-sage text-white shadow-2xs"
                      : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search & Expand/Collapse Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-56">
              <input
                type="text"
                placeholder="궁금한 내용 검색 (비밀, 비용, 야간)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs font-serif bg-white border border-brand-green/30 focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-hidden transition-all shadow-2xs text-brand-brown placeholder:text-brand-brown/40"
              />
              <Search className="w-3.5 h-3.5 text-brand-brown/40 absolute left-2.5 top-2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-brand-brown/40 hover:text-brand-brown"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={allAreOpen ? handleCollapseAll : handleExpandAll}
              className="px-3 py-1.5 rounded-xl bg-white border border-brand-green/30 hover:bg-brand-beige/40 text-xs font-serif font-semibold text-brand-brown/80 shrink-0 shadow-2xs transition-colors cursor-pointer"
            >
              {allAreOpen ? '모두 접기' : '모두 펼치기'}
            </button>
          </div>
        </div>

        {/* Accordion List Container */}
        {filteredItems.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-brand-green/20 max-w-md mx-auto shadow-2xs">
            <HelpCircle className="w-7 h-7 text-brand-brown/40 mx-auto mb-2" />
            <p className="text-sm font-serif font-bold text-brand-brown mb-1">
              검색 조건에 맞는 질문을 찾을 수 없습니다
            </p>
            <p className="text-xs font-serif text-brand-brown/60 mb-4">
              다른 키워드로 검색하시거나 전체 탭을 선택해 보세요.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 bg-brand-sage text-white text-xs font-bold rounded-xl hover:bg-brand-sage/90 transition-colors cursor-pointer shadow-2xs"
            >
              전체 질문 보기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, idx) => {
              const isOpen = !!openIds[item.id];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border transition-all duration-200 overflow-hidden",
                    isOpen
                      ? "bg-white border-brand-sage/60 shadow-sm ring-1 ring-brand-sage/20"
                      : "bg-white/80 hover:bg-white border-brand-green/25 hover:border-brand-green/40 shadow-2xs"
                  )}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Numeric or Category Anchor */}
                      <span className={cn(
                        "w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                        isOpen
                          ? "bg-brand-sage text-white"
                          : "bg-brand-beige text-brand-brown/70 group-hover:bg-brand-sage/10 group-hover:text-brand-sage"
                      )}>
                        Q{idx + 1}
                      </span>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-serif font-bold text-brand-sage">
                            {item.categoryLabel}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-brand-beige/60 text-brand-brown/70 font-serif font-medium border border-brand-green/15">
                            {item.concernTag}
                          </span>
                        </div>

                        <h3 className={cn(
                          "text-sm sm:text-base font-serif font-bold transition-colors leading-snug",
                          isOpen ? "text-brand-sage" : "text-brand-brown group-hover:text-brand-sage"
                        )}>
                          {item.question}
                        </h3>

                        {/* Collapsed One-Line Teaser (Aids scan-ability before expanding) */}
                        {!isOpen && (
                          <p className="text-xs text-brand-brown/65 font-serif line-clamp-1 pt-0.5">
                            {item.quickAnswer}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chevron Indicator Button */}
                    <div className={cn(
                      "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 mt-1",
                      isOpen 
                        ? "bg-brand-sage/15 text-brand-sage rotate-180" 
                        : "bg-brand-beige/50 text-brand-brown/50 group-hover:text-brand-brown"
                    )}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Collapsible Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-question-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-brand-green/15 space-y-4">
                          
                          {/* Quick Highlight Box */}
                          <div className="p-3.5 rounded-xl bg-brand-beige/35 border border-brand-green/20 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                            <div className="text-xs font-serif leading-relaxed text-brand-brown">
                              <strong className="text-brand-brown font-bold">핵심 요약: </strong>
                              {item.quickAnswer}
                            </div>
                          </div>

                          {/* Full Elaborated Clinical Answer */}
                          <div className="text-xs sm:text-sm font-serif text-brand-brown/85 leading-relaxed whitespace-pre-line pl-1">
                            {item.fullAnswer}
                          </div>

                          {/* Takeaway Checkpoints */}
                          {item.takeaways && item.takeaways.length > 0 && (
                            <div className="pt-3 border-t border-brand-green/10 space-y-1.5">
                              <div className="text-[11px] font-bold text-brand-brown/60 uppercase tracking-wide font-serif mb-1">
                                핵심 체크포인트:
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {item.takeaways.map((point, pIdx) => (
                                  <div key={pIdx} className="flex items-start gap-1.5 text-xs text-brand-brown/80 font-serif">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Optional Contextual CTA Link */}
                          {item.ctaLink && item.ctaLabel && (
                            <div className="pt-2 flex justify-end">
                              <Link
                                to={item.ctaLink}
                                className="inline-flex items-center gap-1 text-xs font-serif font-bold text-brand-sage hover:text-brand-brown transition-colors"
                              >
                                <span>{item.ctaLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Space-Efficient Bottom Support & Reservation Bridge */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-sage/10 text-brand-sage flex items-center justify-center shrink-0 border border-brand-sage/20 hidden sm:flex">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-brand-brown font-serif">
                찾으시는 질문의 답변이 없으신가요?
              </div>
              <div className="text-[11px] sm:text-xs text-brand-brown/70 font-serif">
                <strong>052-254-0230</strong> (1:1 안심 상담) 또는 온라인 폼으로 언제든 편안히 문의해 주세요.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-center">
            <Link
              to="/community?tab=faq"
              className="px-4 py-2 rounded-xl border border-brand-green/40 hover:bg-brand-beige/50 text-xs font-serif font-bold text-brand-brown transition-colors shadow-2xs"
            >
              FAQ 전체보기
            </Link>

            <Link
              to="/reservation"
              className="px-5 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-serif font-bold shadow-2xs transition-all flex items-center gap-1.5 active:scale-98"
            >
              <span>1:1 상담 예약하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
