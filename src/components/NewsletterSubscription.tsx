import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  BookOpen, 
  BellRing, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  Users,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

const TOPICS = [
  { id: '전체', label: '종합 웰니스 (추천)' },
  { id: '성인·번아웃', label: '성인·번아웃 치유' },
  { id: '부부·가족', label: '부부 갈등·대화법' },
  { id: '자녀·양육', label: '아동·청소년 코칭' },
  { id: '불안·자존감', label: '불안 완화·자존감' },
];

const PREVIOUS_EDITIONS = [
  { vol: 'Vol. 48', title: '퇴근 후 끊이지 않는 일 생각, 뇌의 스위치를 끄는 심리적 경계선 설정법' },
  { vol: 'Vol. 47', title: '배우자와 다투지 않고 숨겨진 1차 정서를 안전하게 꺼내는 이마고 대화 3원칙' },
  { vol: 'Vol. 46', title: '사소한 비판에도 곤두박질치는 자존감을 지켜내는 3분 자기 자비(Self-Compassion)' },
];

export default function NewsletterSubscription({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('전체');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number>(1420);

  // Fetch initial reader counts
  useEffect(() => {
    fetch('/api/newsletter/stats')
      .then(res => res.json())
      .then(data => {
        if (data.subscriberCount) {
          setSubscriberCount(data.subscriberCount);
        }
      })
      .catch(() => {});
  }, []);

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
      setSubscriberCount(prev => prev + 1);
    } catch (err: any) {
      setErrorMessage(err.message || '서버 통신에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      aria-label="마음 건강 웰니스 뉴스레터 구독 섹션"
      className={cn(
        "py-16 sm:py-20 relative overflow-hidden border-t border-brand-green/20",
        isHighContrast 
          ? "bg-neutral-900 text-white" 
          : "bg-gradient-to-b from-brand-beige/35 via-white to-brand-beige/25",
        className
      )}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-72 bg-brand-sage/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Container */}
        <div className="rounded-3xl bg-white border border-brand-green/30 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Value Proposition & Teasers */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                {/* Typographic Kicker */}
                <div className="flex items-center gap-2 text-xs font-serif text-brand-sage uppercase tracking-wider mb-2.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Bi-weekly Wellness Letter</span>
                  <span aria-hidden="true" className="text-brand-brown/30">·</span>
                  <span>격주 화요일 발행</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown leading-tight mb-3">
                  지친 마음에 건네는 <br className="hidden sm:inline" />
                  <span className="text-brand-sage">따뜻한 마음 건강 웰니스 레터</span>
                </h3>

                <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed">
                  교육학 박사 박미경 소장이 임상 현장에서 검증된 감정 조절법, 
                  스트레스 완화 루틴, 관계 회복 훈련법을 알기 쉽게 정리하여 
                  격주 화요일 아침 당신의 편지함으로 무료 배달해 드립니다.
                </p>
              </div>

              {/* 3 Core Value Points */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 text-xs font-serif text-brand-brown/85">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3분 심리학 처방</strong>: 출근길·휴식 시간에 부담 없이 읽는 실천적 마인드셋</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs font-serif text-brand-brown/85">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>전문가 직접 감수</strong>: 한국상담학회 1급 슈퍼바이저의 임상 근거 기반 내용</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs font-serif text-brand-brown/85">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% 스팸 프리</strong>: 광고성 홍보 일절 배제 &amp; 언제든 원클릭 수신 거부</span>
                </div>
              </div>

              {/* Recent Letters Preview (Social Proof of Quality) */}
              <div className="p-4 rounded-2xl bg-brand-beige/35 border border-brand-green/20 space-y-2">
                <div className="text-[11px] font-serif font-bold text-brand-brown/70 flex items-center gap-1.5 uppercase">
                  <BookOpen className="w-3.5 h-3.5 text-brand-sage" />
                  <span>최근 발행된 인기 레터 주제</span>
                </div>
                <div className="space-y-1.5 text-xs font-serif text-brand-brown/80">
                  {PREVIOUS_EDITIONS.map((ed, idx) => (
                    <div key={idx} className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-brand-sage font-bold bg-white px-1.5 py-0.5 rounded border border-brand-green/20 shrink-0">
                        {ed.vol}
                      </span>
                      <span className="truncate">{ed.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscriber Counter & Trust Note */}
              <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/65">
                <Users className="w-4 h-4 text-brand-sage" />
                <span>현재 <strong>{subscriberCount.toLocaleString()}명</strong>의 이웃들이 마음 건강 레터를 읽고 있습니다.</span>
              </div>

            </div>

            {/* Right Column: Interactive Subscription Form Card */}
            <div className="lg:col-span-6">
              
              <AnimatePresence mode="wait">
                {successMessage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 sm:p-10 rounded-3xl bg-brand-beige/30 border border-brand-green/30 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                      <Check className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xl font-serif font-bold text-brand-brown">
                        구독 신청이 완료되었습니다!
                      </h4>
                      <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed">
                        {successMessage}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-brand-green/20 text-xs font-serif text-brand-brown/70">
                      입력하신 <strong className="text-brand-brown">{email}</strong>(으)로 환영 안내 메일이 발송되었습니다.
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMessage(null);
                        setEmail('');
                        setName('');
                      }}
                      className="px-5 py-2.5 rounded-xl border border-brand-green/40 hover:bg-white text-xs font-serif font-bold text-brand-brown transition-colors cursor-pointer"
                    >
                      다른 이메일 추가 등록하기
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-brand-beige/20 border border-brand-green/30 shadow-xs space-y-5">
                    
                    {/* Form Headline */}
                    <div className="border-b border-brand-green/20 pb-3">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-brand-brown flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-sage" />
                        <span>무료 레터 신청하기</span>
                      </h4>
                      <p className="text-xs text-brand-brown/65 font-serif mt-0.5">
                        비용 청구 없이 평생 무료로 격주 화요일 아침 전송됩니다.
                      </p>
                    </div>

                    {/* Interest Topic Selection (Segmented buttons) */}
                    <div>
                      <label className="block text-xs font-serif font-bold text-brand-brown mb-2">
                        관심 있는 마음 건강 주제 선택:
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
                                "px-2.5 py-1.5 rounded-lg text-xs font-serif font-medium transition-all cursor-pointer whitespace-nowrap border",
                                isSelected
                                  ? "bg-brand-sage text-white border-brand-sage shadow-2xs font-semibold"
                                  : "bg-white text-brand-brown/75 border-brand-green/30 hover:bg-brand-beige/50"
                              )}
                            >
                              {topic.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-3">
                      {/* Name input (Optional) */}
                      <div>
                        <label htmlFor="newsletter-name" className="block text-xs font-serif font-medium text-brand-brown/75 mb-1">
                          수신자 호칭 / 이름 (선택)
                        </label>
                        <input
                          id="newsletter-name"
                          type="text"
                          placeholder="예: 김민지 님"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs font-serif bg-white border border-brand-green/30 focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-hidden transition-all text-brand-brown placeholder:text-brand-brown/40 shadow-2xs"
                        />
                      </div>

                      {/* Email input (Required) */}
                      <div>
                        <label htmlFor="newsletter-email" className="block text-xs font-serif font-bold text-brand-brown mb-1">
                          이메일 주소 <span className="text-rose-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="newsletter-email"
                            type="email"
                            required
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-serif bg-white border border-brand-green/30 focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-hidden transition-all text-brand-brown placeholder:text-brand-brown/40 shadow-2xs"
                          />
                          <Mail className="w-4 h-4 text-brand-brown/40 absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Error Notice */}
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-serif text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Privacy Agreement Checkbox */}
                    <label className="flex items-start gap-2 text-xs font-serif text-brand-brown/70 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedToPrivacy}
                        onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                        className="rounded border-brand-green/40 text-brand-sage focus:ring-brand-sage mt-0.5"
                      />
                      <span>
                        [필수] 마음 건강 레터 발송을 위한 이메일 수집 및 정보 수신에 동의합니다. (언제든 구독 취소 가능)
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
                        <span>구독 신청 등록 중...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>무료 마음 건강 레터 구독 신청</span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-[11px] text-brand-brown/50 font-serif flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>개인정보는 암호화되어 안전하게 보관되며 제3자에게 제공되지 않습니다.</span>
                    </div>

                  </form>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
