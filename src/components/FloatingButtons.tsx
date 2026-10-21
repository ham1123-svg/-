import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, ChevronUp, PhoneCall, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuickReservationModal from './QuickReservationModal';
import { useHighContrast } from '../context/HighContrastContext';
import { cn } from '../lib/utils';
import { getKakaoChatUrl } from '../lib/kakaoConfig';

export default function FloatingButtons() {
  const { isHighContrast } = useHighContrast();
  const [showTop, setShowTop] = useState(false);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [kakaoUrl, setKakaoUrl] = useState<string>(getKakaoChatUrl);

  useEffect(() => {
    const handleUrlUpdate = () => setKakaoUrl(getKakaoChatUrl());
    window.addEventListener('kakao-url-updated', handleUrlUpdate);
    return () => window.removeEventListener('kakao-url-updated', handleUrlUpdate);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolledPast = window.scrollY > 250;
          setShowTop(prev => (prev !== isScrolledPast ? isScrolledPast : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div 
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))] z-40 flex flex-col items-end gap-2.5 pointer-events-none"
        role="region"
        aria-label="빠른 실행 및 플로팅 상담 메뉴"
      >
        {/* Top Button (스크롤 내린 경우 표시) */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 15 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-auto flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all group cursor-pointer",
                isHighContrast
                  ? "bg-black text-white border-2 border-white"
                  : "bg-white hover:bg-white text-brand-brown border border-brand-green/30 hover:border-brand-sage"
              )}
              aria-label="페이지 최상단으로 바로 가기"
              title="최상단(TOP)으로 바로 가기"
            >
              <ChevronUp className="w-5 h-5 text-brand-sage group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-extrabold tracking-wider leading-none text-brand-brown/80 group-hover:text-brand-brown">
                TOP
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick Reservation (간편 전화상담 예약) Button */}
        <motion.button
          type="button"
          onClick={() => setIsQuickModalOpen(true)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "pointer-events-auto relative flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-bold text-sm cursor-pointer transition-all border",
            isHighContrast
              ? "bg-amber-400 text-black border-amber-500 font-extrabold"
              : "bg-brand-sage hover:bg-brand-sage/95 text-white border-white/30 hover:shadow-brand-sage/30 hover:shadow-2xl"
          )}
          aria-label="성함과 연락처로 간편 전화상담 예약 신청하기"
          title="성함과 연락처만으로 빠른 전화상담 요청"
        >
          {/* Subtle animated notification ping */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>

          <PhoneCall className="w-4 h-4" />
          <span className="font-bold tracking-tight">간편 예약</span>
          <span className="hidden sm:inline text-xs font-medium text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
            전화상담 신청
          </span>
        </motion.button>

        {/* Kakao 1:1 Inquiry */}
        <motion.a
          href={kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto flex items-center gap-2 bg-[#FEE500] text-[#3C1E1E] px-4 py-3 rounded-full shadow-lg font-bold text-sm cursor-pointer border border-[#eed700]"
          aria-label="카카오톡 1:1 상담 문의"
          title="카카오톡 1:1 상담 문의"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">카톡 1:1 문의</span>
        </motion.a>
        
        {/* Naver Reservation */}
        <motion.a
          href="https://booking.naver.com" // Placeholder
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto flex items-center gap-2 bg-[#03C75A] text-white px-4 py-3 rounded-full shadow-lg font-bold text-sm cursor-pointer border border-emerald-600"
          aria-label="네이버 실시간 예약하기"
          title="네이버 실시간 예약하기"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">네이버 예약하기</span>
        </motion.a>
      </div>

      {/* Simplified Quick Reservation Modal */}
      <QuickReservationModal 
        isOpen={isQuickModalOpen} 
        onClose={() => setIsQuickModalOpen(false)} 
      />
    </>
  );
}
