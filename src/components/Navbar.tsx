import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Plus, ChevronRight, Contrast, 
  Keyboard, Calendar, ArrowRight, Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import SitemapModal from './SitemapModal';
import { useHighContrast } from '../context/HighContrastContext';
import { useKeyboardShortcuts } from '../context/KeyboardShortcutsContext';

interface NavItem {
  name: string;
  path: string;
  isCTA?: boolean;
}

// GNB Navigation Menu Order:
// 1. 상담소 소개
// 2. 상담사 소개
// 3. 상담 프로그램
// 4. 자가진단
// 5. 커뮤니티
// 6. 예약 / 오시는 길 (커뮤니티 메뉴 바로 다음에 위치!)
const mainNavItems: NavItem[] = [
  { name: '상담소 소개', path: '/about' },
  { name: '상담사 소개', path: '/counselors' },
  { name: '상담 프로그램', path: '/programs' },
  { name: '자가진단', path: '/self-diagnosis' },
  { name: '커뮤니티', path: '/community' },
  { 
    name: '예약 / 오시는 길', 
    path: '/reservation',
    isCTA: true 
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  const location = useLocation();
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const { toggleHelpModal } = useKeyboardShortcuts();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isReservationActive = location.pathname === '/reservation';
  const isStatusActive = location.pathname === '/reservation/status' || location.pathname === '/reservation-status';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-beige/85 backdrop-blur-md border-b border-brand-green/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-2">
            {/* Brand Logo */}
            <Link 
              to="/" 
              className="text-brand-brown font-serif text-lg sm:text-xl font-bold flex items-center gap-1.5 shrink-0"
              aria-label="행복바람 심리상담연구소 홈으로 이동"
            >
              <span>행복바람<span className="text-brand-sage">심리상담연구소</span></span>
            </Link>

            {/* Desktop Navigation (소개 -> 상담사 -> 프로그램 -> 자가진단 -> 커뮤니티 -> 예약 / 오시는 길) */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2" role="navigation" aria-label="데스크톱 주 메뉴">
              {mainNavItems.map((item) => {
                // CTA Button Item: '예약 / 오시는 길' (커뮤니티 바로 다음 위치!)
                if (item.isCTA) {
                  return (
                    <React.Fragment key={item.path}>
                      <Link
                        to={item.path}
                        aria-label={`${item.name} 페이지로 이동${isReservationActive ? ' (현재 위치)' : ''}`}
                        aria-current={isReservationActive ? 'page' : undefined}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all shadow-xs hover:shadow-md cursor-pointer select-none active:scale-95 ml-1",
                          isReservationActive
                            ? "bg-brand-brown text-white ring-2 ring-brand-brown/40 shadow-sm"
                            : "bg-brand-sage text-white hover:bg-brand-sage/90"
                        )}
                      >
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.name}</span>
                      </Link>

                      {/* Check Reservation Status Link ('예약 조회') */}
                      <Link
                        to="/reservation/status"
                        aria-label="휴대폰 번호로 예약 및 상담 신청 상태 조회"
                        aria-current={isStatusActive ? 'page' : undefined}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer select-none",
                          isStatusActive
                            ? "text-brand-sage font-bold bg-brand-green/35 ring-1 ring-brand-sage/30"
                            : "text-brand-brown/75 hover:text-brand-sage hover:bg-brand-green/20"
                        )}
                        title="휴대폰 번호로 예약 내역 및 진행 상태 조회"
                      >
                        <Search className="w-3.5 h-3.5 shrink-0" />
                        <span>예약 조회</span>
                      </Link>
                    </React.Fragment>
                  );
                }

                // Standard Menu Item (상담소 소개, 상담사 소개, 상담 프로그램, 자가진단, 커뮤니티)
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-label={`${item.name} 페이지로 이동${isActive ? ' (현재 위치)' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      "px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs lg:text-sm font-medium transition-all cursor-pointer select-none",
                      isActive
                        ? "text-brand-sage font-bold bg-brand-green/25"
                        : "text-brand-brown/75 hover:text-brand-sage hover:bg-brand-green/20"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Subtle divider before right utility controls */}
              <div className="h-4 w-px bg-brand-green/50 mx-1 lg:mx-1.5" />

              {/* 고대비 모드 토글 버튼 */}
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={isHighContrast}
                aria-label={isHighContrast ? "고대비 모드 끄기 (현재 켜짐, 일반 모드로 전환)" : "고대비 모드 켜기 (현재 꺼짐, 텍스트 가독성 및 명도 대비 강화)"}
                title={isHighContrast ? "고대비 모드 켜짐 (일반 모드로 전환)" : "고대비 모드 (텍스트 가독성 및 명도 대비 강화)"}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs cursor-pointer select-none",
                  isHighContrast
                    ? "bg-brand-sage text-white border-brand-sage shadow-xs ring-2 ring-brand-sage/40 hover:bg-brand-sage/90"
                    : "bg-white/80 hover:bg-brand-green/40 text-brand-brown hover:text-brand-sage border-brand-green/60"
                )}
              >
                <Contrast className={cn("w-3.5 h-3.5 transition-transform duration-300", isHighContrast ? "rotate-180 text-white" : "text-brand-sage")} />
                <span className="tracking-tight hidden lg:inline">고대비</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded font-extrabold transition-colors leading-none",
                  isHighContrast ? "bg-white/25 text-white" : "bg-brand-green/60 text-brand-brown/80"
                )}>
                  {isHighContrast ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* 키보드 단축키 안내 모달 버튼 */}
              <button
                type="button"
                onClick={toggleHelpModal}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-2xs cursor-pointer bg-brand-green/35 hover:bg-brand-sage hover:text-white text-brand-brown border-brand-green/50 hover:border-brand-sage group"
                title="키보드 단축키 안내 열기 (단축키: ?)"
                aria-label="키보드 단축키 안내 열기 (단축키: ?)"
              >
                <Keyboard className="w-4 h-4 text-brand-sage group-hover:text-white transition-transform group-hover:scale-110 duration-200" />
              </button>

              {/* 전체 사이트맵 & 관리자 모드 '+' 버튼 */}
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-2xs cursor-pointer group",
                  isSitemapOpen
                    ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                    : "bg-brand-green/35 hover:bg-brand-sage hover:text-white text-brand-brown border-brand-green/50 hover:border-brand-sage"
                )}
                title="전체 사이트맵 및 관리자 기능"
                aria-label="전체 사이트맵 및 관리자 메뉴 열기"
              >
                <Plus className="w-4 h-4 text-brand-sage group-hover:text-white transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            {/* Mobile Header Right Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              {/* 모바일 퀵 예약 CTA 버튼 */}
              <Link
                to="/reservation"
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95",
                  isReservationActive
                    ? "bg-brand-brown text-white"
                    : "bg-brand-sage text-white hover:bg-brand-sage/90"
                )}
                aria-label="상담 예약 및 오시는 길"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>예약</span>
              </Link>

              {/* 모바일 고대비 토글 버튼 */}
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={isHighContrast}
                aria-label={isHighContrast ? "고대비 모드 끄기 (현재 켜짐, 일반 모드로 전환)" : "고대비 모드 켜기 (현재 꺼짐, 텍스트 가독성 및 명도 대비 강화)"}
                title={isHighContrast ? "고대비 모드 켜짐 (일반 모드로 전환)" : "고대비 모드 (텍스트 가독성 강화)"}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95",
                  isHighContrast
                    ? "bg-brand-sage text-white border-brand-sage ring-2 ring-brand-sage/40 shadow-xs"
                    : "bg-brand-green/35 text-brand-brown border-brand-green/50 hover:bg-brand-sage hover:text-white"
                )}
              >
                <Contrast className={cn("w-4 h-4 transition-transform duration-300", isHighContrast ? "rotate-180 text-white" : "text-brand-sage")} />
              </button>

              {/* 모바일 전체 메뉴 토글 버튼 */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-brown hover:text-brand-sage transition-colors p-1 cursor-pointer"
                aria-label={isOpen ? "모바일 전체 메뉴 닫기" : "모바일 전체 메뉴 열기"}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Menu */}
        <div
          id="mobile-nav-menu"
          role="region"
          aria-label="모바일 네비게이션 메뉴"
          className={cn(
            "md:hidden absolute top-16 left-0 right-0 bg-brand-beige border-b border-brand-green/30 transition-all duration-300 ease-in-out overflow-hidden shadow-xl",
            isOpen ? "max-h-[46rem] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          <div className="px-4 pt-3 pb-6 space-y-1">
            {/* 1) 상담소 소개 */}
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 text-base font-medium rounded-xl transition-colors",
                location.pathname === '/about'
                  ? "bg-brand-green text-brand-sage font-bold"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              <span>상담소 소개</span>
              <ChevronRight className="w-4 h-4 text-brand-brown/40" />
            </Link>

            {/* 2) 상담사 소개 */}
            <Link
              to="/counselors"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 text-base font-medium rounded-xl transition-colors",
                location.pathname === '/counselors'
                  ? "bg-brand-green text-brand-sage font-bold"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              <span>상담사 소개</span>
              <ChevronRight className="w-4 h-4 text-brand-brown/40" />
            </Link>

            {/* 3) 상담 프로그램 */}
            <Link
              to="/programs"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 text-base font-medium rounded-xl transition-colors",
                location.pathname === '/programs'
                  ? "bg-brand-green text-brand-sage font-bold"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              <span>상담 프로그램</span>
              <ChevronRight className="w-4 h-4 text-brand-brown/40" />
            </Link>

            {/* 4) 자가진단 */}
            <Link
              to="/self-diagnosis"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 text-base font-medium rounded-xl transition-colors",
                location.pathname === '/self-diagnosis'
                  ? "bg-brand-green text-brand-sage font-bold"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              <div className="flex items-center gap-2">
                <span>자가진단</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-bold">
                  무료 척도 검사
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-brown/40" />
            </Link>

            {/* 5) 커뮤니티 */}
            <Link
              to="/community"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 text-base font-medium rounded-xl transition-colors",
                location.pathname === '/community'
                  ? "bg-brand-green text-brand-sage font-bold"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              <span>커뮤니티 (후기 & 칼럼)</span>
              <ChevronRight className="w-4 h-4 text-brand-brown/40" />
            </Link>

            {/* 6) 예약 / 오시는 길 (커뮤니티 바로 다음 위치!) */}
            <div className="pt-2 pb-1">
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm",
                  isReservationActive
                    ? "bg-brand-brown text-white ring-2 ring-brand-brown/40"
                    : "bg-brand-sage hover:bg-brand-sage/90 text-white"
                )}
              >
                <Calendar className="w-4 h-4" />
                <span>예약 / 오시는 길</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* 7) 예약 상태 조회 (Check Reservation Status) */}
            <div className="pt-0.5 pb-1">
              <Link
                to="/reservation/status"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full py-2.5 px-3.5 rounded-xl font-semibold flex items-center justify-between transition-all text-xs sm:text-sm border",
                  isStatusActive
                    ? "bg-brand-green/45 text-brand-sage border-brand-sage font-bold"
                    : "bg-white/75 text-brand-brown/85 hover:bg-brand-green/30 border-brand-green/30"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-brand-sage/15 text-brand-sage flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold leading-tight">예약 상태 조회</span>
                    <span className="block text-[10px] text-brand-brown/60 font-normal">
                      휴대폰 번호로 접수 내역 및 확정 확인
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-brown/40" />
              </Link>
            </div>

            {/* Mobile Utilities Divider */}
            <div className="pt-3 mt-3 border-t border-brand-green/20 space-y-2">
              {/* 모바일 고대비 모드 옵션 카드 */}
              <div className="px-3.5 py-2.5 rounded-xl bg-white/70 border border-brand-green/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isHighContrast ? "bg-brand-sage text-white shadow-xs" : "bg-brand-green/40 text-brand-sage"
                  )}>
                    <Contrast className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-brown flex items-center gap-2">
                      <span>고대비 모드</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-bold leading-none",
                        isHighContrast ? "bg-brand-sage text-white" : "bg-brand-brown/10 text-brand-brown/70"
                      )}>
                        {isHighContrast ? '적용중 (ON)' : '해제됨 (OFF)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-brown/70 leading-tight mt-0.5">
                      명도 대비를 높여 텍스트 가독성을 강화합니다
                    </p>
                  </div>
                </div>

                {/* Accessible Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isHighContrast}
                  aria-label={isHighContrast ? "고대비 모드 끄기 (현재 켜짐, 일반 모드로 전환)" : "고대비 모드 켜기 (현재 꺼짐, 텍스트 가독성 강화)"}
                  onClick={toggleHighContrast}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                    isHighContrast ? "bg-brand-sage" : "bg-brand-brown/20"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                      isHighContrast ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* 모바일 키보드 단축키 안내 열기 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  toggleHelpModal();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white/70 border border-brand-green/40 text-brand-brown hover:bg-brand-green/30 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-brand-green/50 flex items-center justify-center">
                    <Keyboard className="w-3.5 h-3.5 text-brand-sage" />
                  </div>
                  <div>
                    <span>키보드 단축키 전체 안내</span>
                    <span className="text-[10px] text-brand-brown/60 block font-normal">
                      1: 홈, 2: 소개, 3: 상담사, 4: 프로그램, 6: 커뮤니티, 7: 예약
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-brown/50" />
              </button>

              {/* 전체 사이트맵 및 관리자 모드 버튼 */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsSitemapOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-brand-green/30 text-brand-brown hover:bg-brand-green/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-sage/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-brand-sage" />
                  </div>
                  <span>더보기 (전체 사이트맵 & 관리자 모드)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-brown/50" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 전체 사이트맵 및 관리자 모달 */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
      />
    </>
  );
}
