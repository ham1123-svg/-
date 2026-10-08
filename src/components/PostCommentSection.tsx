import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareHeart,
  Heart,
  Send,
  Sparkles,
  ShieldCheck,
  Smile,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  ThumbsUp
} from 'lucide-react';
import { commentService, PostComment } from '../services/commentService';
import { commentPushService } from '../services/commentPushService';
import { cn } from '../lib/utils';

interface PostCommentSectionProps {
  postId: string;
  postTitle?: string;
  postAuthorName?: string;
  postCategory?: string;
  className?: string;
}

const BADGE_OPTIONS: { id: PostComment['badge']; label: string; icon: string; color: string; bg: string }[] = [
  { id: '따뜻한 응원', label: '따뜻한 응원', icon: '🌸', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  { id: '깊은 공감', label: '깊은 공감', icon: '🌿', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { id: '용기에 감사해요', label: '용기에 감사해요', icon: '✨', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { id: '함께 걸어가요', label: '함께 걸어가요', icon: '💛', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  { id: '온전한 지지', label: '온전한 지지', icon: '🛡️', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
];

const NICKNAME_SUGGESTIONS = [
  '익명의 내담자',
  '따뜻한 이웃',
  '용기낸 동행자',
  '마음 편한 친구',
  '회복 중인 이웃',
  '평온을 찾는 나그네',
  '작은 쉼표 하나',
  '든든한 지지자',
];

export default function PostCommentSection({
  postId,
  postTitle,
  postAuthorName,
  postCategory,
  className,
}: PostCommentSectionProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form State
  const [authorNickname, setAuthorNickname] = useState<string>('익명의 내담자');
  const [selectedBadge, setSelectedBadge] = useState<PostComment['badge']>('따뜻한 응원');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // User liked comments set
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('hbbr_liked_post_comments');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const loadComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const list = await commentService.getCommentsByPostId(postId);
      setComments(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
    const unsubscribe = commentService.subscribe(() => {
      loadComments();
    });
    return () => unsubscribe();
  }, [loadComments]);

  // Handle Nickname Shuffle
  const handleShuffleNickname = () => {
    const randomName = NICKNAME_SUGGESTIONS[Math.floor(Math.random() * NICKNAME_SUGGESTIONS.length)];
    setAuthorNickname(randomName);
  };

  // Submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const addedComment = await commentService.addComment({
        postId,
        authorNickname: authorNickname.trim() || '익명의 내담자',
        badge: selectedBadge,
        content: content.trim(),
      });

      // Virtual push notification feedback for counseling center admin and post author client
      commentPushService.triggerCommentPush({
        commentId: addedComment.id,
        postId,
        postTitle: postTitle || '내담자 상담 후기',
        postAuthorName: postAuthorName || '익명의 내담자',
        postCategory: postCategory || '심리상담 후기',
        commentAuthorNickname: addedComment.authorNickname,
        commentBadge: addedComment.badge,
        commentContent: addedComment.content,
        target: 'both',
      });

      setContent('');
      setSubmitSuccessNotice('따뜻한 응원의 한마디가 등록되었습니다. 🌿');
      setTimeout(() => setSubmitSuccessNotice(null), 3500);
      loadComments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like comment
  const handleLikeComment = async (commentId: string) => {
    if (likedCommentIds.has(commentId)) return;

    const newLiked = new Set(likedCommentIds);
    newLiked.add(commentId);
    setLikedCommentIds(newLiked);
    try {
      localStorage.setItem('hbbr_liked_post_comments', JSON.stringify([...newLiked]));
    } catch {}

    await commentService.likeComment(commentId);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likeCount: c.likeCount + 1 } : c))
    );
  };

  return (
    <div className={cn("mt-8 pt-6 border-t border-brand-green/20 space-y-6", className)}>
      
      {/* 1. Header with Badge & Encouragement Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <MessageSquareHeart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-brand-brown flex items-center gap-2">
              <span>내담자들의 따뜻한 응원과 공감</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-mono font-bold">
                {comments.length}
              </span>
            </h4>
            <p className="text-[11px] text-brand-brown/60 font-serif">
              서로의 용기와 회복 여정에 따뜻한 온기와 지지의 한마디를 나누어보세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-brand-brown/60 bg-brand-beige/50 px-3 py-1.5 rounded-xl border border-brand-green/20 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
          <span>100% 익명 안심 댓글</span>
        </div>
      </div>

      {/* 2. New Comment Input Form */}
      <form onSubmit={handleSubmitComment} className="p-4 sm:p-5 rounded-2xl bg-brand-beige/35 border border-brand-green/30 space-y-3.5">
        
        {/* Nickname and Badge Selection Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Nickname Input & Randomize */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-brand-brown/70 shrink-0">
              작성자:
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={authorNickname}
                onChange={(e) => setAuthorNickname(e.target.value)}
                maxLength={15}
                placeholder="익명의 닉네임"
                className="w-36 sm:w-44 px-3 py-1.5 rounded-xl border border-brand-green/30 text-xs font-serif bg-white focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage/30 text-brand-brown font-semibold"
              />
              <button
                type="button"
                onClick={handleShuffleNickname}
                title="추천 닉네임으로 변경"
                className="ml-1 p-1.5 rounded-lg text-brand-brown/50 hover:text-brand-sage hover:bg-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cheering Badge Pill Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {BADGE_OPTIONS.map((badge) => {
              const isSelected = selectedBadge === badge.id;
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setSelectedBadge(badge.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-[11px] font-serif font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer border",
                    isSelected
                      ? "bg-brand-sage text-white border-brand-sage shadow-2xs scale-102"
                      : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage/50"
                  )}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="소중한 후기를 남겨주신 내담자분께 따뜻한 응원이나 공감의 메시지를 남겨주세요. (예: 저도 비슷한 경험으로 힘들었는데 큰 용기를 얻었습니다. 감사드려요!)"
            className="w-full p-3 pr-20 rounded-xl border border-brand-green/30 bg-white text-xs sm:text-sm font-serif focus:outline-none focus:border-brand-sage focus:ring-1 focus:ring-brand-sage/30 resize-none text-brand-brown placeholder:text-brand-brown/40 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={cn(
              "absolute right-2.5 bottom-2.5 px-3 py-1.5 rounded-xl text-xs font-serif font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95",
              content.trim() && !isSubmitting
                ? "bg-brand-sage hover:bg-brand-sage/90 text-white"
                : "bg-brand-beige text-brand-brown/40 border border-brand-green/20 cursor-not-allowed"
            )}
          >
            <span>{isSubmitting ? '등록 중...' : '응원 남기기'}</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        {/* Helper Note & Character Count */}
        <div className="flex items-center justify-between text-[10px] text-brand-brown/50 font-serif">
          <span>* 비방, 욕설, 광고성 내용은 서로의 안전한 치유를 위해 제한됩니다.</span>
          <span>{content.length} / 300자</span>
        </div>

        {/* Success Alert */}
        {submitSuccessNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-serif text-center animate-fade-in flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{submitSuccessNotice}</span>
          </div>
        )}
      </form>

      {/* 3. Existing Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center text-xs font-serif text-brand-brown/50">
            응원 댓글을 불러오는 중입니다...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center bg-brand-beige/20 rounded-2xl border border-dashed border-brand-green/30 space-y-1.5">
            <Smile className="w-6 h-6 text-brand-sage/60 mx-auto" />
            <p className="text-xs font-serif text-brand-brown/70 font-semibold">
              아직 등록된 응원 댓글이 없습니다.
            </p>
            <p className="text-[11px] font-serif text-brand-brown/50">
              이 사연에 첫 번째 따뜻한 응원의 손길을 건네보세요.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const badgeMeta = BADGE_OPTIONS.find((b) => b.id === comment.badge) || BADGE_OPTIONS[0];
            const isLiked = likedCommentIds.has(comment.id);

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-green/25 hover:border-brand-sage/40 transition-all shadow-2xs space-y-2"
              >
                {/* Header: Author & Badge & Date */}
                <div className="flex items-center justify-between gap-2 text-xs font-serif">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-beige text-brand-brown/70 flex items-center justify-center font-bold text-[11px] border border-brand-green/30">
                      {comment.authorNickname.slice(0, 1)}
                    </div>
                    <span className="font-bold text-brand-brown text-xs">
                      {comment.authorNickname}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1",
                        badgeMeta.bg,
                        badgeMeta.color
                      )}
                    >
                      <span>{badgeMeta.icon}</span>
                      <span>{comment.badge}</span>
                    </span>
                  </div>

                  <span className="text-[10px] text-brand-brown/40 font-mono">
                    {comment.createdAt}
                  </span>
                </div>

                {/* Content Message */}
                <p className="text-xs sm:text-sm text-brand-brown/85 font-serif leading-relaxed whitespace-pre-line pl-8">
                  {comment.content}
                </p>

                {/* Footer: Like Button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleLikeComment(comment.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-serif font-bold transition-all cursor-pointer",
                      isLiked
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "text-brand-brown/60 hover:text-rose-600 hover:bg-rose-50/50"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-3.5 h-3.5 transition-transform active:scale-125",
                        isLiked ? "fill-rose-500 text-rose-500" : "text-brand-brown/40"
                      )}
                    />
                    <span>공감 ({comment.likeCount || 0})</span>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
