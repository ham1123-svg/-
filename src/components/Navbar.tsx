import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
          <div className="hidden md:flex space-x-8">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-brown hover:text-brand-sage transition-colors"
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
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
                  ? "bg-brand-green text-brand-sage"
                  : "text-brand-brown hover:bg-brand-green/30"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
