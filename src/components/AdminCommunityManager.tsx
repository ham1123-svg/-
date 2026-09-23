import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Pin, 
  Eye, 
  Calendar, 
  User, 
  Check, 
  X, 
  RefreshCw, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CommunityNotice } from '../types';

interface AdminCommunityManagerProps {
  notices: CommunityNotice[];
  loading: boolean;
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

const CATEGORY_OPTIONS = [
  '공지사항',
  '운영안내',
  '프로그램모집',
  '소식/특강',
  '마음칼럼/정보',
  '언론보도'
];

export default function AdminCommunityManager({
  notices,
  loading,
  onRefresh,
  onShowToast
}: AdminCommunityManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');

  // Modal states
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<CommunityNotice | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<CommunityNotice | null>(null);
  const [previewNotice, setPreviewNotice] = useState<CommunityNotice | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState('공지사항');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('행복바람 운영팀');
  const [formContent, setFormContent] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Open Write Modal
  const handleOpenWrite = () => {
    setEditingNotice(null);
    setFormCategory('공지사항');
    setFormCustomCategory('');
    setFormTitle('');
    setFormAuthor('행복바람 운영팀');
    setFormContent('');
    setFormIsPinned(false);
    setPreviewMode(false);
    setIsWriteModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (notice: CommunityNotice) => {
    setEditingNotice(notice);
    if (CATEGORY_OPTIONS.includes(notice.category)) {
      setFormCategory(notice.category);
      setFormCustomCategory('');
    } else {
      setFormCategory('직접입력');
      setFormCustomCategory(notice.category);
    }
    setFormTitle(notice.title);
    setFormAuthor(notice.author || '행복바람 운영팀');
    setFormContent(notice.content);
    setFormIsPinned(notice.is_pinned === 1);
    setPreviewMode(false);
    setIsWriteModalOpen(true);
  };

  // Submit Write/Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('게시글 제목을 입력해 주세요.');
      return;
    }
    if (!formContent.trim()) {
      alert('게시글 본문 내용을 입력해 주세요.');
      return;
    }

    const finalCategory = formCategory === '직접입력'
      ? (formCustomCategory.trim() || '공지사항')
      : formCategory;

    setSubmitting(true);
    try {
      const payload = {
        category: finalCategory,
        title: formTitle.trim(),
        content: formContent.trim(),
        author: formAuthor.trim() || '행복바람 운영팀',
        is_pinned: formIsPinned ? 1 : 0
      };

      if (editingNotice) {
        // Update existing notice
        const res = await fetch(`/api/community/notices/${editingNotice.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          onShowToast(`게시글 "${formTitle.trim()}"이(가) 성공적으로 수정되었습니다.`);
          setIsWriteModalOpen(false);
          onRefresh();
        } else {
          alert(data.error || '게시글 수정에 실패했습니다.');
        }
      } else {
        // Create new notice
        const res = await fetch('/api/community/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          onShowToast(`새 게시글이 성공적으로 등록되었습니다.`);
          setIsWriteModalOpen(false);
          onRefresh();
        } else {
          alert(data.error || '게시글 등록에 실패했습니다.');
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Pin
  const handleTogglePin = async (notice: CommunityNotice) => {
    try {
      const res = await fetch(`/api/community/notices/${notice.id}/pin`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onShowToast(data.message || '상단 고정 설정이 변경되었습니다.');
        onRefresh();
      }
    } catch (err) {
      alert('고정 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // Delete Notice
  const handleDeleteConfirm = async () => {
    if (!deletingNotice) return;
    try {
      const res = await fetch(`/api/community/notices/${deletingNotice.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onShowToast(`게시글 "${deletingNotice.title}"이(가) 삭제되었습니다.`);
        setDeletingNotice(null);
        onRefresh();
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchesCat = categoryFilter === '전체' || n.category === categoryFilter;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term) ||
        (n.author && n.author.toLowerCase().includes(term));
      return matchesCat && matchesSearch;
    });
  }, [notices, categoryFilter, searchTerm]);

  // Available categories for filtering
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    notices.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    CATEGORY_OPTIONS.forEach((c) => set.add(c));
    return ['전체', ...Array.from(set)];
  }, [notices]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Area */}
      <div className="bg-white rounded-3xl p-6 border border-brand-green/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                Community CMS
              </span>
              <span className="text-xs text-brand-brown/50">
                총 {notices.length}개의 게시글 등록됨
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
              커뮤니티 공지 &amp; 게시글 관리
            </h2>
            <p className="text-xs sm:text-sm text-brand-brown/65 mt-0.5">
              연구소의 공지사항, 힐링 워크숍 모집 공고, 소식 및 안내글을 등록·수정·삭제하고 상단 고정 여부를 관리합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            to="/community?tab=notice"
            target="_blank"
            className="flex-1 md:flex-none px-4 py-2.5 bg-brand-beige/40 hover:bg-brand-beige text-brand-brown text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-brand-green/20"
          >
            <span>커뮤니티 페이지 보기</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-sage" />
          </Link>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 bg-white border border-brand-green/30 hover:border-brand-sage text-brand-brown rounded-xl transition-all cursor-pointer"
            title="목록 새로고침"
          >
            <RefreshCw className={cn("w-4 h-4 text-brand-sage", loading && "animate-spin")} />
          </button>

          <button
            type="button"
            onClick={handleOpenWrite}
            className="flex-1 md:flex-none px-5 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 글 작성하기 (글쓰기)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-green/20 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-brand-brown/40 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 본문 내용, 작성자 검색"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-green/30 focus:border-brand-sage text-xs sm:text-sm outline-none bg-brand-beige/10 text-brand-brown"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-brand-brown/40 hover:text-brand-brown"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {allCategories.map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-brand-brown text-white shadow-xs"
                    : "bg-brand-beige/40 text-brand-brown/70 hover:bg-brand-beige/80"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notices Table */}
      <div className="bg-white rounded-3xl border border-brand-green/20 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-brand-brown/60 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-sage" />
            <span>게시글 목록을 불러오는 중입니다...</span>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-16 h-16 bg-brand-beige/50 rounded-full flex items-center justify-center text-brand-brown/40 mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-brand-brown mb-1">
              {searchTerm || categoryFilter !== '전체' ? '조건에 맞는 게시글이 없습니다.' : '등록된 게시글이 없습니다.'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-brown/60 mb-6">
              첫 번째 연구소 공지사항이나 소식 글을 작성해 보세요.
            </p>
            <button
              type="button"
              onClick={handleOpenWrite}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-sage text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-brand-sage/90 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 글 작성하기</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-brand-beige/40 border-b border-brand-green/20 text-brand-brown/70 font-bold text-xs">
                  <th className="py-3.5 px-4 text-center w-16">상단고정</th>
                  <th className="py-3.5 px-4 w-28">카테고리</th>
                  <th className="py-3.5 px-4">제목</th>
                  <th className="py-3.5 px-4 w-28">작성자</th>
                  <th className="py-3.5 px-4 w-28">작성일시</th>
                  <th className="py-3.5 px-4 w-20 text-center">조회수</th>
                  <th className="py-3.5 px-4 w-40 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/10">
                {filteredNotices.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-beige/20 transition-colors">
                    {/* Pin Status Toggle Button */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(item)}
                        className={cn(
                          "p-1.5 rounded-lg transition-all cursor-pointer",
                          item.is_pinned === 1
                            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            : "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100"
                        )}
                        title={item.is_pinned === 1 ? "상단 고정 해제" : "목록 상단에 고정"}
                      >
                        <Pin className={cn("w-4 h-4", item.is_pinned === 1 && "fill-current")} />
                      </button>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={cn(
                        "text-[11px] font-bold px-2.5 py-1 rounded-full",
                        item.category === '운영안내'
                          ? "bg-emerald-100 text-emerald-800"
                          : item.category === '프로그램모집'
                          ? "bg-amber-100 text-amber-900"
                          : item.category === '소식/특강'
                          ? "bg-blue-100 text-blue-900"
                          : item.category === '마음칼럼/정보'
                          ? "bg-purple-100 text-purple-900"
                          : "bg-brand-sage/15 text-brand-sage"
                      )}>
                        {item.category}
                      </span>
                    </td>

                    {/* Title with preview link */}
                    <td className="py-3.5 px-4 font-semibold text-brand-brown">
                      <div className="flex items-center gap-2">
                        {item.is_pinned === 1 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                            중요
                          </span>
                        )}
                        <span 
                          onClick={() => setPreviewNotice(item)}
                          className="hover:text-brand-sage hover:underline cursor-pointer line-clamp-1 max-w-md"
                          title="클릭하여 상세 본문 미리보기"
                        >
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-brown/50 line-clamp-1 mt-0.5 font-normal">
                        {item.content.substring(0, 80)}...
                      </p>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-brand-brown/70">
                      {item.author || '행복바람 운영팀'}
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-brand-brown/60">
                      {item.created_at ? item.created_at.substring(0, 10) : '-'}
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center text-xs text-brand-brown/60 font-mono">
                      {item.views}
                    </td>

                    {/* Action buttons: Edit, Delete, Preview */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewNotice(item)}
                          className="p-1.5 rounded-lg text-brand-brown/60 hover:text-brand-brown hover:bg-brand-beige/50 transition-colors cursor-pointer"
                          title="미리보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-sage/10 text-brand-sage hover:bg-brand-sage hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="글 수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingNotice(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="글 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Modal: Write / Edit Post */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-sage/20 my-auto flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-brand-beige/80 bg-brand-beige/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-sage text-white flex items-center justify-center shadow-xs">
                    {editingNotice ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-lg text-brand-brown">
                      {editingNotice ? '게시글 수정하기' : '커뮤니티 새 글 작성하기'}
                    </h3>
                    <p className="text-xs text-brand-brown/60">
                      {editingNotice ? '기존 공지 및 소식의 내용을 변경합니다.' : '연구소 공지사항 및 새로운 소식을 커뮤니티에 등록합니다.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1",
                      previewMode
                        ? "bg-brand-sage text-white border-brand-sage"
                        : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage"
                    )}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{previewMode ? '편집 모드로 돌아가기' : '미리보기'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-brand-beige text-brand-brown/60 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                {previewMode ? (
                  // Preview View
                  <div className="space-y-4">
                    <div className="p-3 bg-brand-sage/10 rounded-xl text-xs text-brand-sage font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>커뮤니티 페이지 방문자들에게 보여지는 실제 게시글 형태입니다.</span>
                    </div>

                    <div className="bg-brand-beige/20 p-6 rounded-2xl border border-brand-green/20 space-y-4">
                      <div className="flex items-center gap-2">
                        {formIsPinned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            중요 공지
                          </span>
                        )}
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                          {formCategory === '직접입력' ? (formCustomCategory || '공지사항') : formCategory}
                        </span>
                        <span className="text-xs text-brand-brown/50">
                          {new Date().toISOString().substring(0, 10)}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-brown leading-snug">
                        {formTitle || '(제목을 입력해 주세요)'}
                      </h2>

                      <div className="text-xs text-brand-brown/60 flex items-center gap-2 border-b border-brand-green/10 pb-3">
                        <span>작성자: {formAuthor || '행복바람 운영팀'}</span>
                        <span>•</span>
                        <span>조회수: 0회</span>
                      </div>

                      <div className="text-sm sm:text-base text-brand-brown/85 leading-relaxed whitespace-pre-line pt-2">
                        {formContent || '(본문 내용을 입력해 주세요)'}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit / Write Form
                  <form id="notice-form" onSubmit={handleSubmit} className="space-y-5">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1.5">
                        게시판 카테고리 *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        {CATEGORY_OPTIONS.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormCategory(cat);
                              setFormCustomCategory('');
                            }}
                            className={cn(
                              "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer",
                              formCategory === cat
                                ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                                : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage/60"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormCategory('직접입력')}
                          className={cn(
                            "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer",
                            formCategory === '직접입력'
                              ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                              : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage/60"
                          )}
                        >
                          + 직접 입력
                        </button>
                      </div>

                      {formCategory === '직접입력' && (
                        <input
                          type="text"
                          value={formCustomCategory}
                          onChange={(e) => setFormCustomCategory(e.target.value)}
                          placeholder="새로운 카테고리명을 입력하세요 (예: 힐링이벤트)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:border-brand-sage outline-none bg-brand-beige/10"
                        />
                      )}
                    </div>

                    {/* Author & Pin option */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-brown mb-1.5">
                          작성자 이름 / 직책 *
                        </label>
                        <input
                          type="text"
                          required
                          value={formAuthor}
                          onChange={(e) => setFormAuthor(e.target.value)}
                          placeholder="예: 행복바람 운영팀 또는 박미경 소장"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:border-brand-sage outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-brown mb-1.5">
                          상단 중요 공지 고정
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-brand-green/30 bg-brand-beige/20 cursor-pointer hover:bg-brand-beige/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={formIsPinned}
                            onChange={(e) => setFormIsPinned(e.target.checked)}
                            className="rounded text-brand-sage focus:ring-brand-sage w-4 h-4"
                          />
                          <span className="text-xs font-semibold text-brand-brown">
                            목록 상단에 고정 표시하기 (중요 공지)
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Post Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-brand-brown">
                          게시글 제목 *
                        </label>
                        <span className="text-[11px] text-brand-brown/50">
                          {formTitle.length}자
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="전달하고자 하는 공지 또는 소식의 핵심 제목을 입력하세요."
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 text-sm sm:text-base font-semibold focus:border-brand-sage outline-none"
                      />
                    </div>

                    {/* Post Content */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-brand-brown">
                          게시글 본문 내용 *
                        </label>
                        <span className="text-[11px] text-brand-brown/50">
                          {formContent.length}자 (줄바꿈 및 문단 구분 가능)
                        </span>
                      </div>
                      <textarea
                        required
                        rows={12}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="상세한 안내 내용을 작성해 주세요. 줄바꿈과 목록 형태의 기호(•, 1., -)를 자유롭게 사용하실 수 있습니다."
                        className="w-full p-4 rounded-xl border border-brand-green/30 text-xs sm:text-sm leading-relaxed focus:border-brand-sage outline-none resize-y"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-brand-beige/80 bg-brand-beige/20 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                >
                  취소
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2.5 rounded-xl border border-brand-green/30 text-brand-brown text-xs font-bold hover:bg-brand-beige/40 cursor-pointer"
                  >
                    {previewMode ? '편집 계속하기' : '미리보기'}
                  </button>

                  <button
                    type="submit"
                    form="notice-form"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{submitting ? '저장 중...' : (editingNotice ? '게시글 수정 완료' : '게시글 등록하기')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Modal: Preview / View Notice Detail */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewNotice(null)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-brand-sage/20 my-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige/80 mb-5">
                <div className="flex items-center gap-2">
                  {previewNotice.is_pinned === 1 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      중요 공지
                    </span>
                  )}
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage">
                    {previewNotice.category}
                  </span>
                  <span className="text-xs text-brand-brown/50">
                    {previewNotice.created_at ? previewNotice.created_at.substring(0, 10) : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewNotice(null)}
                  className="p-1.5 rounded-full hover:bg-brand-beige text-brand-brown/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-brown mb-4 leading-snug">
                {previewNotice.title}
              </h2>

              <div className="text-xs text-brand-brown/60 mb-6 flex items-center gap-3">
                <span>작성자: {previewNotice.author || '행복바람 운영팀'}</span>
                <span>•</span>
                <span>조회수: {previewNotice.views}회</span>
                {previewNotice.updated_at && (
                  <>
                    <span>•</span>
                    <span>최종 수정: {previewNotice.updated_at.substring(0, 16)}</span>
                  </>
                )}
              </div>

              <div className="text-brand-brown/85 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-8 bg-brand-beige/20 p-5 rounded-2xl border border-brand-green/15 max-h-96 overflow-y-auto">
                {previewNotice.content}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-beige/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const item = previewNotice;
                      setPreviewNotice(null);
                      handleOpenEdit(item);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-sage/15 text-brand-sage font-bold text-xs hover:bg-brand-sage hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>이 글 수정</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const item = previewNotice;
                      setPreviewNotice(null);
                      setDeletingNotice(item);
                    }}
                    className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                  >
                    삭제
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewNotice(null)}
                  className="px-5 py-2 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Modal: Delete Confirmation */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deletingNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-green/20"
            >
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg font-serif text-brand-brown mb-2">
                  게시글을 삭제하시겠습니까?
                </h3>
                <p className="text-xs text-brand-brown/70 mb-4 leading-relaxed">
                  삭제된 게시글은 커뮤니티 페이지에서 즉시 제외되며 복구할 수 없습니다.
                </p>
                <div className="bg-brand-beige/30 p-3 rounded-xl border border-brand-green/20 text-xs font-semibold text-brand-brown text-left mb-6">
                  <div className="text-[10px] text-brand-brown/50 mb-0.5">삭제 대상 게시글</div>
                  <div className="line-clamp-2">"{deletingNotice.title}"</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingNotice(null)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  확인 및 삭제
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
