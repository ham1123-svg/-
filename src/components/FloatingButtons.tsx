import React from 'react';
import { MessageCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
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
