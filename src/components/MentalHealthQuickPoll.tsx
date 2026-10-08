import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Users, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Smile, 
  Activity, 
  MessageSquareHeart,
  Compass,
  PhoneCall
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHighContrast } from '../context/HighContrastContext';
import DailyMoodTrackerDashboard from './DailyMoodTrackerDashboard';
import { saveMoodLog, formatDateKey } from '../lib/moodTrackerStorage';
import { MoodId } from '../types/moodTracker';

export interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  englishLabel: string;
  shortMood: string;
  barColor: string;
  bgActive: string;
  counselorTip: string;
  actionText: string;
  actionLink: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'peaceful',
    emoji: '🌿',
    label: '평온하고 안정돼요',
    englishLabel: 'Peaceful & Calm',
    shortMood: '평온함',
    barColor: 'bg-emerald-500',
    bgActive: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    counselorTip: '마음의 평온은 가장 단단한 회복의 기초입니다. 이 소중하고 고요한 숨결을 온몸으로 음미하며 간직해 보세요.',
    actionText: '자가진단으로 마음 건강 유지하기',
    actionLink: '/self-diagnosis',
  },
  {
    id: 'happy',
    emoji: '☀️',
    label: '활기차고 기분 좋아요',
    englishLabel: 'Energetic & Hopeful',
    shortMood: '활기참',
    barColor: 'bg-amber-400',
    bgActive: 'bg-amber-50 border-amber-300 text-amber-900',
    counselorTip: '오늘 당신의 긍정적인 에너지는 주변 사람들에게도 따뜻한 빛이 됩니다. 오늘 하루 수고할 나에게 작은 선물을 건네보세요.',
    actionText: '마음 건강 웰니스 칼럼 읽기',
    actionLink: '/community?tab=column',
  },
  {
    id: 'tired',
    emoji: '🌧️',
    label: '지치고 번아웃 상태예요',
    englishLabel: 'Tired & Burned Out',
    shortMood: '피로·번아웃',
    barColor: 'bg-slate-500',
    bgActive: 'bg-slate-50 border-slate-300 text-slate-900',
    counselorTip: '심리적 배터리가 방전되었을 때 가장 필요한 것은 자책이 아닌 온전한 쉼입니다. 오늘만큼은 아무것도 하지 않을 자유를 허락하세요.',
    actionText: '우울·번아웃 3분 자가진단',
    actionLink: '/self-diagnosis',
  },
  {
    id: 'anxious',
    emoji: '⚡',
    label: '불안하고 가슴이 뛰어요',
    englishLabel: 'Anxious & Stressed',
    shortMood: '불안·긴장',
    barColor: 'bg-orange-500',
    bgActive: 'bg-orange-50 border-orange-300 text-orange-900',
    counselorTip: '불안은 소중한 것을 지키기 위해 뇌가 울리는 일시적 오경보입니다. 어깨를 툭 떨어뜨리고 4-4-6 복식호흡을 3회 반복해 보세요.',
    actionText: '불안·스트레스 척도 점검',
    actionLink: '/self-diagnosis',
  },
  {
    id: 'heavy',
    emoji: '☁️',
    label: '마음이 무겁고 울적해요',
    englishLabel: 'Heavy & Downhearted',
    shortMood: '우울·무거움',
    barColor: 'bg-blue-500',
    bgActive: 'bg-blue-50 border-blue-300 text-blue-900',
    counselorTip: '슬픔과 무거움은 혼자 삼킬 때 깊어집니다. 안전하고 비밀이 보장되는 1:1 상담실에서 그 무거운 짐을 가만히 내려놓으셔도 괜찮습니다.',
    actionText: '박미경 소장과 1:1 안심 상담 예약',
    actionLink: '/reservation',
  },
  {
    id: 'confused',
    emoji: '🌪️',
    label: '생각이 많고 복잡해요',
    englishLabel: 'Confused & Uncertain',
    shortMood: '복잡함',
    barColor: 'bg-purple-500',
    bgActive: 'bg-purple-50 border-purple-300 text-purple-900',
    counselorTip: '머릿속이 안갯속처럼 뿌옇다면, 표준화된 심리검사(MMPI-2/TCI)가 내면의 혼란을 정리하는 든든한 나침반이 되어 드립니다.',
    actionText: '객관적 심리검사 프로그램 보기',
    actionLink: '/programs',
  },
];

const LOCAL_STORAGE_KEY = 'happywind_quick_poll_voted';

export default function MentalHealthQuickPoll({ className }: { className?: string }) {
  const { isHighContrast } = useHighContrast();
  const [activeTab, setActiveTab] = useState<'poll' | 'dashboard'>('poll');
  const [votedMoodId, setVotedMoodId] = useState<string | null>(null);
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState<number>(393);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Restore previous vote from localStorage & fetch latest poll statistics
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setVotedMoodId(saved);
      setHasVoted(true);
    }

    fetch('/api/poll/stats')
      .then(res => res.json())
      .then(data => {
        if (data.percentages) setPercentages(data.percentages);
        if (data.counts) setCounts(data.counts);
        if (data.totalVotes) setTotalVotes(data.totalVotes);
      })
      .catch(() => {});
  }, []);

  const handleVote = async (mood: MoodOption) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setVotedMoodId(mood.id);
    setHasVoted(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, mood.id);

    // Synchronize vote to Daily Mood Tracker history
    const scoreMap: Record<string, number> = {
      happy: 9,
      peaceful: 8,
      confused: 5,
      tired: 4,
      anxious: 3,
      heavy: 2,
    };
    saveMoodLog({
      date: formatDateKey(new Date()),
      moodId: mood.id as MoodId,
      score: scoreMap[mood.id] || 7,
      intensity: 8,
      tags: ['데일리체크인', '마음날씨'],
      note: mood.label,
    });

    try {
      const res = await fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_id: mood.id }),
      });
      const data = await res.json();
      if (data.percentages) setPercentages(data.percentages);
      if (data.counts) setCounts(data.counts);
      if (data.totalVotes) setTotalVotes(data.totalVotes);
    } catch (e) {
      // Fallback optimistic update
      setTotalVotes(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetVote = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setVotedMoodId(null);
    setHasVoted(false);
  };

  const selectedMoodData = MOOD_OPTIONS.find(m => m.id === votedMoodId) || MOOD_OPTIONS[0];

  return (
    <section 
      aria-label="마음 건강 퀵 폴 체크인 인터랙티브 컴포넌트"
      className={cn(
        "py-14 sm:py-18 relative overflow-hidden border-t border-brand-green/20",
        isHighContrast 
          ? "bg-neutral-950 text-white" 
          : "bg-gradient-to-b from-white via-brand-beige/25 to-white",
        className
      )}
    >
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-64 bg-brand-green/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Switcher: 3초 체크인 vs 주간/월간 감정 변화 대시보드 */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/90 backdrop-blur-xs border border-brand-green/40 shadow-xs text-xs sm:text-sm font-serif font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('poll')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'poll'
                  ? "bg-brand-sage text-white shadow-xs"
                  : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
              )}
            >
              <Smile className="w-4 h-4" />
              <span>3초 오늘의 마음 체크</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'dashboard'
                  ? "bg-brand-sage text-white shadow-xs"
                  : "text-brand-brown/70 hover:text-brand-brown hover:bg-brand-beige/50"
              )}
            >
              <Activity className="w-4 h-4" />
              <span>📈 주간/월간 감정 추이 대시보드</span>
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          /* Render Full Dedicated Mood Tracker Dashboard with Weekly/Monthly charts */
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <DailyMoodTrackerDashboard />
          </motion.div>
        ) : (
          /* Main Poll Card Container */
          <div className="rounded-3xl bg-white border border-brand-green/30 shadow-xl p-6 sm:p-10 relative overflow-hidden">
            
            {/* Header Block */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage text-xs font-serif font-bold mb-3 border border-brand-sage/20">
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>3-Second Daily Check-in</span>
              <span aria-hidden="true" className="text-brand-brown/30">·</span>
              <span>100% 익명 안심 체크</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown mb-2.5 leading-snug">
              오늘 당신의 <span className="text-brand-sage">마음 날씨</span>는 어떤가요?
            </h3>

            <p className="text-xs sm:text-sm text-brand-brown/75 font-serif leading-relaxed">
              바쁜 하루 속, 잠시 숨을 고르고 지금 내 안의 감정을 있는 그대로 바라봐 주세요.<br className="hidden sm:inline" />
              이모지를 선택하시면 전문가의 따뜻한 맞춤 처방 팁과 다른 이웃들의 실시간 현황을 보실 수 있습니다.
            </p>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs sm:text-sm font-sans text-brand-brown/80">
              <Users className="w-4 h-4 text-brand-sage" />
              <span>오늘 <strong>{totalVotes.toLocaleString()}명</strong>의 이웃이 마음 체크인에 참여했습니다.</span>
            </div>
          </div>

          {/* Interactive Poll Body */}
          <AnimatePresence mode="wait">
            {!hasVoted ? (
              /* State 1: Before Voting - 6 Emoji Cards Grid */
              <motion.div
                key="poll-choices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                {MOOD_OPTIONS.map((mood) => (
                  <motion.button
                    key={mood.id}
                    type="button"
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVote(mood)}
                    disabled={isSubmitting}
                    className="p-4 sm:p-5 rounded-2xl border border-brand-green/25 bg-white hover:border-brand-sage/60 hover:bg-brand-beige/30 transition-all shadow-2xs hover:shadow-md flex flex-col items-center justify-center text-center cursor-pointer group select-none"
                  >
                    <span className="text-3xl sm:text-4xl mb-2.5 transform group-hover:scale-110 transition-transform">
                      {mood.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-bold text-brand-brown group-hover:text-brand-sage transition-colors mb-0.5">
                      {mood.label}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-serif text-brand-brown/50">
                      {mood.englishLabel}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              /* State 2: After Voting - Results & Compassionate Counselor Tip */
              <motion.div
                key="poll-results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* User's Choice Badge & Counselor Message Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-brand-green/15 border border-brand-green/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-green/20">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl">{selectedMoodData.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold text-brand-sage uppercase">
                            오늘 나의 마음 선택:
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-brand-green/30 text-xs font-serif font-bold text-brand-brown shadow-2xs">
                            {selectedMoodData.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-brand-brown/60 font-serif">
                          소중한 마음을 솔직하게 표현해 주셔서 감사합니다.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetVote}
                      className="text-xs font-serif font-bold text-brand-brown/65 hover:text-brand-brown flex items-center gap-1.5 transition-colors self-end sm:self-center cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-brand-sage" />
                      <span>다른 감정으로 다시 체크</span>
                    </button>
                  </div>

                  {/* Director Park Mi-kyeong's Clinical Warm Prescription */}
                  <div className="flex items-start gap-3">
                    <img 
                      src="/images/counselor_park.jpg" 
                      alt="박미경 소장" 
                      className="w-10 h-10 rounded-xl object-cover border border-brand-green/30 shrink-0 mt-0.5 shadow-2xs"
                    />
                    <div className="space-y-1 text-xs font-serif">
                      <div className="font-bold text-brand-brown flex items-center gap-1.5">
                        <span>박미경 소장의 마음 처방 한마디</span>
                        <span className="text-[10px] text-brand-sage font-normal">(교육학 박사)</span>
                      </div>
                      <p className="text-brand-brown/85 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-brand-green/20">
                        "{selectedMoodData.counselorTip}"
                      </p>
                    </div>
                  </div>

                  {/* Contextual Action Link */}
                  <div className="pt-1 flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 rounded-xl bg-brand-brown hover:bg-brand-brown/90 text-brand-beige text-xs font-serif font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>주간/월간 감정 변화 대시보드 보기</span>
                    </button>
                    <Link
                      to={selectedMoodData.actionLink}
                      className="px-4 py-2 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-serif font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-98"
                    >
                      <span>{selectedMoodData.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Live Community Mood Poll Statistics Breakdown */}
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-serif text-brand-brown/75">
                    <span className="font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-brand-sage" />
                      <span>오늘 방문자들의 마음 날씨 분포:</span>
                    </span>
                    <span className="text-[11px] text-brand-brown/50">
                      총 {totalVotes.toLocaleString()}명 응답 기준
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {MOOD_OPTIONS.map((mood) => {
                      const pct = percentages[mood.id] ?? 0;
                      const isUserChoice = mood.id === votedMoodId;

                      return (
                        <div
                          key={mood.id}
                          className={cn(
                            "p-3 rounded-xl border transition-all text-xs font-serif",
                            isUserChoice
                              ? "bg-white border-brand-sage/60 ring-2 ring-brand-sage/20 shadow-xs"
                              : "bg-white/70 border-brand-green/20"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-1.5 font-bold text-brand-brown">
                              <span>{mood.emoji}</span>
                              <span className="truncate">{mood.shortMood}</span>
                              {isUserChoice && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-brand-sage text-white font-mono">
                                  내 선택
                                </span>
                              )}
                            </span>
                            <span className="font-mono font-extrabold text-brand-brown/80">
                              {pct}%
                            </span>
                          </div>

                          {/* Animated Progress Bar */}
                          <div className="w-full h-2 bg-brand-beige/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={cn("h-full rounded-full", mood.barColor)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Trust Guarantee Note */}
          <div className="mt-8 pt-4 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-sans text-brand-brown/85">
            <span className="flex items-center gap-2 text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">본 체크인은 개인정보를 일절 수집하지 않으며 순수한 감정 알아차림 용도로 제공됩니다.</span>
            </span>

            <Link 
              to="/reservation" 
              className="text-brand-sage font-bold hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>전문가 심층 1:1 상담 예약</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
        )}

      </div>
    </section>
  );
}
