import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, Navigation, ExternalLink, Copy, Check, 
  RotateCcw, ZoomIn, ZoomOut, Compass, Sparkles,
  Smartphone, Share2, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

// Naver Brand Color constants
const NAVER_GREEN = "#03C75A";

interface NaverMapViewerProps {
  className?: string;
  height?: string | number;
  compact?: boolean;
  showCardHeader?: boolean;
  showNavigationActions?: boolean;
}

export default function NaverMapViewer({
  className,
  height = "420px",
  compact = false,
  showCardHeader = true,
  showNavigationActions = true
}: NaverMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Exact coordinates for "울산광역시 울주군 삼남읍 도호1길 23" (KTX월드메르디앙W 상가 408호)
  const LAT = 35.5474;
  const LNG = 129.1410;
  const ZOOM_LEVEL = 16;

  const placeName = "행복바람 심리상담연구소";
  const address = "울산광역시 울주군 삼남읍 도호1길 23 상가 408호";
  const roadAddress = "울산광역시 울주군 삼남읍 도호1길 23";
  const jibunAddress = "울산광역시 울주군 삼남읍 신화리 1610-3";

  // Official Naver Map URLs
  const naverSearchUrl = `https://map.naver.com/p/search/${encodeURIComponent(roadAddress)}`;
  const naverDirectionsUrl = `https://map.naver.com/p/directions/-/-/${LNG},${LAT},${encodeURIComponent(placeName)},,/-/transit?c=15.00,0,0,0,dh`;
  const naverStreetViewUrl = `https://map.naver.com/p/search/${encodeURIComponent(roadAddress)}?c=18.00,0,0,0,dh`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(roadAddress)}`;

  // Mobile App Scheme (Naver Map App deep link)
  const naverAppScheme = `nmap://place?lat=${LAT}&lng=${LNG}&name=${encodeURIComponent(placeName)}&appname=happywind`;
  const naverAppNaviScheme = `nmap://navigation?dlat=${LAT}&dlng=${LNG}&dname=${encodeURIComponent(placeName)}&appname=happywind`;

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

  const handleOpenNaverApp = () => {
    // Try opening mobile scheme, fallback to web if not installed/desktop
    const start = Date.now();
    window.location.href = naverAppScheme;
    setTimeout(() => {
      // If user still here after 1.5s, app probably not installed, open web
      if (Date.now() - start < 1800) {
        window.open(naverSearchUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1500);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [LAT, LNG],
      zoom: ZOOM_LEVEL,
      zoomControl: false, // Custom controls
      attributionControl: false,
      scrollWheelZoom: false // prevent accidental page scroll capture
    });

    // Clean, crisp high-res Carto/OSM tile layer with Korean labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Custom Naver Green Pin Marker using HTML/SVG
    const customPinHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full group cursor-pointer select-none">
        <!-- Ripple Pulse Effect -->
        <div class="absolute -bottom-1 w-8 h-8 rounded-full bg-[#03C75A]/25 animate-ping"></div>
        <div class="absolute -bottom-1 w-6 h-6 rounded-full bg-[#03C75A]/40"></div>
        
        <!-- Naver Green Pin Shape -->
        <div class="relative z-10 w-11 h-14 filter drop-shadow-md transition-transform duration-200 group-hover:scale-110">
          <svg viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <path d="M18 0C8.05888 0 0 8.05888 0 18C0 29.5 18 46 18 46C18 46 36 29.5 36 18C36 8.05888 27.9411 0 18 0Z" fill="${NAVER_GREEN}"/>
            <circle cx="18" cy="18" r="13" fill="#FFFFFF"/>
            <!-- NAVER Iconic 'N' Logo -->
            <path d="M14 11H16.8L20.2 18.2V11H23V25H20.2L16.8 17.8V25H14V11Z" fill="${NAVER_GREEN}"/>
          </svg>
        </div>

        <!-- Floating Badge Label on Pin -->
        <div class="absolute -top-7 whitespace-nowrap bg-white/95 text-neutral-800 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-lg border border-[#03C75A]/40 flex items-center gap-1.5 pointer-events-none">
          <span class="w-2 h-2 rounded-full bg-[#03C75A]"></span>
          <span>행복바람 심리상담 (408호)</span>
        </div>
      </div>
    `;

    const naverPinIcon = L.divIcon({
      html: customPinHtml,
      className: 'naver-map-marker-container',
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      popupAnchor: [0, -48]
    });

    const marker = L.marker([LAT, LNG], { icon: naverPinIcon }).addTo(map);

    // Popup with rich Naver Map style info
    const popupContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif; padding: 4px; min-width: 220px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
          <span style="background-color: ${NAVER_GREEN}; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">NAVER</span>
          <strong style="color: #191919; font-size: 14px; font-weight: 700;">${placeName}</strong>
        </div>
        <p style="color: #555; font-size: 11px; margin: 0 0 4px 0; line-height: 1.4;">
          ${address}
        </p>
        <p style="color: #888; font-size: 10px; margin: 0 0 10px 0;">
          지번: ${jibunAddress}
        </p>
        <div style="display: flex; gap: 6px;">
          <a href="${naverDirectionsUrl}" target="_blank" rel="noopener noreferrer" 
             style="flex: 1; text-align: center; background-color: ${NAVER_GREEN}; color: white; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none;">
            네이버 길찾기
          </a>
          <a href="${naverSearchUrl}" target="_blank" rel="noopener noreferrer" 
             style="flex: 1; text-align: center; background-color: #f1f3f5; color: #333; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none; border: 1px solid #ddd;">
            네이버 지도
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: true,
      autoClose: false,
      closeOnClick: false
    });

    mapInstanceRef.current = map;
    setMapLoaded(true);

    // Delay slight resize to handle any parent container animation
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetCenter = () => {
    mapInstanceRef.current?.flyTo([LAT, LNG], ZOOM_LEVEL, { duration: 0.8 });
  };

  return (
    <div className={cn("relative w-full rounded-2xl overflow-hidden border border-[#03C75A]/30 bg-white shadow-md flex flex-col", className)}>
      
      {/* 1. Authentic Naver Map Brand Header Bar */}
      {showCardHeader && (
        <div className="bg-[#03C75A] text-white px-4 py-2.5 sm:px-5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs z-10">
          {/* Logo & Search Bar */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Iconic Naver N Logo */}
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-extrabold text-[#03C75A] text-sm leading-none">N</span>
            </div>
            
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-sm tracking-tight whitespace-nowrap">네이버 지도</span>
              <span className="text-white/60 text-xs hidden sm:inline">|</span>
              <span className="text-xs sm:text-sm font-medium truncate text-white/95 bg-white/15 px-2.5 py-0.5 rounded-full" title={address}>
                {roadAddress} (상가 408호)
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleCopyAddress}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="주소 복사"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="text-emerald-100 font-bold">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>주소복사</span>
                </>
              )}
            </button>

            <a
              href={naverSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white text-[#03C75A] hover:bg-emerald-50 text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer hover:scale-102"
              title="네이버 지도 웹에서 크게보기"
            >
              <span>지도 크게보기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Interactive Map Canvas Container */}
      <div 
        className="relative w-full bg-[#f8f9fa] overflow-hidden" 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Naver Location Info Card (Top-Left overlay) */}
        {!compact && (
          <div className="absolute top-3 left-3 z-10 max-w-[280px] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[#03C75A]/25 text-left pointer-events-auto">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#03C75A]"></span>
              <span className="font-extrabold text-xs text-[#03C75A]">NAVER MAP</span>
              <span className="text-[10px] text-neutral-400">· KTX역 인근</span>
            </div>
            <strong className="text-xs sm:text-sm font-bold text-neutral-900 block truncate">
              {placeName}
            </strong>
            <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-2 leading-tight">
              {address}
            </p>
            <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
              <span className="text-emerald-700 font-semibold">1:1 사전 예약제</span>
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">무료 주차 지원</span>
            </div>
          </div>
        )}

        {/* Naver Map Floating Navigation Controls (Top-Right overlay) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white rounded-xl shadow-md border border-neutral-200/80 p-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
            title="지도 확대"
            aria-label="지도 확대"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer border-t border-neutral-100"
            title="지도 축소"
            aria-label="지도 축소"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetCenter}
            className="w-8 h-8 rounded-lg hover:bg-emerald-50 text-[#03C75A] flex items-center justify-center transition-colors cursor-pointer border-t border-neutral-100"
            title="상담소 위치로 중심 이동"
            aria-label="상담소 위치로 이동"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Floating App Launcher Pill */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 flex-wrap">
          <a
            href={naverDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all hover:scale-102"
            title="네이버 지도에서 대중교통/자가용 빠른 길찾기"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>네이버 길찾기</span>
          </a>

          <a
            href={naverStreetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-neutral-700 text-xs font-semibold shadow-md border border-neutral-200 backdrop-blur-xs flex items-center gap-1 transition-all hover:scale-102"
            title="네이버 거리뷰/로드뷰로 주변 건물 확인하기"
          >
            <Compass className="w-3.5 h-3.5 text-[#03C75A]" />
            <span className="hidden sm:inline">거리뷰</span>
          </a>
        </div>
      </div>

      {/* 3. Bottom Direct Action Links (Naver Map, App, Kakao Map) */}
      {showNavigationActions && (
        <div className="p-3 sm:p-4 bg-neutral-50/80 border-t border-[#03C75A]/20 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#03C75A] shrink-0"></span>
            <span>도보 3분: 삼남읍 행정복지센터 정류장 / 차량 5분: KTX 울산역</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Primary: Naver Map Web */}
            <a
              href={naverSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold shadow-xs transition-all hover:scale-102"
            >
              <span className="w-4 h-4 rounded bg-white text-[#03C75A] flex items-center justify-center font-extrabold text-[10px]">N</span>
              <span>네이버 지도 바로가기</span>
              <ExternalLink className="w-3 h-3 opacity-90" />
            </a>

            {/* Mobile App Scheme Trigger */}
            <button
              type="button"
              onClick={handleOpenNaverApp}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#03C75A] text-xs font-bold border border-[#03C75A]/40 transition-all cursor-pointer shadow-2xs"
              title="스마트폰 네이버 지도 앱으로 위치 보기"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>네이버 지도 앱</span>
            </button>

            {/* Secondary: Kakao Map */}
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FEE500] hover:bg-[#fdd800] text-[#191919] text-xs font-bold shadow-2xs transition-all hover:scale-102"
              title="카카오맵으로 위치 확인하기"
            >
              <span>카카오맵</span>
              <ExternalLink className="w-3 h-3 text-[#191919]/70" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
