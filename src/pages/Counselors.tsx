import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Award, Sparkles, CheckCircle2, ArrowRight, ChevronDown, 
  ChevronUp, Maximize2, ShieldCheck, Clock, BookOpen, UserCheck, 
  PhoneCall, HeartHandshake, Calendar, Layers, HelpCircle
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { Counselor } from '../types';
import { parkMiKyeongDetailedProfile } from '../data/counselorDetails';
import CounselorDetailModal from '../components/CounselorDetailModal';
import QuickReservationModal from '../components/QuickReservationModal';
import { useHighContrast } from '../context/HighContrastContext';

const defaultCounselors: Counselor[] = [
  {
    id: 1,
    name: "박미경",
    title: "상담 소장",
    education: "교육학 박사(상담 심리 및 교육 심리 전공)",
    certifications: "한국상담학회 슈퍼바이저 (수련감독자)\n한국상담학회 전문상담사 1급\n여성가족부 청소년상담사 1급\n한국상담심리학회 정회원\n한국부부가족상담학회 정회원",
    style: "개인 상담 / 기업 상담(EAP) / 부부·가족 / 심리 검사 / 전문가 수련 지도",
    tags: "#교육학박사 #1급슈퍼바이저 #10000시간임상 #개인상담 #부부상담 #청소년 #심리검사 #EAP",
    image_url: "/images/counselor_park.jpg",
    detailedProfile: parkMiKyeongDetailedProfile
  }
];

export default function Counselors() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [counselors, setCounselors] = useState<Counselor[]>(defaultCounselors);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const { isHighContrast } = useHighContrast();

  // State for expanded inline section per counselor
  const [expandedCounselorIds, setExpandedCounselorIds] = useState<Record<number, boolean>>({});

  // State for interactive detail modal
  const [modalCounselor, setModalCounselor] = useState<Counselor | null>(null);

  // State for quick reservation modal
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = () => {
    fetch('/api/counselors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge with detailed profile fallback
          const enriched = data.map((c: Counselor) => ({
            ...c,
            detailedProfile: c.detailedProfile || parkMiKyeongDetailedProfile
          }));
          setCounselors(enriched);
        }
      })
      .catch(() => {});
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
    c.education.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-brand-beige/30 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3 border border-brand-sage/20">
            Professional Counselor Profile
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">
            상담사 소개
          </h1>
          <p className="text-brand-brown/70 font-serif text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            학술적 전문성과 10,000시간 이상의 풍부한 임상 경험을 갖춘 전문 상담사가<br className="hidden sm:inline" />
            내담자 한 분 한 분의 회복과 평온을 위해 온 마음으로 함께합니다.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="이름, 고민 분야(우울, 부부, 청소년), 상담 스타일로 검색"
              className="w-full px-6 py-3.5 pr-12 rounded-full border border-brand-green/40 bg-white focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-hidden shadow-xs text-sm font-serif transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="상담사 및 전문 분야 검색"
            />
            <Search className="absolute right-5 top-3.5 text-brand-sage w-5 h-5 pointer-events-none" />
          </div>
          {searchTerm && (
            <p className="text-center text-xs text-brand-brown/60 mt-2">
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
              const profile = counselor.detailedProfile || parkMiKyeongDetailedProfile;
              const isExpanded = !!expandedCounselorIds[counselor.id];

              const certList = counselor.certifications 
                ? counselor.certifications.split('\n').filter(Boolean)
                : [];
              
              const styles = counselor.style 
                ? counselor.style.split('/').map(s => s.trim()).filter(Boolean)
                : [];

              return (
                <motion.div 
                  key={counselor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-3xl overflow-hidden shadow-xl border transition-all duration-300 ${
                    isHighContrast 
                      ? 'bg-neutral-950 text-white border-2 border-white' 
                      : 'bg-white text-brand-brown border-brand-green/30'
                  }`}
                >
                  {/* Main Profile Row: Image (Left) + Primary Summary (Right) */}
                  <div className="flex flex-col md:flex-row">
                    
                    {/* Left: Profile Image & Trust Badges */}
                    <div className="md:w-5/12 min-h-[340px] md:min-h-[460px] relative bg-brand-beige/40 group overflow-hidden shrink-0 flex flex-col justify-end">
                      <img 
                        src={counselor.image_url || '/images/counselor_park.jpg'} 
                        alt={`${counselor.name} ${counselor.title || '상담사'}`} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                        onClick={() => setModalCounselor(counselor)}
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

                      {/* Click overlay hint */}
                      <button
                        type="button"
                        onClick={() => setModalCounselor(counselor)}
                        className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        title="상세 프로필 모달 열기"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-brand-sage" />
                        <span className="hidden sm:inline">상세 프로필</span>
                      </button>

                      {/* Gradient overlay for badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Tags & Quick Metrics on image */}
                      <div className="relative z-10 p-5 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>한국상담학회 1급 슈퍼바이저 인증</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {counselor.tags.split(' ').filter(Boolean).map(tag => (
                            <span 
                              key={tag} 
                              className="px-2.5 py-1 bg-white/95 text-brand-brown text-xs font-semibold rounded-full shadow-xs border border-brand-green/20"
                            >
                              {tag}
                            </span>
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
                            <div className="flex items-baseline gap-2.5">
                              <h2 
                                onClick={() => setModalCounselor(counselor)}
                                className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown hover:text-brand-sage transition-colors cursor-pointer"
                              >
                                {counselor.name}
                              </h2>
                              <span className="px-3 py-1 bg-brand-sage/15 text-brand-sage font-bold text-xs sm:text-sm rounded-full">
                                {counselor.title}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setModalCounselor(counselor)}
                              className="text-xs font-bold text-brand-sage hover:text-brand-brown transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>전체 약력 모달</span>
                              <Maximize2 className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="text-sm sm:text-base font-serif text-brand-brown/85 font-medium leading-relaxed">
                            {counselor.education}
                          </p>

                          {/* Philosophy snippet */}
                          {profile.greeting && (
                            <p className="mt-2 text-xs sm:text-sm font-serif italic text-brand-sage/90 bg-brand-beige/30 p-2.5 rounded-xl border border-brand-green/20 leading-relaxed">
                              "{profile.greeting}"
                            </p>
                          )}
                        </div>
                        
                        {/* <자격&경력> Summary Section */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-brand-sage" />
                              <h3 className="text-xs sm:text-sm font-bold text-brand-brown tracking-wider uppercase">
                                주요 전문 자격 &amp; 수련
                              </h3>
                            </div>
                            <span className="text-[11px] text-brand-brown/50">
                              공인 1급 전문 자격
                            </span>
                          </div>

                          <ul className="space-y-1.5 pl-0.5">
                            {certList.map((cert, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-brown/85 font-serif leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage shrink-0 mt-1" />
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* <상담 스타일 & 분야 칩> */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2.5">
                            <Sparkles className="w-4 h-4 text-brand-sage" />
                            <h3 className="text-xs sm:text-sm font-bold text-brand-brown tracking-wider uppercase">
                              전문 분야 및 상담 스타일
                            </h3>
                          </div>
                          <div className="p-3.5 bg-brand-beige/25 rounded-2xl border border-brand-green/25">
                            <p className="text-xs sm:text-sm font-bold text-brand-brown mb-2 font-serif">
                              {counselor.style}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {styles.map((st, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2.5 py-0.5 bg-white text-brand-sage text-xs font-medium rounded-md border border-brand-sage/20 shadow-2xs"
                                >
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Bar (Expand Toggle + Modal Open + Reservation CTA) */}
                      <div className="pt-4 border-t border-brand-green/20 space-y-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          {/* Inline Expand/Collapse Button */}
                          <button
                            type="button"
                            onClick={() => toggleExpand(counselor.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`counselor-details-${counselor.id}`}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              isExpanded
                                ? 'bg-brand-brown text-white border-brand-brown shadow-xs'
                                : 'bg-white hover:bg-brand-green/20 text-brand-brown border-brand-green/40'
                            }`}
                          >
                            <span>{isExpanded ? '상세 정보 접기' : '전문 분야 & 치료 기법 펼쳐보기'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-brand-sage" />
                            )}
                          </button>

                          {/* Full Interactive Modal Button */}
                          <button
                            type="button"
                            onClick={() => setModalCounselor(counselor)}
                            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-beige/50 hover:bg-brand-beige text-brand-brown border border-brand-green/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                            title="전체 학술/수련/임상 이력 팝업 모달 보기"
                          >
                            <Maximize2 className="w-4 h-4 text-brand-sage" />
                            <span>상세 프로필 모달</span>
                          </button>
                        </div>

                        {/* Direct Reservation Link */}
                        <Link 
                          to="/reservation"
                          className="w-full py-3.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-xs sm:text-sm active:scale-98 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{counselor.name} 소장 1:1 상담 예약하기</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
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
                        className="overflow-hidden border-t border-brand-green/25 bg-brand-beige/15"
                      >
                        <div className="p-6 sm:p-8 md:p-10 space-y-8">
                          
                          {/* Top Highlight Banner: Clinical Experience & Supervisory Role */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-2xl bg-white border border-brand-green/20 text-center">
                              <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                                누적 임상 상담
                              </span>
                              <strong className="text-lg sm:text-xl font-bold text-brand-sage font-mono">
                                10,000+ 시간
                              </strong>
                              <p className="text-[11px] text-brand-brown/60 mt-0.5">
                                성인·부부·청소년 통합 임상
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-brand-green/20 text-center">
                              <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                                학술 최고 학위
                              </span>
                              <strong className="text-lg sm:text-xl font-bold text-brand-brown font-serif">
                                교육학 박사
                              </strong>
                              <p className="text-[11px] text-brand-brown/60 mt-0.5">
                                상담심리 및 교육심리 전공
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-brand-green/20 text-center">
                              <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                                수련 지도 자격
                              </span>
                              <strong className="text-lg sm:text-xl font-bold text-brand-sage font-serif">
                                공인 슈퍼바이저
                              </strong>
                              <p className="text-[11px] text-brand-brown/60 mt-0.5">
                                전문상담사 1급 수련감독자
                              </p>
                            </div>
                          </div>

                          {/* 5대 핵심 전문 임상 영역 카드 */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-brand-sage" />
                                <h4 className="text-sm font-bold text-brand-brown font-serif">
                                  주요 전문 임상 영역 및 치료 기법
                                </h4>
                              </div>
                              <span className="text-xs text-brand-brown/50 hidden sm:inline">
                                근거 기반(Evidence-Based) 심리치료 접근
                              </span>
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
                              <span>박미경 소장의 상담 세션 진행 원칙</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-serif">
                              <div className="p-3 rounded-xl bg-brand-beige/25 border border-brand-green/20">
                                <span className="text-[10px] font-bold text-brand-sage font-mono block mb-1">STEP 1</span>
                                <strong className="block text-brand-brown mb-1">경청과 공감</strong>
                                <p className="text-brand-brown/70 text-[11px] leading-relaxed">
                                  호소 문제의 고통을 있는 그대로 온전히 경청하고 라포를 형성합니다.
                                </p>
                              </div>
                              <div className="p-3 rounded-xl bg-brand-beige/25 border border-brand-green/20">
                                <span className="text-[10px] font-bold text-brand-sage font-mono block mb-1">STEP 2</span>
                                <strong className="block text-brand-brown mb-1">객관적 평가</strong>
                                <p className="text-brand-brown/70 text-[11px] leading-relaxed">
                                  필요 시 심리검사(MMPI, TCI)를 통해 심리 구조를 정밀 분석합니다.
                                </p>
                              </div>
                              <div className="p-3 rounded-xl bg-brand-beige/25 border border-brand-green/20">
                                <span className="text-[10px] font-bold text-brand-sage font-mono block mb-1">STEP 3</span>
                                <strong className="block text-brand-brown mb-1">맞춤 치유 작업</strong>
                                <p className="text-brand-brown/70 text-[11px] leading-relaxed">
                                  인지·정서 조절 기법과 관계 훈련으로 구체적인 변화를 이끌어냅니다.
                                </p>
                              </div>
                              <div className="p-3 rounded-xl bg-brand-beige/25 border border-brand-green/20">
                                <span className="text-[10px] font-bold text-brand-sage font-mono block mb-1">STEP 4</span>
                                <strong className="block text-brand-brown mb-1">자립과 종결</strong>
                                <p className="text-brand-brown/70 text-[11px] leading-relaxed">
                                  스스로의 힘으로 일상을 온전히 회복할 수 있도록 내면의 힘을 확립합니다.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Footer Actions inside Drawer */}
                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-brand-green/20">
                            <span className="text-xs text-brand-brown/70 flex items-center gap-1.5 font-serif">
                              <ShieldCheck className="w-4 h-4 text-brand-sage" />
                              <span>모든 상담은 철저한 비밀보장 원칙에 따라 1:1 사전 예약제로 운영됩니다.</span>
                            </span>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                type="button"
                                onClick={() => setModalCounselor(counselor)}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>학술/임상 전체 이력 모달로 보기</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleExpand(counselor.id)}
                                className="px-3 py-2 rounded-xl bg-white hover:bg-brand-beige text-xs font-semibold text-brand-brown border border-brand-green/30 transition-colors cursor-pointer"
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
              className="px-4 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold"
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
