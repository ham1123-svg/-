import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, User, Users, BookOpen, CheckCircle2 } from 'lucide-react';
import { Program } from '../types';
import { cn } from '../lib/utils';

const categories = [
  { id: 'all', name: '전체', icon: null },
  { id: '개인상담', name: '개인상담', icon: <User className="w-5 h-5" /> },
  { id: '부부상담', name: '부부상담', icon: <Users className="w-5 h-5" /> },
  { id: '심리검사', name: '심리검사', icon: <BookOpen className="w-5 h-5" /> },
  { id: '기업상담', name: '기업상담', icon: <Heart className="w-5 h-5" /> },
  { id: '집단/교육', name: '집단/교육', icon: <Users className="w-5 h-5" /> },
];

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        setPrograms(data);
        setLoading(false);
      });
  }, []);

  const filteredPrograms = activeCategory === 'all' 
    ? programs 
    : programs.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-brand-brown mb-4">상담 프로그램</h1>
          <p className="text-brand-brown/60">개인, 부부, 기업을 위한 전문적인 심리 솔루션을 제공합니다.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all",
                activeCategory === cat.id 
                  ? "bg-brand-sage text-white shadow-lg" 
                  : "bg-brand-green/30 text-brand-sage hover:bg-brand-green/50"
              )}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-sage"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-beige/30 rounded-3xl p-8 border border-brand-green/20 hover:border-brand-sage transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-white text-brand-sage text-xs font-bold rounded-full border border-brand-green/30">
                    {program.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-brand-brown mb-4 group-hover:text-brand-sage transition-colors">
                  {program.title}
                </h3>
                <p className="text-brand-brown/70 mb-8 line-clamp-3">
                  {program.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {program.tags.split(' ').map(tag => (
                    <span key={tag} className="text-xs text-brand-brown/50 bg-white/50 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-white text-brand-sage font-bold rounded-xl border border-brand-sage hover:bg-brand-sage hover:text-white transition-all flex items-center justify-center gap-2">
                  상세보기 <CheckCircle2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
