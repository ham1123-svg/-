import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  BookOpen, 
  Bell,
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Calendar, 
  User, 
  Star, 
  Sparkles, 
  X, 
  RefreshCw, 
  AlertCircle, 
  Eye, 
  Tag, 
  ChevronRight,
  HeartHandshake,
  MessageCircleQuestion,
  FileText,
  Clock,
  PhoneCall,
  Edit3,
  Trash2,
  Plus,
  Pin,
  KeyRound,
  Check
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import FAQ from '../components/FAQ';
import ClientSatisfactionAnalytics from '../components/ClientSatisfactionAnalytics';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

// Types
export type CommunityTab = 'faq' | 'column' | 'review' | 'all' | 'notice' | 'qna';

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

interface CommunityNotice {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  views: number;
  is_pinned: number;
  created_at: string;
  updated_at?: string;
}

interface CommunityQnaItem {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'waiting' | 'answered';
  is_private: number;
  created_at: string;
  replied_at?: string;
  content?: string;
  reply?: string;
}

// Expert Columns Data
const columns: ColumnArticle[] = [
  {
    id: 1,
    title: "우리 아이의 산만함, 정말 ADHD일까요?",
    author: "박미경",
    authorTitle: "행복바람심리상담연구소 소장 (교육학 박사)",
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
    authorTitle: "행복바람심리상담연구소 소장 (교육학 박사)",
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
    authorTitle: "행복바람심리상담연구소 소장 (교육학 박사)",
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

const columnCategories = ["전체", "아동/청소년", "성인/직장인", "부부/가족"];

const reviewCategories = [
  { id: 'all', label: '전체 후기' },
  { id: 'adult', label: '성인 · 번아웃' },
  { id: 'couple', label: '부부 · 가족갈등' },
  { id: 'youth', label: '청소년 · 아동정서' },
  { id: 'anxiety', label: '불안 · 자존감' }
];

export default function Community() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const currentTab: CommunityTab = rawTab === 'qna'
    ? 'faq'
    : rawTab && ['faq', 'column', 'review', 'all', 'notice'].includes(rawTab as CommunityTab)
    ? (rawTab as CommunityTab)
    : 'faq';

  const setTab = (tab: CommunityTab) => {
    setSearchParams(tab === 'faq' ? {} : { tab });
  };

  // State for Column
  const [selectedColumnCategory, setSelectedColumnCategory] = useState("전체");
  const [activeArticle, setActiveArticle] = useState<ColumnArticle | null>(null);
  const [modalProgress, setModalProgress] = useState(0);

  // State for Notices
  const [notices, setNotices] = useState<CommunityNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [activeNotice, setActiveNotice] = useState<CommunityNotice | null>(null);

  // Admin Mode state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('hbbr_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Notice Write/Edit Modal state
  const [isNoticeWriteModalOpen, setIsNoticeWriteModalOpen] = useState(false);
  const [editingNoticeItem, setEditingNoticeItem] = useState<CommunityNotice | null>(null);
  const [noticeFormCategory, setNoticeFormCategory] = useState('공지사항');
  const [noticeFormCustomCategory, setNoticeFormCustomCategory] = useState('');
  const [noticeFormTitle, setNoticeFormTitle] = useState('');
  const [noticeFormAuthor, setNoticeFormAuthor] = useState('행복바람 운영팀');
  const [noticeFormContent, setNoticeFormContent] = useState('');
  const [noticeFormIsPinned, setNoticeFormIsPinned] = useState(false);
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);
  const [noticePreviewMode, setNoticePreviewMode] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check admin auth from storage on mount/focus
  useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(sessionStorage.getItem('hbbr_admin_auth') === 'true');
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Latest pinned notice for announcement banner
  const latestPinnedNotice = useMemo(() => {
    return notices.find((n) => n.is_pinned === 1) || notices[0] || null;
  }, [notices]);

  // Open Create Notice
  const handleOpenCreateNotice = () => {
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    setEditingNoticeItem(null);
    setNoticeFormCategory('공지사항');
    setNoticeFormCustomCategory('');
    setNoticeFormTitle('');
    setNoticeFormAuthor('행복바람 운영팀');
    setNoticeFormContent('');
    setNoticeFormIsPinned(false);
    setNoticePreviewMode(false);
    setIsNoticeWriteModalOpen(true);
  };

  // Open Edit Notice
  const handleOpenEditNotice = (item: CommunityNotice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    setEditingNoticeItem(item);
    const standardCategories = ['공지사항', '운영안내', '프로그램모집', '소식/특강', '마음칼럼/정보', '언론보도'];
    if (standardCategories.includes(item.category)) {
      setNoticeFormCategory(item.category);
      setNoticeFormCustomCategory('');
    } else {
      setNoticeFormCategory('직접입력');
      setNoticeFormCustomCategory(item.category);
    }
    setNoticeFormTitle(item.title);
    setNoticeFormAuthor(item.author || '행복바람 운영팀');
    setNoticeFormContent(item.content);
    setNoticeFormIsPinned(item.is_pinned === 1);
    setNoticePreviewMode(false);
    setIsNoticeWriteModalOpen(true);
  };

  // Save Notice (Create or Update)
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeFormTitle.trim() || !noticeFormContent.trim()) {
      alert('제목과 본문 내용을 모두 입력해 주세요.');
      return;
    }

    const cat = noticeFormCategory === '직접입력'
      ? (noticeFormCustomCategory.trim() || '공지사항')
      : noticeFormCategory;

    setNoticeSubmitting(true);
    try {
      const payload = {
        category: cat,
        title: noticeFormTitle.trim(),
        content: noticeFormContent.trim(),
        author: noticeFormAuthor.trim() || '행복바람 운영팀',
        is_pinned: noticeFormIsPinned ? 1 : 0
      };

      if (editingNoticeItem) {
        const res = await fetch(`/api/community/notices/${editingNoticeItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`게시글 "${noticeFormTitle.trim()}"이(가) 수정되었습니다.`);
          setIsNoticeWriteModalOpen(false);
          if (activeNotice && activeNotice.id === editingNoticeItem.id) {
            setActiveNotice(data.notice);
          }
          loadNotices();
        } else {
          alert(data.error || '수정에 실패했습니다.');
        }
      } else {
        const res = await fetch('/api/community/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('새 공지/게시글이 성공적으로 등록되었습니다.');
          setIsNoticeWriteModalOpen(false);
          loadNotices();
        } else {
          alert(data.error || '등록에 실패했습니다.');
        }
      }
    } catch (err) {
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setNoticeSubmitting(false);
    }
  };

  // Delete Notice
  const handleDeleteNotice = async (item: CommunityNotice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    if (!window.confirm(`[${item.title}]\n이 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/community/notices/${item.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('게시글이 삭제되었습니다.');
        if (activeNotice && activeNotice.id === item.id) {
          setActiveNotice(null);
        }
        loadNotices();
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 처리 중 오류가 발생했습니다.');
    }
  };

  // Toggle Pin on Notice
  const handleTogglePinNotice = async (item: CommunityNotice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/community/notices/${item.id}/pin`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || '상단 고정 설정이 변경되었습니다.');
        loadNotices();
      }
    } catch (err) {
      alert('상단 고정 변경 중 오류가 발생했습니다.');
    }
  };

  // Admin Quick Login Handler
  const handleAdminQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('hbbr_admin_auth', 'true');
        setIsAdmin(true);
        setShowAdminLoginModal(false);
        setAdminPasswordInput('');
        showToast('관리자 인증이 완료되었습니다. 이제 글쓰기 및 수정·삭제가 가능합니다.');
        setTimeout(() => {
          handleOpenCreateNotice();
        }, 120);
      } else {
        setAdminLoginError(data.error || '비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      if (adminPasswordInput.trim() === '3485') {
        sessionStorage.setItem('hbbr_admin_auth', 'true');
        setIsAdmin(true);
        setShowAdminLoginModal(false);
        setAdminPasswordInput('');
        showToast('관리자 인증이 완료되었습니다.');
        setTimeout(() => {
          handleOpenCreateNotice();
        }, 120);
      } else {
        setAdminLoginError('로그인 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setAdminLoginLoading(false);
    }
  };

  // State for Reviews
  const [selectedReviewCategory, setSelectedReviewCategory] = useState('all');

  // State for Q&A
  const [qnaList, setQnaList] = useState<CommunityQnaItem[]>([]);
  const [qnaLoading, setQnaLoading] = useState(false);
  const [isWriteQnaOpen, setIsWriteQnaOpen] = useState(false);
  const [qnaForm, setQnaForm] = useState({
    title: '',
    author: '',
    category: '상담신청',
    phone: '',
    password: '',
    content: '',
    is_private: true
  });
  const [qnaSubmitting, setQnaSubmitting] = useState(false);
  const [qnaSubmitSuccess, setQnaSubmitSuccess] = useState(false);

  // State for Password verification modal (Q&A item view)
  const [verifyModalItem, setVerifyModalItem] = useState<CommunityQnaItem | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifiedContent, setVerifiedContent] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Load notices
  const loadNotices = async () => {
    setNoticesLoading(true);
    try {
      const res = await fetch('/api/community/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setNoticesLoading(false);
    }
  };

  // Load Q&A
  const loadQnaList = async () => {
    setQnaLoading(true);
    try {
      const res = await fetch('/api/community/qna');
      if (res.ok) {
        const data = await res.json();
        setQnaList(data);
      }
    } catch (err) {
      console.error('Failed to load Q&A:', err);
    } finally {
      setQnaLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
    loadQnaList();
  }, []);

  const handleOpenNotice = async (notice: CommunityNotice) => {
    setActiveNotice(notice);
    // increment view count
    try {
      fetch(`/api/community/notices/${notice.id}`);
    } catch (e) {
      // ignore
    }
  };

  const handleOpenArticle = (article: ColumnArticle) => {
    setActiveArticle(article);
    setModalProgress(0);
  };

  const filteredColumns = selectedColumnCategory === "전체" 
    ? columns 
    : columns.filter(col => col.category === selectedColumnCategory);

  const filteredReviews = selectedReviewCategory === 'all'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter(t => t.category === selectedReviewCategory);

  // Handle Q&A submit
  const handleQnaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qnaForm.title.trim() || !qnaForm.author.trim() || !qnaForm.password.trim() || !qnaForm.content.trim()) {
      alert('필수 항목(제목, 작성자, 비밀번호 4자리, 문의 내용)을 모두 작성해 주세요.');
      return;
    }

    setQnaSubmitting(true);
    try {
      const res = await fetch('/api/community/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qnaForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setQnaSubmitSuccess(true);
        setQnaForm({
          title: '',
          author: '',
          category: '상담신청',
          phone: '',
          password: '',
          content: '',
          is_private: true
        });
        loadQnaList();
        setTimeout(() => {
          setQnaSubmitSuccess(false);
          setIsWriteQnaOpen(false);
        }, 1800);
      } else {
        alert(data.error || '문의 등록에 실패했습니다.');
      }
    } catch (err) {
      alert('문의 등록 중 오류가 발생했습니다.');
    } finally {
      setQnaSubmitting(false);
    }
  };

  // Handle Q&A verify
  const handleVerifyQna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyModalItem || !inputPassword.trim()) return;

    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch(`/api/community/qna/${verifyModalItem.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword.trim() })
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setVerifiedContent(data);
      } else {
        setVerifyError(data.error || '비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setVerifyError('비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setVerifying(false);
    }
  };

  const closeVerifyModal = () => {
    setVerifyModalItem(null);
    setInputPassword('');
    setVerifyError('');
    setVerifiedContent(null);
  };

  return (
    <div className="min-h-screen bg-brand-beige/20 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification Banner */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 bg-brand-sage text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-sage uppercase px-3.5 py-1.5 bg-brand-sage/10 rounded-full inline-block mb-3">
            Community & Healing Stories
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-3">
            커뮤니티 (마음의 소통과 치유)
          </h1>
          <p className="text-brand-brown/70 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            연구소 공지사항부터 전문가 심리 칼럼, 내담자의 진솔한 회복 수기, <br className="hidden sm:inline" />
            자주 묻는 질문(FAQ)과 <strong className="text-brand-brown font-semibold">1:1 비밀 상담 문의</strong>까지 따뜻하게 만나보세요.
          </p>
        </div>

        {/* Secret Policy & Safe Guarantee Banner */}
        <div className="mb-10 p-5 sm:p-6 bg-white/90 backdrop-blur rounded-3xl flex flex-col md:flex-row items-center gap-5 border border-brand-sage/25 shadow-xs">
          <div className="bg-brand-sage/10 p-3.5 rounded-2xl text-brand-sage shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-brand-brown">
                철저한 100% 비밀보장 및 개인정보 보호 원칙
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                국민건강보험 진료기록 無
              </span>
            </div>
            <p className="text-brand-brown/75 text-xs sm:text-sm leading-relaxed">
              행복바람 심리상담연구소는 한국상담심리학회 및 한국상담학회 윤리강령을 엄격히 준수합니다. 
              비의료 전문상담기관으로 병원 진료 기록이나 보험사 이력이 전혀 남지 않으며, 모든 상담과 문의는 안전하게 암호화됩니다.
            </p>
          </div>
          <Link
            to="/confidentiality"
            className="shrink-0 px-4 py-2 text-xs font-bold text-brand-sage bg-brand-sage/10 hover:bg-brand-sage hover:text-white rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>비밀보장 서약서</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* Top Notice Marquee & Admin Controls Strip */}
        {/* ========================================================================= */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-brand-green/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-800 text-[11px] font-bold flex items-center gap-1 shrink-0 border border-amber-500/20">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>연구소 공지</span>
            </span>
            <div className="flex-1 truncate text-xs sm:text-sm text-brand-brown">
              {latestPinnedNotice ? (
                <button
                  type="button"
                  onClick={() => handleOpenNotice(latestPinnedNotice)}
                  className="hover:text-brand-sage hover:underline truncate text-left font-medium block w-full cursor-pointer"
                >
                  <span className="font-bold text-brand-sage mr-1.5">[{latestPinnedNotice.category}]</span>
                  <span>{latestPinnedNotice.title}</span>
                </button>
              ) : (
                <span className="text-brand-brown/60">행복바람 심리상담연구소 공지 및 소식을 확인하세요.</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setTab(currentTab === 'notice' ? 'faq' : 'notice')}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1",
                currentTab === 'notice'
                  ? "bg-brand-sage text-white"
                  : "bg-brand-beige/50 hover:bg-brand-beige text-brand-brown/80"
              )}
            >
              <span>{currentTab === 'notice' ? '공지 닫기' : '전체공지'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Admin Mode Badge & Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-brand-green/10">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>관리자 모드</span>
                </span>
                <button
                  type="button"
                  onClick={handleOpenCreateNotice}
                  className="px-3 py-1 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>공지 글쓰기</span>
                </button>
                <Link
                  to="/admin"
                  className="px-2.5 py-1 bg-white border border-brand-green/30 hover:border-brand-sage text-brand-brown text-xs font-semibold rounded-xl transition-all"
                >
                  대시보드
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminLoginModal(true)}
                className="px-3 py-1 text-[11px] text-brand-brown/60 hover:text-brand-sage flex items-center gap-1.5 rounded-xl hover:bg-brand-beige/40 transition-colors border border-dashed border-brand-green/30 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-brand-brown/40" />
                <span>관리자 로그인</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3대 핵심 메뉴 창 배열 (Menu Windows Layout) */}
        {/* ========================================================================= */}
        <div className="mb-12">
          {/* Header Title for Menu Arrangement */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-sage animate-pulse" />
              <h2 className="text-sm font-bold text-brand-brown uppercase tracking-wider">
                커뮤니티 3대 핵심 메뉴
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab(currentTab === 'all' ? 'faq' : 'all')}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer",
                  currentTab === 'all'
                    ? "bg-brand-brown text-white border-brand-brown shadow-xs"
                    : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage hover:text-brand-brown"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentTab === 'all' ? '개별 메뉴 창 보기' : '3개 메뉴 한눈에 전체보기'}</span>
              </button>
            </div>
          </div>

          {/* 3-Window Grid Arrangement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 메뉴 창 1: 자주하는 질문 */}
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTab('faq')}
              className={cn(
                "p-6 rounded-3xl text-left transition-all relative overflow-hidden border cursor-pointer flex flex-col justify-between group",
                currentTab === 'faq'
                  ? "bg-white border-brand-sage shadow-md ring-2 ring-brand-sage/40"
                  : "bg-white/85 border-brand-green/25 hover:border-brand-sage/60 hover:bg-white shadow-2xs"
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-sage/10 to-transparent rounded-bl-full pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-2xs",
                    currentTab === 'faq'
                      ? "bg-brand-sage text-white"
                      : "bg-brand-sage/15 text-brand-sage group-hover:bg-brand-sage group-hover:text-white"
                  )}>
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                    currentTab === 'faq' ? "bg-brand-sage text-white" : "bg-brand-beige text-brand-brown/70"
                  )}>
                    MENU 01
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-brand-sage">
                  <span>FAQ &amp; 1:1 비밀상담</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-brand-brown mb-2 flex items-center justify-between">
                  <span>자주하는 질문</span>
                  <ChevronRight className={cn(
                    "w-5 h-5 transition-transform",
                    currentTab === 'faq' ? "text-brand-sage translate-x-1" : "text-brand-brown/30 group-hover:translate-x-1"
                  )} />
                </h3>
                <p className="text-xs text-brand-brown/70 leading-relaxed">
                  상담 비용, 진행 절차, 100% 비밀보장 원칙부터 사전 질문 및 1:1 비밀 문의까지 신속하게 해결해 드립니다.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-brand-green/15 flex items-center justify-between text-xs">
                <span className="text-[11px] text-brand-brown/50 font-medium">8대 핵심 FAQ · 비공개 문의</span>
                <span className={cn(
                  "font-bold flex items-center gap-1 text-xs",
                  currentTab === 'faq' ? "text-brand-sage" : "text-brand-brown/60 group-hover:text-brand-sage"
                )}>
                  {currentTab === 'faq' ? '● 현재 열람 중' : '질문 보러가기 →'}
                </span>
              </div>
            </motion.div>

            {/* 메뉴 창 2: 전문가 심리 칼럼 */}
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTab('column')}
              className={cn(
                "p-6 rounded-3xl text-left transition-all relative overflow-hidden border cursor-pointer flex flex-col justify-between group",
                currentTab === 'column'
                  ? "bg-white border-brand-sage shadow-md ring-2 ring-brand-sage/40"
                  : "bg-white/85 border-brand-green/25 hover:border-brand-sage/60 hover:bg-white shadow-2xs"
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-sage/10 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-2xs",
                    currentTab === 'column'
                      ? "bg-brand-sage text-white"
                      : "bg-brand-sage/15 text-brand-sage group-hover:bg-brand-sage group-hover:text-white"
                  )}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                    currentTab === 'column' ? "bg-brand-sage text-white" : "bg-brand-beige text-brand-brown/70"
                  )}>
                    MENU 02
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-brand-sage">
                  <span>박미경 소장의 마음 처방전</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-brand-brown mb-2 flex items-center justify-between">
                  <span>전문가 심리 칼럼</span>
                  <ChevronRight className={cn(
                    "w-5 h-5 transition-transform",
                    currentTab === 'column' ? "text-brand-sage translate-x-1" : "text-brand-brown/30 group-hover:translate-x-1"
                  )} />
                </h3>
                <p className="text-xs text-brand-brown/70 leading-relaxed">
                  ADHD 감별 기준, 직장인 번아웃 극복 3단계, 부부 비폭력 대화법 등 교육학 박사 박미경 소장의 전문 심리 칼럼입니다.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-brand-green/15 flex items-center justify-between text-xs">
                <span className="text-[11px] text-brand-brown/50 font-medium">박미경 박사 집필 {columns.length}편</span>
                <span className={cn(
                  "font-bold flex items-center gap-1 text-xs",
                  currentTab === 'column' ? "text-brand-sage" : "text-brand-brown/60 group-hover:text-brand-sage"
                )}>
                  {currentTab === 'column' ? '● 현재 열람 중' : '칼럼 읽기 →'}
                </span>
              </div>
            </motion.div>

            {/* 메뉴 창 3: 내담자 상담 후기 */}
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTab('review')}
              className={cn(
                "p-6 rounded-3xl text-left transition-all relative overflow-hidden border cursor-pointer flex flex-col justify-between group",
                currentTab === 'review'
                  ? "bg-white border-brand-sage shadow-md ring-2 ring-brand-sage/40"
                  : "bg-white/85 border-brand-green/25 hover:border-brand-sage/60 hover:bg-white shadow-2xs"
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-2xs",
                    currentTab === 'review'
                      ? "bg-rose-500 text-white"
                      : "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
                  )}>
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                    currentTab === 'review' ? "bg-rose-100 text-rose-800" : "bg-brand-beige text-brand-brown/70"
                  )}>
                    MENU 03
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-rose-600">
                  <span>100% 익명 생생 회복 수기</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-brand-brown mb-2 flex items-center justify-between">
                  <span>내담자 상담 후기</span>
                  <ChevronRight className={cn(
                    "w-5 h-5 transition-transform",
                    currentTab === 'review' ? "text-rose-500 translate-x-1" : "text-brand-brown/30 group-hover:translate-x-1"
                  )} />
                </h3>
                <p className="text-xs text-brand-brown/70 leading-relaxed">
                  마음의 고통을 딛고 회복과 주도권을 되찾은 실제 내담자분들의 진솔한 상담 후기와 박미경 소장의 임상 코멘트입니다.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-brand-green/15 flex items-center justify-between text-xs">
                <span className="text-[11px] text-brand-brown/50 font-medium">실제 회복 후기 {TESTIMONIALS_DATA.length}건</span>
                <span className={cn(
                  "font-bold flex items-center gap-1 text-xs",
                  currentTab === 'review' ? "text-rose-600" : "text-brand-brown/60 group-hover:text-rose-600"
                )}>
                  {currentTab === 'review' ? '● 현재 열람 중' : '후기 읽기 →'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Sub-bar: Active Menu Indicator */}
          <div className="mt-4 px-2 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-brown/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-brown">선택된 영역:</span>
              <span className="font-bold text-brand-sage">
                {currentTab === 'faq' && '1. 자주하는 질문 (FAQ & 1:1 비밀문의)'}
                {currentTab === 'column' && '2. 전문가 심리 칼럼'}
                {currentTab === 'review' && '3. 내담자 상담 후기'}
                {currentTab === 'all' && '전체 3개 메뉴 연속 보기'}
                {currentTab === 'notice' && '연구소 공지사항 & 소식'}
              </span>
            </div>
            {currentTab !== 'faq' && currentTab !== 'all' && (
              <button
                type="button"
                onClick={() => setTab('faq')}
                className="text-brand-sage hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>자주하는 질문으로 이동</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REARRANGED ORDER 1: 자주하는 질문 (FAQ & 1:1 비밀상담 문의) */}
        {/* ========================================================================= */}
        {(currentTab === 'all' || currentTab === 'faq') && (
          <section className="mb-20">
            {/* 1-A. 자주 묻는 질문 (FAQ) Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-brand-green/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-sage/15 rounded-2xl text-brand-sage">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
                    <span>자주하는 질문 (FAQ)</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-sans font-bold">
                      Q&amp;A Guide
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-brown/65">
                    방문 전 가장 많이 궁금해하시는 절차, 비용, 비밀보장, 기록 여부를 알기 쉽게 정리했습니다.
                  </p>
                </div>
              </div>

              {currentTab === 'all' && (
                <button
                  type="button"
                  onClick={() => setTab('faq')}
                  className="text-xs font-bold text-brand-sage hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <span>FAQ &amp; 문의 전용 화면</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-green/20 shadow-xs mb-10">
              <FAQ showHeader={false} limit={currentTab === 'all' ? 6 : undefined} />
            </div>

            {/* 1-B. 1:1 비밀상담 문의 (Private Q&A Board) */}
            <div className="mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-brand-green/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-700">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-brown flex items-center gap-2">
                      <span>1:1 안심 비밀상담 문의</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-bold">
                        100% 비공개 보장
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-brown/65">
                      방문 전 고민되는 점이나 나에게 맞는 프로그램을 편안하게 비밀글로 질문하세요.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWriteQnaOpen(true)}
                  className="px-5 py-2.5 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>비밀 문의 작성하기</span>
                </button>
              </div>

              {/* Q&A List Board */}
              <div className="bg-white rounded-3xl border border-brand-green/20 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-brand-beige/40 border-b border-brand-green/20 text-xs text-brand-brown/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-sage" />
                    <span>
                      비밀글은 작성 시 설정한 <strong>4자리 비밀번호</strong>로만 안전하게 열람 가능합니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={loadQnaList}
                    disabled={qnaLoading}
                    className="text-brand-brown/50 hover:text-brand-brown text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={cn("w-3 h-3", qnaLoading && "animate-spin")} />
                    <span>새로고침</span>
                  </button>
                </div>

                {qnaLoading ? (
                  <div className="py-16 text-center text-brand-brown/60">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-sage" />
                    <p className="text-xs">문의 목록을 불러오는 중입니다...</p>
                  </div>
                ) : qnaList.length === 0 ? (
                  <div className="py-16 text-center text-brand-brown/60">
                    <MessageCircleQuestion className="w-10 h-10 mx-auto mb-2 text-brand-brown/30" />
                    <p className="text-sm font-medium">등록된 문의가 없습니다.</p>
                    <p className="text-xs text-brand-brown/40 mt-1">
                      궁금한 점이 있으시다면 첫 번째 비밀 문의를 남겨보세요.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-green/10">
                    {(currentTab === 'all' ? qnaList.slice(0, 5) : qnaList).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setVerifyModalItem(item);
                          setInputPassword('');
                          setVerifyError('');
                          setVerifiedContent(null);
                        }}
                        className="p-4 sm:p-5 hover:bg-brand-beige/20 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-2 rounded-xl bg-brand-beige text-brand-brown/60 mt-0.5 sm:mt-0 shrink-0">
                            {item.is_private === 1 ? (
                              <Lock className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                                {item.category}
                              </span>
                              <span className="text-xs text-brand-brown/50">
                                작성자 : {item.author}
                              </span>
                              <span className="text-xs text-brand-brown/30">•</span>
                              <span className="text-xs text-brand-brown/50">
                                {item.created_at ? item.created_at.substring(0, 10) : ''}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-brand-brown group-hover:text-brand-sage transition-colors flex items-center gap-1.5">
                              <span>{item.title}</span>
                              {item.is_private === 1 && (
                                <span className="text-[11px] text-brand-brown/40 font-normal">
                                  (비밀글)
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          {item.status === 'answered' ? (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>답변 완료</span>
                            </span>
                          ) : (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>답변 대기중</span>
                            </span>
                          )}

                          <span className="text-xs font-bold text-brand-sage group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                            <span>열람하기</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* REARRANGED ORDER 2: 전문가 심리 칼럼 (Expert Columns) */}
        {/* ========================================================================= */}
        {(currentTab === 'all' || currentTab === 'column') && (
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-brand-green/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-sage/15 rounded-2xl text-brand-sage">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
                    <span>전문가 심리 칼럼</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-sans font-bold">
                      Expert Columns
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-brown/65">
                    교육학 박사 박미경 소장이 전하는 과학적이고 따뜻한 마음 돌봄 이야기
                  </p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/80 rounded-xl border border-brand-green/20 self-start sm:self-auto">
                {columnCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedColumnCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                      selectedColumnCategory === cat
                        ? "bg-brand-sage text-white shadow-xs"
                        : "text-brand-brown/60 hover:text-brand-brown hover:bg-brand-beige/50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredColumns.map((column) => (
                <motion.div 
                  key={column.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleOpenArticle(column)}
                  className="bg-white rounded-2xl p-5 border border-brand-green/20 hover:border-brand-sage/40 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-5 group"
                >
                  <div className="sm:w-44 sm:h-36 w-full h-44 rounded-xl overflow-hidden shrink-0 relative bg-brand-beige/30">
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
                        <span className="font-semibold text-brand-sage">글쓴이 : {column.author} 소장</span>
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

                    <div className="flex items-center justify-between pt-2 border-t border-brand-beige/60">
                      <span className="text-[11px] text-brand-brown/50">{column.authorTitle}</span>
                      <span className="text-xs font-bold text-brand-sage group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        칼럼 전문 읽기
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* REARRANGED ORDER 3: 내담자 상담 후기 (Stories & Reviews) */}
        {/* ========================================================================= */}
        {(currentTab === 'all' || currentTab === 'review') && (
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-brand-green/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
                    <span>내담자 상담 후기</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-sans font-bold">
                      100% 익명 보장
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-brown/65">
                    어둠 속에서 다시 한 걸음을 내딛은 소중한 분들의 실제 치유와 변화의 기록입니다.
                  </p>
                </div>
              </div>

              {/* Review Category Filter */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/80 rounded-xl border border-brand-green/20 self-start sm:self-auto">
                {reviewCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedReviewCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                      selectedReviewCategory === cat.id
                        ? "bg-brand-sage text-white shadow-xs"
                        : "text-brand-brown/60 hover:text-brand-brown hover:bg-brand-beige/50"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Client Satisfaction Analytics with Radar & Bar Chart */}
            <ClientSatisfactionAnalytics />

            <div className="grid md:grid-cols-2 gap-6">
              {(currentTab === 'all' ? filteredReviews.slice(0, 4) : filteredReviews).map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-green/20 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                            {rev.categoryLabel}
                          </span>
                          <span className="text-[11px] text-brand-brown/50">{rev.programTaken}</span>
                        </div>
                        <h4 className="font-bold text-sm text-brand-brown flex items-center gap-1.5">
                          <span>{rev.clientName}</span>
                          <span className="text-xs font-normal text-brand-brown/60">({rev.ageGroupAndRole})</span>
                        </h4>
                      </div>

                      <div className="flex items-center text-amber-400 gap-0.5 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Headline */}
                    <p className="text-sm font-bold font-serif text-brand-brown leading-snug mb-3">
                      {rev.headline}
                    </p>

                    {/* Story */}
                    <p className="text-xs sm:text-sm text-brand-brown/75 leading-relaxed mb-4">
                      {rev.story}
                    </p>

                    {/* Before & After comparison */}
                    <div className="grid sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-brand-beige/40 border border-brand-green/15 text-xs mb-4">
                      <div>
                        <span className="font-bold text-rose-700 block mb-0.5">상담 전 상태</span>
                        <p className="text-brand-brown/70 leading-relaxed text-[11px]">{rev.beforeState}</p>
                      </div>
                      <div className="sm:border-l sm:border-brand-green/20 sm:pl-3">
                        <span className="font-bold text-emerald-700 block mb-0.5">상담 후 변화</span>
                        <p className="text-brand-brown/70 leading-relaxed text-[11px]">{rev.afterState}</p>
                      </div>
                    </div>

                    {/* Counselor Insight */}
                    <div className="p-3 rounded-xl bg-brand-sage/5 border-l-3 border-brand-sage text-[11px] text-brand-brown/80 mb-4">
                      <strong className="text-brand-brown font-semibold block mb-0.5">
                        박미경 소장의 임상 코멘트
                      </strong>
                      <p className="leading-relaxed">{rev.counselorInsight}</p>
                    </div>
                  </div>

                  {/* Footer & Tags */}
                  <div className="pt-3 border-t border-brand-beige/60 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {rev.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] text-brand-brown/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/reservation"
                      className="font-bold text-brand-sage hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>상담 신청하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {currentTab === 'all' && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setTab('review')}
                  className="px-6 py-2.5 bg-white border border-brand-green/30 text-brand-brown rounded-xl text-xs font-bold hover:bg-brand-beige/40 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>내담자 후기 더보기 (총 {TESTIMONIALS_DATA.length}건)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* OPTIONAL/ADMIN VIEW: 연구소 공지 & 소식 (Notice & News) */}
        {/* ========================================================================= */}
        {currentTab === 'notice' && (
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-brand-green/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-sage/15 rounded-2xl text-brand-sage">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown flex items-center gap-2">
                    <span>연구소 공지 &amp; 소식</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-sage/15 text-brand-sage font-sans font-bold">
                      Notice &amp; News
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-brown/65">
                    행복바람의 운영 일정, 힐링 워크숍 모집 공고 및 박미경 소장 특강 소식을 전합니다.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Admin Controls & Return */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {isAdmin ? (
                  <>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>관리자 모드</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenCreateNotice}
                      className="px-3.5 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>공지 글쓰기</span>
                    </button>
                    <Link
                      to="/admin"
                      className="px-3 py-2 bg-white border border-brand-green/30 hover:border-brand-sage text-brand-brown text-xs font-semibold rounded-xl transition-all"
                    >
                      관리자 대시보드
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(true)}
                    className="px-3 py-1.5 text-xs text-brand-brown/60 hover:text-brand-sage flex items-center gap-1.5 rounded-xl hover:bg-brand-beige/40 transition-colors border border-dashed border-brand-green/30 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-brand-brown/40" />
                    <span>관리자 글쓰기</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setTab('faq')}
                  className="px-3 py-2 bg-brand-beige/50 hover:bg-brand-beige text-brand-brown text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>3대 메뉴로 돌아가기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {noticesLoading ? (
              <div className="py-12 text-center text-brand-brown/60">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-sage" />
                <p className="text-xs">공지사항을 불러오는 중입니다...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {notices.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    onClick={() => handleOpenNotice(item)}
                    className="p-5 rounded-2xl bg-white border border-brand-green/20 hover:border-brand-sage/40 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    {/* Admin Action Toolbar on card */}
                    {isAdmin && (
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex items-center justify-between pb-2 mb-2.5 border-b border-brand-green/10 text-xs"
                      >
                        <button
                          type="button"
                          onClick={(e) => handleTogglePinNotice(item, e)}
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer",
                            item.is_pinned === 1 ? "bg-rose-100 text-rose-700" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          )}
                          title="상단 고정 토글"
                        >
                          <Pin className={cn("w-3 h-3", item.is_pinned === 1 && "fill-current")} />
                          <span>{item.is_pinned === 1 ? '고정해제' : '상단고정'}</span>
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditNotice(item, e)}
                            className="px-2 py-0.5 rounded bg-brand-sage/10 text-brand-sage hover:bg-brand-sage hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>수정</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteNotice(item, e)}
                            className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {item.is_pinned === 1 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                              중요 공지
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-brand-brown/50">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.created_at ? item.created_at.substring(0, 10) : ''}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-brand-brown group-hover:text-brand-sage transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-brand-brown/70 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-brand-green/10 flex items-center justify-between text-xs text-brand-brown/60">
                      <span>{item.author}</span>
                      <span className="font-bold text-brand-sage group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        상세보기
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* Bottom CTA Banner */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-brown to-brand-brown/90 text-white text-center shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-sage px-3 py-1 bg-white/10 rounded-full inline-block mb-3">
              Healing Journey
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
              마음의 무게를 혼자 짊어지지 마세요
            </h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
              10,000+ 시간 임상 경험의 교육학 박사 박미경 소장이 온전한 환대와 따뜻한 마음으로 당신의 회복 여정을 함께합니다.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/reservation"
                className="px-6 py-3 bg-brand-sage hover:bg-brand-sage/90 text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>온라인 상담 예약하기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:052-254-0230"
                className="px-6 py-3 bg-white/15 hover:bg-white/20 text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2 border border-white/20"
              >
                <PhoneCall className="w-4 h-4" />
                <span>전화 문의 (052-254-0230)</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* Notice Reader Modal */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNotice(null)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-brand-sage/20 my-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige/80 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sage/10 text-brand-sage">
                    {activeNotice.category}
                  </span>
                  <span className="text-xs text-brand-brown/50">
                    {activeNotice.created_at ? activeNotice.created_at.substring(0, 10) : ''}
                  </span>
                </div>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="p-1.5 rounded-full hover:bg-brand-beige text-brand-brown/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-brown mb-4 leading-snug">
                {activeNotice.title}
              </h2>

              <div className="text-xs text-brand-brown/60 mb-6 flex items-center gap-3">
                <span>작성자: {activeNotice.author}</span>
                <span>•</span>
                <span>조회수: {activeNotice.views}회</span>
              </div>

              <div className="text-brand-brown/85 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-8 bg-brand-beige/20 p-5 rounded-2xl border border-brand-green/15">
                {activeNotice.content}
              </div>

              {/* Admin Toolbar in Detail Modal */}
              {isAdmin && (
                <div className="mb-5 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>관리자 권한: 게시글을 바로 수정하거나 삭제할 수 있습니다.</span>
                  </span>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const target = activeNotice;
                        setActiveNotice(null);
                        handleOpenEditNotice(target);
                      }}
                      className="px-3 py-1.5 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>수정하기</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = activeNotice;
                        handleDeleteNotice(target);
                      }}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>삭제하기</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-beige/80">
                <button
                  type="button"
                  onClick={() => setActiveNotice(null)}
                  className="px-5 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                >
                  닫기
                </button>
                <Link
                  to="/reservation"
                  onClick={() => setActiveNotice(null)}
                  className="px-5 py-2.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-sm flex items-center gap-1.5"
                >
                  <span>상담 및 프로그램 신청</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Q&A Write Modal */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isWriteQnaOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteQnaOpen(false)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-brand-sage/20 my-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-beige/80 mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold font-serif text-lg text-brand-brown">
                    1:1 안심 비밀상담 문의 작성
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWriteQnaOpen(false)}
                  className="p-1.5 rounded-full hover:bg-brand-beige text-brand-brown/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {qnaSubmitSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg text-brand-brown mb-1">
                    비밀 문의가 안전하게 등록되었습니다!
                  </h4>
                  <p className="text-xs text-brand-brown/70">
                    전문 상담사가 검토 후 정성껏 답변을 남겨드립니다. 잠시 후 창이 닫힙니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQnaSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1">
                        작성자 (이름 또는 닉네임) *
                      </label>
                      <input
                        type="text"
                        required
                        value={qnaForm.author}
                        onChange={(e) => setQnaForm({ ...qnaForm, author: e.target.value })}
                        placeholder="예: 김*은"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:outline-none focus:border-brand-sage"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1">
                        열람 비밀번호 (4자리) *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={8}
                        value={qnaForm.password}
                        onChange={(e) => setQnaForm({ ...qnaForm, password: e.target.value })}
                        placeholder="답변 열람용 숫자 4자리"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:outline-none focus:border-brand-sage"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1">
                        문의 유형
                      </label>
                      <select
                        value={qnaForm.category}
                        onChange={(e) => setQnaForm({ ...qnaForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:outline-none focus:border-brand-sage bg-white"
                      >
                        <option value="상담신청">상담 신청 / 프로그램 문의</option>
                        <option value="비용/시간">상담 비용 &amp; 진행 시간</option>
                        <option value="비밀보장">비밀보장 &amp; 기록 관리</option>
                        <option value="부부/가족">부부 및 가족 갈등</option>
                        <option value="청소년/아동">청소년 및 아동 심리</option>
                        <option value="기타문의">기타 문의사항</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1">
                        연락처 (선택 - 답변 알림용)
                      </label>
                      <input
                        type="tel"
                        value={qnaForm.phone}
                        onChange={(e) => setQnaForm({ ...qnaForm, phone: e.target.value })}
                        placeholder="010-0000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:outline-none focus:border-brand-sage"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1">
                      문의 제목 *
                    </label>
                    <input
                      type="text"
                      required
                      value={qnaForm.title}
                      onChange={(e) => setQnaForm({ ...qnaForm, title: e.target.value })}
                      placeholder="궁금하신 점의 핵심을 입력해 주세요."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:outline-none focus:border-brand-sage"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-brown mb-1">
                      문의 내용 *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={qnaForm.content}
                      onChange={(e) => setQnaForm({ ...qnaForm, content: e.target.value })}
                      placeholder="상담을 고민 중인 상황이나 궁금하신 점을 편안하게 적어주세요. 전문 상담사가 비밀리에 정성껏 답변을 드립니다."
                      className="w-full p-3.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:outline-none focus:border-brand-sage resize-none"
                    />
                  </div>

                  <div className="p-3 bg-brand-beige/40 rounded-xl text-xs text-brand-brown/70 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={qnaForm.is_private}
                        onChange={(e) => setQnaForm({ ...qnaForm, is_private: e.target.checked })}
                        className="rounded text-brand-sage focus:ring-brand-sage"
                      />
                      <span>비공개 비밀글로 작성 (권장)</span>
                    </label>
                    <span className="text-[11px] text-brand-brown/50">
                      비밀번호로 본인만 확인 가능
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-beige/80">
                    <button
                      type="button"
                      onClick={() => setIsWriteQnaOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={qnaSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{qnaSubmitting ? '등록 중...' : '비밀 문의 등록하기'}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Q&A Password Verification & Detail Modal */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {verifyModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVerifyModal}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-brand-sage/20 my-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-brand-beige/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                    {verifyModalItem.category}
                  </span>
                  <span className="text-xs text-brand-brown/50">
                    작성자: {verifyModalItem.author}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeVerifyModal}
                  className="p-1.5 rounded-full hover:bg-brand-beige text-brand-brown/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!verifiedContent ? (
                <div>
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base font-serif text-brand-brown mb-1">
                      비밀글 열람 비밀번호 확인
                    </h3>
                    <p className="text-xs text-brand-brown/65 mb-4">
                      작성 시 설정하신 4자리 비밀번호를 입력해 주세요.
                    </p>
                    <p className="text-xs font-semibold text-brand-brown mb-5 bg-brand-beige/30 p-2.5 rounded-xl border border-brand-green/20">
                      "{verifyModalItem.title}"
                    </p>
                  </div>

                  <form onSubmit={handleVerifyQna} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        required
                        autoFocus
                        value={inputPassword}
                        onChange={(e) => {
                          setInputPassword(e.target.value);
                          setVerifyError('');
                        }}
                        placeholder="비밀번호 4자리 입력"
                        className="w-full px-4 py-3 text-center tracking-widest text-lg rounded-xl border border-brand-green/30 focus:outline-none focus:border-brand-sage"
                      />
                      {verifyError && (
                        <p className="text-xs text-rose-600 font-bold mt-2 text-center flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{verifyError}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeVerifyModal}
                        className="flex-1 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        disabled={verifying}
                        className="flex-1 py-2.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{verifying ? '확인 중...' : '비밀글 열람하기'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-lg font-serif text-brand-brown mb-1.5">
                      {verifiedContent.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-brand-brown/50">
                      <span>{verifiedContent.author} 님</span>
                      <span>•</span>
                      <span>{verifiedContent.created_at ? verifiedContent.created_at.substring(0, 16) : ''}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/20">
                    <span className="text-[11px] font-bold text-brand-brown/60 uppercase block mb-1">
                      질문 내용
                    </span>
                    <p className="text-xs sm:text-sm text-brand-brown/85 leading-relaxed whitespace-pre-line">
                      {verifiedContent.content}
                    </p>
                  </div>

                  {verifiedContent.reply ? (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs sm:text-sm mb-1.5">
                        <HeartHandshake className="w-4 h-4 text-emerald-600" />
                        <span>전문 상담사 답변 (박미경 소장)</span>
                        <span className="text-[10px] text-emerald-600 font-normal">
                          {verifiedContent.replied_at ? verifiedContent.replied_at.substring(0, 16) : ''}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-brand-brown/90 leading-relaxed whitespace-pre-line">
                        {verifiedContent.reply}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        전문 상담사가 질문을 확인 중입니다. 빠른 시간 내에 정성껏 답변을 작성해 드리겠습니다.
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-brand-beige/80">
                    <button
                      type="button"
                      onClick={closeVerifyModal}
                      className="px-4 py-2 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                    >
                      창 닫기
                    </button>
                    <Link
                      to="/reservation"
                      onClick={closeVerifyModal}
                      className="px-4 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-xs flex items-center gap-1.5"
                    >
                      <span>1:1 방문상담 예약하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Article Reader Modal (Column) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-brand-sage/20 my-auto"
            >
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
                  className="h-full bg-gradient-to-r from-brand-sage to-brand-brown transition-[width] duration-75 ease-out"
                  style={{ width: `${modalProgress}%` }}
                />
              </div>

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
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-brown mb-4 leading-snug">
                    {activeArticle.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-brand-beige/30 rounded-2xl text-xs text-brand-brown/75">
                    <div className="flex items-center gap-1.5 font-bold text-brand-brown">
                      <User className="w-4 h-4 text-brand-sage" />
                      <span>글쓴이 : {activeArticle.author} 소장</span>
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

                <div className="relative rounded-2xl overflow-hidden shadow-xs border border-brand-green/20 bg-brand-beige/30 aspect-[16/9] w-full">
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

                  {activeArticle.closingQuote && (
                    <div className="my-6 p-6 rounded-2xl bg-brand-sage/10 border-l-4 border-brand-sage relative">
                      <p className="font-serif italic text-base sm:text-lg text-brand-brown font-medium leading-relaxed">
                        “{activeArticle.closingQuote}”
                      </p>
                    </div>
                  )}

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

      {/* ========================================================================= */}
      {/* Modal: Admin Notice Write / Edit Modal */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNoticeWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNoticeWriteModalOpen(false)}
              className="fixed inset-0 bg-brand-brown/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-sage/20 my-auto flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-brand-beige/80 bg-brand-beige/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-sage text-white flex items-center justify-center shadow-xs">
                    {editingNoticeItem ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-lg text-brand-brown">
                      {editingNoticeItem ? '공지 게시글 수정하기' : '커뮤니티 공지/게시글 작성'}
                    </h3>
                    <p className="text-xs text-brand-brown/60">
                      {editingNoticeItem ? '수정한 내용은 커뮤니티 페이지에 즉시 반영됩니다.' : '관리자 권한으로 새로운 공지 또는 소식을 등록합니다.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNoticePreviewMode(!noticePreviewMode)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1",
                      noticePreviewMode
                        ? "bg-brand-sage text-white border-brand-sage"
                        : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage"
                    )}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{noticePreviewMode ? '편집하기' : '미리보기'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsNoticeWriteModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-brand-beige text-brand-brown/60 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                {noticePreviewMode ? (
                  <div className="bg-brand-beige/20 p-6 rounded-2xl border border-brand-green/20 space-y-4">
                    <div className="flex items-center gap-2">
                      {noticeFormIsPinned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          중요 공지
                        </span>
                      )}
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                        {noticeFormCategory === '직접입력' ? (noticeFormCustomCategory || '공지사항') : noticeFormCategory}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-brand-brown leading-snug">
                      {noticeFormTitle || '(제목을 입력해 주세요)'}
                    </h2>

                    <div className="text-xs text-brand-brown/60 flex items-center gap-2 border-b border-brand-green/10 pb-3">
                      <span>작성자: {noticeFormAuthor || '행복바람 운영팀'}</span>
                      <span>•</span>
                      <span>등록일: {new Date().toISOString().substring(0, 10)}</span>
                    </div>

                    <div className="text-sm sm:text-base text-brand-brown/85 leading-relaxed whitespace-pre-line pt-2">
                      {noticeFormContent || '(본문 내용을 입력해 주세요)'}
                    </div>
                  </div>
                ) : (
                  <form id="community-notice-form" onSubmit={handleSaveNotice} className="space-y-5">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-bold text-brand-brown mb-1.5">
                        카테고리 선택 *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        {['공지사항', '운영안내', '프로그램모집', '소식/특강', '마음칼럼/정보', '언론보도'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setNoticeFormCategory(cat);
                              setNoticeFormCustomCategory('');
                            }}
                            className={cn(
                              "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer",
                              noticeFormCategory === cat
                                ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                                : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage/60"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNoticeFormCategory('직접입력')}
                          className={cn(
                            "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer",
                            noticeFormCategory === '직접입력'
                              ? "bg-brand-sage text-white border-brand-sage shadow-xs"
                              : "bg-white text-brand-brown/70 border-brand-green/30 hover:border-brand-sage/60"
                          )}
                        >
                          + 직접 입력
                        </button>
                      </div>

                      {noticeFormCategory === '직접입력' && (
                        <input
                          type="text"
                          value={noticeFormCustomCategory}
                          onChange={(e) => setNoticeFormCustomCategory(e.target.value)}
                          placeholder="새로운 카테고리명을 입력하세요 (예: 심리특강안내)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:border-brand-sage outline-none bg-brand-beige/10"
                        />
                      )}
                    </div>

                    {/* Author & Pin option */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-brown mb-1.5">
                          작성자 이름 / 직책 *
                        </label>
                        <input
                          type="text"
                          required
                          value={noticeFormAuthor}
                          onChange={(e) => setNoticeFormAuthor(e.target.value)}
                          placeholder="예: 박미경 소장 또는 행복바람 운영팀"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-green/30 text-xs sm:text-sm focus:border-brand-sage outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-brown mb-1.5">
                          상단 중요 공지 고정
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-brand-green/30 bg-brand-beige/20 cursor-pointer hover:bg-brand-beige/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={noticeFormIsPinned}
                            onChange={(e) => setNoticeFormIsPinned(e.target.checked)}
                            className="rounded text-brand-sage focus:ring-brand-sage w-4 h-4"
                          />
                          <span className="text-xs font-semibold text-brand-brown">
                            목록 상단에 고정 표시하기
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-brand-brown">
                          게시글 제목 *
                        </label>
                        <span className="text-[11px] text-brand-brown/50">
                          {noticeFormTitle.length}자
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={noticeFormTitle}
                        onChange={(e) => setNoticeFormTitle(e.target.value)}
                        placeholder="공지 또는 전달하고자 하는 소식의 제목을 입력하세요."
                        className="w-full px-4 py-3 rounded-xl border border-brand-green/30 text-sm sm:text-base font-semibold focus:border-brand-sage outline-none"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-brand-brown">
                          본문 내용 *
                        </label>
                        <span className="text-[11px] text-brand-brown/50">
                          {noticeFormContent.length}자
                        </span>
                      </div>
                      <textarea
                        required
                        rows={12}
                        value={noticeFormContent}
                        onChange={(e) => setNoticeFormContent(e.target.value)}
                        placeholder="상세한 안내 내용을 작성해 주세요. 문단 구분과 줄바꿈이 그대로 반영됩니다."
                        className="w-full p-4 rounded-xl border border-brand-green/30 text-xs sm:text-sm leading-relaxed focus:border-brand-sage outline-none resize-y"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-brand-beige/80 bg-brand-beige/20 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNoticeWriteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                >
                  취소
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNoticePreviewMode(!noticePreviewMode)}
                    className="px-4 py-2.5 rounded-xl border border-brand-green/30 text-brand-brown text-xs font-bold hover:bg-brand-beige/40 cursor-pointer"
                  >
                    {noticePreviewMode ? '편집 계속하기' : '미리보기'}
                  </button>

                  <button
                    type="submit"
                    form="community-notice-form"
                    disabled={noticeSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {noticeSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{noticeSubmitting ? '저장 중...' : (editingNoticeItem ? '수정 완료' : '게시글 등록')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Modal: Admin Login Prompt Modal */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-brand-green/30"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold font-serif text-brand-brown">
                  관리자 모드 인증
                </h3>
                <p className="text-xs text-brand-brown/60 mt-1">
                  커뮤니티 글 작성 및 수정·삭제 권한을 활성화하기 위해 관리자 비밀번호를 입력해 주세요.
                </p>
              </div>

              <form onSubmit={handleAdminQuickLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="password"
                      autoFocus
                      required
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        setAdminLoginError('');
                      }}
                      placeholder="관리자 비밀번호 입력"
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-brand-green/40 focus:border-brand-sage outline-none text-sm text-brand-brown bg-brand-beige/10"
                    />
                    <KeyRound className="w-4 h-4 text-brand-brown/40 absolute left-3.5 top-3.5" />
                  </div>
                  {adminLoginError && (
                    <p className="text-xs text-rose-600 font-bold mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{adminLoginError}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLoginModal(false);
                      setAdminPasswordInput('');
                      setAdminLoginError('');
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-brand-brown/20 text-brand-brown text-xs font-bold hover:bg-brand-beige/50 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={adminLoginLoading}
                    className="flex-1 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-sage/90 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {adminLoginLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>인증하고 글쓰기</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
