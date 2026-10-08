import React from 'react';
import { cn } from '../lib/utils';

export interface OfficialLogoProps {
  className?: string;
  inverted?: boolean;
  showText?: boolean;
  showSubtext?: boolean;
}

export default function OfficialLogo({
  className,
  inverted = false,
  showText = true,
  showSubtext = true,
}: OfficialLogoProps) {
  const symbolFill = inverted ? '#38B29C' : '#237A68';
  const cutoutFill = inverted ? '#3C271C' : '#FFFFFF';
  const circleBg = inverted ? 'rgba(255, 255, 255, 0.08)' : 'rgba(35, 122, 104, 0.08)';
  const circleStroke = inverted ? 'rgba(255, 255, 255, 0.25)' : '#237A68';
  const circleStrokeOpacity = inverted ? 0.3 : 0.35;

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* 공식 심볼 마크 (클로버 & 치유와 공감의 사람 형상 음각) */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto aspect-square shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* 부드러운 원형 배경 */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={circleBg}
          stroke={circleStroke}
          strokeWidth="2"
          strokeOpacity={circleStrokeOpacity}
        />

        {/* 공식 3엽 클로버 및 줄기 */}
        <g fill={symbolFill}>
          {/* 상단 잎 */}
          <path d="M 50 49 C 45 41, 31 35, 31 23 C 31 11.5, 42 9.5, 50 17.5 C 58 9.5, 69 11.5, 69 23 C 69 35, 55 41, 50 49 Z" />

          {/* 좌하단 잎 */}
          <path d="M 48 51 C 41 45, 33 32, 21 33 C 10 34, 9 46, 17 53 C 9 61, 12 72, 23 72 C 34 71, 41 57, 48 51 Z" />

          {/* 우하단 잎 */}
          <path d="M 52 51 C 59 45, 67 32, 79 33 C 90 34, 91 46, 83 53 C 91 61, 88 72, 77 72 C 66 71, 59 57, 52 51 Z" />

          {/* 중심 결합 원 */}
          <circle cx="50" cy="50" r="11" />

          {/* 아래로 뻗는 자연 줄기 */}
          <path d="M 49 57 C 47 70, 41 83, 25 91 C 31 84, 41 73, 45 60 Z" />
        </g>

        {/* 상단 잎 사람 형상 음각 (내담자의 평온과 안식) */}
        <circle cx="50" cy="23.5" r="4.3" fill={cutoutFill} />
        <path
          d="M 47.8 29.8 C 46.5 35, 43.5 42, 40.8 48 C 45.8 46.2, 54.2 46.2, 59.2 48 C 56.5 42, 53.5 35, 52.2 29.8 Z"
          fill={cutoutFill}
        />
      </svg>

      {/* 로고 워드마크 서체 규격 */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-serif font-extrabold text-base sm:text-lg tracking-tight leading-none",
                inverted ? "text-brand-beige" : "text-brand-brown"
              )}
            >
              행복바람
            </span>
            <span
              className={cn(
                "text-[10px] sm:text-[11px] font-bold tracking-normal leading-none",
                inverted ? "text-emerald-300" : "text-brand-sage"
              )}
            >
              심리상담연구소
            </span>
          </div>
          {showSubtext && (
            <span
              className={cn(
                "text-[8.5px] sm:text-[9px] tracking-wider uppercase font-sans mt-0.5 leading-none",
                inverted ? "text-brand-beige/50" : "text-brand-brown/50"
              )}
            >
              Happy Wind Counseling Center
            </span>
          )}
        </div>
      )}
    </div>
  );
}
