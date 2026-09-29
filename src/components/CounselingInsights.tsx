import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Award, 
  GraduationCap, 
  ShieldCheck, 
  Heart, 
  ChevronRight, 
  X, 
  Calendar, 
  CheckCircle2, 
  User, 
  RefreshCw,
  Search,
  ExternalLink,
  PhoneCall,
  Brain,
  Activity,
  Users,
  ShieldAlert,
  Smile,
  ClipboardList,
  Filter,
  Check,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CounselingInsight } from '../types';
import ExitIntentNewsletterModal from './ExitIntentNewsletterModal';

interface CounselingInsightsProps {
  className?: string;
  limit?: number;
}

export interface TopicChip {
  id: string;
  queryParam: string;
  koreanLabel: string;
  englishLabel: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const TOPIC_CHIPS: TopicChip[] = [
  {
    id: 'all',
    queryParam: 'all',
    koreanLabel: '전체 주제',
    englishLabel: 'All Topics',
    shortDesc: '연구소의 모든 심리 칼럼 및 임상 통찰 탐색',
    icon: Sparkles,
    accentColor: 'text-brand-sage',
  },
  {
    id: 'psychology-tips',
    queryParam: '심리학 팁',
    koreanLabel: '심리학 팁',
    englishLabel: 'Psychology Tips',
    shortDesc: '거절 민감성 극복 & 인지 왜곡 교정 일상 처방',
    icon: Brain,
    accentColor: 'text-indigo-600',
  },
  {
    id: 'parenting',
    queryParam: '자녀 양육',
    koreanLabel: '자녀 양육',
    englishLabel: 'Parenting',
    shortDesc: '부모 코칭 & 아동·청소년 긍정 훈육 원칙',
    icon: Heart,
    accentColor: 'text-rose-600',
  },
  {
    id: 'stress-management',
    queryParam: '스트레스 관리',
    koreanLabel: '스트레스 관리',
    englishLabel: 'Stress Management',
    shortDesc: '직장인 번아웃 완화 & 미주신경 이완 루틴',
    icon: Activity,
    accentColor: 'text-amber-700',
  },
  {
    id: 'couples-family',
    queryParam: '부부·가족',
    koreanLabel: '부부·가족',
    englishLabel: 'Couples & Family',
    shortDesc: '정서중심치료(EFT) & 애착 손상 회복 대화',
    icon: Users,
    accentColor: 'text-orange-600',
  },
  {
    id: 'anxiety-panic',
    queryParam: '불안·공황',
    koreanLabel: '불안·공황',
    englishLabel: 'Anxiety & Panic',
    shortDesc: '공황발작 오경보 인지 & 4-4-6 복식호흡 대처법',
    icon: ShieldAlert,
    accentColor: 'text-emerald-700',
  },
  {
    id: 'self-esteem',
    queryParam: '심층치유',
    koreanLabel: '자존감·내면치유',
    englishLabel: 'Self-Esteem',
    shortDesc: '상처받은 내면아이와 화해 & 자기 자비(Self-Compassion)',
    icon: Smile,
    accentColor: 'text-purple-600',
  },
  {
    id: 'assessment',
    queryParam: '심리검사',
    koreanLabel: '심리검사',
    englishLabel: 'Assessment',
    shortDesc: 'MMPI-2 & TCI 기질 성격 정밀 평가의 가치',
    icon: ClipboardList,
    accentColor: 'text-blue-600',
  },
];

export default function CounselingInsights({ className, limit = 9 }: CounselingInsightsProps) {
  const [insights, setInsights] = useState<CounselingInsight[]>([]);
  const [allInsights, setAllInsights] = useState<CounselingInsight[]>([]);
  const [selectedChipId, setSelectedChipId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<CounselingInsight | null>(null);

  const activeChip = useMemo(() => {
    return TOPIC_CHIPS.find(c => c.id === selectedChipId) || TOPIC_CHIPS[0];
  }, [selectedChipId]);

  // Initial fetch of all insights to compute dynamic counts per topic
  useEffect(() => {
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllInsights(data);
        }
      })
      .catch(() => {});
  }, []);

  // Compute item counts per chip
  const chipCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allInsights.length };
    TOPIC_CHIPS.forEach(chip => {
      if (chip.id === 'all') return;
      const kw = chip.queryParam.toLowerCase();
      const eng = chip.englishLabel.toLowerCase();
      const count = allInsights.filter(item => {
        const cat = (item.category || '').toLowerCase();
        const tags = (item.tags || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        return cat.includes(kw) || tags.includes(kw) || tags.includes(eng) || title.includes(kw);
      }).length;
      counts[chip.id] = count;
    });
    return counts;
  }, [allInsights]);

  const fetchInsights = async (chipParam = activeChip.queryParam, search = searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (chipParam !== 'all') {
        params.append('category', chipParam);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (limit) {
        params.append('limit', String(limit));
      }

      const res = await fetch(`/api/insights?${params.toString()}`);
      if (!res.ok) {
        throw new Error('인사이트 칼럼을 불러오는 중 오류가 발생했습니다.');
      }
      const data = await res.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message || '데이터를 가져오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(activeChip.queryParam, searchTerm);
  }, [selectedChipId]);

  const handleChipSelect = (chip: TopicChip) => {
    setSelectedChipId(chip.id);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInsights(activeChip.queryParam, searchTerm);
  };

  const handleResetFilters = () => {
    setSelectedChipId('all');
    setSearchTerm('');
    fetchInsights('all', '');
  };

  // Click on card category to filter
  const handleCardCategoryClick = (e: React.MouseEvent, categoryName: string) => {
    e.stopPropagation();
    const matchedChip = TOPIC_CHIPS.find(c => 
      c.koreanLabel.includes(categoryName) || 
      categoryName.includes(c.queryParam) ||
      c.queryParam.includes(categoryName)
    );
    if (matchedChip) {
      setSelectedChipId(matchedChip.id);
    } else {
      setSelectedChipId('all');
      setSearchTerm(categoryName);
      fetchInsights('all', categoryName);
    }
  };

  return (
    <section 
      id="counseling-insights-section"
      aria-label="전문가 마음 건강 인사이트 및 주제별 칼럼"
      className={cn("py-20 sm:py-24 bg-brand-beige/30 border-t border-brand-green/20 relative", className)}
    >
      {/* Exit-Intent Newsletter Subscription Modal for Engaged Readers */}
      <ExitIntentNewsletterModal 
        targetSectionId="counseling-insights-section" 
        minReadingSeconds={10} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block: Clinical Authority & Trust */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-serif text-brand-sage uppercase tracking-wider mb-2.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Clinical Insights &amp; Wellness Columns</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span>교육학 박사의 심리학적 통찰</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            전문가가 전하는 <span className="text-brand-sage">마음 건강 인사이트</span>
          </h2>
          <p className="text-sm sm:text-base text-brand-brown/75 font-serif leading-relaxed">
            행복바람 심리상담연구소 박미경 소장(교육학 박사 · 한국상담학회 1급 슈퍼바이저)이<br className="hidden sm:inline" />
            30,000시간 이상의 심층 임상 현장에서 검증된 회복의 원리와 일상 솔루션을 전해드립니다.
          </p>
        </div>

        {/* 4 Trust Pillars Strip (Authority Validation) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-green/25 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">교육학 박사 전문성</div>
              <div className="text-[11px] text-brand-brown/70 font-serif">상담심리 전공 학술 기반</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-green/25 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-brand-sage/10 text-brand-sage flex items-center justify-center shrink-0 border border-brand-sage/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">공인 1급 수련감독자</div>
              <div className="text-[11px] text-brand-brown/70 font-serif">한국상담학회 최고 자격</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-green/25 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">총 상담 30,000+ 시간</div>
              <div className="text-[11px] text-brand-brown/70 font-serif">풍부한 치유 사례와 경험</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-brand-green/25 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-brown font-serif">100% 비의료 비밀보장</div>
              <div className="text-[11px] text-brand-brown/70 font-serif">건강보험 전산 기록 미등재</div>
            </div>
          </div>
        </div>

        {/* Filterable Category Chip Set Bar */}
        <div className="mb-8 space-y-4">
          
          {/* Top Label & Quick Reset / Search Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-sage/10 text-brand-sage flex items-center justify-center border border-brand-sage/20">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-serif font-bold text-brand-brown">
                주제별 칼럼 둘러보기 <span className="text-xs font-normal text-brand-brown/60">(Filter by Topic)</span>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {(selectedChipId !== 'all' || searchTerm.trim()) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-xl bg-white border border-brand-green/30 hover:bg-brand-beige/50 text-xs font-serif font-semibold text-brand-brown/75 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3 h-3 text-brand-sage" />
                  <span>필터 초기화</span>
                </button>
              )}

              {/* Quick Keyword Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="고민 키워드 (거절, 훈육, 호흡)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs font-serif bg-white border border-brand-green/30 focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-hidden transition-all shadow-2xs text-brand-brown placeholder:text-brand-brown/40"
                />
                <Search className="w-3.5 h-3.5 text-brand-brown/40 absolute left-2.5 top-2 pointer-events-none" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      fetchInsights(activeChip.queryParam, '');
                    }}
                    className="absolute right-2 top-2 text-brand-brown/40 hover:text-brand-brown cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Interactive Chips Wrap (Bilingual Korean & English with Icons & Live Counts) */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-white/85 backdrop-blur-xs rounded-2xl border border-brand-green/30 shadow-xs">
            {TOPIC_CHIPS.map((chip) => {
              const isSelected = selectedChipId === chip.id;
              const Icon = chip.icon;
              const count = chipCounts[chip.id];

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleChipSelect(chip)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group px-3 py-2 rounded-xl text-xs font-serif transition-all duration-200 cursor-pointer flex items-center gap-2 border select-none",
                    isSelected
                      ? "bg-brand-sage text-white border-brand-sage shadow-xs ring-2 ring-brand-sage/20"
                      : "bg-white text-brand-brown/80 border-brand-green/25 hover:border-brand-sage/40 hover:bg-brand-beige/40 shadow-2xs"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected 
                      ? "bg-white/20 text-white" 
                      : "bg-brand-beige text-brand-brown/70 group-hover:text-brand-sage group-hover:bg-brand-sage/10"
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex flex-col text-left leading-none">
                    <span className={cn(
                      "font-bold text-[12px]",
                      isSelected ? "text-white" : "text-brand-brown"
                    )}>
                      {chip.koreanLabel}
                    </span>
                    <span className={cn(
                      "text-[10px] mt-0.5",
                      isSelected ? "text-white/80" : "text-brand-brown/50"
                    )}>
                      {chip.englishLabel}
                    </span>
                  </div>

                  {typeof count === 'number' && count > 0 && (
                    <span className={cn(
                      "ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none",
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-brand-beige/80 text-brand-brown/70 group-hover:bg-brand-sage/15 group-hover:text-brand-sage"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Topic Clarification Banner */}
          <div className="px-4 py-2.5 rounded-xl bg-brand-beige/40 border border-brand-green/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-serif text-brand-brown/75">
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-brown flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-brand-sage" />
                <span>선택된 주제:</span>
              </span>
              <span className="font-bold text-brand-sage">
                {activeChip.koreanLabel} ({activeChip.englishLabel})
              </span>
              <span className="hidden sm:inline text-brand-brown/40">|</span>
              <span className="text-brand-brown/70 hidden sm:inline">
                {activeChip.shortDesc}
              </span>
            </div>

            <div className="text-[11px] text-brand-brown/60">
              총 <strong>{insights.length}편</strong>의 칼럼이 준비되어 있습니다.
            </div>
          </div>

        </div>

        {/* Content Area: Loading / Error / Empty / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-brand-green/20 p-5 space-y-4 animate-pulse shadow-sm">
                <div className="w-full h-48 bg-brand-beige/60 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-brand-beige/70 rounded w-1/3" />
                  <div className="h-6 bg-brand-beige/80 rounded w-4/5" />
                  <div className="h-4 bg-brand-beige/50 rounded w-full" />
                  <div className="h-4 bg-brand-beige/50 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-brand-green/25 max-w-md mx-auto shadow-sm">
            <p className="text-sm font-serif text-brand-brown/80 mb-4">{error}</p>
            <button
              onClick={() => fetchInsights()}
              className="px-4 py-2 bg-brand-sage text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 hover:bg-brand-sage/90 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 시도하기</span>
            </button>
          </div>
        ) : insights.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-green/20 max-w-md mx-auto shadow-xs">
            <BookOpen className="w-8 h-8 text-brand-brown/40 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-brand-brown text-base mb-1">
              해당 주제의 칼럼을 찾을 수 없습니다
            </h3>
            <p className="text-xs font-serif text-brand-brown/60 mb-4">
              '{activeChip.koreanLabel}' 관련 다른 키워드로 검색하시거나 전체 주제를 선택해 보세요.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-brand-sage text-white text-xs font-bold rounded-xl hover:bg-brand-sage/90 transition-colors cursor-pointer shadow-2xs"
            >
              전체 칼럼 둘러보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {insights.map((insight) => (
              <motion.article
                key={insight.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveArticle(insight)}
                className="bg-white rounded-3xl border border-brand-green/25 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-sage/60 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Article Thumbnail Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-beige/50">
                    <img 
                      src={insight.image_url || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800&h=500'} 
                      alt={insight.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-serif font-semibold flex items-center gap-1">
                        <span>전체 칼럼 읽기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6">
                    {/* Metadata Line with Clickable Category Tag */}
                    <div className="flex items-center gap-2 text-[11px] text-brand-brown/65 font-serif mb-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => handleCardCategoryClick(e, insight.category)}
                        className="text-brand-sage font-bold hover:underline cursor-pointer"
                        title={`${insight.category} 주제로 모아보기`}
                      >
                        {insight.category}
                      </button>
                      <span aria-hidden="true">·</span>
                      <span>{insight.read_time}</span>
                      <span aria-hidden="true">·</span>
                      <span>{insight.created_at ? insight.created_at.split(' ')[0] : '2026.09'}</span>
                    </div>

                    {/* Article Headline */}
                    <h3 className="text-lg font-serif font-bold text-brand-brown mb-3 leading-snug group-hover:text-brand-sage transition-colors line-clamp-2">
                      {insight.title}
                    </h3>

                    {/* Excerpt Summary */}
                    <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed line-clamp-3 mb-4">
                      {insight.summary}
                    </p>

                    {/* Clinical Takeaways (Bullet list with subtle checkmarks) */}
                    {insight.takeaways && insight.takeaways.length > 0 && (
                      <div className="pt-3 border-t border-brand-green/15 space-y-1.5 mb-2">
                        {insight.takeaways.slice(0, 2).map((point, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-brand-brown/80 font-serif">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Author credentials & Read prompt */}
                <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-brand-green/10 flex items-center justify-between text-xs font-serif">
                  <div className="flex items-center gap-2 text-brand-brown/70">
                    <User className="w-3.5 h-3.5 text-brand-sage" />
                    <span className="font-semibold text-brand-brown">{insight.author}</span>
                    <span className="text-[11px] text-brand-brown/50 hidden sm:inline">(교육학 박사)</span>
                  </div>

                  <span className="text-brand-sage font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>칼럼 읽기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Bottom Navigation & CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-brand-green/25 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-serif font-bold text-brand-brown flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-sage" />
              <span>더 많은 심리치료 칼럼과 내담자 회복 스토리를 확인해보세요</span>
            </h3>
            <p className="text-xs sm:text-sm text-brand-brown/70 font-serif">
              부모 양육 코칭, 부부 대화법, 성인 자존감 회복 등 카테고리별 전문 칼럼이 커뮤니티에 정기적으로 연재됩니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/community?tab=column"
              className="px-5 py-3 rounded-2xl border border-brand-green/40 hover:bg-brand-beige/50 text-brand-brown text-xs sm:text-sm font-bold font-serif transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>칼럼 전체 목록</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-sage" />
            </Link>

            <Link
              to="/reservation"
              className="px-6 py-3 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold font-serif shadow-md transition-all flex items-center gap-2 active:scale-98"
            >
              <span>박미경 소장과 1:1 상담 예약</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Quick Read Article Detail Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="insight-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-brand-green/30 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-brand-green/20 bg-brand-beige/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/70">
                  <span className="font-bold text-brand-sage">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.read_time}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArticle.created_at ? activeArticle.created_at.split(' ')[0] : '2026.09'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-full text-brand-brown/60 hover:text-brand-brown hover:bg-white transition-colors cursor-pointer"
                  aria-label="칼럼 닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Title */}
                <h2 id="insight-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown leading-tight">
                  {activeArticle.title}
                </h2>

                {/* Author Info Card */}
                <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-serif">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/images/counselor_park.jpg" 
                      alt="박미경 소장" 
                      className="w-12 h-12 rounded-xl object-cover border border-brand-green/30 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-brand-brown text-sm">
                        {activeArticle.author} <span className="text-xs text-brand-sage font-semibold">(교육학 박사)</span>
                      </div>
                      <div className="text-brand-brown/70 text-[11px]">
                        {activeArticle.author_title || '행복바람심리상담연구소 소장 · 한국상담학회 1급 수련감독자'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-brand-green/20 text-brand-brown text-[11px] font-semibold shadow-2xs">
                      총 상담 30,000+ 시간
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-brand-green/20 text-emerald-800 text-[11px] font-bold shadow-2xs">
                      100% 비의료 안심
                    </span>
                  </div>
                </div>

                {/* Article Image Banner */}
                {activeArticle.image_url && (
                  <div className="rounded-2xl overflow-hidden aspect-[16/9] max-h-72 border border-brand-green/20">
                    <img 
                      src={activeArticle.image_url} 
                      alt={activeArticle.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Key Takeaways Box */}
                {activeArticle.takeaways && activeArticle.takeaways.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 font-serif flex items-center gap-1.5 uppercase tracking-wide">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>핵심 임상 포인트 (Key Clinical Takeaways)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs font-serif text-brand-brown/85">
                      {activeArticle.takeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Article Content */}
                <div className="font-serif text-sm sm:text-base text-brand-brown/85 leading-relaxed space-y-4 whitespace-pre-line border-t border-brand-green/15 pt-5">
                  {activeArticle.content || activeArticle.summary}
                </div>

                {/* Closing Clinical Wisdom Note */}
                <div className="p-4 sm:p-5 rounded-2xl bg-brand-green/15 border border-brand-green/30 text-xs font-serif text-brand-brown/85 italic leading-relaxed">
                  "모든 마음의 상처는 온전히 수용받고 공감받을 때 스스로 회복할 수 있는 내면의 힘을 깨웁니다. 
                  혼자 견디기 벅찬 고통 속에 계시다면, 언제든 안전한 안식처가 되어 드리겠습니다."
                  <span className="block text-right mt-2 not-italic font-bold text-brand-brown">— 박미경 상담 소장 드림</span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 bg-brand-beige/40 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/70">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-sage" />
                  <span>전화 문의: <strong>052-254-0230</strong> (1:1 안심 상담)</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    to="/community?tab=column"
                    onClick={() => setActiveArticle(null)}
                    className="px-4 py-2.5 rounded-xl border border-brand-green/30 hover:bg-white text-xs font-serif font-bold text-brand-brown transition-colors cursor-pointer"
                  >
                    커뮤니티 칼럼 전체보기
                  </Link>

                  <Link
                    to="/reservation"
                    onClick={() => setActiveArticle(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-serif font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>이 주제로 1:1 상담 예약</span>
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
