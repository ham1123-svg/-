import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: '상담소 소개', path: '/about' },
  { name: '상담사 소개', path: '/counselors' },
  { name: '프로그램', path: '/programs' },
  { name: '상담 안내', path: '/guide' },
  { name: '커뮤니티', path: '/community' },
  { name: '예약/오시는 길', path: '/reservation' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-beige/80 backdrop-blur-md border-b border-brand-green/30">
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

            {/* 관리자 버튼 (우측 상단) */}
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs ml-2",
                location.pathname === '/admin'
                  ? "bg-brand-sage text-white border-brand-sage shadow-sm"
                  : "bg-brand-green/30 hover:bg-brand-sage hover:text-white text-brand-brown border-brand-green/40 hover:border-brand-sage"
              )}
              title="운영자 관리 모드 (예약 접수 확인)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-sage group-hover:text-white" />
              <span>관리자</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                location.pathname === '/admin'
                  ? "bg-brand-sage text-white border-brand-sage"
                  : "bg-brand-green/30 text-brand-brown border-brand-green/40"
              )}
              title="관리자"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-sage" />
              <span>관리자</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-brown hover:text-brand-sage transition-colors p-1"
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
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-3 text-base font-semibold rounded-md",
                location.pathname === '/admin'
                  ? "bg-brand-green text-brand-sage"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              <ShieldCheck className="w-4 h-4 text-brand-sage" />
              <span>운영자 모드 (예약 접수 관리)</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
