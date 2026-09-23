import React, { useEffect, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BreadcrumbItem {
  name: string;
  englishName?: string;
  path?: string;
  isCurrent?: boolean;
}

const ROUTE_DEFINITIONS: Record<string, { name: string; englishName: string }> = {
  '/about': { name: '상담소 소개', englishName: 'About' },
  '/counselors': { name: '상담사 소개', englishName: 'Counselors' },
  '/programs': { name: '프로그램', englishName: 'Programs' },
  '/self-diagnosis': { name: '자가진단', englishName: 'Self Diagnosis' },
  '/guide': { name: '상담 안내', englishName: 'Guide' },
  '/community': { name: '커뮤니티', englishName: 'Community' },
  '/reservation': { name: '예약/오시는 길', englishName: 'Reservation' },
  '/confidentiality': { name: '비밀보장 원칙', englishName: 'Confidentiality' },
  '/privacy': { name: '개인정보처리방침', englishName: 'Privacy Policy' },
  '/terms': { name: '이용약관', englishName: 'Terms' },
  '/eap': { name: '기관·기업 EAP 제휴 문의', englishName: 'Corporate & Institutional EAP' },
  '/corporate': { name: '기관·기업 EAP 제휴 문의', englishName: 'Corporate & Institutional EAP' },
  '/admin': { name: '관리자 모드', englishName: 'Admin' },
};

const PROGRAM_CATEGORY_MAP: Record<string, { name: string; englishName: string }> = {
  '개인상담': { name: '개인상담', englishName: 'Individual Counseling' },
  'individual': { name: '개인상담', englishName: 'Individual Counseling' },
  '부부상담': { name: '부부 및 가족상담', englishName: 'Couples & Family Counseling' },
  'couples': { name: '부부 및 가족상담', englishName: 'Couples & Family Counseling' },
  '심리검사': { name: '종합심리검사', englishName: 'Psychological Assessment' },
  'assessment': { name: '종합심리검사', englishName: 'Psychological Assessment' },
  '기업상담': { name: '기업상담 (EAP)', englishName: 'EAP Corporate Counseling' },
  'eap': { name: '기업상담 (EAP)', englishName: 'EAP Corporate Counseling' },
  '집단/교육': { name: '집단상담 및 심리교육', englishName: 'Group Workshop & Education' },
  'group': { name: '집단상담 및 심리교육', englishName: 'Group Workshop & Education' },
};

const GUIDE_TAB_MAP: Record<string, { name: string; englishName: string }> = {
  'faq': { name: '자주 묻는 질문 (FAQ)', englishName: 'FAQ' },
  'process': { name: '상담 절차 안내', englishName: 'Process' },
  'cost': { name: '상담 비용 안내', englishName: 'Pricing' },
};

const COMMUNITY_CATEGORY_MAP: Record<string, { name: string; englishName: string }> = {
  'notice': { name: '공지사항', englishName: 'Notices' },
  'column': { name: '전문가 칼럼', englishName: 'Columns' },
  'review': { name: '상담 후기', englishName: 'Testimonials' },
};

export default function Breadcrumb() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const items = useMemo<BreadcrumbItem[]>(() => {
    const { pathname, hash } = location;

    // Do not render breadcrumb on root home page
    if (pathname === '/') {
      return [];
    }

    if (pathname === '/reservation/status' || pathname === '/reservation-status') {
      return [
        { name: '홈', englishName: 'Home', path: '/' },
        { name: '예약/오시는 길', englishName: 'Reservation', path: '/reservation' },
        { name: '예약 상태 조회', englishName: 'Reservation Status', path: pathname, isCurrent: true },
      ];
    }

    const breadcrumbList: BreadcrumbItem[] = [
      {
        name: '홈',
        englishName: 'Home',
        path: '/',
      },
    ];

    // Primary route
    const mainRoute = ROUTE_DEFINITIONS[pathname];
    if (mainRoute) {
      breadcrumbList.push({
        name: mainRoute.name,
        englishName: mainRoute.englishName,
        path: pathname,
      });
    } else {
      // Fallback for subpaths
      const segment = pathname.replace('/', '');
      breadcrumbList.push({
        name: segment,
        englishName: segment,
        path: pathname,
      });
    }

    // Sub-routes & Query parameters recognition
    if (pathname === '/programs') {
      const categoryParam = searchParams.get('category');
      const programParam = searchParams.get('program');

      if (categoryParam && categoryParam !== 'all' && PROGRAM_CATEGORY_MAP[categoryParam]) {
        const catInfo = PROGRAM_CATEGORY_MAP[categoryParam];
        breadcrumbList.push({
          name: catInfo.name,
          englishName: catInfo.englishName,
          path: `/programs?category=${encodeURIComponent(categoryParam)}`,
        });
      }

      if (programParam) {
        breadcrumbList.push({
          name: programParam,
          englishName: 'Program Detail',
          path: `/programs?program=${encodeURIComponent(programParam)}`,
        });
      }
    } else if (pathname === '/guide') {
      const tabParam = searchParams.get('tab');
      if (tabParam && GUIDE_TAB_MAP[tabParam]) {
        breadcrumbList.push({
          name: GUIDE_TAB_MAP[tabParam].name,
          englishName: GUIDE_TAB_MAP[tabParam].englishName,
          path: `/guide?tab=${tabParam}`,
        });
      } else if (hash === '#faq') {
        breadcrumbList.push({
          name: '자주 묻는 질문 (FAQ)',
          englishName: 'FAQ',
          path: '/guide#faq',
        });
      }
    } else if (pathname === '/community') {
      const catParam = searchParams.get('category');
      if (catParam && COMMUNITY_CATEGORY_MAP[catParam]) {
        breadcrumbList.push({
          name: COMMUNITY_CATEGORY_MAP[catParam].name,
          englishName: COMMUNITY_CATEGORY_MAP[catParam].englishName,
          path: `/community?category=${catParam}`,
        });
      }
    } else if (pathname === '/reservation') {
      const tabParam = searchParams.get('tab');
      if (tabParam === 'map' || hash === '#map') {
        breadcrumbList.push({
          name: '오시는 길 & 약도',
          englishName: 'Directions & Map',
          path: '/reservation?tab=map',
        });
      } else if (tabParam === 'booking') {
        breadcrumbList.push({
          name: '온라인 상담 예약',
          englishName: 'Online Booking',
          path: '/reservation?tab=booking',
        });
      }
    }

    // Mark the last item as current
    if (breadcrumbList.length > 0) {
      breadcrumbList[breadcrumbList.length - 1].isCurrent = true;
    }

    return breadcrumbList;
  }, [location, searchParams]);

  // SEO: Schema.org BreadcrumbList JSON-LD injection
  useEffect(() => {
    if (items.length <= 1) {
      const existing = document.getElementById('breadcrumb-schema-jsonld');
      if (existing) existing.remove();
      return;
    }

    const schemaId = 'breadcrumb-schema-jsonld';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.englishName ? `${item.name} (${item.englishName})` : item.name,
        ...(item.path ? { item: `https://www.hbbr.kr${item.path}` } : {}),
      })),
    };

    scriptTag.textContent = JSON.stringify(breadcrumbData);

    return () => {
      const el = document.getElementById(schemaId);
      if (el && location.pathname === '/') {
        el.remove();
      }
    };
  }, [items, location.pathname]);

  // Return nothing on Home page
  if (items.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="현재 위치 탐색 (Breadcrumb)"
      className="bg-brand-beige/50 border-b border-brand-green/20 backdrop-blur-xs py-2.5 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs text-brand-brown/70">
        {/* Semantic Ordered List */}
        <ol className="flex items-center flex-wrap gap-y-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.name}-${index}`} className="inline-flex items-center">
                {index === 0 ? (
                  // Home Item
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-brand-brown/70 hover:text-brand-sage transition-colors group font-medium"
                    aria-label="홈으로 이동"
                  >
                    <Home className="w-3.5 h-3.5 text-brand-sage group-hover:scale-110 transition-transform" />
                    <span>홈</span>
                    <span className="text-[10px] text-brand-brown/50 hidden sm:inline">Home</span>
                  </Link>
                ) : isLast ? (
                  // Current Active Page (Leaf node)
                  <span
                    aria-current="page"
                    className="inline-flex items-center gap-1 font-bold text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-md border border-brand-sage/20"
                  >
                    <span>{item.name}</span>
                    {item.englishName && (
                      <span className="text-[10px] opacity-75 font-normal hidden sm:inline">
                        {item.englishName}
                      </span>
                    )}
                  </span>
                ) : (
                  // Ancestor Link
                  <Link
                    to={item.path || '#'}
                    className="inline-flex items-center gap-1 text-brand-brown/70 hover:text-brand-sage transition-colors font-medium"
                  >
                    <span>{item.name}</span>
                    {item.englishName && (
                      <span className="text-[10px] text-brand-brown/50 hidden sm:inline">
                        {item.englishName}
                      </span>
                    )}
                  </Link>
                )}

                {/* Separator icon */}
                {!isLast && (
                  <ChevronRight
                    aria-hidden="true"
                    className="w-3.5 h-3.5 mx-1.5 text-brand-brown/40 shrink-0"
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Accessibility & SEO Status Badge */}
        <div className="hidden md:flex items-center gap-1 text-[11px] text-brand-brown/50">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-sage/60" aria-hidden="true" />
          <span>위치 계층 구조 안내</span>
        </div>
      </div>
    </nav>
  );
}
