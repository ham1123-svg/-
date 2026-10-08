import { PostComment } from './commentService';

export interface CommentPushNotification {
  id: string;
  commentId: string;
  postId: string;
  postTitle: string;
  postAuthorName: string;
  postAuthorType?: 'client' | 'anonymous';
  postCategory?: string;
  commentAuthorNickname: string;
  commentBadge: '따뜻한 응원' | '깊은 공감' | '용기에 감사해요' | '함께 걸어가요' | '온전한 지지' | string;
  commentContent: string;
  timestamp: number;
  createdAt: string;
  readByAdmin: boolean;
  readByClient: boolean;
  target: 'both' | 'admin' | 'client';
}

const STORAGE_KEY = 'hbbr_comment_push_notifications_v2';
const EVENT_NAME = 'hbbr_comment_push_event';
const SOUND_KEY = 'hbbr_push_sound_enabled';

// Realistic initial seed push notifications so the UI is immediately alive
const INITIAL_SEED_PUSHES: CommentPushNotification[] = [
  {
    id: 'push-seed-1',
    commentId: 'comm-seed-1',
    postId: 't-7',
    postTitle: '사람들 시선이 두려워 발표만 하면 목소리가 떨리던 제가, 이제는 담담하게 제 생각을 전합니다.',
    postAuthorName: '내담자 Y님 (가명)',
    postAuthorType: 'client',
    postCategory: '대인 불안 · 발표 공포',
    commentAuthorNickname: '비슷한 경험을 한 취준생',
    commentBadge: '깊은 공감',
    commentContent: '저도 발표 때마다 심장이 터질 것 같아 자책이 많았는데, "공포는 없애는 게 아니라 다루는 것"이라는 구절에 큰 위로를 받았습니다!',
    timestamp: Date.now() - 1000 * 60 * 18, // 18 mins ago
    createdAt: '18분 전',
    readByAdmin: false,
    readByClient: false,
    target: 'both',
  },
  {
    id: 'push-seed-2',
    commentId: 'comm-seed-3',
    postId: 't-10',
    postTitle: '끊임없는 자책과 인정 욕구에 시달리던 마음이, 이제는 나 자신을 따뜻하게 안아주는 평온을 찾았습니다.',
    postAuthorName: '내담자 B님 (가명)',
    postAuthorType: 'client',
    postCategory: '성인 심리 · 자존감 회복',
    commentAuthorNickname: '마음의 쉼표를 찾는 이',
    commentBadge: '용기에 감사해요',
    commentContent: '타인의 평가와 나의 존재 가치를 분리하는 것, 저에게도 가장 필요한 배움이네요. 솔직한 치유 여정을 나누어주셔서 정말 감사합니다.',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    createdAt: '45분 전',
    readByAdmin: false,
    readByClient: true,
    target: 'both',
  },
  {
    id: 'push-seed-3',
    commentId: 'comm-seed-4',
    postId: 't-8',
    postTitle: '사업 위기로 매일 가슴이 조여오고 잠들지 못했는데, 인생의 쉼표를 찍고 다시 일어설 용기를 얻었습니다.',
    postAuthorName: '내담자 K님 (가명)',
    postAuthorType: 'client',
    postCategory: '스트레스 · 불면 치유',
    commentAuthorNickname: '소상공인 이웃',
    commentBadge: '온전한 지지',
    commentContent: '가장으로서, 사업가로서 홀로 짊어진 무게가 얼마나 무거우셨을지 깊이 공감됩니다. 혼자가 아니라는 걸 기억하시고 늘 힘내세요!',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    createdAt: '2시간 전',
    readByAdmin: true,
    readByClient: true,
    target: 'both',
  },
];

// Play soft pleasant notification chime using Web Audio API
export function playPushNotificationChime() {
  try {
    const isMuted = localStorage.getItem(SOUND_KEY) === 'false';
    if (isMuted) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Harmonic bell sequence: F5 (698.46) -> A5 (880) -> C6 (1046.5)
    const notes = [
      { freq: 698.46, start: 0, dur: 0.35, gain: 0.12 },
      { freq: 880.0, start: 0.1, dur: 0.45, gain: 0.15 },
      { freq: 1046.5, start: 0.22, dur: 0.65, gain: 0.18 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.start);

      gainNode.gain.setValueAtTime(0.0001, now + n.start);
      gainNode.gain.linearRampToValueAtTime(n.gain, now + n.start + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur + 0.05);
    });
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

function getStoredNotifications(): CommentPushNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse push notifications from storage:', e);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_PUSHES));
  } catch (e) {}
  return INITIAL_SEED_PUSHES;
}

function saveNotifications(list: CommentPushNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: list }));
  } catch (e) {
    console.error('Failed to save push notifications to storage:', e);
  }
}

export const commentPushService = {
  // Subscribe to changes
  subscribe(callback: (list: CommentPushNotification[]) => void): () => void {
    const handler = (e: any) => {
      const detail = e.detail || getStoredNotifications();
      callback(detail);
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  },

  getAll(): CommentPushNotification[] {
    return getStoredNotifications();
  },

  getUnreadCount(reader: 'admin' | 'client'): number {
    const all = getStoredNotifications();
    return all.filter((n) => (reader === 'admin' ? !n.readByAdmin : !n.readByClient)).length;
  },

  markAsRead(id: string, reader: 'admin' | 'client' = 'admin') {
    const all = getStoredNotifications();
    const updated = all.map((n) => {
      if (n.id === id) {
        return reader === 'admin' ? { ...n, readByAdmin: true } : { ...n, readByClient: true };
      }
      return n;
    });
    saveNotifications(updated);
  },

  markAllAsRead(reader: 'admin' | 'client' = 'admin') {
    const all = getStoredNotifications();
    const updated = all.map((n) =>
      reader === 'admin' ? { ...n, readByAdmin: true } : { ...n, readByClient: true }
    );
    saveNotifications(updated);
  },

  deleteNotification(id: string) {
    const all = getStoredNotifications();
    const updated = all.filter((n) => n.id !== id);
    saveNotifications(updated);
  },

  clearAll() {
    saveNotifications([]);
  },

  isSoundEnabled(): boolean {
    return localStorage.getItem(SOUND_KEY) !== 'false';
  },

  setSoundEnabled(enabled: boolean) {
    localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false');
  },

  /**
   * Triggers a push notification when a new comment is posted
   */
  triggerCommentPush(params: {
    commentId: string;
    postId: string;
    postTitle?: string;
    postAuthorName?: string;
    postAuthorType?: 'client' | 'anonymous';
    postCategory?: string;
    commentAuthorNickname: string;
    commentBadge: string;
    commentContent: string;
    target?: 'both' | 'admin' | 'client';
  }): CommentPushNotification {
    const now = Date.now();
    const titleSnippet = (params.postTitle || '내담자 상담 후기').replace(/^["“]|["”]$/g, '').trim();

    const newPush: CommentPushNotification = {
      id: `push-${now}-${Math.random().toString(36).substring(2, 6)}`,
      commentId: params.commentId,
      postId: params.postId,
      postTitle: titleSnippet,
      postAuthorName: params.postAuthorName || '익명의 내담자',
      postAuthorType: params.postAuthorType || 'client',
      postCategory: params.postCategory || '심리상담 후기',
      commentAuthorNickname: params.commentAuthorNickname || '따뜻한 이웃',
      commentBadge: params.commentBadge || '따뜻한 응원',
      commentContent: params.commentContent,
      timestamp: now,
      createdAt: '방금 전',
      readByAdmin: false,
      readByClient: false,
      target: params.target || 'both',
    };

    const current = getStoredNotifications();
    const updated = [newPush, ...current].slice(0, 50); // keep up to 50
    saveNotifications(updated);

    // Play pleasant push notification chime
    playPushNotificationChime();

    // Dispatch global toast event for instant in-app feedback banner
    window.dispatchEvent(
      new CustomEvent('hbbr_comment_push_toast', {
        detail: newPush,
      })
    );

    return newPush;
  },

  /**
   * Convenience simulation helper with realistic empathy messages
   */
  simulateRandomPush(): CommentPushNotification {
    const samplePosts = [
      {
        id: 't-7',
        title: '사람들 시선이 두려워 발표만 하면 목소리가 떨리던 제가, 이제는 담담하게 제 생각을 전합니다.',
        author: '내담자 Y님 (대학원생)',
        category: '대인 불안 · 발표 공포',
      },
      {
        id: 't-10',
        title: '끊임없는 자책과 인정 욕구에 시달리던 마음이, 이제는 나 자신을 따뜻하게 안아주는 평온을 찾았습니다.',
        author: '내담자 B님 (전문직)',
        category: '성인 심리 · 자존감 회복',
      },
      {
        id: 't-8',
        title: '사업 위기로 매일 가슴이 조여오고 잠들지 못했는데, 인생의 쉼표를 찍고 다시 일어설 용기를 얻었습니다.',
        author: '내담자 K님 (소상공인)',
        category: '스트레스 · 불면 치유',
      },
      {
        id: 't-2',
        title: '말만 섞으면 다투던 저희 부부가, 8주간의 부부상담을 통해 서로의 진심을 마주 보게 되었습니다.',
        author: '결혼 5년차 부부 (내담자 J님)',
        category: '부부 갈등 · 대화 회복',
      },
      {
        id: 't-3',
        title: '방문을 닫고 말문을 닫았던 중학생 아이가, 상담사 선생님과 마음을 열고 다시 미소를 찾았습니다.',
        author: '학부모 L님 (중등 자녀)',
        category: '아동/청소년 · 사춘기 소통',
      },
    ];

    const sampleComments = [
      {
        nickname: '마음의 쉼표 하나',
        badge: '따뜻한 응원',
        content: '글을 읽는 내내 가슴이 뭉클했습니다. 용기 내어 걸어오신 치유의 길을 온 마음으로 응원해요! 🌸',
      },
      {
        nickname: '비슷한 아픔을 겪은 이',
        badge: '깊은 공감',
        content: '저도 어제 똑같은 두려움으로 밤을 지새웠는데, 나눠주신 글 덕분에 다시 일어설 힘을 얻었습니다. 🌿',
      },
      {
        nickname: '든든한 동행자',
        badge: '용기에 감사해요',
        content: '상담실 문을 두드리기까지 얼마나 많은 고민이 있으셨을지 느껴져요. 솔직한 나눔에 깊이 감사드립니다! ✨',
      },
      {
        nickname: '평온을 찾아가는 나그네',
        badge: '함께 걸어가요',
        content: '혼자가 아니라는 말씀에 큰 위로가 되네요. 우리 모두 각자의 속도로 평온에 닿기를 바랍니다. 💛',
      },
      {
        nickname: '따뜻한 상담실 이웃',
        badge: '온전한 지지',
        content: '그동안 견뎌오신 모든 시간들에 박수를 보냅니다. 앞으로의 하루하루도 햇살처럼 포근하길 응원합니다! 🛡️',
      },
    ];

    const randomPost = samplePosts[Math.floor(Math.random() * samplePosts.length)];
    const randomComm = sampleComments[Math.floor(Math.random() * sampleComments.length)];

    return this.triggerCommentPush({
      commentId: `comm-sim-${Date.now()}`,
      postId: randomPost.id,
      postTitle: randomPost.title,
      postAuthorName: randomPost.author,
      postCategory: randomPost.category,
      commentAuthorNickname: randomComm.nickname,
      commentBadge: randomComm.badge,
      commentContent: randomComm.content,
      target: 'both',
    });
  },
};
