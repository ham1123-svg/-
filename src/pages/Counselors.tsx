import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { Counselor } from '../types';

export default function Counselors() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/counselors')
      .then(res => res.json())
      .then(data => {
        setCounselors(data);
        setLoading(false);
      });
  }, []);

  const filteredCounselors = counselors.filter(c => 
    c.name.includes(searchTerm) || 
    c.tags.includes(searchTerm) || 
    c.style.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-brand-beige/30 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3">
            Counselor Profile
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">상담사 소개</h1>
          <p className="text-brand-brown/70 font-serif">마음의 평온을 함께 찾아가는 전문 심리 상담사를 소개합니다.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input 
              type="text" 
              placeholder="이름, 분야, 상담 스타일로 검색해보세요"
              className="w-full px-6 py-3.5 rounded-full border border-brand-green/40 bg-white focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-none shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-5 top-3.5 text-brand-sage w-5 h-5" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-sage"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCounselors.map((counselor) => {
              const certList = counselor.certifications 
                ? counselor.certifications.split('\n').filter(Boolean)
                : [];
              
              const styles = counselor.style 
                ? counselor.style.split('/').map(s => s.trim()).filter(Boolean)
                : [];

              return (
                <motion.div 
                  key={counselor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-green/20 flex flex-col md:flex-row"
                >
                  {/* Left: Profile Image & Badges */}
                  <div className="md:w-5/12 min-h-[340px] md:min-h-[440px] relative bg-brand-beige/40">
                    <img 
                      src={counselor.image_url} 
                      alt={counselor.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                      {counselor.tags.split(' ').filter(Boolean).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-brand-brown text-xs font-medium rounded-full shadow-xs border border-brand-green/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right: Detailed Structured Info */}
                  <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      {/* Name & Academic Title */}
                      <div className="border-b border-brand-green/20 pb-6 mb-6">
                        <div className="flex flex-wrap items-baseline gap-3 mb-2">
                          <h2 className="text-3xl font-serif font-bold text-brand-brown">{counselor.name}</h2>
                          <span className="px-3 py-1 bg-brand-sage/10 text-brand-sage font-bold text-sm rounded-full">
                            {counselor.title}
                          </span>
                        </div>
                        <p className="text-base font-serif text-brand-brown/80 font-medium">
                          {counselor.education}
                        </p>
                      </div>
                      
                      {/* <자격&경력> Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="w-4 h-4 text-brand-sage" />
                          <h3 className="text-sm font-bold text-brand-brown tracking-wider">
                            &lt;자격&amp;경력&gt;
                          </h3>
                        </div>
                        <ul className="space-y-2 pl-1">
                          {certList.length > 0 ? (
                            certList.map((cert, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-sm text-brand-brown/85 leading-relaxed font-serif">
                                <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                                <span>{cert}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-brand-brown/80 font-serif">{counselor.certifications}</li>
                          )}
                        </ul>
                      </div>

                      {/* <상담 스타일> Section */}
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-brand-sage" />
                          <h3 className="text-sm font-bold text-brand-brown tracking-wider">
                            &lt;상담 스타일&gt;
                          </h3>
                        </div>
                        <div className="p-4 bg-brand-beige/30 rounded-2xl border border-brand-green/30">
                          <p className="text-sm font-bold text-brand-brown mb-2.5 font-serif">
                            {counselor.style}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {styles.map((st, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 bg-white text-brand-sage text-xs font-semibold rounded-lg border border-brand-sage/20 shadow-xs"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking Action */}
                    <Link 
                      to="/reservation"
                      className="w-full py-3.5 bg-brand-sage text-white font-bold rounded-2xl hover:bg-brand-sage/90 transition-all text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <span>{counselor.name} 소장 상담 예약하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {filteredCounselors.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-brand-green/20">
            <p className="text-brand-brown/50 text-base font-serif">검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
