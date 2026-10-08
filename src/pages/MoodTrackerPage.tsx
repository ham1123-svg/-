import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Heart, Sparkles, MessageCircle, Phone, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DailyMoodTrackerDashboard from '../components/DailyMoodTrackerDashboard';

export default function MoodTrackerPage() {
  return (
    <div className="min-h-screen bg-brand-beige/20 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-serif text-brand-brown/70 hover:text-brand-sage transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인 홈으로 돌아가기</span>
          </Link>

          {/* Key Trust Tags */}
          <div className="flex items-center gap-2 text-xs text-brand-brown/70">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-brand-green/30 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              실시간 정서 궤적 시각화
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-brand-green/30 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
              100% 프라이빗 보장
            </span>
          </div>
        </div>

        {/* Dedicated Mood Tracker Dashboard Component */}
        <div className="max-w-5xl mx-auto">
          <DailyMoodTrackerDashboard defaultPeriod="weekly" />
        </div>

        {/* Contextual Counseling Support Box */}
        <div className="mt-12 max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-sage font-bold text-xs uppercase tracking-wider">
                <Heart className="w-4 h-4" />
                <span>심리 케어 안내 및 전문 상담 연계</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-brown">
                감정의 기복은 마음이 나에게 보내는 중요한 신호입니다
              </h3>
              <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed max-w-2xl font-serif">
                지속적인 피로나 불안, 가라앉는 기분이 2주 이상 지속된다면 감정을 억누르지 마시고 
                연구소의 표준화 검사(MMPI-2, TCI) 및 전문 상담사와의 1:1 심층 상담을 통해 
                안전하게 원인을 탐색하고 건강한 대처 자원을 회복해 보세요.
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
              <Link
                to="/self-diagnosis"
                className="px-5 py-3 bg-brand-beige/50 hover:bg-brand-beige text-brand-brown font-semibold rounded-xl text-center text-xs sm:text-sm border border-brand-green/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>5대 자가진단 검사</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
