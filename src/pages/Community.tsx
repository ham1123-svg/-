import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, BookOpen, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const faqs = [
  {
    q: "상담 기록이 남아서 불이익을 받지 않을까요?",
    a: "행복바람심리상담연구소는 의료기관이 아닌 민간 상담기관으로, 국민건강보험공단에 기록이 전송되지 않습니다. 상담 내용은 철저히 비밀보장 원칙을 따르며, 내담자의 동의 없이 외부로 유출되지 않습니다."
  },
  {
    q: "상담은 보통 몇 번 정도 받아야 하나요?",
    a: "상담 횟수는 개인의 어려움과 목표에 따라 다릅니다. 보통 단기 상담은 10~15회기, 심층적인 변화를 목표로 하는 경우 그 이상의 기간이 소요될 수 있습니다. 초기 상담 후 상담사와 상의하여 결정하게 됩니다."
  },
  {
    q: "예약 없이 방문해도 상담이 가능한가요?",
    a: "원활한 상담 진행과 내담자의 프라이버시 보호를 위해 모든 상담은 100% 예약제로 운영됩니다. 방문 전 반드시 전화나 온라인 예약을 부탁드립니다."
  },
  {
    q: "아이 상담인데 부모님도 같이 가야 하나요?",
    a: "아동 및 청소년 상담의 경우, 주 양육자의 협조가 매우 중요합니다. 초기 상담 시에는 부모님과 함께 방문하시는 것을 권장하며, 이후에도 정기적인 부모 상담이 병행됩니다."
  }
];

const columns = [
  {
    title: "우리 아이의 산만함, ADHD일까요?",
    author: "이바람 수석상담사",
    date: "2026.03.01",
    category: "아동/청소년",
    image: "https://picsum.photos/seed/column1/400/300"
  },
  {
    title: "번아웃을 극복하는 마음 챙김 5단계",
    author: "김행복 원장",
    date: "2026.02.25",
    category: "성인/직장인",
    image: "https://picsum.photos/seed/column2/400/300"
  },
  {
    title: "건강한 부부 소통을 위한 대화법",
    author: "김행복 원장",
    date: "2026.02.15",
    category: "부부/가족",
    image: "https://picsum.photos/seed/column3/400/300"
  }
];

export default function Community() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">커뮤니티</h1>
          <p className="text-brand-brown/60">자주 묻는 질문과 전문가의 따뜻한 칼럼을 만나보세요.</p>
        </div>

        {/* Secret Policy Banner */}
        <div className="mb-20 p-6 bg-brand-green/20 rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-brand-sage/20">
          <div className="bg-white p-4 rounded-full text-brand-sage">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-brown mb-1">철저한 비밀보장 및 익명성 원칙</h3>
            <p className="text-brand-brown/70 text-sm">
              본 연구소는 내담자의 모든 정보를 극비로 관리하며, 닉네임 사용 및 가상 번호 시스템을 지원합니다. 
              당신의 이야기는 이곳에서 안전하게 보호됩니다.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* FAQ Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-6 h-6 text-brand-sage" />
              <h2 className="text-2xl font-serif font-bold text-brand-brown">자주 묻는 질문 (FAQ)</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "border rounded-2xl transition-all overflow-hidden",
                    openFaq === idx ? "border-brand-sage bg-brand-green/10" : "border-brand-green/20 bg-white"
                  )}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left"
                  >
                    <span className="font-bold text-brand-brown">{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-5 h-5 text-brand-sage" /> : <ChevronDown className="w-5 h-5 text-brand-brown/40" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-brand-brown/70 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Expert Column Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-brand-sage" />
              <h2 className="text-2xl font-serif font-bold text-brand-brown">전문가 칼럼</h2>
            </div>
            <div className="space-y-6">
              {columns.map((column, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="flex gap-4 p-4 rounded-2xl border border-brand-green/10 hover:bg-brand-beige/50 transition-all cursor-pointer"
                >
                  <img 
                    src={column.image} 
                    alt={column.title} 
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-widest">{column.category}</span>
                    <h3 className="font-bold text-brand-brown mb-1 line-clamp-1">{column.title}</h3>
                    <p className="text-xs text-brand-brown/50 mb-2">{column.author} | {column.date}</p>
                    <button className="text-xs font-bold text-brand-sage hover:underline">더 읽어보기</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
