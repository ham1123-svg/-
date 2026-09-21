import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, 
  CalendarCheck2, PhoneCall, HeartHandshake, Sparkles, ChevronRight, ShieldCheck 
} from 'lucide-react';
import { Program } from '../types';

export default function Reservation() {
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    program_id: '',
    preferred_date: '',
    preferred_time: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then((data: Program[]) => {
        setPrograms(data);
        const programQuery = searchParams.get('program');
        if (programQuery && data && data.length > 0) {
          const matched = data.find(p => 
            p.title.includes(programQuery) || programQuery.includes(p.title)
          );
          if (matched) {
            setFormData(prev => ({ ...prev, program_id: matched.id.toString() }));
          }
        }
      });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        program_id: parseInt(formData.program_id)
      }),
    });
    if (response.ok) {
      setSubmitted(true);
    }
  };

  const steps = [
    {
      step: '01',
      title: '온라인 간편 접수',
      desc: '희망하시는 상담 프로그램과 편안한 방문 일시를 선택하여 접수합니다.',
      icon: CalendarCheck2,
      tag: '소요시간 1분'
    },
    {
      step: '02',
      title: '일정 확인 및 확정',
      desc: '상담실에서 접수 내역 확인 후 안내 전화를 드려 세부 일정을 확정합니다.',
      icon: PhoneCall,
      tag: '전문 상담사 안내'
    },
    {
      step: '03',
      title: '내방 및 초기 면담',
      desc: '아늑하고 비밀이 철저히 보장되는 1:1 상담실에서 현재의 고민을 경청합니다.',
      icon: HeartHandshake,
      tag: '100% 비밀 보장'
    },
    {
      step: '04',
      title: '맞춤 치유 솔루션',
      desc: '내담자의 필요에 따른 정밀 심리평가 및 회복·성장 세션을 진행합니다.',
      icon: Sparkles,
      tag: '개인 맞춤 프로그램'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-beige/20 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/40 text-brand-brown text-xs font-semibold rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
            100% 비밀 보장 전문 심리상담
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-3">
            예약 및 오시는 길
          </h1>
          <p className="text-brand-brown/70 text-sm sm:text-base max-w-2xl mx-auto">
            방문하시기 편안한 일정을 선택해 주시면 확인 후 친절하게 안내 전화를 드립니다.
          </p>
        </div>

        {/* Step-by-Step Reservation Guide */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
          aria-label="상담 예약 절차 안내"
        >
          <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-brand-green/20 gap-2">
              <div>
                <span className="text-xs font-bold text-brand-sage tracking-wider uppercase">
                  Reservation Process
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">
                  상담 신청 절차 안내
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-brand-brown/60">
                처음 찾아오시는 분도 쉽고 편안하게 진행하실 수 있도록 단계별로 안내해 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {steps.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={item.step} 
                    id={`reservation-step-${item.step}`}
                    className="relative bg-brand-beige/25 hover:bg-brand-beige/50 rounded-2xl p-5 border border-brand-green/20 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header in Card */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sage text-white shadow-xs">
                          STEP {item.step}
                        </span>
                        <span className="text-[11px] font-medium text-brand-brown/60 bg-white/80 px-2 py-0.5 rounded-md border border-brand-green/20">
                          {item.tag}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-white border border-brand-green/30 text-brand-sage flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-base font-bold text-brand-brown mb-2 font-serif">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Step Flow Arrow on Desktop between cards */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-brand-green/30 shadow-xs flex items-center justify-center text-brand-sage">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-brand-green/10"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center text-brand-sage mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-brand-brown mb-4">예약 신청이 완료되었습니다!</h2>
                <p className="text-brand-brown/60 mb-8">
                  담당자가 확인 후 빠른 시일 내에 안내 전화를 드리겠습니다. <br />
                  조금만 기다려 주세요.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-brand-sage font-bold hover:underline"
                >
                  새로운 예약 신청하기
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif font-bold text-brand-brown mb-8 flex items-center gap-2">
                  <Send className="w-6 h-6 text-brand-sage" /> 온라인 예약 신청
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-brown/70 ml-1">성함 (닉네임 가능)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="성함을 입력해 주세요"
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-brown/70 ml-1">연락처</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-brown/70 ml-1">상담 프로그램 선택</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 appearance-none"
                      value={formData.program_id}
                      onChange={e => setFormData({...formData, program_id: e.target.value})}
                    >
                      <option value="">프로그램을 선택해 주세요</option>
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{`[${p.category}] ${p.title}`}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-brown/70 ml-1">희망 날짜</label>
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10"
                        value={formData.preferred_date}
                        onChange={e => setFormData({...formData, preferred_date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-brown/70 ml-1">희망 시간</label>
                      <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 focus:border-brand-sage outline-none bg-brand-beige/10 appearance-none"
                        value={formData.preferred_time}
                        onChange={e => setFormData({...formData, preferred_time: e.target.value})}
                      >
                        <option value="">시간 선택</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                      </select>
                    </div>
                  </div>
                  
                  <p className="text-xs text-brand-brown/40 leading-relaxed">
                    * 가예약 신청 후 담당자가 확인 전화를 드려 최종 확정됩니다. <br />
                    * 당일 예약은 전화(052-254-0230)로 문의해 주시기 바랍니다.
                  </p>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-sage text-white font-bold rounded-2xl shadow-lg hover:bg-brand-sage/90 transition-all"
                  >
                    예약 신청하기
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Map & Info */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-green/10 h-[400px]"
            >
              {/* Google Maps Iframe */}
              <iframe 
                src="https://maps.google.com/maps?q=울산광역시%20울주군%20삼남읍%20도호1길%2023&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-green/20 rounded-3xl p-8 border border-brand-sage/20"
            >
              <h3 className="text-xl font-serif font-bold text-brand-brown mb-6">찾아오시는 길</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">울산광역시 울주군 삼남읍 도호1길 23 상가 408호</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">052-254-0230</p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">mikypa@naver.com</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                  <p className="text-brand-brown/80">평일 10:00 - 20:00 / 토요일 10:00 - 17:00</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white/50 rounded-2xl">
                <p className="text-xs text-brand-brown/60 font-medium">
                  <span className="text-brand-sage font-bold">[대중교통 이용 시]</span> <br />
                  KTX 울산역(통도사)에서 대중교통 이용 시 편리하게 방문하실 수 있습니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
