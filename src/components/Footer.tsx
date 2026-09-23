import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTestimonialsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById('testimonials-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', '/#testimonials-section');
      }
    } else {
      navigate('/#testimonials-section');
    }
  };

  const handleFaqClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/guide') {
      const element = document.getElementById('faq');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', '/guide#faq');
      }
    } else {
      navigate('/guide#faq');
    }
  };
  return (
    <footer className="bg-brand-brown text-brand-beige py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
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
          
          {/* Contact Details */}
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

          {/* Community Sub-Menus (하위 메뉴 5대 구성) */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <h4 className="font-bold text-brand-sage uppercase tracking-wider text-xs sm:text-sm">
                커뮤니티 (Community)
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-brand-beige/70">
              <li>
                <Link 
                  to="/community?tab=notice" 
                  className="hover:text-brand-sage transition-colors flex items-center justify-between group py-1"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    1. 연구소 공지 &amp; 소식
                  </span>
                  <span className="text-[10px] text-brand-beige/40 group-hover:text-brand-sage">Notice</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/community?tab=column" 
                  className="hover:text-brand-sage transition-colors flex items-center justify-between group py-1"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    2. 전문가 심리 칼럼
                  </span>
                  <span className="text-[10px] text-brand-beige/40 group-hover:text-brand-sage">Column</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/community?tab=review" 
                  className="hover:text-brand-sage transition-colors flex items-center justify-between group py-1"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    3. 내담자 상담 후기
                  </span>
                  <span className="text-[10px] text-brand-beige/40 group-hover:text-brand-sage">Reviews</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/community?tab=faq" 
                  className="hover:text-brand-sage transition-colors flex items-center justify-between group py-1"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    4. 자주 묻는 질문 (FAQ)
                  </span>
                  <span className="text-[10px] text-brand-beige/40 group-hover:text-brand-sage">FAQ</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/community?tab=qna" 
                  className="hover:text-emerald-300 transition-colors flex items-center justify-between group py-1 text-emerald-200/90 font-medium"
                >
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>5. 1:1 비밀 상담 문의</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    비공개
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer & Legal */}
          <div>
            <h4 className="font-bold mb-5 text-brand-sage uppercase tracking-wider text-xs sm:text-sm">Customer &amp; Legal</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-brand-beige/65">
              <li>
                <Link 
                  to="/eap" 
                  className="hover:text-brand-sage transition-colors text-brand-beige/85 font-semibold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sage"></span>
                  <span>기관 및 기업상담(EAP) 제휴</span>
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-brand-sage transition-colors">
                  실시간 상담 예약 및 오시는 길
                </Link>
              </li>
              <li>
                <Link to="/reservation/status" className="hover:text-brand-sage transition-colors">
                  예약 내역 및 진행 상태 조회
                </Link>
              </li>
              <li><Link to="/confidentiality" className="hover:text-brand-sage transition-colors">비밀보장원칙</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-sage transition-colors">개인정보처리방침</Link></li>
              <li><Link to="/terms" className="hover:text-brand-sage transition-colors">이용약관</Link></li>
              <li><Link to="/admin" className="hover:text-brand-sage transition-colors text-brand-sage/80 font-medium">운영자 관리 모드</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-14 pt-8 border-t border-brand-beige/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-beige/40">
          <p>© 2026 행복바람심리상담연구소 (www.hbbr.kr). All rights reserved.</p>
          <p className="text-[11px]">울산 울주군 삼남읍 심리상담전문기관</p>
        </div>
      </div>
    </footer>
  );
}
