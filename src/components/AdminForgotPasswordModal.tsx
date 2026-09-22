import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, KeyRound, CheckCircle2, AlertCircle, 
  ArrowRight, ShieldCheck, RefreshCw, Copy, Check
} from 'lucide-react';

interface AdminForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordRecovered?: (password: string) => void;
}

export default function AdminForgotPasswordModal({
  isOpen,
  onClose,
  onPasswordRecovered
}: AdminForgotPasswordModalProps) {
  // Step 1: Input email -> Step 2: Input verification code -> Step 3: View / Reset password
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset state when closing or opening
  const handleClose = () => {
    setStep(1);
    setEmailInput('');
    setCodeInput('');
    setNewPasswordInput('');
    setErrorMsg('');
    setSuccessMsg('');
    setRevealedPassword(null);
    setCopied(false);
    onClose();
  };

  // Step 1: Request verification code to registered email
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('등록된 관리자 이메일 주소를 입력해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`등록된 관리자 이메일(${data.email || emailInput})로 6자리 인증코드가 전송되었습니다.`);
        setStep(2);
        // If server provided code in dev/preview for convenience, pre-fill or alert
        if (data.devCode) {
          setCodeInput(data.devCode);
        }
      } else {
        setErrorMsg(data.error || '등록된 관리자 이메일과 일치하지 않습니다.');
      }
    } catch (err) {
      setErrorMsg('서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and reveal current password
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) {
      setErrorMsg('이메일로 전송된 6자리 인증코드를 입력해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailInput.trim(), 
          code: codeInput.trim() 
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRevealedPassword(data.password);
        setStep(3);
        setSuccessMsg('이메일 본인 인증이 완료되었습니다. 관리자 비밀번호를 확인하세요.');
        if (onPasswordRecovered && data.password) {
          onPasswordRecovered(data.password);
        }
      } else {
        setErrorMsg(data.error || '인증코드가 올바르지 않거나 만료되었습니다.');
      }
    } catch (err) {
      setErrorMsg('인증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 optional: Reset password immediately if desired
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      setErrorMsg('새 비밀번호는 최소 4자 이상 입력해 주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          code: codeInput.trim(),
          newPassword: newPasswordInput.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRevealedPassword(newPasswordInput.trim());
        setSuccessMsg('비밀번호가 성공적으로 변경되었습니다. 변경된 비밀번호로 로그인해 주세요.');
        if (onPasswordRecovered) {
          onPasswordRecovered(newPasswordInput.trim());
        }
      } else {
        setErrorMsg(data.error || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (err) {
      setErrorMsg('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (!revealedPassword) return;
    navigator.clipboard.writeText(revealedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-brand-brown/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-green/30 p-6 sm:p-7 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-green/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-sage/20 text-brand-sage flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-brown">
                  관리자 비밀번호 찾기
                </h3>
                <p className="text-xs text-brand-brown/60">
                  등록된 이메일 본인 인증을 통한 비밀번호 확인
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-brand-beige/60 hover:bg-brand-brown/10 text-brand-brown flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper info */}
          <div className="flex items-center justify-between my-4 text-xs font-semibold text-brand-brown/70">
            <span className={`px-2.5 py-1 rounded-full ${step === 1 ? 'bg-brand-sage text-white' : 'bg-brand-green/30 text-brand-brown'}`}>
              1. 이메일 입력
            </span>
            <span className="text-brand-brown/30">→</span>
            <span className={`px-2.5 py-1 rounded-full ${step === 2 ? 'bg-brand-sage text-white' : 'bg-brand-green/30 text-brand-brown'}`}>
              2. 인증코드 확인
            </span>
            <span className="text-brand-brown/30">→</span>
            <span className={`px-2.5 py-1 rounded-full ${step === 3 ? 'bg-brand-sage text-white' : 'bg-brand-green/30 text-brand-brown'}`}>
              3. 비밀번호 확인
            </span>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Registered Email */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-brown/80 mb-1.5">
                  등록된 관리자 이메일 주소
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-brand-brown/40" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="예: mikypa@naver.com 또는 hahm1123@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-brand-beige/10 border border-brand-green/40 rounded-xl text-xs text-brand-brown focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-none transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-brand-brown/60 mt-1.5 leading-relaxed">
                  연구소 시스템에 등록된 관리자 이메일(예: 공식 접수 이메일)로 본인 확인용 6자리 인증코드가 전송됩니다.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>인증번호 발송 요청</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter 6-digit Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-brand-brown/80">
                    6자리 인증코드 입력
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-brand-sage hover:underline"
                  >
                    이메일 다시 입력
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <ShieldCheck className="w-4 h-4 text-brand-brown/40" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value.replace(/[^0-9]/g, ''));
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="인증코드 6자리 (숫자)"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-brand-beige/10 border border-brand-green/40 rounded-xl text-sm tracking-widest font-mono text-brand-brown focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-none transition-all text-center"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-brand-brown/60 mt-1.5 text-center">
                  전송된 코드는 15분간 유효합니다.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>인증 확인 및 비밀번호 조회</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: View Current Password & Optional Reset */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-2xl text-center">
                <span className="text-xs text-emerald-800 font-semibold block mb-1">
                  확인된 관리자 비밀번호
                </span>
                <div className="flex items-center justify-center gap-2 my-2">
                  <span className="text-2xl font-mono font-black text-brand-brown tracking-wider bg-white px-4 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                    {revealedPassword}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
                    title="비밀번호 복사"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    클립보드에 복사되었습니다!
                  </span>
                )}
              </div>

              {/* Optional Quick Reset Form */}
              <form onSubmit={handleResetPassword} className="pt-2 border-t border-brand-green/20 space-y-3">
                <label className="block text-xs font-bold text-brand-brown/80">
                  비밀번호를 새로 변경하시겠습니까? (선택)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="새 관리자 비밀번호 (최소 4자)"
                    className="flex-1 px-3 py-2 bg-brand-beige/10 border border-brand-green/40 rounded-xl text-xs text-brand-brown focus:border-brand-sage focus:ring-1 focus:ring-brand-sage outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !newPasswordInput.trim()}
                    className="px-3.5 py-2 bg-brand-brown hover:bg-brand-brown/90 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    변경하기
                  </button>
                </div>
              </form>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>로그인 화면으로 돌아가기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
