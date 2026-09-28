import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  ShieldCheck, 
  Sparkles, 
  VolumeX, 
  Coffee, 
  Heart, 
  DoorClosed, 
  Calendar, 
  Clock, 
  Eye, 
  MapPin, 
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

export interface OfficeSpace {
  id: string;
  name: string;
  koreanCategory: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge: string;
  highlights: string[];
  atmosphere: string;
}

const OFFICE_SPACES: OfficeSpace[] = [
  {
    id: 'tea-lounge',
    name: '웰컴 라운지 & 유기농 티 바',
    koreanCategory: '맞이 공간',
    subtitle: 'Welcome Lounge & Herbal Tea Bar',
    description: '상담소 문을 여는 순간, 긴장된 마음을 편안하게 녹여드리는 따뜻한 유기농 허브 티와 정갈한 수제 다과가 준비된 웰컴 공간입니다. 잔잔한 클래식 음악과 은은한 천연 아로마 향이 심신의 안정을 돕습니다.',
    imageUrl: '/images/welcome_tea.jpg',
    badge: '100% 사전예약 프라이빗 맞이',
    highlights: [
      '유기농 카모마일·루이보스 등 힐링 허브티 상시 제공',
      '도착 즉시 편안하게 숨 고를 수 있는 프라이빗 대기 체어',
      '다른 내담자와 동선이 겹치지 않는 독립 배려 동선'
    ],
    atmosphere: '따뜻한 온기와 은은한 허브향이 감도는 안식처',
  },
  {
    id: 'counseling-room-1',
    name: '1:1 개인 심층 심리상담실',
    koreanCategory: '개인 상담',
    subtitle: 'Private 1:1 In-depth Counseling Suite',
    description: '완벽한 2중 특수 차음 방음 도어와 부드러운 간접 조명, 신체 굴곡을 편안히 받쳐주는 프리미엄 1인 안락의자가 마련되어 있습니다. 그 누구의 시선도 닿지 않는 안전한 울타리 속에서 내면의 상처를 온전히 털어놓으실 수 있습니다.',
    imageUrl: '/images/counseling_room.jpg',
    badge: '철저한 비밀보장 & 2중 차음 방음',
    highlights: [
      '대화 내용 외부 유출을 원천 차단하는 전문 방음 시공',
      '장시간 편안하게 머무를 수 있는 인체공학 힐링 소파',
      '눈부심 없는 조도 조절 간접 조명과 공기살균 시스템'
    ],
    atmosphere: '세상에서 가장 안전하게 비밀이 보호되는 공간',
  },
  {
    id: 'healing-space-family',
    name: '부부·가족 및 그룹 힐링 룸',
    koreanCategory: '부부·가족',
    subtitle: 'Couples & Family Healing Space',
    description: '부부 간의 깊은 대화, 가족 간의 해묵은 갈등을 솔직하게 풀어낼 수 있도록 넉넉하고 정갈하게 조성된 공간입니다. 서로의 온기를 마주하며 이마고(Imago) 대화와 정서중심치료(EFT)를 안전하게 경험하실 수 있습니다.',
    imageUrl: '/images/healing_space.jpg',
    badge: '정서적 교감 & 따뜻한 자연채광',
    highlights: [
      '단절되었던 대화를 다시 잇는 마주보기형 안락 좌석 배치',
      '통창을 통해 들어오는 따스한 자연광과 원목 가구의 아늑함',
      '소수정예(4~6인) 감정조절 및 마음챙김 워크숍 운영'
    ],
    atmosphere: '얼어붙었던 관계가 부드럽게 녹아내리는 평화로운 공간',
  },
  {
    id: 'play-art-therapy',
    name: '아동·청소년 놀이 및 표현치료실',
    koreanCategory: '아동·청소년',
    subtitle: 'Child Play & Expressive Art Therapy Room',
    description: '말로 감정을 표현하기 어려운 아이들이 모래놀이, 인형, 점토, 미술 매체를 통해 무의식 속 불안과 억압된 감정을 자연스럽게 표출하는 공간입니다. 아이의 전두엽 성장과 정서 안정에 최적화된 친환경 자재로 시공되었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&q=80&w=1200&h=800',
    badge: '친환경 무독성 & 모래·미술치료',
    highlights: [
      '스위스 정통 모래놀이치료(Sandplay) 피규어 세트 완비',
      '아이들의 신체 안전을 고려한 둥근 모서리 및 친환경 바닥재',
      '부모 코칭 관찰 및 피드백을 위한 안심 상담 환경'
    ],
    atmosphere: '아이가 있는 그대로의 자아를 마음껏 펼치는 창의적 공간',
  },
  {
    id: 'psychological-testing',
    name: '종합 심리평가 및 집중 검사실',
    koreanCategory: '심리검사',
    subtitle: 'Psychological Assessment & Diagnostic Suite',
    description: '외부 소음과 시각적 산만함이 일절 차단된 고요한 독립 룸에서 MMPI-2 다면적인성검사, TCI 기질검사, 웩슬러 지능검사를 편안한 집중 속에 수행합니다. 정밀한 평가를 통해 자기 이해와 치유의 명확한 로드맵을 찾습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200&h=800',
    badge: '외부 소음 차단 & 1:1 집중 환경',
    highlights: [
      '잡음 없는 독립 부스 환경으로 검사 신뢰도 극대화',
      '한국상담학회 1급 수련감독자의 1:1 정밀 해석 상담 연계',
      '국민건강보험 전산 기록이 남지 않는 100% 비의료 안심 검사'
    ],
    atmosphere: '나 자신을 온전히 마주하는 조용하고 명료한 공간',
  },
  {
    id: 'private-waiting',
    name: '1인 독립 프라이빗 대기석 & 힐링 서가',
    koreanCategory: '편의 시설',
    subtitle: 'Private Waiting Nook & Curated Library',
    description: '다른 내담자와 얼굴을 마주칠 염려가 없도록 설계된 프라이빗 칸막이 대기석과 박미경 소장이 직접 엄선한 마음 치유 도서가 비치된 미니 서가입니다. 상담 전후 나만의 시간을 차분히 정리하실 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1507842229451-2977d04e578c?auto=format&fit=crop&q=80&w=1200&h=800',
    badge: '1인 독립 좌석 & 엄선 심리서가',
    highlights: [
      '내담자 간 시선이 완벽히 차단된 1인 안심 휴식 공간',
      '상담 대기 시간 동안 읽기 좋은 힐링 에세이 및 심리학 도서',
      '무선 충전 거치대 및 개인 소지품 보관 안심 트레이'
    ],
    atmosphere: '나만의 서재에 온 듯 조용하고 고즈넉한 휴식처',
  }
];

export default function VirtualOfficeTour({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<OfficeSpace | null>(null);
  const timerRef = useRef<number | null>(null);

  const currentSpace = OFFICE_SPACES[currentIndex];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? OFFICE_SPACES.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === OFFICE_SPACES.length - 1 ? 0 : prev + 1));
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying || fullscreenImage !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, fullscreenImage, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage) {
        if (e.key === 'Escape') setFullscreenImage(null);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage, handlePrev, handleNext]);

  return (
    <section 
      aria-label="행복바람 심리상담연구소 버추얼 오피스 투어"
      className={cn(
        "py-20 sm:py-24 relative overflow-hidden border-t border-brand-green/20",
        isHighContrast 
          ? "bg-neutral-950 text-white" 
          : "bg-gradient-to-b from-white via-brand-beige/20 to-white",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Calming Invitation */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-serif font-bold mb-3 border border-brand-sage/20">
            <DoorClosed className="w-3.5 h-3.5" />
            <span>Virtual Office Tour</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span>첫 방문이 편안해지는 안심 공간</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            마음이 쉬어가는 곳, <br className="hidden sm:inline" />
            <span className="text-brand-sage">행복바람의 치유 공간 둘러보기</span>
          </h2>

          <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
            심리상담소를 처음 찾으시는 분들의 막연한 불안과 긴장감을 덜어드리고자,<br className="hidden sm:inline" />
            사생활이 철저히 보호되는 프라이빗 상담실과 편안한 웰컴 공간을 미리 공개합니다.
          </p>
        </div>

        {/* 4 Trust & Comfort Pillars Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
          <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-brand-green/30 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <VolumeX className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">전문 차음 방음 시공</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">상담 대화 외부 유출 차단</div>
            </div>
          </div>

          <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-brand-green/30 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-brand-sage/10 text-brand-sage flex items-center justify-center shrink-0 border border-brand-sage/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">독립 마주침 방지 동선</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">내담자 간 시선 완전 분리</div>
            </div>
          </div>

          <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-brand-green/30 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">유기농 웰컴 티 서비스</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">도착 즉시 긴장 이완 다과</div>
            </div>
          </div>

          <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-brand-green/30 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">비의료 100% 비밀보장</div>
              <div className="text-[11px] text-brand-brown/65 font-serif">건강보험 전산 기록 미등재</div>
            </div>
          </div>
        </div>

        {/* Main Carousel Showcase Container */}
        <div className="bg-white rounded-3xl border border-brand-green/30 shadow-xl overflow-hidden p-4 sm:p-8 lg:p-10 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Interactive Image Viewer (7 cols) */}
            <div className="lg:col-span-7 relative group">
              
              {/* Image Frame with Aspect Ratio */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-brand-beige/40 border border-brand-green/30 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSpace.id}
                    src={currentSpace.imageUrl}
                    alt={currentSpace.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-serif font-semibold border border-white/20 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{currentSpace.badge}</span>
                  </span>
                </div>

                {/* Zoom / Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(currentSpace)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 transition-all cursor-pointer border border-white/20 shadow-md group-hover:scale-105"
                  title="고화질 사진 크게 보기"
                  aria-label="고화질 사진 크게 보기"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Bottom Overlay Info Tag */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-serif text-white pointer-events-none">
                  <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15">
                    {currentSpace.atmosphere}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md font-mono text-[11px] border border-white/15">
                    {currentIndex + 1} / {OFFICE_SPACES.length}
                  </span>
                </div>

                {/* Carousel Arrow Overlays (Desktop & Mobile accessible) */}
                <div className="absolute inset-y-0 left-2 flex items-center z-10">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2.5 rounded-full bg-white/80 hover:bg-white text-brand-brown hover:text-brand-sage shadow-md transition-all cursor-pointer border border-brand-green/30"
                    aria-label="이전 공간 사진 보기"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute inset-y-0 right-2 flex items-center z-10">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2.5 rounded-full bg-white/80 hover:bg-white text-brand-brown hover:text-brand-sage shadow-md transition-all cursor-pointer border border-brand-green/30"
                    aria-label="다음 공간 사진 보기"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Autoplay & Controls Bar below image */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="text-xs font-serif text-brand-brown/70 hover:text-brand-brown flex items-center gap-1.5 p-1 rounded-md transition-colors cursor-pointer"
                    title={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-brand-sage" />
                        <span className="text-[11px]">슬라이드 일시정지</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-brand-sage" />
                        <span className="text-[11px]">슬라이드 재생</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Indicator Dots */}
                <div className="flex items-center gap-1.5">
                  {OFFICE_SPACES.map((space, idx) => (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        currentIndex === idx
                          ? "w-6 bg-brand-sage"
                          : "w-2 bg-brand-green/40 hover:bg-brand-sage/60"
                      )}
                      aria-label={`${space.name} 사진으로 이동`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Detailed Space Narrative & Highlights (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-serif text-brand-sage font-bold uppercase tracking-wider mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-brand-sage/10 border border-brand-sage/25">
                    {currentSpace.koreanCategory}
                  </span>
                  <span className="text-brand-brown/40">·</span>
                  <span className="text-[11px] text-brand-brown/65">{currentSpace.subtitle}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown leading-tight mb-3">
                  {currentSpace.name}
                </h3>

                <p className="text-xs sm:text-sm text-brand-brown/80 font-serif leading-relaxed">
                  {currentSpace.description}
                </p>
              </div>

              {/* Space Highlights Checklist */}
              <div className="p-4 sm:p-5 rounded-2xl bg-brand-beige/35 border border-brand-green/25 space-y-2.5">
                <div className="text-xs font-serif font-bold text-brand-brown flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
                  <span>이 공간의 특별한 안심 포인트</span>
                </div>

                <div className="space-y-2">
                  {currentSpace.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-serif text-brand-brown/85">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Thumbnail Selector Strip */}
              <div>
                <div className="text-[11px] font-serif font-bold text-brand-brown/60 mb-2">
                  다른 공간 바로 둘러보기 (클릭하여 전환):
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {OFFICE_SPACES.map((space, idx) => (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group",
                        currentIndex === idx
                          ? "border-brand-sage ring-2 ring-brand-sage/30 scale-105"
                          : "border-transparent opacity-65 hover:opacity-100 hover:border-brand-green/40"
                      )}
                      title={space.name}
                    >
                      <img 
                        src={space.imageUrl} 
                        alt={space.name}
                        className="w-full h-full object-cover" 
                      />
                      {currentIndex === idx && (
                        <div className="absolute inset-0 bg-brand-sage/15" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Next Step Action CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <Link
                  to="/reservation"
                  className="flex-1 py-3 px-5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-serif font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Calendar className="w-4 h-4" />
                  <span>이 공간에서 1:1 상담 예약하기</span>
                </Link>

                <Link
                  to="/about"
                  className="py-3 px-4 rounded-xl border border-brand-green/30 hover:bg-brand-beige/50 text-brand-brown text-xs font-serif font-bold transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>연구소 소개 더보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-lightbox-title"
          >
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullscreenImage(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-white/20"
            >
              {/* Lightbox Header Bar */}
              <div className="p-4 sm:p-5 bg-neutral-950/80 border-b border-white/10 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-brand-sage/20 text-brand-green text-xs font-serif font-bold">
                    {fullscreenImage.koreanCategory}
                  </span>
                  <h3 id="tour-lightbox-title" className="text-base sm:text-lg font-serif font-bold">
                    {fullscreenImage.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setFullscreenImage(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="닫기"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Main Image */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh]">
                <img
                  src={fullscreenImage.imageUrl}
                  alt={fullscreenImage.name}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Left/Right Arrows inside lightbox */}
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = currentIndex === 0 ? OFFICE_SPACES.length - 1 : currentIndex - 1;
                    setCurrentIndex(prevIdx);
                    setFullscreenImage(OFFICE_SPACES[prevIdx]);
                  }}
                  className="absolute left-3 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                  aria-label="이전 사진"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = currentIndex === OFFICE_SPACES.length - 1 ? 0 : currentIndex + 1;
                    setCurrentIndex(nextIdx);
                    setFullscreenImage(OFFICE_SPACES[nextIdx]);
                  }}
                  className="absolute right-3 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                  aria-label="다음 사진"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Footer Info & Actions */}
              <div className="p-4 sm:p-5 bg-neutral-950/90 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shrink-0">
                <div className="space-y-0.5">
                  <div className="text-xs font-serif text-white/90">
                    {fullscreenImage.atmosphere}
                  </div>
                  <div className="text-[11px] text-white/50">
                    {fullscreenImage.badge}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/reservation"
                    onClick={() => setFullscreenImage(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-serif font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>이 공간에서 상담 예약하기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setFullscreenImage(null)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-serif transition-colors cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
