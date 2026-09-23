import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ClipboardCheck, ArrowRight, Clock, CreditCard, ShieldCheck, HelpCircle,
  Sparkles, FileText, ChevronRight
} from 'lucide-react';
import FAQ, { FAQCategory } from '../components/FAQ';
import CounselingTimeline from '../components/CounselingTimeline';

export default function Guide() {
  const location = useLocation();
  const [activeFaqCategory, setActiveFaqCategory] = useState<FAQCategory>('ALL');
  const [targetFaqId, setTargetFaqId] = useState<string | null>(null);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTimelineFaqSelect = (category: FAQCategory, faqId?: string) => {
    setActiveFaqCategory(category);
    if (faqId) {
      setTargetFaqId(faqId);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige/20 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4">상담 안내</h1>
          <p className="text-sm sm:text-base text-brand-brown/70 max-w-2xl mx-auto">
            상담이 처음이신 분들을 위해 신청 절차부터 비용, 자주 묻는 질문까지 친절히 안내해 드립니다.
          </p>

          {/* Quick Jump Navigation Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => scrollToSection('process')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-brand-green/20 text-xs sm:text-sm font-semibold text-brand-brown border border-brand-green/30 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ClipboardCheck className="w-4 h-4 text-brand-sage" />
              <span>상담 진행 과정</span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-brand-green/20 text-xs sm:text-sm font-semibold text-brand-brown border border-brand-green/30 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4 text-brand-sage" />
              <span>비용 및 시간 안내</span>
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-4 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-xs sm:text-sm font-semibold text-white transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              <span>자주 묻는 질문 (FAQ)</span>
            </button>
            <Link
              to="/confidentiality"
              className="px-4 py-2 rounded-xl bg-white hover:bg-brand-green/20 text-xs sm:text-sm font-semibold text-brand-brown border border-brand-green/30 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-brand-sage" />
              <span>비밀보장원칙 전문</span>
            </Link>
          </div>
        </div>

        {/* Process Visualization - Step-by-Step Visual Timeline */}
        <section id="process" className="mb-24 scroll-mt-24">
          <CounselingTimeline onSelectFaqCategory={handleTimelineFaqSelect} />
        </section>

        {/* Self-Diagnosis Callout Banner */}
        <section className="mb-24">
          <div className="bg-gradient-to-r from-brand-brown to-brand-brown/95 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 bg-white/20 text-brand-green font-semibold text-xs rounded-full inline-block">
                맞춤 프로그램 추천
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                어떤 상담이 나에게 필요할지 망설여지시나요?
              </h3>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">
                간이 심리 자가진단 질문지를 통해 현재의 우울, 스트레스, 관계 고민을 점검하고 
                나에게 가장 적합한 치유 프로그램을 즉시 추천받아보세요.
              </p>
            </div>
            <Link
              to="/self-diagnosis"
              className="px-6 py-3.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2 text-sm"
            >
              <span>간이 자가진단 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Pricing & Time Table */}
        <section id="pricing" className="grid md:grid-cols-2 gap-12 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-brand-green/10"
          >
            <div className="flex items-center gap-3 mb-8">
              <CreditCard className="w-6 h-6 text-brand-sage" />
              <h2 className="text-2xl font-serif font-bold text-brand-brown">상담 비용 안내</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-brand-green/10">
                <span className="font-medium">개인 상담 (50분)</span>
                <span className="text-brand-sage font-bold">100,000원</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-brand-green/10">
                <span className="font-medium">부부/가족 상담 (80분)</span>
                <span className="text-brand-sage font-bold">180,000원</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-brand-green/10">
                <span className="font-medium">놀이/미술 치료 (40분+10분 부모상담)</span>
                <span className="text-brand-sage font-bold">90,000원</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="font-medium">종합심리검사 (Full Battery)</span>
                <span className="text-brand-sage font-bold">별도 문의</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-brand-brown/40">* 바우처 사용 가능 여부는 전화로 문의주시기 바랍니다.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-brand-green/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-brand-sage" />
              <div>
                <h2 className="text-2xl font-serif font-bold text-brand-brown">상담 시간 안내</h2>
                <p className="text-xs text-brand-sage font-semibold mt-0.5">1일 5회 1:1 집중 심층 상담 운영</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { session: '1회차', time: '09:00 ~ 10:00', desc: '오전 집중 상담 1' },
                { session: '2회차', time: '10:30 ~ 11:30', desc: '오전 집중 상담 2' },
                { session: '3회차', time: '14:00 ~ 15:00', desc: '오후 집중 상담 1' },
                { session: '4회차', time: '15:30 ~ 16:30', desc: '오후 집중 상담 2' },
                { session: '5회차', time: '19:00 ~ 20:00', desc: '야간 퇴근 후 상담' },
              ].map((slot) => (
                <div key={slot.session} className="flex justify-between items-center py-2.5 px-3 bg-brand-beige/20 rounded-xl border border-brand-green/10">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-brand-sage text-white text-[11px] font-bold rounded-md">{slot.session}</span>
                    <span className="font-semibold text-sm text-brand-brown">{slot.time}</span>
                  </div>
                  <span className="text-xs text-brand-brown/60 hidden sm:inline">{slot.desc}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 px-3 border-t border-brand-green/15 text-red-500 font-semibold text-sm mt-2">
                <span>일요일 및 법정 공휴일</span>
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-xs font-bold">정기 휴무</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-brand-green/20 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
              <p className="text-sm text-brand-brown/80 leading-relaxed">
                상담은 1일 5회 사전 예약제로 엄격하게 운영됩니다. 내담자 간 마주침을 최소화하고 깊이 있는 상담 품질을 유지하기 위해 예약 시간을 엄수해 주시기 바랍니다.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <div className="mt-28 scroll-mt-24" id="faq">
          <FAQ 
            category={activeFaqCategory}
            onCategoryChange={setActiveFaqCategory}
            targetFAQId={targetFaqId}
          />
        </div>
      </div>
    </div>
  );
}
