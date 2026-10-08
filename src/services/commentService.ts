export interface PostComment {
  id: string;
  postId: string;
  authorNickname: string;
  badge: '따뜻한 응원' | '깊은 공감' | '용기에 감사해요' | '함께 걸어가요' | '온전한 지지';
  content: string;
  likeCount: number;
  createdAt: string;
}

const STORAGE_KEY = 'hbbr_community_comments_v1';
const EVENT_NAME = 'hbbr_comments_changed';

// Initial seed comments for realistic, supportive community warmth
const INITIAL_SEED_COMMENTS: PostComment[] = [
  {
    id: 'comm-seed-1',
    postId: 't-7',
    authorNickname: '비슷한 경험을 한 취준생',
    badge: '깊은 공감',
    content: '저도 발표 때마다 심장이 터질 것 같아 자책이 많았는데, 후기를 읽으며 "공포는 없애는 게 아니라 다루는 것"이라는 말씀에 눈물이 났습니다. 큰 용기 얻고 갑니다!',
    likeCount: 24,
    createdAt: '2026-09-16 14:32',
  },
  {
    id: 'comm-seed-2',
    postId: 't-7',
    authorNickname: '따뜻한 동행자',
    badge: '따뜻한 응원',
    content: '졸업 논문 디펜스 멋지게 해내신 것 진심으로 축하드려요! 앞으로의 걸음도 늘 평온과 행복이 함께하길 응원합니다. 🌿',
    likeCount: 18,
    createdAt: '2026-09-17 09:15',
  },
  {
    id: 'comm-seed-3',
    postId: 't-10',
    authorNickname: '마음의 쉼표를 찾는 이',
    badge: '용기에 감사해요',
    content: '타인의 평가와 나의 존재 가치를 분리하는 것, 저에게도 지금 가장 필요한 배움이네요. 솔직한 치유 여정을 나누어주셔서 정말 감사합니다.',
    likeCount: 31,
    createdAt: '2026-09-10 18:20',
  },
  {
    id: 'comm-seed-4',
    postId: 't-8',
    authorNickname: '소상공인 이웃',
    badge: '온전한 지지',
    content: '가장으로서, 사업가로서 홀로 짊어진 무게가 얼마나 무거우셨을지 깊이 공감됩니다. 혼자가 아니라는 걸 기억하시고 늘 건강 챙기시길 바라요!',
    likeCount: 42,
    createdAt: '2026-09-02 21:05',
  },
  {
    id: 'comm-seed-5',
    postId: 't-3',
    authorNickname: '중학생을 둔 엄마',
    badge: '깊은 공감',
    content: '방문을 걸어 잠근 아이를 보며 부모로서 무력감에 얼마나 우셨을지 가슴이 먹먹했습니다. 아이의 손을 다시 잡아주신 그 사랑과 상담사님의 지혜가 큰 위로가 되네요.',
    likeCount: 39,
    createdAt: '2026-08-16 11:40',
  },
  {
    id: 'comm-seed-6',
    postId: 't-2',
    authorNickname: '행복을 꿈꾸는 부부',
    badge: '함께 걸어가요',
    content: '"공격하려던 게 아니라 나를 봐달라는 외침이었다"는 구절이 가슴에 깊이 박힙니다. 저희 부부도 오늘 저녁 손잡고 속마음을 나눠봐야겠습니다. 감사합니다.',
    likeCount: 56,
    createdAt: '2026-07-25 20:10',
  },
];

// Load local comments
function getLocalComments(): PostComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading comments from localStorage:', e);
  }

  // Initialize with seed
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_COMMENTS));
  } catch (e) {}

  return INITIAL_SEED_COMMENTS;
}

function saveLocalComments(comments: PostComment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: comments }));
  } catch (e) {
    console.error('Error saving comments to localStorage:', e);
  }
}

export const commentService = {
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  },

  async getCommentsByPostId(postId: string): Promise<PostComment[]> {
    // 1. Fetch from server API with local fallback
    try {
      const res = await fetch(`/api/community/comments?post_id=${encodeURIComponent(postId)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.comments) && data.comments.length > 0) {
          // Merge with local comments
          const local = getLocalComments();
          const serverIds = new Set(data.comments.map((c: any) => c.id));
          const localNotOnServer = local.filter(c => c.postId === postId && !serverIds.has(c.id));
          return [...data.comments, ...localNotOnServer];
        }
      }
    } catch (e) {
      // Fallback to local
    }

    const all = getLocalComments();
    return all.filter((c) => c.postId === postId);
  },

  async addComment(params: {
    postId: string;
    authorNickname: string;
    badge: PostComment['badge'];
    content: string;
  }): Promise<PostComment> {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComment: PostComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      postId: params.postId,
      authorNickname: params.authorNickname.trim() || '익명의 내담자',
      badge: params.badge || '따뜻한 응원',
      content: params.content.trim(),
      likeCount: 0,
      createdAt: formattedDate,
    };

    // Save locally
    const current = getLocalComments();
    const updated = [newComment, ...current];
    saveLocalComments(updated);

    // Sync to backend API
    try {
      await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
    } catch (e) {}

    return newComment;
  },

  async likeComment(commentId: string): Promise<number> {
    const current = getLocalComments();
    let newLikes = 1;
    const updated = current.map((c) => {
      if (c.id === commentId) {
        newLikes = (c.likeCount || 0) + 1;
        return { ...c, likeCount: newLikes };
      }
      return c;
    });
    saveLocalComments(updated);

    try {
      await fetch(`/api/community/comments/${commentId}/like`, { method: 'POST' });
    } catch (e) {}

    return newLikes;
  },
};
