import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Quote, 
  ChevronRight, 
  Calendar, 
  Tag, 
  MessageSquareHeart, 
  X, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  User, 
  Check, 
  Award, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Testimonial } from '../types';
import { testimonialService } from '../services/testimonialService';
import ClientReviewWriteModal from './ClientReviewWriteModal';
import PostCommentSection from './PostCommentSection';

interface AnonymousReviewBoardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  initialCategory?: string;
  initialSearchTerm?: string;
}

type SortOption = 'likes' | 'latest' | 'rating';
type ViewMode = 'cards' | 'table';

// Symptom and experience preset keywords for quick 1-click filtering
export const PRESET_SEARCH_KEYWORDS = [
  { label: '🔥 직장인 번아웃', query: '번아웃' },
  { label: '😰 발표불안 · 공황', query: '불안' },
  { label: '🧸 아동 놀이 · 분리불안', query: '분리불안' },
  { label: '💔 부부 갈등 · 대화단절', query: '부부' },
  { label: '🌱 자존감 · 완벽주의', query: '자존감' },
  { label: '🌙 불면 · 수면장애', query: '수면' },
  { label: '🌧️ 우울 · 무기력', query: '우울' },
  { label: '🏫 등교거부 · 학업스트레스', query: '학업' },
  { label: '⚡ 충동조절 · 떼쓰기', query: '충동' },
];

// Keyword Highlighter Helper
function highlightMatch(text: string | undefined | null, query: string) {
  if (!text) return null;
  if (!query || !query.trim()) return text;

  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.replace(/^[#@]/, ''))
    .filter(t => t.length > 0);

  if (tokens.length === 0) return text;

  try {
    const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200/90 text-amber-950 font-bold px-0.5 rounded-sm">
          {part}
        </mark>
      ) : (
        part
      )
    );
  } catch {
    return text;
  }
}

const CATEGORIES = [
  { id: 'all', label: '전체 후기' },
  { id: 'child', label: '아동 심리 · 놀이/발달' },
  { id: 'youth', label: '청소년 · 학업/사춘기' },
  { id: 'adult', label: '성인 심리 · 번아웃' },
  { id: 'couple', label: '부부 갈등 · 가족' },
  { id: 'anxiety', label: '불안 · 공황 · 우울' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  child: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  youth: { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  adult: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  couple: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  anxiety: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
};

export default function AnonymousReviewBoard({
  title = "내담자 익명 상담 후기 게시판",
  subtitle = "행복바람에서 마음의 평온을 되찾은 내담자들이 직접 남겨주신 솔직한 치유와 회복의 기록입니다.",
  className = "",
  initialCategory = "all",
  initialSearchTerm = ""
}: AnonymousReviewBoardProps) {
  // Data state
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [searchInputVal, setSearchInputVal] = useState<string>(initialSearchTerm);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Modals & User interaction
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Testimonial | null>(null);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('hbbr_liked_reviews');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Fetch reviews
  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getTestimonials(false);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync initialSearchTerm when changed from parent
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
      setSearchInputVal(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  useEffect(() => {
    loadReviews();
    const unsubscribe = testimonialService.subscribe(() => {
      loadReviews();
    });
    return unsubscribe;
  }, [loadReviews]);

  // Handle Like / Empathy Click
  const handleLike = async (e: React.MouseEvent, reviewId: string) => {
    e.stopPropagation();
    if (likedReviews.has(reviewId)) {
      showToast("이미 공감을 누르신 후기입니다 💛");
      return;
    }

    // Optimistic update
    const newLiked = new Set(likedReviews);
    newLiked.add(reviewId);
    setLikedReviews(newLiked);
    try {
      localStorage.setItem('hbbr_liked_reviews', JSON.stringify(Array.from(newLiked)));
    } catch {}

    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, recommendCount: (r.recommendCount || 0) + 1 } : r));
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => prev ? { ...prev, recommendCount: (prev.recommendCount || 0) + 1 } : null);
    }

    showToast("소중한 후기에 따뜻한 공감을 전했습니다!");
    await testimonialService.likeReview(reviewId);
  };

  // Filter and Sort Logic
  const filteredAndSortedReviews = useMemo(() => {
    let result = reviews.filter(r => r.status === 'approved' || !r.status);

    // Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(r => r.category === activeCategory);
    }

    // Tag Filter
    if (selectedTag) {
      result = result.filter(r => r.tags && r.tags.includes(selectedTag));
    }

    // Search Filter with Multi-token Support (상담 경험, 증상, 제목, 본문, 태그 등 종합 검색)
    if (searchTerm.trim()) {
      const tokens = searchTerm
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(t => t.replace(/^[#@]/, ''))
        .filter(Boolean);

      if (tokens.length > 0) {
        result = result.filter(r => {
          const searchableFields = [
            r.headline || '',
            r.story || '',
            r.beforeState || '', // 고민 증상
            r.afterState || '',  // 상담 경험 및 회복
            r.counselorInsight || '',
            r.clientName || '',
            r.ageGroupAndRole || '',
            r.programTaken || '',
            r.categoryLabel || '',
            r.category || '',
            (r.tags || []).join(' ')
          ].map(s => s.toLowerCase());

          const fullSearchText = searchableFields.join(' ');
          return tokens.every(token => fullSearchText.includes(token));
        });
      }
    }

    // Sort
    result.sort((a, b) => {
      if (a.isBest && !b.isBest) return -1;
      if (!a.isBest && b.isBest) return 1;

      if (sortBy === 'likes') {
        const countA = a.recommendCount || 0;
        const countB = b.recommendCount || 0;
        return countB - countA;
      } else if (sortBy === 'latest') {
        const dateA = a.created_at || a.date || '';
        const dateB = b.created_at || b.date || '';
        return dateB.localeCompare(dateA);
      } else if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      }
      return 0;
    });

    return result;
  }, [reviews, activeCategory, selectedTag, searchTerm, sortBy]);

  // Tag list for quick exploration
  const popularTags = useMemo(() => {
    const map = new Map<string, number>();
    reviews.forEach(r => {
      if (r.tags && Array.isArray(r.tags)) {
        r.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1));
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(entry => entry[0]);
  }, [reviews]);

  const displayedReviews = filteredAndSortedReviews.slice(0, visibleCount);

  return (
    <section 
      id="anonymous-review-board-container" 
      className={cn("py-20 sm:py-24 bg-brand-beige/25 border-t border-brand-green/20 relative", className)}
      aria-label="내담자 익명 상담 후기 게시판"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-brand-brown text-white text-xs sm:text-sm font-semibold shadow-xl border border-brand-green/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-brand-green" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-brand-green/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/35 text-brand-sage text-xs font-bold mb-3 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
              <span>100% 안심 익명 보장</span>
              <span className="text-brand-brown/30" aria-hidden="true">·</span>
              <span className="text-brand-brown/80 font-normal">개인식별정보 철저 비식별화</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-brown tracking-tight">
              {title}
            </h2>
            <p className="text-brand-brown/70 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Right Header: Write Button & Statistics Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Quick Stats Pill */}
            <div className="px-4 py-2 bg-white/90 rounded-2xl border border-brand-green/25 text-xs text-brand-brown shadow-2xs flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                <span className="font-extrabold ml-1 text-brand-brown text-xs">4.98</span>
              </div>
              <span className="text-brand-green/40">|</span>
              <div className="text-[11px] text-brand-brown/75">
                누적 후기 <strong className="text-brand-sage font-bold">{reviews.length}건</strong>
              </div>
              <span className="text-brand-green/40">|</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                추천율 98.6%
              </span>
            </div>

            {/* Write Review Button */}
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>익명 후기 남기기</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-brand-green/20 shadow-sm mb-8 space-y-5">
          
          {/* Main Search Input Box with clear & search button */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <label htmlFor="review-search-input" className="text-xs sm:text-sm font-serif font-bold text-brand-brown flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-sage shrink-0" />
                <span>키워드로 상담 경험 및 증상 검색</span>
              </label>
              <span className="text-[11px] text-brand-brown/60">
                고민 증상(불안, 번아웃 등), 상담 경험(놀이치료, 자존감 등), 프로그램 통합 검색
              </span>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setSearchTerm(searchInputVal.trim());
                setVisibleCount(6);
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  id="review-search-input"
                  type="text"
                  placeholder="고민 증상이나 상담 경험을 입력해보세요 (예: 번아웃, 발표불안, 불면, 아동 놀이치료, 부부갈등, 자존감)"
                  value={searchInputVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchInputVal(val);
                    setSearchTerm(val.trim());
                    setVisibleCount(6);
                  }}
                  className="w-full pl-10 pr-9 py-3 rounded-2xl bg-brand-beige/20 border border-brand-green/30 text-xs sm:text-sm text-brand-brown placeholder:text-brand-brown/40 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 transition-all shadow-2xs"
                />
                <Search className="w-4 h-4 text-brand-brown/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchInputVal && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInputVal('');
                      setSearchTerm('');
                      setVisibleCount(6);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 hover:text-brand-brown p-1 rounded-full cursor-pointer"
                    title="검색어 지우기"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>검색</span>
              </button>
            </form>

            {/* Quick Preset Keywords (1-Click Symptom & Experience Filters) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] font-bold text-brand-brown/60 shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>자주 찾는 증상 &amp; 경험:</span>
              </span>
              {PRESET_SEARCH_KEYWORDS.map((item) => {
                const isSelected = searchTerm === item.query || searchInputVal === item.query;
                return (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSearchInputVal('');
                        setSearchTerm('');
                      } else {
                        setSearchInputVal(item.query);
                        setSearchTerm(item.query);
                        setVisibleCount(6);
                      }
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                      isSelected
                        ? "bg-brand-sage text-white font-bold shadow-2xs ring-2 ring-brand-sage/30"
                        : "bg-brand-beige/35 hover:bg-brand-beige text-brand-brown/75 border border-brand-green/20"
                    )}
                  >
                    <span>{item.label}</span>
                    {isSelected && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle Row: Category Tabs + Sort Dropdown & View Mode */}
          <div className="pt-4 border-t border-brand-green/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                const count = cat.id === 'all' 
                  ? reviews.length 
                  : reviews.filter(r => r.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setVisibleCount(6);
                    }}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                      isActive
                        ? "bg-brand-brown text-white shadow-xs"
                        : "bg-brand-beige/30 hover:bg-brand-beige/60 text-brand-brown/80 border border-brand-green/20"
                    )}
                  >
                    <span>{cat.label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      isActive ? "bg-white/20 text-white" : "bg-brand-brown/10 text-brand-brown/60"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Sort & View Mode */}
            <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-brand-beige/25 p-1 rounded-xl border border-brand-green/20 text-xs">
                {(['likes', 'latest', 'rating'] as SortOption[]).map(sort => {
                  const labels: Record<SortOption, string> = {
                    likes: '공감순',
                    latest: '최신순',
                    rating: '평점순'
                  };
                  const isSelected = sortBy === sort;
                  return (
                    <button
                      key={sort}
                      type="button"
                      onClick={() => setSortBy(sort)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px]",
                        isSelected ? "bg-white text-brand-brown shadow-2xs font-extrabold" : "text-brand-brown/60 hover:text-brand-brown"
                      )}
                    >
                      {labels[sort]}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center bg-brand-beige/25 p-1 rounded-xl border border-brand-green/20 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  title="카드 뷰로 보기"
                  className={cn(
                    "p-1.5 rounded-lg transition-all cursor-pointer",
                    viewMode === 'cards' ? "bg-white text-brand-sage shadow-2xs" : "text-brand-brown/50 hover:text-brand-brown"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  title="게시판 목록 뷰로 보기"
                  className={cn(
                    "p-1.5 rounded-lg transition-all cursor-pointer",
                    viewMode === 'table' ? "bg-white text-brand-sage shadow-2xs" : "text-brand-brown/50 hover:text-brand-brown"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Popular Tags & Tag Filters */}
          <div className="pt-3 border-t border-brand-green/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <span className="text-[11px] font-semibold text-brand-brown/50 shrink-0 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                추천 태그:
              </span>
              {popularTags.map(tag => {
                const isTagActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(isTagActive ? null : tag);
                      setVisibleCount(6);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer",
                      isTagActive
                        ? "bg-brand-sage text-white font-bold shadow-2xs"
                        : "bg-brand-beige/25 text-brand-brown/70 hover:bg-brand-beige/50 border border-brand-green/20"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="text-[11px] text-rose-600 hover:underline px-1.5 py-0.5 shrink-0 font-medium cursor-pointer"
                >
                  태그 초기화 ✕
                </button>
              )}
            </div>
          </div>

          {/* Active Filter & Match Summary Bar */}
          {(searchTerm.trim() || selectedTag || activeCategory !== 'all') && (
            <div className="pt-3 border-t border-brand-green/15 flex flex-wrap items-center justify-between gap-3 bg-brand-sage/5 p-3 rounded-2xl border border-brand-sage/20 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-brand-brown flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-brand-sage" />
                  <span>적용된 필터:</span>
                </span>
                
                {searchTerm.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                    <span>키워드: "{searchTerm}"</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInputVal('');
                        setSearchTerm('');
                      }}
                      className="hover:text-amber-700 cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-beige text-brand-brown font-semibold text-xs border border-brand-green/30">
                    <span>분야: {CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('all')}
                      className="hover:text-brand-sage cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-green/30 text-brand-brown font-semibold text-xs border border-brand-green/40">
                    <span>태그: {selectedTag}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedTag(null)}
                      className="hover:text-brand-sage cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-brand-brown/70 font-medium">
                  일치하는 후기 <strong className="text-brand-sage font-bold">{filteredAndSortedReviews.length}</strong>건
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInputVal('');
                    setSearchTerm('');
                    setActiveCategory('all');
                    setSelectedTag(null);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>필터 전체 초기화</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Content Area */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-brand-sage border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brand-brown/60">소중한 익명 후기를 불러오는 중입니다...</p>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-brand-green/20 shadow-xs max-w-xl mx-auto my-6">
            <Quote className="w-10 h-10 text-brand-brown/25 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-brand-brown mb-1.5">
              {searchTerm.trim() ? `"${searchTerm}"에 일치하는 상담 후기를 찾지 못했습니다` : '조건에 일치하는 후기를 찾지 못했습니다'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-brown/65 mb-6 leading-relaxed max-w-md mx-auto">
              입력하신 키워드(증상이나 상담 경험)의 철자를 확인하시거나, 아래의 자주 찾는 추천 키워드를 클릭해보세요.
            </p>

            {/* Recommended Keywords to try */}
            <div className="mb-6 p-4 rounded-2xl bg-brand-beige/25 border border-brand-green/15 text-left">
              <span className="text-[11px] font-bold text-brand-brown/70 block mb-2">
                💡 추천 검색 키워드 바로가기:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['번아웃', '불안', '자존감', '부부', '놀이치료', '수면', '우울'].map(kw => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setSearchInputVal(kw);
                      setSearchTerm(kw);
                      setActiveCategory('all');
                      setSelectedTag(null);
                      setVisibleCount(6);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-brand-green/30 text-brand-brown/80 text-xs font-semibold hover:border-brand-sage hover:text-brand-sage cursor-pointer transition-colors"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSearchInputVal('');
                  setSearchTerm('');
                  setActiveCategory('all');
                  setSelectedTag(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-brand-beige/40 text-brand-brown text-xs font-bold hover:bg-brand-beige/70 border border-brand-green/25 cursor-pointer transition-colors"
              >
                검색 및 필터 초기화
              </button>
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-xs cursor-pointer transition-colors"
              >
                직접 익명 후기 작성하기
              </button>
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          /* 1. Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review) => {
              const catColor = CATEGORY_COLORS[review.category] || { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
              const isLiked = likedReviews.has(review.id);

              const searchTokens = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
              const isSymptomMatched = searchTokens.length > 0 && !!review.beforeState && searchTokens.some(t => review.beforeState.toLowerCase().includes(t));
              const isRecoveryMatched = searchTokens.length > 0 && !!review.afterState && searchTokens.some(t => review.afterState.toLowerCase().includes(t));

              return (
                <motion.article
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 border border-brand-green/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Bar: Anonymous Client Profile & Category */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-brand-green/15">
                      <div className="flex items-center gap-2.5">
                        {/* Initial Avatar */}
                        <div className="w-8 h-8 rounded-full bg-brand-sage/15 text-brand-sage flex items-center justify-center font-serif font-extrabold text-xs shadow-2xs">
                          {review.initial || '익명'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                            <span>{review.clientName}</span>
                            {review.isBest && (
                              <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 font-bold text-[9px] rounded-full shadow-2xs">
                                BEST
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-brand-brown/60">
                            {review.ageGroupAndRole}
                          </div>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        catColor.bg, catColor.text, catColor.border
                      )}>
                        {review.categoryLabel?.split('·')[0]?.trim() || review.category}
                      </span>
                    </div>

                    {/* Rating & Program Completed */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-3.5 h-3.5 stroke-none",
                              i < (review.rating || 5) ? "fill-amber-400" : "fill-gray-200"
                            )} 
                          />
                        ))}
                        <span className="text-xs font-bold text-brand-brown ml-1">
                          {review.rating || 5}.0
                        </span>
                      </div>
                      <span className="text-[11px] text-brand-brown/60 font-medium">
                        {review.programTaken}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 
                      onClick={() => setSelectedReview(review)}
                      className="text-sm font-serif font-bold text-brand-brown mb-2.5 leading-snug hover:text-brand-sage transition-colors cursor-pointer line-clamp-2"
                    >
                      {highlightMatch(review.headline, searchTerm)}
                    </h3>

                    {/* Excerpt Story */}
                    <p 
                      onClick={() => setSelectedReview(review)}
                      className="text-xs text-brand-brown/75 leading-relaxed line-clamp-3 mb-4 cursor-pointer hover:opacity-90"
                    >
                      {highlightMatch(review.story, searchTerm)}
                    </p>

                    {/* Before & After Mini Chips */}
                    {(review.beforeState || review.afterState) && (
                      <div className="p-3 bg-brand-beige/20 rounded-2xl border border-brand-green/15 text-[11px] space-y-1.5 mb-4">
                        {review.beforeState && (
                          <div className="flex items-start gap-1.5">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded font-bold shrink-0 text-[10px] flex items-center gap-0.5",
                              isSymptomMatched ? "bg-rose-200 text-rose-950 font-extrabold ring-1 ring-rose-400" : "bg-rose-100 text-rose-800"
                            )}>
                              <span>상담 전</span>
                              {isSymptomMatched && <span className="text-[9px] text-rose-900 ml-0.5 font-bold">· 증상일치</span>}
                            </span>
                            <span className="text-brand-brown/85 truncate text-[11px]">
                              {highlightMatch(review.beforeState, searchTerm)}
                            </span>
                          </div>
                        )}
                        {review.afterState && (
                          <div className="flex items-start gap-1.5">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded font-bold shrink-0 text-[10px] flex items-center gap-0.5",
                              isRecoveryMatched ? "bg-emerald-200 text-emerald-950 font-extrabold ring-1 ring-emerald-400" : "bg-emerald-100 text-emerald-800"
                            )}>
                              <span>상담 후</span>
                              {isRecoveryMatched && <span className="text-[9px] text-emerald-900 ml-0.5 font-bold">· 경험일치</span>}
                            </span>
                            <span className="text-brand-brown/90 font-medium truncate text-[11px]">
                              {highlightMatch(review.afterState, searchTerm)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags List */}
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {review.tags.slice(0, 3).map((tag, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white border border-brand-green/20 text-brand-brown/70 hover:text-brand-sage hover:border-brand-sage text-[10px] transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Bar: Empathy Button + Read Detail */}
                  <div className="pt-3 border-t border-brand-green/15 flex items-center justify-between text-xs">
                    {/* Empathy / Like Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleLike(e, review.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs font-semibold",
                        isLiked
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-brand-beige/30 hover:bg-rose-50 hover:text-rose-600 text-brand-brown/70 border border-brand-green/20"
                      )}
                      title="소중한 후기에 공감하기"
                    >
                      <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-rose-500 text-rose-500")} />
                      <span>공감 {review.recommendCount || 0}</span>
                    </button>

                    {/* Read More Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedReview(review)}
                      className="text-xs font-bold text-brand-sage hover:text-brand-brown flex items-center gap-0.5 group/btn cursor-pointer py-1"
                    >
                      <span>전문 읽기</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          /* 2. Board List / Table View (전통 게시판 목록형) */
          <div className="bg-white rounded-3xl border border-brand-green/20 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-beige/40 text-brand-brown/70 border-b border-brand-green/20 text-[11px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4 w-14 text-center">번호</th>
                    <th className="py-3.5 px-3 w-28">상담 분야</th>
                    <th className="py-3.5 px-4">후기 제목 및 핵심 요약</th>
                    <th className="py-3.5 px-3 w-32">작성자</th>
                    <th className="py-3.5 px-3 w-24 text-center">만족도</th>
                    <th className="py-3.5 px-3 w-20 text-center">공감</th>
                    <th className="py-3.5 px-4 w-24 text-right">작성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-green/10">
                  {displayedReviews.map((review, idx) => {
                    const catColor = CATEGORY_COLORS[review.category] || { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
                    const isLiked = likedReviews.has(review.id);

                    return (
                      <tr 
                        key={review.id}
                        onClick={() => setSelectedReview(review)}
                        className="hover:bg-brand-beige/20 transition-colors cursor-pointer group"
                      >
                        {/* Number */}
                        <td className="py-3.5 px-4 text-center text-brand-brown/50 font-mono text-[11px]">
                          {review.isBest ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-[9px]">
                              BEST
                            </span>
                          ) : (
                            filteredAndSortedReviews.length - idx
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            catColor.bg, catColor.text, catColor.border
                          )}>
                            {review.categoryLabel?.split('·')[0]?.trim() || review.category}
                          </span>
                        </td>

                        {/* Title & Preview */}
                        <td className="py-3.5 px-4">
                          <div className="font-serif font-bold text-brand-brown group-hover:text-brand-sage transition-colors line-clamp-1">
                            {highlightMatch(review.headline, searchTerm)}
                          </div>
                          <div className="text-[11px] text-brand-brown/60 line-clamp-1 mt-0.5">
                            {highlightMatch(review.story, searchTerm)}
                          </div>
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              {review.tags.slice(0, 2).map((t, i) => (
                                <span key={i} className="text-[10px] text-brand-sage/80 bg-brand-green/20 px-1.5 py-0.2 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Client Anonymous Name */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-brand-brown">{review.clientName}</div>
                          <div className="text-[10px] text-brand-brown/50 truncate">{review.ageGroupAndRole}</div>
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex items-center text-amber-500 gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                            <span className="font-bold text-brand-brown text-xs">{review.rating || 5}.0</span>
                          </div>
                        </td>

                        {/* Likes */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => handleLike(e, review.id)}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
                              isLiked ? "text-rose-600 bg-rose-50" : "text-brand-brown/60 hover:text-rose-600 hover:bg-rose-50"
                            )}
                          >
                            <Heart className={cn("w-3 h-3", isLiked && "fill-rose-500 text-rose-500")} />
                            <span>{review.recommendCount || 0}</span>
                          </button>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-right text-brand-brown/50 text-[11px] font-mono">
                          {review.date || '2026.09'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedReviews.length > visibleCount && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-brand-beige/40 text-brand-brown font-bold text-xs sm:text-sm border border-brand-green/30 transition-all shadow-xs hover:shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>후기 더보기 ({visibleCount} / {filteredAndSortedReviews.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Ethics & Privacy Assurance Banner */}
        <div className="mt-12 bg-white/80 rounded-2xl p-4 sm:p-5 border border-brand-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-brown/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-brand-sage shrink-0" />
            <span>
              <strong>100% 비밀보장 윤리원칙:</strong> 본 후기 게시판의 모든 글은 내담자의 권익과 사생활 보호를 위해 성명 및 개인식별정보가 철저히 가명화/비식별 처리되어 안전하게 게시됩니다.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="text-xs font-bold text-brand-sage hover:text-brand-brown underline shrink-0 cursor-pointer text-left sm:text-right"
          >
            내담자 후기 작성 가이드 보기 →
          </button>
        </div>

      </div>

      {/* Review Write Modal */}
      <ClientReviewWriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={() => {
          setIsWriteModalOpen(false);
          loadReviews();
          showToast("소중한 후기가 안전하게 접수되었습니다. 검토 후 안전하게 게시됩니다.");
        }}
      />

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-brand-green/20 shadow-2xl relative max-h-[90vh] overflow-y-auto my-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-brand-beige/50 text-brand-brown/60 hover:text-brand-brown transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-green/15 pr-10">
                <div className="w-12 h-12 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center font-serif font-extrabold text-base shadow-2xs">
                  {selectedReview.initial || '익명'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif font-bold text-brand-brown">
                      {selectedReview.clientName}
                    </h3>
                    {selectedReview.isBest && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px]">
                        BEST 후기
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-brown/60 mt-0.5">
                    {selectedReview.ageGroupAndRole} · {selectedReview.programTaken}
                  </p>
                </div>
              </div>

              {/* Category, Rating, Date Pill Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-brand-beige/25 rounded-2xl border border-brand-green/15 text-xs mb-5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-sage text-white text-[10px] font-bold">
                    {selectedReview.categoryLabel || selectedReview.category}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    ))}
                    <span className="font-extrabold text-brand-brown ml-1 text-xs">{selectedReview.rating || 5}.0</span>
                  </div>
                </div>
                <span className="text-[11px] text-brand-brown/60 font-mono">
                  상담 기간: {selectedReview.period || selectedReview.date}
                </span>
              </div>

              {/* Headline */}
              <div className="mb-4">
                <h4 className="text-base sm:text-lg font-serif font-bold text-brand-brown leading-snug">
                  {highlightMatch(selectedReview.headline, searchTerm)}
                </h4>
              </div>

              {/* Full Review Story */}
              <div className="mb-6">
                <p className="text-xs sm:text-sm text-brand-brown/85 leading-relaxed whitespace-pre-line font-serif">
                  {highlightMatch(selectedReview.story, searchTerm)}
                </p>
              </div>

              {/* Before & After Structured Boxes */}
              {(selectedReview.beforeState || selectedReview.afterState) && (
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {selectedReview.beforeState && (
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full mb-1.5 inline-block">
                        상담 전 겪으신 어려움 및 증상
                      </span>
                      <p className="text-xs text-brand-brown/90 leading-relaxed font-serif">
                        {highlightMatch(selectedReview.beforeState, searchTerm)}
                      </p>
                    </div>
                  )}

                  {selectedReview.afterState && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mb-1.5 inline-block">
                        상담 후 변화와 회복 경험
                      </span>
                      <p className="text-xs text-brand-brown/90 leading-relaxed font-serif">
                        {highlightMatch(selectedReview.afterState, searchTerm)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Counselor Insight (박미경 소장의 임상 코멘트) */}
              {selectedReview.counselorInsight && (
                <div className="p-4 rounded-2xl bg-brand-green/20 border border-brand-sage/40 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-brown mb-1.5">
                    <Quote className="w-3.5 h-3.5 text-brand-sage" />
                    <span>박미경 소장의 전문 임상 코멘트</span>
                  </div>
                  <p className="text-xs text-brand-brown/85 leading-relaxed font-serif italic">
                    "{highlightMatch(selectedReview.counselorInsight, searchTerm)}"
                  </p>
                </div>
              )}

              {/* Tags */}
              {selectedReview.tags && selectedReview.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {selectedReview.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-brand-beige/40 border border-brand-green/20 text-brand-brown/80 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Other Clients Encouragement & Empathy Comments Section */}
              <PostCommentSection
                postId={selectedReview.id}
                postTitle={selectedReview.headline}
                postAuthorName={selectedReview.clientName || '익명의 내담자'}
                postCategory={selectedReview.categoryLabel || selectedReview.category}
              />

              {/* Modal Footer */}
              <div className="pt-4 border-t border-brand-green/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => handleLike(e, selectedReview.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    likedReviews.has(selectedReview.id)
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-brand-sage/10 text-brand-sage hover:bg-rose-50 hover:text-rose-600 border border-brand-sage/30"
                  )}
                >
                  <Heart className={cn("w-4 h-4", likedReviews.has(selectedReview.id) && "fill-rose-500 text-rose-500")} />
                  <span>이 후기가 도움이 되었어요 ({selectedReview.recommendCount || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl bg-brand-brown text-white text-xs font-bold hover:bg-brand-brown/90 transition-all cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
