import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import SitemapModal from './SitemapModal';

const navItems = [
  { name: '상담소 소개', path: '/about' },
  { name: '상담사 소개', path: '/counselors' },
  { name: '프로그램', path: '/programs' },
  { name: '자가진단', path: '/self-diagnosis' },
  { name: '상담 안내', path: '/guide' },
  { name: '커뮤니티', path: '/community' },
  { name: '예약/오시는 길', path: '/reservation' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-beige/80 backdrop-blur-md border-b border-brand-green/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-brand-brown font-serif text-xl font-bold">
              행복바람<span className="text-brand-sage">심리상담연구소</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-7">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-brand-sage",
                    location.pathname === item.path ? "text-brand-sage" : "text-brand-brown/70"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* '+' 아이콘 버튼 (전체 사이트맵 & 관리자 모드) */}
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-2xs ml-2 cursor-pointer group",
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

            {/* Mobile Right Controls */}
            <div className="flex items-center gap-2 md:hidden">
              {/* 모바일 '+' 아이콘 버튼 */}
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 group",
                  isSitemapOpen
                    ? "bg-brand-sage text-white border-brand-sage"
                    : "bg-brand-green/35 text-brand-brown border-brand-green/50 hover:bg-brand-sage hover:text-white"
                )}
                title="전체 사이트맵 및 관리자 기능"
                aria-label="전체 사이트맵 및 관리자 메뉴 열기"
              >
                <Plus className="w-4 h-4 text-brand-sage group-hover:text-white" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-brown hover:text-brand-sage transition-colors p-1 cursor-pointer"
                aria-label="메뉴 열기"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "md:hidden absolute top-16 left-0 right-0 bg-brand-beige border-b border-brand-green/30 transition-all duration-300 ease-in-out overflow-hidden",
            isOpen ? "max-h-[30rem] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 text-base font-medium rounded-md",
                  location.pathname === item.path
                    ? "bg-brand-green text-brand-sage font-bold"
                    : "text-brand-brown hover:bg-brand-green/30"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-brand-green/20">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsSitemapOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-3 text-base font-semibold rounded-md bg-brand-green/30 text-brand-brown hover:bg-brand-green/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
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
