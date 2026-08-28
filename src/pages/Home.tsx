import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, ClipboardList, Heart, User, Users, ArrowRight, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const hashtags = [
  { label: "#청소년상담", tag: "청소년" },
  { label: "#성인상담", tag: "성인" },
  { label: "#부부갈등", tag: "부부" },
  { label: "#심리검사", tag: "심리검사" },
  { label: "#기업상담", tag: "기업상담" },
  { label: "#직장스트레스", tag: "직장스트레스" },
  { label: "#우울불안", tag: "우울" },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleTagClick = (tag: string) => {
    navigate(`/counselors?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-beige/40">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" 
            alt="평온한 휴양지 해변과 부드러운 바람 배경" 
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-beige via-brand-beige/90 to-brand-beige/40" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-semibold mb-6 tracking-wide">
                <span>🍃 Mind Rest Area</span>
                <span className="w-1 h-1 rounded-full bg-brand-sage"></span>
                <span>마음의 평온을 찾는 쉼터</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-brown leading-tight mb-6">
                지친 마음에 <br />
                <span className="text-brand-sage">행복바람</span>이 불어옵니다.
              </h1>
              <p className="text-lg text-brand-brown/80 mb-8 font-serif leading-relaxed max-w-xl">
                행복바람심리상담연구소는 당신의 마음이 온전히 쉬어갈 수 있는 아늑한 쉼터입니다. 
                따뜻한 공감과 전문성으로 내면의 평온과 회복을 함께합니다.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/reservation" className="bg-brand-sage text-white px-8 py-4 rounded-full font-bold hover:bg-brand-sage/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                  상담 예약하기 <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="bg-white/80 backdrop-blur-sm text-brand-sage border border-brand-sage/30 px-8 py-4 rounded-full font-bold hover:bg-brand-green/30 transition-all flex items-center gap-2 shadow-sm">
                  상담소 둘러보기
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-white aspect-[4/3] sm:aspect-[16/11]">
                <img 
                  src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop" 
                  alt="휴양지 느낌의 고요하고 평온한 바다 풍경" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-widest text-white/80 font-medium mb-1">Peace of Mind</p>
                    <p className="text-base sm:text-lg font-serif italic text-white/95">
                      "마음이 지칠 때, 잠시 쉬어가도 괜찮습니다."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hashtag Search Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-4">어떤 고민이 있으신가요?</h2>
            <p className="text-brand-brown/60 font-serif">일상적인 언어로 편하게 찾아보세요.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder="고민을 입력해보세요 (예: #산만해요, #우울)"
                className="w-full px-6 py-5 rounded-full border-2 border-brand-green focus:border-brand-sage outline-none text-lg shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTagClick(searchTerm)}
              />
              <button 
                onClick={() => handleTagClick(searchTerm)}
                className="absolute right-3 top-3 bg-brand-sage text-white p-3 rounded-full hover:bg-brand-sage/90 transition-all"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {hashtags.map((tag) => (
                <button
                  key={tag.tag}
                  onClick={() => handleTagClick(tag.tag)}
                  className="px-4 py-2 rounded-full bg-brand-green/30 text-brand-sage font-medium hover:bg-brand-sage hover:text-white transition-all text-sm"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-brown mb-4">맞춤형 상담 프로그램</h2>
            <p className="text-brand-brown/60 font-serif">개인, 부부, 기업을 위한 전문적인 심리 솔루션을 제공합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "개인상담", icon: <User className="w-8 h-8" />, desc: "청소년 및 성인을 위한 1:1 맞춤형 심리 상담", color: "bg-brand-green text-brand-sage" },
              { title: "부부상담", icon: <Users className="w-8 h-8" />, desc: "갈등 해결과 관계 회복을 위한 부부 전문 상담", color: "bg-orange-50 text-orange-500" },
              { title: "심리검사", icon: <BookOpen className="w-8 h-8" />, desc: "객관적인 검사를 통한 정밀한 심리 상태 파악", color: "bg-blue-50 text-blue-500" },
              { title: "기업상담", icon: <Heart className="w-8 h-8" />, desc: "임직원 스트레스 관리 및 조직 적응 지원(EAP)", color: "bg-pink-50 text-pink-500" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl border border-brand-green/20 hover:shadow-xl transition-all text-center flex flex-col items-center"
              >
                <div className={cn("p-4 rounded-2xl mb-6", item.color)}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-brown mb-3">{item.title}</h3>
                <p className="text-brand-brown/60 text-sm mb-6">{item.desc}</p>
                <Link to="/programs" className="text-brand-sage font-bold text-sm flex items-center gap-1">
                  자세히 보기 <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
