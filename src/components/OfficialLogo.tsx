import React from 'react';
import { cn } from '../lib/utils';
import { BRAND_ASSETS } from '../lib/brandAssets';

export interface OfficialLogoProps {
  className?: string;
  inverted?: boolean;
  showText?: boolean;
  showSubtext?: boolean;
  variant?: 'symbol' | 'full' | 'combined';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function OfficialLogo({
  className,
  inverted = false,
  showText = true,
  showSubtext = true,
  variant = 'combined',
  size = 'md',
}: OfficialLogoProps) {
  // If variant is purely 'full', display the official full signature logo image
  if (variant === 'full') {
    return (
      <div className={cn("inline-flex items-center justify-center select-none", className)}>
        <img
          src={BRAND_ASSETS.LOGO_FULL}
          alt="행복바람 심리상담연구소 공식 로고 (시그니처)"
          className="w-full h-auto object-contain"
        />
      </div>
    );
  }

  // Size mapping for symbol container
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
    xl: "w-20 h-20 sm:w-24 sm:h-24",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* 공식 심볼 마크 (세잎클로버 & 치유와 공감의 사람 형상 음각) */}
      <div
        className={cn(
          "bg-transparent flex items-center justify-center shrink-0 transition-all",
          sizeClasses[size]
        )}
      >
        <img
          src={BRAND_ASSETS.LOGO_SYMBOL}
          alt="행복바람 심리상담연구소 공식 심볼 마크"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 로고 워드마크 서체 규격 */}
      {showText && (
        <div className="flex flex-col justify-center text-left leading-tight">
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-serif font-extrabold tracking-tight leading-none",
                size === 'sm' && "text-sm",
                size === 'md' && "text-base sm:text-lg",
                size === 'lg' && "text-xl sm:text-2xl",
                size === 'xl' && "text-2xl sm:text-3xl",
                inverted ? "text-brand-beige" : "text-brand-brown"
              )}
            >
              행복바람
            </span>
            <span
              className={cn(
                "font-bold tracking-normal leading-none",
                size === 'sm' && "text-[9px]",
                size === 'md' && "text-[10px] sm:text-[11px]",
                size === 'lg' && "text-xs sm:text-sm",
                size === 'xl' && "text-sm sm:text-base",
                inverted ? "text-emerald-300" : "text-brand-sage"
              )}
            >
              심리상담연구소
            </span>
          </div>
          {showSubtext && (
            <span
              className={cn(
                "tracking-wider uppercase font-sans mt-0.5 leading-none",
                size === 'sm' && "text-[7.5px]",
                size === 'md' && "text-[8.5px] sm:text-[9.5px]",
                size === 'lg' && "text-[10px]",
                size === 'xl' && "text-xs",
                inverted ? "text-brand-beige/50" : "text-brand-brown/50"
              )}
            >
              Happiness Wind Counseling Center
            </span>
          )}
        </div>
      )}
    </div>
  );
}
