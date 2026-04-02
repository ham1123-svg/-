import React from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardCheck, UserPlus, CalendarCheck, CheckCircle, 
  ArrowRight, Clock, CreditCard, ShieldCheck 
} from 'lucide-react';

const steps = [
  { 
    title: "상담 접수", 
    desc: "홈페이지 또는 전화를 통해 상담을 신청합니다.", 
    icon: <UserPlus className="w-8 h-8" /> 
  },
  { 
    title: "초기 상담", 
    desc: "현재의 어려움과 상담 목표를 설정하는 첫 만남입니다.", 
    icon: <ClipboardCheck className="w-8 h-8" /> 
  },
  { 
    title: "정기 상담", 
    desc: "주 1회 정기적으로 만나 심층적인 상담을 진행합니다.", 
    icon: <CalendarCheck className="w-8 h-8" /> 
  },
  { 
    title: "상담 종결", 
    desc: "변화를 확인하고 스스로 일어설 수 있는 힘을 얻습니다.", 
    icon: <CheckCircle className="w-8 h-8" /> 
  },
];

export default function Guide() {
  return (
    <div className="min-h-screen bg-brand-beige/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">상담 안내</h1>
          <p className="text-brand-brown/60">상담이 처음이신 분들을 위해 차근차근 안내해 드립니다.</p>
        </div>

        {/* Process Visualization */}
        <section className="mb-24">
          <h2 className="text-2xl font-serif font-bold text-brand-brown mb-12 text-center">상담 진행 과정</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="w-20 h-20 rounded-3xl bg-white shadow-lg flex items-center justify-center text-brand-sage mb-6 border border-brand-green/20"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-brand-brown mb-2">{step.title}</h3>
                <p className="text-sm text-brand-brown/60 max-w-[200px]">{step.desc}</p>
                
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 text-brand-green/50">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing & Time Table */}
        <section className="grid md:grid-cols-2 gap-12">
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
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-6 h-6 text-brand-sage" />
              <h2 className="text-2xl font-serif font-bold text-brand-brown">상담 시간 안내</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-brand-green/10">
                <span className="font-medium">평일</span>
                <span className="text-brand-brown/70">10:00 - 20:00</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-brand-green/10">
                <span className="font-medium">토요일</span>
                <span className="text-brand-brown/70">10:00 - 17:00</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-brand-green/10 text-red-400">
                <span className="font-medium">일요일 및 공휴일</span>
                <span className="font-bold">휴무</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-brand-green/20 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
              <p className="text-sm text-brand-brown/80 leading-relaxed">
                상담은 100% 예약제로 운영됩니다. 원활한 상담을 위해 예약 시간을 엄수해 주시기 바랍니다.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
