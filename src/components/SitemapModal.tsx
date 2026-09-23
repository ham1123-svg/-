import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, ShieldCheck, Lock, ArrowRight, Heart, 
  Sparkles, Calendar, MapPin, FileText, CheckCircle2, 
  HelpCircle, Phone, Clock, ExternalLink, ShieldAlert,
  Users, Activity, MessageSquare, BookOpen, ChevronRight, Settings
} from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      localStorage.removeItem('hbbr_admin_auth');
      const authed = sessionStorage.getItem('hbbr_admin_auth') === 'true';
      setIsAdminLoggedIn(authed);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleAdminClick = () => {
    const isAuthed = sessionStorage.getItem('hbbr_admin_auth') === 'true';
    if (isAuthed) {
      onClose();
      navigate('/admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('hbbr_admin_auth');
    localStorage.removeItem('hbbr_admin_auth');
    setIsAdminLoggedIn(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-brown/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-brand-green/30 overflow-hidden flex flex-col max-h-[92vh] z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-brand-beige via-white to-brand-beige/50 border-b border-brand-green/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-sage text-white flex items-center justify-center shadow-md">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif text-brand-brown">
                    행복바람 전체 사이트맵
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-sage/15 text-brand-sage">
                    Navigation & Admin
                  </span>
                </div>
                <p className="text-xs text-brand-brown/65 mt-0.5">
                  행복바람심리상담연구소의 모든 서비스 및 운영자 관리 기능 안내
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-brand-beige/60 hover:bg-brand-brown/10 text-brand-brown flex items-center justify-center transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-brand-brown">
            {/* Structured Sitemap Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Category 1: 소개 & 상담진 */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-brand-sage/20 text-brand-sage flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">소개 & 전문진</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/about')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>연구소 소개 & 비전</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/counselors')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>상담진 및 원장 프로필</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/about')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>시설 및 공간 둘러보기</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 2: 상담 프로그램 */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">상담 프로그램</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/programs')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>성인 및 청소년 개인상담</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/programs')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>부부 및 가족관계 상담</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/programs')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>종합 심리검사 (정서·성격)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/eap')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-brand-sage font-semibold">기관 및 기업상담 (EAP) 제휴</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 3: 자가진단 & 상담안내 */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">자가진단 & 안내</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/self-diagnosis')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>마음 자가진단 (우울·불안)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/guide#process')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>상담 절차 및 진행 방법</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/guide#pricing')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>비용 안내 및 환불 규정</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/guide#faq')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>자주 묻는 질문 (FAQ)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 4: 예약 및 오시는 길 */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">예약 및 오시는 길</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/reservation')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>실시간 온라인 상담 예약</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/reservation/status')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-bold text-brand-sage">예약 상태 조회 (휴대폰 번호)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/reservation')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>상담소 위치 & 지도</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/reservation')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>대중교통 및 주차 안내</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 5: 커뮤니티 (3대 메뉴) */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">커뮤니티</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/community?tab=faq')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>1. 자주하는 질문 (FAQ & 문의)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/community?tab=column')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>2. 전문가 심리 칼럼</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/community?tab=review')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>3. 내담자 상담 후기</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                </ul>
              </div>

              {/* Category 6: 규정 및 약관 */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">규정 & 약관</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/confidentiality')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>상담 비밀보장 원칙</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/privacy')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>개인정보처리방침</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/terms')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>서비스 이용약관</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Contact & Operating Info Bar */}
            <div className="bg-brand-beige/40 rounded-2xl p-4 border border-brand-green/30 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-brand-brown/80">
              <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
                <div className="flex items-center gap-1.5 font-bold text-brand-brown">
                  <Phone className="w-3.5 h-3.5 text-brand-sage" />
                  <span>상담문의: 052-254-0230</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-sage" />
                  <span>월~토 1일 5회 사전 예약제 (09:00, 10:30, 14:00, 15:30, 19:00 / 일·공휴일 휴무)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('/reservation')}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-brand-sage hover:text-white border border-brand-green/40 text-brand-brown font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  상담 예약 바로가기
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-brand-beige/35 border-t border-brand-green/20 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-brown/70">
            <div className="flex items-center gap-3">
              <span>© 행복바람심리상담연구소 · www.hbbr.kr</span>
              <span className="text-brand-brown/30 hidden sm:inline">|</span>
              {/* 운영자 관리 모드 아이콘 버튼 */}
              <button
                type="button"
                onClick={handleAdminClick}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-brand-sage hover:text-white text-brand-brown border border-brand-green/35 text-[11px] font-semibold transition-all shadow-2xs cursor-pointer group"
                title="운영자 관리 모드 로그인"
              >
                <Settings className="w-3.5 h-3.5 text-brand-sage group-hover:text-white transition-colors" />
                <span>운영자 관리 모드</span>
                {isAdminLoggedIn && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="인증됨" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="font-medium text-brand-brown hover:text-brand-sage transition-colors cursor-pointer"
            >
              창 닫기 (ESC)
            </button>
          </div>
        </motion.div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          onClose();
          navigate('/admin');
        }}
      />
    </AnimatePresence>
  );
}
