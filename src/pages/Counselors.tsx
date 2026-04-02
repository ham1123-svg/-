import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, User, Award, BookOpen, Heart } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">상담사 소개</h1>
          <p className="text-brand-brown/60">당신의 마음을 가장 잘 이해할 수 있는 전문가를 만나보세요.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="relative">
            <input 
              type="text" 
              placeholder="이름, 증상, 상담 스타일로 검색해보세요"
              className="w-full px-6 py-4 rounded-full border border-brand-green bg-white focus:border-brand-sage outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-5 top-4 text-brand-sage w-6 h-6" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-sage"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredCounselors.map((counselor) => (
              <motion.div 
                key={counselor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-green/10 flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 h-80 md:h-auto relative">
                  <img 
                    src={counselor.image_url} 
                    alt={counselor.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {counselor.tags.split(' ').map(tag => (
                      <span key={tag} className="px-2 py-1 bg-brand-sage/90 text-white text-xs rounded-lg backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-3/5 p-8 flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-brand-brown mb-1">{counselor.name}</h2>
                    <p className="text-brand-sage font-medium">{counselor.title}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider">학력 및 자격</h4>
                        <p className="text-sm text-brand-brown/80">{counselor.education}</p>
                        <p className="text-sm text-brand-brown/80">{counselor.certifications}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-brand-sage shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xs font-bold text-brand-brown/40 uppercase tracking-wider">상담 스타일</h4>
                        <p className="text-sm text-brand-brown/80 italic">"{counselor.style}"</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/reservation"
                    className="w-full py-3 bg-brand-green text-brand-sage font-bold rounded-xl hover:bg-brand-sage hover:text-white transition-all text-center"
                  >
                    상담 예약하기
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredCounselors.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-brand-brown/40 text-lg">검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
