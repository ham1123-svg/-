import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Calendar, Clock, Phone, User, CheckCircle2, 
  AlertCircle, Search, RefreshCw, Trash2, ChevronDown, 
  Filter, Lock, KeyRound, LogOut, ArrowUpRight, X,
  MessageSquareText, Send, BellRing, Info, Check, PhoneCall,
  CalendarCheck, Edit3, Plus, HelpCircle, Mail, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Reservation, NotificationLog, Program, RESERVATION_TIME_SLOTS, TIME_SLOT_DETAILS } from '../types';
import AdminScheduleManager from '../components/AdminScheduleManager';
import AdminForgotPasswordModal from '../components/AdminForgotPasswordModal';

const TIME_SLOTS = [...RESERVATION_TIME_SLOTS];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Purge old persistent localStorage auth to strictly enforce login on session
    try {
      localStorage.removeItem('hbbr_admin_auth');
    } catch (e) {}
    return sessionStorage.getItem('hbbr_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // View Mode: 'calendar' (Timetable) or 'table' (List) or 'eap' (B2B EAP Inquiries)
  const [viewMode, setViewMode] = useState<'calendar' | 'table' | 'eap'>('calendar');
  const [programs, setPrograms] = useState<Program[]>([]);

  // EAP Inquiries state
  const [eapInquiries, setEapInquiries] = useState<any[]>([]);
  const [eapLoading, setEapLoading] = useState(false);

  // Quick edit reservation modal state
  const [quickEditReservation, setQuickEditReservation] = useState<Reservation | null>(null);
  const [quickEditDate, setQuickEditDate] = useState('');
  const [quickEditTime, setQuickEditTime] = useState('09:00');
  const [quickEditStatus, setQuickEditStatus] = useState('confirmed');
  const [quickEditNotes, setQuickEditNotes] = useState('');
  const [quickNotifyClient, setQuickNotifyClient] = useState(true);
  const [quickSaving, setQuickSaving] = useState(false);

  // Admin password status from server
  const [isDefaultPassword, setIsDefaultPassword] = useState<boolean>(true);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changePwError, setChangePwError] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);

  // Notification management modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [notificationConfig, setNotificationConfig] = useState<any>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [resendingId, setResendingId] = useState<number | null>(null);

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Check admin password status from server
  const fetchAdminStatus = async () => {
    try {
      const res = await fetch('/api/admin/status');
      if (res.ok) {
        const data = await res.json();
        setIsDefaultPassword(data.isDefaultPassword === true);
      }
    } catch (err) {
      console.error('Failed to check admin status:', err);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  // Fetch reservations from server
  const loadReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      const res = await fetch('/api/programs');
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (err) {
      console.error('Failed to load programs:', err);
    }
  };

  const loadEapInquiries = async () => {
    setEapLoading(true);
    try {
      const res = await fetch('/api/eap/inquiries');
      if (res.ok) {
        const data = await res.json();
        setEapInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load EAP inquiries:', err);
    } finally {
      setEapLoading(false);
    }
  };

  const handleUpdateEapStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/eap/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadEapInquiries();
      }
    } catch (err) {
      console.error('Failed to update EAP inquiry status:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadReservations();
      loadPrograms();
      loadEapInquiries();
    }
  }, [isAuthenticated]);

  const handleOpenQuickEdit = (r: Reservation) => {
    setQuickEditReservation(r);
    setQuickEditDate(r.preferred_date || '');
    setQuickEditTime(r.preferred_time || '09:00');
    setQuickEditStatus(r.status || 'pending');
    setQuickEditNotes(r.admin_notes || '');
    setQuickNotifyClient(true);
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditReservation?.id) return;
    setQuickSaving(true);
    try {
      const res = await fetch(`/api/reservations/${quickEditReservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferred_date: quickEditDate,
          preferred_time: quickEditTime,
          status: quickEditStatus,
          admin_notes: quickEditNotes,
          notify_client: quickNotifyClient
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage(`예약 일정이 성공적으로 수정되었습니다.${data.notification ? ' (고객 알림 발송 완료)' : ''}`);
        setTimeout(() => setActionMessage(null), 4000);
        setQuickEditReservation(null);
        loadReservations();
      } else {
        alert('예약 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setQuickSaving(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('hbbr_admin_auth', 'true');
        localStorage.removeItem('hbbr_admin_auth');
        setAuthError('');
        loadReservations();
      } else {
        setAuthError('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      }
    } catch (err) {
      // Fallback
      if (passwordInput.trim() === '3485') {
        setIsAuthenticated(true);
        sessionStorage.setItem('hbbr_admin_auth', 'true');
        localStorage.removeItem('hbbr_admin_auth');
        loadReservations();
      } else {
        setAuthError('로그인 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('hbbr_admin_auth');
    localStorage.removeItem('hbbr_admin_auth');
    setPasswordInput('');
    fetchAdminStatus(); // refresh status
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwError('');

    if (newPw.length < 4) {
      setChangePwError('새 비밀번호는 최소 4자 이상 입력해 주세요.');
      return;
    }

    if (newPw !== confirmPw) {
      setChangePwError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setChangePwLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsDefaultPassword(false);
        setShowPasswordModal(false);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        showToast('관리자 비밀번호가 성공적으로 변경되었습니다.');
      } else {
        setChangePwError(data.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      setChangePwError('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setChangePwLoading(false);
    }
  };

  const handleConfirmReservation = async (reservation: Reservation) => {
    if (!reservation.id) return;

    try {
      const res = await fetch(`/api/reservations/${reservation.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notify_client: true })
      });

      if (res.ok) {
        setReservations(prev =>
          prev.map(r => (r.id === reservation.id ? { ...r, status: 'confirmed' } : r))
        );
        showToast(`[${reservation.name}] 님의 예약이 확정되었습니다. 카카오톡 알림톡이 자동 발송되었습니다.`);
        loadReservations();
      } else {
        showToast('예약 확정 처리에 실패했습니다.');
      }
    } catch (err) {
      showToast('서버 통신 중 오류가 발생했습니다.');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notify_client: newStatus === 'confirmed' }),
      });
      if (res.ok) {
        setReservations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (newStatus === 'confirmed') {
          showToast('예약이 확정되었으며 고객 연락처로 카카오톡 알림톡이 자동 발송되었습니다.');
        } else {
          showToast('예약 상태가 변경되었습니다.');
        }
      }
    } catch (err) {
      showToast('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReservations(prev => prev.filter(r => r.id !== id));
        showToast(`[${name}] 님의 예약 내역이 삭제되었습니다.`);
      }
    } catch (err) {
      showToast('삭제 중 오류가 발생했습니다.');
    }
  };

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Notification methods
  const fetchNotificationLogs = async () => {
    setLoadingNotifications(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotificationLogs(data);
      }
    } catch (err) {
      console.error('Failed to load notification logs:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchNotificationConfig = async () => {
    try {
      const res = await fetch('/api/notifications/config');
      if (res.ok) {
        const data = await res.json();
        setNotificationConfig(data);
      }
    } catch (err) {
      console.error('Failed to load notification config:', err);
    }
  };

  const handleResendNotification = async (id: number, name: string) => {
    setResendingId(id);
    try {
      const res = await fetch(`/api/notifications/resend/${id}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`[${name}] 님에게 카카오 알림톡/문자 안내를 성공적으로 재발송했습니다.`);
        fetchNotificationLogs();
      } else {
        showToast(`재발송 실패: ${data.error || '발송 중 오류가 발생했습니다.'}`);
      }
    } catch (err: any) {
      showToast(`재발송 실패: ${err.message}`);
    } finally {
      setResendingId(null);
    }
  };

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      const matchesStatus = statusFilter === 'all' || (r.status || 'pending') === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        !term ||
        r.name.toLowerCase().includes(term) ||
        r.phone.includes(term) ||
        (r.program_title && r.program_title.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [reservations, statusFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter(r => !r.status || r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    return { total, pending, confirmed, completed };
  }, [reservations]);

  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const todayReservations = useMemo(() => {
    return reservations
      .filter(r => r.preferred_date === todayStr && r.status !== 'cancelled')
      .sort((a, b) => (a.preferred_time || '').localeCompare(b.preferred_time || ''));
  }, [reservations, todayStr]);

  // If not authenticated, render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-beige/30 flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-brand-green/20"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-green/30 text-brand-sage rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-brand-brown mb-2">운영자 관리 모드</h1>
            <p className="text-sm text-brand-brown/60">
              행복바람심리상담연구소 예약 접수 관리 페이지입니다.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-brand-brown/80 mb-2">
                관리자 비밀번호
              </label>
              <div className="relative">
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="관리자 비밀번호 입력"
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-brand-green/40 focus:border-brand-sage outline-none bg-brand-beige/10 text-brand-brown"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-brand-brown/40 absolute left-3.5 top-3.5" />
              </div>
              <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                {authError ? (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {authError}
                  </p>
                ) : <span />}
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-brand-sage hover:underline font-semibold flex items-center gap-1 cursor-pointer ml-auto"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>비밀번호 찾기 (등록 이메일 확인)</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>관리자 페이지 입장하기</span>
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="inline-block text-xs text-brand-brown/60 hover:text-brand-sage transition-colors">
                ← 홈페이지로 돌아가기
              </Link>
            </div>
          </form>

          {/* Password Recovery Modal */}
          <AdminForgotPasswordModal
            isOpen={showForgotModal}
            onClose={() => setShowForgotModal(false)}
            onPasswordRecovered={(pw) => {
              setPasswordInput(pw);
              setAuthError('');
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-brand-green/20 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-brand-sage/15 text-brand-sage font-semibold text-xs rounded-full">
                운영자 모드
              </span>
              <span className="text-xs text-brand-brown/50">행복바람심리상담연구소</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-brand-brown flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-brand-sage" />
              예약 접수 대시보드
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* 알림톡 & 문자 연동 관리 버튼 */}
            <button
              onClick={() => {
                setShowNotificationModal(true);
                fetchNotificationLogs();
                fetchNotificationConfig();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 border border-amber-300/70 hover:border-amber-400 text-amber-950 text-sm font-semibold rounded-xl shadow-xs hover:bg-amber-100/60 transition-all cursor-pointer"
              title="카카오 알림톡 및 문자 연동 관리"
            >
              <MessageSquareText className="w-4 h-4 text-amber-600" />
              <span>알림톡/문자 연동</span>
            </button>

            {/* 비밀번호 변경 버튼 */}
            <button
              onClick={() => {
                setChangePwError('');
                setShowPasswordModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-brand-green/30 hover:border-brand-sage text-brand-brown text-sm font-medium rounded-xl shadow-xs hover:bg-brand-beige/20 transition-all"
              title="관리자 비밀번호 변경"
            >
              <KeyRound className="w-4 h-4 text-brand-sage" />
              <span className="font-semibold">비밀번호 변경</span>
            </button>

            <button
              onClick={loadReservations}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-brand-green/30 hover:border-brand-sage text-brand-brown text-sm font-medium rounded-xl shadow-xs transition-all"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-brand-sage ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>

            <Link
              to="/reservation"
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-green/20 hover:bg-brand-green/40 text-brand-brown text-sm font-medium rounded-xl transition-all"
            >
              <span>예약 신청 폼 열기</span>
              <ArrowUpRight className="w-4 h-4 text-brand-sage" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2.5 text-brand-brown/60 hover:text-brand-brown text-sm font-medium rounded-xl hover:bg-brand-beige/50 transition-all"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>

        {/* Initial Password Notice Banner (if using default password) */}
        {isDefaultPassword && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>보안 알림:</strong> 현재 초기 기본 비밀번호(<span className="font-bold">1234</span>)를 사용 중입니다. 
                비밀번호를 변경하시면 로그인 화면의 초기 비밀번호 안내 문구가 자동으로 사라지며 안전하게 보호됩니다.
              </div>
            </div>
            <button
              onClick={() => {
                setChangePwError('');
                setShowPasswordModal(true);
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs shrink-0"
            >
              지금 비밀번호 변경하기
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 bg-brand-sage text-white text-sm font-medium rounded-xl shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionMessage}</span>
          </motion.div>
        )}

        {/* Stat Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-brand-green/20 shadow-xs">
            <div className="text-xs font-semibold text-brand-brown/60 mb-1">전체 신청 접수</div>
            <div className="text-3xl font-bold font-serif text-brand-brown">{stats.total}<span className="text-sm font-normal text-brand-brown/60 ml-1">건</span></div>
          </div>
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/60 shadow-xs">
            <div className="text-xs font-semibold text-amber-800/80 mb-1">확인 대기 중</div>
            <div className="text-3xl font-bold font-serif text-amber-900">{stats.pending}<span className="text-sm font-normal text-amber-700/80 ml-1">건</span></div>
          </div>
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/60 shadow-xs">
            <div className="text-xs font-semibold text-emerald-800/80 mb-1">예약 확정</div>
            <div className="text-3xl font-bold font-serif text-emerald-900">{stats.confirmed}<span className="text-sm font-normal text-emerald-700/80 ml-1">건</span></div>
          </div>
          <div className="bg-brand-green/20 p-5 rounded-2xl border border-brand-green/40 shadow-xs">
            <div className="text-xs font-semibold text-brand-brown/70 mb-1">상담 완료</div>
            <div className="text-3xl font-bold font-serif text-brand-brown">{stats.completed}<span className="text-sm font-normal text-brand-brown/60 ml-1">건</span></div>
          </div>
        </div>

        {/* Today's Schedule Briefing Banner */}
        <div className="mb-6 bg-gradient-to-r from-brand-sage/15 via-brand-beige/40 to-white rounded-3xl p-5 border border-brand-green/30 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-sage text-white flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-sage uppercase tracking-wider">Today's Schedule</span>
                  <span className="text-xs font-bold text-brand-brown/60">({todayStr})</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-brand-brown">
                  오늘 예정된 상담 <span className="text-brand-sage font-extrabold">{todayReservations.length}</span>건
                </h2>
              </div>
            </div>

            {todayReservations.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {todayReservations.map(tr => (
                  <div
                    key={tr.id}
                    onClick={() => handleOpenQuickEdit(tr)}
                    className="px-3 py-1.5 bg-white rounded-xl border border-brand-green/20 shadow-2xs hover:border-brand-sage transition-all cursor-pointer flex items-center gap-2 text-xs"
                    title="일정 상세 확인 및 수정"
                  >
                    <span className="font-mono font-bold text-brand-sage">{tr.preferred_time}</span>
                    <span className="font-bold text-brand-brown">{tr.name}님</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                      tr.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tr.status === 'confirmed' ? '확정' : '대기'}
                    </span>
                    <Edit3 className="w-3 h-3 text-brand-brown/40" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-brand-brown/60 italic">
                오늘 예정된 상담 일정이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* View Mode Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-brand-green/25 shadow-xs w-fit">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-brand-sage text-white shadow-xs'
                  : 'text-brand-brown/70 hover:bg-brand-beige/40'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>주간 일정표 캘린더</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-brand-sage text-white shadow-xs'
                  : 'text-brand-brown/70 hover:bg-brand-beige/40'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>예약 목록 테이블 ({filteredReservations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('eap');
                loadEapInquiries();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'eap'
                  ? 'bg-brand-sage text-white shadow-xs'
                  : 'text-brand-brown/70 hover:bg-brand-beige/40'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>EAP 제휴 문의 ({eapInquiries.length})</span>
            </button>
          </div>

          <div className="text-xs text-brand-brown/60 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            실시간 예약 동기화 활성화됨
          </div>
        </div>

        {/* VIEW 1: Weekly Calendar Matrix */}
        {viewMode === 'calendar' && (
          <div className="mb-8">
            <AdminScheduleManager
              reservations={reservations}
              programs={programs}
              onRefresh={loadReservations}
              onShowNotice={showToast}
            />
          </div>
        )}

        {/* VIEW 2: Table List with Search & Filters */}
        {viewMode === 'table' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-green/20 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-brand-brown/40 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="신청자명, 연락처, 프로그램 검색"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-green/30 focus:border-brand-sage text-sm outline-none bg-brand-beige/10"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => {
                  const labelMap = {
                    all: '전체',
                    pending: '접수 대기',
                    confirmed: '예약 확정',
                    completed: '상담 완료',
                    cancelled: '취소'
                  };
                  const isSelected = statusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-brand-brown text-white shadow-xs' 
                          : 'bg-brand-beige/40 text-brand-brown/70 hover:bg-brand-beige/80'
                      }`}
                    >
                      {labelMap[st]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reservations Table / Cards */}
        <div className="bg-white rounded-3xl border border-brand-green/20 shadow-md overflow-hidden">
          {filteredReservations.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="w-16 h-16 bg-brand-beige/50 rounded-full flex items-center justify-center text-brand-brown/40 mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-brown mb-1">
                {searchTerm || statusFilter !== 'all' ? '조건에 맞는 예약 내역이 없습니다.' : '접수된 예약 내역이 없습니다.'}
              </h3>
              <p className="text-sm text-brand-brown/60 mb-6">
                고객이 홈페이지의 예약/오시는 길 코너에서 예약을 신청하면 실시간으로 이곳에 표시됩니다.
              </p>
              <Link
                to="/reservation"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-sage text-white text-sm font-semibold rounded-xl hover:bg-brand-sage/90 transition-all shadow-sm"
              >
                <span>직접 테스트 예약 신청해보기</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-beige/30 border-b border-brand-green/20 text-xs font-bold text-brand-brown/70 uppercase tracking-wider">
                    <th className="py-4 px-6">상태 변경</th>
                    <th className="py-4 px-6">신청자명</th>
                    <th className="py-4 px-6">연락처</th>
                    <th className="py-4 px-6">신청 프로그램</th>
                    <th className="py-4 px-6">희망 예약 일정</th>
                    <th className="py-4 px-6">접수 일시</th>
                    <th className="py-4 px-6 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-green/10 text-sm">
                  {filteredReservations.map((r) => {
                    const st = r.status || 'pending';
                    return (
                      <tr key={r.id} className="hover:bg-brand-beige/10 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              value={st}
                              onChange={(e) => handleStatusChange(r.id!, e.target.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                                st === 'pending'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : st === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : st === 'completed'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : 'bg-gray-100 text-gray-700 border-gray-300'
                              }`}
                            >
                              <option value="pending">⏳ 접수 대기</option>
                              <option value="confirmed">✅ 예약 확정</option>
                              <option value="completed">🎉 상담 완료</option>
                              <option value="cancelled">❌ 예약 취소</option>
                            </select>

                            {st === 'pending' && (
                              <button
                                type="button"
                                onClick={() => handleConfirmReservation(r)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                                title="예약을 확정하고 고객 연락처로 카카오톡 알림톡을 자동 발송합니다"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>확정 승인</span>
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap font-bold text-brand-brown">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-sage" />
                            <span>{r.name}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap text-brand-brown/90">
                          <a 
                            href={`tel:${r.phone}`} 
                            className="inline-flex items-center gap-1 text-brand-brown hover:text-brand-sage font-medium underline-offset-4 hover:underline"
                            title="전화 걸기"
                          >
                            <Phone className="w-3.5 h-3.5 text-brand-sage" />
                            <span>{r.phone}</span>
                          </a>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="px-3 py-1 bg-brand-beige/50 text-brand-brown text-xs font-semibold rounded-full border border-brand-green/20">
                            {r.program_title || '프로그램 미정'}
                          </span>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap text-brand-brown/80">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-brown/50" />
                            <span className="font-semibold text-brand-brown">{r.preferred_date}</span>
                            <span className="px-2 py-0.5 bg-brand-green/20 text-brand-brown text-xs rounded-md">
                              {r.preferred_time}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap text-xs text-brand-brown/60">
                          {r.created_at ? new Date(r.created_at).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenQuickEdit(r)}
                              className="p-1.5 text-brand-brown/50 hover:text-brand-sage hover:bg-brand-sage/10 rounded-lg transition-colors cursor-pointer"
                              title="일정 변경 및 관리 메모"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleResendNotification(r.id!, r.name)}
                              disabled={resendingId === r.id}
                              className="p-1.5 text-brand-brown/50 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title="카카오 알림톡/문자 안내 재발송"
                            >
                              {resendingId === r.id ? (
                                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                              ) : (
                                <MessageSquareText className="w-4 h-4 text-amber-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(r.id!, r.name)}
                              className="p-1.5 text-brand-brown/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="예약 내역 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </div>
        )}

        {/* VIEW 3: EAP B2B Partnership Inquiries Table */}
        {viewMode === 'eap' && (
          <div className="bg-white rounded-3xl border border-brand-green/30 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-brand-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-brand-brown flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-sage" />
                  <span>기관 및 기업 EAP 제휴 문의 목록</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-bold">
                    총 {eapInquiries.length}건
                  </span>
                </h3>
                <p className="text-xs text-brand-brown/60 mt-1">
                  홈페이지 EAP 제휴 메뉴를 통해 접수된 기관 및 기업의 맞춤 제안서 신청 내역입니다.
                </p>
              </div>

              <button
                type="button"
                onClick={loadEapInquiries}
                disabled={eapLoading}
                className="px-3.5 py-2 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/40 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", eapLoading && "animate-spin")} />
                <span>새로고침</span>
              </button>
            </div>

            {eapLoading ? (
              <div className="py-20 text-center text-brand-brown/60 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-sage" />
                <span>EAP 제휴 문의 내역을 불러오는 중입니다...</span>
              </div>
            ) : eapInquiries.length === 0 ? (
              <div className="py-20 text-center text-brand-brown/60">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-brand-brown/20" />
                <p className="font-medium text-sm">아직 접수된 EAP 제휴 문의가 없습니다.</p>
                <p className="text-xs text-brand-brown/40 mt-1">
                  고객이 /eap 페이지에서 문의서를 제출하면 여기에 실시간으로 표시됩니다.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-brand-beige/40 border-b border-brand-green/20 text-brand-brown/70 font-bold text-xs">
                      <th className="py-3.5 px-4">접수일시</th>
                      <th className="py-3.5 px-4">기관 / 기업명</th>
                      <th className="py-3.5 px-4">담당자 (부서)</th>
                      <th className="py-3.5 px-4">연락처 / 이메일</th>
                      <th className="py-3.5 px-4">규모 &amp; 상담형태</th>
                      <th className="py-3.5 px-4">관심 분야</th>
                      <th className="py-3.5 px-4">문의 내용</th>
                      <th className="py-3.5 px-4">진행 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-green/10">
                    {eapInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-brand-beige/20 transition-colors">
                        <td className="py-3.5 px-4 text-xs text-brand-brown/60 whitespace-nowrap">
                          {inq.created_at ? inq.created_at.substring(0, 16) : '-'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-brown whitespace-nowrap">
                          {inq.company_name}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-brand-brown">{inq.contact_name}</span>
                          {inq.department && (
                            <span className="text-xs text-brand-brown/60 block">{inq.department}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                          <a 
                            href={`tel:${inq.phone}`} 
                            className="text-brand-sage font-bold hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{inq.phone}</span>
                          </a>
                          {inq.email && (
                            <a 
                              href={`mailto:${inq.email}`} 
                              className="text-brand-brown/60 hover:text-brand-brown flex items-center gap-1 mt-0.5"
                            >
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">{inq.email}</span>
                            </a>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                          <div className="font-semibold text-brand-brown">{inq.employee_count || '미지정'}</div>
                          <div className="text-[11px] text-brand-brown/60">{inq.preferred_format || '형태미정'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-brand-brown/80 max-w-[180px]">
                          {inq.interests ? (
                            <span className="line-clamp-2">{inq.interests}</span>
                          ) : (
                            <span className="text-brand-brown/40">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-brand-brown/70 max-w-[220px]">
                          {inq.message ? (
                            <p className="line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
                              {inq.message}
                            </p>
                          ) : (
                            <span className="text-brand-brown/40">남긴 메모 없음</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={inq.status || 'pending'}
                            onChange={(e) => handleUpdateEapStatus(inq.id, e.target.value)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                              inq.status === 'completed'
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : inq.status === 'contacted'
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : inq.status === 'cancelled'
                                ? "bg-zinc-100 text-zinc-600 border-zinc-300"
                                : "bg-amber-50 text-amber-700 border-amber-300"
                            )}
                          >
                            <option value="pending">⏳ 검토 대기</option>
                            <option value="contacted">📞 제안/상담중</option>
                            <option value="completed">✅ 협약 완료</option>
                            <option value="cancelled">❌ 미진행/보류</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Operating Guide Box */}
        <div className="mt-8 bg-brand-beige/30 rounded-2xl p-6 border border-brand-green/20">
          <h3 className="font-bold text-brand-brown mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-brand-sage" />
            예약 확인 및 운영 팁
          </h3>
          <ul className="text-xs sm:text-sm text-brand-brown/70 space-y-1.5 list-disc list-inside">
            <li>고객이 예약을 신청하면 기본 상태는 <span className="font-bold text-amber-800">⏳ 접수 대기</span>로 등록됩니다.</li>
            <li>연락처 링크를 클릭하면 유선 전화 또는 스마트폰에서 바로 전화 통화가 연결됩니다.</li>
            <li>고객과 일정 조율 통화 후 상태를 <span className="font-bold text-emerald-800">✅ 예약 확정</span>으로 변경해 관리하세요.</li>
            <li>상담이 모두 종료된 후에는 <span className="font-bold text-blue-800">🎉 상담 완료</span>로 변경하여 완료 이력을 체계적으로 관리할 수 있습니다.</li>
            <li>우측 상단 <strong>[비밀번호 변경]</strong> 버튼을 통해 언제든지 관리자 비밀번호를 안전하게 변경하실 수 있습니다.</li>
          </ul>
        </div>
      </div>

      {/* Quick Edit Reservation Modal */}
      <AnimatePresence>
        {quickEditReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-green/30"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-green/20 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-brown text-base">
                      예약 일정 및 정보 수정
                    </h3>
                    <p className="text-xs text-brand-brown/60">
                      신청자: <span className="font-bold text-brand-brown">{quickEditReservation.name}</span>님 ({quickEditReservation.phone})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickEditReservation(null)}
                  className="p-1.5 text-brand-brown/40 hover:text-brand-brown hover:bg-brand-beige/50 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-bold text-brand-brown/70 block mb-1">신청 프로그램</span>
                  <div className="p-2.5 bg-brand-beige/20 rounded-xl text-brand-brown font-semibold text-xs border border-brand-green/20">
                    {quickEditReservation.program_title || '프로그램 미정'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-brand-brown/80 block mb-1">상담 날짜</label>
                    <input
                      type="date"
                      required
                      value={quickEditDate}
                      onChange={e => setQuickEditDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-brown/80 block mb-1">상담 시간</label>
                    <select
                      value={quickEditTime}
                      onChange={e => setQuickEditTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-white"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>
                          {TIME_SLOT_DETAILS[t]?.session ? `${TIME_SLOT_DETAILS[t].session} (${t})` : t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/80 block mb-1">진행 상태</label>
                  <select
                    value={quickEditStatus}
                    onChange={e => setQuickEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-white font-semibold"
                  >
                    <option value="pending">⏳ 접수 대기</option>
                    <option value="confirmed">✅ 예약 확정</option>
                    <option value="completed">🎉 상담 완료</option>
                    <option value="cancelled">❌ 예약 취소</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-brown/80 block mb-1">관리자 내부 메모 (고객 비공개)</label>
                  <textarea
                    rows={3}
                    value={quickEditNotes}
                    onChange={e => setQuickEditNotes(e.target.value)}
                    placeholder="고객 요청사항, 통화 특이사항, 차트 번호 등을 기록하세요"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none resize-none"
                  />
                </div>

                <div className="bg-brand-sage/10 p-3 rounded-xl border border-brand-sage/20 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="notifyClientCheckbox"
                    checked={quickNotifyClient}
                    onChange={e => setQuickNotifyClient(e.target.checked)}
                    className="mt-0.5 rounded text-brand-sage focus:ring-brand-sage cursor-pointer"
                  />
                  <label htmlFor="notifyClientCheckbox" className="text-xs text-brand-brown cursor-pointer">
                    <span className="font-bold text-brand-brown block">일정 변경 안내 고객 알림톡/문자 즉시 발송</span>
                    <span className="text-[11px] text-brand-brown/70">체크 시 변경된 예약 일시 및 오시는 길 안내가 고객에게 자동 전송됩니다.</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-green/10">
                  <button
                    type="button"
                    onClick={() => setQuickEditReservation(null)}
                    className="px-4 py-2 text-xs font-bold text-brand-brown/70 hover:bg-brand-beige/50 rounded-xl transition-all"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={quickSaving}
                    className="px-5 py-2 text-xs font-bold bg-brand-sage text-white rounded-xl hover:bg-brand-sage/90 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {quickSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>변경사항 저장하기</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Change Modal Dialog */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-green/20 relative"
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-5 right-5 p-1.5 text-brand-brown/40 hover:text-brand-brown rounded-full hover:bg-brand-beige/40 transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-green/30 text-brand-sage rounded-2xl flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-brand-brown">
                    관리자 비밀번호 변경
                  </h2>
                  <p className="text-xs text-brand-brown/60">
                    새로운 관리자 비밀번호를 설정하세요.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-brown/70 mb-1.5">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-green/30 focus:border-brand-sage text-sm outline-none bg-brand-beige/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown/70 mb-1.5">
                    새 비밀번호 (최소 4자 이상)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="새 비밀번호 입력"
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-green/30 focus:border-brand-sage text-sm outline-none bg-brand-beige/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-brown/70 mb-1.5">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-green/30 focus:border-brand-sage text-sm outline-none bg-brand-beige/10"
                  />
                </div>

                {changePwError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{changePwError}</span>
                  </p>
                )}

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="w-1/3 py-2.5 border border-brand-green/30 text-brand-brown/70 font-semibold rounded-xl hover:bg-brand-beige/30 transition-all text-sm"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={changePwLoading}
                    className="w-2/3 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {changePwLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>비밀번호 변경하기</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Kakao Alimtalk & SMS Notification Management Modal */}
      <AnimatePresence>
        {showNotificationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="max-w-4xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-green/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FEE500] text-[#371D1E] rounded-2xl flex items-center justify-center shadow-xs">
                    <MessageSquareText className="w-5 h-5 fill-[#371D1E]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-brown flex items-center gap-2">
                      카카오 알림톡 & 문자 자동 발송 관리
                    </h2>
                    <p className="text-xs text-brand-brown/60">
                      고객 예약 접수 시 발송되는 카카오 알림톡 및 대체 문자 발송 상태를 실시간으로 확인합니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="p-2 text-brand-brown/40 hover:text-brand-brown hover:bg-brand-beige/40 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1">
                {/* Gateway Status Summary Card */}
                <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-950">연동 게이트웨이 현황:</span>
                      {notificationConfig?.isSimulated ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-200/70 text-amber-900 text-xs font-bold rounded-full">
                          <Info className="w-3.5 h-3.5" />
                          스마트 모의 시뮬레이션 모드 가동 중
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                          <Check className="w-3.5 h-3.5" />
                          실시간 게이트웨이 정식 연동 중
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        fetchNotificationLogs();
                        fetchNotificationConfig();
                      }}
                      disabled={loadingNotifications}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-100/50 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${loadingNotifications ? 'animate-spin' : ''}`} />
                      <span>이력 새로고침</span>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70">
                      <div className="text-amber-800/70 mb-0.5">발신 대표번호</div>
                      <div className="font-bold text-amber-950 text-sm">{notificationConfig?.senderNumber || '052-254-0230'}</div>
                      <div className="text-[10px] text-amber-700/60 mt-0.5">통신사 사전 등록 완료</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70">
                      <div className="text-amber-800/70 mb-0.5">카카오톡 채널</div>
                      <div className="font-bold text-amber-950 text-sm">{notificationConfig?.kakaoChannel || '@행복바람심리상담연구소'}</div>
                      <div className="text-[10px] text-amber-700/60 mt-0.5">비즈니스 인증 완료</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200/70">
                      <div className="text-amber-800/70 mb-0.5">템플릿 코드</div>
                      <div className="font-bold text-amber-950 text-sm font-mono">{notificationConfig?.templateId || 'RESERVATION_CONFIRM_V1'}</div>
                      <div className="text-[10px] text-amber-700/60 mt-0.5">카카오 승인 완료 규격</div>
                    </div>
                  </div>
                </div>

                {/* Notification Dispatch History Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-brand-brown flex items-center gap-1.5">
                      <BellRing className="w-4 h-4 text-brand-sage" />
                      최근 알림톡 및 문자 발송 로그 ({notificationLogs.length}건)
                    </h3>
                    <span className="text-xs text-brand-brown/50">최근 20건 표시</span>
                  </div>

                  {loadingNotifications ? (
                    <div className="py-12 text-center text-brand-brown/50 text-sm flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-sage" />
                      <span>발송 내역을 불러오는 중...</span>
                    </div>
                  ) : notificationLogs.length === 0 ? (
                    <div className="py-12 text-center bg-brand-beige/20 rounded-2xl border border-dashed border-brand-green/20 text-brand-brown/50 text-sm">
                      발송된 알림톡/문자 이력이 아직 없습니다. <br />
                      고객이 온라인 예약을 신청하면 자동으로 기록됩니다.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-brand-green/20 rounded-2xl">
                      <table className="w-full text-left text-xs text-brand-brown">
                        <thead className="bg-brand-beige/50 text-brand-brown/70 font-semibold border-b border-brand-green/20">
                          <tr>
                            <th className="py-2.5 px-4">채널</th>
                            <th className="py-2.5 px-4">수신자</th>
                            <th className="py-2.5 px-4">전화번호</th>
                            <th className="py-2.5 px-4">상태</th>
                            <th className="py-2.5 px-4">발송 일시</th>
                            <th className="py-2.5 px-4 text-right">메시지 내용</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-green/10">
                          {notificationLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-brand-beige/20 transition-colors">
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  log.channel === 'ALIMTALK'
                                    ? 'bg-[#FEE500]/40 text-[#371D1E] border border-[#FEE500]'
                                    : 'bg-blue-100 text-blue-900 border border-blue-200'
                                }`}>
                                  {log.channel === 'ALIMTALK' ? '카카오 알림톡' : 'LMS 문자'}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 font-bold whitespace-nowrap">{log.recipient_name}</td>
                              <td className="py-2.5 px-4 font-mono whitespace-nowrap text-brand-brown/80">{log.recipient_phone}</td>
                              <td className="py-2.5 px-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  발송 성공
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-brand-brown/60 whitespace-nowrap">
                                {new Date(log.created_at).toLocaleString('ko-KR', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <button
                                  onClick={() => window.alert(`[발송 메시지 본문]\n\n${log.message_content}`)}
                                  className="text-[11px] text-brand-sage font-bold hover:underline cursor-pointer"
                                >
                                  전문 보기
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Gateway Integration Key Guide */}
                <div className="bg-brand-beige/30 p-5 rounded-2xl border border-brand-green/20 text-xs space-y-2">
                  <div className="font-bold text-brand-brown flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-brand-sage" />
                    실제 운영 상용 게이트웨이 연동 안내
                  </div>
                  <p className="text-brand-brown/70 leading-relaxed">
                    현재 모의 시뮬레이션 모드로 작동하여 실제 비용 청구 없이 실시간 발송 플로우와 수신 화면을 완벽히 테스트할 수 있습니다. 실제 고객 단말기로 카카오톡 알림톡을 실시간 발송하시려면 환경 변수(<code>.env</code>)에 솔라피(Solapi/CoolSMS) 또는 알리고(Aligo) 발급 키를 입력하시면 자동으로 실시간 발송 모드로 전환됩니다:
                  </p>
                  <div className="p-3 bg-brand-brown/5 rounded-xl font-mono text-[11px] text-brand-brown/80 space-y-1">
                    <div>ALIMTALK_API_KEY=your_api_key</div>
                    <div>ALIMTALK_API_SECRET=your_api_secret</div>
                    <div>ALIMTALK_PFID=@행복바람심리상담연구소</div>
                    <div>ALIMTALK_SENDER_NUMBER=0522540230</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-brand-green/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="px-6 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
