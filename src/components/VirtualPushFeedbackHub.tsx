import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  BellRing,
  MessageSquareHeart,
  Smartphone,
  Laptop,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCheck,
  Trash2,
  User,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Clock,
  Heart,
  MessageCircle,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { commentPushService, CommentPushNotification, playPushNotificationChime } from '../services/commentPushService';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface VirtualPushFeedbackHubProps {
  className?: string;
  onNavigateToPost?: (postId: string) => void;
}

export default function VirtualPushFeedbackHub({
  className,
  onNavigateToPost,
}: VirtualPushFeedbackHubProps) {
  const [notifications, setNotifications] = useState<CommentPushNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(commentPushService.isSoundEnabled());
  const [isSimulating, setIsSimulating] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Simulator Form
  const [customPostId, setCustomPostId] = useState('t-7');
  const [customNickname, setCustomNickname] = useState('따뜻한 이웃');
  const [customBadge, setCustomBadge] = useState('따뜻한 응원');
  const [customContent, setCustomContent] = useState('글을 읽으며 깊은 울림을 받았습니다. 앞으로의 모든 발걸음을 진심으로 응원합니다! 🌸');

  // Preview Device Style: 'mobile' (iOS/Galaxy Lock Screen) or 'web' (Desktop Web Push)
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'web'>('mobile');

  // Active selected notification for detail modal / view
  const [selectedNotification, setSelectedNotification] = useState<CommentPushNotification | null>(null);

  useEffect(() => {
    // Initial load
    setNotifications(commentPushService.getAll());

    // Subscribe to live push notifications
    const unsubscribe = commentPushService.subscribe((list) => {
      setNotifications(list);
    });

    return () => unsubscribe();
  }, []);

  const unreadAdminCount = useMemo(() => {
    return notifications.filter((n) => !n.readByAdmin).length;
  }, [notifications]);

  const unreadClientCount = useMemo(() => {
    return notifications.filter((n) => !n.readByClient).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterMode === 'unread') {
        return activeTab === 'admin' ? !n.readByAdmin : !n.readByClient;
      }
      return true;
    });
  }, [notifications, activeTab, filterMode]);

  const latestNotification = notifications[0] || null;

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    commentPushService.setSoundEnabled(next);
    if (next) {
      playPushNotificationChime();
    }
  };

  // Trigger random simulation push
  const handleSimulateRandom = () => {
    setIsSimulating(true);
    setTimeout(() => {
      commentPushService.simulateRandomPush();
      setIsSimulating(false);
    }, 450);
  };

  // Trigger custom push
  const handleCustomPushSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim()) return;

    const postsMap: Record<string, { title: string; author: string; category: string }> = {
      't-7': {
        title: '사람들 시선이 두려워 발표만 하면 목소리가 떨리던 제가, 이제는 담담하게 제 생각을 전합니다.',
        author: '내담자 Y님 (대학원생)',
        category: '대인 불안 · 발표 공포',
      },
      't-10': {
        title: '끊임없는 자책과 인정 욕구에 시달리던 마음이, 이제는 나 자신을 따뜻하게 안아주는 평온을 찾았습니다.',
        author: '내담자 B님 (전문직)',
        category: '성인 심리 · 자존감 회복',
      },
      't-8': {
        title: '사업 위기로 매일 가슴이 조여오고 잠들지 못했는데, 인생의 쉼표를 찍고 다시 일어설 용기를 얻었습니다.',
        author: '내담자 K님 (소상공인)',
        category: '스트레스 · 불면 치유',
      },
      't-2': {
        title: '말만 섞으면 다투던 저희 부부가, 8주간의 부부상담을 통해 서로의 진심을 마주 보게 되었습니다.',
        author: '결혼 5년차 부부 (내담자 J님)',
        category: '부부 갈등 · 대화 회복',
      },
      't-3': {
        title: '방문을 닫고 말문을 닫았던 중학생 아이가, 상담사 선생님과 마음을 열고 다시 미소를 찾았습니다.',
        author: '학부모 L님 (중등 자녀)',
        category: '아동/청소년 · 사춘기 소통',
      },
    };

    const targetPost = postsMap[customPostId] || postsMap['t-7'];

    commentPushService.triggerCommentPush({
      commentId: `comm-cust-${Date.now()}`,
      postId: customPostId,
      postTitle: targetPost.title,
      postAuthorName: targetPost.author,
      postCategory: targetPost.category,
      commentAuthorNickname: customNickname.trim() || '익명의 내담자',
      commentBadge: customBadge,
      commentContent: customContent.trim(),
      target: 'both',
    });

    setShowCustomModal(false);
  };

  const handleMarkAllRead = () => {
    commentPushService.markAllAsRead(activeTab);
  };

  const handleClearAll = () => {
    if (window.confirm('모든 가상 푸시 알림 내역을 초기화하시겠습니까?')) {
      commentPushService.clearAll();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 1. Header Banner & Status Summary */}
      <div className="bg-linear-to-br from-brand-sage/10 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-brand-green/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-brand-sage/5 pointer-events-none blur-2xl" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-brand-sage text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <BellRing className="w-3.5 h-3.5 animate-bounce" />
                <span>실시간 가상 푸시 알림 피드백 허브</span>
              </span>
              <span className="text-xs text-brand-brown/60 font-medium">
                내담자 게시글 댓글 감지 연동 활성화
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
              상담 게시판 댓글 푸시 알림 모니터링
            </h2>
            <p className="text-sm text-brand-brown/70 font-serif mt-1.5 max-w-2xl leading-relaxed">
              내담자가 작성한 후기글에 새로운 응원·공감 댓글이 등록되면, <strong className="text-brand-brown font-bold">상담센터 관리자</strong>와 <strong className="text-brand-brown font-bold">해당 내담자(작성자)</strong> 양측에 실시간으로 발송되는 가상 푸시 알림 피드백 UI입니다.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={cn(
                "px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs",
                soundEnabled
                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                  : "bg-white text-brand-brown/50 border-brand-green/20 hover:bg-brand-beige/30"
              )}
              title={soundEnabled ? "알림 효과음 켜짐 (클릭시 음소거)" : "알림 효과음 꺼짐 (클릭시 켜기)"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>차임벨 ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-brand-brown/40" />
                  <span>차임벨 OFF</span>
                </>
              )}
            </button>

            {/* Custom Push Test Modal Button */}
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-brand-green/30 hover:border-brand-sage text-brand-brown text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:bg-brand-beige/20"
            >
              <Send className="w-3.5 h-3.5 text-brand-sage" />
              <span>직접 댓글 알림 테스트</span>
            </button>

            {/* Quick Random Simulation Button */}
            <button
              type="button"
              onClick={handleSimulateRandom}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 active:scale-98 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
            >
              <Sparkles className={cn("w-4 h-4", isSimulating && "animate-spin")} />
              <span>가상 푸시 알림 즉시 발생 (시뮬레이션)</span>
            </button>
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="mt-6 pt-5 border-t border-brand-green/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 bg-brand-beige/60 rounded-2xl w-fit border border-brand-green/20">
            {/* Admin Perspective Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === 'admin'
                  ? "bg-brand-brown text-white shadow-xs"
                  : "text-brand-brown/70 hover:text-brand-brown hover:bg-white/60"
              )}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>🏢 상담센터 관리자 수신 알림</span>
              {unreadAdminCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold leading-none">
                  {unreadAdminCount}
                </span>
              )}
            </button>

            {/* Client Perspective Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === 'client'
                  ? "bg-brand-sage text-white shadow-xs"
                  : "text-brand-brown/70 hover:text-brand-brown hover:bg-white/60"
              )}
            >
              <User className="w-4 h-4 text-amber-200" />
              <span>👤 해당 후기 작성 내담자 수신 알림</span>
              {unreadClientCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold leading-none">
                  {unreadClientCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-brand-brown/60">디바이스 프리뷰:</span>
            <div className="flex items-center bg-white p-1 rounded-xl border border-brand-green/20">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer",
                  previewDevice === 'mobile' ? "bg-brand-sage text-white" : "text-brand-brown/60 hover:bg-brand-beige/40"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>스마트폰 잠금화면</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('web')}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer",
                  previewDevice === 'web' ? "bg-brand-sage text-white" : "text-brand-brown/60 hover:bg-brand-beige/40"
                )}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>웹 푸시 배너</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Realistic Simulated Push Notification Banner Card (Mockup) */}
      {latestNotification && (
        <div className="bg-stone-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-stone-700 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                LIVE PUSH SIMULATION FEEDBACK
              </span>
              <span>·</span>
              <span>
                {activeTab === 'admin' ? '센터 관리자 수신 뷰' : '게시글 작성 내담자 수신 뷰'}
              </span>
            </div>
            <div className="text-stone-400 text-xs font-mono">
              {latestNotification.createdAt}
            </div>
          </div>

          {/* Device Mockup Wrapper */}
          {previewDevice === 'mobile' ? (
            /* iOS / Galaxy Mobile Lock Screen Push Banner */
            <div className="max-w-xl mx-auto bg-stone-800/90 backdrop-blur-md rounded-2xl p-4 border border-stone-700 shadow-2xl text-stone-100 transition-all">
              <div className="flex items-center justify-between mb-2 text-[11px] text-stone-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-brand-sage flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                    🌿
                  </div>
                  <span className="font-semibold text-stone-200">
                    {activeTab === 'admin' ? '행복바람 상담센터 관리자' : '행복바람 커뮤니티'}
                  </span>
                  <span className="text-stone-400 text-[10px]">· 지금</span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">푸시 알림</span>
              </div>

              <div className="space-y-1.5 pl-7">
                <div className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                  {activeTab === 'admin' ? (
                    <>
                      <span className="text-amber-400">[관리자 알림]</span>
                      <span>내담자 후기에 새 댓글이 등록되었습니다</span>
                    </>
                  ) : (
                    <>
                      <span className="text-rose-400">[내담자 알림]</span>
                      <span>회원님의 후기에 따뜻한 응원이 도착했습니다 🌸</span>
                    </>
                  )}
                </div>

                <div className="text-xs text-stone-300 line-clamp-2 leading-relaxed bg-stone-900/60 p-2.5 rounded-xl border border-stone-700/60">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px] mb-1">
                    <span className="text-stone-300 font-bold">{latestNotification.commentAuthorNickname}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-brand-sage/20 text-emerald-300 border border-emerald-500/30">
                      {latestNotification.commentBadge}
                    </span>
                  </div>
                  <p className="text-stone-200 font-serif">
                    "{latestNotification.commentContent}"
                  </p>
                </div>

                <div className="text-[11px] text-stone-400 pt-1 flex items-center justify-between">
                  <span className="truncate max-w-[260px] sm:max-w-xs text-stone-400">
                    원문: {latestNotification.postTitle}
                  </span>
                  <span className="text-emerald-400 font-semibold shrink-0 cursor-pointer hover:underline text-[11px]">
                    터치하여 확인하기 ›
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Web Push Banner Mockup */
            <div className="max-w-xl mx-auto bg-stone-800 rounded-2xl p-4 border border-stone-700 shadow-2xl flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-sage flex items-center justify-center text-white shrink-0 shadow-md">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-100 truncate">
                    {activeTab === 'admin'
                      ? '행복바람 관리자 센터 · 새 응원 댓글 알림'
                      : '행복바람 · 내 후기글에 새 응원이 도착했습니다'}
                  </h4>
                  <span className="text-[10px] text-stone-400">방금 전</span>
                </div>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                  <strong>{latestNotification.commentAuthorNickname}</strong>님이 [{latestNotification.commentBadge}] 뱃지와 함께 댓글을 남겼습니다: "{latestNotification.commentContent}"
                </p>
                <div className="text-[11px] text-stone-400 mt-2 flex items-center justify-between border-t border-stone-700/60 pt-2">
                  <span className="truncate max-w-xs">
                    게시글: {latestNotification.postTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-stone-700 text-stone-300 text-[10px] hover:bg-stone-600 cursor-pointer">
                      닫기
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-brand-sage text-white text-[10px] font-bold hover:bg-brand-sage/90 cursor-pointer">
                      답글 확인
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Notification Control Bar & History List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-green/20 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-brand-green/15">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-serif font-bold text-brand-brown flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-sage" />
              <span>
                {activeTab === 'admin' ? '상담센터 관리자 수신 알림 내역' : '내담자 수신 알림 내역'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-mono text-xs font-bold">
                {filteredNotifications.length}
              </span>
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center bg-brand-beige/50 p-1 rounded-xl text-xs border border-brand-green/20">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer",
                  filterMode === 'all' ? "bg-white text-brand-brown shadow-2xs font-bold" : "text-brand-brown/60 hover:text-brand-brown"
                )}
              >
                전체 ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('unread')}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer",
                  filterMode === 'unread' ? "bg-white text-brand-brown shadow-2xs font-bold" : "text-brand-brown/60 hover:text-brand-brown"
                )}
              >
                미확인 (
                {activeTab === 'admin' ? unreadAdminCount : unreadClientCount}
                )
              </button>
            </div>
          </div>

          {/* Quick Management Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-xl border border-brand-green/25 hover:border-brand-sage text-brand-brown/80 text-xs font-semibold hover:bg-brand-beige/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-brand-sage" />
              <span>모두 읽음</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl border border-rose-200 hover:border-rose-400 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 삭제</span>
            </button>
          </div>
        </div>

        {/* List of Notification Cards */}
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-brand-brown/60 font-serif space-y-2">
            <Bell className="w-10 h-10 text-brand-brown/20 mx-auto" />
            <p className="text-sm">수신된 가상 푸시 알림이 없습니다.</p>
            <button
              type="button"
              onClick={handleSimulateRandom}
              className="text-xs text-brand-sage hover:underline font-bold font-sans cursor-pointer"
            >
              상단의 [가상 푸시 알림 즉시 발생] 버튼을 눌러 테스트해보세요!
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((noti) => {
              const isUnread = activeTab === 'admin' ? !noti.readByAdmin : !noti.readByClient;

              return (
                <div
                  key={noti.id}
                  onClick={() => {
                    commentPushService.markAsRead(noti.id, activeTab);
                    setSelectedNotification(noti);
                  }}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                    isUnread
                      ? "bg-amber-50/40 border-amber-300/80 hover:bg-amber-50/70 shadow-2xs"
                      : "bg-white border-brand-green/20 hover:bg-brand-beige/20 hover:border-brand-sage/40"
                  )}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Badge Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs",
                        isUnread ? "bg-amber-500 text-white animate-pulse" : "bg-brand-sage/10 text-brand-sage"
                      )}
                    >
                      <MessageSquareHeart className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none">
                            NEW
                          </span>
                        )}
                        <span className="text-xs font-bold text-brand-brown">
                          {noti.commentAuthorNickname}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-brand-sage/15 text-brand-sage text-[10px] font-bold">
                          {noti.commentBadge}
                        </span>
                        <span className="text-xs text-brand-brown/40 font-mono">
                          {noti.createdAt}
                        </span>
                      </div>

                      {/* Comment content snippet */}
                      <p className="text-xs sm:text-sm text-brand-brown/90 font-serif line-clamp-2 leading-relaxed">
                        "{noti.commentContent}"
                      </p>

                      {/* Target Post Title */}
                      <div className="text-[11px] text-brand-brown/60 flex items-center gap-1.5 pt-0.5">
                        <span className="font-semibold text-brand-brown/70">게시글:</span>
                        <span className="truncate max-w-md">{noti.postTitle}</span>
                        {noti.postAuthorName && (
                          <span className="text-brand-brown/40">({noti.postAuthorName})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        commentPushService.markAsRead(noti.id, activeTab);
                        setSelectedNotification(noti);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-brand-beige/60 hover:bg-brand-sage hover:text-white text-brand-brown text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>상세보기</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        commentPushService.deleteNotification(noti.id);
                      }}
                      className="p-1.5 text-brand-brown/40 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="알림 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Detail Modal for a Push Notification */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-7 z-10 border border-brand-green/20 my-auto space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-green/15">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-sage/15 text-brand-sage flex items-center justify-center">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-brand-brown">
                      가상 푸시 알림 피드백 상세
                    </h3>
                    <p className="text-[11px] text-brand-brown/50">
                      수신 시각: {selectedNotification.createdAt} ({new Date(selectedNotification.timestamp).toLocaleString('ko-KR')})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 text-brand-brown/50 hover:text-brand-brown rounded-xl hover:bg-brand-beige/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notification Context Box */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span>💬 {selectedNotification.commentAuthorNickname}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-amber-800 border border-amber-300 font-bold">
                      {selectedNotification.commentBadge}
                    </span>
                  </span>
                  <span className="text-amber-700/60 text-[11px]">응원 댓글</span>
                </div>
                <p className="text-sm font-serif text-amber-950 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200/50">
                  "{selectedNotification.commentContent}"
                </p>
              </div>

              {/* Original Post Information */}
              <div className="bg-brand-beige/30 p-4 rounded-2xl border border-brand-green/20 space-y-2">
                <div className="text-xs font-bold text-brand-brown/70 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>원문 게시글 정보</span>
                </div>
                <h4 className="font-bold text-sm text-brand-brown leading-snug">
                  {selectedNotification.postTitle}
                </h4>
                <div className="text-xs text-brand-brown/60 flex items-center gap-3">
                  <span>작성자: {selectedNotification.postAuthorName}</span>
                  {selectedNotification.postCategory && (
                    <span>카테고리: {selectedNotification.postCategory}</span>
                  )}
                </div>
              </div>

              {/* Push Dispatch Summary */}
              <div className="text-xs text-brand-brown/70 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">상담센터 관리자 전달 상태:</span>
                  <span className="text-emerald-700 font-bold">✓ 푸시 수신 완료</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">게시글 작성 내담자 전달 상태:</span>
                  <span className="text-emerald-700 font-bold">✓ 모바일 앱/웹 푸시 발송 완료</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Link
                  to="/community"
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>커뮤니티 게시판 바로가기</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Custom Push Simulation Test Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCustomModal(false)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 z-10 border border-brand-green/20 my-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-green/15">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-brand-sage" />
                  <h3 className="font-serif font-bold text-base text-brand-brown">
                    댓글 작성 및 가상 푸시 발송 테스트
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="p-1.5 text-brand-brown/50 hover:text-brand-brown rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCustomPushSubmit} className="space-y-4">
                {/* Select Target Post */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown/80 mb-1">
                    대상 후기글 선택
                  </label>
                  <select
                    value={customPostId}
                    onChange={(e) => setCustomPostId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs text-brand-brown focus:ring-2 focus:ring-brand-sage outline-hidden bg-brand-beige/20 font-medium"
                  >
                    <option value="t-7">[대인 불안] 사람들 시선이 두려워 발표만 하면 목소리가 떨리던 제가... (내담자 Y님)</option>
                    <option value="t-10">[성인 심리] 끊임없는 자책과 인정 욕구에 시달리던 마음이... (내담자 B님)</option>
                    <option value="t-8">[스트레스] 사업 위기로 매일 가슴이 조여오고 잠들지 못했는데... (내담자 K님)</option>
                    <option value="t-2">[부부 갈등] 말만 섞으면 다투던 저희 부부가 대화의 물꼬를... (내담자 J님)</option>
                    <option value="t-3">[아동/청소년] 방문을 닫고 말문을 닫았던 중학생 아이가... (학부모 L님)</option>
                  </select>
                </div>

                {/* Nickname & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-brown/80 mb-1">
                      댓글 작성자 닉네임
                    </label>
                    <input
                      type="text"
                      value={customNickname}
                      onChange={(e) => setCustomNickname(e.target.value)}
                      placeholder="예: 따뜻한 이웃"
                      className="w-full px-3.5 py-2 rounded-xl border border-brand-green/30 text-xs text-brand-brown focus:ring-2 focus:ring-brand-sage outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-brown/80 mb-1">
                      공감 뱃지 선택
                    </label>
                    <select
                      value={customBadge}
                      onChange={(e) => setCustomBadge(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-brand-green/30 text-xs text-brand-brown focus:ring-2 focus:ring-brand-sage outline-hidden bg-white"
                    >
                      <option value="따뜻한 응원">🌸 따뜻한 응원</option>
                      <option value="깊은 공감">🌿 깊은 공감</option>
                      <option value="용기에 감사해요">✨ 용기에 감사해요</option>
                      <option value="함께 걸어가요">💛 함께 걸어가요</option>
                      <option value="온전한 지지">🛡️ 온전한 지지</option>
                    </select>
                  </div>
                </div>

                {/* Comment Content */}
                <div>
                  <label className="block text-xs font-bold text-brand-brown/80 mb-1">
                    응원 댓글 내용
                  </label>
                  <textarea
                    rows={3}
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    placeholder="내담자에게 전할 따뜻한 응원과 공감의 한마디를 입력하세요."
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-green/30 text-xs text-brand-brown focus:ring-2 focus:ring-brand-sage outline-hidden resize-none"
                    required
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-brand-green/15">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 py-2 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>푸시 알림 즉시 발송</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
