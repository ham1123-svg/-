import React from 'react';
import { ShieldCheck, Award, GraduationCap, Lock, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useHighContrast } from '../context/HighContrastContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function TrustBadges({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();

  const badges = [
    {
      icon: <Award className="w-6 h-6 text-brand-sage" />,
      title: "한국상담심리학회",
      subtitle: "공인 상담심리사 자격 보유",
      desc: "한국심리학회 분과학회 기준 1급·2급 전문 수련 및 엄격한 윤리강령 준수",
      highlight: "공인 자격 보증"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-brand-sage" />,
      title: "교육학 박사 전문 소장",
      subtitle: "30,000시간+ 임상 상담",
      desc: "박미경 소장의 30년 임상 경험과 풍부한 아동·청소년·성인 심층 임상 연구",
      highlight: "30,000시간+"
    },
    {
      icon: <Lock className="w-6 h-6 text-brand-sage" />,
      title: "100% 철저한 비밀보장",
      subtitle: "진료기록 건강보험 미등록",
      desc: "국민건강보험공단 진료코드 미등록으로 취업, 보험 가입 등에 일체 불이익 없음",
      highlight: "기록 미등록"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-brand-sage" />,
      title: "공공·교육기관 협력",
      subtitle: "울산교육청·공단 제휴 기관",
      desc: "울산광역시교육청, 노동인권센터, 재난심리회복지원센터 등 공인 기관 협력",
      highlight: "공공기관 협력"
    }
  ];

  return (
    <section 
      aria-label="공인 자격 및 신뢰도 보증"
      className={cn(
        "py-16 sm:py-20 border-t border-brand-green/20 relative overflow-hidden",
        isHighContrast 
          ? "bg-neutral-950 text-white" 
          : "bg-gradient-to-b from-brand-beige/30 via-white to-brand-beige/20",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-bold border border-brand-sage/20 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>CREDIBILITY &amp; ETHICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-brown mb-3">
            안심하고 마음을 털어놓을 수 있는 <br className="hidden sm:inline" />
            <span className="text-brand-sage">공인된 전문성과 신뢰의 약속</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-brown/70 font-serif leading-relaxed max-w-2xl mx-auto">
            행복바람 심리상담연구소는 검증되지 않은 상담 기법을 배제하고, 
            국내 공인 학회의 엄격한 윤리 기준과 전문 수련 과정을 이수한 공인 전문가가 직접 상담합니다.
          </p>
        </div>

        {/* 4 Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between group",
                isHighContrast
                  ? "bg-neutral-900 border-white/30 text-white"
                  : "bg-white hover:bg-brand-green/10 border-brand-green/30 hover:border-brand-sage/40 shadow-xs hover:shadow-md"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-sage/10 flex items-center justify-center border border-brand-sage/20 group-hover:scale-105 transition-transform">
                    {badge.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-green/40 text-brand-sage border border-brand-sage/20">
                    {badge.highlight}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-brand-brown mb-1">
                  {badge.title}
                </h3>
                <div className="text-xs font-semibold text-brand-sage mb-2.5">
                  {badge.subtitle}
                </div>
                <p className="text-xs text-brand-brown/70 font-serif leading-relaxed">
                  {badge.desc}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-brand-green/20 flex items-center gap-1.5 text-[11px] text-brand-sage font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>공식 윤리 규정 준수 서약</span>
              </div>
            </div>
          ))}
        </div>

        {/* Confidentiality Callout Strip */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-brand-brown text-brand-beige flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-white">
                "상담실 문을 닫는 순간, 모든 대화는 오직 이 공간에만 머뭅니다."
              </div>
              <div className="text-xs text-brand-beige/70 mt-0.5">
                한국상담심리학회 윤리강령 제1장(비밀보장의 의무)에 의거하여 내담자의 모든 신상과 상담 내용은 법적으로 보호됩니다.
              </div>
            </div>
          </div>

          <Link
            to="/confidentiality"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white font-bold text-xs transition-all shadow-xs"
          >
            비밀보장원칙 전문 보기 &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
