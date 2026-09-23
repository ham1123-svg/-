import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const navigate = useNavigate();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isAuthed = sessionStorage.getItem('hbbr_admin_auth') === 'true';
    if (isAuthed) {
      navigate('/admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <footer className="bg-brand-brown text-brand-beige py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Brand Info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">행복바람<span className="text-brand-sage">심리상담연구소</span></h3>
            <p className="text-brand-beige/65 text-xs sm:text-sm leading-relaxed mb-6">
              모든 내담자가 자신의 삶에서 행복의 바람을 맞이할 수 있도록 돕습니다. 
              10,000+ 시간 임상 경험과 따뜻한 공감으로 함께하겠습니다.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-brand-beige/70 space-y-1">
              <div className="text-brand-sage font-bold flex items-center gap-1.5">
                <span>✓ 100% 비밀보장 준수</span>
              </div>
              <div>국민건강보험공단 진료코드 미등록</div>
              <div className="text-[11px] text-brand-beige/50">한국상담학회 윤리강령 준수 기관</div>
            </div>
          </div>
          
          {/* Contact Details (Contact Us) */}
          <div>
            <h4 className="font-bold mb-5 text-brand-sage uppercase tracking-wider text-xs sm:text-sm">Contact Us</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-beige/70">
              <li className="flex items-start gap-2">
                <span className="w-16 shrink-0 font-bold text-brand-beige">주소:</span>
                <span>울산광역시 울주군 삼남읍 도호1길 23 상가 408호</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-16 shrink-0 font-bold text-brand-beige">전화:</span>
                <a href="tel:052-254-0230" className="hover:text-brand-sage transition-colors font-semibold text-brand-beige">
                  052-254-0230
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-16 shrink-0 font-bold text-brand-beige">이메일:</span>
                <span>mikypa@naver.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-16 shrink-0 font-bold text-brand-beige">운영시간:</span>
                <div className="space-y-0.5">
                  <div>월~토 1일 5회 사전 예약제</div>
                  <div className="text-[11px] text-brand-beige/50">(09:00, 10:30, 14:00, 15:30, 19:00)</div>
                  <div className="text-[11px] text-amber-300/70">일요일, 공휴일 휴무</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Customer & Legal */}
          <div>
            <h4 className="font-bold mb-5 text-brand-sage uppercase tracking-wider text-xs sm:text-sm">Customer &amp; Legal</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-beige/65">
              <li><Link to="/confidentiality" className="hover:text-brand-sage transition-colors">비밀보장원칙</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-sage transition-colors">개인정보처리방침</Link></li>
              <li><Link to="/terms" className="hover:text-brand-sage transition-colors">이용약관</Link></li>
              <li>
                <button
                  type="button"
                  onClick={handleAdminClick}
                  className="hover:text-brand-sage transition-colors text-left cursor-pointer"
                >
                  운영자 관리 모드
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-14 pt-8 border-t border-brand-beige/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-beige/40">
          <p>© 2026 행복바람심리상담연구소 (www.hbbr.kr). All rights reserved.</p>
          <p className="text-[11px]">울산 울주군 삼남읍 심리상담전문기관</p>
        </div>
      </div>

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => navigate('/admin')}
      />
    </footer>
  );
}
