import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Star, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  User, 
  MessageSquareHeart, 
  AlertCircle, 
  Plus, 
  Tag, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { testimonialService } from '../services/testimonialService';
import { Testimonial } from '../types';

interface ClientReviewWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newReviewId: string) => void;
}

const AGE_ROLE_OPTIONS = [
  '20대 대학생/청년',
  '30대 직장인',
  '30대 전문직/프리랜서',
  '40대 자영업/소상공인',
  '40대 학부모',
  '50대 직장인/중년',
  '맞벌이 부부',
  '영유아 양육 부부',
  '청소년 자녀 학부모',
  '아동 자녀 학부모 (초등 이하)'
];

const PROGRAM_OPTIONS = [
  '개인 심리상담 (1:1)',
  '부부 및 가족 상담',
  '청소년 및 성인 상담',
  '아동 발달 놀이·미술 상담',
  '종합심리검사 + 결과상담',
  '놀이·미술 매체 상담',
  '성인 심화상담 + 성격유형검사'
];

const RECOMMENDED_TAGS = [
  '#자존감회복',
  '#직장인번아웃',
  '#아동상담',
  '#놀이치료',
  '#사회불안완화',
  '#부부갈등해결',
  '#우울극복',
  '#수면회복',
  '#감정조절',
  '#이완훈련',
  '#부모코칭',
  '#공황극복',
  '#자기자비'
];

export default function ClientReviewWriteModal({
  isOpen,
  onClose,
  onSuccess
}: ClientReviewWriteModalProps) {
  // Form State
  const [clientName, setClientName] = useState('');
  const [ageGroupAndRole, setAgeGroupAndRole] = useState(AGE_ROLE_OPTIONS[1]);
  const [category, setCategory] = useState<'child' | 'youth' | 'adult' | 'couple' | 'anxiety'>('adult');
  const [programTaken, setProgramTaken] = useState(PROGRAM_OPTIONS[0]);
  const [rating, setRating] = useState<number>(5);
  const [headline, setHeadline] = useState('');
  const [story, setStory] = useState('');
  const [beforeState, setBeforeState] = useState('');
  const [afterState, setAfterState] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#자존감회복', '#마음평온']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Category labels mapping
  const categoryLabels: Record<string, string> = {
    child: '아동 심리 · 놀이/발달',
    youth: '청소년 심리 · 자녀 양육',
    adult: '성인 심리 · 번아웃 극복',
    couple: '부부 갈등 · 관계 회복',
    anxiety: '불안 장애 · 자존감 회복'
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        setErrorMessage('태그는 최대 5개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (!selectedTags.includes(formatted)) {
      if (selectedTags.length >= 5) {
        setErrorMessage('태그는 최대 5개까지 등록할 수 있습니다.');
        return;
      }
      setSelectedTags([...selectedTags, formatted]);
    }
    setCustomTagInput('');
  };

  const resetForm = () => {
    setClientName('');
    setAgeGroupAndRole(AGE_ROLE_OPTIONS[1]);
    setCategory('adult');
    setProgramTaken(PROGRAM_OPTIONS[0]);
    setRating(5);
    setHeadline('');
    setStory('');
    setBeforeState('');
    setAfterState('');
    setSelectedTags(['#자존감회복', '#마음평온']);
    setCustomTagInput('');
    setConsentChecked(false);
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!headline.trim()) {
      setErrorMessage('후기 한 줄 요약(제목)을 입력해주세요.');
      return;
    }

    if (!story.trim() || story.trim().length < 20) {
      setErrorMessage('내담자분들의 치유에 도움이 될 수 있도록 후기 내용을 최소 20자 이상 정성껏 작성해주세요.');
      return;
    }

    if (!consentChecked) {
      setErrorMessage('개인정보 비식별 가명화 및 게재 동의에 체크해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format client name safely
      let displayName = clientName.trim();
      if (!displayName) {
        displayName = '내담자 익명 (가명)';
      } else if (!displayName.includes('가명') && !displayName.includes('님')) {
        displayName = `내담자 ${displayName}님 (가명)`;
      }

      const initialChar = displayName.replace(/[^a-zA-Z가-힣]/g, '').slice(0, 1) || 'H';

      const result = await testimonialService.submitReview({
        clientName: displayName,
        initial: initialChar,
        ageGroupAndRole,
        category,
        categoryLabel: categoryLabels[category],
        programTaken,
        rating,
        headline: headline.trim(),
        story: story.trim(),
        beforeState: beforeState.trim() || '혼자 겪던 마음의 불안과 갈등',
        afterState: afterState.trim() || '심리적 안정감과 건강한 일상 회복',
        tags: selectedTags.length > 0 ? selectedTags : ['#상담치유', '#회복'],
        status: 'pending' // Pending approval for review
      });

      if (result.success) {
        setSubmitSuccess(true);
        if (onSuccess) {
          onSuccess(result.id);
        }
      } else {
        setErrorMessage(result.message || '후기 저장 중 문제가 발생했습니다.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '후기 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isSubmitting) {
              onClose();
              if (submitSuccess) resetForm();
            }
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-green/30 overflow-hidden z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-brand-green/20 bg-gradient-to-r from-brand-beige/70 to-brand-green/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-sage text-white flex items-center justify-center shadow-xs shrink-0">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 id="write-review-title" className="text-lg sm:text-xl font-serif font-bold text-brand-brown leading-tight">
                  내담자 치유 후기 작성
                </h3>
                <p className="text-xs text-brand-brown/65 font-serif mt-0.5">
                  용기 내어 걸어오신 회복의 여정이 또 다른 누군가에게 따뜻한 희망이 됩니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (submitSuccess) resetForm();
              }}
              className="p-1.5 rounded-full text-brand-brown/60 hover:text-brand-brown hover:bg-white transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-7 overflow-y-auto">
            {submitSuccess ? (
              /* Success Screen */
              <div className="text-center py-8 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-brand-brown">
                  소중한 후기가 안전하게 접수되었습니다
                </h4>
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-serif leading-relaxed text-left space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-900 font-bold mb-1">
                        100% 비식별 가명화 및 관리자 승인 안내
                      </strong>
                      <span>
                        내담자님의 사생활과 인격을 엄격히 보호하기 위해, 제출해주신 후기는 상담소 관리자의 <strong>개인정보 비식별 가명화 검토 및 승인 절차</strong>를 거쳐 사이트에 정식 등록됩니다.
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-brand-brown/60 font-serif">
                  당신의 따뜻한 나눔이 지친 이웃의 마음에 큰 용기가 되어줄 것입니다. 진심으로 감사드립니다.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-6 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    확인 및 창 닫기
                  </button>
                </div>
              </div>
            ) : (
              /* Write Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Confidentiality Notice */}
                <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 font-serif leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-900 block mb-0.5">안심 비밀보장 및 익명 작성 원칙</strong>
                    <span>실제 성함을 적으시더라도 <strong>관리자가 100% 가명 및 비식별화 처리</strong>하여 게시하오니 편안한 마음으로 진솔한 마음을 들려주세요.</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-serif font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Basic Info: Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                      내담자 닉네임 또는 가명 <span className="text-brand-sage">(자동 가명 처리)</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="예: 지영, K님, 익명 (미입력 시 '내담자 익명')"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm font-serif focus:outline-hidden focus:border-brand-sage bg-white text-brand-brown"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                      연령대 및 상황/역할 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={ageGroupAndRole}
                      onChange={(e) => setAgeGroupAndRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm font-serif focus:outline-hidden focus:border-brand-sage bg-white text-brand-brown cursor-pointer"
                    >
                      {AGE_ROLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Category & Program Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                      상담 분야 (카테고리) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {(['child', 'youth', 'adult', 'couple', 'anxiety'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={cn(
                            "py-2 px-2 rounded-xl text-[11px] font-serif font-semibold border transition-all text-center cursor-pointer",
                            category === cat
                              ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                              : "bg-white text-brand-brown/75 border-brand-green/30 hover:bg-brand-beige/40"
                          )}
                        >
                          {cat === 'child' && '아동·놀이발달'}
                          {cat === 'youth' && '청소년·학업'}
                          {cat === 'adult' && '성인·번아웃'}
                          {cat === 'couple' && '부부·가족'}
                          {cat === 'anxiety' && '불안·자존감'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                      참여하신 프로그램 <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={programTaken}
                      onChange={(e) => setProgramTaken(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm font-serif focus:outline-hidden focus:border-brand-sage bg-white text-brand-brown cursor-pointer"
                    >
                      {PROGRAM_OPTIONS.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Rating Stars */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    상담 전반 만족도 <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-brand-beige/40 rounded-xl border border-brand-green/20">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          aria-label={`${star}점 부여`}
                        >
                          <Star 
                            className={cn(
                              "w-6 h-6",
                              star <= rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-neutral-300 stroke-1"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-serif font-bold text-amber-900">
                      {rating === 5 && '⭐⭐⭐⭐⭐ 매우 만족 (5.0 / 5.0)'}
                      {rating === 4 && '⭐⭐⭐⭐ 만족 (4.0 / 5.0)'}
                      {rating === 3 && '⭐⭐⭐ 보통 (3.0 / 5.0)'}
                      {rating <= 2 && '개선 필요'}
                    </span>
                  </div>
                </div>

                {/* 4. Headline / Title */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    한 줄 요약 (헤드라인) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="예: “매일 밤 가슴을 짓누르던 불안에서 벗어나, 이제는 평온하게 숨을 쉽니다.”"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm font-serif focus:outline-hidden focus:border-brand-sage bg-white text-brand-brown"
                    maxLength={100}
                  />
                  <div className="text-[10px] text-brand-brown/50 text-right mt-1 font-mono">
                    {headline.length}/100자
                  </div>
                </div>

                {/* 5. Detailed Story */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5">
                    상세 후기 내용 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="처음 상담소를 찾게 된 계기, 상담 중 소장님과 함께 나누었던 대화나 깨달음, 그리고 일상에서 찾아온 긍정적인 마음의 변화를 솔직하게 적어주세요."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm font-serif focus:outline-hidden focus:border-brand-sage bg-white text-brand-brown leading-relaxed resize-none"
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center text-[10px] text-brand-brown/50 mt-1 font-serif">
                    <span>최소 20자 이상 작성을 권장합니다.</span>
                    <span className="font-mono">{story.length}/1000자</span>
                  </div>
                </div>

                {/* 6. Before & After */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl">
                    <label className="block text-xs font-serif font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 text-[10px]">상담 전</span>
                      <span>겪으셨던 어려움 (키워드)</span>
                    </label>
                    <input
                      type="text"
                      value={beforeState}
                      onChange={(e) => setBeforeState(e.target.value)}
                      placeholder="예: 잦은 과호흡, 만성 불면, 발표 공포"
                      className="w-full px-3 py-1.5 rounded-lg border border-rose-200 bg-white text-xs font-serif text-brand-brown focus:outline-hidden focus:border-rose-400"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                    <label className="block text-xs font-serif font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[10px]">상담 후</span>
                      <span>찾아온 긍정적 변화 (키워드)</span>
                    </label>
                    <input
                      type="text"
                      value={afterState}
                      onChange={(e) => setAfterState(e.target.value)}
                      placeholder="예: 신체 이완법 습득, 수면 위생 회복, 평온"
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs font-serif text-brand-brown focus:outline-hidden focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* 7. Tags Selection */}
                <div>
                  <label className="block text-xs font-serif font-bold text-brand-brown mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-brand-sage" />
                    <span>상담 분야별 태그 (최대 5개)</span>
                  </label>
                  
                  {/* Selected Tags Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {RECOMMENDED_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-lg font-serif transition-all cursor-pointer border",
                            isSelected
                              ? "bg-brand-sage text-white border-brand-sage shadow-2xs font-bold"
                              : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage/40 hover:bg-brand-beige/50"
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Tag */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                      placeholder="직접 태그 입력 (예: 부부소통, 워라밸)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-brand-green/30 text-xs font-serif text-brand-brown bg-white focus:outline-hidden focus:border-brand-sage"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomTag()}
                      className="px-3 py-1.5 bg-brand-green/40 hover:bg-brand-sage hover:text-white text-brand-brown text-xs font-serif font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      태그 추가
                    </button>
                  </div>
                </div>

                {/* 8. Ethical Consent Checkbox */}
                <div className="p-3.5 bg-brand-beige/60 rounded-xl border border-brand-green/30">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded text-brand-sage focus:ring-brand-sage cursor-pointer"
                    />
                    <span className="text-xs font-serif text-brand-brown/90 leading-relaxed">
                      <strong>[필수 동의]</strong> 작성해주신 후기는 개인 식별을 방지하기 위해 성명과 세부 정황을 <strong>100% 가명화 및 비식별 재구성</strong>하여 상담소에 안전하게 게재되는 것에 동의합니다.
                    </span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-brand-green/20">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl border border-brand-green/30 hover:bg-white text-xs font-serif font-bold text-brand-brown transition-colors cursor-pointer"
                  >
                    취소
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-serif font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>안전하게 접수 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>소중한 후기 제출하기</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
