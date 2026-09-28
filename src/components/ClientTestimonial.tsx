import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Clock, 
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { TESTIMONIALS_DATA, TRUST_STATS } from '../data/testimonialsData';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

const CATEGORIES = [
  { id: 'all', label: '전체 후기' },
  { id: 'adult', label: '성인·번아웃' },
  { id: 'couple', label: '부부·가족' },
  { id: 'youth', label: '청소년·자녀' },
  { id: 'anxiety', label: '불안·자존감' },
];

export default function ClientTestimonial({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null);

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
    if (activeCategory === 'all') return TESTIMONIALS_DATA;
    return TESTIMONIALS_DATA.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const maxIndex = Math.max(0, filteredTestimonials.length - cardsPerPage);

  // Reset index when filter or cardsPerPage changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, cardsPerPage]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlaying || isHovering || maxIndex <= 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, maxIndex, nextSlide]);

  // Visible items slice for carousel
  const visibleCards = useMemo(() => {
    // If we have fewer items than cardsPerPage, just show all
    if (filteredTestimonials.length <= cardsPerPage) {
      return filteredTestimonials;
    }
    return filteredTestimonials.slice(currentIndex, currentIndex + cardsPerPage);
  }, [filteredTestimonials, currentIndex, cardsPerPage]);

  return (
    <section 
      id="client-testimonials-section"
      aria-label="내담자 상담 후기 캐러셀 섹션"
      className={cn(
        "py-20 sm:py-24 relative overflow-hidden",
        isHighContrast 
          ? "bg-neutral-950 text-white" 
          : "bg-gradient-to-b from-white via-brand-beige/20 to-white",
        className
      )}
    >
      {/* Background Soft Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Clinical Trust & Warmth */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-serif text-brand-sage uppercase tracking-wider mb-2.5">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Client Testimonials &amp; Healing Stories</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span>내담자가 전하는 진솔한 회복의 여정</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            마음의 무게를 덜어낸 <span className="text-brand-sage">따뜻한 치유 후기</span>
          </h2>

          <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
            혼자 견디기 벅찼던 불안, 번아웃, 가족 갈등의 시간들.<br className="hidden sm:inline" />
            행복바람의 안전한 상담실에서 다시 일상을 살아갈 평온과 용기를 되찾은 실제 내담자분들의 이야기입니다.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1 rounded-full bg-white/90 border border-brand-green/30 text-xs font-serif text-brand-brown/70 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% 개인식별정보 익명 보호 · 한국상담학회 윤리강령 준수</span>
          </div>
        </div>

        {/* 4 Trust Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
          {TRUST_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/85 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-green/25 text-center shadow-2xs"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/90 backdrop-blur-xs rounded-xl border border-brand-green/30 w-full sm:w-auto shadow-2xs">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-serif font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-brand-sage text-white shadow-xs"
                      : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Carousel Controls: Autoplay Toggle, Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying(prev => !prev)}
              aria-label={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
              title={isAutoPlaying ? "자동 슬라이드 일시정지" : "자동 슬라이드 재생"}
              className="p-2 rounded-xl bg-white border border-brand-green/30 text-brand-brown hover:text-brand-sage hover:bg-brand-beige/40 transition-colors shadow-2xs cursor-pointer"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={prevSlide}
              aria-label="이전 후기 보기"
              disabled={maxIndex <= 0}
              className={cn(
                "p-2 rounded-xl bg-white border border-brand-green/30 text-brand-brown transition-colors shadow-2xs cursor-pointer",
                maxIndex <= 0 ? "opacity-40 cursor-not-allowed" : "hover:text-brand-sage hover:bg-brand-beige/40 active:scale-95"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Index Counter */}
            <div className="px-2.5 text-xs font-mono font-bold text-brand-brown/70">
              <span className="text-brand-sage font-extrabold">{currentIndex + 1}</span>
              <span className="mx-1 text-brand-brown/40">/</span>
              <span>{Math.max(1, maxIndex + 1)}</span>
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="다음 후기 보기"
              disabled={maxIndex <= 0}
              className={cn(
                "p-2 rounded-xl bg-white border border-brand-green/30 text-brand-brown transition-colors shadow-2xs cursor-pointer",
                maxIndex <= 0 ? "opacity-40 cursor-not-allowed" : "hover:text-brand-sage hover:bg-brand-beige/40 active:scale-95"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Multi-Card Track */}
        <div 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleCards.map((card) => (
                <motion.article
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedStory(card)}
                  className={cn(
                    "rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative",
                    isHighContrast
                      ? "bg-neutral-900 border-white/40 text-white"
                      : "bg-white hover:border-brand-sage/60 border-brand-green/25 shadow-sm hover:shadow-xl"
                  )}
                >
                  <div>
                    {/* Card Top: Stars & Verified Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3.5 border-b border-brand-green/15">
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {[...Array(card.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-amber-800 font-serif ml-1">
                          5.0 만점
                        </span>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-serif font-bold border border-emerald-200/80 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>종결 내담자 인증</span>
                      </span>
                    </div>

                    {/* Client Identity Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-sage to-brand-brown text-white font-serif font-bold text-sm flex items-center justify-center shadow-2xs border border-white/50 shrink-0">
                        {card.clientName.substring(0, 1)}
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
                        <div className="text-[11px] font-serif text-brand-sage font-semibold truncate">
                          {card.programTaken}
                        </div>
                      </div>
                    </div>

                    {/* Headline / Quote */}
                    <h4 className="text-sm sm:text-base font-serif font-bold text-brand-brown mb-3 leading-snug line-clamp-2 group-hover:text-brand-sage transition-colors">
                      {card.headline}
                    </h4>

                    {/* Excerpt Story */}
                    <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed line-clamp-3 mb-4">
                      {card.story}
                    </p>

                    {/* Before & After Transformation Tags */}
                    <div className="space-y-1.5 pt-3 border-t border-brand-green/15 mb-4">
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
                        <span className="text-emerald-900 font-semibold line-clamp-1">
                          {card.afterState}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Tags & Read More Action */}
                  <div className="pt-3 border-t border-brand-green/10 flex items-center justify-between text-xs font-serif">
                    <div className="text-[11px] text-brand-brown/50">
                      {card.date}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStory(card);
                      }}
                      className="text-brand-sage font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>상세 후기 읽기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-14">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`${idx + 1}번째 슬라이드로 이동`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    isActive
                      ? "w-6 bg-brand-sage"
                      : "w-2 bg-brand-green/40 hover:bg-brand-sage/50"
                  )}
                />
              );
            })}
          </div>
        )}

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
                
                {/* Client Info Banner */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-brand-green/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-sage to-brand-brown text-white font-serif font-bold text-base flex items-center justify-center shadow-xs">
                      {selectedStory.clientName.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-serif font-bold text-brand-brown">
                          {selectedStory.clientName}
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
    </section>
  );
}
