import React from 'react';
import { motion } from 'motion/react';
import { 
  Wind, 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Landmark, 
  HeartHandshake, 
  ShieldAlert, 
  Briefcase,
  Layers
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  category: string;
  type: 'education' | 'public' | 'disaster' | 'eap';
  description: string;
  iconBg: string;
  iconColor: string;
}

const partners: Partner[] = [
  {
    id: 'ulsan-edu',
    name: '울산광역시교육청',
    category: '교육 행정 / 학교 심리 지원',
    type: 'education',
    description: '교원 및 학생 심리 상담, 학교폭력 및 심리정서 지원 사업 협력',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'ulsan-labor',
    name: '울산광역시노동인권센터',
    category: '공공기관 / 노동인권',
    type: 'public',
    description: '취약계층 노동자 심리치유 및 직무 스트레스 완화 상담 협력',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-700'
  },
  {
    id: 'ulsan-job',
    name: '울산광역시경제일자리진흥원',
    category: '공공기관 / 일자리·기업지원',
    type: 'public',
    description: '청년·구직자 심리역량 강화 및 중소기업 임직원 상담 연계',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-700'
  },
  {
    id: 'ulsan-disaster',
    name: '울산광역시재난심리회복지원센터',
    category: '재난 위기 대응 / 심리 회복',
    type: 'disaster',
    description: '재난·외상 경험자 및 위기 가구 심리 안정화, 긴급 심리지원 협력',
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-700'
  },
  {
    id: 'ulsan-junggu',
    name: '울산중구시설관리공단',
    category: '공공기관 / 임직원 EAP',
    type: 'public',
    description: '공단 임직원 직무 스트레스 관리, 정신건강 증진 EAP 프로그램 운영',
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-700'
  },
  {
    id: 'busan-teacher-healing',
    name: '부산광역시교원힐링센터',
    category: '교육기관 / 교원 힐링',
    type: 'education',
    description: '교권 침해 및 교육활동 스트레스 극복을 위한 1:1 심리상담·집단 힐링',
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    iconColor: 'text-teal-700'
  },
  {
    id: 'busan-women-family',
    name: '부산여성가족과 평생교육진흥원',
    category: '공공·평생교육 / 가족 지원',
    type: 'public',
    description: '가족 관계 증진, 부모 교육 및 여성가족 심리역량 강화 프로그램 연계',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-700'
  },
  {
    id: 'corporate-eap-network',
    name: '기업 EAP & 공공 맞춤형 제휴 기관',
    category: '기업체 / 민관 협력 네트워크',
    type: 'eap',
    description: '임직원 마음건강 진단, 맞춤형 웰니스 워크숍 및 1:1 비밀보장 심리상담 제휴',
    iconBg: 'bg-brand-sage/10 text-brand-sage border-brand-sage/30',
    iconColor: 'text-brand-sage'
  }
];

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
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3">
              Healing Space
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">마음이 편안해지는 공간</h2>
            <p className="text-brand-brown/70 font-serif max-w-xl mx-auto text-base">
              아늑하고 정갈한 인테리어와 따뜻한 자연광으로 내담자의 심리적 안정과 온전한 쉼을 돕습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. 맑은 웰컴 티와 정갈한 수제 다과 */}
            <motion.div 
              whileHover={{ y: -6 }} 
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-green/30 transition-all flex flex-col group"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop" 
                  alt="투명한 유리잔의 따뜻한 웰컴 티와 정갈한 수제 다과" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-brand-brown mb-2">웰컴 티 & 정갈한 다과</h3>
                  <p className="text-sm text-brand-brown/70 leading-relaxed font-serif">
                    상담 전 긴장을 부드럽게 완화해주는 투명한 잔의 맑은 웰컴 티와, 원목 트레이에 정갈하게 놓인 수제 다과가 준비된 편안한 쉼의 공간입니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2. 아늑하고 안전한 1:1 맞춤 상담실 */}
            <motion.div 
              whileHover={{ y: -6 }} 
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-green/30 transition-all flex flex-col md:translate-y-4"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop" 
                  alt="아늑하고 안전한 1:1 맞춤 상담실" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-brand-brown mb-2">1:1 개인 심리상담실</h3>
                  <p className="text-sm text-brand-brown/70 leading-relaxed font-serif">
                    완벽한 방음과 비밀 보장이 이루어지는 독립된 공간에서 온전히 나 자신에게 집중할 수 있습니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 3. 사계절의 평온이 머무는 휴식 공간 */}
            <motion.div 
              whileHover={{ y: -6 }} 
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-green/30 transition-all flex flex-col"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" 
                  alt="사계절의 평온이 머무는 휴식 공간" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-brand-brown mb-2">자연 채광과 힐링 쉼터</h3>
                  <p className="text-sm text-brand-brown/70 leading-relaxed font-serif">
                    부드러운 자연광과 싱그러운 반려 식물들이 조화를 이루어 지친 일상에 깊은 평온을 선사합니다.
                  </p>
                </div>
              </div>
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

      {/* Partner Organizations Section */}
      <section className="py-24 bg-white border-t border-brand-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3">
              Partnership & Network
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">
              주요 협력 기관 및 기업
            </h2>
            <p className="text-base text-brand-brown/70 font-serif leading-relaxed">
              행복바람 심리상담연구소는 교육청, 지자체 공공기관 및 기업들과 연계하여 <br className="hidden sm:inline" />
              전문적인 심리 상담, 교원 힐링, 재난 위기 회복 및 맞춤형 EAP 프로그램을 협력하고 있습니다.
            </p>
          </div>

          {/* Partner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {partners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-brand-beige/20 hover:bg-white rounded-3xl p-6 border border-brand-green/30 hover:border-brand-sage/50 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Logo Placeholder / Icon Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-bold text-base shadow-xs ${partner.iconBg}`}>
                      {partner.type === 'education' && <GraduationCap className="w-6 h-6" />}
                      {partner.type === 'public' && <Landmark className="w-6 h-6" />}
                      {partner.type === 'disaster' && <ShieldAlert className="w-6 h-6" />}
                      {partner.type === 'eap' && <Briefcase className="w-6 h-6" />}
                    </div>
                    <span className="text-[11px] font-semibold text-brand-sage bg-white px-2.5 py-1 rounded-full border border-brand-green/30">
                      {partner.category.split('/')[0].trim()}
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h3 className="font-bold text-lg text-brand-brown mb-2 font-serif leading-snug">
                    {partner.name}
                  </h3>

                  {/* Detailed Description */}
                  <p className="text-xs text-brand-brown/70 leading-relaxed font-serif mb-4">
                    {partner.description}
                  </p>
                </div>

                {/* Sub domain tag */}
                <div className="pt-3 border-t border-brand-green/20 flex items-center gap-1.5 text-[11px] text-brand-brown/60">
                  <HeartHandshake className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                  <span className="truncate">{partner.category}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* EAP & Institutional Inquiry Banner */}
          <div className="bg-brand-sage/10 rounded-3xl p-8 md:p-10 border border-brand-sage/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-sage text-white flex items-center justify-center shrink-0 mt-1">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-serif text-brand-brown mb-1">
                  기관 및 기업 상담(EAP) 제휴 문의
                </h4>
                <p className="text-sm text-brand-brown/70 font-serif">
                  임직원 마음건강 증진, 직무 스트레스 예방 교육, 집단 힐링 워크숍 등 맞춤형 제휴 프로그램을 제안해 드립니다.
                </p>
              </div>
            </div>
            <a
              href="/reservation"
              className="whitespace-nowrap px-6 py-3.5 bg-brand-sage text-white font-bold rounded-2xl hover:bg-brand-sage/90 transition-all shadow-sm text-sm"
            >
              제휴 및 EAP 상담 문의
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
