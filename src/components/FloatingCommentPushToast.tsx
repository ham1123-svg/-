import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, X, MessageSquareHeart, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { CommentPushNotification } from '../services/commentPushService';
import { useNavigate } from 'react-router-dom';

export default function FloatingCommentPushToast() {
  const [currentPush, setCurrentPush] = useState<CommentPushNotification | null>(null);
  const [recipientView, setRecipientView] = useState<'admin' | 'client'>('admin');
  const navigate = useNavigate();

  useEffect(() => {
    const handlePushEvent = (e: any) => {
      const push: CommentPushNotification = e.detail;
      if (push) {
        setCurrentPush(push);
      }
    };

    window.addEventListener('hbbr_comment_push_toast', handlePushEvent);
    return () => {
      window.removeEventListener('hbbr_comment_push_toast', handlePushEvent);
    };
  }, []);

  // Auto-dismiss after 6.5 seconds
  useEffect(() => {
    if (!currentPush) return;
    const timer = setTimeout(() => {
      setCurrentPush(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [currentPush]);

  if (!currentPush) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm sm:max-w-md w-full pointer-events-none p-2 sm:p-0">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-stone-700 space-y-2.5"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="flex items-center gap-1 font-bold text-emerald-400">
                <BellRing className="w-3.5 h-3.5" />
                <span>가상 푸시 알림 피드백</span>
              </div>
              <span className="text-stone-500">·</span>
              <button
                type="button"
                onClick={() => setRecipientView(recipientView === 'admin' ? 'client' : 'admin')}
                className="text-[10px] text-amber-300 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                title="수신 대상 전환"
              >
                {recipientView === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>[관리자 수신]</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    <span>[내담자 수신]</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPush(null)}
              className="p-1 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-sage flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-bold text-xs text-stone-100 flex items-center gap-1.5 truncate">
                <span>{currentPush.commentAuthorNickname}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-brand-sage/20 text-emerald-300 border border-emerald-500/30 font-normal">
                  {currentPush.commentBadge}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-serif line-clamp-2 leading-relaxed">
                "{currentPush.commentContent}"
              </p>
              <div className="text-[10px] text-stone-400 truncate">
                원문: {currentPush.postTitle}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[11px]">
            <span className="text-stone-400 text-[10px]">
              {recipientView === 'admin' ? '상담센터 관리자 대시보드' : '작성자 회원 알림'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentPush(null);
                  navigate('/admin');
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium cursor-pointer"
              >
                대시보드 보기
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPush(null);
                  navigate('/community');
                }}
                className="px-2.5 py-1 rounded-lg bg-brand-sage hover:bg-brand-sage/90 text-white font-bold cursor-pointer"
              >
                게시글 확인
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
