import React from 'react';
import { motion } from 'motion/react';
import { Wind, Heart, ShieldCheck, Users, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-brand-green/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Wind className="w-12 h-12 text-brand-sage mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-6">
              마음의 평온을 찾는 <br />
              <span className="text-brand-sage">행복바람 심리상담연구소</span>
            </h1>
            <p className="text-lg text-brand-brown/70 font-serif leading-relaxed">
              우리는 누구나 삶의 무게에 지칠 때가 있습니다. <br />
              행복바람은 당신의 이야기에 귀 기울이며, 다시 일어설 수 있는 행복의 바람을 함께 만들어갑니다.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-sage/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      </section>

      {/* Interior Photos Section */}
      <section className="py-24 bg-brand-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-4">마음이 편안해지는 공간</h2>
            <p className="text-brand-brown/60">아늑하고 따뜻한 인테리어로 내담자의 심리적 안정감을 최우선으로 합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl overflow-hidden shadow-lg h-80">
              <img src="https://picsum.photos/seed/interior1/800/600" alt="Interior 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl overflow-hidden shadow-lg h-80 md:translate-y-8">
              <img src="https://picsum.photos/seed/interior2/800/600" alt="Interior 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl overflow-hidden shadow-lg h-80">
              <img src="https://picsum.photos/seed/interior3/800/600" alt="Interior 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
          
          <div className="mt-24 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-bold text-brand-brown mb-8">우리의 철학</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-brand-green/20">
                <Heart className="w-10 h-10 text-brand-sage mx-auto mb-4" />
                <h4 className="font-bold text-brand-brown mb-2">따뜻한 공감</h4>
                <p className="text-sm text-brand-brown/60">판단하지 않는 마음으로 당신의 고통을 함께 나눕니다.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-brand-green/20">
                <ShieldCheck className="w-10 h-10 text-brand-sage mx-auto mb-4" />
                <h4 className="font-bold text-brand-brown mb-2">철저한 비밀보장</h4>
                <p className="text-sm text-brand-brown/60">상담 내용은 윤리 규정에 따라 엄격히 보호됩니다.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-brand-green/20">
                <Users className="w-10 h-10 text-brand-sage mx-auto mb-4" />
                <h4 className="font-bold text-brand-brown mb-2">전문가 협업</h4>
                <p className="text-sm text-brand-brown/60">다양한 분야의 전문가들이 최선의 솔루션을 고민합니다.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-brand-green/20">
                <Sparkles className="w-10 h-10 text-brand-sage mx-auto mb-4" />
                <h4 className="font-bold text-brand-brown mb-2">지속 가능한 변화</h4>
                <p className="text-sm text-brand-brown/60">일시적인 위로를 넘어 삶의 근본적인 변화를 지향합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
