import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHighContrast } from './HighContrastContext';

export interface ShortcutItem {
  key: string;
  displayKey: string;
  name: string;
  path?: string;
  action?: () => void;
  description: string;
  category: 'navigation' | 'accessibility' | 'help';
}

interface KeyboardShortcutsContextType {
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  toggleHelpModal: () => void;
  isShortcutsEnabled: boolean;
  setIsShortcutsEnabled: (enabled: boolean) => void;
  toggleShortcutsEnabled: () => void;
  shortcuts: ShortcutItem[];
  activeToast: string | null;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

const SHORTCUTS_ENABLED_KEY = 'happywind_shortcuts_enabled';

export const KeyboardShortcutsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isHighContrast, toggleHighContrast } = useHighContrast();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [isShortcutsEnabled, setIsShortcutsEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SHORTCUTS_ENABLED_KEY);
      return saved !== null ? saved === 'true' : true; // default enabled
    } catch {
      return true;
    }
  });

  const setIsShortcutsEnabled = useCallback((enabled: boolean) => {
    setIsShortcutsEnabledState(enabled);
    try {
      localStorage.setItem(SHORTCUTS_ENABLED_KEY, String(enabled));
    } catch {
      // ignore storage error
    }
  }, []);

  const toggleShortcutsEnabled = useCallback(() => {
    setIsShortcutsEnabled(!isShortcutsEnabled);
  }, [isShortcutsEnabled, setIsShortcutsEnabled]);

  const showToast = useCallback((message: string) => {
    setActiveToast(message);
    const timer = setTimeout(() => {
      setActiveToast((curr) => (curr === message ? null : curr));
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const openHelpModal = useCallback(() => setIsHelpModalOpen(true), []);
  const closeHelpModal = useCallback(() => setIsHelpModalOpen(false), []);
  const toggleHelpModal = useCallback(() => setIsHelpModalOpen((prev) => !prev), []);

  const shortcuts: ShortcutItem[] = [
    {
      key: '1',
      displayKey: '1',
      name: '홈 (메인)',
      path: '/',
      description: '행복바람 메인 홈 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '2',
      displayKey: '2',
      name: '상담소 소개',
      path: '/about',
      description: '연구소 철학 및 시설 안내 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '3',
      displayKey: '3',
      name: '상담사 소개',
      path: '/counselors',
      description: '전문 심리상담사진 소개 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '4',
      displayKey: '4',
      name: '상담 프로그램',
      path: '/programs',
      description: '연령 및 주제별 맞춤 심리상담 프로그램 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '5',
      displayKey: '5',
      name: '자가진단',
      path: '/self-diagnosis',
      description: '우울/불안/스트레스 척도 심리 자가진단 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '6',
      displayKey: '6',
      name: '커뮤니티',
      path: '/community',
      description: '내담자 후기, 심리 칼럼 및 공지사항 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '7',
      displayKey: '7',
      name: '예약 / 오시는 길',
      path: '/reservation',
      description: '온라인 상담 예약 및 연구소 위치/오시는 길 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: '8',
      displayKey: '8',
      name: '상담 절차 & 비용 안내',
      path: '/guide',
      description: '상담 4단계 절차 및 정찰제 비용/FAQ 안내 페이지로 이동합니다.',
      category: 'navigation',
    },
    {
      key: 'c',
      displayKey: 'C',
      name: '고대비 모드 전환',
      description: '시각 편의를 위한 텍스트 고대비 모드를 켜거나 끕니다.',
      category: 'accessibility',
      action: toggleHighContrast,
    },
    {
      key: '?',
      displayKey: '?',
      name: '단축키 안내',
      description: '전체 키보드 단축키 도움말 창을 열거나 닫습니다.',
      category: 'help',
      action: toggleHelpModal,
    },
  ];

  // Global keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Always allow ESC to close help modal
      if (e.key === 'Escape') {
        if (isHelpModalOpen) {
          e.preventDefault();
          closeHelpModal();
          return;
        }
      }

      // Check if user is typing in form inputs
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        const isEditable =
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox';

        if (isEditable) {
          return;
        }
      }

      // If modifier keys are held (Ctrl, Meta/Cmd, Alt), don't trigger simple shortcuts
      // (Unless Shift is held for '?', which is normal for '?')
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const pressedKey = e.key;

      // Handle '?' or 'Shift + /' for help
      if (pressedKey === '?' || (pressedKey === '/' && e.shiftKey)) {
        e.preventDefault();
        toggleHelpModal();
        return;
      }

      // If shortcuts are disabled by user, don't execute
      if (!isShortcutsEnabled) {
        return;
      }

      // Match shortcut
      const matched = shortcuts.find(
        (item) => item.key.toLowerCase() === pressedKey.toLowerCase()
      );

      if (matched) {
        e.preventDefault();

        if (matched.path) {
          if (location.pathname !== matched.path) {
            navigate(matched.path);
            showToast(`단축키 [${matched.displayKey}]: ${matched.name} 페이지로 이동했습니다.`);
          } else {
            showToast(`단축키 [${matched.displayKey}]: 이미 현재 머무르고 있는 페이지입니다.`);
          }
        } else if (matched.action) {
          matched.action();
          if (matched.key.toLowerCase() === 'c') {
            const nextMode = !isHighContrast;
            showToast(`단축키 [C]: 고대비 모드가 ${nextMode ? '켜졌습니다' : '꺼졌습니다'}.`);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isShortcutsEnabled,
    isHelpModalOpen,
    isHighContrast,
    location.pathname,
    navigate,
    closeHelpModal,
    toggleHelpModal,
    showToast,
    shortcuts,
  ]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        isHelpModalOpen,
        openHelpModal,
        closeHelpModal,
        toggleHelpModal,
        isShortcutsEnabled,
        setIsShortcutsEnabled,
        toggleShortcutsEnabled,
        shortcuts,
        activeToast,
      }}
    >
      {children}

      {/* Accessible Live Region Toast Announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300"
      >
        {activeToast && (
          <div className="bg-brand-brown text-white dark:bg-black px-4 py-2.5 rounded-full shadow-lg border border-brand-sage/40 flex items-center gap-2 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" aria-hidden="true" />
            <span>{activeToast}</span>
          </div>
        )}
      </div>
    </KeyboardShortcutsContext.Provider>
  );
};

export function useKeyboardShortcuts(): KeyboardShortcutsContextType {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}
