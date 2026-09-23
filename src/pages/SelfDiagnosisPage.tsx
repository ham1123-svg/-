import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SelfDiagnosis from '../components/SelfDiagnosis';

export default function SelfDiagnosisPage() {
  return (
    <div className="min-h-screen bg-brand-beige/20 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Top Key Features Pill Ribbon */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-center gap-2.5 text-xs text-brand-brown/80">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-green/30 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
            5대 심리 밸런스 지수 측정
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-green/30 shadow-2xs">
            <span>🕸️</span>
            방사형 스파이더 & 막대그래프 시각화
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-green/30 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
            100% 무료 & 익명 비밀 보장
          </span>
        </div>

        {/* Interactive Self Diagnosis Questionnaire & Results Dashboard */}
        <SelfDiagnosis />

        {/* Informational Guidance Footer Box */}
        <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-sage font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>안내 사항 및 전문 상담 권고</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-brown">
                본 간이 자가진단은 자가 점검용 스크리닝 도구입니다
              </h3>
              <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed max-w-2xl">
                자가진단 결과는 의학적 또는 공식적인 정신과적 진단을 대신할 수 없으며, 
                보다 정확하고 종합적인 심리 평가를 위해서는 연구소의 표준화 검사(종합심리검사)와 
                전문 상담사와의 대면 초기 면담을 권장합니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link
                to="/reservation"
                className="px-5 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-center text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>상담 예약 접수</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:052-254-0230"
                className="px-5 py-3 bg-brand-beige/50 hover:bg-brand-beige text-brand-brown font-semibold rounded-xl text-center text-xs sm:text-sm border border-brand-green/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-brand-sage" />
                <span>전화 상담 문의</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
