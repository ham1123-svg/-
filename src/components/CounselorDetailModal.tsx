import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Award, GraduationCap, Sparkles, HeartHandshake, CheckCircle2, 
  ArrowRight, ShieldCheck, Clock, BookOpen, UserCheck, PhoneCall, 
  Layers, MessageSquare, HelpCircle, ExternalLink, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Counselor } from '../types';
import { parkMiKyeongDetailedProfile } from '../data/counselorDetails';
import { useHighContrast } from '../context/HighContrastContext';

interface CounselorDetailModalProps {
  counselor: Counselor | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickReservation?: () => void;
}

type TabType = 'accreditation' | 'specialties' | 'philosophy' | 'recommendations';

export default function CounselorDetailModal({
  counselor,
  isOpen,
  onClose,
  onOpenQuickReservation
}: CounselorDetailModalProps) {
  const { isHighContrast } = useHighContrast();
  const [activeTab, setActiveTab] = useState<TabType>('accreditation');

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

  const profile = counselor.detailedProfile || parkMiKyeongDetailedProfile;

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'accreditation', label: '자격 & 수련 배경', icon: Award },
    { id: 'specialties', label: '전문 분야 & 기법', icon: Sparkles },
    { id: 'philosophy', label: '상담 철학 & 절차', icon: HeartHandshake },
    { id: 'recommendations', label: '추천 내담자 & 안내', icon: UserCheck }
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl z-10 border transition-colors ${
            isHighContrast 
              ? 'bg-neutral-950 text-white border-2 border-white' 
              : 'bg-white text-brand-brown border-brand-green/30'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-green/20 bg-brand-beige/30 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-sage text-white uppercase tracking-wider">
                Professional Profile
              </span>
              <span className="text-xs text-brand-brown/60 font-serif hidden sm:inline">
                행복바람 심리상담연구소 전문가 심층 프로필
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
          <div className="p-6 md:p-8 bg-gradient-to-br from-brand-beige/50 via-white to-brand-green/10 border-b border-brand-green/20 shrink-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Image */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white">
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
                <div className="absolute -bottom-2 -right-2 bg-brand-sage text-white p-1 rounded-full shadow-xs" title="공인 1급 수련감독자">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Stats */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                  <h2 id="counselor-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
                    {counselor.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-brand-sage/15 text-brand-sage font-bold text-xs sm:text-sm">
                    {counselor.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-brand-green/40 text-[11px] font-semibold text-brand-brown/80 shadow-2xs">
                    한국상담학회 1급 슈퍼바이저
                  </span>
                </div>

                <p className="text-sm font-serif text-brand-brown/85 font-medium mb-3">
                  {counselor.education}
                </p>

                {profile.greeting && (
                  <p className="text-xs sm:text-sm font-serif italic text-brand-sage bg-white/70 p-2.5 rounded-xl border border-brand-green/25 leading-relaxed">
                    "{profile.greeting}"
                  </p>
                )}

                {/* Key Metrics Quick Badges */}
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-green/30 text-brand-brown font-semibold">
                    <Clock className="w-3.5 h-3.5 text-brand-sage" />
                    <span>누적 상담 {profile.clinicalHours || '10,000+ 시간'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-green/30 text-brand-brown font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
                    <span>100% 비밀보장 윤리강령 준수</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-green/30 text-brand-brown font-semibold">
                    <Award className="w-3.5 h-3.5 text-brand-sage" />
                    <span>국가공인 청소년상담사 1급</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-green/20 bg-brand-beige/20 px-4 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-brand-sage text-brand-sage bg-white/50' 
                      : 'border-transparent text-brand-brown/70 hover:text-brand-brown hover:bg-brand-green/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* TAB 1: 자격 & 수련 배경 */}
            {activeTab === 'accreditation' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 자격증 섹션 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                    <Award className="w-4 h-4 text-brand-sage" />
                    <span>공인 공적 전문 자격</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {(profile.certificationsList || counselor.certifications.split('\n')).map((cert, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-beige/30 border border-brand-green/20 text-xs text-brand-brown">
                        <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 학력 및 연구 배경 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                    <GraduationCap className="w-4 h-4 text-brand-sage" />
                    <span>학력 및 학술 연구 이력</span>
                  </h3>
                  <ul className="space-y-2">
                    {(profile.academicBackground || [counselor.education]).map((edu, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-brand-brown/85 font-serif p-2 rounded-lg bg-white border border-brand-green/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 주요 경력 및 자문 이력 */}
                {profile.careers && profile.careers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                      <BookOpen className="w-4 h-4 text-brand-sage" />
                      <span>주요 임상 및 사회적 자문 경력</span>
                    </h3>
                    <div className="space-y-2">
                      {profile.careers.map((career, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-brand-green/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <div className="font-serif">
                            <span className="font-bold text-brand-brown">{career.organization}</span>
                            <span className="text-brand-brown/60 mx-1.5">|</span>
                            <span className="text-brand-sage font-medium">{career.role}</span>
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
              </motion.div>
            )}

            {/* TAB 2: 전문 임상 분야 & 치료 기법 */}
            {activeTab === 'specialties' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-xs text-brand-brown/70 font-serif leading-relaxed mb-4">
                  박미경 소장은 10,000시간 이상의 임상 경험을 바탕으로, 내담자의 성향과 호소 문제에 최적화된 근거 기반 심리치료 기법을 융합하여 제공합니다.
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {(profile.specialties || []).map((spec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-brand-green/25 hover:border-brand-sage/50 transition-all shadow-xs">
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
                          <span key={mIdx} className="px-2.5 py-0.5 rounded-md bg-brand-green/30 text-brand-sage text-[11px] font-semibold border border-brand-sage/20">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 3: 상담 철학 & 절차 */}
            {activeTab === 'philosophy' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 철학 인용문 */}
                <div className="p-5 rounded-2xl bg-brand-beige/40 border border-brand-green/30 relative">
                  <span className="text-xs font-bold text-brand-sage tracking-wider block mb-2">
                    COUNSELING PHILOSOPHY
                  </span>
                  <p className="text-sm font-serif text-brand-brown leading-relaxed italic">
                    "{profile.philosophy}"
                  </p>
                </div>

                {/* 4단계 세션 진행 절차 */}
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                    <Layers className="w-4 h-4 text-brand-sage" />
                    <span>상담 세션 4단계 진행 로드맵</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(profile.sessionProcedure || []).map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-brand-green/20">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono font-bold text-brand-sage px-1.5 py-0.5 rounded bg-brand-green/30">
                            STEP {step.step}
                          </span>
                          <h4 className="text-xs font-bold text-brand-brown">{step.title}</h4>
                        </div>
                        <p className="text-[11px] text-brand-brown/70 leading-relaxed font-serif">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 안심 원칙 배너 */}
                <div className="p-4 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-start gap-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-brand-brown font-bold mb-0.5">
                      상담 기록 및 사생활 100% 비밀보장
                    </strong>
                    <span className="text-brand-brown/75 leading-relaxed font-serif">
                      상담실 내에서 나눈 모든 대화와 기록은 한국상담학회 및 한국상담심리학회의 엄격한 윤리강령에 따라 외부에 일체 공개되지 않으며 안전하게 보호됩니다.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: 추천 내담자 & 안내 */}
            {activeTab === 'recommendations' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-sm font-bold text-brand-brown flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
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
                      A. 아무런 준비 없이 편안한 복장으로 오시면 됩니다. 상담실에 따뜻한 웰컴티가 준비되어 있습니다.
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
              <span>전화 직통 문의: <strong>052-254-0230</strong></span>
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
                <span>{counselor.name} 소장 1:1 상담 예약하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
