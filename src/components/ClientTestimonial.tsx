import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Quote, 
  Star, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Lock, 
  Award, 
  Calendar, 
  MessageSquareHeart, 
  X, 
  User, 
  PhoneCall, 
  Tag, 
  Layers,
  Edit3
} from 'lucide-react';
import { TESTIMONIALS_DATA, TRUST_STATS } from '../data/testimonialsData';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';
import { testimonialService } from '../services/testimonialService';
import ClientReviewWriteModal from './ClientReviewWriteModal';

const CATEGORIES = [
  { id: 'all', label: '전체 후기' },
  { id: 'adult', label: '성인·번아웃' },
  { id: 'couple', label: '부부·가족' },
  { id: 'youth', label: '청소년·자녀' },
  { id: 'anxiety', label: '불안·자존감' },
];

// Counseling Field Category Theme Styles
const CATEGORY_THEMES: Record<string, { bg: string; text: string; border: string; label: string; icon: typeof User }> = {
  adult: {
    bg: 'bg-amber-50/90',
    text: 'text-amber-900',
    border: 'border-amber-200/90',
    label: '성인·번아웃',
    icon: User
  },
  couple: {
    bg: 'bg-rose-50/90',
    text: 'text-rose-900',
    border: 'border-rose-200/90',
    label: '부부·가족',
    icon: Heart
  },
  youth: {
    bg: 'bg-sky-50/90',
    text: 'text-sky-900',
    border: 'border-sky-200/90',
    label: '청소년·자녀',
    icon: Sparkles
  },
  anxiety: {
    bg: 'bg-teal-50/90',
    text: 'text-teal-900',
    border: 'border-teal-200/90',
    label: '불안·자존감',
    icon: ShieldCheck
  },
};

// Slider Transition Variants for Smooth Slide Animation
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 280, damping: 28 },
      opacity: { duration: 0.28 }
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: {
      x: { type: 'spring' as const, stiffness: 280, damping: 28 },
      opacity: { duration: 0.22 }
    }
  })
};

export default function ClientTestimonial({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null);

  // Dynamic Testimonials List & Admin Auth State
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS_DATA);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('hbbr_admin_auth') === 'true');
  }, []);

  const loadTestimonials = useCallback(async () => {
    try {
      const data = await testimonialService.getTestimonials(false);
      if (data && data.length > 0) {
        setTestimonialsList(prev => {
          if (
            prev.length === data.length &&
            prev[0]?.id === data[0]?.id &&
            prev[0]?.recommendCount === data[0]?.recommendCount
          ) {
            return prev;
          }
          return data;
        });
      }
    } catch (e) {
      console.error("Failed to load testimonials:", e);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
    const unsub = testimonialService.subscribe(() => {
      loadTestimonials();
    });
    return () => unsub();
  }, [loadTestimonials]);

  // Responsive cards per page calculation (1 on mobile, 2 on tablet, 3 on desktop)
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  // Filter testimonials based on category
  const filteredTestimonials = useMemo(() => {
    if (activeCategory === 'all') return testimonialsList;
    return testimonialsList.filter(t => t.category === activeCategory);
  }, [activeCategory, testimonialsList]);

  const maxIndex = Math.max(0, filteredTestimonials.length - cardsPerPage);

  // Reset index when filter or cardsPerPage changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, cardsPerPage]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || isHovering || maxIndex <= 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, maxIndex, handleNext]);

  // Visible items slice for current slide index
  const visibleCards = useMemo(() => {
    if (filteredTestimonials.length <= cardsPerPage) {
      return filteredTestimonials;
    }
    return filteredTestimonials.slice(currentIndex, currentIndex + cardsPerPage);
  }, [filteredTestimonials, currentIndex, cardsPerPage]);

  return (
    <section 
      id="testimonials-section"
      data-section="client-testimonials-section"
      aria-label="내담자 상담 후기 슬라이더 섹션"
      className={cn(
        "py-20 sm:py-24 relative overflow-hidden scroll-mt-16 sm:scroll-mt-20",
        isHighContrast 
          ? "bg-neutral-950 text-white" 
          : "bg-gradient-to-b from-white via-brand-beige/25 to-white",
        className
      )}
    >
      {/* Anchor point for client-testimonials-section compatibility */}
      <div id="client-testimonials-section" className="absolute -top-20 left-0 pointer-events-none" aria-hidden="true" />

      {/* Background Soft Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/30 border border-brand-green/40 text-xs font-serif text-brand-sage uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5 text-brand-sage" />
            <span className="font-semibold">Client Testimonials &amp; Healing Stories</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span className="font-medium text-brand-brown/80">내담자가 전하는 진솔한 회복의 여정</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            마음의 무게를 덜어낸 <span className="text-brand-sage">따뜻한 치유 후기</span>
          </h2>

          <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
            혼자 견디기 벅찼던 불안, 번아웃, 가족 갈등의 시간들.<br className="hidden sm:inline" />
            행복바람의 안전한 상담실에서 다시 일상을 살아갈 평온과 용기를 되찾은 실제 내담자분들의 이야기입니다.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-50/95 border border-emerald-300 text-xs font-serif text-emerald-900 shadow-2xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>한국상담심리학회 윤리강령 준수 · 100% 철저한 비밀보장 및 개인식별정보 비식별 가명 처리</span>
          </div>

          {/* Action buttons: Write Review & Admin Link */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-serif font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>내담자 치유 후기 작성하기</span>
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-serif font-bold rounded-2xl transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>관리자 모드 후기 관리 바로가기</span>
              </Link>
            )}
          </div>
        </div>

        {/* 4 Trust Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
          {TRUST_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-green/25 text-center shadow-2xs hover:border-brand-sage/40 transition-colors"
            >
              <div className="text-xl sm:text-2xl font-serif font-extrabold text-brand-sage mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-brand-brown font-serif mb-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] sm:text-[11px] text-brand-brown/55 font-serif">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Category Controls & Carousel Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/90 backdrop-blur-xs rounded-xl border border-brand-green/30 w-full sm:w-auto shadow-2xs">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? testimonialsList.length 
                : testimonialsList.filter(t => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setDirection(1);
                    setActiveCategory(cat.id);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-serif font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5",
                    isActive
                      ? "bg-brand-sage text-white shadow-xs"
                      : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive ? "bg-white/20 text-white" : "bg-brand-green/30 text-brand-brown/60"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying(prev => !prev)}
              aria-label={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
              title={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
              className={cn(
                "p-2 rounded-xl border transition-colors shadow-2xs cursor-pointer flex items-center gap-1 text-xs font-serif",
                isAutoPlaying
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-brand-green/30 text-brand-brown hover:text-brand-sage"
              )}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[11px] font-medium">
                {isAutoPlaying ? "자동 넘김 ON" : "자동 넘김 OFF"}
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="이전 후기 보기"
              disabled={maxIndex <= 0}
              className={cn(
                "p-2 rounded-xl bg-white border border-brand-green/30 text-brand-brown transition-all shadow-2xs cursor-pointer",
                maxIndex <= 0 
                  ? "opacity-40 cursor-not-allowed" 
                  : "hover:text-brand-sage hover:border-brand-sage/40 hover:bg-brand-beige/40 active:scale-95"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Index Counter */}
            <div className="px-2.5 text-xs font-mono font-bold text-brand-brown/70 select-none">
              <span className="text-brand-sage font-extrabold">{currentIndex + 1}</span>
              <span className="mx-1 text-brand-brown/40">/</span>
              <span>{Math.max(1, maxIndex + 1)}</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="다음 후기 보기"
              disabled={maxIndex <= 0}
              className={cn(
                "p-2 rounded-xl bg-white border border-brand-green/30 text-brand-brown transition-all shadow-2xs cursor-pointer",
                maxIndex <= 0 
                  ? "opacity-40 cursor-not-allowed" 
                  : "hover:text-brand-sage hover:border-brand-sage/40 hover:bg-brand-beige/40 active:scale-95"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Autoplay Subtle Progress Indicator */}
        {isAutoPlaying && maxIndex > 0 && (
          <div className="w-full bg-brand-green/20 h-1 rounded-full overflow-hidden mb-6">
            <motion.div
              key={`${currentIndex}-${activeCategory}-${isAutoPlaying}-${isHovering}`}
              initial={{ width: "0%" }}
              animate={{ width: isHovering ? "0%" : "100%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="h-full bg-brand-sage/80"
            />
          </div>
        )}

        {/* Carousel Multi-Card Track with Directional Slider Animation */}
        <div 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative mb-8"
        >
          {/* Floating Left Arrow (Desktop) */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="이전 후기 슬라이드"
              className="hidden lg:flex absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xs border border-brand-green/40 text-brand-brown hover:text-brand-sage hover:border-brand-sage hover:bg-white shadow-md hover:shadow-lg items-center justify-center transition-all cursor-pointer active:scale-95 group"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          )}

          {/* Floating Right Arrow (Desktop) */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="다음 후기 슬라이드"
              className="hidden lg:flex absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xs border border-brand-green/40 text-brand-brown hover:text-brand-sage hover:border-brand-sage hover:bg-white shadow-md hover:shadow-lg items-center justify-center transition-all cursor-pointer active:scale-95 group"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          {/* Slide Track with Framer Motion AnimatePresence and stable min-height */}
          <div className="overflow-hidden px-1 py-2 min-h-[420px] sm:min-h-[440px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`${currentIndex}-${activeCategory}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -45) {
                    handleNext();
                  } else if (info.offset.x > 45) {
                    handlePrev();
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 cursor-grab active:cursor-grabbing"
              >
                {visibleCards.map((card, cardIndex) => {
                  const theme = CATEGORY_THEMES[card.category] || CATEGORY_THEMES.adult;
                  const ThemeIcon = theme.icon;

                  return (
                    <article
                      key={`${card.id}-${cardIndex}`}
                      onClick={() => setSelectedStory(card)}
                      className={cn(
                        "rounded-3xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative",
                        isHighContrast
                          ? "bg-neutral-900 border-white/40 text-white"
                          : "bg-white hover:border-brand-sage/60 border-brand-green/25 shadow-xs hover:shadow-xl"
                      )}
                    >
                      <div>
                        {/* 1. Card Top: Counseling Field Category Badge & Stars & Verified */}
                        <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-brand-green/15">
                          {/* Counseling Field Category Badge */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={cn(
                              "text-[11px] px-2.5 py-1 rounded-full font-serif font-bold border flex items-center gap-1 shadow-2xs tracking-tight",
                              theme.bg, theme.text, theme.border
                            )}>
                              <ThemeIcon className="w-3 h-3 shrink-0" />
                              <span>{theme.label}</span>
                            </span>

                            {card.isBest && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-serif font-extrabold shadow-2xs flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>BEST 회복</span>
                              </span>
                            )}
                          </div>

                          {/* Star Rating & Verified */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex text-amber-400">
                              {[...Array(card.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 stroke-none" />
                              ))}
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-serif font-bold border border-emerald-200/80 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>종결</span>
                            </span>
                          </div>
                        </div>

                        {/* 2. Client Identity Header */}
                        <div className="flex items-center gap-3 mb-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-sage to-brand-brown text-white font-serif font-bold text-xs flex items-center justify-center shadow-2xs border border-white/60 shrink-0 tracking-wider">
                            {card.initial || card.clientName.slice(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-serif font-bold text-brand-brown">
                                {card.clientName}
                              </h3>
                              <span className="text-[11px] font-serif text-brand-brown/60">
                                {card.ageGroupAndRole}
                              </span>
                            </div>
                            <div className="text-[11px] font-serif text-brand-sage font-semibold truncate flex items-center gap-1">
                              <span>{card.programTaken}</span>
                              <span aria-hidden="true" className="text-brand-brown/30">·</span>
                              <span className="text-brand-brown/50 font-normal">{card.period}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Headline / Quote */}
                        <h4 className="text-sm sm:text-base font-serif font-bold text-brand-brown mb-2.5 leading-snug line-clamp-2 group-hover:text-brand-sage transition-colors">
                          {card.headline}
                        </h4>

                        {/* 4. Excerpt Story */}
                        <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed line-clamp-3 mb-3.5">
                          {card.story}
                        </p>

                        {/* 5. Before & After Transformation Tags */}
                        <div className="space-y-1.5 pt-3 border-t border-brand-green/15 mb-3.5">
                          <div className="flex items-start gap-2 text-xs font-serif">
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200 shrink-0">
                              상담 전
                            </span>
                            <span className="text-brand-brown/70 line-clamp-1">
                              {card.beforeState}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-xs font-serif">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                              상담 후
                            </span>
                            <span className="text-emerald-950 font-semibold line-clamp-1">
                              {card.afterState}
                            </span>
                          </div>
                        </div>

                        {/* 6. 상담 분야별 상세 태그 칩 (Counseling Field Tags) */}
                        <div className="pt-2.5 pb-2 border-t border-brand-green/15 flex flex-wrap items-center gap-1.5">
                          <div className="text-[10px] text-brand-brown/55 font-serif font-bold flex items-center gap-0.5 mr-0.5 shrink-0">
                            <Tag className="w-3 h-3 text-brand-sage" />
                            <span>분야 태그</span>
                          </div>
                          {card.tags && card.tags.map((tag, tIdx) => (
                            <span
                              key={`${card.id}-tag-${tIdx}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCategory(card.category);
                              }}
                              title={`'${tag}' 태그 상담 후기 보기`}
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-brand-green/25 text-brand-brown/85 font-serif font-medium border border-brand-green/40 hover:bg-brand-sage hover:text-white hover:border-brand-sage transition-all cursor-pointer shadow-2xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 7. Card Bottom: Clinical Insight Tag & Read More Action */}
                      <div className="pt-3 border-t border-brand-green/15 flex items-center justify-between text-xs font-serif mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-brand-sage font-medium">
                          {card.counselorInsight ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                              <span>소장 임상 코멘트 수록</span>
                            </>
                          ) : (
                            <span className="text-brand-brown/50">{card.date}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStory(card);
                          }}
                          className="text-brand-sage font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                        >
                          <span>상세 후기 보기</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Pagination Dots & Swipe Helper */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-14 px-2">
          <div className="text-[11px] text-brand-brown/55 font-serif flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-ping" />
            <span>카드를 좌우로 드래그(스와이프)하거나 화살표를 눌러 전체 후기를 편리하게 확인하실 수 있습니다.</span>
          </div>

          {maxIndex > 0 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    aria-label={`${idx + 1}번째 슬라이드로 이동`}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 cursor-pointer",
                      isActive
                        ? "w-7 bg-brand-sage"
                        : "w-2 bg-brand-green/45 hover:bg-brand-sage/50"
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* 4 Supportive Pillars of Happy Wind Institute */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-serif font-bold text-brand-sage tracking-wider uppercase bg-brand-sage/10 px-3 py-1 rounded-md">
              행복바람이 지켜온 4대 안심 환경
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Lock className="w-5 h-5 text-brand-sage" />,
                title: "100% 철저한 비밀보장",
                desc: "한국상담학회 윤리강령을 엄격히 준수하며 모든 상담 내용과 기록은 철저히 비밀로 보호됩니다."
              },
              {
                icon: <Heart className="w-5 h-5 text-rose-500" />,
                title: "무비판적 수용과 공감",
                desc: "어떠한 판단이나 편견 없이, 있는 그대로의 내담자 마음을 온전히 따뜻하게 품고 경청합니다."
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
                title: "프라이빗 힐링 룸",
                desc: "내담자 간 마주치지 않는 동선 설계와 완전 방음 인테리어로 온전한 쉼을 보장합니다."
              },
              {
                icon: <Award className="w-5 h-5 text-emerald-600" />,
                title: "1일 5회기 한정 케어",
                desc: "상담사의 최상의 에너지와 집중력을 유지하기 위해 하루 상담 인원을 최대 5회기로 제한합니다."
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-brand-green/25 flex flex-col shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-beige/60 flex items-center justify-center mb-3 shrink-0 border border-brand-green/20">
                  {pillar.icon}
                </div>
                <h4 className="font-serif font-bold text-sm text-brand-brown mb-1.5">
                  {pillar.title}
                </h4>
                <p className="text-xs text-brand-brown/70 leading-relaxed font-serif">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Direct Reservation & Reviews Banner */}
        <div className="bg-brand-brown text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-brand-green/20">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-sage/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-brand-green font-serif font-semibold text-xs rounded-full">
                <Heart className="w-3.5 h-3.5 fill-brand-green" />
                <span>당신의 마음도 다시 평온해질 수 있습니다</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                지금 마주한 고민, 더 이상 혼자 짊어지지 마세요.
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-serif">
                전문 상담사가 안전하고 따뜻한 공간에서 당신의 이야기에 온전히 귀 기울입니다.
                작은 용기가 내일의 평온과 회복을 만들어냅니다.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <Link
                to="/reservation"
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-serif font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>1:1 상담 예약 신청하기</span>
              </Link>
              <Link
                to="/community?tab=review"
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-serif font-semibold rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <span>후기 전체 목록 보기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* In-depth Full Testimonial Modal Dialog */}
      <AnimatePresence>
        {selectedStory && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-green/30 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-brand-green/20 bg-brand-beige/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/70">
                  <span className="font-bold text-brand-sage">{selectedStory.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedStory.period}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="p-1.5 rounded-full text-brand-brown/60 hover:text-brand-brown hover:bg-white transition-colors cursor-pointer"
                  aria-label="후기 닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                
                {/* Anonymity & Privacy Assurance Banner */}
                <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 font-serif leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-900 block mb-0.5">내담자 비밀보장 및 개인정보 비식별 조치 안내</strong>
                    <span>본 후기는 내담자의 자발적 동의 하에 게재되었으며, 신원 특정을 철저히 방지하기 위해 성명(가명·이니셜), 직무, 세부 상황을 100% 가명화 및 재구성하여 비밀을 완벽히 보호합니다.</span>
                  </div>
                </div>

                {/* Client Info Banner */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-brand-green/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-sage to-brand-brown text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs tracking-wider">
                      {selectedStory.initial || selectedStory.clientName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-serif font-bold text-brand-brown">
                          {selectedStory.clientName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 font-serif">
                          비식별 가명화
                        </span>
                        <span className="text-xs text-brand-brown/70 font-serif">
                          {selectedStory.ageGroupAndRole}
                        </span>
                      </div>
                      <div className="text-xs text-brand-sage font-semibold font-serif">
                        {selectedStory.programTaken}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(selectedStory.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>

                {/* Counseling Field Tags in Modal */}
                {selectedStory.tags && selectedStory.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-brand-beige/50 border border-brand-green/25">
                    <div className="text-xs font-serif font-bold text-brand-brown/60 flex items-center gap-1 mr-1">
                      <Tag className="w-3.5 h-3.5 text-brand-sage" />
                      <span>상담 분야별 태그:</span>
                    </div>
                    {selectedStory.tags.map((tag, idx) => (
                      <span 
                        key={`modal-tag-${selectedStory.id}-${idx}`}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white text-brand-sage font-serif font-semibold border border-brand-green/30 shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Headline */}
                <h3 id="testimonial-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-brand-brown leading-snug">
                  {selectedStory.headline}
                </h3>

                {/* Full Story Narrative */}
                <p className="text-sm sm:text-base font-serif text-brand-brown/85 leading-relaxed whitespace-pre-line">
                  {selectedStory.story}
                </p>

                {/* Before & After Detailed Transformation Box */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs font-serif">
                    <div className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-bold">
                        상담 전
                      </span>
                      <span>혼자 감당했던 마음의 고통</span>
                    </div>
                    <p className="text-brand-brown/80 leading-relaxed">
                      {selectedStory.beforeState}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs font-serif">
                    <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                        상담 후
                      </span>
                      <span>종결 후 찾아온 치유와 변화</span>
                    </div>
                    <p className="text-emerald-950 font-semibold leading-relaxed">
                      {selectedStory.afterState}
                    </p>
                  </div>
                </div>

                {/* Counselor Clinical Perspective */}
                {selectedStory.counselorInsight && (
                  <div className="p-4 rounded-2xl bg-brand-green/20 border border-brand-sage/30 text-xs font-serif">
                    <div className="flex items-center gap-1.5 font-bold text-brand-sage mb-1">
                      <CheckCircle2 className="w-4 h-4 text-brand-sage" />
                      <span>박미경 소장의 임상 조망 &amp; 치유 코멘트</span>
                    </div>
                    <p className="text-brand-brown/85 leading-relaxed">
                      {selectedStory.counselorInsight}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 bg-brand-beige/40 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/70">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-sage" />
                  <span>전화 문의: <strong>052-254-0230</strong></span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedStory(null)}
                    className="px-4 py-2.5 rounded-xl border border-brand-green/30 hover:bg-white text-xs font-serif font-bold text-brand-brown transition-colors cursor-pointer"
                  >
                    닫기
                  </button>

                  <Link
                    to="/reservation"
                    onClick={() => setSelectedStory(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-serif font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>이와 비슷한 고민 1:1 상담 예약</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Review Write Modal Form */}
      <ClientReviewWriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={() => loadTestimonials()}
      />
    </section>
  );
}
