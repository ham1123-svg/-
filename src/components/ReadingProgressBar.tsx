import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

// Routes considered long-form content pages where reading progress enhances UX
const LONG_FORM_ROUTES = [
  '/guide',
  '/community',
  '/about',
  '/confidentiality',
  '/privacy',
  '/terms',
  '/programs',
];

export default function ReadingProgressBar() {
  const location = useLocation();
  const { isHighContrast } = useHighContrast();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Check if current route is a long-form page
  const isLongFormPage = LONG_FORM_ROUTES.includes(location.pathname);

  const calculateProgress = useCallback(() => {
    if (!isLongFormPage) {
      setIsVisible(false);
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const totalDocScrollLength = scrollHeight - clientHeight;

    if (totalDocScrollLength <= 60) {
      // Content is short enough that no significant scroll is needed
      setIsVisible(false);
      setReadingProgress(0);
      return;
    }

    setIsVisible(true);
    const currentProgress = Math.min(
      100,
      Math.max(0, (scrollTop / totalDocScrollLength) * 100)
    );

    setReadingProgress(currentProgress);

    // Indicator for active scrolling
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 1200);
  }, [isLongFormPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculateProgress);
    };

    const handleResize = () => {
      calculateProgress();
    };

    // Calculate immediately on mount or route change
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [calculateProgress, location.pathname]);

  if (!isLongFormPage || !isVisible) {
    return null;
  }

  const roundedPercentage = Math.round(readingProgress);

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 pointer-events-none transition-opacity duration-300"
      aria-hidden="true"
    >
      {/* Background Track */}
      <div 
        role="progressbar"
        aria-label="콘텐츠 읽기 진행률"
        aria-valuenow={roundedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full h-[3.5px] bg-brand-green/20 backdrop-blur-xs relative overflow-hidden",
          isHighContrast && "h-[4.5px] bg-black/40 border-b border-black/80"
        )}
      >
        {/* Progress Fill Bar */}
        <div
          className={cn(
            "h-full transition-[width] duration-150 ease-out",
            isHighContrast
              ? "bg-[#2d5a27] font-bold"
              : "bg-gradient-to-r from-brand-sage via-brand-accent to-brand-sage"
          )}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating subtle reading percentage badge (shows while scrolling or past 0%) */}
      <div
        className={cn(
          "absolute right-4 top-1.5 transition-all duration-300 transform",
          isScrolling && readingProgress > 2
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        )}
      >
        <span
          className={cn(
            "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs border backdrop-blur-md select-none",
            isHighContrast
              ? "bg-black text-white border-white/60"
              : "bg-white/95 text-brand-brown/80 border-brand-green/40 text-brand-sage"
          )}
        >
          {roundedPercentage === 100 ? '완독 100%' : `읽는 중 ${roundedPercentage}%`}
        </span>
      </div>
    </div>
  );
}
