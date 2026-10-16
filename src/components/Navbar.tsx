import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Plus, ChevronRight, ChevronDown, Contrast, 
  Keyboard, Calendar, ArrowRight, Search, PhoneCall,
  Wind, User, Users, Heart, BookOpen, Activity, 
  Layers, Brain, ClipboardList, ShieldCheck, HelpCircle,
  Bell, FileText, Star, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import SitemapModal from './SitemapModal';
import { useHighContrast } from '../context/HighContrastContext';
import { useKeyboardShortcuts } from '../context/KeyboardShortcutsContext';

export interface SubMenuItem {
  name: string;
  path: string;
  desc: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface NavCategory {
  id: string;
  name: string;
  path: string;
  subItems: SubMenuItem[];
}

// 2-Depth Information Architecture Menu Definition
export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: 'about',
    name: '연구소 소개',
    path: '/about',
    subItems: [
      { 
        name: '인사말 및 비전', 
        path: '/about#vision', 
        desc: '소장 인사말, 설립 이념, 상담 철학',
        icon: <Wind className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '전문가 소개', 
        path: '/counselors', 
        desc: '상담사 프로필, 공인 자격증, 연구/임상 경력',
        icon: <User className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '내부 공간 안내', 
        path: '/about#facilities', 
        desc: '상담실, 대기 공간, 심리검사실 사진 갤러리',
        icon: <Sparkles className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '오시는 길', 
        path: '/about#location', 
        desc: '위치 지도(네이버/카카오 연동), 대중교통/주차 안내',
        icon: <ChevronRight className="w-4 h-4 text-brand-sage" />
      },
    ]
  },
  {
    id: 'counseling',
    name: '심리상담',
    path: '/programs',
    subItems: [
      { 
        name: '개인상담 (성인)', 
        path: '/programs?category=개인상담#adult', 
        desc: '우울, 불안, 공황, 대인관계, 번아웃, 자존감 회복',
        icon: <User className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '청소년·아동상담', 
        path: '/programs?category=개인상담#youth', 
        desc: '학업 스트레스, 교우관계, 정서행동 문제, 부모 코칭',
        icon: <Heart className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '부부·가족상담', 
        path: '/programs?category=부부상담#family', 
        desc: '부부 갈등, 의사소통 개선, 가족 관계 회복',
        icon: <Users className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '집단상담', 
        path: '/programs?category=집단/교육#group', 
        desc: '소그룹 테마별 워크숍, 감정 조절 및 힐링 프로그램',
        icon: <Layers className="w-4 h-4 text-brand-sage" />
      },
    ]
  },
  {
    id: 'assessment',
    name: '심리평가/검사',
    path: '/assessment',
    subItems: [
      { 
        name: '종합심리평가', 
        path: '/assessment#full-battery', 
        desc: '인지·정서·성격 전반 평가 (풀배터리 검사 안내)',
        icon: <Brain className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '성격 및 기질 검사', 
        path: '/assessment#personality', 
        desc: 'TCI, MBTI, MMPI-2 등 객관적 성격 검사',
        icon: <Layers className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '정서 및 스트레스 평가', 
        path: '/assessment#stress', 
        desc: '스트레스 지수, 우울/불안 척도 (3분 자가진단 연계)',
        icon: <Activity className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '검사 진행 절차', 
        path: '/assessment#process', 
        desc: '접수 → 본 검사 → 결과 상담 및 보고서 수령 절차',
        icon: <ClipboardList className="w-4 h-4 text-brand-sage" />
      },
    ]
  },
  {
    id: 'reservation-guide',
    name: '상담 예약/안내',
    path: '/guide',
    subItems: [
      { 
        name: '상담 절차 및 비용', 
        path: '/guide#pricing', 
        desc: '초기 접수면담부터 종결까지 프로세스, 상담료 안내',
        icon: <ClipboardList className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '실시간 예약 신청', 
        path: '/reservation', 
        desc: '온라인 예약 폼 (희망 일시, 상담 분야 선택, 간이 문진)',
        icon: <Calendar className="w-4 h-4 text-brand-sage" />,
        badge: '추천'
      },
      { 
        name: '비밀보장 원칙', 
        path: '/confidentiality', 
        desc: '개인정보 및 상담 내용 윤리 규정 준수 서약 안내',
        icon: <ShieldCheck className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '자주 묻는 질문(FAQ)', 
        path: '/guide#faq', 
        desc: '상담 기간, 예약 취소/변경 규정, 준비사항 등',
        icon: <HelpCircle className="w-4 h-4 text-brand-sage" />
      },
    ]
  },
  {
    id: 'community',
    name: '커뮤니티',
    path: '/community',
    subItems: [
      { 
        name: '공지사항', 
        path: '/community?tab=notice', 
        desc: '운영 일정, 특강/세미나 일정, 휴진 안내',
        icon: <Bell className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '마음 칼럼', 
        path: '/community?tab=column', 
        desc: '소장 및 상담진의 심리학 칼럼, 마음 건강 정보',
        icon: <FileText className="w-4 h-4 text-brand-sage" />
      },
      { 
        name: '상담 후기', 
        path: '/community?tab=review', 
        desc: '내담자 익명 후기 및 변화 스토리 (비식별화 적용)',
        icon: <Star className="w-4 h-4 text-brand-sage" />
      },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const location = useLocation();
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const { toggleHelpModal } = useKeyboardShortcuts();
  const dropdownTimeoutRef = useRef<number | null>(null);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, location.hash]);

  const handleMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) {
      window.clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const isReservationActive = location.pathname === '/reservation';
  const isStatusActive = location.pathname === '/reservation/status' || location.pathname === '/reservation-status';

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-40 bg-brand-beige/90 backdrop-blur-md border-b border-brand-green/30"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-2">
            
            {/* Brand Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 shrink-0 group py-1 transition-transform duration-200 hover:scale-[1.01]"
              aria-label="행복바람 심리상담연구소 홈으로 이동"
            >
              <span className="text-xl sm:text-2xl font-serif font-bold text-brand-brown tracking-tight">
                행복바람<span className="text-brand-sage">심리상담연구소</span>
              </span>
            </Link>

            {/* Desktop 2-Depth GNB Navigation */}
            <div className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="데스크톱 주 메뉴">
              {NAV_CATEGORIES.map((category) => {
                const isCatActive = location.pathname === category.path || 
                  category.subItems.some(sub => location.pathname === sub.path.split('?')[0].split('#')[0]);
                const isDropdownOpen = activeDropdown === category.id;

                return (
                  <div 
                    key={category.id} 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.id)}
                  >
                    <Link
                      to={category.path}
                      aria-expanded={isDropdownOpen}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer select-none inline-flex items-center gap-1",
                        isCatActive
                          ? "text-brand-sage font-bold bg-brand-green/30"
                          : "text-brand-brown/80 hover:text-brand-sage hover:bg-brand-green/20",
                        isDropdownOpen && "bg-brand-green/25 text-brand-sage"
                      )}
                    >
                      <span>{category.name}</span>
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200 text-brand-brown/40",
                        isDropdownOpen && "rotate-180 text-brand-sage"
                      )} />
                    </Link>

                    {/* 2-Depth Dropdown Menu Card */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                          className="absolute left-0 top-full pt-2 w-72 z-50 pointer-events-auto"
                          onMouseEnter={() => handleMouseEnter(category.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="rounded-2xl bg-white shadow-xl border border-brand-green/30 p-2 overflow-hidden">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-brand-sage border-b border-brand-green/20 flex items-center justify-between">
                              <span>{category.name} 상세 메뉴</span>
                              <Link 
                                to={category.path}
                                className="text-[10px] text-brand-brown/50 hover:text-brand-sage font-normal"
                              >
                                전체보기 &rarr;
                              </Link>
                            </div>
                            <div className="py-1 space-y-0.5">
                              {category.subItems.map((sub, idx) => {
                                return (
                                  <Link
                                    key={idx}
                                    to={sub.path}
                                    onClick={() => setActiveDropdown(null)}
                                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-brand-green/15 transition-colors group text-left"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-brand-beige/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-sage group-hover:text-white transition-colors">
                                      {sub.icon || <ChevronRight className="w-3.5 h-3.5 text-brand-sage group-hover:text-white" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold text-xs text-brand-brown group-hover:text-brand-sage flex items-center gap-1.5">
                                        <span>{sub.name}</span>
                                        {sub.badge && (
                                          <span className="px-1.5 py-0.2 rounded-md bg-brand-sage/15 text-brand-sage text-[10px] font-normal">
                                            {sub.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-brand-brown/60 leading-tight line-clamp-1 mt-0.5 font-serif">
                                        {sub.desc}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Header Right Area: Persistent High-Visibility CTA & Utilities */}
            <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
              
              {/* Quick Status Check ('예약 조회') */}
              <Link
                to="/reservation/status"
                aria-label="휴대폰 번호로 예약 내역 조회"
                className={cn(
                  "hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none",
                  isStatusActive
                    ? "text-brand-sage font-bold bg-brand-green/35 ring-1 ring-brand-sage/30"
                    : "text-brand-brown/70 hover:text-brand-sage hover:bg-brand-green/20"
                )}
                title="휴대폰 번호로 예약 진행 상태 조회"
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>예약 조회</span>
              </Link>

              {/* Direct Telephone Inquiry Link */}
              <a
                href="tel:052-254-0230"
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-brand-brown/75 hover:text-brand-sage hover:bg-brand-green/20 transition-all"
                title="전화 상담 및 예약 문의"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-sage" />
                <span className="font-bold">052-254-0230</span>
              </a>

              {/* [필수 권장사항] 상단 헤더(GNB) 고정 예약 버튼(CTA) */}
              <Link
                to="/reservation"
                aria-label="온라인 상담 예약하기 페이지로 이동"
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-2 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer select-none active:scale-95",
                  isReservationActive
                    ? "bg-brand-brown text-white ring-2 ring-brand-brown/40 shadow-sm"
                    : "bg-brand-sage text-white hover:bg-brand-sage/95 ring-2 ring-brand-sage/20 shadow-brand-sage/20"
                )}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="tracking-tight">상담 예약하기</span>
              </Link>

              {/* Divider before utility icons */}
              <div className="h-4 w-px bg-brand-green/50 mx-1" />

              {/* 고대비 모드 토글 버튼 */}
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={isHighContrast}
                aria-label={isHighContrast ? "고대비 모드 끄기" : "고대비 모드 켜기"}
                title={isHighContrast ? "고대비 모드 켜짐" : "고대비 모드 (텍스트 가독성 강화)"}
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs cursor-pointer select-none",
                  isHighContrast
                    ? "bg-brand-sage text-white border-brand-sage ring-2 ring-brand-sage/40"
                    : "bg-white/80 hover:bg-brand-green/40 text-brand-brown border-brand-green/60"
                )}
              >
                <Contrast className={cn("w-3.5 h-3.5", isHighContrast ? "rotate-180 text-white" : "text-brand-sage")} />
                <span className="text-[10px] hidden xl:inline">{isHighContrast ? 'ON' : '대비'}</span>
              </button>

              {/* 키보드 단축키 안내 버튼 */}
              <button
                type="button"
                onClick={toggleHelpModal}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-2xs cursor-pointer bg-brand-green/35 hover:bg-brand-sage hover:text-white text-brand-brown border-brand-green/50"
                title="키보드 단축키 안내 (단축키: ?)"
                aria-label="키보드 단축키 안내 열기"
              >
                <Keyboard className="w-4 h-4 text-brand-sage hover:text-white" />
              </button>

              {/* 전체 사이트맵 '+' 버튼 */}
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-2xs cursor-pointer bg-brand-green/35 hover:bg-brand-sage hover:text-white text-brand-brown border-brand-green/50"
                title="전체 2-Depth 사이트맵 및 관리자 기능"
                aria-label="전체 사이트맵 열기"
              >
                <Plus className="w-4 h-4 text-brand-sage hover:text-white" />
              </button>
            </div>

            {/* Mobile Header Right Controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              {/* 모바일 퀵 예약 CTA 버튼 */}
              <Link
                to="/reservation"
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95",
                  isReservationActive
                    ? "bg-brand-brown text-white"
                    : "bg-brand-sage text-white hover:bg-brand-sage/90"
                )}
                aria-label="상담 예약 신청하기"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>예약하기</span>
              </Link>

              {/* 모바일 고대비 토글 */}
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={isHighContrast}
                className={cn(
                  "w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95",
                  isHighContrast
                    ? "bg-brand-sage text-white border-brand-sage"
                    : "bg-brand-green/35 text-brand-brown border-brand-green/50"
                )}
                title="고대비 모드"
              >
                <Contrast className={cn("w-4 h-4", isHighContrast ? "rotate-180 text-white" : "text-brand-sage")} />
              </button>

              {/* 모바일 전체 메뉴 토글 버튼 */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-brand-brown hover:text-brand-sage hover:bg-brand-green/30 transition-colors cursor-pointer active:scale-95"
                aria-label={isOpen ? "모바일 메뉴 닫기" : "모바일 2-Depth 메뉴 열기"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-brand-brown" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-Down 2-Depth Navigation Drawer */}
        <div
          id="mobile-nav-menu"
          role="region"
          aria-label="모바일 네비게이션 메뉴"
          className={cn(
            "lg:hidden absolute top-16 left-0 right-0 bg-brand-beige border-b border-brand-green/30 transition-all duration-300 ease-in-out overflow-y-auto max-h-[85vh] shadow-2xl",
            isOpen ? "opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          <div className="p-4 space-y-2">
            
            {/* 5 Main Categories with Accordion */}
            {NAV_CATEGORIES.map((category) => {
              const isExpanded = mobileExpandedCat === category.id;
              const isCatActive = location.pathname === category.path;

              return (
                <div 
                  key={category.id}
                  className="rounded-2xl bg-white/70 border border-brand-green/30 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(isExpanded ? null : category.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 text-left font-serif font-bold text-base transition-colors",
                      isCatActive ? "text-brand-sage bg-brand-green/20" : "text-brand-brown"
                    )}
                  >
                    <span>{category.name}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-brand-brown/50 transition-transform duration-200",
                      isExpanded && "rotate-180 text-brand-sage"
                    )} />
                  </button>

                  {/* 2-Depth Sub-items Accordion Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-brand-green/20 bg-brand-beige/30 p-2 space-y-1"
                      >
                        {category.subItems.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            to={sub.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white transition-colors"
                          >
                            <div className="w-6 h-6 rounded-md bg-brand-green/40 flex items-center justify-center shrink-0 mt-0.5">
                              {sub.icon || <ChevronRight className="w-3.5 h-3.5 text-brand-sage" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs text-brand-brown flex items-center gap-1.5">
                                <span>{sub.name}</span>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.2 rounded bg-brand-sage/20 text-brand-sage text-[9px]">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-brand-brown/60 leading-tight mt-0.5 font-serif">
                                {sub.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Mobile Fixed Conversion Action Banner */}
            <div className="pt-2 space-y-2">
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 px-4 rounded-2xl bg-brand-sage text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
              >
                <Calendar className="w-4 h-4" />
                <span>온라인 실시간 상담 예약하기</span>
              </Link>
              
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:052-254-0230"
                  className="py-2.5 px-3 rounded-xl bg-white border border-brand-green/40 text-brand-brown font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-brand-sage" />
                  <span>052-254-0230</span>
                </a>
                <Link
                  to="/reservation/status"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-brand-green/40 text-brand-brown font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5 text-brand-sage" />
                  <span>예약 상태 조회</span>
                </Link>
              </div>
            </div>

            {/* Extra Utilities (Sitemap & Keyboard Shortcuts) */}
            <div className="pt-2 border-t border-brand-green/20 flex items-center justify-between text-xs text-brand-brown/70 px-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsSitemapOpen(true);
                }}
                className="hover:text-brand-sage font-medium cursor-pointer"
              >
                전체 사이트맵
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  toggleHelpModal();
                }}
                className="hover:text-brand-sage font-medium cursor-pointer"
              >
                키보드 단축키 안내
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* 전체 사이트맵 모달 */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
      />
    </>
  );
}
