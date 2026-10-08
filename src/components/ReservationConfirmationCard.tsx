import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MessageSquareText, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  CalendarPlus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  Send, 
  AlertCircle, 
  ExternalLink,
  PhoneCall,
  Info,
  Search,
  CheckCircle
} from 'lucide-react';
import { Program, NotificationResult } from '../types';
import { cn } from '../lib/utils';

export interface ReservationStatusData {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  program_title?: string;
  program_category?: string;
  created_at?: string;
}

interface ReservationConfirmationCardProps {
  reservationId: number;
  initialName: string;
  initialPhone: string;
  initialDate: string;
  initialTime: string;
  program?: Program;
  notificationResult?: NotificationResult | null;
  onReset: () => void;
  className?: string;
}

export default function ReservationConfirmationCard({
  reservationId,
  initialName,
  initialPhone,
  initialDate,
  initialTime,
  program,
  notificationResult,
  onReset,
  className = ''
}: ReservationConfirmationCardProps) {
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('');
  const [showFullAlimtalk, setShowFullAlimtalk] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [resendingAlimtalk, setResendingAlimtalk] = useState<boolean>(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(null);

  // Format date with Korean day-of-week
  const formatDateWithDay = (dateStr: string, timeStr: string) => {
    if (!dateStr) return timeStr || '일정 조율';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = dayNames[d.getDay()] || '';
      return `${dateStr} (${dayName}요일) ${timeStr || ''}`.trim();
    } catch {
      return `${dateStr} ${timeStr || ''}`.trim();
    }
  };

  const formattedDateTime = formatDateWithDay(initialDate, initialTime);
  const programTitle = program 
    ? `[${program.category}] ${program.title}` 
    : '맞춤 심리상담';

  // Live polling for reservation status
  const fetchLatestStatus = useCallback(async (isManual = false) => {
    if (!reservationId) return;
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/reservations/${reservationId}/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setCurrentStatus(data.status);
        }
        setLastCheckedTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to fetch live reservation status:', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  }, [reservationId]);

  useEffect(() => {
    fetchLatestStatus();
    // Auto-poll status every 8 seconds while pending
    const interval = setInterval(() => {
      if (currentStatus === 'pending') {
        fetchLatestStatus();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchLatestStatus, currentStatus]);

  // Handle re-sending Kakao Alimtalk
  const handleResendAlimtalk = async () => {
    if (!reservationId || resendingAlimtalk) return;
    setResendingAlimtalk(true);
    setResendSuccessMessage(null);
    try {
      const res = await fetch(`/api/reservations/${reservationId}/resend-alimtalk`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setResendSuccessMessage('카카오 알림톡이 정상적으로 재발송되었습니다.');
        setTimeout(() => setResendSuccessMessage(null), 4000);
      } else {
        setResendSuccessMessage('알림톡 재발송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error('Failed to resend Alimtalk:', err);
      setResendSuccessMessage('서버 통신 오류가 발생했습니다.');
    } finally {
      setResendingAlimtalk(false);
    }
  };

  // Copy reservation details to clipboard
  const handleCopyDetails = async () => {
    const summaryText = 
`[행복바람심리상담연구소] 상담 예약 접수 내역
• 예약번호: #RES-${reservationId}
• 성함: ${initialName} 님
• 연락처: ${initialPhone}
• 프로그램: ${programTitle}
• 희망 일시: ${formattedDateTime}
• 실시간 상태: ${currentStatus === 'confirmed' ? '예약 확정 완료' : currentStatus === 'cancelled' ? '예약 취소' : '예약 확정 대기 중 (원장님 일정 확인 중)'}
• 상담소 위치: 울산광역시 울주군 삼남읍 도호1길 23 상가 408호
• 대표 전화: 052-254-0230`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = summaryText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  // Google Calendar URL
  const getGoogleCalendarUrl = () => {
    if (!initialDate || !initialTime) return '#';
    const dateFormatted = initialDate.replace(/-/g, '');
    const startTimeParts = initialTime.split(':');
    const startHour = startTimeParts[0] || '10';
    const startMin = startTimeParts[1] || '00';
    const endHour = String(Number(startHour) + 1).padStart(2, '0');

    const startDateTime = `${dateFormatted}T${startHour}${startMin}00`;
    const endDateTime = `${dateFormatted}T${endHour}${startMin}00`;

    const title = encodeURIComponent(`[행복바람심리상담연구소] ${programTitle}`);
    const details = encodeURIComponent(
      `행복바람심리상담연구소 1:1 상담 예약\n예약번호: #RES-${reservationId}\n내담자: ${initialName}\n연락처: ${initialPhone}\n프로그램: ${programTitle}\n대표전화: 052-254-0230`
    );
    const location = encodeURIComponent('울산광역시 울주군 삼남읍 도호1길 23 상가 408호');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
  };

  return (
    <div className={cn("w-full space-y-6 text-left", className)}>
      
      {/* Top Completion Header & Real-time Status Tracking Badge */}
      <div className="bg-gradient-to-r from-brand-beige/40 via-white to-brand-green/20 rounded-3xl p-6 sm:p-7 border border-brand-green/30 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-brand-green/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-sage text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-brand-sage">
                  예약번호 #RES-{reservationId}
                </span>
                <span className="text-brand-brown/40">·</span>
                <span className="text-xs text-brand-brown/70 font-serif">
                  100% 비의료 비밀보장
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                상담 예약이 정상 접수되었습니다!
              </h2>
            </div>
          </div>

          {/* Real-time Status Tracking Badge Container */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {currentStatus === 'pending' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                </span>
                <span className="text-xs font-bold tracking-tight">
                  예약 확정 대기 중
                </span>
                <span className="text-[10px] text-amber-700/80 bg-white/70 px-1.5 py-0.5 rounded font-medium">
                  실시간 검토
                </span>
              </div>
            )}

            {currentStatus === 'confirmed' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold tracking-tight">
                  예약 확정 완료
                </span>
                <span className="text-[10px] text-emerald-800 bg-white/70 px-1.5 py-0.5 rounded font-medium">
                  최종 확정
                </span>
              </div>
            )}

            {currentStatus === 'cancelled' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-xs font-bold tracking-tight">
                  예약 취소됨
                </span>
              </div>
            )}

            {/* Manual Status Refresh Button */}
            <button
              type="button"
              onClick={() => fetchLatestStatus(true)}
              disabled={isRefreshing}
              className="p-1.5 rounded-xl bg-white hover:bg-brand-green/20 text-brand-brown/70 hover:text-brand-brown border border-brand-green/30 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="실시간 예약 상태 새로고침"
              aria-label="실시간 예약 상태 새로고침"
            >
              <RotateCcw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-brand-sage")} />
            </button>
          </div>
        </div>

        {/* 3-Step Live Status Progress Pipeline */}
        <div className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-3 rounded-2xl bg-white/90 border border-brand-green/25 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-brand-brown">1. 온라인 접수 완료</div>
                <div className="text-[11px] text-emerald-700">알림톡 즉시 발송됨</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={cn(
              "p-3 rounded-2xl border flex items-center gap-3 transition-colors",
              currentStatus === 'pending'
                ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20"
                : currentStatus === 'confirmed'
                  ? "bg-white/90 border-brand-green/25"
                  : "bg-white/90 border-brand-green/25"
            )}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                currentStatus === 'pending'
                  ? "bg-amber-200 text-amber-900 animate-pulse"
                  : currentStatus === 'confirmed'
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
              )}>
                {currentStatus === 'confirmed' ? '✓' : '2'}
              </div>
              <div>
                <div className="text-xs font-bold text-brand-brown">2. 원장님 일정 확인</div>
                <div className="text-[11px] text-amber-800 font-medium">
                  {currentStatus === 'pending' ? '현재 실시간 확인 중' : '일정 확인 완료'}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={cn(
              "p-3 rounded-2xl border flex items-center gap-3 transition-colors",
              currentStatus === 'confirmed'
                ? "bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400/20"
                : "bg-white/60 border-brand-green/20"
            )}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                currentStatus === 'confirmed'
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-400"
              )}>
                {currentStatus === 'confirmed' ? '✓' : '3'}
              </div>
              <div>
                <div className="text-xs font-bold text-brand-brown">3. 최종 확정 &amp; 방문</div>
                <div className="text-[11px] text-brand-brown/60">
                  {currentStatus === 'confirmed' ? '최종 확정 완료!' : '확정 시 추가 알림톡'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-brand-brown/60 font-serif">
            <span>* 소장님이 접수 내용을 확인한 후 10~30분 이내 유선 전화 또는 확정 알림톡으로 최종 일정을 확정해 드립니다.</span>
            {lastCheckedTime && (
              <span className="hidden sm:inline">최근 상태 확인: {lastCheckedTime}</span>
            )}
          </div>
        </div>
      </div>

      {/* Kakao Alimtalk Dispatch Confirmation Procedure UI */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        
        {/* Alimtalk Dispatch Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEE500] text-[#371D1E] flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquareText className="w-5 h-5 fill-[#371D1E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-950">
                  카카오 알림톡 자동 발송 확인 절차
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  정상 전송 완료
                </span>
              </div>
              <div className="text-xs text-amber-900/80 mt-0.5">
                수신 번호: <strong className="text-amber-950 font-bold">{initialPhone}</strong> ({initialName} 님)
              </div>
            </div>
          </div>

          {/* Resend Alimtalk Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResendAlimtalk}
              disabled={resendingAlimtalk}
              className="px-3.5 py-2 bg-white hover:bg-amber-100/70 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <Send className={cn("w-3.5 h-3.5", resendingAlimtalk && "animate-pulse")} />
              <span>{resendingAlimtalk ? '알림톡 전송 중...' : '알림톡 다시 받기'}</span>
            </button>
          </div>
        </div>

        {/* Resend Success Message Toast Banner */}
        {resendSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-white rounded-xl border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendSuccessMessage}</span>
          </motion.div>
        )}

        {/* Kakao Talk Speech Bubble Mockup */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950">
                [행복바람심리상담연구소]
              </span>
              <span className="text-[10px] text-amber-800 bg-[#FEE500]/40 px-2 py-0.5 rounded-md font-semibold">
                카카오 알림톡 공식 템플릿
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowFullAlimtalk(!showFullAlimtalk)}
              className="text-xs text-amber-900 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              {showFullAlimtalk ? (
                <>
                  <span>메시지 요약</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>메시지 전문 보기</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-brand-brown/90 leading-relaxed font-serif">
            안녕하세요, <strong className="text-brand-brown font-bold">{initialName}</strong> 님.<br />
            마음의 평온을 찾는 <strong>행복바람심리상담연구소</strong>입니다.<br />
            고객님께서 신청하신 상담 예약이 안전하게 접수되었습니다.
          </p>

          {/* Core Reservation Details Grid in Alimtalk */}
          <div className="bg-brand-beige/30 rounded-xl p-4 text-xs space-y-2 border border-brand-green/20">
            <div className="flex justify-between items-center">
              <span className="text-brand-brown/60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
                신청 프로그램:
              </span>
              <span className="font-bold text-brand-brown">
                {programTitle}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brand-brown/60 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-sage" />
                희망 일시:
              </span>
              <span className="font-bold text-brand-sage">
                {formattedDateTime}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brand-brown/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
                진행 방식:
              </span>
              <span className="font-medium text-brand-brown">
                1:1 독립 프라이빗 대면 세션 (50분)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-brand-brown/60 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-sage" />
                상담소 위치:
              </span>
              <span className="font-medium text-brand-brown text-[11px]">
                울산 울주군 삼남읍 도호1길 23 상가 408호
              </span>
            </div>
          </div>

          {/* Expanded Full Message Content */}
          {showFullAlimtalk && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-brand-brown/80 leading-relaxed bg-brand-beige/15 p-4 rounded-xl border border-brand-green/15 space-y-2"
            >
              <div className="font-bold text-brand-brown text-[11px]">■ 방문 및 안심 가이드</div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-brand-brown/75">
                <li>상가 지하 전용 무료 주차장을 이용하실 수 있습니다.</li>
                <li>원활한 상담 진행을 위해 예약 시간 5~10분 전 여유 있게 도착 부탁드립니다.</li>
                <li>본 상담소는 100% 비밀보장 및 건강보험 F코드(질병기록) 미생성 원칙을 준수합니다.</li>
                <li>예약 일정 변경이나 취소 시 대표 전화(052-254-0230)로 미리 연락 부탁드립니다.</li>
              </ul>
            </motion.div>
          )}

          {/* Interactive Action Buttons inside Alimtalk Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-100">
            <a
              href="tel:052-254-0230"
              className="py-2.5 px-3 bg-[#FEE500] hover:bg-[#FADB00] text-[#371D1E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>상담소 바로 유선 문의 (052-254-0230)</span>
            </a>

            <a
              href="https://pf.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white hover:bg-amber-50 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-amber-700" />
              <span>카카오톡 1:1 채널 상담</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-900/60 justify-center pt-1">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>카카오톡 미설치 시 일반 장문 문자(LMS)로 자동 대체 발송 처리됩니다.</span>
          </div>
        </div>
      </div>

      {/* Practical Action Toolbars */}
      <div className="bg-white rounded-3xl p-6 border border-brand-green/20 shadow-sm">
        <h3 className="text-xs font-bold text-brand-brown uppercase font-serif tracking-wider mb-4 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-sage" />
          <span>예약 내역 저장 및 추가 편의 기능</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <button
            type="button"
            onClick={handleCopyDetails}
            className="p-3 bg-brand-beige/25 hover:bg-brand-beige/50 border border-brand-green/25 rounded-2xl text-xs font-bold text-brand-brown flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-brand-sage group-hover:scale-110 transition-transform" />
                <span>예약증 클립보드 복사</span>
              </>
            )}
          </button>

          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-brand-beige/25 hover:bg-brand-beige/50 border border-brand-green/25 rounded-2xl text-xs font-bold text-brand-brown flex items-center justify-center gap-2 transition-all group"
          >
            <CalendarPlus className="w-4 h-4 text-brand-sage group-hover:scale-110 transition-transform" />
            <span>구글 캘린더에 일정 등록</span>
          </a>

          <Link
            to={`/reservation/status?phone=${encodeURIComponent(initialPhone)}`}
            className="p-3 bg-brand-beige/25 hover:bg-brand-beige/50 border border-brand-green/25 rounded-2xl text-xs font-bold text-brand-brown flex items-center justify-center gap-2 transition-all group"
          >
            <Search className="w-4 h-4 text-brand-sage group-hover:scale-110 transition-transform" />
            <span>실시간 예약 상태 조회 페이지</span>
          </Link>
        </div>

        {/* Reset / New Booking Button */}
        <div className="pt-4 border-t border-brand-green/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-brown/70 font-serif">
            추가 상담이나 다른 일정의 예약이 필요하신가요?
          </p>
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새로운 예약 신청하기</span>
          </button>
        </div>
      </div>

    </div>
  );
}
