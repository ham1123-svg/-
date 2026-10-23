import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronDown, ChevronRight, Clock, ShieldCheck, Award, 
  MapPin, Phone, Copy, Check, ExternalLink, Activity, 
  Smile, Sparkles, HeartHandshake, ArrowRight, User, Users,
  BookOpen, HelpCircle, ChevronUp, CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

// Quick Mood Options for Self-Check
interface QuickMood {
  id: string;
  emoji: string;
  name: string;
  tip: string;
}

const QUICK_MOODS: QuickMood[] = [
  { id: 'peace', emoji: '🌿', name: '평온함', tip: '마음의 평온은 가장 단단한 회복의 기초입니다. 이 소중하고 고요한 숨결을 온전히 간직하세요.' },
  { id: 'tired', emoji: '☕', name: '지침·번아웃', tip: '몸과 마음이 쉬어가라는 신호입니다. 오늘 하루는 나를 위한 작은 쉼표를 허락해 주세요.' },
  { id: 'anxious', emoji: '🌧️', name: '불안·초조', tip: '숨을 깊게 들이쉬고 천천히 내쉬어 보세요. 안전한 1:1 공간에서 언제든 당신의 마음에 귀 기울이겠습니다.' },
  { id: 'conflicted', emoji: '💬', name: '관계 갈등', tip: '마음의 거리감은 혼자 풀기 어렵습니다. 따뜻한 정서 대화와 중재로 회복의 길을 찾을 수 있습니다.' },
];

export default function Home() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedMood, setSelectedMood] = useState<QuickMood>(QUICK_MOODS[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const centerAddress = "울산광역시 울주군 삼남읍 도호1길 23 상가 408호";

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(centerAddress);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = centerAddress;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    } catch {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset to top when requested by Navbar
  useEffect(() => {
    const handleReset = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('reset-home-view', handleReset);
    return () => window.removeEventListener('reset-home-view', handleReset);
  }, []);

  return (
    <div className="w-full bg-white text-brand-brown selection:bg-brand-sage/20 selection:text-brand-brown">
      
      {/* =========================================================================
          PAGE 1: 심플하면서도 편안한 마음이 드는 첫 웰컴 화면 (Full Viewport Height)
          불필요한 복잡한 검색창/배지 없이, 온전한 여백과 따뜻한 쉼의 메시지 제공
          ========================================================================= */}
      <section 
        id="page-1-welcome" 
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-gradient-to-b from-[#F6F4EE] via-[#FAF9F5] to-white overflow-hidden"
      >
        {/* Calming gentle ambient background aura */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/12 rounded-full blur-3xl opacity-70" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-sage/8 rounded-full blur-3xl opacity-60" />
        </div>

        {/* Top Spacer for balanced centering */}
        <div className="w-full h-2" />

        {/* Core Peaceful Message Container */}
        <div className="relative z-10 max-w-3xl mx-auto my-auto flex flex-col items-center">
          
          {/* Official Emblem Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-transparent flex items-center justify-center mb-3">
              <img 
                src="/assets/aistudio/______-____a6aaa0a5.png" 
                alt="행복바람 공식 로고 심볼" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xs sm:text-sm font-serif tracking-widest text-brand-sage uppercase font-medium">
              Happiness Wind Counseling Center
            </div>
          </motion.div>

          {/* Gentle Calming Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-brand-brown leading-tight tracking-tight mb-6 break-keep"
          >
            지친 마음에 잠시 쉬어가는 <br />
            <span className="text-brand-sage font-serif font-normal">따뜻한 행복의 바람</span>이 붑니다
          </motion.h1>

          {/* Reassuring Prose */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-brand-brown/75 font-serif leading-relaxed mb-8 sm:mb-10 max-w-2xl break-keep"
          >
            누구에게도 털어놓지 못했던 이야기, 마음이 버거울 때 편안하게 기대어 쉴 수 있는 안식처입니다. 
            교육학 박사 대표 원장이 1:1로 직접 전담하여 철저한 비밀보장 속에 당신의 회복을 함께합니다.
          </motion.p>

          {/* Peaceful Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8"
          >
            <Link 
              to="/reservation" 
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-brand-sage text-white font-bold hover:bg-brand-sage/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <CalendarDays className="w-4 h-4" />
              <span>실시간 상담 예약하기</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection('page-2-programs')}
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl bg-white/90 hover:bg-white text-brand-brown font-bold border border-brand-green/40 transition-all shadow-2xs hover:shadow-sm flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>상담 프로그램 둘러보기</span>
            </button>
          </motion.div>

          {/* Quiet Trust Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-brand-brown/65 font-serif"
          >
            <span>교육학 박사 박미경 대표 원장 직접 전담</span>
            <span className="text-brand-brown/30">·</span>
            <span>100% 비의료기록 비밀보장</span>
            <span className="text-brand-brown/30">·</span>
            <span>평일 저녁 19:00 야간 &amp; 토요 운영</span>
          </motion.div>

        </div>

        {/* Gentle Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 pt-4"
        >
          <button
            type="button"
            onClick={() => scrollToSection('page-2-programs')}
            className="flex flex-col items-center gap-1.5 text-xs text-brand-brown/60 hover:text-brand-sage transition-colors cursor-pointer group"
            aria-label="다음 페이지 안내로 스크롤 이동"
          >
            <span className="font-serif">아래로 스크롤하여 둘러보기</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-brand-sage group-hover:translate-y-0.5 transition-transform" />
            </motion.div>
          </button>
        </motion.div>
      </section>


      {/* =========================================================================
          PAGE 2: 상담 프로그램 및 투명한 상담 요금 안내 (약 1페이지 분량)
          정찰제 상담료, 4대 맞춤 프로그램 카드, 울산페이/카드 결제 안내
          ========================================================================= */}
      <section 
        id="page-2-programs" 
        className="py-16 sm:py-24 bg-white border-t border-brand-green/20 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3 py-1 bg-brand-sage/10 rounded-full inline-block mb-3 border border-brand-sage/20">
              01 · Counseling Programs &amp; Fees
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-brand-brown mb-3">
              나에게 꼭 맞는 <span className="text-brand-sage">1:1 맞춤 심리상담</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
              모든 회기는 박미경 대표 원장이 1:1로 직접 진행하며, 사전 공지된 투명한 정찰제로 정직하게 운영됩니다.
            </p>
          </div>

          {/* 4 Core Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* 1. 청소년 및 성인 심층상담 */}
            <div className="p-6 rounded-3xl bg-brand-beige/20 border border-brand-green/25 hover:border-brand-sage/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center mb-4">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-brand-sage">1:1 개인 심층</span>
                  <span className="text-brand-brown/60 font-mono font-medium">1회 50분</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">
                  청소년 및 성인 상담
                </h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 font-serif leading-relaxed mb-6">
                  우울, 불안, 직무 번아웃, 만성 스트레스, 자존감 저하 및 학업·진로 갈등을 위한 맞춤형 인지행동 치유
                </p>
              </div>

              <div className="pt-4 border-t border-brand-green/20 flex items-baseline justify-between">
                <span className="text-xs text-brand-brown/60 font-serif">상담료 (1회)</span>
                <span className="text-xl font-bold font-mono text-brand-sage">100,000원</span>
              </div>
            </div>

            {/* 2. 부부 및 가족 관계 개선 */}
            <div className="p-6 rounded-3xl bg-brand-beige/20 border border-brand-green/25 hover:border-brand-sage/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-rose-700">2인 동반 심층</span>
                  <span className="text-brand-brown/60 font-mono font-medium">1회 80분</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">
                  부부 및 가족 상담
                </h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 font-serif leading-relaxed mb-6">
                  반복되는 갈등, 의사소통 단절, 성격 차이, 신뢰 회복을 정서중심치료(EFT)를 통해 안전하게 중재
                </p>
              </div>

              <div className="pt-4 border-t border-brand-green/20 flex items-baseline justify-between">
                <span className="text-xs text-brand-brown/60 font-serif">상담료 (1회)</span>
                <span className="text-xl font-bold font-mono text-brand-sage">180,000원</span>
              </div>
            </div>

            {/* 3. 아동 놀이치료 및 양육코칭 */}
            <div className="p-6 rounded-3xl bg-brand-beige/20 border border-brand-green/25 hover:border-brand-sage/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-amber-800">양육 코칭 포함</span>
                  <span className="text-brand-brown/60 font-mono font-medium">총 50분</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">
                  아동 놀이 및 코칭
                </h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 font-serif leading-relaxed mb-6">
                  아동 놀이 매개 심리상담(40분)과 함께 매 회기 부모 1:1 맞춤 훈육 가이드 브리핑(10분)을 병행
                </p>
              </div>

              <div className="pt-4 border-t border-brand-green/20 flex items-baseline justify-between">
                <span className="text-xs text-brand-brown/60 font-serif">상담료 (1회)</span>
                <span className="text-xl font-bold font-mono text-brand-sage">100,000원</span>
              </div>
            </div>

            {/* 4. 공인 종합심리검사 */}
            <div className="p-6 rounded-3xl bg-brand-beige/20 border border-brand-green/25 hover:border-brand-sage/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-blue-700">전문 객관 평가</span>
                  <span className="text-brand-brown/60 font-mono font-medium">검사+해석</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">
                  종합 심리검사
                </h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 font-serif leading-relaxed mb-6">
                  표준화된 검사 도구를 통해 인지적·정서적 상태를 객관적으로 평가하고 원장 직접 심층 해석상담 진행
                </p>
              </div>

              <div className="pt-4 border-t border-brand-green/20 flex items-baseline justify-between">
                <span className="text-xs text-brand-brown/60 font-serif">상담료</span>
                <span className="text-sm font-bold text-brand-brown/80 font-serif">도구 패키지별 맞춤</span>
              </div>
            </div>

          </div>

          {/* Fee Policy & Navigation Strip */}
          <div className="p-5 sm:p-6 rounded-2xl bg-brand-beige/35 border border-brand-green/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-serif">
            <div className="flex items-center gap-3 text-brand-brown/80">
              <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0" />
              <span>
                <strong>100% 정찰제 및 비의료기관 운영</strong> · 국민건강보험공단 진료코드 미등록으로 기록이 전혀 남지 않습니다. (울산페이·신용카드 결제 가능)
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                to="/programs" 
                className="px-4 py-2.5 rounded-xl bg-white border border-brand-green/30 hover:bg-brand-green/15 text-brand-brown font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>프로그램 세부 안내</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-sage" />
              </Link>
              <Link 
                to="/reservation" 
                className="px-4 py-2.5 rounded-xl bg-brand-sage text-white font-bold hover:bg-brand-sage/90 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>실시간 예약 일정표</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          PAGE 3: 대표 원장 프로필 & 힐링 공간 안내 (약 1페이지 분량)
          박미경 소장 30,000시간 임상 경력, 1:1 직접 전담 철학, 3대 정갈한 공간
          ========================================================================= */}
      <section 
        id="page-3-director" 
        className="py-16 sm:py-24 bg-brand-beige/25 border-t border-brand-green/20 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3 py-1 bg-brand-sage/10 rounded-full inline-block mb-3 border border-brand-sage/20">
              02 · Executive Director &amp; Sanctuary
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-brand-brown mb-3">
              16년 30,000시간의 임상 경험, <span className="text-brand-sage">대표 원장 1:1 전담</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
              보조 상담사 없이 대표 원장이 첫 면담부터 종결까지 직접 책임지고 깊이 있는 치유를 이끕니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            
            {/* Left: Director Profile Highlight Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-brand-green/30 shadow-md">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-20 h-26 sm:w-24 sm:h-30 rounded-2xl overflow-hidden bg-brand-beige/40 shrink-0 border border-brand-green/20 shadow-xs">
                  <img 
                    src="/images/counselor_park.jpg" 
                    alt="박미경 대표 원장" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand-sage uppercase tracking-wider block mb-0.5">
                    Executive Profile
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                    박미경 소장
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-brand-sage font-sans mt-0.5">
                    교육학 박사 · 1급 수련감독자
                  </p>
                  <p className="text-xs text-brand-brown/65 font-serif mt-1">
                    행복바람 심리상담연구소 대표 원장
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-serif text-brand-brown/80 leading-relaxed mb-6">
                <p className="flex items-start gap-2">
                  <span className="text-brand-sage font-bold">•</span>
                  <span><strong>16년간 30,000시간 이상</strong>의 풍부한 심층 임상 면담 진행</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand-sage font-bold">•</span>
                  <span>울산광역시교육청, 노동인권센터, 재난심리회복센터 등 공공 협력 전문</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand-sage font-bold">•</span>
                  <span><strong>1일 최대 5회기 한정 운영</strong> (상담사의 온전한 집중력과 에너지 유지)</span>
                </p>
              </div>

              <div className="pt-4 border-t border-brand-green/15 flex items-center justify-between">
                <Link 
                  to="/counselors" 
                  className="text-xs font-bold text-brand-sage hover:underline flex items-center gap-1"
                >
                  <span>소장 약력 및 자격 상세</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link 
                  to="/about" 
                  className="text-xs font-bold text-brand-brown/70 hover:text-brand-brown flex items-center gap-1"
                >
                  <span>인사말 &amp; 설립 비전</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: 3 Calm Interior Spaces */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="rounded-2xl overflow-hidden border border-brand-green/20 bg-white shadow-2xs group flex flex-col">
                <div className="h-40 overflow-hidden bg-brand-beige/20">
                  <img 
                    src="/images/welcome_tea.jpg" 
                    alt="정갈한 웰컴 티 & 다과" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-brown font-serif mb-1">
                      웰컴 티 &amp; 수제 다과
                    </h4>
                    <p className="text-[11px] text-brand-brown/65 font-serif leading-relaxed">
                      상담 전 긴장을 부드럽게 완화해주는 따뜻한 차와 정갈한 다과
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-brand-green/20 bg-white shadow-2xs group flex flex-col sm:translate-y-2">
                <div className="h-40 overflow-hidden bg-brand-beige/20">
                  <img 
                    src="/images/counseling_room.jpg" 
                    alt="1:1 독립 심리상담실" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-brown font-serif mb-1">
                      1:1 개인 독립상담실
                    </h4>
                    <p className="text-[11px] text-brand-brown/65 font-serif leading-relaxed">
                      완벽한 방음과 100% 비밀보장이 지켜지는 조용하고 아늑한 공간
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-brand-green/20 bg-white shadow-2xs group flex flex-col">
                <div className="h-40 overflow-hidden bg-brand-beige/20">
                  <img 
                    src="/images/healing_space.jpg" 
                    alt="사계절 힐링 쉼터" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-brown font-serif mb-1">
                      힐링 쉼터 &amp; 라운지
                    </h4>
                    <p className="text-[11px] text-brand-brown/65 font-serif leading-relaxed">
                      부드러운 자연광과 싱그러운 반려식물이 머무는 평온한 휴식처
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          PAGE 4: 무료 자가진단 & 상담 진행 절차 (약 1페이지 분량)
          오늘의 마음 날씨 체크, 4대 자가진단 링크, 4단계 진행 절차, 핵심 FAQ
          ========================================================================= */}
      <section 
        id="page-4-selfcheck-faq" 
        className="py-16 sm:py-24 bg-white border-t border-brand-green/20 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3 py-1 bg-brand-sage/10 rounded-full inline-block mb-3 border border-brand-sage/20">
              03 · Self-Diagnosis &amp; Counseling Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-brand-brown mb-3">
              지금 내 마음 상태를 <span className="text-brand-sage">스스로 점검</span>해 보세요
            </h2>
            <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
              3분 무료 자가진단과 함께 안심하고 방문하실 수 있는 4단계 상담 절차를 안내해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Quick Mood Poll & Self-Diagnosis Cards (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Daily Mood Check-In Widget */}
              <div className="p-5 sm:p-6 rounded-3xl bg-brand-beige/25 border border-brand-green/25 shadow-2xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-brand-sage" />
                    <h3 className="text-sm sm:text-base font-bold text-brand-brown font-serif">
                      오늘 당신의 마음 날씨는 어떤가요? (원클릭 체크)
                    </h3>
                  </div>
                  <span className="text-[11px] text-brand-brown/50 font-serif">100% 익명</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
                  {QUICK_MOODS.map((mood) => {
                    const isSelected = selectedMood.id === mood.id;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className={cn(
                          "p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5",
                          isSelected 
                            ? "bg-white border-brand-sage ring-2 ring-brand-sage/30 shadow-sm"
                            : "bg-white/70 hover:bg-white border-brand-green/20"
                        )}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-xs font-bold text-brand-brown font-serif">{mood.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Director's One-line prescription tip */}
                <div className="p-3.5 rounded-xl bg-white border border-brand-green/20 text-xs text-brand-brown/85 font-serif leading-relaxed flex items-start gap-2 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-brand-sage font-bold mr-1">원장님의 한 줄 처방:</strong>
                    <span>{selectedMood.tip}</span>
                  </div>
                </div>
              </div>

              {/* 4 Self-Diagnosis Test Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: '우울 & 번아웃 척도', desc: '무기력 및 정서적 고갈 상태 점검', items: '7문항 (3분 소요)', type: 'depression' },
                  { title: '불안 & 스트레스 척도', desc: '과긴장, 가슴 답답함, 초조함 점검', items: '7문항 (3분 소요)', type: 'anxiety' },
                  { title: '부부·관계 갈등 척도', desc: '소통 단절 및 관계 피로도 측정', items: '7문항 (3분 소요)', type: 'couple' },
                  { title: '종합 마음 건강 진단', desc: '우울·불안·스트레스 종합 진단', items: '9문항 (4분 소요)', type: 'general' },
                ].map((test) => (
                  <div key={test.type} className="p-4 rounded-2xl bg-white border border-brand-green/20 shadow-2xs hover:border-brand-sage/40 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-green/20 text-brand-sage font-mono">
                        {test.items}
                      </span>
                      <h4 className="text-sm font-bold text-brand-brown font-serif mt-2 mb-1">
                        {test.title}
                      </h4>
                      <p className="text-xs text-brand-brown/65 font-serif leading-relaxed mb-3">
                        {test.desc}
                      </p>
                    </div>
                    <Link 
                      to={`/self-diagnosis?type=${test.type}`}
                      className="w-full py-2 rounded-xl bg-brand-sage/10 hover:bg-brand-sage hover:text-white text-brand-sage text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>검사 시작하기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>

            </div>

            {/* Right: 4-Step Process & Top 3 FAQ (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 4-Step Journey */}
              <div className="p-5 rounded-3xl bg-brand-beige/25 border border-brand-green/25 space-y-3">
                <div className="text-xs font-bold text-brand-sage uppercase tracking-wider mb-1">
                  4-Step Counseling Journey
                </div>

                {[
                  { step: '01', title: '예약 신청 & 일정 확정', desc: '온라인 달력 또는 전화로 희망 일시 선택 후 확정 안내' },
                  { step: '02', title: '1:1 초기 면담 (Intake)', desc: '주 호소 문제 탐색, 심리적 어려움 경청 및 맞춤 목표 수립' },
                  { step: '03', title: '심층 치유 상담 진행', desc: '개인 맞춤형 인지행동·정서중심 기법으로 내면 치유' },
                  { step: '04', title: '변화 점검 및 종결', desc: '심리적 안정감 회복 확인 및 재발 방지 사후 가이드' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-brand-green/15 shadow-2xs">
                    <span className="w-6 h-6 rounded-lg bg-brand-sage text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-brand-brown font-serif">{item.title}</h5>
                      <p className="text-[11px] text-brand-brown/65 font-serif mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Core FAQ Accordion */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-brand-brown/70 mb-1">
                  자주 묻는 핵심 질문 (FAQ)
                </div>

                {[
                  {
                    q: '상담 기록이나 병원 진료 기록이 남나요?',
                    a: '비의료 심리상담 전문기관으로 국민건강보험공단 등 외부 기관에 의료기록이나 진료코드가 전혀 남지 않으며 100% 비밀이 보장됩니다.'
                  },
                  {
                    q: '상담은 몇 회기 정도 진행되나요?',
                    a: '1회 초기 면담 후 최적의 회기를 상의하여 결정하며, 가벼운 고민은 3~5회기, 심층 정서 치유나 부부 갈등은 8~12회기 내외로 진행됩니다.'
                  },
                  {
                    q: '예약 변경이나 취소는 어떻게 하나요?',
                    a: '원활한 운영과 대기 내담자를 위해 예약일 24시간 전까지 연락 주시면 위약금 없이 편안하게 일정 조정이 가능합니다.'
                  }
                ].map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl border border-brand-green/20 bg-white overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-serif font-bold text-brand-brown hover:bg-brand-beige/20 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-brand-sage font-bold">Q.</span>
                          <span>{faq.q}</span>
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-brand-sage shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-brand-brown/40 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-brand-brown/75 font-serif leading-relaxed border-t border-brand-green/10 bg-brand-beige/10">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          PAGE 5: 오시는 길 & 상담 예약 마무리 배너 (약 1페이지 분량)
          울산 KTX 역세권 위치, 운영시간표, 주소 복사, 실시간 예약 & 직통 전화 문의
          ========================================================================= */}
      <section 
        id="page-5-location-booking" 
        className="py-16 sm:py-24 bg-brand-beige/20 border-t border-brand-green/20 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3 py-1 bg-brand-sage/10 rounded-full inline-block mb-3 border border-brand-sage/20">
              04 · Location &amp; Appointment
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-brand-brown mb-3">
              상담소 오시는 길 및 <span className="text-brand-sage">실시간 예약</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
              울산 KTX/SRT 역세권 인근, 언제든 편안한 마음으로 문을 두드려주세요.
            </p>
          </div>

          {/* Location & Hours Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
            
            {/* Left: Address & Directions */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-brand-green/30 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-green/15">
                <span className="text-xs font-bold text-brand-sage uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>상담소 위치 &amp; 교통편</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1.5 rounded-xl bg-brand-beige/50 border border-brand-green/30 hover:bg-brand-green/15 text-xs font-bold text-brand-brown flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700">복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-brand-sage" />
                      <span>주소 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-brand-brown mb-1">
                  {centerAddress}
                </h4>
                <p className="text-xs text-brand-brown/65 font-serif">
                  울산 KTX/SRT 역세권 삼남읍 도호마을 인근 상가 4층 408호 (엘리베이터 완비)
                </p>
              </div>

              <div className="space-y-2 text-xs font-serif text-brand-brown/80 pt-1">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-brand-brown w-16 shrink-0">• 자가용:</span>
                  <span>'도호1길 23' 검색, 상가 전용 지상/지하 주차장 무료 이용 가능</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-brand-brown w-16 shrink-0">• KTX/SRT:</span>
                  <span>울산역에서 차량 5분 / 대중교통 시내버스 삼남읍 행정복지센터 인근</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-brand-brown w-16 shrink-0">• 직통전화:</span>
                  <a href="tel:052-254-0230" className="text-brand-sage font-bold hover:underline">
                    052-254-0230 (대표 원장 직통)
                  </a>
                </p>
              </div>

              {/* External Maps Links */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a 
                  href={`https://map.naver.com/p/search/${encodeURIComponent("행복바람심리상담연구소")}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <span>네이버 지도 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a 
                  href={`https://map.kakao.com/link/search/${encodeURIComponent("행복바람심리상담연구소")}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#FEE500] text-[#191919] text-xs font-bold hover:bg-[#FEE500]/90 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <span>카카오맵 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right: Center Operating Hours Table */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-brand-green/30 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-green/15">
                <span className="text-xs font-bold text-brand-brown/80 font-serif flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-sage" />
                  <span>주간 상담 운영시간표 (사전 예약제)</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-bold">
                  1일 최대 5회기
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-serif">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <strong className="text-emerald-950 font-bold block text-sm">평일 (월요일 ~ 금요일)</strong>
                    <span className="text-[11px] text-emerald-800">오전 09:00 ~ 저녁 20:00 (5회기 집중 운영)</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    야간 19:00 운영
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
                  <div>
                    <strong className="text-sky-950 font-bold block text-sm">토요일 (주말 운영)</strong>
                    <span className="text-[11px] text-sky-800">오전 09:00 ~ 오후 16:30 (4회기 운영)</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-sky-900 bg-sky-100 px-2.5 py-1 rounded-lg">
                    주말 상담 가능
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                  <div>
                    <strong className="text-rose-950 font-bold block text-sm">일요일 및 법정 공휴일</strong>
                    <span className="text-[11px] text-rose-800">연구 및 슈퍼비전을 위한 정기 휴무</span>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                    휴무
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Reassuring Closing Action Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-sage/20 via-brand-beige/50 to-brand-green/25 border border-brand-green/30 text-center shadow-lg">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white text-brand-sage text-xs font-semibold rounded-full mb-4 shadow-2xs">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>온전한 나를 되찾는 따뜻한 첫걸음</span>
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
              혼자 짊어지기 버거운 마음, <br className="sm:hidden" />
              언제든 편안하게 문을 두드려주세요.
            </h3>

            <p className="text-xs sm:text-base text-brand-brown/75 font-serif max-w-xl mx-auto mb-8 leading-relaxed">
              사소해 보이는 일상의 고민이라도 온 마음을 다해 경청합니다. <br className="hidden sm:inline" />
              온라인 일정표에서 원하시는 날짜와 시간을 선택하시면 친절하게 확정 안내해 드립니다.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link 
                to="/reservation" 
                className="px-8 py-4 rounded-2xl bg-brand-sage text-white font-bold hover:bg-brand-sage/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                <span>실시간 예약 일정표 확인하기</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <a 
                href="tel:052-254-0230"
                className="px-7 py-4 rounded-2xl bg-white hover:bg-brand-green/15 text-brand-brown font-bold border border-brand-green/40 transition-all shadow-2xs flex items-center gap-2 text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 text-brand-sage" />
                <span>052-254-0230 전화 상담</span>
              </a>
            </div>

            <div className="mt-8 pt-5 border-t border-brand-green/20 flex flex-wrap items-center justify-center gap-y-1 gap-x-5 text-xs font-serif text-brand-brown/65">
              <span>• 100% 비의료기록 비밀보장</span>
              <span>• 대표 원장 1:1 직접 전담</span>
              <span>• 상가 내 무료 주차 완비</span>
              <span>• 울산 KTX/SRT 역세권</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
