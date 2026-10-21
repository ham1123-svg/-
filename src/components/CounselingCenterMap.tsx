import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Navigation, Car, Bus, Train, Phone, Copy, Check, 
  ExternalLink, Compass, ArrowRight, CheckCircle2, Lock, Unlock, Sparkles, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

export type MapProviderType = 'naver' | 'kakao' | 'google' | 'schematic';

interface CounselingCenterMapProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showReservationLink?: boolean;
  initialProvider?: MapProviderType;
}

// Brand SVG Icons
const NaverIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
  </svg>
);

const KakaoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.87 1.884 5.385 4.717 6.786l-1.189 4.364c-.104.383.336.688.66.455l5.215-3.468c.197.013.396.02.597.02 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
  </svg>
);

const GoogleMapsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
    <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
  </svg>
);

export default function CounselingCenterMap({
  className,
  title = "오시는 길 & 상담소 위치",
  subtitle = "울산 KTX 역세권 인근, 편안하고 아늑한 1:1 독립 상담실이 마련되어 있습니다.",
  showReservationLink = true,
  initialProvider = 'naver'
}: CounselingCenterMapProps) {
  const { isHighContrast } = useHighContrast();
  const [activeView, setActiveView] = useState<MapProviderType>(initialProvider);
  const [copied, setCopied] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const address = "울산광역시 울주군 삼남읍 도호1길 23 상가 408호";
  const roadAddress = "울산광역시 울주군 삼남읍 도호1길 23";
  const placeName = "행복바람 심리상담연구소";
  const phone = "052-254-0230";
  const lat = 35.5414;
  const lng = 129.1388;

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = address;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(roadAddress)}`;
  const naverDirectionsUrl = `https://map.naver.com/p/directions/-,/-/${lng},${lat},${encodeURIComponent(placeName)}/-/car`;
  const naverAppUrl = `nmap://search?query=${encodeURIComponent(roadAddress)}&appname=com.happywind.counseling`;

  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(roadAddress)}`;
  const kakaoDirectionsUrl = `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${lat},${lng}`;
  const kakaoAppUrl = `kakaomap://search?q=${encodeURIComponent(roadAddress)}`;

  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(roadAddress)}`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(roadAddress)}`;

  const handleSelectProvider = (provider: MapProviderType) => {
    setActiveView(provider);
    setIsMapInteractive(false);
    setIsIframeLoading(true);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sage/10 text-brand-sage text-xs font-bold rounded-full mb-3 border border-brand-sage/20">
          <MapPin className="w-3.5 h-3.5" />
          <span>LOCATION &amp; DIRECTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-brown mb-2.5">
          {title}
        </h2>
        <p className="text-brand-brown/70 font-serif text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Map Card Container */}
      <div 
        ref={mapContainerRef}
        className={cn(
          "rounded-3xl overflow-hidden shadow-xl border transition-all",
          isHighContrast 
            ? "bg-neutral-950 text-white border-2 border-white" 
            : "bg-white text-brand-brown border-brand-green/30"
        )}
      >
        
        {/* Address Strip & Map Provider Selector Tabs Bar */}
        <div className="p-4 sm:p-6 bg-brand-beige/30 border-b border-brand-green/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-sage text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="font-serif text-base sm:text-lg font-bold text-brand-brown">
                  {placeName}
                </strong>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-semibold">
                  상가 408호
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold hidden sm:inline-block">
                  KTX 울산역 5분
                </span>
              </div>
              <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                <p className="text-xs sm:text-sm text-brand-brown/85 font-serif select-all font-medium">
                  {address}
                </p>
                
                {/* Copy Address Button next to office address text */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 border",
                    copied
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200"
                      : "bg-white hover:bg-brand-sage/10 text-brand-brown border-brand-green/40 hover:border-brand-sage hover:text-brand-sage"
                  )}
                  aria-label="상담소 주소 복사하기"
                  title="주소를 클립보드에 복사"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white animate-scale-in" />
                      <span className="font-bold">복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-brand-sage" />
                      <span>주소 복사</span>
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>클립보드에 복사되었습니다</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Map Service Selector Tabs (Naver, Kakao, Google, Schematic) */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <div 
              role="tablist" 
              aria-label="지도 서비스 선택" 
              className="inline-flex p-1 rounded-xl bg-brand-beige/60 border border-brand-green/30 shadow-2xs flex-wrap gap-1"
            >
              {/* Naver Map Tab */}
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'naver'}
                onClick={() => handleSelectProvider('naver')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  activeView === 'naver'
                    ? "bg-[#03C75A] text-white shadow-xs scale-102"
                    : "text-brand-brown/70 hover:text-[#03C75A] hover:bg-white/60"
                )}
              >
                <NaverIcon className="w-3.5 h-3.5" />
                <span>네이버 지도</span>
              </button>

              {/* Kakao Map Tab */}
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'kakao'}
                onClick={() => handleSelectProvider('kakao')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  activeView === 'kakao'
                    ? "bg-[#FEE500] text-[#191919] shadow-xs font-extrabold scale-102"
                    : "text-brand-brown/70 hover:text-amber-800 hover:bg-white/60"
                )}
              >
                <KakaoIcon className="w-3.5 h-3.5" />
                <span>카카오맵</span>
              </button>

              {/* Google Map Tab */}
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'google'}
                onClick={() => handleSelectProvider('google')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  activeView === 'google'
                    ? "bg-[#4285F4] text-white shadow-xs scale-102"
                    : "text-brand-brown/70 hover:text-[#4285F4] hover:bg-white/60"
                )}
              >
                <GoogleMapsIcon className="w-3.5 h-3.5" />
                <span>구글 맵</span>
              </button>

              {/* Schematic Guide Tab */}
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'schematic'}
                onClick={() => handleSelectProvider('schematic')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  activeView === 'schematic'
                    ? "bg-brand-sage text-white shadow-xs scale-102"
                    : "text-brand-brown/70 hover:text-brand-brown hover:bg-white/60"
                )}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>직관 약도</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Map Area */}
        <div className="relative w-full h-[380px] sm:h-[430px] bg-brand-beige/20 overflow-hidden">
          
          {/* PROVIDERS 1-3: NAVER / KAKAO / GOOGLE MAP VIEW */}
          {activeView !== 'schematic' && (
            <div className="w-full h-full relative flex flex-col">
              {!isMapInteractive ? (
                /* 1. Fast Lightweight Map Preview Mode (Zero-lag, 60fps mobile scroll, instant load) */
                <div className="w-full h-full relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#fbfdfc] via-[#f4f8f5] to-[#ebf3ee] select-none">
                  {/* Stylized vector map background canvas/SVG with roads and greens */}
                  <svg 
                    className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="map-preview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e4dc" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-preview-grid)" />
                    {/* Samnam-ro Main Road */}
                    <path d="M -20,180 Q 250,210 550,185 T 1200,200" fill="none" stroke="#c8ddd3" strokeWidth="26" strokeLinecap="round" />
                    <path d="M -20,180 Q 250,210 550,185 T 1200,200" fill="none" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" />
                    {/* Doho 1-gil Access Road */}
                    <path d="M 420,-20 L 440,480" fill="none" stroke="#c8ddd3" strokeWidth="22" strokeLinecap="round" />
                    <path d="M 420,-20 L 440,480" fill="none" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
                    {/* Station Connecting Road */}
                    <path d="M 100,340 L 750,300" fill="none" stroke="#d9e9e1" strokeWidth="14" strokeDasharray="6,6" strokeLinecap="round" />
                    {/* Green Parks */}
                    <rect x="50" y="30" width="180" height="100" rx="20" fill="#e2f0e8" opacity="0.9" />
                    <rect x="540" y="60" width="240" height="110" rx="24" fill="#e2f0e8" opacity="0.9" />
                  </svg>

                  {/* Provider Header Overlay */}
                  <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs p-2 px-3 rounded-2xl shadow-sm border border-brand-green/20 max-w-[calc(100%-40px)] sm:max-w-none">
                      <div className={cn(
                        "w-6 h-6 rounded-lg text-white flex items-center justify-center shrink-0 shadow-2xs",
                        activeView === 'naver' && "bg-[#03C75A]",
                        activeView === 'kakao' && "bg-[#FEE500] text-[#191919]",
                        activeView === 'google' && "bg-[#4285F4]"
                      )}>
                        {activeView === 'naver' && <NaverIcon className="w-3.5 h-3.5" />}
                        {activeView === 'kakao' && <KakaoIcon className="w-3.5 h-3.5" />}
                        {activeView === 'google' && <GoogleMapsIcon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "font-extrabold text-[11px] tracking-wide",
                            activeView === 'naver' && "text-[#03C75A]",
                            activeView === 'kakao' && "text-amber-900",
                            activeView === 'google' && "text-[#4285F4]"
                          )}>
                            {activeView === 'naver' ? 'NAVER 지도' : activeView === 'kakao' ? 'kakaomap' : 'Google 지도'}
                          </span>
                          <span className="text-[10px] text-brand-brown/40">•</span>
                          <span className="font-bold text-brand-brown text-xs truncate">행복바람 심리상담연구소</span>
                        </div>
                        <p className="text-[11px] text-brand-brown/70 font-serif truncate">
                          울산 울주군 삼남읍 도호1길 23 (상가 408호)
                        </p>
                      </div>
                    </div>

                    {/* Performance Badge */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 text-brand-sage font-bold text-xs border border-brand-green/20 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
                      <span>모바일 고속 스크롤 최적화</span>
                    </div>
                  </div>

                  {/* Center Location Pin & Interactive Activation CTA */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto space-y-3">
                    {/* Pin Marker */}
                    <div className="flex flex-col items-center">
                      <div className="px-4 py-2 rounded-2xl bg-white shadow-xl border-2 border-brand-sage text-xs font-bold text-brand-brown flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-serif font-extrabold text-sm text-brand-brown">행복바람 심리상담연구소</span>
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">408호</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-brand-sage text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Transit Badges */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-[11px] font-semibold text-brand-brown/80 border border-brand-green/20 shadow-2xs flex-wrap justify-center">
                      <span>🚄 KTX 울산역 차량 5분</span>
                      <span className="text-brand-brown/30 hidden sm:inline">•</span>
                      <span>🏢 삼남읍사무소 도보 3분</span>
                      <span className="text-brand-brown/30 hidden sm:inline">•</span>
                      <span>🅿️ 무료 주차 완비</span>
                    </div>

                    {/* Interactive Activation Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMapInteractive(true);
                          setIsIframeLoading(true);
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-white hover:bg-brand-sage hover:text-white text-brand-brown font-bold text-xs sm:text-sm border-2 border-brand-sage/40 hover:border-brand-sage shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer group"
                      >
                        <Compass className="w-4 h-4 text-brand-sage group-hover:text-white transition-colors" />
                        <span>웹에서 실시간 지도 확대/이동하기</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-sage group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Quick Action Direct Links */}
                  <div className="relative z-10 p-3 sm:p-4 bg-white/95 backdrop-blur-xs border-t border-brand-green/20 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-brand-brown/80 font-medium hidden md:flex items-center gap-2">
                      <span className="font-bold text-brand-sage">원클릭 길찾기:</span>
                      <span>스마트폰 내비게이션 및 지도 앱으로 바로 연결됩니다.</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                      {activeView === 'naver' && (
                        <>
                          <a
                            href={naverDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
                            title="네이버 빠른 길찾기"
                          >
                            <Navigation className="w-3.5 h-3.5 text-[#03C75A]" />
                            <span>네이버 길찾기</span>
                          </a>
                          <a
                            href={naverMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
                            title="네이버 지도 크게보기"
                          >
                            <NaverIcon className="w-3.5 h-3.5" />
                            <span>네이버 지도 열기</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}

                      {activeView === 'kakao' && (
                        <>
                          <a
                            href={kakaoDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
                            title="카카오맵 실시간 길찾기"
                          >
                            <Navigation className="w-3.5 h-3.5 text-amber-700" />
                            <span>카카오 길찾기</span>
                          </a>
                          <a
                            href={kakaoMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FEDC00] text-[#191919] text-xs font-extrabold shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
                            title="카카오맵 크게보기"
                          >
                            <KakaoIcon className="w-3.5 h-3.5" />
                            <span>카카오맵 열기</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}

                      {activeView === 'google' && (
                        <>
                          <a
                            href={googleDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-800 text-xs font-bold border border-blue-300 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
                            title="Google 지도 길찾기"
                          >
                            <Navigation className="w-3.5 h-3.5 text-blue-600" />
                            <span>Google 길찾기</span>
                          </a>
                          <a
                            href={googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-[#4285F4] hover:bg-blue-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
                            title="Google 지도 열기"
                          >
                            <GoogleMapsIcon className="w-3.5 h-3.5" />
                            <span>Google 지도 열기</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. Interactive Map View (Mounted On-Demand with Loading Feedback) */
                <div className="w-full h-full relative flex flex-col">
                  {isIframeLoading && (
                    <div className="absolute inset-0 bg-brand-beige/50 backdrop-blur-2xs flex flex-col items-center justify-center gap-3 z-10">
                      <div className="w-8 h-8 border-3 border-brand-sage border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-brand-brown">지도를 불러오는 중입니다...</span>
                    </div>
                  )}

                  <iframe
                    title="행복바람 심리상담연구소 위치 안내 지도"
                    src="https://maps.google.com/maps?q=울산광역시%20울주군%20삼남읍%20도호1길%2023&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    onLoad={() => setIsIframeLoading(false)}
                  />

                  {/* Top Control Bar: Map Lock (Return to Scroll Mode) */}
                  <div className="absolute top-3 right-3 z-30">
                    <button
                      type="button"
                      onClick={() => setIsMapInteractive(false)}
                      className="px-3.5 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 border border-stone-700 cursor-pointer"
                      title="지도 조작을 종료하고 부드러운 스크롤 모드로 복귀"
                    >
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>지도 잠금 (스크롤 모드 복귀)</span>
                    </button>
                  </div>

                  {/* Bottom Bar in Interactive Mode */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-auto">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/95 rounded-xl text-xs text-brand-brown/80 border border-brand-green/20 shadow-xs">
                      <span className="font-bold text-brand-sage">조작 안내:</span>
                      <span>두 손가락으로 지도를 이동하거나 확대/축소할 수 있습니다.</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <a
                        href={activeView === 'naver' ? naverDirectionsUrl : activeView === 'kakao' ? kakaoDirectionsUrl : googleDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-brand-beige/50 text-brand-brown text-xs font-bold border border-brand-green/30 shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5 text-brand-sage" />
                        <span>빠른 길찾기</span>
                      </a>
                      <a
                        href={activeView === 'naver' ? naverMapUrl : activeView === 'kakao' ? kakaoMapUrl : googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <span>지도 전체보기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROVIDER 4: SCHEMATIC VISUAL ROUTE GUIDE */}
          {activeView === 'schematic' && (
            <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-brand-beige/50 via-white to-brand-green/15 relative overflow-hidden select-none">
              
              {/* Background Road Grid Lines SVG */}
              <svg 
                className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="10%" y1="60%" x2="90%" y2="60%" stroke="#4a6b5d" strokeWidth="18" strokeLinecap="round" opacity="0.4" />
                <line x1="55%" y1="15%" x2="55%" y2="85%" stroke="#4a6b5d" strokeWidth="14" strokeLinecap="round" opacity="0.3" />
                <line x1="30%" y1="35%" x2="70%" y2="35%" stroke="#4a6b5d" strokeWidth="10" strokeDasharray="6,6" opacity="0.3" />
              </svg>

              {/* Schematic Landmarks Overlay */}
              <div className="relative z-10 flex items-start justify-between">
                {/* Landmark 1: KTX Ulsan Station */}
                <div className="p-3 bg-white rounded-2xl border border-blue-200 shadow-xs flex items-center gap-2.5 max-w-[200px]">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-brand-brown block">KTX/SRT 울산역</strong>
                    <span className="text-[10px] text-brand-brown/60">차량 5~7분 / 버스 연계</span>
                  </div>
                </div>

                {/* Compass & North Indicator */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-brown/60 bg-white px-2.5 py-1 rounded-full border border-brand-green/30 shadow-xs">
                  <Compass className="w-3.5 h-3.5 text-brand-sage" />
                  <span>북쪽 (North)</span>
                </div>

                {/* Landmark 2: Samnam Administrative Center */}
                <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-xs flex items-center gap-2.5 max-w-[200px]">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-brand-brown block">삼남읍 행정복지센터</strong>
                    <span className="text-[10px] text-brand-brown/60">도보 3~5분 / 버스정류장</span>
                  </div>
                </div>
              </div>

              {/* Central Destination Pin Landmark */}
              <div className="relative z-10 my-auto flex justify-center">
                <div 
                  className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl border-2 border-brand-sage flex items-center gap-3 sm:gap-4 max-w-md"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-sage text-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        목적지 도착
                      </span>
                      <span className="text-[10px] text-brand-brown/60">엘리베이터 이용 4층</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-brand-brown">
                      행복바람 심리상담연구소
                    </h3>
                    <p className="text-xs text-brand-sage font-semibold font-serif">
                      도호1길 23 상가 408호 (무료 주차 가능)
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Road Label & Parking Indicator */}
              <div className="relative z-10 flex items-end justify-between text-xs text-brand-brown/75">
                <div className="p-2.5 px-3 bg-white rounded-xl border border-brand-green/30 flex items-center gap-2 shadow-xs">
                  <Car className="w-4 h-4 text-brand-sage" />
                  <span className="font-semibold text-[11px]">건물 지하(B1, B2) 무료 주차 가능</span>
                </div>

                <div className="p-2 px-3 bg-brand-green/30 rounded-xl border border-brand-green/40 font-mono text-[11px] font-bold text-brand-brown">
                  ← 삼남로 / 도호1길 방면 →
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Transportation Guide Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-green/20 bg-brand-beige/10">
          {/* Public Bus */}
          <div className="p-4 rounded-2xl bg-white border border-brand-green/20 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-bold text-brand-brown block mb-1">
                대중교통 (시내버스)
              </strong>
              <p className="text-xs text-brand-brown/70 leading-relaxed font-serif">
                <span className="font-semibold text-brand-brown">삼남읍 행정복지센터</span> 또는 <span className="font-semibold text-brand-brown">도호마을</span> 정류장 하차 후 도보 3~5분 (304, 308, 313, 318, 5002번 등)
              </p>
            </div>
          </div>

          {/* KTX / SRT Train */}
          <div className="p-4 rounded-2xl bg-white border border-brand-green/20 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-bold text-brand-brown block mb-1">
                기차 / KTX·SRT
              </strong>
              <p className="text-xs text-brand-brown/70 leading-relaxed font-serif">
                <span className="font-semibold text-brand-brown">울산역(통도사)</span> 하차 시 도보 10분 내외, 차량/택시로 약 5~7분 거리 (택시 기본요금 수준), 시내버스 환승 시 10분 내외 소요
              </p>
            </div>
          </div>

          {/* Parking & Car */}
          <div className="p-4 rounded-2xl bg-white border border-brand-green/20 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-bold text-brand-brown block mb-1">
                자가용 &amp; 무료 주차
              </strong>
              <p className="text-xs text-brand-brown/70 leading-relaxed font-serif">
                내비게이션에 <span className="font-semibold text-brand-brown">'도호1길 23'</span> 검색. 자가 운전의 경우 건물 지하 주차장(B1, B2)를 이용하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Contact & Booking Footer */}
        <div className="p-4 sm:p-5 bg-brand-beige/30 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-brand-brown/80">
            <Phone className="w-4 h-4 text-brand-sage" />
            <span>길 안내 및 방문 문의: <strong className="font-bold text-brand-brown">{phone}</strong></span>
          </div>

          {showReservationLink && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                to="/reservation"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>상담 예약 &amp; 상세 오시는 길</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
