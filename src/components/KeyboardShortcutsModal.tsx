import React, { useEffect, useRef } from 'react';
import { X, Keyboard, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';
import { useKeyboardShortcuts } from '../context/KeyboardShortcutsContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function KeyboardShortcutsModal() {
  const {
    isHelpModalOpen,
    closeHelpModal,
    isShortcutsEnabled,
    toggleShortcutsEnabled,
    shortcuts,
  } = useKeyboardShortcuts();

  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isHelpModalOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isHelpModalOpen]);

  if (!isHelpModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      aria-describedby="shortcuts-modal-desc"
      onClick={closeHelpModal}
    >
      <div
        className="bg-brand-beige border border-brand-green/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-green/30 flex items-center justify-between bg-brand-green/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-sage text-white flex items-center justify-center shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-lg font-serif font-bold text-brand-brown">
                키보드 단축키 안내
              </h2>
              <p id="shortcuts-modal-desc" className="text-xs text-brand-brown/70">
                숫자 키와 단축키로 사이트를 빠르고 편리하게 탐색하세요
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={closeHelpModal}
            aria-label="단축키 안내 창 닫기 (ESC)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-brand-brown hover:bg-brand-green/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Enable/Disable Bar */}
        <div className="px-5 py-3 bg-white/70 border-b border-brand-green/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-sage" />
            <span className="text-xs font-semibold text-brand-brown">
              단축키 기능 활성화 상태
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-bold",
              isShortcutsEnabled ? "text-brand-sage" : "text-brand-brown/50"
            )}>
              {isShortcutsEnabled ? '사용 중' : '일시 해제됨'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isShortcutsEnabled}
              aria-label="키보드 단축키 활성화 토글"
              onClick={toggleShortcutsEnabled}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                isShortcutsEnabled ? "bg-brand-sage" : "bg-brand-brown/20"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                  isShortcutsEnabled ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh]">
          {/* Navigation Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-sage mb-2 flex items-center gap-1.5">
              <span>페이지 바로가기 단축키</span>
            </h3>
            <div className="space-y-1.5">
              {shortcuts
                .filter((s) => s.category === 'navigation')
                .map((shortcut) => (
                  <div
                    key={shortcut.key}
                    onClick={() => {
                      if (shortcut.path) {
                        navigate(shortcut.path);
                        closeHelpModal();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white/80 border border-brand-green/30 flex items-center justify-between hover:bg-brand-green/20 hover:border-brand-sage/50 transition-all cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        if (shortcut.path) {
                          navigate(shortcut.path);
                          closeHelpModal();
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded-md bg-brand-green/40 border border-brand-green/70 text-xs font-mono font-bold text-brand-brown shadow-2xs group-hover:bg-brand-sage group-hover:text-white transition-colors">
                        {shortcut.displayKey}
                      </kbd>
                      <div>
                        <div className="text-xs font-bold text-brand-brown flex items-center gap-1.5">
                          <span>{shortcut.name}</span>
                        </div>
                        <p className="text-[11px] text-brand-brown/70 leading-tight">
                          {shortcut.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-brown/40 group-hover:text-brand-sage group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
            </div>
          </div>

          {/* Accessibility & Help Category */}
          <div className="pt-2 border-t border-brand-green/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-sage mb-2">
              접근성 및 시스템 기능
            </h3>
            <div className="space-y-1.5">
              {shortcuts
                .filter((s) => s.category !== 'navigation')
                .map((shortcut) => (
                  <div
                    key={shortcut.key}
                    onClick={() => {
                      if (shortcut.action) {
                        shortcut.action();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white/80 border border-brand-green/30 flex items-center justify-between hover:bg-brand-green/20 transition-all cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        if (shortcut.action) shortcut.action();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded-md bg-brand-green/40 border border-brand-green/70 text-xs font-mono font-bold text-brand-brown shadow-2xs group-hover:bg-brand-sage group-hover:text-white transition-colors">
                        {shortcut.displayKey}
                      </kbd>
                      <div>
                        <div className="text-xs font-bold text-brand-brown">
                          {shortcut.name}
                        </div>
                        <p className="text-[11px] text-brand-brown/70 leading-tight">
                          {shortcut.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              
              {/* ESC Key Row */}
              <div className="p-2.5 rounded-xl bg-white/50 border border-brand-green/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded-md bg-brand-green/30 border border-brand-green/50 text-[11px] font-mono font-bold text-brand-brown shadow-2xs">
                    ESC
                  </kbd>
                  <div>
                    <div className="text-xs font-bold text-brand-brown">
                      창 / 팝업 닫기
                    </div>
                    <p className="text-[11px] text-brand-brown/70 leading-tight">
                      열려 있는 단축키 안내 창이나 모달을 닫습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety note */}
          <div className="p-3 rounded-xl bg-brand-green/25 border border-brand-green/40 flex items-start gap-2 text-xs text-brand-brown/80">
            <Info className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>입력창 보호 기능</strong>: 예약 신청 및 자가진단 등 텍스트를 입력하는 도중에는 오작동 방지를 위해 단축키가 자동으로 비활성화됩니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-green/30 bg-brand-green/10 flex justify-end">
          <button
            type="button"
            onClick={closeHelpModal}
            className="px-4 py-2 bg-brand-sage text-white rounded-lg text-xs font-semibold hover:bg-brand-sage/90 transition-colors cursor-pointer shadow-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
