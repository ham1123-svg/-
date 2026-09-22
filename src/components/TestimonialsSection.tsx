import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Quote, Star, ShieldCheck, Heart, Sparkles, CheckCircle2, 
  ArrowRight, Users, User, Clock, ChevronDown, ChevronUp, Lock, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TESTIMONIALS_DATA, TRUST_STATS } from '../data/testimonialsData';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';

export default function TestimonialsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: '전체 후기 (6)' },
    { id: 'adult', name: '성인·번아웃' },
    { id: 'couple', name: '부부·가족 관계' },
    { id: 'youth', name: '청소년·학업·아동' },
    { id: 'anxiety', name: '불안·자존감 회복' },
  ];

  const filteredTestimonials = activeCategory === 'all'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter(t => t.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="testimonials-section" className="py-24 bg-gradient-to-b from-white via-brand-beige/20 to-white relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold mb-4 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>내담자 실제 상담 후기 & 변화 이야기</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-brown mb-5 leading-tight">
            마음의 평온을 되찾은 <br className="hidden sm:inline" />
            <span className="text-brand-sage">소중한 분들의 이야기</span>
          </h2>
          <p className="text-brand-brown/70 text-base sm:text-lg font-serif leading-relaxed">
            행복바람심리상담연구소에서 따뜻한 위로와 회복을 경험하신 내담자분들이 직접 전해주신 소중한 변화의 기록입니다.
            상담 윤리 규정에 따라 개인식별 정보는 100% 익명 처리되었습니다.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-brand-brown/60">
            <Lock className="w-3.5 h-3.5 text-brand-sage" />
            <span>한국상담심리학회 윤리강령 100% 비밀보장 준수</span>
          </div>
        </div>

        {/* Social Proof & Trust Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {TRUST_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/90 backdrop-blur-xs p-6 rounded-2xl border border-brand-green/30 text-center shadow-xs hover:border-brand-sage/50 transition-all"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-sage mb-1 font-serif">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-brand-brown mb-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-brand-brown/50">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer",
                activeCategory === cat.id
                  ? "bg-brand-sage text-white shadow-md shadow-brand-sage/20 scale-105"
                  : "bg-white text-brand-brown/70 hover:bg-brand-green/30 border border-brand-green/30 hover:text-brand-brown"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredTestimonials.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-7 border border-brand-green/30 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative group hover:border-brand-sage/40"
              >
                <div>
                  {/* Top Meta Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-brand-beige flex items-center justify-center font-serif font-bold text-brand-brown border border-brand-green/30 shrink-0">
                        {item.clientName.substring(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-brand-brown">{item.clientName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-sage text-[10px] font-semibold">
                            {item.ageGroupAndRole}
                          </span>
                        </div>
                        <div className="text-[11px] text-brand-brown/50 mt-0.5">
                          {item.period}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                      ))}
                      <span className="text-[11px] font-bold text-amber-700 ml-1">5.0</span>
                    </div>
                  </div>

                  {/* Program Tag */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-brand-beige/60 text-brand-brown/80 rounded-lg text-xs font-semibold border border-brand-green/20">
                      {item.programTaken}
                    </span>
                  </div>

                  {/* Quote Headline */}
                  <div className="mb-4 relative">
                    <Quote className="w-7 h-7 text-brand-green/40 absolute -top-2.5 -left-1 stroke-[1.5] -z-0 pointer-events-none" />
                    <h3 className="font-serif font-bold text-base sm:text-lg text-brand-brown leading-snug relative z-10 pl-2">
                      {item.headline}
                    </h3>
                  </div>

                  {/* Story Text */}
                  <p className={cn(
                    "text-brand-brown/80 text-sm leading-relaxed mb-6 font-serif",
                    !isExpanded && "line-clamp-4"
                  )}>
                    {item.story}
                  </p>

                  {/* Before & After Comparison Pills */}
                  <div className="space-y-2 mb-6 p-3.5 bg-brand-beige/30 rounded-2xl border border-brand-green/20 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px] shrink-0 mt-0.5">
                        상담 전
                      </span>
                      <span className="text-brand-brown/70 leading-tight">
                        {item.beforeState}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-brand-green/15">
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0 mt-0.5">
                        상담 후
                      </span>
                      <span className="text-brand-brown font-semibold leading-tight">
                        {item.afterState}
                      </span>
                    </div>
                  </div>

                  {/* Counselor Insight (Shown if expanded) */}
                  <AnimatePresence>
                    {isExpanded && item.counselorInsight && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-3.5 bg-brand-green/20 rounded-2xl border border-brand-sage/30 text-xs overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-brand-sage mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>소장의 상담 심리적 관점</span>
                        </div>
                        <p className="text-brand-brown/80 leading-relaxed text-[11px]">
                          {item.counselorInsight}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Controls & Tags */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[11px] text-brand-brown/60 bg-white px-2 py-0.5 rounded-md border border-brand-green/30">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-brand-green/20">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="text-xs font-bold text-brand-sage hover:text-brand-brown flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? '간략히 보기' : '후기 전문 및 소장 분석'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedStory(item)}
                      className="text-xs font-medium text-brand-brown/60 hover:text-brand-sage transition-colors cursor-pointer"
                    >
                      상세 팝업 열기
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Social Proof & CTA Banner */}
        <div className="bg-brand-brown text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-brand-green/20">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-sage/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-brand-green font-semibold text-xs rounded-full mb-3">
                <Heart className="w-3.5 h-3.5 fill-brand-green" />
                <span>당신의 마음도 다시 평온해질 수 있습니다</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 leading-snug">
                지금 마주한 고민, 더 이상 혼자 짊어지지 마세요.
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-serif">
                공감과 전문성을 갖춘 상담사가 안전하고 따뜻한 공간에서 당신의 이야기에 귀 기울입니다.
                작은 용기가 내일의 평온과 회복을 만들어냅니다.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <Link
                to="/reservation"
                className="w-full sm:w-auto px-7 py-4 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>상담 예약 신청하기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/programs"
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>프로그램 둘러보기</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Full Testimonial Modal Popup */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-green/30 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-green/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-sage text-white font-bold text-lg flex items-center justify-center font-serif">
                    {selectedStory.clientName.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-brand-brown">{selectedStory.clientName}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-green/30 text-brand-sage text-xs font-semibold">
                        {selectedStory.ageGroupAndRole}
                      </span>
                    </div>
                    <p className="text-xs text-brand-brown/60 mt-0.5">
                      {selectedStory.categoryLabel} · {selectedStory.period}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="p-2 text-brand-brown/40 hover:text-brand-brown rounded-full hover:bg-brand-beige/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Verified Badge & Rating */}
              <div className="flex items-center justify-between gap-3 mb-6 bg-brand-beige/30 p-3.5 rounded-2xl border border-brand-green/20">
                <div className="flex items-center gap-1.5 text-xs text-brand-sage font-bold">
                  <ShieldCheck className="w-4 h-4 text-brand-sage" />
                  <span>100% 익명 인증 및 윤리규정 준수 후기</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  {[...Array(selectedStory.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  ))}
                  <span className="ml-1">5.0 / 5.0</span>
                </div>
              </div>

              {/* Headline */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown mb-4 leading-snug">
                {selectedStory.headline}
              </h3>

              {/* Story Narrative */}
              <div className="text-brand-brown/80 font-serif leading-relaxed text-sm sm:text-base space-y-4 mb-6">
                <p className="whitespace-pre-line">{selectedStory.story}</p>
              </div>

              {/* Before & After Card */}
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/60 text-xs">
                  <div className="font-bold text-rose-700 mb-1 flex items-center gap-1">
                    <span>초기 내원 고민 (Before)</span>
                  </div>
                  <p className="text-brand-brown/80 leading-relaxed">
                    {selectedStory.beforeState}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-xs">
                  <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                    <span>상담 종결 후 변화 (After)</span>
                  </div>
                  <p className="text-brand-brown font-semibold leading-relaxed">
                    {selectedStory.afterState}
                  </p>
                </div>
              </div>

              {/* Counselor Insight */}
              {selectedStory.counselorInsight && (
                <div className="p-4 bg-brand-green/20 rounded-2xl border border-brand-sage/30 text-xs mb-6">
                  <div className="font-bold text-brand-sage mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>전문 임상 및 상담심리 분석 코멘트</span>
                  </div>
                  <p className="text-brand-brown/80 leading-relaxed">
                    {selectedStory.counselorInsight}
                  </p>
                </div>
              )}

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-brand-green/20 flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {selectedStory.tags.map(t => (
                    <span key={t} className="text-xs bg-brand-beige px-2.5 py-1 rounded-md text-brand-brown/70">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedStory(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown font-medium text-xs hover:bg-brand-beige/50"
                  >
                    닫기
                  </button>
                  <Link
                    to="/reservation"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-sage text-white font-bold text-xs hover:bg-brand-sage/90 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>상담 예약 신청</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
