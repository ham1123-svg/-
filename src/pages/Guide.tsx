import React from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardCheck, UserPlus, CalendarCheck, CheckCircle, 
  ArrowRight, Clock, CreditCard, ShieldCheck 
} from 'lucide-react';

const steps = [
  { 
    step: "STEP 1",
    title: "상담 접수", 
    desc: "홈페이지 또는 전화를 통해 편안하게 상담을 신청합니다.", 
    icon: <UserPlus className="w-7 h-7" /> 
  },
  { 
    step: "STEP 2",
    title: "초기 상담", 
    desc: "현재 겪고 있는 어려움을 나누고 앞으로의 상담 목표를 설정합니다.", 
    icon: <ClipboardCheck className="w-7 h-7" /> 
  },
  { 
    step: "STEP 3",
    title: "정기 상담", 
    desc: "주 1회 정기적인 만남을 통해 심층적이고 체계적인 상담을 진행합니다.", 
    icon: <CalendarCheck className="w-7 h-7" /> 
  },
  { 
    step: "STEP 4",
    title: "상담 종결", 
    desc: "긍정적인 마음의 변화를 확인하고 스스로 회복할 수 있는 힘을 다집니다.", 
    icon: <CheckCircle className="w-7 h-7" /> 
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
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3">
              Counseling Process
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-brown">상담 진행 과정</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-brand-green/30 flex flex-col items-center text-center"
              >
                {/* Step Badge */}
                <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage font-bold text-xs tracking-wider">
                  {step.step}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-brand-green/30 flex items-center justify-center text-brand-sage mb-5 border border-brand-sage/20">
                  {step.icon}
                </div>
                
                <h3 className="text-lg font-bold text-brand-brown mb-2">{step.title}</h3>
                <p className="text-sm text-brand-brown/70 leading-relaxed">{step.desc}</p>
                
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-brand-beige border border-brand-green/50 items-center justify-center text-brand-sage/60">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
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
