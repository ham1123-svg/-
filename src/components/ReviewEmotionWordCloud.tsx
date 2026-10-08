import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  TrendingUp,
  Search,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Smile,
  ShieldCheck,
  ChevronRight,
  Filter,
  BarChart3,
  Cloud,
  Layers,
  Quote,
  CheckCircle2,
  X,
  ExternalLink,
  MessageSquareHeart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Testimonial } from '../types';
import { testimonialService } from '../services/testimonialService';
import {
  reviewEmotionAnalyzer,
  EmotionKeywordItem,
  EmotionAnalysisReport
} from '../services/reviewEmotionAnalyzer';

interface ReviewEmotionWordCloudProps {
  onSelectKeyword?: (keyword: string) => void;
  className?: string;
  testimonials?: Testimonial[];
}

type ViewMode = 'cloud' | 'ranking' | 'journey';
type FilterCategory = 'all' | 'healing' | 'challenge';

export default function ReviewEmotionWordCloud({
  onSelectKeyword,
  className,
  testimonials: externalTestimonials
}: ReviewEmotionWordCloudProps) {
  const [internalTestimonials, setInternalTestimonials] = useState<Testimonial[]>([]);
  const [selectedWord, setSelectedWord] = useState<EmotionKeywordItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cloud');
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Load testimonials if not provided externally
  useEffect(() => {
    if (externalTestimonials && externalTestimonials.length > 0) {
      setInternalTestimonials(externalTestimonials);
      return;
    }

    let isMounted = true;
    const load = async () => {
      try {
        const data = await testimonialService.getTestimonials(false);
        if (isMounted) {
          setInternalTestimonials(data);
        }
      } catch (e) {
        console.error('Error loading testimonials for emotion cloud:', e);
      }
    };

    load();
    const unsubscribe = testimonialService.subscribe(load);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [externalTestimonials]);

  // Compute emotion analysis report
  const analysisReport: EmotionAnalysisReport = useMemo(() => {
    const list = externalTestimonials || internalTestimonials;
    return reviewEmotionAnalyzer.analyzeTestimonials(list);
  }, [externalTestimonials, internalTestimonials]);

  // Filtered and sorted keywords
  const displayKeywords = useMemo(() => {
    let list = analysisReport.keywords;

    if (filterCategory === 'healing') {
      list = analysisReport.healingKeywords;
    } else if (filterCategory === 'challenge') {
      list = analysisReport.challengeKeywords;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        item =>
          item.word.toLowerCase().includes(q) ||
          item.koreanCategory.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    // Shuffle slightly for organic cloud feel if in cloud view
    if (viewMode === 'cloud' && shuffleSeed > 0) {
      // Deterministic pseudorandom shuffle based on seed
      return [...list].sort((a, b) => {
        const hashA = (a.word.charCodeAt(0) * 31 + shuffleSeed * 17) % 100;
        const hashB = (b.word.charCodeAt(0) * 31 + shuffleSeed * 17) % 100;
        return hashA - hashB;
      });
    }

    return list;
  }, [analysisReport, filterCategory, searchQuery, viewMode, shuffleSeed]);

  const handleKeywordClick = (item: EmotionKeywordItem) => {
    setSelectedWord(item);
  };

  const handleApplyKeywordToReviews = (word: string) => {
    setSelectedWord(null);
    if (onSelectKeyword) {
      onSelectKeyword(word);
    }

    // Smooth scroll down to the review board
    const reviewBoardElement = document.getElementById('anonymous-review-board-container');
    if (reviewBoardElement) {
      reviewBoardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="review-emotion-wordcloud-section"
      className={cn(
        "rounded-3xl bg-gradient-to-b from-white via-brand-beige/20 to-white border border-brand-green/20 shadow-md p-6 sm:p-8 lg:p-10 relative overflow-hidden",
        className
      )}
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-green/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>상담 후기 본문 정밀 텍스트 마이닝 분석</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown flex flex-wrap items-center gap-2.5">
              <span>내담자 감정 키워드 워드 클라우드</span>
              <span className="text-xs sm:text-sm font-sans font-semibold px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage">
                Emotion Word Cloud
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-brown/70 max-w-2xl leading-relaxed">
              행복바람심리상담연구소 실제 내담자분들이 상담 후기에서 직접 고백한 
              <strong> 겪으셨던 어려움</strong>과 <strong>상담 후 찾아온 치유와 회복의 감정</strong>을 
              추출하여 시각화한 심리 어휘 지도입니다.
            </p>
          </div>

          {/* Quick Action: Word Cloud Shuffler / Reseed */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShuffleSeed(prev => prev + 1)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-brand-beige/50 text-brand-brown/80 hover:text-brand-brown border border-brand-green/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="클라우드 배치 재정렬"
            >
              <RotateCcw className="w-3.5 h-3.5 text-brand-sage" />
              <span>배치 섞기</span>
            </button>
          </div>
        </div>

        {/* Emotion Analytics Metrics Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-white/90 border border-brand-green/20 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-brand-brown/60 mb-1">
              <span>분석된 후기 본문</span>
              <BookOpen className="w-4 h-4 text-brand-sage" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-brand-brown">
              {analysisReport.totalReviewsAnalyzed}
              <span className="text-xs font-sans font-normal ml-1 text-brand-brown/70">편</span>
            </div>
            <p className="text-[11px] text-brand-brown/60 mt-1">100% 실제 내담자 검증 수기</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-brand-green/20 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-brand-brown/60 mb-1">
              <span>추출된 감정 어휘 수</span>
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-brand-brown">
              {analysisReport.uniqueEmotionKeywordsCount}
              <span className="text-xs font-sans font-normal ml-1 text-brand-brown/70">개 키워드</span>
            </div>
            <p className="text-[11px] text-brand-brown/60 mt-1">
              총 {analysisReport.totalEmotionMentions}회 빈출 언급
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
              <span>치유 &amp; 회복 정서 비율</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-900 flex items-baseline gap-1">
              <span>{analysisReport.healingRatio}%</span>
              <span className="text-[11px] font-sans font-normal text-emerald-700">
                ({analysisReport.healingMentions}회)
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${analysisReport.healingRatio}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
              <span>1위 대표 치유 감정</span>
              <Heart className="w-4 h-4 text-amber-600 fill-amber-500/20" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-amber-950 flex items-baseline gap-1.5">
              <span>"{analysisReport.topHealingEmotion?.word || '평온'}"</span>
              <span className="text-xs font-sans font-normal text-amber-800">
                {analysisReport.topHealingEmotion?.count || 0}회
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1 truncate">
              {analysisReport.topHealingEmotion?.koreanCategory || '내적 안정 & 평화'}
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs (All / Healing / Challenge) + View Switcher (Cloud / Ranking / Journey) */}
      <div className="relative z-10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-3 sm:p-4 border border-brand-green/15 shadow-2xs">
        {/* Emotion Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              filterCategory === 'all'
                ? "bg-brand-brown text-white shadow-xs"
                : "bg-brand-beige/40 text-brand-brown/70 hover:bg-brand-beige hover:text-brand-brown"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>전체 감정 ({analysisReport.keywords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('healing')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              filterCategory === 'healing'
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60"
            )}
          >
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            <span>🌿 치유 &amp; 회복 감정 ({analysisReport.healingKeywords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory('challenge')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              filterCategory === 'challenge'
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>🌧️ 고민 &amp; 극복 감정 ({analysisReport.challengeKeywords.length})</span>
          </button>
        </div>

        {/* Search input + View Mode Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Quick search input within emotion cloud */}
          <div className="relative">
            <input
              type="text"
              placeholder="감정 단어 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 sm:w-40 pl-8 pr-7 py-1.5 rounded-xl border border-brand-green/25 text-xs text-brand-brown bg-brand-beige/20 focus:outline-none focus:border-brand-sage focus:w-48 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-brand-brown/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-brown/40 hover:text-brand-brown"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="inline-flex rounded-xl bg-brand-beige/40 p-1 border border-brand-green/20">
            <button
              type="button"
              onClick={() => setViewMode('cloud')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                viewMode === 'cloud'
                  ? "bg-white text-brand-brown shadow-2xs"
                  : "text-brand-brown/60 hover:text-brand-brown"
              )}
              title="인터랙티브 워드 클라우드"
            >
              <Cloud className="w-4 h-4 text-brand-sage" />
              <span className="hidden sm:inline">클라우드</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('ranking')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                viewMode === 'ranking'
                  ? "bg-white text-brand-brown shadow-2xs"
                  : "text-brand-brown/60 hover:text-brand-brown"
              )}
              title="감정 빈도 랭킹 뷰"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">순위표</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('journey')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                viewMode === 'journey'
                  ? "bg-white text-brand-brown shadow-2xs"
                  : "text-brand-brown/60 hover:text-brand-brown"
              )}
              title="고민 → 회복 여정 매트릭스"
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">회복 여정</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: Interactive Word Cloud (Organic Canvas) */}
      {/* ========================================================================= */}
      {viewMode === 'cloud' && (
        <div className="relative z-10 bg-white/85 backdrop-blur-xs rounded-3xl p-6 sm:p-10 border border-brand-green/20 shadow-inner min-h-[360px] flex flex-col justify-center items-center">
          {displayKeywords.length === 0 ? (
            <div className="py-16 text-center text-brand-brown/60">
              <Cloud className="w-10 h-10 mx-auto text-brand-brown/30 mb-2" />
              <p className="text-sm">검색된 감정 키워드가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 max-w-5xl py-4">
              {displayKeywords.map((item, index) => {
                const isHealing = item.type === 'healing';
                
                // Typography sizing classes based on normalized weight
                let sizeClass = "text-sm sm:text-base px-3 py-1.5";
                let fontClass = "font-semibold";
                if (item.weight === 5) {
                  sizeClass = "text-2xl sm:text-3xl md:text-4xl px-5 sm:px-6 py-2.5 sm:py-3.5";
                  fontClass = "font-black font-serif";
                } else if (item.weight === 4) {
                  sizeClass = "text-xl sm:text-2xl md:text-3xl px-4 sm:px-5 py-2 sm:py-3";
                  fontClass = "font-bold font-serif";
                } else if (item.weight === 3) {
                  sizeClass = "text-lg sm:text-xl md:text-2xl px-3.5 sm:px-4 py-1.5 sm:py-2.5";
                  fontClass = "font-bold";
                } else if (item.weight === 2) {
                  sizeClass = "text-sm sm:text-base md:text-lg px-3 py-1.5 sm:py-2";
                  fontClass = "font-semibold";
                }

                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.35, delay: index * 0.015 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleKeywordClick(item)}
                    className={cn(
                      "group relative rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex items-center gap-2 shadow-2xs hover:shadow-md",
                      item.colorTheme.bg,
                      item.colorTheme.border,
                      item.colorTheme.text,
                      sizeClass,
                      fontClass
                    )}
                  >
                    {/* Visual icon badge for healing emotions */}
                    {isHealing && item.weight >= 4 && (
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 inline animate-pulse" />
                    )}

                    <span>{item.word}</span>

                    {/* Frequency badge */}
                    <span
                      className={cn(
                        "rounded-full text-[10px] sm:text-xs font-sans font-bold px-2 py-0.5 transition-all shadow-2xs",
                        item.colorTheme.badgeBg
                      )}
                    >
                      {item.count}회
                    </span>

                    {/* Category subtle label for top weights */}
                    {item.weight >= 4 && (
                      <span className="hidden lg:inline-block text-[10px] font-sans font-normal opacity-70">
                        · {item.koreanCategory}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Bottom helper prompt */}
          <div className="mt-8 pt-4 border-t border-brand-green/15 text-center text-xs text-brand-brown/65 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>초록/스카이 계열: <strong>치유 &amp; 회복 감정</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span>회색/톤다운 계열: <strong>극복된 호소 고민</strong></span>
            </span>
            <span className="text-brand-brown/50">
              💡 키워드를 클릭하면 임상 의미와 실제 후기 인용문을 확인하고 검색할 수 있습니다.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: Ranking Table / Frequency Bars */}
      {/* ========================================================================= */}
      {viewMode === 'ranking' && (
        <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/20 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-brand-green/15">
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-brown flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>상담 후기 감정 키워드 언급 빈도 순위 (Top {displayKeywords.length})</span>
            </h3>
            <span className="text-xs text-brand-brown/60">
              클릭 시 상세 인용문 확인 및 후기 필터링
            </span>
          </div>

          <div className="space-y-3">
            {displayKeywords.map((item, rank) => {
              const maxMentions = analysisReport.keywords[0]?.count || 1;
              const barPercent = Math.round((item.count / maxMentions) * 100);
              const isHealing = item.type === 'healing';

              return (
                <div
                  key={item.id}
                  onClick={() => handleKeywordClick(item)}
                  className="group p-3.5 rounded-2xl border border-brand-green/15 hover:border-brand-sage/60 hover:bg-brand-beige/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 sm:w-1/3 min-w-[200px]">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      rank < 3 ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-brand-beige text-brand-brown/70"
                    )}>
                      {rank + 1}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-serif text-base text-brand-brown group-hover:text-brand-sage transition-colors">
                          {item.word}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          isHealing ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-700 border border-slate-200"
                        )}>
                          {isHealing ? '치유·회복' : '극복·호소'}
                        </span>
                      </div>
                      <p className="text-xs text-brand-brown/60 truncate max-w-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 bg-brand-beige/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isHealing ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-slate-500 to-stone-400"
                        )}
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                    <div className="text-right shrink-0 w-24">
                      <span className="text-sm font-bold text-brand-brown">
                        {item.count}회
                      </span>
                      <span className="text-[11px] text-brand-brown/50 ml-1">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyKeywordToReviews(item.word);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-brand-beige/50 group-hover:bg-brand-sage group-hover:text-white text-brand-brown text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>후기 보기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: Emotion Journey Matrix (Before 고민 -> After 회복 대조) */}
      {/* ========================================================================= */}
      {viewMode === 'journey' && (
        <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/20 shadow-2xs">
          <div className="mb-6 pb-4 border-b border-brand-green/15">
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-brown flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>내담자 감정 변화 여정 (Before 호소 고민 ➡️ After 치유 회복)</span>
            </h3>
            <p className="text-xs text-brand-brown/65">
              상담을 통해 호소했던 고통스러운 감정이 어떻게 따뜻한 회복 감정으로 거듭났는지 대조해 보여드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisReport.journeyPairs.map((journey, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-brand-beige/15 border border-brand-green/20 hover:border-brand-sage/60 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-brand-brown/60">
                  <span className="font-semibold">{journey.clientName}</span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-brand-green/20">
                    심리 변화 케이스 {idx + 1}
                  </span>
                </div>

                {/* Transition Flow Badge */}
                <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-brand-green/15">
                  <div className="text-center flex-1">
                    <span className="text-[10px] text-slate-500 font-bold block mb-0.5">상담 전 호소</span>
                    <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                      {journey.beforeWord}
                    </span>
                  </div>

                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="text-center flex-1">
                    <span className="text-[10px] text-emerald-600 font-bold block mb-0.5">상담 후 회복</span>
                    <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                      {journey.afterWord}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-brand-brown/80 italic leading-relaxed pt-1">
                  "{journey.caseHeadline}"
                </p>

                <div className="pt-2 border-t border-brand-green/10 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleApplyKeywordToReviews(journey.afterWord)}
                    className="text-xs font-bold text-brand-sage hover:underline flex items-center gap-1"
                  >
                    <span>'{journey.afterWord}' 관련 후기 읽기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Emotion Keyword Detail Modal / Drawer Popover */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWord(null)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-brand-sage/30 my-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-brand-green/15 mb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1",
                        selectedWord.type === 'healing'
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      )}
                    >
                      {selectedWord.type === 'healing' ? (
                        <>
                          <Heart className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          <span>치유 &amp; 회복 정서</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-slate-600" />
                          <span>극복된 호소 고민</span>
                        </>
                      )}
                    </span>
                    <span className="text-xs text-brand-brown/60 font-medium">
                      {selectedWord.koreanCategory}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown flex items-center gap-2.5">
                    <span>"{selectedWord.word}"</span>
                    <span className="text-sm font-sans font-bold px-2.5 py-1 rounded-xl bg-brand-beige/60 text-brand-brown">
                      총 {selectedWord.count}회 언급 ({selectedWord.percentage}%)
                    </span>
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedWord(null)}
                  className="p-2 rounded-full hover:bg-brand-beige text-brand-brown/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Psychological Meaning & Definition */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-2xl bg-brand-beige/25 border border-brand-green/20">
                  <div className="text-xs font-bold text-brand-brown mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
                    <span>심리학적 해석 &amp; 임상 의미</span>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-brown/85 leading-relaxed">
                    {selectedWord.clinicalMeaning}
                  </p>
                </div>

                {/* Real Client Review Snippets */}
                <div>
                  <h4 className="text-xs font-bold text-brand-brown mb-2.5 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-rose-500" />
                    <span>실제 내담자 상담 후기 속 인용문 ({selectedWord.sampleSnippets.length}건)</span>
                  </h4>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {selectedWord.sampleSnippets.length > 0 ? (
                      selectedWord.sampleSnippets.map((snip, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-white border border-brand-green/20 text-xs text-brand-brown/80 space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[11px] text-brand-brown/50">
                            <span className="font-semibold text-brand-brown">{snip.clientName}</span>
                            <span className="bg-brand-beige/40 px-2 py-0.5 rounded-md">{snip.categoryLabel}</span>
                          </div>
                          <p className="italic leading-relaxed">
                            "{snip.snippet}"
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-brand-brown/50 italic py-2">
                        후기 본문에서 해당 키워드가 포함된 문장을 불러오는 중입니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-green/15">
                <button
                  type="button"
                  onClick={() => setSelectedWord(null)}
                  className="px-4 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/40 cursor-pointer"
                >
                  닫기
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyKeywordToReviews(selectedWord.word)}
                  className="px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>'{selectedWord.word}' 포함 후기 바로 모아보기</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
