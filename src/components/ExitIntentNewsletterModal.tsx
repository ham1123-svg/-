import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BellRing,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

interface ExitIntentNewsletterModalProps {
  targetSectionId?: string;
  minReadingSeconds?: number;
}

const TOPICS = [
  { id: '전체', label: '종합 웰니스 (추천)' },
  { id: '성인·번아웃', label: '성인·번아웃 치유' },
  { id: '부부·가족', label: '부부 갈등·대화법' },
  { id: '자녀·양육', label: '아동·청소년 코칭' },
  { id: '불안·자존감', label: '불안 완화·자존감' },
];

const STORAGE_KEYS = {
  DISMISSED_UNTIL: 'happywind_exit_modal_dismissed_until',
  SUBSCRIBED: 'happywind_newsletter_subscribed',
};

export default function ExitIntentNewsletterModal({
  targetSectionId = 'counseling-insights-section',
  minReadingSeconds = 10,
}: ExitIntentNewsletterModalProps) {
  const { isHighContrast } = useHighContrast();
  const [isOpen, setIsOpen] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [isReadingSection, setIsReadingSection] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('전체');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const readingTimerRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  // Check if modal was recently dismissed or user is already subscribed
  const isSuppressed = useCallback(() => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.SUBSCRIBED) === 'true') {
        return true;
      }
      const dismissedUntil = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL);
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return true;
      }
    } catch (e) {
      // ignore storage access errors
    }
    return false;
  }, []);

  // Track whether user is reading the Counseling Insights section
  useEffect(() => {
    if (isSuppressed()) return;

    const sectionEl = document.getElementById(targetSectionId);
    if (!sectionEl) {
      // If target section is not found yet, default to monitoring page viewing time
      setIsReadingSection(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsReadingSection(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [targetSectionId, isSuppressed]);

  // Accumulate reading time when section is in view
  useEffect(() => {
    if (isSuppressed() || hasTriggeredRef.current) return;

    if (isReadingSection) {
      readingTimerRef.current = window.setInterval(() => {
        setReadingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    }

    return () => {
      if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    };
  }, [isReadingSection, isSuppressed]);

  // Handle Exit-Intent Detection
  const handleExitIntent = useCallback(
    (e: MouseEvent) => {
      // Don't trigger if already shown, suppressed, or reading time not yet reached
      if (hasTriggeredRef.current || isSuppressed() || isOpen) return;

      // Condition: User has read for at least minReadingSeconds
      if (readingTime < minReadingSeconds) return;

      // Desktop exit intent: mouse leaves through top edge (towards address bar / close tab)
      if (e.clientY <= 25) {
        hasTriggeredRef.current = true;
        setIsOpen(true);
      }
    },
    [isSuppressed, isOpen, readingTime, minReadingSeconds]
  );

  useEffect(() => {
    if (isSuppressed()) return;

    document.addEventListener('mouseleave', handleExitIntent);
    return () => {
      document.removeEventListener('mouseleave', handleExitIntent);
    };
  }, [handleExitIntent, isSuppressed]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Suppress for current session
    hasTriggeredRef.current = true;
  };

  const handleDismissForToday = () => {
    try {
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.DISMISSED_UNTIL, String(tomorrow));
    } catch (e) {}
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('이메일 주소를 입력해 주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('올바른 이메일 형식을 입력해 주세요 (예: user@example.com).');
      return;
    }

    if (!agreedToPrivacy) {
      setErrorMessage('개인정보 수집 및 이메일 수신에 동의해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          interest_topic: selectedTopic,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '구독 처리 중 오류가 발생했습니다.');
      }

      setSuccessMessage(data.message || '마음 건강 뉴스레터 구독이 완료되었습니다!');
      try {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIBED, 'true');
      } catch (e) {}

      // Auto close after 3.5 seconds on success
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err.message || '서버 통신에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={cn(
              "relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 border my-auto",
              isHighContrast 
                ? "bg-neutral-950 border-white text-white" 
                : "bg-white border-brand-green/30 text-brand-brown"
            )}
          >
            {/* Soft Ambient Header Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-36 bg-brand-sage/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 p-2 rounded-full bg-brand-beige/60 hover:bg-brand-beige text-brand-brown/70 hover:text-brand-brown transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 relative z-10">
              
              <AnimatePresence mode="wait">
                {successMessage ? (
                  /* Success State View */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300 shadow-xs">
                      <Check className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                        마음 웰니스 레터 구독 완료!
                      </h4>
                      <p className="text-xs sm:text-sm text-brand-brown/80 font-serif leading-relaxed">
                        {successMessage}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-brand-beige/40 border border-brand-green/20 text-xs font-serif text-brand-brown/70 max-w-sm mx-auto">
                      입력하신 <strong className="text-brand-brown">{email}</strong>(으)로 환영 인사와 첫 번째 치유 칼럼 요약본이 전송됩니다.
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white font-serif font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        닫기
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Header & Emotional Hook */}
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-serif font-bold border border-brand-sage/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>잠시만요! 마음을 다독이는 선물</span>
                      </div>

                      <h3 id="exit-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-brand-brown leading-snug">
                        바쁜 일상으로 돌아가시기 전, <br />
                        <span className="text-brand-sage">마음 건강 처방전</span>을 무료로 받아보세요
                      </h3>

                      <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed max-w-md mx-auto">
                        심리 칼럼을 깊이 읽어주신 당신께, 교육학 박사 박미경 소장의 
                        <strong> 격주 마음 건강 레터</strong>를 이메일로 전해드립니다.
                      </p>
                    </div>

                    {/* 3 Core Value Bullets */}
                    <div className="grid grid-cols-3 gap-2 py-1 text-center">
                      <div className="p-2.5 rounded-xl bg-brand-beige/35 border border-brand-green/20">
                        <div className="text-[11px] font-serif font-bold text-brand-brown">격주 화요일</div>
                        <div className="text-[10px] text-brand-brown/60">3분 심리학 처방</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-brand-beige/35 border border-brand-green/20">
                        <div className="text-[11px] font-serif font-bold text-brand-brown">박사 직접 감수</div>
                        <div className="text-[10px] text-brand-brown/60">임상 근거 솔루션</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-brand-beige/35 border border-brand-green/20">
                        <div className="text-[11px] font-serif font-bold text-brand-brown">100% 스팸 프리</div>
                        <div className="text-[10px] text-brand-brown/60">언제든 수신 거부</div>
                      </div>
                    </div>

                    {/* Interest Topic Chips */}
                    <div>
                      <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                        가장 관심 있는 고민 분야:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {TOPICS.map((topic) => {
                          const isSelected = selectedTopic === topic.id;
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => setSelectedTopic(topic.id)}
                              className={cn(
                                "px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer border",
                                isSelected
                                  ? "bg-brand-sage text-white border-brand-sage font-bold shadow-2xs"
                                  : "bg-brand-beige/25 text-brand-brown/75 border-brand-green/25 hover:bg-brand-beige/60"
                              )}
                            >
                              {topic.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2.5">
                      <div>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="레터를 수신할 이메일 주소 (예: user@example.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-serif bg-brand-beige/20 border border-brand-green/30 focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-hidden transition-all text-brand-brown placeholder:text-brand-brown/40 shadow-2xs"
                          />
                          <Mail className="w-4 h-4 text-brand-brown/40 absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="수신자 호칭 / 이름 (선택, 예: 김민지 님)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl text-xs font-serif bg-brand-beige/20 border border-brand-green/30 focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-hidden transition-all text-brand-brown placeholder:text-brand-brown/40 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Error Notice */}
                    {errorMessage && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-serif text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Privacy Checkbox */}
                    <label className="flex items-start gap-2 text-[11px] font-serif text-brand-brown/70 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedToPrivacy}
                        onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                        className="rounded border-brand-green/40 text-brand-sage focus:ring-brand-sage mt-0.5"
                      />
                      <span>
                        [필수] 마음 건강 레터 무료 발송을 위한 이메일 수집에 동의합니다.
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full py-3.5 px-6 rounded-2xl bg-brand-sage hover:bg-brand-sage/90 text-white font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98",
                        isLoading && "opacity-75 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <span>구독 등록 중...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>무료 마음 건강 웰니스 레터 받기</span>
                        </>
                      )}
                    </button>

                    {/* Bottom Dismiss Options */}
                    <div className="flex items-center justify-between pt-2 text-[11px] font-serif text-brand-brown/50">
                      <button
                        type="button"
                        onClick={handleDismissForToday}
                        className="hover:underline hover:text-brand-brown cursor-pointer"
                      >
                        오늘 하루 보지 않기
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="hover:underline hover:text-brand-brown cursor-pointer"
                      >
                        다음에 신청할게요 (닫기)
                      </button>
                    </div>

                  </form>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
