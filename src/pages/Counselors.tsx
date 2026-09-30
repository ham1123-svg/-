import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Award, Sparkles, CheckCircle2, ArrowRight, ChevronDown, 
  ChevronUp, Maximize2, ShieldCheck, Clock, BookOpen, UserCheck, 
  PhoneCall, HeartHandshake, Calendar, Layers, HelpCircle, Tag, 
  Heart, Hash, FileText
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { Counselor } from '../types';
import { 
  counselorProfilesById, 
  defaultCounselorsList, 
  parkMiKyeongDetailedProfile 
} from '../data/counselorDetails';
import CounselorDetailModal, { CounselorModalTabType } from '../components/CounselorDetailModal';
import QuickReservationModal from '../components/QuickReservationModal';
import { useHighContrast } from '../context/HighContrastContext';
import { cn } from '../lib/utils';

export default function Counselors() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [counselors, setCounselors] = useState<Counselor[]>(defaultCounselorsList);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const { isHighContrast } = useHighContrast();

  // State for expanded inline section per counselor
  const [expandedCounselorIds, setExpandedCounselorIds] = useState<Record<number, boolean>>({});

  // State for interactive detail modal
  const [modalCounselor, setModalCounselor] = useState<Counselor | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<CounselorModalTabType>('overview');

  // State for quick reservation modal
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = () => {
    setLoading(true);
    fetch('/api/counselors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter to only Director Park Mi-kyeong
          const onlyDirector = data.filter((c: Counselor) => c.name.includes("박미경"));
          const targetList = onlyDirector.length > 0 ? onlyDirector : [defaultCounselorsList[0]];
          const enriched = targetList.map((c: Counselor) => {
            const matchedProfile = counselorProfilesById[c.id] || 
              counselorProfilesById[c.name] || 
              c.detailedProfile || 
              parkMiKyeongDetailedProfile;
            return {
              ...c,
              detailedProfile: matchedProfile
            };
          });
          setCounselors(enriched);
        } else {
          setCounselors(defaultCounselorsList);
        }
      })
      .catch(() => {
        // Fallback to default list with only Director Park Mi-kyeong
        setCounselors(defaultCounselorsList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openDetailModal = (counselor: Counselor, tab: CounselorModalTabType = 'about') => {
    setModalCounselor(counselor);
    setModalInitialTab(tab);
  };

  const toggleExpand = (counselorId: number) => {
    setExpandedCounselorIds(prev => ({
      ...prev,
      [counselorId]: !prev[counselorId]
    }));
  };

  const filteredCounselors = counselors.filter(c => 
    c.name.includes(searchTerm) || 
    c.tags.includes(searchTerm) || 
    c.style.includes(searchTerm) ||
    c.education.includes(searchTerm) ||
    (c.certifications && c.certifications.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-brand-beige/30 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3 border border-brand-sage/20">
            Executive Profile · 박미경 소장 프로필
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">
            상담 소장 프로필 <span className="text-brand-sage font-normal text-2xl md:text-3xl">(Executive Profile)</span>
          </h1>
          <p className="text-brand-brown/85 font-serif text-sm sm:text-base max-w-3xl mx-auto leading-relaxed break-keep text-center px-2">
            <span className="inline-block">
              <strong className="text-brand-sage font-bold">16년 동안 30,000시간이 넘도록</strong> 수많은 내담자의 아픔과 마주해 왔습니다.
            </span>{' '}
            <span className="inline-block mt-0.5 sm:mt-1">
              국가공인 및 학회 1급 자격이 증명하는 탄탄한 전문성을 바탕으로,{' '}
              <strong className="text-brand-brown font-bold">박미경 소장(대표원장)</strong>이 내담자 한 분의 상처 회복과 평온한 일상을 온 마음을 다해 이끌어드립니다.
            </span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="고민 분야(우울, 부부, 청소년, ADHD, 성인), 자격증, 상담 기법 검색"
              className="w-full px-6 py-3.5 pr-12 rounded-full border border-brand-green/40 bg-white focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-hidden shadow-xs text-sm font-serif transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="전문 분야 및 자격증 검색"
            />
            <Search className="absolute right-5 top-3.5 text-brand-sage w-5 h-5 pointer-events-none" />
          </div>
          {searchTerm && (
            <p className="text-center text-xs text-brand-brown/60 mt-2 font-serif">
              '{searchTerm}' 검색 결과 ({filteredCounselors.length}명)
            </p>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-sage"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCounselors.map((counselor) => {
              const profile = counselor.detailedProfile || 
                counselorProfilesById[counselor.id] || 
                counselorProfilesById[counselor.name] || 
                parkMiKyeongDetailedProfile;
              const isExpanded = !!expandedCounselorIds[counselor.id];

              const certList = counselor.certifications 
                ? counselor.certifications.split('\n').filter(Boolean)
                : [];
              
              const styles = counselor.style 
                ? counselor.style.split('/').map(s => s.trim()).filter(Boolean)
                : [];

              const rawTags = counselor.tags
                ? counselor.tags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean)
                : [];

              return (
                <motion.div 
                  key={counselor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => openDetailModal(counselor, 'about')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openDetailModal(counselor, 'about');
                    }
                  }}
                  aria-label={`${counselor.name} ${counselor.title} 상세 프로필 보기`}
                  className={cn(
                    "rounded-3xl overflow-hidden shadow-xl border transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:border-brand-sage/80 hover:-translate-y-0.5 relative",
                    isHighContrast 
                      ? 'bg-neutral-950 text-white border-2 border-white' 
                      : 'bg-white text-brand-brown border-brand-green/30'
                  )}
                >
                  {/* Main Profile Row: Image (Left) + Primary Summary (Right) */}
                  <div className="flex flex-col md:flex-row">
                    
                    {/* Left: Profile Image & Trust Badges */}
                    <div className="md:w-5/12 min-h-[340px] md:min-h-[460px] relative bg-brand-beige/40 group overflow-hidden shrink-0 flex flex-col justify-end">
                      <img 
                        src={counselor.image_url || '/images/counselor_park.jpg'} 
                        alt={`${counselor.name} ${counselor.title || '상담사'}`} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(counselor, 'about');
                        }}
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('counselor_park.jpg')) {
                            target.src = '/images/counselor_park.jpg';
                          }
                        }}
                      />

                      {/* Gradient overlay for badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                      
                      {/* Tags & Quick Metrics on image */}
                      <div className="relative z-10 p-5 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-white/95 text-xs font-bold">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{profile.supervisionCount || '공인 전문 자격 인증'}</span>
                        </div>

                        {/* Specialty Tags Cloud on Image */}
                        <div className="flex flex-wrap gap-1.5">
                          {rawTags.slice(0, 6).map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailModal(counselor, 'specialties');
                              }}
                              className="px-2.5 py-1 bg-white/95 hover:bg-white text-brand-brown text-xs font-semibold rounded-full shadow-xs border border-brand-green/20 transition-transform active:scale-95 cursor-pointer"
                              title="치유 기법 보기"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Primary Summary & Credentials */}
                    <div className="md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        {/* Name & Academic Title */}
                        <div className="border-b border-brand-green/20 pb-5 mb-5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                            <div className="flex items-baseline gap-2.5 flex-wrap">
                              <h2 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailModal(counselor, 'about');
                                }}
                                className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown hover:text-brand-sage transition-colors cursor-pointer"
                              >
                                {counselor.name}
                              </h2>
                              <span className="px-3 py-1 bg-brand-sage/15 text-brand-sage font-bold text-xs sm:text-sm rounded-full">
                                {counselor.title}
                              </span>
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-md flex items-center gap-1 shadow-2xs">
                                <Clock className="w-3 h-3 text-emerald-600" />
                                <span>총 상담 30,000+ 시간</span>
                              </span>
                            </div>
                          </div>

                          <p className="text-sm sm:text-base font-serif text-brand-brown/85 font-medium leading-relaxed">
                            {counselor.education}
                          </p>

                          {/* 1. 상담 철학 (Counseling Philosophy Snippet & Quick Link) */}
                          <div className="mt-3 p-3 rounded-2xl bg-brand-beige/35 border border-brand-green/25">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Heart className="w-3 h-3 text-rose-600" />
                                <span>상담 철학</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailModal(counselor, 'philosophy');
                                }}
                                className="text-[11px] font-bold text-brand-sage hover:text-brand-brown flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>철학 전문 보기</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm font-serif italic text-brand-brown/85 leading-relaxed">
                              "{profile.philosophy || profile.greeting || '상처 입은 마음에 온화한 바람이 불어오도록 온전히 동행하겠습니다.'}"
                            </p>
                          </div>
                        </div>
                        
                        {/* 2. 자격증 정보 (Certifications Section & Quick Modal Link) */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-emerald-600" />
                              <h3 className="text-xs sm:text-sm font-bold text-brand-brown tracking-wider uppercase">
                                공인 전문 자격증 정보 (Credentials)
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailModal(counselor, 'certifications');
                              }}
                              className="text-[11px] text-brand-sage hover:text-brand-brown font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>전체 자격증 보기</span>
                              <Maximize2 className="w-3 h-3" />
                            </button>
                          </div>

                          <ul className="space-y-1.5 pl-0.5">
                            {certList.slice(0, 3).map((cert, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-brown/85 font-serif leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-1" />
                                <span>{cert}</span>
                              </li>
                            ))}
                            {certList.length > 3 && (
                              <li className="text-[11px] text-brand-brown/60 pl-5 pt-0.5 font-serif">
                                외 {certList.length - 3}개 자격증 및 학회 등록 이력 (상세 보기에서 확인 가능)
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* 3. 전문 분야 태그 (Specialty Tags & Methods) */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-amber-600" />
                              <h3 className="text-xs sm:text-sm font-bold text-brand-brown tracking-wider uppercase">
                                특화 전문 분야 및 상담 스타일 (Specializations)
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailModal(counselor, 'specialties');
                              }}
                              className="text-[11px] text-amber-700 hover:text-brand-brown font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>치유 기법 보기</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="p-3.5 bg-brand-beige/25 rounded-2xl border border-brand-green/25">
                            <p className="text-xs sm:text-sm font-bold text-brand-brown mb-2 font-serif">
                              {counselor.style}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {rawTags.map((tag, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDetailModal(counselor, 'specialties');
                                  }}
                                  className="px-2.5 py-0.5 bg-white hover:bg-amber-50 text-brand-sage hover:text-amber-800 text-xs font-medium rounded-md border border-brand-sage/20 shadow-2xs transition-colors cursor-pointer"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Bar (Highlighted Modal Button + Inline Expand + Reservation CTA) */}
                      {/* Unified Clean Action Bar */}
                      <div className="pt-4 border-t border-brand-green/20">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          {/* 1. Main Profile Detail Modal Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetailModal(counselor, 'about');
                            }}
                            className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-brand-green/20 text-brand-brown border-2 border-brand-sage/60 hover:border-brand-sage transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                          >
                            <Maximize2 className="w-4 h-4 text-brand-sage" />
                            <span>프로필 상세 보기</span>
                          </button>

                          {/* 2. Direct Reservation Link */}
                          <Link 
                            to="/reservation"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-3 px-4 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-xs sm:text-sm active:scale-98 cursor-pointer"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>1:1 상담 예약하기</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          {/* 3. Inline Quick Drawer Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(counselor.id);
                            }}
                            aria-expanded={isExpanded}
                            aria-controls={`counselor-details-${counselor.id}`}
                            className="px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium bg-brand-beige/50 hover:bg-brand-beige text-brand-brown border border-brand-green/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            title={isExpanded ? '상세 정보 접기' : '이 페이지에서 바로 펼쳐보기'}
                          >
                            <span>{isExpanded ? '간략히' : '펼쳐보기'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-brand-sage" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Section (Interactive In-Place Drawer) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`counselor-details-${counselor.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className="overflow-hidden border-t border-brand-green/25 bg-brand-beige/15"
                      >
                        <div className="p-6 sm:p-8 md:p-10 space-y-8">
                          
                          {/* Top Highlight Banner: Clinical Experience & Supervisory Role */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-2xl bg-white border border-brand-green/20 text-center">
                              <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                                총 상담 시간 (Total Consultation Hours)
                              </span>
                              <strong className="text-lg sm:text-xl font-bold text-brand-sage font-mono">
                                {profile.clinicalHours || '30,000+ 시간'}
                              </strong>
                              <p className="text-[11px] text-brand-brown/60 mt-0.5">
                                단순 연수(16년 등) 표기 대신 실제 1:1 심층 상담 시간 기준
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-brand-green/20 text-center">
                              <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                                학술 배경
                              </span>
                              <strong className="text-base sm:text-lg font-bold text-brand-brown font-serif">
                                {counselor.education.split('(')[0].trim()}
                              </strong>
                              <p className="text-[11px] text-brand-brown/60 mt-0.5">
                                {counselor.education.includes('(') ? counselor.education.split('(')[1].replace(')', '') : '상담심리학 전공'}
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-brand-green/20 text-center">
                              <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                                전문 자격 등급
                              </span>
                              <strong className="text-base sm:text-lg font-bold text-brand-sage font-serif">
                                {profile.supervisionCount || '공인 1급 전문 상담'}
                              </strong>
                              <p className="text-[11px] text-brand-brown/60 mt-0.5">
                                국가공인 및 공인학회 자격
                              </p>
                            </div>
                          </div>

                          {/* 전문 임상 영역 카드 */}
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-brand-sage" />
                              <h4 className="text-sm font-bold text-brand-brown font-serif">
                                주요 전문 임상 영역 및 치료 기법
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {(profile.specialties || []).map((spec, sIdx) => (
                                <div 
                                  key={sIdx}
                                  className="p-4 rounded-2xl bg-white border border-brand-green/25 hover:border-brand-sage/40 transition-colors shadow-2xs"
                                >
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-5 h-5 rounded-md bg-brand-sage/15 text-brand-sage text-[11px] font-bold flex items-center justify-center shrink-0">
                                      0{sIdx + 1}
                                    </span>
                                    <h5 className="text-xs sm:text-sm font-bold text-brand-brown font-serif">
                                      {spec.title}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-brand-brown/75 leading-relaxed font-serif pl-7 mb-2.5">
                                    {spec.description}
                                  </p>
                                  <div className="pl-7 flex flex-wrap gap-1.5">
                                    {spec.methods.map((method, mIdx) => (
                                      <span 
                                        key={mIdx}
                                        className="text-[10px] px-2 py-0.5 rounded bg-brand-green/25 text-brand-sage font-semibold"
                                      >
                                        {method}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 상담 진행 4단계 로드맵 미리보기 */}
                          <div className="p-5 rounded-2xl bg-white border border-brand-green/25">
                            <h4 className="text-xs sm:text-sm font-bold text-brand-brown font-serif flex items-center gap-2 mb-3">
                              <Layers className="w-4 h-4 text-brand-sage" />
                              <span>{counselor.name} 상담사의 상담 세션 진행 원칙</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-serif">
                              {(profile.sessionProcedure || [
                                { step: "01", title: "경청과 공감", desc: "호소 문제의 고통을 있는 그대로 온전히 경청하고 라포를 형성합니다." },
                                { step: "02", title: "객관적 평가", desc: "필요 시 심리검사(MMPI, TCI)를 통해 심리 구조를 정밀 분석합니다." },
                                { step: "03", title: "맞춤 치유 작업", desc: "인지·정서 조절 기법과 관계 훈련으로 구체적인 변화를 이끌어냅니다." },
                                { step: "04", title: "자립과 종결", desc: "스스로의 힘으로 일상을 온전히 회복할 수 있도록 내면의 힘을 확립합니다." }
                              ]).map((proc, pIdx) => (
                                <div key={pIdx} className="p-3 rounded-xl bg-brand-beige/25 border border-brand-green/20">
                                  <span className="text-[10px] font-bold text-brand-sage font-mono block mb-1">
                                    STEP {proc.step}
                                  </span>
                                  <strong className="block text-brand-brown mb-1 font-serif">
                                    {proc.title}
                                  </strong>
                                  <p className="text-brand-brown/70 text-[11px] leading-relaxed">
                                    {proc.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer Actions inside Drawer */}
                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-brand-green/20">
                            <span className="text-xs text-brand-brown/70 flex items-center gap-1.5 font-serif">
                              <ShieldCheck className="w-4 h-4 text-brand-sage" />
                              <span>모든 상담은 철저한 비밀보장 원칙에 따라 1:1 사전 예약제로 운영됩니다.</span>
                            </span>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Link
                                to="/reservation"
                                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>1:1 예약하기</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleExpand(counselor.id)}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-brand-beige text-xs font-semibold text-brand-brown border border-brand-green/30 transition-colors cursor-pointer"
                              >
                                접기
                              </button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* No Results Empty State */}
        {filteredCounselors.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-brand-green/20 shadow-sm">
            <p className="text-brand-brown/50 text-base font-serif mb-3">
              '{searchTerm}'에 대한 검색 결과가 없습니다.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold cursor-pointer"
            >
              검색어 초기화
            </button>
          </div>
        )}

        {/* Bottom Counseling Quality Assurance Banner */}
        <div className="mt-16 rounded-3xl p-6 sm:p-8 bg-brand-beige/50 border border-brand-green/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-brand-sage text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Professional Standards</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-brown">
              전문 상담사와의 1:1 비밀보장 세션 신청
            </h3>
            <p className="text-xs sm:text-sm font-serif text-brand-brown/75 max-w-xl leading-relaxed">
              사전 예약 시 원하시는 상담 일정과 고민 유형을 남겨주시면, 전문 상담사가 직접 확인 후 편안하게 안내해 드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsQuickModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-brand-green/20 text-brand-brown border border-brand-green/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <PhoneCall className="w-4 h-4 text-brand-sage" />
              <span>간편 전화상담(콜백) 신청</span>
            </button>

            <Link
              to="/reservation"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>온라인 상담 예약하기</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Interactive Counselor Detail Modal */}
      <CounselorDetailModal
        counselor={modalCounselor}
        isOpen={!!modalCounselor}
        initialTab={modalInitialTab}
        onClose={() => setModalCounselor(null)}
        onOpenQuickReservation={() => {
          setModalCounselor(null);
          setIsQuickModalOpen(true);
        }}
      />

      {/* Quick Reservation Callback Modal */}
      <QuickReservationModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
      />
    </div>
  );
}
