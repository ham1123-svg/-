import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down more than 250px
      if (window.scrollY > 250) {
        setShowTop(true);
      } else {
        setShowTop(false);
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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
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
            className="flex flex-col items-center justify-center w-12 h-12 bg-white/95 hover:bg-white text-brand-brown rounded-full shadow-lg border border-brand-green/30 hover:border-brand-sage transition-all group cursor-pointer backdrop-blur-xs"
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

      {/* Kakao 1:1 Inquiry */}
      <motion.a
        href="https://pf.kakao.com" // Placeholder
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-[#FEE500] text-[#3C1E1E] px-4 py-3 rounded-full shadow-lg font-bold text-sm"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">카톡 1:1 문의</span>
      </motion.a>
      
      {/* Naver Reservation */}
      <motion.a
        href="https://booking.naver.com" // Placeholder
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-[#03C75A] text-white px-4 py-3 rounded-full shadow-lg font-bold text-sm"
      >
        <Calendar className="w-5 h-5" />
        <span className="hidden sm:inline">네이버 예약하기</span>
      </motion.a>
    </div>
  );
}
