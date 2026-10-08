import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Tag, 
  Plus, 
  RefreshCw, 
  Check, 
  X, 
  User, 
  Heart, 
  ArrowRight,
  Eye,
  MessageSquareHeart,
  Quote,
  BellRing
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Testimonial } from '../types';
import { testimonialService } from '../services/testimonialService';
import { commentPushService } from '../services/commentPushService';

interface AdminReviewManagerProps {
  onShowToast?: (msg: string) => void;
  className?: string;
}

export default function AdminReviewManager({
  onShowToast,
  className
}: AdminReviewManagerProps) {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [editingReview, setEditingReview] = useState<Testimonial | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load reviews from service
  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getTestimonials(true);
      setReviews(data);
    } catch (e) {
      console.error("Failed to load testimonials:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
    // Subscribe to changes
    const unsubscribe = testimonialService.subscribe(() => {
      loadReviews();
    });
    return () => unsubscribe();
  }, [loadReviews]);

  // Statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const approved = reviews.filter(r => r.status === 'approved' || !r.status).length;
    const rejected = reviews.filter(r => r.status === 'rejected').length;
    const bestCount = reviews.filter(r => r.isBest).length;
    return { total, pending, approved, rejected, bestCount };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const status = r.status || 'approved';
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const inName = (r.clientName || '').toLowerCase().includes(q);
        const inHeadline = (r.headline || '').toLowerCase().includes(q);
        const inStory = (r.story || '').toLowerCase().includes(q);
        const inTags = (r.tags || []).some(t => t.toLowerCase().includes(q));
        const inProgram = (r.programTaken || '').toLowerCase().includes(q);
        if (!inName && !inHeadline && !inStory && !inTags && !inProgram) return false;
      }
      return true;
    });
  }, [reviews, statusFilter, categoryFilter, searchTerm]);

  // Quick Action: Approve
  const handleApprove = async (id: string, clientName: string) => {
    const success = await testimonialService.approveReview(id);
    if (success) {
      if (onShowToast) onShowToast(`[${clientName}] 후기가 정상 승인되어 공개되었습니다.`);
      await loadReviews();
    } else {
      alert('승인 처리에 실패했습니다.');
    }
  };

  // Quick Action: Reject / Hold
  const handleReject = async (id: string, clientName: string) => {
    const success = await testimonialService.rejectReview(id);
    if (success) {
      if (onShowToast) onShowToast(`[${clientName}] 후기가 보류/반려 처리되었습니다.`);
      await loadReviews();
    } else {
      alert('반려 처리에 실패했습니다.');
    }
  };

  // Quick Action: Toggle Best
  const handleToggleBest = async (review: Testimonial) => {
    const updated = !review.isBest;
    const success = await testimonialService.updateReview(review.id, { isBest: updated });
    if (success) {
      if (onShowToast) onShowToast(updated ? 'BEST 후기로 등록되었습니다.' : 'BEST 후기 지정이 해제되었습니다.');
      await loadReviews();
    }
  };

  // Quick Action: Delete
  const confirmDelete = async () => {
    if (!deletingId) return;
    const success = await testimonialService.deleteReview(deletingId);
    if (success) {
      if (onShowToast) onShowToast('후기가 안전하게 삭제되었습니다.');
      setDeletingId(null);
      await loadReviews();
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
              내담자 상담 후기 관리
            </h2>
            {stats.pending > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse shadow-xs">
                승인 대기 {stats.pending}건
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-brand-brown/65 font-serif mt-0.5">
            내담자가 등록한 치유 후기를 비식별화 검토 후 승인/수정/삭제 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* 가상 댓글 푸시 알림 발생 테스트 */}
          <button
            type="button"
            onClick={() => {
              commentPushService.simulateRandomPush();
              if (onShowToast) onShowToast('가상 댓글 푸시 알림이 발송되었습니다. 🔔');
            }}
            className="px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100/80 text-rose-900 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title="후기글에 가상의 응원 댓글이 달렸을 때의 푸시 알림 피드백 테스트"
          >
            <BellRing className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
            <span>댓글 푸시 알림 테스트</span>
          </button>

          <button
            type="button"
            onClick={loadReviews}
            className="p-2.5 rounded-xl border border-brand-green/30 text-brand-brown hover:bg-brand-beige/50 hover:text-brand-sage transition-all shadow-2xs cursor-pointer"
            title="새로고침"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>

          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-serif font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 후기 직접 등록</span>
          </button>
        </div>
      </div>

      {/* Push Notification Feedback Banner */}
      <div className="bg-linear-to-r from-rose-50/70 via-amber-50/50 to-emerald-50/40 rounded-2xl p-4 border border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-brown shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-brand-brown flex items-center gap-2">
              <span>내담자 게시글 댓글 실시간 가상 푸시 알림 연동 중</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-[11px] text-brand-brown/70 font-serif">
              내담자가 쓴 후기글에 응원·공감 댓글이 달리면 상담센터 관리자 대시보드 및 해당 내담자에게 즉각 푸시 피드백이 전송됩니다.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              commentPushService.simulateRandomPush();
              if (onShowToast) onShowToast('가상 댓글 푸시 알림이 발송되었습니다. 🔔');
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <BellRing className="w-3 h-3 text-rose-500" />
            <span>알림 1건 발생</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
            statusFilter === 'all'
              ? "bg-brand-brown text-white border-brand-brown shadow-sm"
              : "bg-white text-brand-brown border-brand-green/30 hover:border-brand-brown/40"
          )}
        >
          <div className="text-xs font-serif opacity-80 mb-1">전체 후기</div>
          <div className="text-2xl font-bold font-mono">{stats.total}건</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs relative",
            statusFilter === 'pending'
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-amber-50/70 text-amber-900 border-amber-200 hover:border-amber-400"
          )}
        >
          {stats.pending > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <div className="text-xs font-serif opacity-80 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>승인 대기 (신규)</span>
          </div>
          <div className="text-2xl font-bold font-mono">{stats.pending}건</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
            statusFilter === 'approved'
              ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
              : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:border-emerald-400"
          )}
        >
          <div className="text-xs font-serif opacity-80 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>승인 완료 (공개중)</span>
          </div>
          <div className="text-2xl font-bold font-mono">{stats.approved}건</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs",
            statusFilter === 'rejected'
              ? "bg-slate-700 text-white border-slate-700 shadow-sm"
              : "bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400"
          )}
        >
          <div className="text-xs font-serif opacity-80 mb-1 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>반려 / 보류</span>
          </div>
          <div className="text-2xl font-bold font-mono">{stats.rejected}건</div>
        </button>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-green/30 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tab Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: '전체' },
            { id: 'pending', label: `승인대기 (${stats.pending})` },
            { id: 'approved', label: `승인됨 (${stats.approved})` },
            { id: 'rejected', label: `보류/반려 (${stats.rejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap",
                statusFilter === tab.id
                  ? "bg-brand-sage text-white shadow-2xs"
                  : "text-brand-brown/70 hover:bg-brand-beige/60 hover:text-brand-brown"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category & Search Input */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white focus:outline-hidden focus:border-brand-sage cursor-pointer"
          >
            <option value="all">전체 상담 분야</option>
            <option value="adult">성인·번아웃</option>
            <option value="couple">부부·가족</option>
            <option value="youth">청소년·자녀</option>
            <option value="anxiety">불안·자존감</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-brand-brown/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="내담자명, 헤드라인, 태그 검색"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white focus:outline-hidden focus:border-brand-sage"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-brown/40 hover:text-brand-brown cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Reviews List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-green/20">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-sage mx-auto mb-2" />
          <p className="text-xs font-serif text-brand-brown/60">후기 목록을 불러오는 중입니다...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-green/20 space-y-2">
          <MessageSquareHeart className="w-10 h-10 text-brand-brown/30 mx-auto" />
          <h4 className="text-sm font-serif font-bold text-brand-brown">
            조회된 후기가 없습니다
          </h4>
          <p className="text-xs font-serif text-brand-brown/50">
            필터 조건을 변경하거나 검색어를 초기화해 보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((item, itemIdx) => {
            const status = item.status || 'approved';
            const isPending = status === 'pending';
            const isApproved = status === 'approved';
            const isRejected = status === 'rejected';

            return (
              <div
                key={`${item.id}-${itemIdx}`}
                className={cn(
                  "p-5 sm:p-6 rounded-3xl border transition-all bg-white relative flex flex-col justify-between shadow-2xs hover:shadow-md",
                  isPending && "border-amber-300 bg-amber-50/20",
                  isApproved && "border-brand-green/30",
                  isRejected && "border-slate-300 opacity-75 bg-slate-50/30"
                )}
              >
                <div>
                  {/* Top Header: Badges & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-brand-green/15">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status Badge */}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-serif font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>승인 대기중</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-serif font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>승인 완료 (공개)</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300 text-xs font-serif font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>반려 / 비공개</span>
                        </span>
                      )}

                      {/* Best Badge Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleBest(item)}
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-serif font-bold border transition-colors flex items-center gap-1 cursor-pointer",
                          item.isBest
                            ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                            : "bg-white text-brand-brown/50 border-brand-green/30 hover:border-amber-400"
                        )}
                        title="BEST 후기 지정/해제 토글"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{item.isBest ? 'BEST 후기 지정됨' : '+ BEST 지정'}</span>
                      </button>

                      {/* Category Label */}
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-green/30 text-brand-sage text-xs font-serif font-bold">
                        {item.categoryLabel || item.category}
                      </span>
                    </div>

                    {/* Date & Rating */}
                    <div className="flex items-center gap-2 text-xs font-serif text-brand-brown/60">
                      <div className="flex text-amber-400">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 stroke-none" />
                        ))}
                      </div>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Client Info Banner */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-sage text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                      {item.initial || item.clientName.slice(0, 1)}
                    </div>
                    <div>
                      <span className="text-sm font-serif font-bold text-brand-brown mr-1.5">
                        {item.clientName}
                      </span>
                      <span className="text-xs text-brand-brown/60 font-serif mr-2">
                        ({item.ageGroupAndRole})
                      </span>
                      <span className="text-xs text-brand-sage font-medium font-serif">
                        {item.programTaken}
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h4 className="text-base font-serif font-bold text-brand-brown mb-2 leading-snug">
                    {item.headline}
                  </h4>

                  {/* Story */}
                  <p className="text-xs sm:text-sm text-brand-brown/80 font-serif leading-relaxed mb-3 whitespace-pre-line bg-brand-beige/30 p-3 rounded-xl border border-brand-green/15">
                    {item.story}
                  </p>

                  {/* Before & After Info */}
                  <div className="grid sm:grid-cols-2 gap-2 text-xs font-serif mb-3">
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                      <span className="font-bold text-rose-800 text-[10px] block mb-0.5">[상담 전]</span>
                      <span className="text-brand-brown/80">{item.beforeState}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span className="font-bold text-emerald-800 text-[10px] block mb-0.5">[상담 후]</span>
                      <span className="text-emerald-950 font-medium">{item.afterState}</span>
                    </div>
                  </div>

                  {/* Clinical Commentary if exists */}
                  {item.counselorInsight && (
                    <div className="p-2.5 rounded-xl bg-brand-green/20 border border-brand-sage/30 text-xs font-serif text-brand-brown/90 mb-3">
                      <span className="font-bold text-brand-sage block mb-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>박미경 소장의 임상 코멘트:</span>
                      </span>
                      <p className="text-[11px] leading-relaxed">{item.counselorInsight}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <Tag className="w-3 h-3 text-brand-sage mr-0.5" />
                      {item.tags.map((t, idx) => (
                        <span 
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-brand-beige text-brand-brown/75 font-serif border border-brand-green/25"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-brand-green/15 flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    {/* Approve Button */}
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id, item.clientName)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-serif font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>승인 및 공개</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => handleReject(item.id, item.clientName)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-serif font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>보류/반려</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingReview(item)}
                      className="px-3 py-1.5 rounded-xl border border-brand-green/30 text-brand-brown hover:bg-brand-beige/50 text-xs font-serif font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-sage" />
                      <span>수정 / 임상 코멘트 작성</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="후기 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deletingId && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-brand-brown">
                이 상담 후기를 삭제하시겠습니까?
              </h4>
              <p className="text-xs text-brand-brown/65 font-serif leading-relaxed">
                삭제된 후기는 데이터베이스에서 완전히 삭제되며 복구할 수 없습니다.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl border border-brand-green/30 text-xs font-serif font-bold text-brand-brown hover:bg-brand-beige/50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-serif font-bold cursor-pointer"
                >
                  네, 삭제합니다
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Review Modal */}
      {editingReview && (
        <AdminReviewEditModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSave={async (updated) => {
            const success = await testimonialService.updateReview(editingReview.id, updated);
            if (success) {
              if (onShowToast) onShowToast('후기가 성공적으로 수정되었습니다.');
              setEditingReview(null);
              await loadReviews();
            } else {
              alert('수정 저장에 실패했습니다.');
            }
          }}
        />
      )}

      {/* New Direct Review Modal */}
      {isWriteModalOpen && (
        <AdminReviewEditModal
          isNew
          onClose={() => setIsWriteModalOpen(false)}
          onSave={async (newReview) => {
            const result = await testimonialService.submitReview({
              ...newReview,
              status: 'approved' // Direct admin additions are approved immediately
            });
            if (result.success) {
              if (onShowToast) onShowToast('새 상담 후기가 등록되었습니다.');
              setIsWriteModalOpen(false);
              await loadReviews();
            } else {
              alert(result.message || '등록에 실패했습니다.');
            }
          }}
        />
      )}

    </div>
  );
}

// Sub-component: Edit & Direct Write Modal
function AdminReviewEditModal({
  review,
  isNew = false,
  onClose,
  onSave
}: {
  review?: Testimonial;
  isNew?: boolean;
  onClose: () => void;
  onSave: (data: Partial<Testimonial>) => Promise<void>;
}) {
  const [clientName, setClientName] = useState(review?.clientName || '');
  const [ageGroupAndRole, setAgeGroupAndRole] = useState(review?.ageGroupAndRole || '30대 직장인');
  const [category, setCategory] = useState<'child' | 'youth' | 'adult' | 'couple' | 'anxiety' | string>(review?.category || 'adult');
  const [categoryLabel, setCategoryLabel] = useState(review?.categoryLabel || '성인 심리 · 번아웃 극복');
  const [programTaken, setProgramTaken] = useState(review?.programTaken || '개인 심리상담 (10회기 종결)');
  const [rating, setRating] = useState<number>(review?.rating || 5);
  const [headline, setHeadline] = useState(review?.headline || '');
  const [story, setStory] = useState(review?.story || '');
  const [beforeState, setBeforeState] = useState(review?.beforeState || '');
  const [afterState, setAfterState] = useState(review?.afterState || '');
  const [counselorInsight, setCounselorInsight] = useState(review?.counselorInsight || '');
  const [period, setPeriod] = useState(review?.period || '2026.09 종결');
  const [tagsStr, setTagsStr] = useState((review?.tags || []).join(', '));
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>(review?.status || (isNew ? 'approved' : 'pending'));
  const [isBest, setIsBest] = useState<boolean>(review?.isBest || false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedTags = tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => (t.startsWith('#') ? t : `#${t}`));

      await onSave({
        clientName: clientName.trim() || '내담자 익명 (가명)',
        initial: (clientName.trim() || 'H').replace(/[^a-zA-Z가-힣]/g, '').slice(0, 1),
        ageGroupAndRole,
        category,
        categoryLabel,
        programTaken,
        rating: Number(rating),
        headline: headline.trim(),
        story: story.trim(),
        beforeState: beforeState.trim(),
        afterState: afterState.trim(),
        counselorInsight: counselorInsight.trim(),
        period,
        tags: parsedTags,
        status,
        isBest
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-green/30 overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="p-5 border-b border-brand-green/20 bg-brand-beige/40 flex items-center justify-between shrink-0">
          <h3 className="text-base sm:text-lg font-serif font-bold text-brand-brown flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-brand-sage" />
            <span>{isNew ? '새 상담 후기 직접 등록' : '상담 후기 수정 및 임상 코멘트 추가'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-brand-brown/60 hover:text-brand-brown hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Top Control Bar: Status & Best Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-brand-beige/60 rounded-2xl border border-brand-green/20">
            <div>
              <label className="block text-[11px] font-serif font-bold text-brand-brown mb-1">
                게시 승인 상태
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-brand-green/30 text-xs font-serif font-bold bg-white text-brand-brown"
              >
                <option value="approved">승인 완료 (사이트에 공개)</option>
                <option value="pending">승인 대기중 (검토 중)</option>
                <option value="rejected">반려/보류 (비공개)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-brand-brown pt-3">
              <input
                type="checkbox"
                checked={isBest}
                onChange={(e) => setIsBest(e.target.checked)}
                className="rounded text-brand-sage focus:ring-brand-sage"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>BEST 후기로 지정 (상단 강조)</span>
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
                내담자 가명 <span className="text-brand-sage">(비식별화)</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="예: 내담자 K님 (가명)"
                className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
                연령대 및 역할
              </label>
              <input
                type="text"
                value={ageGroupAndRole}
                onChange={(e) => setAgeGroupAndRole(e.target.value)}
                placeholder="예: 30대 직장인"
                className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
                상담 카테고리
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setCategory(val);
                  if (val === 'child') setCategoryLabel('아동 심리 · 놀이/발달');
                  if (val === 'youth') setCategoryLabel('청소년 심리 · 자녀 양육');
                  if (val === 'adult') setCategoryLabel('성인 심리 · 번아웃 극복');
                  if (val === 'couple') setCategoryLabel('부부 갈등 · 관계 회복');
                  if (val === 'anxiety') setCategoryLabel('불안 장애 · 자존감 회복');
                }}
                className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
              >
                <option value="child">아동·놀이/발달</option>
                <option value="youth">청소년·자녀</option>
                <option value="adult">성인·번아웃</option>
                <option value="couple">부부·가족</option>
                <option value="anxiety">불안·자존감</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
                상담 프로그램명
              </label>
              <input
                type="text"
                value={programTaken}
                onChange={(e) => setProgramTaken(e.target.value)}
                placeholder="예: 개인 심리상담 (10회기 종결)"
                className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
                종결 시기
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="예: 2026.09 종결"
                className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
              후기 한 줄 요약 (헤드라인)
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="예: “매일 밤 가슴을 짓누르던 불안에서 벗어나 평온을 찾았습니다.”"
              className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
              상세 후기 내용 (가명화 및 오탈자 정제)
            </label>
            <textarea
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="후기 내용을 입력하세요."
              className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white resize-none"
              required
            />
          </div>

          {/* Before & After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-serif font-bold text-rose-800 mb-1">
                상담 전 상태
              </label>
              <input
                type="text"
                value={beforeState}
                onChange={(e) => setBeforeState(e.target.value)}
                placeholder="예: 발표 공포증, 잦은 과호흡"
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs font-serif text-brand-brown bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-emerald-800 mb-1">
                상담 후 변화
              </label>
              <input
                type="text"
                value={afterState}
                onChange={(e) => setAfterState(e.target.value)}
                placeholder="예: 신체 이완법 습득, 안정적 발표"
                className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs font-serif text-brand-brown bg-white"
              />
            </div>
          </div>

          {/* Counselor Clinical Commentary */}
          <div className="p-3.5 bg-brand-green/20 border border-brand-sage/40 rounded-2xl">
            <label className="block text-xs font-serif font-bold text-brand-sage mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-sage" />
              <span>박미경 소장의 전문 임상 코멘트 &amp; 치유 인사이트 (선택)</span>
            </label>
            <textarea
              rows={2}
              value={counselorInsight}
              onChange={(e) => setCounselorInsight(e.target.value)}
              placeholder="예: 인지행동적 접근과 신체 안정화 기법을 병행하여 수행 불안의 악순환 고리를 해소한 사례입니다."
              className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-brand-brown mb-1">
              상담 분야별 태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="예: #자존감, #사회공포, #이완훈련, #멘탈관리"
              className="w-full px-3 py-2 rounded-xl border border-brand-green/30 text-xs font-serif text-brand-brown bg-white"
            />
          </div>

          <div className="pt-3 border-t border-brand-green/20 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-brand-green/30 text-xs font-serif font-bold text-brand-brown hover:bg-brand-beige/50 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-serif font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? '저장 중...' : (isNew ? '새 후기 저장' : '수정 사항 저장')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
