import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Phone, User, Calendar, Clock, CheckCircle2, AlertCircle, 
  Clock3, ShieldCheck, MapPin, PhoneCall, ArrowRight, RotateCcw, 
  ChevronRight, Sparkles, MessageCircle, XCircle, Info, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Reservation, NotificationLog } from '../types';
import { useHighContrast } from '../context/HighContrastContext';
import QuickReservationModal from '../components/QuickReservationModal';

interface ReservationWithLogs extends Reservation {
  program_category?: string;
  logs?: NotificationLog[];
}

export default function ReservationStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isHighContrast } = useHighContrast();
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const initialPhone = searchParams.get('phone') || sessionStorage.getItem('last_lookup_phone') || '';
  const initialName = searchParams.get('name') || sessionStorage.getItem('last_lookup_name') || '';

  const [phone, setPhone] = useState(initialPhone);
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<ReservationWithLogs[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Quick Reservation modal trigger
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState<ReservationWithLogs | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  // Auto-format phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);

    let formatted = raw;
    if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    }
    setPhone(formatted);
    if (errorMessage) setErrorMessage('');
  };

  const handleSearch = async (overridePhone?: string) => {
    const searchPhone = (overridePhone || phone).trim();
    setErrorMessage('');
    setCancelSuccessMsg('');

    const cleanDigits = searchPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 8) {
      setErrorMessage('연락처(휴대폰 번호)를 8자리 이상 정확하게 입력해 주세요.');
      phoneInputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/reservations/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: searchPhone,
          name: name.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '예약 내역 조회 중 오류가 발생했습니다.');
      }

      setResults(data.reservations || []);
      setHasSearched(true);

      // Save to sessionStorage for returning session
      sessionStorage.setItem('last_lookup_phone', searchPhone);
      if (name.trim()) sessionStorage.setItem('last_lookup_name', name.trim());
    } catch (err: any) {
      setErrorMessage(err.message || '네트워크 통신 중 오류가 발생했습니다.');
      setResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform search automatically if phone provided in URL params
  useEffect(() => {
    const paramPhone = searchParams.get('phone');
    if (paramPhone && paramPhone.trim().length >= 8) {
      handleSearch(paramPhone);
    }
  }, []);

  const handleReset = () => {
    setPhone('');
    setName('');
    setResults([]);
    setHasSearched(false);
    setErrorMessage('');
    setCancelSuccessMsg('');
    sessionStorage.removeItem('last_lookup_phone');
    sessionStorage.removeItem('last_lookup_name');
    phoneInputRef.current?.focus();
  };

  // Submit client cancellation
  const handleConfirmCancel = async () => {
    if (!cancelTarget?.id) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/reservations/${cancelTarget.id}/cancel-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cancelTarget.phone,
          reason: cancelReason.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '취소 처리에 실패했습니다.');
      }

      setCancelSuccessMsg('예약 취소 요청이 정상 처리되었습니다.');
      setCancelTarget(null);
      setCancelReason('');
      // Re-fetch updated status
      handleSearch();
    } catch (err: any) {
      alert(err.message || '취소 요청 중 오류가 발생했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>예약 확정</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>상담 완료</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>예약 취소</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock3 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>접수 완료 (확인 중)</span>
          </span>
        );
    }
  };

  return (
    <div className="py-12 bg-brand-beige/30 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Mode Switcher */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-white border border-brand-green/30 shadow-2xs">
            <Link
              to="/reservation"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-brand-brown/70 hover:text-brand-sage hover:bg-brand-green/10 transition-all"
            >
              신규 상담 예약하기
            </Link>
            <span className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-sage text-white shadow-2xs">
              예약 상태 조회
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsQuickModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-sage hover:text-brand-brown transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>전화 간편예약 신청</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-3 border border-brand-sage/20">
            <Search className="w-3.5 h-3.5" />
            <span>Check Reservation Status</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown tracking-tight">
            상담 예약 및 신청 상태 조회
          </h1>
          <p className="mt-3 text-sm sm:text-base font-serif text-brand-brown/70 leading-relaxed">
            상담 신청 시 기재하셨던 <strong className="text-brand-brown font-semibold">연락처(휴대폰 번호)</strong>를 입력하시면, 
            현재 접수 내역 및 예약 확정 진행 상황을 실시간으로 확인하실 수 있습니다.
          </p>
        </div>

        {/* Lookup Card Form */}
        <div className={cn(
          "rounded-3xl p-6 sm:p-8 shadow-xl border mb-10 transition-all",
          isHighContrast
            ? "bg-neutral-950 text-white border-2 border-white"
            : "bg-white text-brand-brown border-brand-green/30"
        )}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Input (Required) */}
              <div>
                <label htmlFor="lookup-phone" className="block text-xs font-bold text-brand-brown mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-sage" />
                    <span>연락처 (휴대폰 번호)</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </span>
                  <span className="text-[11px] text-brand-brown/50">숫자만 입력 가능</span>
                </label>
                <div className="relative">
                  <input
                    id="lookup-phone"
                    ref={phoneInputRef}
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    className="w-full pl-4 pr-10 py-3.5 rounded-2xl border border-brand-green/40 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-hidden text-sm bg-brand-beige/10 font-mono transition-all"
                  />
                  {phone && (
                    <button
                      type="button"
                      onClick={() => setPhone('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/40 hover:text-brand-brown p-1"
                      aria-label="연락처 지우기"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name Input (Optional) */}
              <div>
                <label htmlFor="lookup-name" className="block text-xs font-bold text-brand-brown mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-sage" />
                    <span>예약자 성함</span>
                    <span className="text-brand-brown/50 font-normal">(선택사항)</span>
                  </span>
                  <span className="text-[11px] text-brand-brown/50">더 정확한 조회</span>
                </label>
                <input
                  id="lookup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="신청 시 입력한 성함"
                  className="w-full px-4 py-3.5 rounded-2xl border border-brand-green/40 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-hidden text-sm bg-brand-beige/10 font-serif transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Cancel Success Message */}
            {cancelSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{cancelSuccessMsg}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-brand-brown/60">
                <ShieldCheck className="w-4 h-4 text-brand-sage shrink-0" />
                <span>100% 비밀보장 · SSL 암호화 안전 조회</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(phone || hasSearched) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 rounded-2xl text-xs font-semibold text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>초기화</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98",
                    isLoading && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>조회 중...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>예약 내역 조회하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-brand-brown flex items-center gap-2">
                <span>조회 결과</span>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-green/40 text-brand-sage text-xs font-extrabold">
                  {results.length}건
                </span>
              </h2>

              <span className="text-xs text-brand-brown/60 font-mono">
                기준 번호: {phone}
              </span>
            </div>

            {results.length === 0 ? (
              /* No Results State */
              <div className="rounded-3xl p-8 sm:p-12 text-center bg-white border border-brand-green/30 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-beige/70 text-brand-brown/50 flex items-center justify-center mx-auto mb-2">
                  <Info className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-brown">
                  접수된 상담 예약 내역이 없습니다
                </h3>
                <p className="text-sm font-serif text-brand-brown/70 max-w-md mx-auto leading-relaxed">
                  입력하신 연락처 <strong className="font-mono text-brand-brown">({phone})</strong>로 등록된 예약이 없습니다.<br />
                  휴대폰 번호를 다시 확인해 주시거나, 새로운 상담 예약을 신청해 주세요.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/reservation"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>새 온라인 상담 예약하기</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsQuickModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-brand-green/20 text-brand-brown border border-brand-green/40 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-brand-sage" />
                    <span>간편 전화상담(콜백) 요청</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Results List */
              <div className="space-y-4">
                {results.map((res) => {
                  const isPending = res.status === 'pending';
                  const isConfirmed = res.status === 'confirmed';
                  const isCompleted = res.status === 'completed';
                  const isCancelled = res.status === 'cancelled';

                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-3xl p-6 sm:p-7 border shadow-md transition-all bg-white",
                        isConfirmed 
                          ? "border-emerald-300 ring-2 ring-emerald-500/10" 
                          : isPending 
                            ? "border-amber-300 ring-2 ring-amber-500/10" 
                            : "border-brand-green/30"
                      )}
                    >
                      {/* Top Bar: Status Badge + Date Created */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-brand-green/20">
                        <div className="flex items-center gap-2.5">
                          {getStatusBadge(res.status)}
                          <span className="text-xs font-mono text-brand-brown/50">
                            예약번호 #{res.id}
                          </span>
                        </div>

                        {res.created_at && (
                          <span className="text-xs text-brand-brown/60">
                            접수일시: {new Date(res.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                          <span className="text-xs font-bold text-brand-brown/60 block mb-1">
                            신청 프로그램
                          </span>
                          <p className="text-base sm:text-lg font-serif font-bold text-brand-brown">
                            {res.program_title || (res.admin_notes?.includes('간편') ? '간편 전화상담(콜백) 요청' : '맞춤 심리상담')}
                          </p>
                          {res.program_category && (
                            <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md bg-brand-green/30 text-brand-brown/80 font-medium">
                              {res.program_category}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-bold text-brand-brown/60 block mb-1">
                            희망 예약 일시
                          </span>
                          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-brand-sage font-mono">
                            <Calendar className="w-4 h-4 text-brand-sage shrink-0" />
                            <span>{res.preferred_date || '일정 협의'}</span>
                            <span className="text-brand-brown/40">|</span>
                            <Clock className="w-4 h-4 text-brand-sage shrink-0" />
                            <span>{res.preferred_time || '시간 협의'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Guidance Notice Box */}
                      {isConfirmed && (
                        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-2 mb-4">
                          <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>상담 예약이 확정되었습니다!</span>
                          </div>
                          <p className="leading-relaxed">
                            원장 박미경 상담사와의 세션이 확정되었습니다. 편안한 마음으로 방문해 주시기 바랍니다. 
                            상담 시작 10분 전에 도착하시면 따뜻한 웰컴티와 함께 심리적 안정을 취하실 수 있습니다.
                          </p>
                          <div className="pt-1 flex flex-wrap gap-3 text-[11px] text-emerald-800/80 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              울산 울주군 삼남읍 도호1길 23 상가 408호
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              문의: 052-254-0230
                            </span>
                          </div>
                        </div>
                      )}

                      {isPending && (
                        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2 mb-4">
                          <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                            <Clock3 className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>상담사가 접수 내용을 확인하고 있습니다</span>
                          </div>
                          <p className="leading-relaxed">
                            전문 상담사가 접수 순서에 따라 일정을 확인한 후, 기재하신 연락처로 직접 전화 또는 카카오 알림톡으로 확정 안내를 드립니다.
                            빠른 일정 확정이나 변경이 필요하시면 연구소 대표 번호로 편하게 말씀해 주세요.
                          </p>
                        </div>
                      )}

                      {isCancelled && (
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-1 mb-4">
                          <div className="flex items-center gap-2 font-bold text-zinc-800">
                            <XCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span>취소 처리된 예약입니다</span>
                          </div>
                          <p className="leading-relaxed">
                            해당 상담 예약은 취소되었습니다. 다시 상담이 필요하실 때는 언제든 편안히 신규 예약을 진행해 주시기 바랍니다.
                          </p>
                        </div>
                      )}

                      {/* Bottom Actions for Card */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-green/20 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-brown/70">
                            예약자: <strong>{res.name}</strong> 님
                          </span>
                          <span className="text-brand-brown/40">|</span>
                          <span className="font-mono text-brand-brown/70">
                            {res.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(res)}
                              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              예약 취소 요청
                            </button>
                          )}

                          <a
                            href="tel:052-254-0230"
                            className="px-3 py-1.5 rounded-xl bg-brand-green/30 hover:bg-brand-sage hover:text-white text-brand-brown text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>전화 문의</span>
                          </a>

                          <Link
                            to="/reservation#location"
                            className="px-3 py-1.5 rounded-xl bg-brand-beige/50 hover:bg-brand-beige text-brand-brown text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <MapPin className="w-3.5 h-3.5 text-brand-sage" />
                            <span>오시는 길</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Guidance FAQ / Help Box */}
        <div className="mt-14 rounded-3xl p-6 sm:p-8 bg-brand-beige/40 border border-brand-green/30 space-y-4">
          <div className="flex items-center gap-2 text-brand-brown font-serif font-bold text-base">
            <Info className="w-5 h-5 text-brand-sage" />
            <span>예약 조회 관련 자주 묻는 질문</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed text-brand-brown/80">
            <div className="p-4 rounded-2xl bg-white border border-brand-green/20">
              <strong className="block text-brand-brown font-bold mb-1">
                Q. 신청 후 언제 예약이 확정되나요?
              </strong>
              <p>
                전문 상담사가 세션 중이 아닌 경우 보통 1~2시간 이내, 늦어도 당일 업무 시간(10:00~20:00) 내에 유선 확인 또는 카카오 알림톡으로 확정 안내를 드립니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-brand-green/20">
              <strong className="block text-brand-brown font-bold mb-1">
                Q. 일정을 변경하거나 취소하고 싶어요.
              </strong>
              <p>
                접수 완료(확인 중) 상태에서는 위 [예약 취소 요청] 버튼을 누르시거나, 대표 전화(052-254-0230)로 연락 주시면 원하시는 다른 날짜로 즉시 조율해 드립니다.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Client Cancellation Modal */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelTarget(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl p-6 bg-white border border-brand-green/30 shadow-2xl z-10"
            >
              <h3 className="text-lg font-serif font-bold text-brand-brown mb-2">
                상담 예약 취소 요청
              </h3>
              <p className="text-xs text-brand-brown/70 mb-4 leading-relaxed">
                <strong>{cancelTarget.name}</strong> 님의 [{cancelTarget.program_title || '맞춤 심리상담'}] 
                ({cancelTarget.preferred_date} {cancelTarget.preferred_time}) 예약을 취소하시겠습니까?
              </p>

              <div className="mb-4">
                <label className="block text-xs font-bold text-brand-brown mb-1">
                  취소 사유 (선택)
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="일정 변경, 개인 사정 등 사유를 남겨주시면 추후 재신청 시 더욱 세심히 배려해 드립니다."
                  className="w-full p-3 rounded-xl border border-brand-green/40 text-xs focus:ring-2 focus:ring-brand-sage/20 outline-hidden font-serif"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-brand-green/40 text-xs font-bold text-brand-brown/80 hover:bg-brand-beige/40 cursor-pointer"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isCancelling ? '취소 중...' : '취소 확정'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Reservation Modal */}
      <QuickReservationModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
      />
    </div>
  );
}
