import { Testimonial } from '../types';

export interface EmotionKeywordItem {
  id: string;
  word: string;
  koreanCategory: string;
  type: 'healing' | 'challenge'; // healing = 치유/회복 긍정 감정, challenge = 극복된 고민/호소 감정
  count: number;
  percentage: number;
  weight: number; // 1 to 5 scale for font size and visual prominence
  description: string;
  clinicalMeaning: string;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    glow: string;
    gradient: string;
  };
  sampleSnippets: Array<{
    reviewId: string;
    clientName: string;
    categoryLabel: string;
    snippet: string;
    isHealingQuote: boolean;
  }>;
  relatedReviewIds: string[];
}

export interface EmotionAnalysisReport {
  totalReviewsAnalyzed: number;
  totalEmotionMentions: number;
  healingMentions: number;
  challengeMentions: number;
  healingRatio: number; // e.g. 64.5%
  challengeRatio: number; // e.g. 35.5%
  uniqueEmotionKeywordsCount: number;
  topHealingEmotion: EmotionKeywordItem | null;
  topChallengeEmotion: EmotionKeywordItem | null;
  keywords: EmotionKeywordItem[];
  healingKeywords: EmotionKeywordItem[];
  challengeKeywords: EmotionKeywordItem[];
  journeyPairs: Array<{
    beforeWord: string;
    afterWord: string;
    count: number;
    caseHeadline: string;
    clientName: string;
  }>;
}

// Comprehensive psychological emotion lexicon for counseling analysis
interface LexiconDefinition {
  word: string;
  type: 'healing' | 'challenge';
  patterns: RegExp[];
  koreanCategory: string;
  description: string;
  clinicalMeaning: string;
  colorIndex: number;
}

const EMOTION_LEXICON: LexiconDefinition[] = [
  // === 치유 & 회복 감정 (Healing & Transformed Emotions) ===
  {
    word: '평온',
    type: 'healing',
    patterns: [/평온/g, /마음의\s*평온/g, /평온한/g, /고요/g],
    koreanCategory: '내적 안정 & 평화',
    description: '불안과 강박이 가라앉고 찾아온 내면의 잔잔한 고요함',
    clinicalMeaning: '교감신경계 과각성이 완화되고 자기조절력이 복원되었음을 나타내는 핵심 지표',
    colorIndex: 0
  },
  {
    word: '안도감',
    type: 'healing',
    patterns: [/안도/g, /안정감/g, /안정적/g, /안전기지/g, /숨통이\s*트/g],
    koreanCategory: '안전 & 안도',
    description: '위협과 불안이 해소되고 비로소 안전하다고 느끼는 깊은 쉼',
    clinicalMeaning: '상담실의 수용적 환경과 지지적 관계를 통해 형성된 심리적 안전기지의 체화',
    colorIndex: 1
  },
  {
    word: '용기',
    type: 'healing',
    patterns: [/용기/g, /일어설\s*용기/g, /당당하/g, /당당히/g, /다시\s*시작/g],
    koreanCategory: '자기 효능 & 재도전',
    description: '좌절을 딛고 다시 세상으로 한 걸음 내딛는 결단과 힘',
    clinicalMeaning: '자아탄력성(Resilience)이 증진되어 회피를 멈추고 문제 해결에 능동적으로 임하는 태도',
    colorIndex: 2
  },
  {
    word: '자신감',
    type: 'healing',
    patterns: [/자신감/g, /당당/g, /자기\s*효능감/g, /자신을\s*신뢰/g, /자아\s*가치/g],
    koreanCategory: '자존감 & 효능감',
    description: '타인의 시선에서 벗어나 내 존재와 역량을 스스로 믿는 힘',
    clinicalMeaning: '부정적 핵심 신념의 재구조화를 통해 확립된 건강한 자아 존중감',
    colorIndex: 3
  },
  {
    word: '따뜻함',
    type: 'healing',
    patterns: [/따뜻/g, /온기/g, /품어주/g, /따스/g, /온화/g],
    koreanCategory: '정서적 온기',
    description: '스스로와 타인을 향한 냉담함이 녹아내리고 느껴지는 온기',
    clinicalMeaning: '자기 비판(Self-criticism)에서 자기 자비(Self-compassion)로의 질적 정서 전환',
    colorIndex: 4
  },
  {
    word: '든든함',
    type: 'healing',
    patterns: [/든든/g, /혼자가\s*아니/g, /동반자/g, /지지/g, /버팀목/g],
    koreanCategory: '사회적 지지감',
    description: '더 이상 고립되지 않고 든든한 조력자가 곁에 있다는 확신',
    clinicalMeaning: '애착 외상 치유 및 타인에 대한 기본적 신뢰감(Basic Trust)의 재구축',
    colorIndex: 5
  },
  {
    word: '희망',
    type: 'healing',
    patterns: [/희망/g, /기대/g, /설렘/g, /다시\s*미소/g, /꿈을\s*이야기/g, /인생\s*2막/g],
    koreanCategory: '미래 지향 & 기대',
    description: '막막했던 앞날에 긍정적인 가능성과 빛이 보이기 시작하는 설렘',
    clinicalMeaning: '우울성 무망감(Hopelessness)의 극복과 새로운 삶의 목표 및 의미 발견',
    colorIndex: 6
  },
  {
    word: '감사',
    type: 'healing',
    patterns: [/감사/g, /고마/g, /은혜/g, /기적/g],
    koreanCategory: '초월적 감사',
    description: '고통스러웠던 여정 끝에 회복된 일상과 관계를 향한 진심 어린 감사',
    clinicalMeaning: '외상 후 성장(Post-Traumatic Growth) 단계에서 나타나는 삶의 재발견',
    colorIndex: 7
  },
  {
    word: '편안함',
    type: 'healing',
    patterns: [/편안/g, /쉼표/g, /이완/g, /푹\s*자/g, /자연스러/g],
    koreanCategory: '신체적·심리적 이완',
    description: '가슴을 짓누르던 긴장이 풀리고 몸과 마음이 누리는 온전한 휴식',
    clinicalMeaning: '신체화 증상(호흡곤란, 불면, 긴장성 통증)의 해소와 부교감신경 활성화',
    colorIndex: 8
  },
  {
    word: '자기자비',
    type: 'healing',
    patterns: [/자기\s*자비/g, /자기\s*수용/g, /안아주/g, /자책을\s*멈/g, /스스로를\s*비난하지/g],
    koreanCategory: '자기 수용',
    description: '완벽하지 않은 자신을 있는 그대로 품어주는 자애로운 마음',
    clinicalMeaning: '가혹한 초자아적 검열 완화와 온전한 무조건적 긍정적 존중의 내면화',
    colorIndex: 9
  },
  {
    word: '친밀감',
    type: 'healing',
    patterns: [/친밀/g, /화목/g, /원팀/g, /배려/g, /서로를\s*안아/g, /유대감/g],
    koreanCategory: '관계 회복 & 화합',
    description: '비난과 방어를 멈추고 서로의 마음에 진심으로 닿는 온화한 연결',
    clinicalMeaning: '방어기제 해체 후 진솔한 감정 표현(비폭력 대화)을 통한 정서적 유대 강화',
    colorIndex: 10
  },
  {
    word: '홀가분함',
    type: 'healing',
    patterns: [/홀가분/g, /가벼/g, /내려놓/g, /해소/g, /털어내/g],
    koreanCategory: '정서적 정화',
    description: '오랫동안 짊어졌던 무거운 짐을 내려놓았을 때의 자유로움',
    clinicalMeaning: '감정 정화(Catharsis)와 미해결 과제(Unfinished Business)의 종결',
    colorIndex: 11
  },

  // === 고민 & 극복된 호소 감정 (Struggling & Overcome Emotions) ===
  {
    word: '불안',
    type: 'challenge',
    patterns: [/불안/g, /불안증/g, /불안감/g, /사회불안/g, /분리불안/g, /발표불안/g],
    koreanCategory: '불안 & 걱정',
    description: '앞날이나 대인관계에서 끊임없이 엄습하던 마음의 동요와 두려움',
    clinicalMeaning: '내담자들이 상담을 찾게 된 가장 보편적인 주 호소 문제이자 극복의 시발점',
    colorIndex: 12
  },
  {
    word: '두려움',
    type: 'challenge',
    patterns: [/두려/g, /겁/g, /무서/g, /시선이\s*두려/g],
    koreanCategory: '위협 & 회피',
    description: '타인의 부정적 평가나 낯선 환경에 맞닥뜨렸을 때의 위축',
    clinicalMeaning: '편도체 과민 반응으로 인한 투쟁-도피-동결(Fight-Flight-Freeze) 반응',
    colorIndex: 13
  },
  {
    word: '자책',
    type: 'challenge',
    patterns: [/자책/g, /자기비하/g, /내\s*탓/g, /자괴감/g, /부끄/g],
    koreanCategory: '자기 처벌 & 죄책감',
    description: '문제의 원인을 모두 자신에게 돌리며 밤새 스스로를 괴롭히던 습관',
    clinicalMeaning: '성숙하지 못한 내면 아이의 과잉 책임감과 인정 욕구 결핍의 발현',
    colorIndex: 14
  },
  {
    word: '무기력',
    type: 'challenge',
    patterns: [/무기력/g, /에너지\s*소진/g, /지쳐/g, /아무것도\s*하/g, /번아웃/g],
    koreanCategory: '소진 & 에너지 고갈',
    description: '아무리 애써도 바꿀 수 없다는 생각에 손끝 하나 까딱하기 힘들던 상태',
    clinicalMeaning: '학습된 무기력(Learned Helplessness) 및 신경학적 번아웃 증후군',
    colorIndex: 15
  },
  {
    word: '우울',
    type: 'challenge',
    patterns: [/우울/g, /슬픔/g, /눈물/g, /흐느/g, /마음이\s*가라앉/g],
    koreanCategory: '정서적 침체',
    description: '세상이 흑백으로 보이고 마음 깊은 곳에 짙게 드리웠던 그늘',
    clinicalMeaning: '상실, 실패 또는 억압된 분노가 내재화되어 나타나는 기분 장애 양상',
    colorIndex: 16
  },
  {
    word: '공허함',
    type: 'challenge',
    patterns: [/공허/g, /허무/g, /의미\s*상실/g, /빈\s*둥지/g, /껍데기/g],
    koreanCategory: '실존적 허무',
    description: '열심히 달려왔으나 문득 삶의 의미와 방향을 잃어버렸던 상실감',
    clinicalMeaning: '중년 전환기 또는 성취 후 찾아오는 실존적 공허(Existential Vacuum)',
    colorIndex: 17
  },
  {
    word: '답답함',
    type: 'challenge',
    patterns: [/답답/g, /가슴\s*조임/g, /숨이\s*턱/g, /호흡\s*곤란/g, /복통/g],
    koreanCategory: '신체화 증상',
    description: '억누른 감정이 가슴 조임이나 호흡 곤란 등 신체 신호로 터져나왔던 고통',
    clinicalMeaning: '미처 언어화되지 못한 심리적 고통이 자율신경계 교란으로 발현된 신체화',
    colorIndex: 18
  },
  {
    word: '공황',
    type: 'challenge',
    patterns: [/공황/g, /과호흡/g, /심장이\s*터질/g, /공포증/g],
    koreanCategory: '급성 공포 반응',
    description: '통제력을 잃고 숨이 막힐 것 같았던 예측 불가능한 신체적 공포',
    clinicalMeaning: '재난화 사고와 신체 감각에 대한 파국적 오해석으로 유발된 공황 발작',
    colorIndex: 19
  },
  {
    word: '외로움',
    type: 'challenge',
    patterns: [/외로/g, /고립/g, /누구에게도\s*말/g, /혼자\s*남겨/g, /벽/g],
    koreanCategory: '정서적 고립',
    description: '가족이나 동료 틈에서도 내 아픔을 아무도 모른다는 깊은 단절감',
    clinicalMeaning: '정서적 지지 체계 부재로 인한 실존적 고립감 및 방어적 단절',
    colorIndex: 20
  },
  {
    word: '분노',
    type: 'challenge',
    patterns: [/분노/g, /원망/g, /억울/g, /고성과\s*비난/g, /언쟁/g, /화가\s*나/g],
    koreanCategory: '상처 입은 방어',
    description: '상대방을 향한 날 선 비난과 억울함 뒤에 숨어 있던 아픈 상처',
    clinicalMeaning: '취약한 자아를 보호하기 위해 표출되는 2차 감정(Secondary Emotion)',
    colorIndex: 21
  },
  {
    word: '긴장감',
    type: 'challenge',
    patterns: [/긴장/g, /예민/g, /손발이\s*차/g, /목소리가\s*떨/g, /초조/g],
    koreanCategory: '과각성 & 긴장',
    description: '한순간도 경계를 풀지 못하고 살얼음판을 걷듯 곤두서 있던 신경',
    clinicalMeaning: '지속적 평가 위협에 따른 근육 긴장 및 만성적 각성 상태',
    colorIndex: 22
  },
  {
    word: '강박',
    type: 'challenge',
    patterns: [/강박/g, /완벽/g, /완벽주의/g, /채찍질/g, /마감\s*공포/g],
    koreanCategory: '완벽주의 & 강박',
    description: '스스로를 끊임없이 채찍질하며 조금의 실수도 용납하지 못하던 압박',
    clinicalMeaning: '조건적 자기 가치감에 기인한 가혹한 자기 검열과 완벽주의적 불안',
    colorIndex: 23
  }
];

// Color palette generator for rich counseling aesthetics
const COLOR_PALETTES = [
  // Healing (Green/Emerald/Teal/Sage)
  {
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-600 text-white',
    glow: 'shadow-emerald-200/60',
    gradient: 'from-emerald-600 to-teal-500'
  },
  // Healing (Sky/Blue)
  {
    bg: 'bg-sky-50 hover:bg-sky-100',
    text: 'text-sky-900',
    border: 'border-sky-200',
    badgeBg: 'bg-sky-600 text-white',
    glow: 'shadow-sky-200/60',
    gradient: 'from-sky-600 to-cyan-500'
  },
  // Healing (Warm Amber/Sunlight)
  {
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-950',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-600 text-white',
    glow: 'shadow-amber-200/60',
    gradient: 'from-amber-600 to-orange-400'
  },
  // Healing (Rose/Coral)
  {
    bg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-950',
    border: 'border-rose-200',
    badgeBg: 'bg-rose-600 text-white',
    glow: 'shadow-rose-200/60',
    gradient: 'from-rose-600 to-pink-500'
  },
  // Healing (Brand Sage)
  {
    bg: 'bg-[#f2f7f4] hover:bg-[#e4efe8]',
    text: 'text-[#244b36]',
    border: 'border-[#a8c9b5]',
    badgeBg: 'bg-[#407657] text-white',
    glow: 'shadow-[#8ab89a]/50',
    gradient: 'from-[#407657] to-[#609974]'
  },
  // Healing (Warm Violet/Lavender)
  {
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    text: 'text-indigo-950',
    border: 'border-indigo-200',
    badgeBg: 'bg-indigo-600 text-white',
    glow: 'shadow-indigo-200/60',
    gradient: 'from-indigo-600 to-purple-500'
  },
  // Challenge (Muted Slate)
  {
    bg: 'bg-slate-100 hover:bg-slate-200',
    text: 'text-slate-800',
    border: 'border-slate-300',
    badgeBg: 'bg-slate-700 text-white',
    glow: 'shadow-slate-300/60',
    gradient: 'from-slate-700 to-slate-900'
  },
  // Challenge (Dusty Rose/Crimson)
  {
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-950',
    border: 'border-red-200',
    badgeBg: 'bg-red-700 text-white',
    glow: 'shadow-red-200/60',
    gradient: 'from-red-700 to-rose-800'
  },
  // Challenge (Warm Clay/Brown)
  {
    bg: 'bg-stone-100 hover:bg-stone-200',
    text: 'text-stone-900',
    border: 'border-stone-300',
    badgeBg: 'bg-stone-700 text-white',
    glow: 'shadow-stone-300/60',
    gradient: 'from-stone-700 to-stone-900'
  }
];

// Helper to extract contextual snippet around the matched keyword
function extractSnippet(fullText: string, keyword: string, maxLength: number = 75): string {
  const index = fullText.indexOf(keyword);
  if (index === -1) {
    return fullText.slice(0, maxLength) + (fullText.length > maxLength ? '...' : '');
  }

  const start = Math.max(0, index - 30);
  const end = Math.min(fullText.length, index + keyword.length + 45);
  let snippet = fullText.slice(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < fullText.length) snippet = snippet + '...';
  return snippet;
}

export const reviewEmotionAnalyzer = {
  /**
   * Deeply analyzes client reviews to extract and score emotional keywords, frequencies,
   * sentiment distribution, and journey pairs.
   */
  analyzeTestimonials(testimonials: Testimonial[]): EmotionAnalysisReport {
    if (!testimonials || testimonials.length === 0) {
      return {
        totalReviewsAnalyzed: 0,
        totalEmotionMentions: 0,
        healingMentions: 0,
        challengeMentions: 0,
        healingRatio: 0,
        challengeRatio: 0,
        uniqueEmotionKeywordsCount: 0,
        topHealingEmotion: null,
        topChallengeEmotion: null,
        keywords: [],
        healingKeywords: [],
        challengeKeywords: [],
        journeyPairs: []
      };
    }

    const keywordCounts: Record<string, {
      def: LexiconDefinition;
      count: number;
      reviewIds: Set<string>;
      snippets: Array<{
        reviewId: string;
        clientName: string;
        categoryLabel: string;
        snippet: string;
        isHealingQuote: boolean;
      }>;
    }> = {};

    // Initialize counts for all lexicon items
    EMOTION_LEXICON.forEach(lex => {
      keywordCounts[lex.word] = {
        def: lex,
        count: 0,
        reviewIds: new Set<string>(),
        snippets: []
      };
    });

    // Extract journey pairs (Before 고민 상태 -> After 회복 상태)
    const journeyPairs: Array<{
      beforeWord: string;
      afterWord: string;
      count: number;
      caseHeadline: string;
      clientName: string;
    }> = [];

    // Analyze each testimonial
    testimonials.forEach(review => {
      const allText = [
        review.headline || '',
        review.story || '',
        review.beforeState || '',
        review.afterState || '',
        review.counselorInsight || '',
        (review.tags || []).join(' ')
      ].join(' ');

      // Also look specifically at story and before/after
      const storyText = review.story || '';
      const headlineText = review.headline || '';
      const afterText = review.afterState || '';
      const beforeText = review.beforeState || '';

      // Check each emotion lexicon item
      EMOTION_LEXICON.forEach(lex => {
        let matchCountInReview = 0;
        
        lex.patterns.forEach(pat => {
          const regex = new RegExp(pat.source, 'gi');
          const matches = allText.match(regex);
          if (matches) {
            matchCountInReview += matches.length;
          }
        });

        // If matched at least once
        if (matchCountInReview > 0) {
          keywordCounts[lex.word].count += matchCountInReview;
          keywordCounts[lex.word].reviewIds.add(review.id);

          // Find the best expressive snippet
          let bestSnippet = '';
          const isHealing = lex.type === 'healing';

          if (headlineText.includes(lex.word)) {
            bestSnippet = headlineText.replace(/^["“]|["”]$/g, '');
          } else if (isHealing && afterText.includes(lex.word)) {
            bestSnippet = extractSnippet(afterText, lex.word);
          } else if (!isHealing && beforeText.includes(lex.word)) {
            bestSnippet = extractSnippet(beforeText, lex.word);
          } else if (storyText.includes(lex.word)) {
            bestSnippet = extractSnippet(storyText, lex.word);
          } else {
            bestSnippet = extractSnippet(allText, lex.word);
          }

          if (bestSnippet && keywordCounts[lex.word].snippets.length < 4) {
            keywordCounts[lex.word].snippets.push({
              reviewId: review.id,
              clientName: review.clientName || '내담자',
              categoryLabel: review.categoryLabel || '일반 상담',
              snippet: bestSnippet,
              isHealingQuote: isHealing
            });
          }
        }
      });

      // Detect before/after emotional contrast journey
      const foundChallenges = EMOTION_LEXICON.filter(l => l.type === 'challenge' && beforeText.includes(l.word));
      const foundHealings = EMOTION_LEXICON.filter(l => l.type === 'healing' && (afterText.includes(l.word) || headlineText.includes(l.word)));

      if (foundChallenges.length > 0 && foundHealings.length > 0) {
        journeyPairs.push({
          beforeWord: foundChallenges[0].word,
          afterWord: foundHealings[0].word,
          count: 1,
          caseHeadline: headlineText.replace(/^["“]|["”]$/g, '').slice(0, 50) + '...',
          clientName: review.clientName || '내담자'
        });
      }
    });

    // Filter out keywords with 0 count
    const activeItems = Object.values(keywordCounts).filter(item => item.count > 0);

    // Total counts
    const totalEmotionMentions = activeItems.reduce((acc, curr) => acc + curr.count, 0);
    const healingMentions = activeItems
      .filter(item => item.def.type === 'healing')
      .reduce((acc, curr) => acc + curr.count, 0);
    const challengeMentions = activeItems
      .filter(item => item.def.type === 'challenge')
      .reduce((acc, curr) => acc + curr.count, 0);

    const healingRatio = totalEmotionMentions > 0 
      ? Math.round((healingMentions / totalEmotionMentions) * 1000) / 10 
      : 50;
    const challengeRatio = totalEmotionMentions > 0 
      ? Math.round((challengeMentions / totalEmotionMentions) * 1000) / 10 
      : 50;

    // Find max frequency for scale normalization
    const maxCount = Math.max(...activeItems.map(i => i.count), 1);
    const minCount = Math.min(...activeItems.map(i => i.count), 1);

    // Transform into EmotionKeywordItem with weights (1 to 5)
    const keywords: EmotionKeywordItem[] = activeItems.map((item, idx) => {
      // Calculate weight from 1 to 5
      let weight = 1;
      if (maxCount > minCount) {
        const norm = (item.count - minCount) / (maxCount - minCount);
        weight = Math.min(5, Math.max(1, Math.round(norm * 4) + 1));
      } else {
        weight = 3;
      }

      // Pick theme from palette
      const paletteIndex = item.def.type === 'healing'
        ? (idx % 6)
        : 6 + (idx % 3);
      const colorTheme = COLOR_PALETTES[paletteIndex] || COLOR_PALETTES[0];

      return {
        id: `emotion-${item.def.word}`,
        word: item.def.word,
        koreanCategory: item.def.koreanCategory,
        type: item.def.type,
        count: item.count,
        percentage: totalEmotionMentions > 0 ? Math.round((item.count / totalEmotionMentions) * 1000) / 10 : 0,
        weight,
        description: item.def.description,
        clinicalMeaning: item.def.clinicalMeaning,
        colorTheme,
        sampleSnippets: item.snippets,
        relatedReviewIds: Array.from(item.reviewIds)
      };
    });

    // Sort by count descending
    keywords.sort((a, b) => b.count - a.count);

    const healingKeywords = keywords.filter(k => k.type === 'healing');
    const challengeKeywords = keywords.filter(k => k.type === 'challenge');

    const topHealingEmotion = healingKeywords.length > 0 ? healingKeywords[0] : null;
    const topChallengeEmotion = challengeKeywords.length > 0 ? challengeKeywords[0] : null;

    return {
      totalReviewsAnalyzed: testimonials.length,
      totalEmotionMentions,
      healingMentions,
      challengeMentions,
      healingRatio,
      challengeRatio,
      uniqueEmotionKeywordsCount: keywords.length,
      topHealingEmotion,
      topChallengeEmotion,
      keywords,
      healingKeywords,
      challengeKeywords,
      journeyPairs: journeyPairs.slice(0, 6)
    };
  }
};
