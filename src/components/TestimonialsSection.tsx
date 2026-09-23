import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Quote, Star, ShieldCheck, Heart, Sparkles, CheckCircle2, 
  ArrowRight, ChevronLeft, ChevronRight, Pause, Play,
  Lock, VolumeX, Award, Calendar, MessageSquareHeart,
  X, HelpCircle, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TESTIMONIALS_DATA, TRUST_STATS } from '../data/testimonialsData';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

// 4 Supportive Pillars of Happy Wind Institute
const SUPPORTIVE_PILLARS = [
  {
    icon: <Lock className="w-5 h-5 text-brand-sage" />,
    title: "100% 철저한 비밀보장",
    desc: "한국상담심리학회 윤리강령을 엄격히 준수하며 모든 상담 내용과 기록은 철저히 보호됩니다."
  },
  {
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    title: "무비판적 수용과 깊은 공감",
    desc: "어떠한 판단이나 편견 없이, 있는 그대로의 내담자 마음을 따뜻하게 품고 경청합니다."
  },
  {
    icon: <VolumeX className="w-5 h-5 text-amber-600" />,
    title: "프라이빗 힐링 룸",
    desc: "내담자 간 마주치지 않는 동선 설계와 완전 방음 인테리어로 온전한 쉼을 보장합니다."
  },
  {
    icon: <Award className="w-5 h-5 text-emerald-600" />,
    title: "하루 5회기 한정 케어",
    desc: "상담사의 최상 집중력과 에너지를 유지하기 위해 하루 상담 인원을 최대 5회기로 엄격히 제한합니다."
  }
];

export default function TestimonialsSection() {
  const { isHighContrast } = useHighContrast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const timerRef = useRef<number | null>(null);
  const AUTOPLAY_INTERVAL = 7000; // 7 seconds per slide

  const filteredTestimonials = activeCategory === 'all'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter(t => t.category === activeCategory);

  const totalStories = filteredTestimonials.length;

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const paginate = useCallback((newDirection: number) => {
    if (totalStories <= 0) return;
    setDirection(newDirection);
    setCurrentIndex(prevIndex => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = totalStories - 1;
      if (nextIndex >= totalStories) nextIndex = 0;
      return nextIndex;
    });
  }, [totalStories]);

  const jumpToIndex = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay effect with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || isHovering || totalStories <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      paginate(1);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isHovering, paginate, totalStories]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      paginate(-1);
    } else if (e.key === 'ArrowRight') {
      paginate(1);
    }
  };

  const currentTestimonial = filteredTestimonials[currentIndex] || TESTIMONIALS_DATA[0];

  // Motion slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <section 
      id="testimonials-section"
      aria-label="내담자들이 남긴 따뜻한 상담 후기 슬라이드 섹션"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "py-24 relative overflow-hidden focus:outline-hidden",
        isHighContrast 
          ? "bg-black text-white" 
          : "bg-gradient-to-b from-brand-beige/30 via-white to-brand-beige/20"
      )}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-brand-green/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-4 tracking-wide border border-brand-sage/20">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>실제 내담자 상담 후기 · Warm Healing Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            내담자들이 남긴 <span className="text-brand-sage">따뜻한 후기</span>
          </h2>

          <p className="text-brand-brown/75 text-base sm:text-lg font-serif leading-relaxed">
            혼자 짊어졌던 마음의 무게, 행복바람의 따뜻한 경청 속에서 <br className="hidden sm:inline" />
            다시 일상을 살아갈 용기와 평온을 되찾은 실제 내담자분들의 이야기입니다.
          </p>

          <div className="inline-flex items-center gap-2 mt-5 px-3 py-1 rounded-full bg-white/80 border border-brand-green/30 text-xs font-medium text-brand-brown/70 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-brand-sage shrink-0" />
            <span>100% 개인식별정보 익명 보호 · 한국상담심리학회 윤리강령 준수</span>
          </div>
        </div>

        {/* Category Filter Controls */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {[
            { id: 'all', name: '전체 후기' },
            { id: 'adult', name: '성인·번아웃' },
            { id: 'couple', name: '부부·가족' },
            { id: 'youth', name: '청소년·자녀' },
            { id: 'anxiety', name: '불안·자존감' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                activeCategory === cat.id
                  ? "bg-brand-sage text-white shadow-xs"
                  : "bg-white text-brand-brown/75 hover:bg-brand-green/25 border border-brand-green/30"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Carousel Slide Container */}
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative max-w-5xl mx-auto mb-16"
        >
          {/* Main Slide Card */}
          <div className={cn(
            "relative rounded-3xl border shadow-xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-all",
            isHighContrast
              ? "bg-neutral-950 border-white/60 text-white"
              : "bg-white/95 backdrop-blur-md border-brand-green/40"
          )}>
            
            {/* Auto-play Progress Bar */}
            {isAutoPlaying && !isHovering && totalStories > 1 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-green/20 overflow-hidden z-20">
                <motion.div
                  key={`${currentIndex}-${activeCategory}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                  className="h-full bg-brand-sage"
                />
              </div>
            )}

            {/* Subtle Decorative Quote Background */}
            <Quote className="absolute top-6 right-8 w-24 h-24 sm:w-32 sm:h-32 text-brand-green/10 -rotate-12 pointer-events-none" />

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentTestimonial.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) {
                    paginate(1);
                  } else if (info.offset.x > 50) {
                    paginate(-1);
                  }
                }}
                className="relative z-10 flex flex-col justify-between cursor-grab active:cursor-grabbing"
              >
                <div>
                  {/* Card Header: Client Identity & Rating */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-brand-green/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-sage to-brand-brown text-white font-serif font-bold text-lg flex items-center justify-center shadow-xs border border-white/40">
                        {currentTestimonial.clientName.substring(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-brand-brown">
                            {currentTestimonial.clientName}
                          </h3>
                          <span className="text-xs text-brand-brown/70 font-medium">
                            {currentTestimonial.ageGroupAndRole}
                          </span>
                          <span className="text-[11px] text-brand-brown/50">
                            · {currentTestimonial.period}
                          </span>
                        </div>
                        <p className="text-xs text-brand-sage font-semibold mt-0.5">
                          {currentTestimonial.programTaken}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200 text-amber-800 font-bold text-xs">
                      <div className="flex text-amber-400">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                        ))}
                      </div>
                      <span>5.0 만족도 만점</span>
                    </div>
                  </div>

                  {/* Testimonial Headline */}
                  <div className="mb-5">
                    <h4 className="font-serif font-bold text-xl sm:text-2xl text-brand-brown leading-snug">
                      {currentTestimonial.headline}
                    </h4>
                  </div>

                  {/* Story Body */}
                  <p className="text-brand-brown/85 font-serif text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
                    {currentTestimonial.story}
                  </p>

                  {/* Before & After Transformation Comparison */}
                  <div className="grid sm:grid-cols-2 gap-3.5 mb-6">
                    <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/60 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-bold">
                          상담 전
                        </span>
                        <span>혼자 감당했던 마음의 고통</span>
                      </div>
                      <p className="text-brand-brown/80 font-serif leading-relaxed">
                        {currentTestimonial.beforeState}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                          상담 후
                        </span>
                        <span>종결 후 찾아온 치유와 변화</span>
                      </div>
                      <p className="text-brand-brown font-serif font-medium leading-relaxed">
                        {currentTestimonial.afterState}
                      </p>
                    </div>
                  </div>

                  {/* Counselor Clinical Perspective */}
                  {currentTestimonial.counselorInsight && (
                    <div className="p-4 rounded-2xl bg-brand-green/20 border border-brand-sage/30 text-xs mb-6">
                      <div className="flex items-center gap-1.5 font-bold text-brand-sage mb-1">
                        <CheckCircle2 className="w-4 h-4 text-brand-sage" />
                        <span>담당 상담사의 치유 조망 & 격려 코멘트</span>
                      </div>
                      <p className="text-brand-brown/80 font-serif leading-relaxed text-xs sm:text-[13px]">
                        {currentTestimonial.counselorInsight}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer: Tags & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-green/20">
                  <div className="flex flex-wrap gap-1.5 text-xs text-brand-brown/60">
                    {currentTestimonial.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-brand-beige/70 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStory(currentTestimonial)}
                      className="px-4 py-2 rounded-xl border border-brand-brown/20 text-brand-brown hover:bg-brand-beige/50 text-xs font-semibold transition-all cursor-pointer"
                    >
                      상세 후기 읽기
                    </button>
                    <Link
                      to="/reservation"
                      className="px-5 py-2 rounded-xl bg-brand-sage text-white hover:bg-brand-sage/90 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>상담 예약하기</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Bottom Controller: Prev, Slide Indicator, Dots, Play/Pause, Next */}
          <div className="flex items-center justify-between mt-6 px-3">
            {/* Slide Index Counter */}
            <div className="text-xs font-mono font-bold text-brand-brown/70 flex items-center gap-1">
              <span className="text-brand-sage text-sm font-extrabold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(totalStories).padStart(2, '0')}</span>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {filteredTestimonials.map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => jumpToIndex(idx)}
                    aria-label={`${idx + 1}번째 후기로 이동`}
                    aria-current={isActive ? 'true' : 'false'}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                      isActive
                        ? "w-8 bg-brand-sage"
                        : "w-2.5 bg-brand-green/50 hover:bg-brand-sage/50"
                    )}
                  />
                );
              })}
            </div>

            {/* Navigation & Autoplay Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(prev => !prev)}
                aria-label={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
                title={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
                className="p-2.5 rounded-2xl bg-white border border-brand-green/30 text-brand-brown hover:text-brand-sage transition-all shadow-xs cursor-pointer"
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="이전 후기 보기"
                className="p-2.5 rounded-2xl bg-white border border-brand-green/30 text-brand-brown hover:text-brand-sage transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="다음 후기 보기"
                className="p-2.5 rounded-2xl bg-white border border-brand-green/30 text-brand-brown hover:text-brand-sage transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Supportive Pillars of Happy Wind */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-brand-sage tracking-wider uppercase bg-brand-sage/10 px-3 py-1 rounded-md">
              행복바람이 지켜온 4대 안심 환경
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORTIVE_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-300 flex flex-col",
                  isHighContrast
                    ? "bg-neutral-900 text-white border-white/60"
                    : "bg-white/80 backdrop-blur-xs border-brand-green/30 hover:border-brand-sage/50 hover:shadow-md"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-beige/60 flex items-center justify-center mb-3 shrink-0 border border-brand-green/20">
                  {pillar.icon}
                </div>
                <h4 className="font-bold text-sm text-brand-brown mb-1.5 flex items-center gap-1.5">
                  <span>{pillar.title}</span>
                </h4>
                <p className="text-xs text-brand-brown/70 leading-relaxed font-serif">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof & Trust Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {TRUST_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-brand-green/30 text-center shadow-2xs hover:border-brand-sage/50 transition-all"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-sage mb-1 font-serif">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-brand-brown mb-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-brand-brown/55">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Action Card */}
        <div className="bg-brand-brown text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-brand-green/20">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-sage/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-brand-green font-semibold text-xs rounded-full mb-3">
                <Heart className="w-3.5 h-3.5 fill-brand-green" />
                <span>당신의 마음도 다시 평온해질 수 있습니다</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-snug">
                지금 마주한 고민, 더 이상 혼자 짊어지지 마세요.
              </h3>
              <p className="text-white/80 text-sm leading-relaxed font-serif">
                전문 상담사가 안전하고 따뜻한 공간에서 당신의 이야기에 온전히 귀 기울입니다.
                작은 용기가 내일의 평온과 회복을 만들어냅니다.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <Link
                to="/reservation"
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4" />
                <span>상담 예약 신청하기</span>
              </Link>
              <Link
                to="/community"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>커뮤니티 후기 더보기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Full Testimonial Modal Popup */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-green/30 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-brand-green/20 text-brand-brown transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-brand-green/20">
                <div className="w-12 h-12 rounded-2xl bg-brand-sage text-white font-serif font-bold text-lg flex items-center justify-center">
                  {selectedStory.clientName.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-brand-brown">
                      {selectedStory.clientName}
                    </h3>
                    <span className="text-xs text-brand-brown/70">{selectedStory.ageGroupAndRole}</span>
                  </div>
                  <p className="text-xs text-brand-sage font-semibold mt-0.5">
                    {selectedStory.programTaken} · {selectedStory.period}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(selectedStory.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                ))}
                <span className="text-xs font-bold text-amber-700 ml-1.5">5.0 / 5.0 만족도</span>
              </div>

              <h4 className="font-serif font-bold text-xl text-brand-brown mb-4 leading-snug">
                {selectedStory.headline}
              </h4>

              <div className="bg-brand-beige/40 p-4 rounded-2xl mb-5 text-sm font-serif text-brand-brown/85 leading-relaxed whitespace-pre-line">
                {selectedStory.story}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-5 text-xs">
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="font-bold text-rose-800 mb-1">상담 전 마주했던 고통</div>
                  <p className="text-brand-brown/80">{selectedStory.beforeState}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-800 mb-1">상담 후 찾아온 변화</div>
                  <p className="text-brand-brown">{selectedStory.afterState}</p>
                </div>
              </div>

              {selectedStory.counselorInsight && (
                <div className="p-4 rounded-xl bg-brand-green/20 border border-brand-sage/30 text-xs mb-6">
                  <div className="font-bold text-brand-sage mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>상담심리학적 임상 코멘트</span>
                  </div>
                  <p className="text-brand-brown/80 font-serif leading-relaxed">
                    {selectedStory.counselorInsight}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-brand-green/20">
                <div className="flex flex-wrap gap-1 text-xs text-brand-brown/60">
                  {selectedStory.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-brand-beige">{t}</span>
                  ))}
                </div>
                <Link
                  to="/reservation"
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2.5 bg-brand-sage text-white font-bold rounded-xl hover:bg-brand-sage/90 text-xs transition-all shadow-xs"
                >
                  상담 예약하기
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
