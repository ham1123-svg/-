import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Navigation, Car, Bus, Train, Phone, Copy, Check, 
  ExternalLink, Compass, ShieldCheck, Clock, Map as MapIcon, 
  Layers, ArrowRight, CornerDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';

interface CounselingCenterMapProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showReservationLink?: boolean;
}

export default function CounselingCenterMap({
  className,
  title = "오시는 길 & 상담소 위치",
  subtitle = "울산 KTX 역세권 인근, 편안하고 아늑한 1:1 독립 상담실이 마련되어 있습니다.",
  showReservationLink = true
}: CounselingCenterMapProps) {
  const { isHighContrast } = useHighContrast();
  const [activeView, setActiveView] = useState<'map' | 'schematic'>('map');
  const [copied, setCopied] = useState(false);

  const address = "울산광역시 울주군 삼남읍 도호1길 23 상가 408호";
  const placeName = "행복바람 심리상담연구소";
  const phone = "052-254-0230";

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

  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;

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
      <div className={cn(
        "rounded-3xl overflow-hidden shadow-xl border transition-all",
        isHighContrast 
          ? "bg-neutral-950 text-white border-2 border-white" 
          : "bg-white text-brand-brown border-brand-green/30"
      )}>
        
        {/* Address Strip & Quick Actions Bar */}
        <div className="p-4 sm:p-6 bg-brand-beige/30 border-b border-brand-green/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              </div>
              <p className="text-xs sm:text-sm text-brand-brown/80 font-serif mt-0.5 select-all">
                {address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Address Copy Button */}
            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-brand-green/40 bg-white hover:bg-brand-green/20 text-brand-brown transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="주소 복사하기"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-brand-sage" />
                  <span>주소 복사</span>
                </>
              )}
            </button>

            {/* View Mode Toggle: Interactive Map vs Schematic 약도 */}
            <div className="inline-flex p-1 rounded-xl bg-brand-beige/50 border border-brand-green/30">
              <button
                type="button"
                onClick={() => setActiveView('map')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1",
                  activeView === 'map'
                    ? "bg-brand-sage text-white shadow-2xs"
                    : "text-brand-brown/70 hover:text-brand-brown"
                )}
                aria-pressed={activeView === 'map'}
              >
                <MapIcon className="w-3 h-3" />
                <span>지도</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('schematic')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1",
                  activeView === 'schematic'
                    ? "bg-brand-sage text-white shadow-2xs"
                    : "text-brand-brown/70 hover:text-brand-brown"
                )}
                aria-pressed={activeView === 'schematic'}
              >
                <Compass className="w-3 h-3" />
                <span>직관 약도</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Map Area */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-brand-beige/20 overflow-hidden">
          
          {/* VIEW 1: Interactive Google Maps Iframe */}
          {activeView === 'map' ? (
            <div className="w-full h-full relative">
              <iframe
                title="행복바람 심리상담연구소 위치 지도"
                src="https://maps.google.com/maps?q=울산광역시%20울주군%20삼남읍%20도호1길%2023&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter contrast-[1.02]"
                loading="lazy"
                aria-hidden="false"
              />
              
              {/* Floating Pin Card on top-left of the map */}
              <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md p-2.5 px-3.5 rounded-2xl shadow-md border border-brand-green/30 text-xs pointer-events-none">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-sage"></span>
                </span>
                <span className="font-bold text-brand-brown">행복바람 심리상담연구소 (408호)</span>
              </div>
            </div>
          ) : (
            /* VIEW 2: Schematic / Static Illustration of Neighborhood & Access Landmarks */
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
                <div className="p-3 bg-white/90 backdrop-blur-xs rounded-2xl border border-blue-200 shadow-xs flex items-center gap-2.5 max-w-[200px]">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-brand-brown block">KTX/SRT 울산역</strong>
                    <span className="text-[10px] text-brand-brown/60">차량 5~7분 / 버스 연계</span>
                  </div>
                </div>

                {/* Compass & North Indicator */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-brown/60 bg-white/80 px-2.5 py-1 rounded-full border border-brand-green/30">
                  <Compass className="w-3.5 h-3.5 text-brand-sage animate-spin-slow" />
                  <span>북쪽 (North)</span>
                </div>

                {/* Landmark 2: Samnam Administrative Center */}
                <div className="p-3 bg-white/90 backdrop-blur-xs rounded-2xl border border-amber-200 shadow-xs flex items-center gap-2.5 max-w-[200px]">
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
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 3 }}
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
                </motion.div>
              </div>

              {/* Bottom Road Label & Parking Indicator */}
              <div className="relative z-10 flex items-end justify-between text-xs text-brand-brown/75">
                <div className="p-2.5 px-3 bg-white/90 rounded-xl border border-brand-green/30 flex items-center gap-2">
                  <Car className="w-4 h-4 text-brand-sage" />
                  <span className="font-semibold text-[11px]">상가 지하 및 지상 주차장 이용 가능</span>
                </div>

                <div className="p-2 px-3 bg-brand-green/30 rounded-xl border border-brand-green/40 font-mono text-[11px] font-bold text-brand-brown">
                  ← 삼남로 / 도호1길 방면 →
                </div>
              </div>
            </div>
          )}

          {/* Quick Navigation Launchers (Bottom overlay) */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-emerald-700 text-xs font-bold border border-emerald-300 shadow-md backdrop-blur-xs flex items-center gap-1 transition-all hover:scale-102"
              title="네이버 지도에서 열기"
            >
              <span>네이버 지도</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#FEE500] hover:bg-[#FEDC00] text-[#191919] text-xs font-bold shadow-md flex items-center gap-1 transition-all hover:scale-102"
              title="카카오맵에서 열기"
            >
              <span>카카오맵</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
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
                <span className="font-semibold text-brand-brown">울산역(통도사)</span> 하차 시 차량/택시로 약 5~7분 거리 (택시 기본요금 수준), 시내버스 환승 시 10분 내외 소요
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
                내비게이션에 <span className="font-semibold text-brand-brown">'도호1길 23'</span> 검색. 건물 상가 전용 지하 및 지상 주차장에 무료 주차가 지원됩니다.
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
