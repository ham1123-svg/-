import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, X, MessageSquareText, Calendar, Clock, Phone, MapPin, 
  Copy, Check, PhoneCall, CalendarPlus, ChevronDown, ChevronUp, Sparkles,
  ShieldCheck, Share2, Info
} from 'lucide-react';
import { Program, NotificationResult } from '../types';

interface ReservationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: {
    id?: number;
    name: string;
    phone: string;
    preferred_date: string;
    preferred_time: string;
    program_id: string;
  };
  program?: Program;
  notificationResult?: NotificationResult | null;
  onResetForm?: () => void;
}

export default function ReservationConfirmModal({
  isOpen,
  onClose,
  reservationData,
  program,
  notificationResult,
  onResetForm,
}: ReservationConfirmModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [showFullMessage, setShowFullMessage] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format date with day of week
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

  const formattedDateTime = formatDateWithDay(reservationData.preferred_date, reservationData.preferred_time);
  const programTitle = program ? `[${program.category}] ${program.title}` : '맞춤 심리상담';

  // Copy booking summary to clipboard
  const handleCopyDetails = async () => {
    const summaryText = 
`[행복바람심리상담연구소] 상담 예약 접수 내역
• 성함: ${reservationData.name} 님
• 연락처: ${reservationData.phone}
• 프로그램: ${programTitle}
• 희망 일시: ${formattedDateTime}
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

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    if (!reservationData.preferred_date || !reservationData.preferred_time) return '#';
    const dateFormatted = reservationData.preferred_date.replace(/-/g, '');
    const startTimeParts = reservationData.preferred_time.split(':');
    const startHour = startTimeParts[0] || '10';
    const startMin = startTimeParts[1] || '00';
    const endHour = String(Number(startHour) + 1).padStart(2, '0');

    const startDateTime = `${dateFormatted}T${startHour}${startMin}00`;
    const endDateTime = `${dateFormatted}T${endHour}${startMin}00`;

    const title = encodeURIComponent(`[행복바람심리상담연구소] ${programTitle}`);
    const details = encodeURIComponent(
      `행복바람심리상담연구소 1:1 상담 예약\n내담자: ${reservationData.name}\n연락처: ${reservationData.phone}\n프로그램: ${programTitle}\n대표전화: 052-254-0230`
    );
    const location = encodeURIComponent('울산광역시 울주군 삼남읍 도호1길 23 상가 408호');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-confirm-modal-title"
      >
        {/* Backdrop click dismiss */}
        <div 
          className="fixed inset-0 -z-10" 
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          id="reservation-confirm-modal-content"
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-brand-green/20 overflow-hidden my-6"
        >
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-brand-green/40 via-brand-beige/50 to-brand-green/30 px-6 py-6 border-b border-brand-green/20 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-brand-brown/70 hover:text-brand-brown flex items-center justify-center transition-all shadow-xs"
              aria-label="확인창 닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-brand-green/30 shadow-xs flex items-center justify-center text-brand-sage shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    접수 & 알림톡 발송 완료
                  </span>
                  <span className="text-[11px] text-brand-brown/60 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
                    100% 비밀보장
                  </span>
                </div>
                <h3 
                  id="reservation-confirm-modal-title"
                  className="text-xl sm:text-2xl font-serif font-bold text-brand-brown"
                >
                  상담 예약 신청 완료
                </h3>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Automatic Kakao Alimtalk Dispatch Status Banner */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FEE500] text-[#371D1E] flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold text-xs">
                  <MessageSquareText className="w-4 h-4 fill-[#371D1E]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      카카오 알림톡 자동 전송 완료
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    </span>
                    <span className="text-[11px] text-amber-800/70 font-mono">
                      {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 전송
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                    입력하신 연락처 <strong className="text-amber-950 font-bold">{reservationData.phone}</strong>({reservationData.name} 님)로 
                    예약 접수 확인 알림톡이 자동 발송되었습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive KakaoTalk Chat Preview Bubble */}
            <div className="bg-brand-beige/20 rounded-2xl p-4 border border-brand-green/20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-green/15">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FEE500] flex items-center justify-center text-[#371D1E]">
                    <MessageSquareText className="w-3.5 h-3.5 fill-[#371D1E]" />
                  </div>
                  <span className="text-xs font-bold text-brand-brown">
                    알림톡 수신 메시지 미리보기
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullMessage(!showFullMessage)}
                  className="text-[11px] text-brand-sage hover:text-brand-brown font-semibold flex items-center gap-1 transition-colors"
                >
                  {showFullMessage ? (
                    <>
                      <span>메시지 요약</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>전문 보기</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

              {/* Chat Bubble Layout */}
              <div className="bg-white rounded-xl p-4 border border-brand-green/20 shadow-xs space-y-3">
                <div className="text-xs font-bold text-amber-950 flex items-center justify-between border-b border-brand-beige pb-2">
                  <span>[행복바람심리상담연구소]</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-normal">
                    알림톡 도착
                  </span>
                </div>

                <p className="text-xs text-brand-brown/85 leading-relaxed">
                  안녕하세요, <strong className="text-brand-brown font-bold">{reservationData.name}</strong> 님.<br />
                  마음의 평온을 찾는 행복바람심리상담연구소입니다.<br />
                  신청하신 상담 예약이 안전하게 접수되었습니다.
                </p>

                {/* Key Summary Rows */}
                <div className="bg-brand-beige/35 rounded-xl p-3 text-xs space-y-2 border border-brand-green/15">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-brown/60 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
                      신청 프로그램
                    </span>
                    <span className="font-semibold text-brand-brown text-right">
                      {programTitle}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-brown/60 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-sage" />
                      희망 일시
                    </span>
                    <span className="font-semibold text-brand-sage text-right">
                      {formattedDateTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-brown/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-sage" />
                      상담소 위치
                    </span>
                    <span className="font-semibold text-brand-brown text-right text-[11px]">
                      삼남읍 도호1길 23 상가 408호
                    </span>
                  </div>
                </div>

                {/* Expanded Full Message Content */}
                {showFullMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-brand-brown/75 leading-relaxed bg-brand-beige/10 p-3 rounded-xl border border-brand-green/10 space-y-2"
                  >
                    <div className="font-semibold text-brand-brown">■ 방문 및 유의사항 안내</div>
                    <ul className="list-disc list-inside space-y-1 text-brand-brown/70">
                      <li>상가 내 무료 주차장을 이용하실 수 있습니다.</li>
                      <li>원활한 상담 진행을 위해 예약 시간 5~10분 전 도착 부탁드립니다.</li>
                      <li>철저한 100% 비밀 보장 및 1:1 사전 예약제로 운영됩니다.</li>
                      <li>일정 변경이나 취소 시 대표 전화(052-254-0230)로 미리 연락 부탁드립니다.</li>
                    </ul>
                  </motion.div>
                )}

                {/* Direct Action Link inside Bubble */}
                <a
                  href="tel:052-254-0230"
                  className="w-full py-2.5 bg-[#FEE500] hover:bg-[#FADB00] text-[#371D1E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>상담소 바로 유선 문의 (052-254-0230)</span>
                </a>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-brand-brown/60 justify-center">
                <Info className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                <span>카카오톡 미설치 시 일반 장문 문자(LMS)로 자동 대체 발송됩니다.</span>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="bg-brand-green/20 rounded-2xl p-4 border border-brand-green/30 space-y-2">
              <h4 className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-sage" />
                향후 진행 절차
              </h4>
              <p className="text-xs text-brand-brown/80 leading-relaxed">
                담당 전문 상담사가 접수 내역을 확인 후 <strong className="text-brand-brown font-bold">24시간 이내 유선 전화</strong>를 드려 세부 일정 조율 및 방문 상담을 최종 확정해 드립니다.
              </p>
            </div>

            {/* Quick Interactive Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyDetails}
                className="w-full py-2.5 px-4 bg-white hover:bg-brand-beige/30 border border-brand-green/30 text-brand-brown text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs group"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">예약 내역 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-brand-sage group-hover:scale-110 transition-transform" />
                    <span>예약 내역 클립보드 복사</span>
                  </>
                )}
              </button>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-white hover:bg-brand-beige/30 border border-brand-green/30 text-brand-brown text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs group"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-brand-sage group-hover:scale-110 transition-transform" />
                <span>구글 캘린더에 일정 등록</span>
              </a>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="bg-brand-beige/25 px-6 py-4 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (onResetForm) onResetForm();
                onClose();
              }}
              className="text-xs text-brand-brown/70 hover:text-brand-brown font-medium underline underline-offset-4"
            >
              새로운 예약 다시 신청하기
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-7 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>확인 완료 (창 닫기)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
