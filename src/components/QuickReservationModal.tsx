import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, PhoneCall, CheckCircle2, ShieldCheck, Clock, User, Phone, 
  Send, AlertCircle, Heart, Sparkles, MessageCircle, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

interface QuickReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_PREFERENCES = [
  { id: 'asap', label: '가능한 빠른 시간 내', desc: '상담사 확인 즉시 연락' },
  { id: 'morning', label: '오전 (10:00 ~ 12:00)', desc: '출근/오전 시간대' },
  { id: 'afternoon', label: '오후 (14:00 ~ 18:00)', desc: '점심 후/오후 시간대' },
  { id: 'evening', label: '저녁 (18:00 ~ 20:00)', desc: '퇴근 후 편안한 시간대' },
];

const CONSULTATION_TYPES = [
  '개인/성인', '부부/가족', '청소년/자녀', '종합심리검사', '기타/미정'
];

export default function QuickReservationModal({ isOpen, onClose }: QuickReservationModalProps) {
  const { isHighContrast } = useHighContrast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('가능한 빠른 시간 내');
  const [consultType, setConsultType] = useState('개인/성인');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<{ name: string; phone: string; preferredTime: string } | null>(null);

  // Auto-format phone number (010-XXXX-XXXX)
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  // Focus trap & escape key handler
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage('');
      setName('');
      setPhone('');
      setNotes('');
      setPreferredTime('가능한 빠른 시간 내');
      setConsultType('개인/성인');

      // Autofocus first input after animation
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('성함을 입력해 주세요.');
      nameInputRef.current?.focus();
      return;
    }

    const rawPhone = phone.replace(/[^0-9]/g, '');
    if (rawPhone.length < 9 || rawPhone.length > 11) {
      setErrorMessage('올바른 연락처(전화번호)를 입력해 주세요. (예: 010-1234-5678)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        preferred_time: preferredTime,
        notes: `상담분야: ${consultType}${notes.trim() ? ` / 추가메모: ${notes.trim()}` : ''}`
      };

      const res = await fetch('/api/quick-reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '상담 예약 요청 중 오류가 발생했습니다.');
      }

      setSubmittedData({
        name: name.trim(),
        phone: phone.trim(),
        preferredTime
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-reservation-title"
            className={cn(
              "relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden",
              isHighContrast
                ? "bg-neutral-950 text-white border-2 border-white"
                : "bg-white text-brand-brown border border-brand-green/30"
            )}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-brand-green/20 text-brand-brown/70 hover:text-brand-brown transition-colors cursor-pointer"
              aria-label="창 닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success State */}
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-brand-green/30 text-brand-sage flex items-center justify-center mx-auto mb-4 border border-brand-sage/30 shadow-xs">
                  <CheckCircle2 className="w-9 h-9 text-brand-sage" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>전화 상담(콜백) 접수 완료</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-brand-brown mb-3">
                  간편 예약이 접수되었습니다!
                </h3>

                <p className="text-sm font-serif text-brand-brown/80 leading-relaxed mb-6">
                  <strong className="text-brand-sage font-bold">{submittedData?.name}</strong> 님, 
                  남겨주신 번호 <strong className="text-brand-brown font-bold font-mono">({submittedData?.phone})</strong>로 
                  전문 상담사가 <span className="underline decoration-brand-sage underline-offset-4 font-semibold">{submittedData?.preferredTime}</span>에 
                  직접 전화드려 친절히 상담 일정을 안내해 드리겠습니다.
                </p>

                <div className="bg-brand-beige/50 p-4 rounded-2xl border border-brand-green/20 text-xs text-left mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-brand-brown font-bold">
                    <ShieldCheck className="w-4 h-4 text-brand-sage shrink-0" />
                    <span>안내 및 비밀보장 유의사항</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-brand-brown/70 leading-relaxed pl-1">
                    <li>상담 중일 경우 약간의 지연이 있을 수 있으며, 확인 즉시 연락드립니다.</li>
                    <li>부재 시에는 친절한 안내 문자를 남겨드립니다.</li>
                    <li>모든 상담 문의는 한국상담심리학회 윤리강령에 따라 100% 비밀이 보장됩니다.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 px-6 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                  >
                    확인
                  </button>
                  <a
                    href="tel:052-254-0230"
                    className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-brand-green/20 text-brand-brown border border-brand-green/40 font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-brand-sage" />
                    <span>지금 바로 전화 (052-254-0230)</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Simplified Form State: Name & Phone Number */
              <div>
                {/* Header */}
                <div className="flex items-start gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center shrink-0 border border-brand-sage/30 shadow-2xs">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-sage uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Quick Callback Reservation</span>
                    </div>
                    <h3 id="quick-reservation-title" className="text-xl sm:text-2xl font-serif font-bold text-brand-brown leading-snug">
                      간편 예약 <span className="text-brand-sage">(전화 상담 신청)</span>
                    </h3>
                    <p className="text-xs sm:text-[13px] text-brand-brown/70 font-serif mt-1">
                      성함과 연락처만 남겨주시면, 전문 상담사가 확인 후 편안하신 시간에 전화로 상담 일정을 안내해 드립니다.
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="quick-name" className="block text-xs font-bold text-brand-brown mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-brand-sage" />
                        <span>성함</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </span>
                      <span className="text-[11px] text-brand-brown/50 font-normal">익명/가명 가능</span>
                    </label>
                    <input
                      id="quick-name"
                      ref={nameInputRef}
                      type="text"
                      required
                      value={name}
                      onChange={handleNameChange}
                      placeholder="성함을 입력해 주세요 (예: 김민우)"
                      className="w-full px-4 py-3 rounded-xl border border-brand-green/40 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-hidden text-sm bg-brand-beige/10 font-serif transition-all"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="quick-phone" className="block text-xs font-bold text-brand-brown mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-sage" />
                        <span>연락처 (전화번호)</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </span>
                      <span className="text-[11px] text-brand-brown/50 font-normal">상담 안내 전화 수신용</span>
                    </label>
                    <input
                      id="quick-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-brand-green/40 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-hidden text-sm bg-brand-beige/10 font-mono transition-all"
                    />
                  </div>

                  {/* Preferred Callback Time */}
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-sage" />
                      <span>전화 상담 희망 시간대</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_PREFERENCES.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setPreferredTime(t.label)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-left border transition-all text-xs cursor-pointer flex flex-col justify-center",
                            preferredTime === t.label
                              ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                              : "bg-white text-brand-brown/80 border-brand-green/30 hover:bg-brand-green/15"
                          )}
                        >
                          <span className="font-bold">{t.label}</span>
                          <span className={cn(
                            "text-[10px] mt-0.5",
                            preferredTime === t.label ? "text-white/80" : "text-brand-brown/50"
                          )}>
                            {t.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Category (Quick chips) */}
                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1.5 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-brand-sage" />
                      <span>관심 상담 분야 (선택)</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CONSULTATION_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setConsultType(type)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                            consultType === type
                              ? "bg-brand-green/40 text-brand-brown border-brand-sage font-bold"
                              : "bg-white text-brand-brown/65 border-brand-green/20 hover:border-brand-sage/40"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Reassurance Note */}
                  <div className="p-3 bg-brand-beige/40 rounded-xl border border-brand-green/20 flex items-start gap-2 text-[11px] text-brand-brown/70 leading-relaxed font-serif">
                    <Lock className="w-3.5 h-3.5 text-brand-sage shrink-0 mt-0.5" />
                    <span>
                      기재하신 성함과 연락처는 전화 상담 및 일정 조율 목적으로만 사용되며, 
                      상담 윤리강령에 따라 <strong>100% 안전하게 보호</strong>됩니다.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-4 px-6 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer",
                        isSubmitting && "opacity-75 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>신청 접수 중...</span>
                        </>
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4" />
                          <span>전화 상담(콜백) 요청하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
