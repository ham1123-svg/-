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
import { cn } from '../lib/utils';

export type CounselorModalTabType = 'about' | 'specialties' | 'certifications' | 'philosophy' | 'recommendations' | 'overview';

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
  initialTab = 'about'
}: CounselorDetailModalProps) {
  const { isHighContrast } = useHighContrast();
  const [activeTab, setActiveTab] = useState<CounselorModalTabType>(initialTab);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number>(0);

  // Sync initial tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'about');
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

  const defaultAvailabilityDays = [
    { day: "월", dayEn: "Mon", available: true, statusText: "상담 가능", hours: "09:00 ~ 20:00", slotsCount: 5, sessions: "오전 · 오후 · 야간(19시)", highlight: true },
    { day: "화", dayEn: "Tue", available: true, statusText: "상담 가능", hours: "09:00 ~ 20:00", slotsCount: 5, sessions: "오전 · 오후 · 야간(19시)", highlight: true },
    { day: "수", dayEn: "Wed", available: true, statusText: "상담 가능", hours: "09:00 ~ 20:00", slotsCount: 5, sessions: "오전 · 오후 · 야간(19시)", highlight: true },
    { day: "목", dayEn: "Thu", available: true, statusText: "상담 가능", hours: "09:00 ~ 20:00", slotsCount: 5, sessions: "오전 · 오후 · 야간(19시)", highlight: true },
    { day: "금", dayEn: "Fri", available: true, statusText: "상담 가능", hours: "09:00 ~ 20:00", slotsCount: 5, sessions: "오전 · 오후 · 야간(19시)", highlight: true },
    { day: "토", dayEn: "Sat", available: true, statusText: "주말 집중", hours: "09:00 ~ 17:00", slotsCount: 4, sessions: "오전 · 오후 (조기 마감)", highlight: false },
    { day: "일", dayEn: "Sun", available: false, statusText: "정기 휴무", hours: "휴무 (연구/수련)", slotsCount: 0, sessions: "긴급 EAP 사전 협의", highlight: false }
  ];

  const availabilityDays = profile.availability?.days || defaultAvailabilityDays;
  const primaryDaysSummary = profile.availability?.primaryDaysSummary || "월요일 ~ 금요일 (Mon - Fri) & 토요일 (Sat)";

  const tabs: Array<{ id: CounselorModalTabType; label: string; badge?: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'about', label: '상세 소개 (About)', icon: Star },
    { id: 'specialties', label: '특화 전문 분야', badge: `${(profile.specialties || []).length || rawTags.length}개`, icon: Tag },
    { id: 'certifications', label: '공인 자격증 및 학력', badge: '공인 1급', icon: Award },
    { id: 'philosophy', label: '상담 철학 및 원칙', badge: '3대 원칙', icon: HeartHandshake },
    { id: 'recommendations', label: '추천 대상 및 절차', icon: UserCheck }
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
                <span>Executive Profile · 상담 소장 상세 프로필</span>
              </span>
              <span className="text-xs text-brand-brown/60 font-serif hidden md:inline">
                총 상담 30,000+ 시간 · 공인 1급 수련감독자 자격 검증 리포트
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

                {/* 3대 핵심 퀵 배지 (자격증 / 전문태그 / 철학 / 일정) */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>상담 요일: 월~금(09~20시) · 토(09~17시)</span>
                  </span>
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
            {/* TAB 0: 상세 소개 (About: Specializations & Credentials)     */}
            {/* ========================================================= */}
            {(activeTab === 'about' || activeTab === 'overview') && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* 3대 핵심 요약 카드 그리드 (자격증, 전문분야, 철학) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Box 1: 자격증 요약 */}
                  <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>공인 자격증 (Credentials)</span>
                        </span>
                        <span className="text-[10px] text-brand-brown/50 font-bold">공인 1급 검증</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-brown mb-2 font-serif">
                        검증된 최고 등급 전문 자격
                      </h4>
                      <ul className="text-xs text-brand-brown/80 space-y-1.5 font-serif">
                        {(profile.licenseHighlights && profile.licenseHighlights.length > 0
                          ? profile.licenseHighlights.slice(0, 3).map(l => `${l.name} (${l.issuer})`)
                          : (profile.certificationsList || counselor.certifications.split('\n')).slice(0, 3)
                        ).map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('certifications')}
                      className="mt-3 text-xs font-bold text-brand-sage hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>자격증 및 학력 상세 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Box 2: 특화 전문 분야 요약 */}
                  <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>특화 전문 분야 (Specializations)</span>
                        </span>
                        <span className="text-[10px] text-brand-brown/50 font-bold">{(profile.specialties || []).length || rawTags.length}개 분야</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-brown mb-2 font-serif">
                        맞춤형 근거기반 심층 임상
                      </h4>
                      <ul className="text-xs text-brand-brown/80 space-y-1.5 font-serif">
                        {(profile.specialties || []).slice(0, 3).map((spec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="font-semibold text-brand-brown">{spec.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('specialties')}
                      className="mt-3 text-xs font-bold text-amber-700 hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>전문 치유 기법 상세 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Box 3: 상담 철학 요약 */}
                  <div className="p-4 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>상담 철학 (Philosophy)</span>
                        </span>
                        <span className="text-[10px] text-brand-brown/50 font-bold">3대 원칙</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-brown mb-1.5 font-serif">
                        존엄성과 회복탄력성
                      </h4>
                      <p className="text-xs text-brand-brown/75 font-serif italic line-clamp-3 leading-relaxed">
                        "{profile.philosophy || profile.greeting || '내담자 고유의 삶의 무게를 깊이 공감하고 안전하게 동행합니다.'}"
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

                {/* 총 상담 시간 & 100% 비의료 비밀보장 배너 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-brand-green/15 border border-brand-green/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-sage text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-brand-brown text-sm font-bold">
                        총 상담 시간 {profile.clinicalHours || '30,000+ 시간'} (Over 30,000 Consultation Hours) &amp; 100% 비의료 비밀보장
                      </strong>
                      <span className="text-brand-brown/75 font-serif">
                        단순 연수(16년 등) 표기가 아닌 실제 1:1 심층 상담 시간 기준이며, 국민건강보험 및 전산에 기록이 남지 않습니다.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      총 상담 30,000+ 시간 인증
                    </span>
                  </div>
                </div>

                {/* ======================================================= */}
                {/* 요일별 상담 가능 일정 요약 그리드 & 테이블 (Availability Grid & Table) */}
                {/* ======================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-brand-green/25 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-green/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-sage" />
                        <h3 className="text-base font-bold text-brand-brown font-serif">
                          {counselor.name} {counselor.title} 상담 가능 일정 (Primary Availability)
                        </h3>
                      </div>
                      <p className="text-xs text-brand-brown/70 font-serif mt-0.5">
                        내담자 개인 일정과 원활히 조율하실 수 있도록 주간 운영 요일과 시간대를 요약해 드립니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>주요 일정: 월~금 (Mon-Fri) &amp; 토</span>
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Day-by-Day Mini Grid */}
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {availabilityDays.map((item, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-3 rounded-xl border text-center transition-all flex flex-col justify-between",
                            item.available
                              ? item.highlight
                                ? "bg-brand-beige/25 border-brand-green/40 hover:border-brand-sage shadow-2xs"
                                : "bg-amber-50/40 border-amber-200/80 hover:border-amber-300 shadow-2xs"
                              : "bg-neutral-100/70 border-neutral-200 opacity-75"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <span className="font-bold text-sm text-brand-brown font-serif">
                                {item.day}요일
                              </span>
                              <span className="text-[10px] text-brand-brown/50 uppercase font-mono">
                                ({item.dayEn})
                              </span>
                            </div>

                            <div className="mb-2">
                              {item.available ? (
                                <span className={cn(
                                  "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold",
                                  item.highlight 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : "bg-amber-100 text-amber-800"
                                )}>
                                  <Check className="w-2.5 h-2.5" />
                                  <span>{item.statusText}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-600">
                                  <span>{item.statusText}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-brand-green/10 text-[11px] font-serif">
                            <span className="font-semibold text-brand-brown block text-xs">
                              {item.hours}
                            </span>
                            <span className="text-[10px] text-brand-brown/70 block mt-0.5 font-medium">
                              {item.sessions}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Table: Schedule breakdown by Day Category */}
                  <div className="overflow-x-auto rounded-xl border border-brand-green/20">
                    <table className="w-full text-left text-xs font-serif border-collapse">
                      <thead>
                        <tr className="bg-brand-beige/40 border-b border-brand-green/20 text-brand-brown font-bold">
                          <th className="py-2.5 px-3 sm:px-4">상담 요일 구분</th>
                          <th className="py-2.5 px-3 sm:px-4">운영 시간</th>
                          <th className="py-2.5 px-3 sm:px-4">일일 진행 세션 타임</th>
                          <th className="py-2.5 px-3 sm:px-4">주요 대상 &amp; 특화 안내</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-green/15 text-brand-brown/85">
                        <tr className="bg-white hover:bg-brand-green/5 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-brand-brown">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>월요일 ~ 금요일 (Mon - Fri)</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                              평일 주 5일 정규 상담
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-semibold text-brand-brown">
                            09:00 ~ 20:00
                          </td>
                          <td className="py-2.5 px-3 sm:px-4">
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                              1일 5회차
                            </span>
                            <span className="text-[11px] text-brand-brown/70 block mt-1">
                              09:00, 10:30, 14:00, 15:30, <strong className="text-emerald-700">19:00(야간)</strong>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-brand-brown/80 leading-relaxed">
                            <span className="font-semibold text-brand-brown">직장인·학생을 위한 19:00 야간 세션 운영</span>
                            <br className="hidden sm:inline" />
                            성인 심층 개인상담, 대인관계 스트레스, 감정 치유
                          </td>
                        </tr>

                        <tr className="bg-amber-50/20 hover:bg-amber-50/40 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-brand-brown">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span>토요일 (Saturday)</span>
                            </div>
                            <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                              주말 집중 상담 (조기 마감)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-semibold text-brand-brown">
                            09:00 ~ 17:00
                          </td>
                          <td className="py-2.5 px-3 sm:px-4">
                            <span className="font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300 text-[11px]">
                              1일 4회차
                            </span>
                            <span className="text-[11px] text-brand-brown/70 block mt-1">
                              09:00, 10:30, 14:00, 15:30
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-brand-brown/80 leading-relaxed">
                            <span className="font-semibold text-amber-900">맞벌이 부부·커플 상담 및 가족 관계 회복</span>
                            <br className="hidden sm:inline" />
                            주말 집중 시간대로 빠른 사전 예약 권장
                          </td>
                        </tr>

                        <tr className="bg-neutral-50 hover:bg-neutral-100/60 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-neutral-600">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-neutral-400" />
                              <span>일요일 &amp; 법정 공휴일 (Sun)</span>
                            </div>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">
                              정기 휴무
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-neutral-500 font-medium">
                            휴무 (정기)
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-neutral-500 text-[11px]">
                            연구 및 슈퍼비전 지도
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-neutral-600 leading-relaxed">
                            학술 연구 및 공인 수련생 슈퍼비전 진행
                            <br className="hidden sm:inline" />
                            (기업 EAP 긴급 위기개입은 사전 조율 시 진행)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Reservation Callout & Schedule Guidance */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-brand-green/10 border border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                      <p className="text-brand-brown/85 font-serif leading-relaxed">
                        <strong>100% 1일 5회 사전 예약제:</strong> 내담자 한 분 한 분의 프라이버시 보호를 위해 예약된 시간에 맞춰 1:1 독립 상담실에서 대기 없이 진행됩니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenQuickReservation) {
                          onOpenQuickReservation();
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>원하는 일정으로 예약하기</span>
                    </button>
                  </div>
                </div>

                {/* ======================================================= */}
                {/* 1. 특화 전문 임상 분야 상세 (Specific Specializations)  */}
                {/* ======================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-brand-green/25 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-green/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <h3 className="text-base font-bold text-brand-brown font-serif">
                          {counselor.name} {counselor.title}의 특화 전문 임상 분야 (Specific Specializations)
                        </h3>
                      </div>
                      <p className="text-xs text-brand-brown/70 font-serif mt-0.5">
                        호소 문제에 따른 과학적 진단과 검증된 심리치료 접근법을 적용합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('specialties')}
                      className="text-xs font-bold text-amber-700 hover:text-brand-brown flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>전문 분야 탭에서 상세 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Specializations Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(profile.specialties || []).map((spec, i) => (
                      <div 
                        key={i} 
                        className="p-4 rounded-xl bg-brand-beige/20 border border-brand-green/20 hover:border-brand-sage/60 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                              0{i + 1}
                            </span>
                            <h4 className="text-sm font-bold text-brand-brown font-serif">{spec.title}</h4>
                          </div>
                          <p className="text-xs text-brand-brown/80 font-serif leading-relaxed mb-3">
                            {spec.description}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-brand-sage block mb-1.5">
                            적용 치료 기법 (Therapeutic Methods):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {spec.methods.map((method, mIdx) => (
                              <span 
                                key={mIdx} 
                                className="px-2 py-0.5 rounded-md bg-white border border-brand-sage/30 text-brand-brown text-[11px] font-medium shadow-2xs"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Specialty Tags Cloud Preview */}
                  <div className="pt-3 border-t border-brand-green/15">
                    <span className="text-xs font-bold text-brand-brown/70 block mb-2 font-serif">
                      전문 분야 태그 클라우드:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rawTags.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveTab('specialties')}
                          className="px-2.5 py-1 bg-brand-beige/40 hover:bg-amber-50 text-brand-brown hover:text-amber-800 text-xs font-medium rounded-lg border border-brand-green/20 transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ======================================================= */}
                {/* 2. 공인 자격증 및 학력 상세 (Credentials & Education)    */}
                {/* ======================================================= */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-brand-green/25 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-green/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-base font-bold text-brand-brown font-serif">
                          {counselor.name} {counselor.title}의 공인 자격증 및 학력 (Credentials & Qualifications)
                        </h3>
                      </div>
                      <p className="text-xs text-brand-brown/70 font-serif mt-0.5">
                        한국상담학회 및 국가가 공인하는 최고 등급 1급 자격증을 보유하고 있습니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('certifications')}
                      className="text-xs font-bold text-emerald-700 hover:text-brand-brown flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>자격증 탭에서 상세 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Highlights License Badges */}
                  {profile.licenseHighlights && profile.licenseHighlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {profile.licenseHighlights.map((lic, i) => (
                        <div 
                          key={i} 
                          className={`p-3.5 rounded-xl border transition-all ${
                            lic.isSupervisor 
                              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200/50 shadow-2xs' 
                              : 'bg-brand-beige/20 border-brand-green/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
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
                          <p className="text-[11px] text-brand-brown/70 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>발급기관: <strong>{lic.issuer}</strong></span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Complete Certification List */}
                  <div className="p-4 rounded-xl bg-brand-beige/25 border border-brand-green/20 space-y-2">
                    <span className="text-xs font-bold text-brand-brown block uppercase tracking-wide mb-1">
                      공인 자격 및 전문 학회 등록 내역:
                    </span>
                    {(profile.certificationsList || counselor.certifications.split('\n')).map((cert, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-brand-brown font-serif">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{cert}</span>
                      </div>
                    ))}
                  </div>

                  {/* Academic Background & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div>
                      <h4 className="text-xs font-bold text-brand-brown flex items-center gap-1.5 mb-2 font-serif">
                        <GraduationCap className="w-4 h-4 text-brand-sage" />
                        <span>학력 및 학술 연구 이력</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {(profile.academicBackground || [counselor.education]).map((edu, i) => (
                          <li key={i} className="text-xs text-brand-brown/85 font-serif p-2 rounded-lg bg-brand-beige/15 border border-brand-green/15 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-1.5 shrink-0" />
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {profile.careers && profile.careers.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-brand-brown flex items-center gap-1.5 mb-2 font-serif">
                          <BookOpen className="w-4 h-4 text-brand-sage" />
                          <span>주요 임상 및 공공 자문 경력</span>
                        </h4>
                        <div className="space-y-1.5">
                          {profile.careers.slice(0, 3).map((car, i) => (
                            <div key={i} className="text-xs text-brand-brown/85 font-serif p-2 rounded-lg bg-brand-beige/15 border border-brand-green/15 flex items-center justify-between">
                              <span className="font-medium">{car.organization} | <strong className="text-brand-sage">{car.role}</strong></span>
                              {car.period && <span className="text-[10px] text-brand-brown/50 font-mono">{car.period}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ======================================================= */}
                {/* 3. 상담 철학 & 4단계 세션 절차 미리보기                   */}
                {/* ======================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Philosophy Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <HeartHandshake className="w-4 h-4 text-rose-600" />
                        <h4 className="text-sm font-bold text-brand-brown font-serif">상담 철학과 회복 약속</h4>
                      </div>
                      <p className="text-xs font-serif text-brand-brown/85 italic leading-relaxed mb-3">
                        "{profile.philosophy || profile.greeting}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('philosophy')}
                      className="text-xs font-bold text-rose-700 hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>3대 상담 원칙 상세 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 4-Step Process Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-brand-sage" />
                        <h4 className="text-sm font-bold text-brand-brown font-serif">체계적인 4단계 세션 로드맵</h4>
                      </div>
                      <div className="space-y-1.5 text-xs font-serif text-brand-brown/80 mb-3">
                        {(profile.sessionProcedure || [
                          { step: "01", title: "정밀 진단 및 평가" },
                          { step: "02", title: "심층 원인 탐색 및 인지 재구조화" },
                          { step: "03", title: "맞춤 치료 기법 적용 및 실습" },
                          { step: "04", title: "자율적 성장 및 건강한 종결" }
                        ]).map((sp, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-brand-sage px-1.5 py-0.5 rounded bg-brand-green/20">
                              STEP {sp.step}
                            </span>
                            <span className="font-medium">{sp.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('recommendations')}
                      className="text-xs font-bold text-brand-sage hover:text-brand-brown flex items-center gap-1 cursor-pointer pt-2 border-t border-brand-green/15"
                    >
                      <span>추천 대상 및 절차 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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

                {/* Primary Availability Summary Grid & Table for Alignment */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-green/25 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-sage" />
                      <h4 className="text-xs sm:text-sm font-bold text-brand-brown font-serif">
                        상담 가능 요일 요약 (Primary Availability Days)
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      월~금 &amp; 토요일
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-center text-xs font-serif">
                    {availabilityDays.map((item, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-2 rounded-lg border",
                          item.available
                            ? item.highlight
                              ? "bg-brand-beige/30 border-brand-green/30"
                              : "bg-amber-50/50 border-amber-200"
                            : "bg-neutral-100 border-neutral-200 opacity-60"
                        )}
                      >
                        <span className="font-bold text-brand-brown block text-[11px]">{item.day} ({item.dayEn})</span>
                        <span className={cn(
                          "text-[10px] font-extrabold block my-0.5",
                          item.available ? (item.highlight ? "text-emerald-700" : "text-amber-800") : "text-neutral-500"
                        )}>
                          {item.statusText}
                        </span>
                        <span className="text-[9px] text-brand-brown/70 block">{item.hours}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-brand-brown/75 font-serif pt-1 border-t border-brand-green/15">
                    💡 직장인과 학생을 위해 <strong>평일 야간(19:00)</strong>과 <strong>토요일 주말 상담</strong>을 운영하고 있습니다.
                  </p>
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
