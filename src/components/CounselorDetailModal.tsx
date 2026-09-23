import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Award, GraduationCap, Sparkles, HeartHandshake, CheckCircle2, 
  ArrowRight, ShieldCheck, Clock, BookOpen, UserCheck, PhoneCall, 
  Layers, HelpCircle, Calendar, Hash, Tag, FileText, Check, 
  Heart, Star, Zap, Shield, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Counselor } from '../types';
import { counselorProfilesById, parkMiKyeongDetailedProfile } from '../data/counselorDetails';
import { useHighContrast } from '../context/HighContrastContext';

export type CounselorModalTabType = 'overview' | 'certifications' | 'specialties' | 'philosophy' | 'recommendations';

interface CounselorDetailModalProps {
  counselor: Counselor | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickReservation?: () => void;
  initialTab?: CounselorModalTabType;
}

export default function CounselorDetailModal({
  counselor,
  isOpen,
  onClose,
  onOpenQuickReservation,
  initialTab = 'overview'
}: CounselorDetailModalProps) {
  const { isHighContrast } = useHighContrast();
  const [activeTab, setActiveTab] = useState<CounselorModalTabType>(initialTab);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(0);

  // Sync initial tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSelectedTagIndex(0);
    }
  }, [isOpen, initialTab]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !counselor) return null;

  // Retrieve rich profile for this counselor or fallback
  const profile = counselor.detailedProfile || 
    counselorProfilesById[counselor.id] || 
    counselorProfilesById[counselor.name] || 
    parkMiKyeongDetailedProfile;

  // Extract raw tags from counselor.tags string
  const rawTags = counselor.tags
    ? counselor.tags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean)
    : [];

  const detailedTags = profile.specialtyTagsDetailed || [];
  const currentSelectedTag = detailedTags[selectedTagIndex] || detailedTags[0];

  const tabs: Array<{ id: CounselorModalTabType; label: string; badge?: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: '한눈에 보기', icon: Star },
    { id: 'certifications', label: '자격증 정보', badge: '공인 1급', icon: Award },
    { id: 'specialties', label: '전문 분야 태그', badge: `${rawTags.length}개`, icon: Tag },
    { id: 'philosophy', label: '상담 철학', badge: '3대 원칙', icon: HeartHandshake },
    { id: 'recommendations', label: '추천 대상 & 절차', icon: UserCheck }
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="counselor-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl z-10 border transition-colors ${
            isHighContrast 
              ? 'bg-neutral-950 text-white border-2 border-white' 
              : 'bg-white text-brand-brown border-brand-green/30'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-brand-green/20 bg-brand-beige/40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-sage text-white uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>공인 전문 상담사 상세 프로필</span>
              </span>
              <span className="text-xs text-brand-brown/60 font-serif hidden md:inline">
                자격증 정보 · 전문 분야 태그 · 상담 철학 검증 리포트
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-brand-green/30 text-brand-brown/70 hover:text-brand-brown transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Hero Section (Compact & Rich) */}
          <div className="p-5 sm:p-7 bg-gradient-to-br from-brand-beige/60 via-white to-brand-green/10 border-b border-brand-green/20 shrink-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              {/* Avatar Image */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-brand-beige/50">
                  <img
                    src={counselor.image_url || '/images/counselor_park.jpg'}
                    alt={counselor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('counselor_park.jpg')) {
                        target.src = '/images/counselor_park.jpg';
                      }
                    }}
                  />
                </div>
                <div 
                  className="absolute -bottom-2 -right-2 bg-brand-sage text-white p-1 rounded-full shadow-xs" 
                  title="전문 자격 검증 완료"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Key Highlights */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h2 id="counselor-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
                    {counselor.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-brand-sage/15 text-brand-sage font-bold text-xs sm:text-sm">
                    {counselor.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-brand-green/40 text-[11px] font-semibold text-brand-brown/80 shadow-2xs">
                    {profile.supervisionCount || '공인 전문 상담사'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-serif text-brand-brown/85 font-medium mb-2.5">
                  {counselor.education}
                </p>

                {/* Key Philosophy Greeting Snippet */}
                {profile.greeting && (
                  <p className="text-xs sm:text-sm font-serif italic text-brand-sage bg-white/80 p-2.5 rounded-xl border border-brand-green/25 leading-relaxed mb-3">
                    "{profile.greeting}"
                  </p>
                )}

                {/* 3대 핵심 퀵 배지 (자격증 / 전문태그 / 철학) */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('certifications')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-semibold border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>공인 1급 자격증 검증</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('specialties')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100/80 text-amber-800 font-semibold border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>전문 분야 태그 {rawTags.length}개</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('philosophy')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100/80 text-rose-800 font-semibold border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>상담 철학 3대 원칙</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Clear 5 Tabs) */}
          <div className="flex border-b border-brand-green/20 bg-brand-beige/25 px-3 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-brand-sage text-brand-sage bg-white/70 shadow-2xs' 
                      : 'border-transparent text-brand-brown/70 hover:text-brand-brown hover:bg-brand-green/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive 
                        ? 'bg-brand-sage text-white' 
                        : 'bg-brand-brown/10 text-brand-brown/60'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6">
            
            {/* ========================================================= */}
            {/* TAB 0: 한눈에 보기 (Overview: 3 Elements in 1 Page)       */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 3대 핵심 퀵 프리뷰 3-Box Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Box 1: 자격증 요약 */}
                  <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>자격증 정보</span>
                        </span>
                        <span className="text-[10px] text-brand-brown/50">공인 자격</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-brown mb-2 font-serif">
                        검증된 공인 1급 전문 자격
                      </h4>
                      <ul className="text-xs text-brand-brown/80 space-y-1 font-serif">
                        {(profile.certificationsList || counselor.certifications.split('\n')).slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-sage shrink-0 mt-0.5" />
                            <span className="truncate">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('certifications')}
                      className="mt-3 text-xs font-bold text-brand-sage hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>자격증 전체 상세 확인</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Box 2: 전문 분야 태그 요약 */}
                  <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>전문 분야 태그</span>
                        </span>
                        <span className="text-[10px] text-brand-brown/50">{rawTags.length}개 분야</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-brown mb-2 font-serif">
                        다각도 맞춤 치유 태그
                      </h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {rawTags.slice(0, 5).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-brand-beige text-brand-brown text-[11px] font-medium">
                            {t}
                          </span>
                        ))}
                        {rawTags.length > 5 && (
                          <span className="px-1.5 py-0.5 rounded bg-brand-green/20 text-brand-sage text-[10px] font-bold">
                            +{rawTags.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('specialties')}
                      className="mt-3 text-xs font-bold text-amber-700 hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>태그별 치유 기법 확인</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Box 3: 상담 철학 요약 */}
                  <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>상담 철학</span>
                        </span>
                        <span className="text-[10px] text-brand-brown/50">3대 원칙</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-brown mb-1.5 font-serif">
                        존엄성과 회복탄력성
                      </h4>
                      <p className="text-xs text-brand-brown/75 font-serif italic line-clamp-2 leading-relaxed">
                        "{profile.philosophy || '내담자 고유의 삶의 무게를 깊이 공감하고 안전하게 동행합니다.'}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('philosophy')}
                      className="mt-3 text-xs font-bold text-rose-700 hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>상담 철학 전문 읽기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 누적 임상 & 비밀보장 신뢰 지표 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-brand-green/15 border border-brand-green/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-sage text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-brand-brown text-sm font-bold">
                        누적 임상 상담 {profile.clinicalHours || '10,000+ 시간'} & 100% 비의료 비밀보장
                      </strong>
                      <span className="text-brand-brown/75 font-serif">
                        국민건강보험 및 전산에 기록이 남지 않으며 한국상담학회 윤리강령에 따라 안전하게 보호됩니다.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('certifications')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-brand-beige text-brand-brown text-xs font-bold border border-brand-green/30 shrink-0 cursor-pointer shadow-2xs"
                  >
                    자격증 및 학력 보기
                  </button>
                </div>

                {/* 주요 전문 임상 영역 카드 리스트 (미리보기) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-brand-brown flex items-center gap-1.5 font-serif">
                      <Sparkles className="w-4 h-4 text-brand-sage" />
                      <span>{counselor.name} {counselor.title}의 대표 전문 임상 영역</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('specialties')}
                      className="text-xs font-semibold text-brand-sage hover:underline"
                    >
                      전체 보기
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(profile.specialties || []).slice(0, 4).map((spec, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white border border-brand-green/20">
                        <h4 className="text-xs font-bold text-brand-brown mb-1 font-serif">{spec.title}</h4>
                        <p className="text-[11px] text-brand-brown/70 mb-2 font-serif line-clamp-2">{spec.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {spec.methods.slice(0, 3).map((m, mIdx) => (
                            <span key={mIdx} className="text-[10px] px-2 py-0.5 rounded bg-brand-green/20 text-brand-sage font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* TAB 1: 자격증 정보 (Certifications & Credentials)       */}
            {/* ========================================================= */}
            {activeTab === 'certifications' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. 공인 자격증 하이라이트 배지 그리드 */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-green/20">
                    <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2">
                      <Award className="w-4 h-4 text-brand-sage" />
                      <span>공인 자격증 및 수련 지도 자격 (Certifications)</span>
                    </h3>
                    <span className="text-[11px] text-brand-sage font-bold bg-brand-sage/10 px-2 py-0.5 rounded-full">
                      국가공인 및 학회 1급 검증
                    </span>
                  </div>

                  {/* Highlight Cards if available */}
                  {profile.licenseHighlights && profile.licenseHighlights.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {profile.licenseHighlights.map((lic, i) => (
                        <div 
                          key={i} 
                          className={`p-3.5 rounded-2xl border transition-all ${
                            lic.isSupervisor 
                              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200/50 shadow-2xs' 
                              : 'bg-white border-brand-green/20 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-brand-brown font-serif">
                              {lic.name}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                              lic.isSupervisor 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-brand-sage/15 text-brand-sage'
                            }`}>
                              {lic.level}
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-brown/65 flex items-center gap-1">
                            <Shield className="w-3 h-3 text-brand-sage" />
                            <span>발급기관: <strong>{lic.issuer}</strong></span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Detailed Certification Bullet List */}
                  <div className="p-4 rounded-2xl bg-brand-beige/25 border border-brand-green/25 space-y-2.5">
                    <span className="text-[11px] font-bold text-brand-brown/70 block uppercase tracking-wider mb-1">
                      공인 자격 및 학회 등록 내역
                    </span>
                    {(profile.certificationsList || counselor.certifications.split('\n')).map((cert, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-brand-brown font-serif">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 학력 및 학술 연구 이력 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                    <GraduationCap className="w-4 h-4 text-brand-sage" />
                    <span>학력 및 학술 연구 이력 (Education & Academic Background)</span>
                  </h3>
                  <ul className="space-y-2">
                    {(profile.academicBackground || [counselor.education]).map((edu, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-brand-brown/85 font-serif p-2.5 rounded-xl bg-white border border-brand-green/20">
                        <span className="w-2 h-2 rounded-full bg-brand-sage shrink-0" />
                        <span className="font-medium">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. 주요 임상 및 사회적 자문 경력 */}
                {profile.careers && profile.careers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                      <BookOpen className="w-4 h-4 text-brand-sage" />
                      <span>주요 임상 및 공공 자문 경력 (Clinical & Advisory Experience)</span>
                    </h3>
                    <div className="space-y-2">
                      {profile.careers.map((career, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-brand-green/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <div className="font-serif">
                            <span className="font-bold text-brand-brown">{career.organization}</span>
                            <span className="text-brand-brown/50 mx-2">|</span>
                            <span className="text-brand-sage font-semibold">{career.role}</span>
                          </div>
                          {career.period && (
                            <span className="text-[11px] font-mono text-brand-brown/50 px-2 py-0.5 bg-brand-beige/50 rounded-md shrink-0 self-start sm:self-auto">
                              {career.period}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 자격 검증 안심 노트 */}
                <div className="p-3.5 rounded-xl bg-brand-green/15 border border-brand-green/30 flex items-start gap-2.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-brand-brown/80 font-serif leading-relaxed">
                    행복바람 심리상담연구소의 모든 상담사는 한국상담학회 및 한국상담심리학회의 공인 윤리 규정과 정기 보수 교육을 이수한 검증된 1급 전문 인력입니다.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: 전문 분야 태그 (Specialty Tags & Approaches)      */}
            {/* ========================================================= */}
            {activeTab === 'specialties' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. Interactive Tag Cloud Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-sage" />
                      <span>전문 분야 태그 클라우드 (클릭하여 상세 치유법 확인)</span>
                    </h3>
                    <span className="text-[11px] text-brand-brown/50">총 {rawTags.length}개 전문 태그</span>
                  </div>
                  <p className="text-xs text-brand-brown/70 font-serif mb-3">
                    태그를 클릭하시면 해당 분야의 호소 증상과 맞춤형 근거기반 치료 접근법을 확인하실 수 있습니다.
                  </p>

                  {/* Interactive Tag Pill Buttons */}
                  <div className="flex flex-wrap gap-2 p-3.5 bg-brand-beige/30 rounded-2xl border border-brand-green/25">
                    {detailedTags.length > 0 ? (
                      detailedTags.map((dt, idx) => {
                        const isSelected = selectedTagIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedTagIndex(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                              isSelected
                                ? 'bg-brand-sage text-white border-brand-sage shadow-xs ring-2 ring-brand-sage/20'
                                : 'bg-white text-brand-brown/80 border-brand-green/30 hover:border-brand-sage/60 hover:bg-brand-beige/50'
                            }`}
                          >
                            <Hash className="w-3 h-3 opacity-70" />
                            <span>{dt.label || dt.tag}</span>
                            {isSelected && <Check className="w-3 h-3 text-white ml-0.5" />}
                          </button>
                        );
                      })
                    ) : (
                      rawTags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-brand-sage text-xs font-semibold rounded-xl border border-brand-green/30">
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Selected Tag Deep Dive Spotlight Card */}
                {currentSelectedTag && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-sage/40 shadow-xs relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-sage/15 text-brand-sage font-mono">
                        {currentSelectedTag.tag}
                      </span>
                      <h4 className="text-sm font-bold text-brand-brown font-serif">
                        {currentSelectedTag.label} 상세 안내
                      </h4>
                    </div>

                    <p className="text-xs text-brand-brown/85 font-serif leading-relaxed mb-3">
                      {currentSelectedTag.description}
                    </p>

                    {currentSelectedTag.targetSymptoms && currentSelectedTag.targetSymptoms.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[11px] font-bold text-brand-brown/60 block mb-1">
                          주요 호소 증상:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentSelectedTag.targetSymptoms.map((sym, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md text-[11px] font-medium border border-rose-200">
                              • {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentSelectedTag.approach && (
                      <div className="p-2.5 rounded-xl bg-brand-beige/40 border border-brand-green/20 text-xs">
                        <span className="text-[11px] font-bold text-brand-sage block mb-0.5">
                          적용되는 근거기반 치료 기법:
                        </span>
                        <p className="text-brand-brown font-serif font-medium">
                          {currentSelectedTag.approach}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. 임상 영역별 전문 카드 목록 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20 font-serif">
                    <Sparkles className="w-4 h-4 text-brand-sage" />
                    <span>상세 전문 임상 영역 및 치료 기법</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3.5">
                    {(profile.specialties || []).map((spec, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white border border-brand-green/25 hover:border-brand-sage/50 transition-all shadow-2xs">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-6 h-6 rounded-lg bg-brand-sage/15 text-brand-sage text-xs font-bold flex items-center justify-center shrink-0">
                            0{i + 1}
                          </span>
                          <h4 className="text-sm font-bold text-brand-brown font-serif">{spec.title}</h4>
                        </div>
                        <p className="text-xs text-brand-brown/80 font-serif leading-relaxed pl-8 mb-2.5">
                          {spec.description}
                        </p>
                        <div className="pl-8 flex flex-wrap gap-1.5">
                          {spec.methods.map((method, mIdx) => (
                            <span key={mIdx} className="px-2.5 py-0.5 rounded-md bg-brand-green/25 text-brand-sage text-[11px] font-semibold border border-brand-sage/20">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: 상담 철학 (Counseling Philosophy & Principles)   */}
            {/* ========================================================= */}
            {activeTab === 'philosophy' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. 메인 상담 철학 인용 배너 */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-brand-beige/70 via-brand-beige/40 to-white border border-brand-green/30 relative shadow-2xs">
                  <span className="text-[11px] font-bold text-brand-sage tracking-widest block uppercase mb-2">
                    COUNSELING PHILOSOPHY & VALUES
                  </span>
                  <p className="text-sm sm:text-base font-serif text-brand-brown leading-relaxed italic mb-3">
                    "{profile.philosophy || '상담은 고통의 무게를 함께 나누고 본연의 회복탄력성을 일깨우는 안전한 동행입니다.'}"
                  </p>
                  <div className="text-right text-xs font-serif font-bold text-brand-sage">
                    — {counselor.name} {counselor.title}
                  </div>
                </div>

                {/* 2. 3대 핵심 상담 원칙 카드 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                    <HeartHandshake className="w-4 h-4 text-brand-sage" />
                    <span>상담사가 약속하는 3대 핵심 임상 원칙</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(profile.philosophyPrinciples || [
                      {
                        title: "무조건적 긍정적 존중",
                        subtitle: "판단 없이 온전히 수용합니다",
                        description: "상담실에 들어서는 모든 분의 고유한 존엄성과 삶의 역사를 깊이 존중합니다."
                      },
                      {
                        title: "100% 비의료 비밀보장",
                        subtitle: "어떤 기록도 외부에 남지 않습니다",
                        description: "국민건강보험에 전산 코드가 남지 않는 순수 비의료기관으로 안심하셔도 됩니다."
                      },
                      {
                        title: "회복탄력성의 발견",
                        subtitle: "내담자 스스로 삶의 주인이 되도록",
                        description: "상담사에 의존하지 않고 내담자 고유의 힘으로 온전히 자립할 수 있도록 돕습니다."
                      }
                    ]).map((principle, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-brand-sage bg-brand-green/25 px-2 py-0.5 rounded-full inline-block mb-1.5">
                            PRINCIPLE 0{idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-brand-brown mb-1 font-serif">
                            {principle.title}
                          </h4>
                          {principle.subtitle && (
                            <p className="text-[11px] text-brand-sage font-semibold mb-2">
                              {principle.subtitle}
                            </p>
                          )}
                          <p className="text-[11px] text-brand-brown/75 leading-relaxed font-serif">
                            {principle.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 상담 세션 4단계 진행 로드맵 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20 font-serif">
                    <Layers className="w-4 h-4 text-brand-sage" />
                    <span>체계적인 4단계 치유 세션 로드맵</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(profile.sessionProcedure || []).map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-brand-green/20">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono font-bold text-brand-sage px-2 py-0.5 rounded bg-brand-green/30">
                            STEP {step.step}
                          </span>
                          <h4 className="text-xs font-bold text-brand-brown font-serif">{step.title}</h4>
                        </div>
                        <p className="text-[11px] text-brand-brown/70 leading-relaxed font-serif pl-2">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: 추천 대상 & 안내 (Recommendations & Guide)        */}
            {/* ========================================================= */}
            {activeTab === 'recommendations' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20 font-serif">
                    <UserCheck className="w-4 h-4 text-brand-sage" />
                    <span>이런 고민을 겪고 계신 분께 특히 추천합니다</span>
                  </h3>
                  <div className="space-y-2">
                    {(profile.recommendedFor || []).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-brand-green/20 text-xs text-brand-brown/85 font-serif">
                        <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-beige/30 border border-brand-green/30 space-y-3">
                  <h4 className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-brand-sage" />
                    <span>첫 방문 전 자주 묻는 질문</span>
                  </h4>
                  <div className="text-xs space-y-2 font-serif text-brand-brown/80 leading-relaxed">
                    <p>
                      <strong>Q. 특별히 준비해 가야 할 것이 있나요?</strong><br />
                      A. 아무런 준비 없이 편안한 복장으로 오시면 됩니다. 독립된 프라이빗 대기실과 따뜻한 웰컴티가 준비되어 있습니다.
                    </p>
                    <p>
                      <strong>Q. 몇 회기 정도 상담을 진행하게 되나요?</strong><br />
                      A. 초기 면담을 통해 호소 문제의 깊이에 따라 단기(4~8회) 또는 심층(10회 이상) 일정을 내담자와 충분히 상의하여 결정합니다.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 bg-brand-beige/40 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-brand-brown/70">
              <PhoneCall className="w-4 h-4 text-brand-sage" />
              <span>전화 문의: <strong>052-254-0230</strong> (1:1 안심 통화)</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {onOpenQuickReservation && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenQuickReservation();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-brand-green/40 hover:bg-white text-xs font-bold text-brand-brown transition-colors cursor-pointer shrink-0"
                >
                  간편 전화상담 요청
                </button>
              )}

              <Link
                to="/reservation"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{counselor.name} {counselor.title} 1:1 상담 예약</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
