import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, ChevronDown, Search, ShieldCheck, 
  Calendar, CreditCard, Clock, Phone, MapPin, 
  Sparkles, CheckCircle2, MessageSquare, ArrowRight,
  RefreshCw, FileText
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'ALL' | 'PRIVACY' | 'RESERVATION' | 'PROCESS' | 'VISIT';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  badge?: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-privacy-1',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 기록',
    question: '상담 받은 사실이나 내용이 병원 기록이나 건강보험공단, 직장에 남나요?',
    badge: '가장 많이 묻는 질문',
    answer: '전혀 남지 않습니다. 행복바람심리상담연구소는 의료기관(정신건강의학과)이 아닌 전문 사설 심리상담기관입니다.\n\n따라서 국민건강보험공단 전산망이나 의료보험 진료기록(정신과 F코드 등)이 일절 생성되거나 공유되지 않습니다. 한국상담학회 윤리강령 및 관련 법령에 의거하여 내담자의 신상정보와 상담 내용은 100% 철저히 비밀이 보장됩니다.\n\n※ 단, 본인 또는 타인의 생명·신체에 중대한 위해를 가할 우려가 있는 법률상 필수 예외 상황에만 제한적으로 적용됩니다.',
    highlights: ['의료기록/F코드 일절 미생성', '건강보험공단 전산 등록 없음', '100% 철저한 비밀보장']
  },
  {
    id: 'faq-reservation-1',
    category: 'RESERVATION',
    categoryLabel: '예약 & 일정',
    question: '예약 일정 변경이나 취소는 언제까지 가능한가요?',
    badge: '필독',
    answer: '행복바람심리상담연구소는 1일 5회 한정 1:1 심층 상담제로 운영되어, 해당 시간대를 오직 한 분의 내담자만을 위해 비워둡니다.\n\n일정 변경 및 취소는 최소 24시간 전(전날)까지 대표전화(052-254-0230) 또는 카카오 알림톡/문자로 연락 부탁드립니다. 당일 직전 취소나 무단 불참(노쇼)은 다른 위기 내담자의 소중한 상담 기회를 제한하게 되므로 시간 엄수를 부탁드립니다.',
    highlights: ['최소 24시간 전 사전 연락', '1일 5회 한정 1:1 심층상담제 운영']
  },
  {
    id: 'faq-process-1',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 비용',
    question: '상담은 보통 몇 번 정도 받아야 효과가 있나요?',
    answer: '내담자께서 겪고 계신 심리적 어려움의 깊이와 세부 목표에 따라 맞춤형으로 결정됩니다.\n\n• 초기 1~2회기: 현재 겪는 주 호소 문제 탐색, 심리적 기저 요인 파악 및 목표 수립\n• 단기 상담 (4~8회기): 스트레스 대처 기술 습득, 특정 갈등 해결 및 정서 안정\n• 심층 상담 (10회기 이상): 깊은 트라우마 치유, 성격적 패턴 개선 및 지속 가능한 자존감 회복\n\n첫 회기(초기상담) 진행 후 박미경 상담 소장님과 함께 내담자의 페이스에 맞는 최적의 회기를 자율적으로 상의하여 결정합니다.',
    highlights: ['초기 1~2회기 탐색 후 회기 자율 결정', '단기 집중부터 심층 치유까지 맞춤형']
  },
  {
    id: 'faq-visit-1',
    category: 'VISIT',
    categoryLabel: '방문 & 비대면',
    question: '첫 상담을 방문할 때 무엇을 준비해야 하나요?',
    answer: '특별한 서류나 사전 준비물은 전혀 필요하지 않습니다. 솔직하고 편안한 마음으로 방문해 주시면 됩니다.\n\n상담소에 도착하시면 따뜻한 차와 함께 초기 접수 면담지를 간단히 작성하시게 됩니다. 보다 여유로운 상담 진행을 위해 예약 시간 5~10분 전 도착해 주시기를 권장합니다.',
    highlights: ['별도 서류 불필요', '편안한 복장과 마음', '예약 5~10분 전 도착 권장']
  },
  {
    id: 'faq-process-2',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 비용',
    question: '결제 수단(카드, 울산페이, 현금영수증)과 정부 바우처 사용이 가능한가요?',
    answer: '신용카드, 체크카드, 울산페이(지역화폐), 계좌이체(현금영수증 100% 발행) 모두 결제 가능합니다.\n\n정부·지자체 발급 바우처(발달재활서비스, 아동·청소년 심리지원, 청년마음건강지원사업 등)의 경우 지원 연도 및 지자체 배정 쿼터에 따라 차이가 있을 수 있으므로, 방문 전 유선(052-254-0230)으로 문의해 주시면 신속하게 적용 여부를 확인해 드립니다.',
    highlights: ['신용/체크카드 & 울산페이 가능', '현금영수증 100% 발행', '바우처 사용 여부 유선 확인']
  },
  {
    id: 'faq-visit-2',
    category: 'VISIT',
    categoryLabel: '방문 & 비대면',
    question: '거리가 멀거나 방문이 힘든데 비대면(화상/전화) 상담도 가능한가요?',
    badge: '전국/해외 가능',
    answer: '네, 가능합니다. 해외 거주자, 타 시·도 거주자, 또는 거동이나 사정으로 센터 방문이 어려우신 분들을 위해 비대면 전문 심리상담을 운영하고 있습니다.\n\n• 화상 상담: Zoom(줌) 또는 Google Meet을 통한 안전한 1:1 비대면 면담\n• 전화 상담: 유선 전화를 통한 심층 정서 상담\n\n대면 상담과 동일하게 1일 5회 사전 예약제로 운영되며, 예약 신청 시 [비대면 희망] 메모를 남겨주시면 안전한 접속 링크를 안내해 드립니다.',
    highlights: ['Zoom 화상 또는 유선 전화 상담', '대면 상담과 동일한 집중도']
  },
  {
    id: 'faq-process-3',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 비용',
    question: '부부/커플 상담이나 가족 상담은 둘이 꼭 같이 와야 하나요?',
    answer: '두 분이 함께 참여하시는 것이 관계의 상호작용 패턴을 입체적으로 관찰하고 빠른 화해와 합의점을 찾는 데 가장 효과적입니다.\n\n그러나 만약 배우자나 상대방이 상담 참여를 주저하거나 강하게 거부하는 경우, 우선 1인 개인 상담으로 시작하실 수 있습니다. 상담을 통해 상대방의 심리적 저항 요인을 파악하고, 상대를 자연스럽게 상담으로 초대하는 전략적 접근을 소장님과 함께 준비하실 수 있습니다.',
    highlights: ['동반 참석 권장', '상대방 거부 시 1인 개인상담으로 선행 가능']
  },
  {
    id: 'faq-visit-3',
    category: 'VISIT',
    categoryLabel: '방문 & 비대면',
    question: '아동/청소년 상담 진행 시 부모 상담도 함께 포함되나요?',
    answer: '네, 기본으로 포함되어 진행됩니다.\n\n아동과 청소년의 정서적 안정과 행동 변화는 가정 환경 및 주양육자의 양육 태도와 직결되어 있습니다. 따라서 놀이/미술치료 및 청소년 심리상담은 자녀 상담(40분) 진행 후, 매 회기 부모님과의 10분 피드백 및 가정 내 양육 코칭 상담이 필수적으로 결합되어 진행됩니다.',
    highlights: ['자녀 상담 40분 + 부모 피드백 10분 결합', '가정 내 양육 코칭 병행']
  },
  {
    id: 'faq-visit-4',
    category: 'VISIT',
    categoryLabel: '방문 & 비대면',
    question: '주차 시설과 센터 위치, 대중교통 이용 방법을 알고 싶습니다.',
    answer: '센터가 입주한 상가 전용 무료 지상 주차장을 상시 무료로 이용하실 수 있습니다.\n\n• 주소: 울산광역시 울주군 삼남읍 도호1길 23 상가 408호\n• 자차 이용 시: 네비게이션에 [행복바람심리상담연구소] 또는 도로명 주소를 입력하시면 바로 안내됩니다.\n• KTX 이용 시: 울산역(통도사역)에서 차량으로 약 5~7분 거리에 위치하여 인근 지역(양산, 부산, 밀양)에서도 편리하게 방문하실 수 있습니다.',
    highlights: ['상가 전용 무료 주차장 완비', '울산역 인근 (차량 약 5~7분)']
  },
  {
    id: 'faq-privacy-2',
    category: 'PRIVACY',
    categoryLabel: '비밀보장 & 기록',
    question: '상담을 진행해주시는 상담사님의 전문성과 자격은 공인된 것인가요?',
    badge: '전문성 보증',
    answer: '행복바람심리상담연구소의 모든 상담은 공인된 최고 등급 자격을 갖춘 박미경 상담 소장님이 1:1로 직접 전담합니다.\n\n• 교육학 박사 (상담 심리 및 교육 심리 전공)\n• 한국상담학회 슈퍼바이저 / 전문상담사 1급 (No. 403)\n• 여성가족부 청소년상담사 1급 국가공인자격\n• 한국상담심리학회 정회원 & 한국부부가족상담학회 정회원\n\n민간 자격증이나 초보 상담사가 아닌, 학회 공인 슈퍼바이저이자 박사 학위 전문가가 책임감을 갖고 깊이 있는 상담을 제공합니다.',
    highlights: ['교육학 박사 (상담심리 전공)', '한국상담학회 수퍼바이저/1급', '여성가족부 청소년상담사 1급']
  },
  {
    id: 'faq-process-4',
    category: 'PROCESS',
    categoryLabel: '상담 절차 & 비용',
    question: '종합심리검사(Full Battery)와 무료 간이 자가진단은 어떻게 다른가요?',
    answer: '홈페이지에서 제공하는 [간이 자가진단]은 우울, 불안, 스트레스 지수를 간편하게 점검하여 나에게 필요한 상담 유형을 파악하는 선별 스크리닝 도구입니다.\n\n반면 [종합심리검사(Full Battery)]는 지능(K-WAIS/WISC), 인지 기능, 무의식적 성격 구조, 정서 상태(MMPI-2, TCI, Rorschach, SCT, HTP/KFD 등)를 포괄하여 공인 임상심리 전문가가 심층 판독하는 종합 정신건강 정밀 진단 검사입니다. 학교, 법원, 병원 등 공식 제출이 가능한 종합 심리보고서가 발급됩니다.',
    highlights: ['홈페이지 자가진단: 간편 스크리닝 및 추천', '종합심리검사: 지능·성격·정서 종합 정밀 판독']
  }
];

interface FAQProps {
  initialCategory?: 'ALL' | 'PRIVACY' | 'RESERVATION' | 'PROCESS' | 'VISIT';
  showHeader?: boolean;
  className?: string;
  limit?: number;
}

export default function FAQ({
  initialCategory = 'ALL',
  showHeader = true,
  className = '',
  limit,
}: FAQProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PRIVACY' | 'RESERVATION' | 'PROCESS' | 'VISIT'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-privacy-1': true, // Open the most asked question by default
    'faq-reservation-1': true,
  });

  const categories = [
    { key: 'ALL', label: '전체 질문' },
    { key: 'PRIVACY', label: '비밀보장 & 기록' },
    { key: 'RESERVATION', label: '예약 & 일정' },
    { key: 'PROCESS', label: '상담 절차 & 비용' },
    { key: 'VISIT', label: '방문 & 비대면' },
  ] as const;

  // Toggle open accordion
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

  // Filtered FAQs based on category & search
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
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
  }, [selectedCategory, searchQuery, limit]);

  return (
    <section id="faq" className={`w-full ${className}`}>
      {showHeader && (
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage font-bold text-xs tracking-wider uppercase mb-3 border border-brand-sage/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <p className="text-sm sm:text-base text-brand-brown/70 max-w-2xl mx-auto leading-relaxed">
            상담 신청 전 내담자분들께서 가장 자주 궁금해하시는 질문들을 정리했습니다.<br className="hidden sm:inline" />
            궁금하신 사항을 검색하시거나 카테고리별로 편리하게 확인해 보세요.
          </p>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-brand-sage absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="궁금한 키워드를 입력해 보세요 (예: 기록, 비용, 바우처, 취소, 주차, 비대면)"
            className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-brand-green/30 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 shadow-xs text-sm text-brand-brown placeholder:text-brand-brown/40 transition-all outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-brand-brown/40 hover:text-brand-brown bg-brand-beige/50 hover:bg-brand-beige px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs & Quick Expand Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-2 border-b border-brand-green/20">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-brand-sage text-white shadow-xs'
                  : 'bg-white hover:bg-brand-green/20 text-brand-brown/70 hover:text-brand-brown border border-brand-green/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center text-xs text-brand-brown/60">
          <span>검색결과: <strong className="text-brand-brown">{filteredFAQs.length}</strong>건</span>
          <span className="text-brand-green/40">|</span>
          <button
            onClick={() => toggleAll(true)}
            className="hover:text-brand-sage transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            모두 펼치기
          </button>
          <span className="text-brand-green/40">|</span>
          <button
            onClick={() => toggleAll(false)}
            className="hover:text-brand-sage transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            모두 접기
          </button>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3.5">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-brand-green/20 space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-beige/50 flex items-center justify-center mx-auto text-brand-brown/40">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-brand-brown">검색 결과가 없습니다</h4>
            <p className="text-xs sm:text-sm text-brand-brown/60 max-w-md mx-auto">
              '{searchQuery}'에 해당하는 질문을 찾지 못했습니다. 다른 단어로 검색하시거나 연구소 유선 전화(052-254-0230)로 문의해 주시면 친절히 답변해 드리겠습니다.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="mt-2 px-4 py-2 bg-brand-sage text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-sage/90 transition-colors"
            >
              전체 질문 보기
            </button>
          </div>
        ) : (
          filteredFAQs.map((faq, idx) => {
            const isOpen = !!openIds[faq.id];
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                  isOpen 
                    ? 'border-brand-sage shadow-md ring-1 ring-brand-sage/20' 
                    : 'border-brand-green/25 hover:border-brand-sage/50'
                }`}
              >
                {/* Question Header Bar */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-5 sm:px-6 py-4.5 flex items-start justify-between gap-4 text-left transition-colors cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <span className="w-7 h-7 rounded-xl bg-brand-sage/10 text-brand-sage font-serif font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 border border-brand-sage/20 group-hover:bg-brand-sage group-hover:text-white transition-colors">
                      Q
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-md">
                          {faq.categoryLabel}
                        </span>
                        {faq.badge && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                            ★ {faq.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-brand-brown group-hover:text-brand-sage transition-colors leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-brand-sage text-white' : 'bg-brand-beige/50 text-brand-brown/60 group-hover:bg-brand-green/30'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-brand-green/15 bg-brand-beige/10">
                        <div className="flex items-start gap-3 sm:gap-4 pt-3">
                          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-serif font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                            A
                          </span>
                          <div className="space-y-3 flex-1 text-xs sm:text-sm text-brand-brown/85 leading-relaxed whitespace-pre-line">
                            {faq.answer}

                            {/* Core Highlights Pills */}
                            {faq.highlights && faq.highlights.length > 0 && (
                              <div className="pt-2 flex flex-wrap items-center gap-1.5">
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
              </motion.div>
            );
          })
        )}
      </div>

      {/* Still Have Questions? Direct Inquiry Callout Box */}
      <div className="mt-12 bg-gradient-to-br from-white via-brand-beige/30 to-brand-green/20 rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sage bg-white px-2.5 py-1 rounded-full border border-brand-green/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
            <span>친절한 1:1 상담 연결</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-brown">
            찾으시는 질문의 답변이 없거나 추가 상담이 필요하신가요?
          </h3>
          <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed max-w-xl">
            고민하지 마시고 편안한 마음으로 문의해 주세요. 전문 상담 소장님이 내담자의 상황에 맞춰 따뜻하고 친절하게 안내해 드립니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full sm:w-auto">
          <a
            href="tel:052-254-0230"
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-brand-beige/40 text-brand-brown font-bold text-xs sm:text-sm rounded-xl border border-brand-green/30 transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            <Phone className="w-4 h-4 text-brand-sage group-hover:scale-110 transition-transform" />
            <span>052-254-0230 (전화 문의)</span>
          </a>

          <Link
            to="/reservation"
            className="w-full sm:w-auto px-6 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>온라인 예약 신청</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
