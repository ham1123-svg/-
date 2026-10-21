/**
 * 행복바람심리상담연구소 공식 CI 애셋 경로 관리
 * 
 * 원본 파일 경로를 그대로 참조하여 컴포넌트 전반에 일관되게 적용합니다.
 * 1. LOGO_SYMBOL: 세잎클로버 및 치유·공감의 사람 형상 음각 심볼 마크 단독
 * 2. LOGO_FULL: 공식 심볼 + 한글/영문 워드마크가 결합된 시그니처 풀 로고
 */

export const BRAND_ASSETS = {
  /** 공식 로고 심볼 마크 (2489 x 2147 투명 배경 고해상도) */
  LOGO_SYMBOL: '/assets/aistudio/______-____a6aaa0a5.png',

  /** 공식 풀 로고 (심볼 + 워드마크 조합 2048 x 2048 고해상도) */
  LOGO_FULL: '/assets/aistudio/Gemini_Generated_Image_4slbta4slbta4slb_13d59397.png',
} as const;

export default BRAND_ASSETS;
