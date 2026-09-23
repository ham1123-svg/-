import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  X, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import FAQ from '../components/FAQ';

interface ColumnArticle {
  id: number;
  title: string;
  author: string;
  authorTitle: string;
  date: string;
  category: string;
  image: string;
  detailImage?: string;
  imageCaption?: string;
  summary: string;
  readTime: string;
  sections: {
    heading?: string;
    subheading?: string;
    paragraphs?: string[];
    callout?: string;
    points?: { title: string; desc: string }[];
  }[];
  closingQuote?: string;
  closingNoteTitle?: string;
  closingNote?: string;
  targetAudience?: string;
}

const columns: ColumnArticle[] = [
  {
    id: 1,
    title: "우리 아이의 산만함, 정말 ADHD일까요?",
    author: "박미경",
    authorTitle: "행복바람심리상담연구소 소장",
    date: "2026.09.15",
    category: "아동/청소년",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600&h=600",
    detailImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200&h=675",
    imageCaption: "아이의 산만함을 깊이 이해하고 건강한 집중과 성장을 돕는 학습·심리 환경",
    readTime: "5분 읽기",
    summary: "아이의 산만함은 발달적 특성일까요, 아니면 전문가의 개입이 필요한 ADHD일까요? 감별의 3대 핵심 기준과 숨겨진 심리적 원인, 가정에서 실천하는 양육 솔루션을 정리해 드립니다.",
    sections: [
      {
        paragraphs: [
          '상담소를 찾는 학부모 열 분 중 세네 분은 비슷한 염려를 안고 찾아옵니다. "선생님, 아이가 5분도 가만히 앉아 있질 못해요", "수업 시간에 멍하니 딴청만 피운다는데 혹시 ADHD는 아닐까요?" 불안과 자책이 뒤섞인 목소리 뒤에는, 내 아이의 산만함을 어떤 시선으로 바라봐야 할지 막막한 부모의 마음이 자리 잡고 있습니다.',
          '아이들은 본래 세상에 대한 호기심이 넘치고, 신체 에너지를 발산하며 주의 통제력을 서서히 발달시켜 나가는 과정 중에 있습니다. 그렇다면 평범한 \'발달적 산만함\'과 전문가의 개입이 필요한 \'주의력결핍 과잉행동장애(ADHD)\'는 무엇이 다를까요?'
        ]
      },
      {
        heading: "1. 산만함의 '수준'보다 '기능의 저하'를 살핍니다",
        paragraphs: [
          '단순히 에너지가 넘치거나 관심 없는 과제에 집중하지 못한다고 해서 모두 ADHD인 것은 아닙니다. 임상 현장에서 감별의 핵심으로 두는 기준은 다음과 같습니다.'
        ],
        points: [
          {
            title: "상황의 일관성 (두 곳 이상의 장소)",
            desc: "집에서는 산만하지만 학교나 학원, 규칙이 있는 단체생활에서는 큰 무리 없이 규칙을 따르는 아이들이 있습니다. ADHD는 뇌의 신경생물학적 주의 조절 기능과 연관되어 있어, 가정과 학교 등 최소 2곳 이상의 환경에서 일관되게 통제 어려움이 나타납니다."
          },
          {
            title: "지속 기간 (최소 6개월 이상)",
            desc: "새 학기 적응기, 동생 출산, 가족 내 스트레스 등 환경 변화로 인한 일시적 반응인지, 6개월 이상 꾸준히 이어지는지 확인해야 합니다."
          },
          {
            title: "기능적 손상 (일상생활의 어려움)",
            desc: "지적 능력에 비해 과도하게 학업 성취가 떨어지거나, 잦은 충동 행동으로 친구 관계에서 반복적으로 배제·거절을 겪고 있다면 적극적인 관찰이 필요합니다."
          }
        ]
      },
      {
        heading: "2. 겉모습 너머의 '진짜 원인'을 들여다봐야 합니다",
        paragraphs: [
          '아이의 산만함은 뇌의 전두엽 발달 지연뿐 아니라, 다양한 심리·정서적 신호일 수 있습니다.'
        ],
        points: [
          {
            title: "불안과 긴장",
            desc: "마음속 걱정이나 불안이 높은 아이는 겉보기에 끊임없이 꼼지락거리거나 멍하니 딴생각을 하는 등 산만하게 보입니다."
          },
          {
            title: "학습 및 인지적 요인",
            desc: "수업 내용을 따라가기 어렵거나 난독 등의 학습적 어려움이 있을 때, 무기력해지거나 딴청을 피우는 회피 반응으로 나타나기도 합니다."
          },
          {
            title: "가면성 우울 및 스트레스",
            desc: "소아기 우울은 성인과 달리 우울감 대신 과잉행동, 짜증, 산만함으로 표출되는 경우가 흔합니다."
          }
        ]
      },
      {
        heading: "3. 학부모가 가정에서 실천할 수 있는 3가지 태도",
        points: [
          {
            title: "구체적이고 단계적인 지시",
            desc: '"방 정리해"라는 포괄적 지시 대신 "바닥에 있는 블록을 상자에 넣어줘"처럼 행동을 잘게 쪼개어 하나씩 안내해 주세요.'
          },
          {
            title: "행동과 아이의 인격 분리하기",
            desc: '"너는 왜 맨날 그래?" 같은 성격적 비난 대신, "지금은 앉아 있어야 할 시간이야"처럼 교정이 필요한 행동 자체에만 집중해야 아이의 자존감이 다치지 않습니다.'
          },
          {
            title: "작은 성공의 즉각적 강화",
            desc: '10분을 집중하지 못하던 아이가 3분 동안 과제에 머물렀다면, 그 즉시 구체적인 언어로 칭찬해 도파민 보상 회로가 긍정적으로 작동하도록 돕습니다.'
          }
        ]
      }
    ],
    closingQuote: "산만함은 아이가 부모에게 보내는 \"지금 내 마음과 속도를 조금 더 세심하게 알아채 주세요\"라는 조용한 신호일 수 있습니다.",
    closingNoteTitle: "부모님께 드리는 말씀",
    closingNote: "아이의 산만함을 마주할 때 부모가 느끼는 불안은 자연스럽습니다. 하지만 섣부른 자가진단이나 지나친 걱정은 아이에게 '나는 문제 있는 아이'라는 부정적 자기 낙인을 남길 수 있습니다. 아이가 일상에서 반복적인 좌절을 겪고 있다면, 지체하지 말고 공인된 전문가를 찾아 종합심리검사 등을 통해 아이의 기질, 인지 특성, 정서 상태를 입체적으로 점검해 보시길 권합니다.",
    targetAudience: "행복바람심리상담연구소는 아동·청소년의 기질 및 발달 특성을 면밀히 파악하여 건강한 성장을 함께합니다."
  },
  {
    id: 2,
    title: "번아웃을 극복하는 마음 챙김 5단계",
    author: "박미경",
    authorTitle: "행복바람심리상담연구소 소장",
    date: "2026.08.28",
    category: "성인/직장인",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600&h=600",
    detailImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200&h=675",
    imageCaption: "지친 일상에 깊은 쉼과 회복을 선물하는 마음챙김 명상과 자기 자비",
    readTime: "4분 읽기",
    summary: "끝없는 피로감과 무기력에 지친 직장인을 위한 심리학적 처방전. 신체 감각 인지부터 자기 자비(Self-Compassion)까지 일상 회복의 단계를 전합니다.",
    sections: [
      {
        paragraphs: [
          '열심히 달려온 삶에서 어느 날 문득 모든 에너지가 소진된 듯한 무기력을 마주할 때가 있습니다. 번아웃 증후군은 단순히 체력의 문제가 아니라, 심리적 에너지가 바닥나 자아를 보호하기 위한 방어 기제입니다.'
        ],
        points: [
          {
            title: "1단계: 신체 피로 신호 자각하기",
            desc: "두통, 어깨 뭉침, 불면 등 몸이 보내는 적신호를 무시하지 않고 있는 그대로 인지합니다."
          },
          {
            title: "2단계: '충분히 잘하고 있다' 자기 자비 연습",
            desc: "스스로를 향한 엄격한 잣대를 잠시 내려놓고 따뜻한 위로의 말을 건넵니다."
          },
          {
            title: "3단계: 일과 쉼의 경계선(Boundary) 설정",
            desc: "퇴근 후 업무 연락과 분리되는 물리적, 심리적 공간을 확보합니다."
          }
        ]
      }
    ],
    closingQuote: "휴식은 게으름이 아니라 다음 걸음을 위한 가장 지혜로운 준비입니다.",
    closingNoteTitle: "지친 일상을 위한 마음 처방전",
    closingNote: "극심한 번아웃이 지속될 때 혼자 억지로 버티려 하지 마세요. 전문가와의 1:1 심리상담을 통해 소진의 근본 원인을 짚고, 나만의 안전한 심리적 울타리를 다시 세우는 것이 큰 힘이 됩니다.",
    targetAudience: "행복바람심리상담연구소는 성인 및 직장인의 심리적 소진과 마음 회복을 돕는 전문 상담을 제공합니다."
  },
  {
    id: 3,
    title: "건강한 부부 소통을 위한 대화법",
    author: "박미경",
    authorTitle: "행복바람심리상담연구소 소장",
    date: "2026.08.10",
    category: "부부/가족",
    image: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?auto=format&fit=crop&q=80&w=600&h=600",
    detailImage: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?auto=format&fit=crop&q=80&w=1200&h=675",
    imageCaption: "비난과 방어를 멈추고 서로의 마음에 따뜻하게 닿는 부부 비폭력 대화",
    readTime: "4분 읽기",
    summary: "서로에게 상처를 주는 비난의 대화를 멈추고, '관찰-느낌-욕구-부탁'의 4단계 비폭력 대화로 진심을 전하는 부부 관계 회복 가이드입니다.",
    sections: [
      {
        paragraphs: [
          '부부 갈등의 90%는 사건 자체가 아니라 대화의 방식에서 시작됩니다. 서로를 비난하거나 방어하는 태도 대신 내 감정과 욕구를 솔직하게 표현하는 소통법이 필요합니다.'
        ],
        points: [
          {
            title: "관찰(Observation): 판단 없이 사실만 말하기",
            desc: '"당신은 항상 늦어" 대신 "어제 약속 시간보다 30분 늦게 왔네"라고 사실만 전달합니다.'
          },
          {
            title: "느낌(Feeling): 나의 순수한 감정 표현하기",
            desc: '"화가 났어" 밑에 숨겨진 "서운하고 걱정됐어"라는 진짜 감정을 나눕니다.'
          },
          {
            title: "부탁(Request): 긍정적이고 구체적인 언어로 요청하기",
            desc: '"신경 좀 써" 대신 "늦을 때는 미리 문자 한 통 남겨주면 좋겠어"라고 제안합니다.'
          }
        ]
      }
    ],
    closingQuote: "상대방을 바꾸려 하기보다, 나의 마음을 정직하고 부드럽게 표현하는 것부터 소통이 시작됩니다.",
    closingNoteTitle: "서로를 보듬는 부부 대화 처방전",
    closingNote: "반복되는 오해와 갈등으로 마음의 거리가 멀어졌다면, 부부·가족 상담을 통해 서로의 애착 욕구와 상처를 안전하게 털어놓고 새로운 소통의 길을 열어갈 수 있습니다.",
    targetAudience: "행복바람심리상담연구소는 부부 및 가족 간의 건강한 소통과 관계 회복을 전문적으로 지원합니다."
  }
];

const categories = ["전체", "아동/청소년", "성인/직장인", "부부/가족"];

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [activeArticle, setActiveArticle] = useState<ColumnArticle | null>(null);
  const [modalProgress, setModalProgress] = useState(0);

  const handleOpenArticle = (article: ColumnArticle) => {
    setActiveArticle(article);
    setModalProgress(0);
  };

  const filteredColumns = selectedCategory === "전체" 
    ? columns 
    : columns.filter(col => col.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-beige/20 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3">
            Community & Insights
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">커뮤니티</h1>
          <p className="text-brand-brown/70 max-w-2xl mx-auto leading-relaxed">
            상담에 대한 궁금증을 풀어주는 FAQ와 <br className="hidden sm:inline" />
            마음의 치유와 건강한 성장을 돕는 <strong className="text-brand-brown font-semibold">전문가 칼럼</strong>을 만나보세요.
          </p>
        </div>

        {/* Secret Policy Banner */}
        <div className="mb-16 p-6 sm:p-8 bg-white/80 backdrop-blur rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-brand-sage/20 shadow-sm">
          <div className="bg-brand-sage/10 p-4 rounded-2xl text-brand-sage shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-brand-brown mb-1.5 flex items-center justify-center md:justify-start gap-2">
              <span>철저한 비밀보장 및 개인정보 보호 원칙</span>
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage">100% 비의료기관</span>
            </h3>
            <p className="text-brand-brown/70 text-sm leading-relaxed">
              행복바람심리상담연구소는 한국상담심리학회 윤리강령을 엄격히 준수합니다. 국민건강보험공단 진료 기록이 남지 않으며, 
              내담자의 모든 상담 내용과 개인정보는 외부 유출 없이 안전하게 보호됩니다.
            </p>
          </div>
          <Link
            to="/confidentiality"
            className="shrink-0 px-4 py-2.5 text-xs font-bold text-brand-sage bg-brand-sage/10 hover:bg-brand-sage hover:text-white rounded-xl transition-all flex items-center gap-1.5"
          >
            비밀보장 서약 보기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* FAQ Section (5 cols) */}
          <section className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-sage/10 rounded-xl text-brand-sage">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">자주 묻는 질문 (FAQ)</h2>
                <p className="text-xs text-brand-brown/60">방문 전 가장 많이 질문하시는 상담 절차와 비용입니다.</p>
              </div>
            </div>
            
            <FAQ showHeader={false} limit={6} />
          </section>

          {/* Expert Column Section (7 cols) */}
          <section className="lg:col-span-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-sage/10 rounded-xl text-brand-sage">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown">전문가 칼럼</h2>
                  <p className="text-xs text-brand-brown/60">행복바람 전문가들이 전하는 마음 돌봄 이야기</p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/80 rounded-xl border border-brand-green/20 self-start sm:self-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                      selectedCategory === cat
                        ? "bg-brand-sage text-white shadow-sm"
                        : "text-brand-brown/60 hover:text-brand-brown hover:bg-brand-beige/50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {filteredColumns.map((column) => (
                <motion.div 
                  key={column.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleOpenArticle(column)}
                  className="bg-white rounded-2xl p-5 border border-brand-green/20 hover:border-brand-sage/40 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-5 group"
                >
                  <div className="sm:w-36 sm:h-36 w-full h-44 rounded-xl overflow-hidden shrink-0 relative">
                    <img 
                      src={column.image} 
                      alt={column.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-brown/85 text-white backdrop-blur">
                      {column.category}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-xs text-brand-brown/50">
                        <span className="font-semibold text-brand-sage">글쓴이 : {column.author}</span>
                        <span>•</span>
                        <span>{column.date}</span>
                        <span>•</span>
                        <span>{column.readTime}</span>
                      </div>
                      
                      <h3 className="font-bold text-base sm:text-lg text-brand-brown mb-2 group-hover:text-brand-sage transition-colors line-clamp-2">
                        {column.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-brand-brown/70 line-clamp-2 mb-3 leading-relaxed">
                        {column.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-brand-beige/50">
                      <span className="text-[11px] text-brand-brown/50">{column.authorTitle}</span>
                      <span className="text-xs font-bold text-brand-sage group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        칼럼 전문 읽기
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredColumns.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-brand-green/30">
                  <p className="text-sm text-brand-brown/60">해당 카테고리의 칼럼이 아직 준비 중입니다.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-brand-sage/20 my-auto"
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-6 border-b border-brand-beige/60 flex items-center justify-between bg-brand-beige/30 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sage text-white">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-brand-brown/60 font-medium">
                    전문가 칼럼
                  </span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-full hover:bg-white text-brand-brown/60 hover:text-brand-brown transition-all cursor-pointer"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Reading Progress Bar */}
              <div 
                role="progressbar"
                aria-label="칼럼 읽기 진행률"
                aria-valuenow={Math.round(modalProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-1 bg-brand-green/20 relative overflow-hidden shrink-0"
              >
                <div 
                  className="h-full bg-gradient-to-r from-brand-sage to-brand-accent transition-[width] duration-75 ease-out"
                  style={{ width: `${modalProgress}%` }}
                />
              </div>

              {/* Scrollable Content */}
              <div 
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const total = el.scrollHeight - el.clientHeight;
                  if (total > 0) {
                    setModalProgress(Math.min(100, Math.max(0, (el.scrollTop / total) * 100)));
                  }
                }}
                className="overflow-y-auto p-6 sm:p-10 space-y-8"
              >
                {/* Title & Author Info */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown mb-4 leading-snug">
                    {activeArticle.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-brand-beige/30 rounded-2xl text-xs text-brand-brown/75">
                    <div className="flex items-center gap-1.5 font-bold text-brand-brown">
                      <User className="w-4 h-4 text-brand-sage" />
                      <span>글쓴이 : {activeArticle.author}</span>
                    </div>
                    <span className="text-brand-brown/30">|</span>
                    <span>{activeArticle.authorTitle}</span>
                    <span className="text-brand-brown/30">|</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-brown/50" />
                      <span>{activeArticle.date}</span>
                    </div>
                  </div>
                </div>

                {/* Hero Cover Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm border border-brand-green/20 bg-brand-beige/30 aspect-[16/9] w-full">
                  <img
                    src={activeArticle.detailImage || activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {activeArticle.imageCaption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-brown/85 via-brand-brown/40 to-transparent p-4 sm:p-5 pt-8 sm:pt-10">
                      <p className="text-xs sm:text-sm text-white/95 font-medium tracking-wide flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-sage shrink-0 inline-block" />
                        {activeArticle.imageCaption}
                      </p>
                    </div>
                  )}
                </div>

                {/* Article Sections */}
                <div className="space-y-8 text-brand-brown/85 leading-relaxed text-sm sm:text-base font-sans">
                  {activeArticle.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      {sec.heading && (
                        <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-brown border-l-4 border-brand-sage pl-3.5 py-0.5 mt-6">
                          {sec.heading}
                        </h2>
                      )}

                      {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-brand-brown/80 leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {sec.points && (
                        <div className="space-y-3.5 mt-3">
                          {sec.points.map((pt, ptIdx) => (
                            <div 
                              key={ptIdx} 
                              className="p-4 rounded-xl bg-brand-beige/40 border border-brand-green/20 flex items-start gap-3.5"
                            >
                              <div className="p-1 rounded-full bg-brand-sage/15 text-brand-sage mt-0.5 shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div className="text-sm">
                                <strong className="text-brand-brown font-semibold block mb-1">
                                  {pt.title}
                                </strong>
                                <span className="text-brand-brown/75 leading-relaxed">
                                  {pt.desc}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Highlight Quote Box */}
                  {activeArticle.closingQuote && (
                    <div className="my-6 p-6 rounded-2xl bg-brand-sage/10 border-l-4 border-brand-sage relative">
                      <p className="font-serif italic text-base sm:text-lg text-brand-brown font-medium leading-relaxed">
                        “{activeArticle.closingQuote}”
                      </p>
                    </div>
                  )}

                  {/* Closing Note */}
                  {activeArticle.closingNote && (
                    <div className="p-5 rounded-2xl bg-brand-beige/40 border border-brand-green/20 text-sm text-brand-brown/80 leading-relaxed">
                      <div className="flex items-center gap-2 font-bold text-brand-brown mb-2">
                        <HeartHandshake className="w-4 h-4 text-brand-sage" />
                        <span>{activeArticle.closingNoteTitle || '마음 처방 및 제언'}</span>
                      </div>
                      <p>{activeArticle.closingNote}</p>
                    </div>
                  )}
                </div>

                {/* Author Card & CTA */}
                <div className="mt-8 p-6 rounded-2xl bg-brand-brown text-white flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div>
                    <span className="text-xs text-brand-sage uppercase font-bold tracking-wider block mb-1">
                      칼럼 기고
                    </span>
                    <h3 className="text-lg font-bold font-serif mb-1">
                      글쓴이 : {activeArticle.author} ({activeArticle.authorTitle})
                    </h3>
                    <p className="text-xs text-white/70">
                      {activeArticle.targetAudience || '행복바람심리상담연구소는 마음의 치유와 건강한 성장을 위해 전문 심리상담을 제공합니다.'}
                    </p>
                  </div>
                  <Link
                    to="/reservation"
                    onClick={() => setActiveArticle(null)}
                    className="shrink-0 px-5 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>전문가 상담 예약하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

