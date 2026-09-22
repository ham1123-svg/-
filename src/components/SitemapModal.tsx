import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, ShieldCheck, Lock, ArrowRight, Heart, 
  Sparkles, Calendar, MapPin, FileText, CheckCircle2, 
  HelpCircle, Phone, Clock, ExternalLink, ShieldAlert,
  Users, Activity, MessageSquare, BookOpen, ChevronRight
} from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Clear persistent localStorage to strictly enforce session-based login
      localStorage.removeItem('hbbr_admin_auth');
      const authed = sessionStorage.getItem('hbbr_admin_auth') === 'true';
      setIsAdminLoggedIn(authed);
      setAdminPassword('');
      setLoginError('');
      // Lock body scroll
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) {
      setLoginError('관리자 비밀번호를 입력해 주세요.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('hbbr_admin_auth', 'true');
        localStorage.removeItem('hbbr_admin_auth');
        setIsAdminLoggedIn(true);
        setAdminPassword('');
        setLoginError('');
        onClose();
        navigate('/admin');
      } else {
        setLoginError(data.error || '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      }
    } catch (err) {
      setLoginError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('hbbr_admin_auth');
    localStorage.removeItem('hbbr_admin_auth');
    setIsAdminLoggedIn(false);
    setAdminPassword('');
    setLoginError('');
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
            {/* 1. Admin Management Card (Featured Top Box - Login Enforced) */}
            <div className="rounded-2xl border-2 border-brand-sage/40 bg-gradient-to-br from-brand-green/25 via-emerald-50/40 to-brand-beige/40 p-5 shadow-xs relative overflow-hidden">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-brand-sage text-white flex items-center justify-center shrink-0 shadow-sm">
                    {isAdminLoggedIn ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-brand-brown flex items-center gap-1.5">
                        운영자 관리 모드 (Admin Portal)
                      </h3>
                      {isAdminLoggedIn ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[11px] font-bold">
                          ● 로그인 인증됨
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[11px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 로그인 필수
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-brown/75 mt-1 leading-relaxed">
                      예약 접수 내역 및 개인정보 보호를 위해 **비밀번호 인증 후**에만 관리자 모드에 접근할 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* If Not Logged In: Inline Secure Login Form */}
                {!isAdminLoggedIn ? (
                  <form onSubmit={handleAdminLogin} className="mt-1 pt-3 border-t border-brand-green/30">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-brand-brown/40" />
                        </div>
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => {
                            setAdminPassword(e.target.value);
                            if (loginError) setLoginError('');
                          }}
                          placeholder="관리자 비밀번호 입력"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-brand-green/50 rounded-xl text-xs text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-sage focus:border-brand-sage transition-all shadow-2xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="px-5 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isLoggingIn ? (
                          <span>인증 확인 중...</span>
                        ) : (
                          <>
                            <span>로그인 후 접속</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {loginError && (
                      <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{loginError}</span>
                      </p>
                    )}
                  </form>
                ) : (
                  /* If Already Logged In: Direct Access & Logout Buttons */
                  <div className="mt-1 pt-3 border-t border-brand-green/30 flex flex-wrap items-center justify-between gap-2.5">
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      현재 관리자 권한으로 로그인되어 있습니다.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleNavigate('/admin')}
                        className="px-4 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>관리자 모드 바로가기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="px-3 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin features mini badges */}
              <div className="mt-3 pt-3 border-t border-brand-green/20 flex flex-wrap items-center gap-2 text-[11px] text-brand-brown/70 font-medium">
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/30">
                  <CheckCircle2 className="w-3 h-3 text-brand-sage" /> 예약 접수 실시간 관리
                </span>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/30">
                  <CheckCircle2 className="w-3 h-3 text-brand-sage" /> 주간/월간 마감 설정·해제
                </span>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/30">
                  <CheckCircle2 className="w-3 h-3 text-brand-sage" /> 알림톡 자동/수동 발송
                </span>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/30">
                  <CheckCircle2 className="w-3 h-3 text-brand-sage" /> 관리자 비밀번호 변경
                </span>
              </div>
            </div>

            {/* 2. Structured Sitemap Grid */}
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
                      onClick={() => handleNavigate('/programs')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>집단 프로그램 & 기업 EAP</span>
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
                      onClick={() => handleNavigate('/guide')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>상담 절차 및 진행 방법</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/guide')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>비용 안내 및 환불 규정</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/guide')}
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

              {/* Category 5: 커뮤니티 & 소통 */}
              <div className="bg-brand-beige/25 rounded-2xl p-4 border border-brand-green/25 hover:border-brand-sage/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-green/20">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-brown">소통 & 칼럼</h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/community')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>공지사항 & 소식</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/community')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>마음 편지 & 상담 후기</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/community')}
                      className="w-full text-left py-1 px-2 rounded-lg hover:bg-brand-green/20 text-brand-brown/85 font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span>심리학 전문 칼럼</span>
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
          <div className="px-6 py-3.5 bg-brand-beige/30 border-t border-brand-green/20 flex items-center justify-between text-xs text-brand-brown/60">
            <span>© 행복바람심리상담연구소 · www.hbbr.kr</span>
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
    </AnimatePresence>
  );
}
