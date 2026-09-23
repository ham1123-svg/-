import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, CheckCircle2, AlertCircle, ChevronRight, RotateCcw, 
  ArrowRight, ShieldCheck, Heart, Brain, Users, Activity, 
  HelpCircle, Check, Calendar, ArrowUpRight, MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SelfDiagnosisResultsDashboard from './SelfDiagnosisResultsDashboard';

export interface Question {
  id: number;
  text: string;
}

export interface TestCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  description: string;
  questions: Question[];
  recommendedProgram: {
    title: string;
    description: string;
    badge: string;
    features: string[];
  };
}

const TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'general',
    title: '종합 마음 건강 점검',
    subtitle: '우울·불안·스트레스 종합 진단',
    icon: Activity,
    tag: '가장 많이 찾는 검사',
    description: '최근 2주간 경험한 기분 변화, 긴장도, 일상 피로도를 전반적으로 종합 점검합니다.',
    recommendedProgram: {
      title: '청소년 및 성인 상담',
      description: '일상 속 누적된 정서적 피로와 고민을 안전하게 털어놓고 마음의 균형과 자존감을 회복하는 1:1 맞춤 상담입니다.',
      badge: '1:1 심층 개인상담',
      features: ['50분 심층 대면/비대면 상담', '우울·스트레스 원인 정밀 탐색', '인지정서 맞춤 대처법 훈련']
    },
    questions: [
      { id: 1, text: '최근 일상생활에서 매사 의욕이 없고 흥미나 즐거움을 느끼지 못한다.' },
      { id: 2, text: '기분이 가라앉거나 우울하고, 무기력하다고 느낀 적이 많다.' },
      { id: 3, text: '사소한 일에도 예민해지고 신경질이나 짜증이 부쩍 늘었다.' },
      { id: 4, text: '잠들기 어렵거나 밤중에 자주 깨고, 아침에 일어나도 몸이 무겁다.' },
      { id: 5, text: '이유 없이 가슴이 답답하거나 안절부절못하고 긴장된다.' },
      { id: 6, text: '내가 다른 사람들에게 짐이 되거나 실패한 사람처럼 느껴질 때가 있다.' },
      { id: 7, text: '일이나 학업에 집중하기 어렵고 건망증이 부쩍 심해졌다.' },
      { id: 8, text: '주변 사람들과의 대화나 만남이 피곤하게 느껴져 혼자 있고 싶다.' },
      { id: 9, text: '충분히 쉬어도 피로가 가시지 않고 심리적 에너지가 바닥난 느낌이다.' }
    ]
  },
  {
    id: 'depression',
    title: '우울 & 번아웃 척도',
    subtitle: '무기력·에너지 소진 상태 점검',
    icon: Brain,
    tag: '우울감 / 무기력',
    description: '반복되는 무기력감, 일상 흥미 저하, 자기 비하 및 정서적 고갈 상태를 집중적으로 측정합니다.',
    recommendedProgram: {
      title: '청소년 및 성인 상담',
      description: '내면의 상처와 부정적 사고 패턴을 해소하고 활력과 긍정적인 삶의 동기를 되찾도록 돕습니다.',
      badge: '우울·번아웃 집중 케어',
      features: ['전문 상담심리사 1:1 비밀 보장', '내면 감정 정화 및 회복 탄력성 강화', '생활 루틴 재건 솔루션']
    },
    questions: [
      { id: 1, text: '이전에는 좋아하던 일이나 취미에도 전혀 흥미나 보람이 생기지 않는다.' },
      { id: 2, text: '하루의 대부분을 우울하거나 마음이 텅 빈 듯한 공허함으로 보낸다.' },
      { id: 3, text: '신체적·정신적으로 에너지가 고갈되어 아주 작은 일도 시작하기 벅차다.' },
      { id: 4, text: '스스로에 대해 자책하거나 무가치하다는 자괴감이 자주 든다.' },
      { id: 5, text: '입맛이 현저히 떨어지거나 반대로 폭식을 하는 등 식습관이 불규칙하다.' },
      { id: 6, text: '앞날에 대해 막막하고 희망적인 기대가 좀처럼 생기지 않는다.' },
      { id: 7, text: '모든 결정을 내리기 힘들고 세상으로부터 고립된 듯한 기분이 든다.' }
    ]
  },
  {
    id: 'anxiety',
    title: '불안 & 스트레스 척도',
    subtitle: '과긴장·초조·수면불안 점검',
    icon: Sparkles,
    tag: '불안 / 공황 / 만성긴장',
    description: '조절되지 않는 걱정, 심장 두근거림, 신체 긴장 및 미래에 대한 과도한 불안을 측정합니다.',
    recommendedProgram: {
      title: '종합 심리검사 및 해석',
      description: '표준화된 전문 검사를 통해 불안과 스트레스의 근본 기제 및 성격·기질적 특성을 다각도로 정밀 진단합니다.',
      badge: '원인 정밀 심리평가',
      features: ['MMPI-2, TCI 등 표준화 척도', '전문가 정밀 프로파일링 보고서', '1:1 심층 해석 상담 병행']
    },
    questions: [
      { id: 1, text: '별다른 이유 없이 심장이 두근거리거나 숨이 차고 답답할 때가 있다.' },
      { id: 2, text: '걱정스러운 생각이 꼬리를 물어 멈추거나 조절하기 어렵다.' },
      { id: 3, text: '편안히 쉬어야 할 때도 온몸에 힘이 들어가 있고 긴장되어 있다.' },
      { id: 4, text: '사소한 일이나 갑작스러운 상황에 깜짝 놀라고 과민하게 반응한다.' },
      { id: 5, text: '두통, 어지럼증, 속 쓰림 등 원인 모를 신체 통증이 자주 나타난다.' },
      { id: 6, text: '앞으로 안 좋은 일이 터질 것만 같은 막연한 두려움이 엄습한다.' },
      { id: 7, text: '실수를 하거나 타인에게 지적받을까 봐 지나치게 긴장하고 불안하다.' }
    ]
  },
  {
    id: 'relationship',
    title: '부부·가족 및 대인관계 척도',
    subtitle: '관계 갈등·소통 단절 점검',
    icon: Users,
    tag: '부부 / 가족 / 대인관계',
    description: '가족이나 파트너와의 갈등, 소통 단절, 타인의 시선에 대한 불안 등 관계 스트레스를 측정합니다.',
    recommendedProgram: {
      title: '부부 및 가족 관계 개선',
      description: '서로의 마음을 왜곡 없이 이해하고 상처를 치유하여 건강하고 따뜻한 소통 방식을 확립합니다.',
      badge: '관계 회복 솔루션',
      features: ['부부/가족 상호작용 패턴 정밀 분석', '공감적 비폭력 대화 훈련', '갈등 중재 및 친밀감 재건']
    },
    questions: [
      { id: 1, text: '가족이나 배우자(연인)와 대화할 때 사소한 말에도 감정 싸움으로 번진다.' },
      { id: 2, text: '상대방이 내 마음과 상황을 진심으로 이해해주지 못한다고 느낀다.' },
      { id: 3, text: '갈등이 생기면 대화를 나누기보다 침묵하거나 자리를 피해버린다.' },
      { id: 4, text: '주변 사람들에게 미움받거나 거절당할까 봐 눈치를 많이 보게 된다.' },
      { id: 5, text: '마음속 진솔한 고민을 터놓을 사람이 없어 깊은 외로움과 고립감을 느낀다.' },
      { id: 6, text: '가족 또는 가까운 사람들과의 문제로 인해 집이나 일상이 편안하지 않다.' },
      { id: 7, text: '타인의 비판이나 무관심에 큰 상처를 받고 오래도록 마음이 쓰인다.' }
    ]
  }
];

const SCALE_OPTIONS = [
  { value: 0, label: '전혀 아니다', sub: '최근 2주간 없음' },
  { value: 1, label: '가끔 그렇다', sub: '주 1~2일 정도' },
  { value: 2, label: '자주 그렇다', sub: '주 3~4일 정도' },
  { value: 3, label: '거의 매일', sub: '주 5일 이상' }
];

export default function SelfDiagnosis() {
  const [selectedCategory, setSelectedCategory] = useState<TestCategory>(TEST_CATEGORIES[0]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Reference for scrolling to the result / questionnaire card
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToAnchor = (offset = 84) => {
    // Small timeout ensures DOM layout and AnimatePresence have applied
    setTimeout(() => {
      if (scrollAnchorRef.current) {
        const rect = scrollAnchorRef.current.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, absoluteTop - offset),
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  // Switch category
  const handleSelectCategory = (cat: TestCategory) => {
    setSelectedCategory(cat);
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    scrollToAnchor(84);
  };

  // Answer question
  const handleAnswer = (questionId: number, value: number) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    // Auto advance if answering sequentially
    if (currentStep < selectedCategory.questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 150);
    }
  };

  // Quick fill sample answers for testing / instant preview
  const handleQuickFillSample = () => {
    const sampleAnswers: Record<number, number> = {};
    const sampleValues = [2, 3, 1, 2, 2, 1, 3, 2, 2];
    selectedCategory.questions.forEach((q, idx) => {
      sampleAnswers[q.id] = sampleValues[idx % sampleValues.length];
    });
    setAnswers(sampleAnswers);
    setIsCompleted(true);
    scrollToAnchor(84);
  };

  // Show result with smooth scroll to result view
  const handleShowResult = () => {
    setIsCompleted(true);
    scrollToAnchor(84);
  };

  // Reset test
  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    scrollToAnchor(84);
  };

  // Automatically scroll when result view becomes active
  useEffect(() => {
    if (isCompleted) {
      scrollToAnchor(84);
    }
  }, [isCompleted]);

  // Calculate results
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = selectedCategory.questions.length * 3;
  const scorePercentage = Math.round((totalScore / maxScore) * 100);
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === selectedCategory.questions.length;

  // Grade interpretation logic
  const getResultGrade = () => {
    if (scorePercentage <= 25) {
      return {
        level: '안정 (양호)',
        color: 'emerald',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barColor: 'bg-emerald-500',
        headline: '마음 상태가 대체로 건강하고 안정적입니다.',
        summary: '현재 심리적 스트레스와 감정이 양호하게 조율되고 있습니다. 일상 속에서 적절한 이완과 나만의 휴식 시간을 지속해 주세요.',
        advice: '지금의 편안한 상태를 지키기 위해 정기적인 운동과 산책, 충분한 수면을 유지하시는 것을 권장합니다. 혹시 자신의 타고난 기질과 성격 강점을 객관적으로 확인해보고 싶다면 가벼운 심리검사를 추천합니다.',
        recProgram: {
          title: '종합 심리검사 및 해석',
          reason: '현재의 양호한 심리 상태를 바탕으로 본인의 성격 유형, 대인관계 강점, 직업/적성 프로파일을 객관적으로 파악해 볼 수 있습니다.',
          badge: '자기 탐색 및 강점 발견'
        }
      };
    } else if (scorePercentage <= 50) {
      return {
        level: '관심 (주의)',
        color: 'amber',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        barColor: 'bg-amber-500',
        headline: '최근 누적된 스트레스로 가벼운 마음 환기가 필요합니다.',
        summary: '일상생활의 과중한 업무나 관계 피로로 인해 마음의 에너지가 다소 소진되었습니다. 아직 초기 단계이므로 잠시 멈추어 감정을 털어내는 것이 좋습니다.',
        advice: '혼자서 모든 고민을 감당하려 하기보다, 전문 심리상담사와 함께 답답했던 마음을 정리하는 것만으로도 마음의 짐이 크게 가벼워집니다.',
        recProgram: {
          title: selectedCategory.recommendedProgram.title,
          reason: '일상 속 스트레스 요인을 명확히 짚어보고, 감정의 응어리를 안전하게 해소할 수 있는 초기 1:1 심리상담을 추천합니다.',
          badge: selectedCategory.recommendedProgram.badge
        }
      };
    } else if (scorePercentage <= 75) {
      return {
        level: '적극적 관리 권장',
        color: 'orange',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        barColor: 'bg-orange-500',
        headline: '전문 심리상담을 통한 정서적 돌봄과 개입이 필요합니다.',
        summary: '우울, 불안감, 또는 관계에서의 만성적 갈등으로 인해 일상생활, 학업, 직장 업무에 실질적인 어려움을 겪고 계실 가능성이 높습니다.',
        advice: '마음의 상처나 감기는 결코 부끄러운 일이 아닙니다. 행복바람심리상담연구소의 따뜻하고 비밀이 보장되는 전문 상담을 통해 문제의 근본적인 원인을 짚고 일상의 활력을 되찾으세요.',
        recProgram: {
          title: selectedCategory.recommendedProgram.title,
          reason: '심리적 부담감을 줄이고 건강한 대처 방식을 습득하기 위해 전문적인 1:1 심층 상담 세션이 매우 효과적입니다.',
          badge: selectedCategory.recommendedProgram.badge
        }
      };
    } else {
      return {
        level: '심층 케어 권장 (고위험)',
        color: 'rose',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        barColor: 'bg-rose-500',
        headline: '스스로 감당하기 힘든 상태로, 전문가의 즉각적인 도움이 필요합니다.',
        summary: '심리적 에너지가 심각하게 고갈되어 자가 회복이 매우 버거운 상태입니다. 혼자 끙끙 앓지 마시고 전문 상담가의 손을 잡으시길 간곡히 권해드립니다.',
        advice: '당신이 겪고 계신 고통은 혼자 버텨야 하는 짐이 아닙니다. 따뜻하고 안전한 비밀 보장 환경에서 박미경 원장과 전문 상담진이 온 힘을 다해 회복의 디딤돌이 되어 드리겠습니다.',
        recProgram: {
          title: selectedCategory.recommendedProgram.title,
          reason: '위기 완화와 정서적 안정화를 위해 원장 직강의 집중 1:1 개인 심리상담을 신속히 예약하시는 것을 권장합니다.',
          badge: '전문 집중 케어 권장'
        }
      };
    }
  };

  const result = getResultGrade();

  return (
    <div className="w-full max-w-4xl mx-auto" id="self-diagnosis-root">
      {/* Category Selection Tabs */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sage/15 text-brand-sage font-semibold text-xs rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            간편한 3분 마음 점검 (비밀 보장)
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown">
            간이 심리 자가진단
          </h2>
          <p className="text-brand-brown/70 text-sm mt-1 max-w-xl mx-auto">
            현재 겪고 계신 감정과 일상 상태를 편안하게 체크해보세요. 진단 결과에 맞추어 가장 효과적인 치유 프로그램을 안내해 드립니다.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TEST_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-brown text-white border-brand-brown shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-brand-beige/30 text-brand-brown border-brand-green/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-green/30 text-brand-sage'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-brand-beige text-brand-brown/70'
                    }`}>
                      {cat.questions.length}문항
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm mb-0.5 line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-white/80' : 'text-brand-brown/60'}`}>
                    {cat.tag}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container Anchor & Card */}
      <div 
        ref={scrollAnchorRef}
        id="self-diagnosis-container"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-green/30 shadow-md scroll-mt-24"
      >
        {!isCompleted ? (
          <div>
            {/* Active Test Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-brand-green/20 gap-3">
              <div>
                <span className="text-xs font-bold text-brand-sage uppercase tracking-wider">
                  {selectedCategory.subtitle}
                </span>
                <h3 className="text-xl font-serif font-bold text-brand-brown">
                  {selectedCategory.title}
                </h3>
                <p className="text-xs text-brand-brown/60 mt-0.5">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="sm:text-right shrink-0">
                <div className="text-xs font-bold text-brand-brown/70 mb-1">
                  응답 진행률: <span className="text-brand-sage font-bold">{answeredCount}</span> / {selectedCategory.questions.length}
                </div>
                <div className="w-full sm:w-36 h-2.5 bg-brand-beige/60 rounded-full overflow-hidden border border-brand-green/20">
                  <div 
                    className="h-full bg-brand-sage transition-all duration-300 rounded-full"
                    style={{ width: `${(answeredCount / selectedCategory.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {selectedCategory.questions.map((q, qIdx) => {
                const currentAns = answers[q.id];
                const isCurrent = currentStep === qIdx;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                      currentAns !== undefined
                        ? 'bg-brand-beige/20 border-brand-green/40'
                        : isCurrent
                        ? 'bg-brand-green/10 border-brand-sage shadow-xs'
                        : 'bg-white border-brand-green/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="w-6 h-6 rounded-full bg-brand-sage/15 text-brand-sage font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <p className="font-bold text-sm sm:text-base text-brand-brown leading-relaxed">
                        {q.text}
                      </p>
                    </div>

                    {/* Scale choices */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-9">
                      {SCALE_OPTIONS.map((opt) => {
                        const isChosen = currentAns === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleAnswer(q.id, opt.value)}
                            className={`py-2.5 px-3 rounded-xl text-left border transition-all ${
                              isChosen
                                ? 'bg-brand-sage text-white border-brand-sage shadow-xs font-bold'
                                : 'bg-white hover:bg-brand-beige/40 text-brand-brown border-brand-green/30 font-medium'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-0.5">
                              <span>{opt.label}</span>
                              {isChosen && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`text-[10px] block ${isChosen ? 'text-white/80' : 'text-brand-brown/50'}`}>
                              {opt.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-brand-green/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-brand-brown/60 hover:text-brand-brown font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>처음부터 다시 작성하기</span>
                </button>
                <span className="text-brand-brown/30 text-xs hidden sm:inline">|</span>
                <button
                  type="button"
                  onClick={handleQuickFillSample}
                  className="flex items-center gap-1.5 text-xs text-brand-sage hover:text-brand-sage/80 font-semibold transition-colors"
                  title="5대 심리 밸런스 차트 대시보드 즉시 확인"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>대시보드 샘플 미리보기</span>
                </button>
              </div>

              <button
                type="button"
                id="btn-view-diagnosis-result"
                disabled={!isAllAnswered}
                onClick={handleShowResult}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isAllAnswered
                    ? 'bg-brand-sage hover:bg-brand-sage/90 text-white cursor-pointer hover:shadow-lg'
                    : 'bg-brand-beige text-brand-brown/40 cursor-not-allowed'
                }`}
              >
                <span>{isAllAnswered ? '진단 결과 확인하기' : `${selectedCategory.questions.length - answeredCount}개 문항 남음`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results Dashboard View */
          <motion.div
            id="diagnosis-result-view"
            tabIndex={-1}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="outline-none"
          >
            <SelfDiagnosisResultsDashboard
              category={selectedCategory}
              answers={answers}
              totalScore={totalScore}
              maxScore={maxScore}
              scorePercentage={scorePercentage}
              result={result}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
