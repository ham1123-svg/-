import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-brown text-brand-beige py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6">행복바람<span className="text-brand-sage">심리상담연구소</span></h3>
            <p className="text-brand-beige/60 text-sm leading-relaxed mb-6">
              우리는 모든 내담자가 자신의 삶에서 행복의 바람을 맞이할 수 있도록 돕습니다. 
              전문성과 따뜻한 마음으로 당신과 함께하겠습니다.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-beige/10 flex items-center justify-center hover:bg-brand-sage transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-brand-sage uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm text-brand-beige/60">
              <li className="flex items-start gap-3">
                <span className="font-bold text-brand-beige">주소:</span>
                울산광역시 울주군 삼남읍 도호1길 23 상가 408호
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-brand-beige">전화:</span>
                052-254-0230
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-brand-beige">이메일:</span>
                mikypa@naver.com
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-brand-beige">운영시간:</span>
                평일 10:00 - 20:00 / 토요일 10:00 - 17:00 (일요일 휴무)
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-brand-sage uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4 text-sm text-brand-beige/60">
              <li><Link to="/privacy" className="hover:text-brand-sage transition-colors">개인정보처리방침</Link></li>
              <li><Link to="/terms" className="hover:text-brand-sage transition-colors">이용약관</Link></li>
              <li><Link to="/confidentiality" className="hover:text-brand-sage transition-colors">비밀보장원칙</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-brand-beige/10 text-center text-xs text-brand-beige/40">
          <p>© 2026 행복바람심리상담연구소 (www.hbbr.kr). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
