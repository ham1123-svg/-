/**
 * KakaoTalk 1:1 Consultation Link Helper
 * 
 * Resolves the active KakaoTalk 1:1 consultation link for clients.
 * Supports:
 * 1. Admin UI configured URL (stored in localStorage 'hbbr_kakao_chat_url')
 * 2. Environment variable (VITE_KAKAO_CHAT_URL)
 * 3. Default fallback (Kakao Channel or Open Chat)
 */

export const DEFAULT_KAKAO_CHAT_URL = 'https://pf.kakao.com';

export function getKakaoChatUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('hbbr_kakao_chat_url');
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }
  }
  const envUrl = (import.meta as any).env?.VITE_KAKAO_CHAT_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }
  return DEFAULT_KAKAO_CHAT_URL;
}

export function setKakaoChatUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (url && url.trim().length > 0) {
      localStorage.setItem('hbbr_kakao_chat_url', url.trim());
    } else {
      localStorage.removeItem('hbbr_kakao_chat_url');
    }
    window.dispatchEvent(new Event('kakao-url-updated'));
  }
}
