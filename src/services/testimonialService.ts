import { Testimonial } from '../types';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

const LOCAL_STORAGE_KEY = 'hbbr_client_testimonials_v2';
const EVENT_NAME = 'hbbr_testimonials_changed';

function deduplicateTestimonials(list: Testimonial[]): Testimonial[] {
  const seen = new Set<string>();
  return list.filter(item => {
    if (!item || !item.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// Helper to initialize local storage if empty
function getInitialLocalTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return deduplicateTestimonials(parsed);
      }
    }
  } catch (e) {
    console.error("Error reading testimonials from local storage:", e);
  }

  // Fallback to default TESTIMONIALS_DATA with approved status
  const seeded = deduplicateTestimonials(TESTIMONIALS_DATA.map(t => ({
    ...t,
    status: (t.status || 'approved') as 'approved' | 'pending' | 'rejected',
    created_at: t.created_at || `${t.date || '2026-09-01'} 12:00:00`
  })));

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
  } catch (e) {}

  return seeded;
}

function syncLocalCacheOnly(list: Testimonial[]) {
  try {
    const deduped = deduplicateTestimonials(list);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deduped));
  } catch (e) {
    console.error("Error syncing testimonials cache to local storage:", e);
  }
}

function saveLocalTestimonials(list: Testimonial[]) {
  try {
    const deduped = deduplicateTestimonials(list);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deduped));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: deduped }));
  } catch (e) {
    console.error("Error saving testimonials to local storage:", e);
  }
}

export const testimonialService = {
  // Subscribe to real-time changes
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  },

  // Get testimonials (approved only or all for admin)
  async getTestimonials(includeAll: boolean = false): Promise<Testimonial[]> {
    try {
      const url = includeAll ? '/api/testimonials?includeAll=true' : '/api/testimonials';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Sync to local storage for instant offline fallback silently without firing change event
          syncLocalCacheOnly(data);
          return includeAll ? data : data.filter((t: Testimonial) => t.status === 'approved');
        }
      }
    } catch (err) {
      console.warn("Failed to fetch from server, using local fallback:", err);
    }

    // Fallback to localStorage
    const local = getInitialLocalTestimonials();
    return includeAll ? local : local.filter(t => t.status === 'approved');
  },

  // Client creates a new review (pending by default)
  async submitReview(reviewData: Partial<Testimonial>): Promise<{ success: boolean; id: string; message: string }> {
    const id = reviewData.id || `t-user-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    
    const newReview: Testimonial = {
      id,
      clientName: reviewData.clientName || '내담자 익명 (가명)',
      initial: reviewData.initial || (reviewData.clientName ? reviewData.clientName.replace(/[^a-zA-Z가-힣]/g, '').slice(0, 1) : '익명'),
      ageGroupAndRole: reviewData.ageGroupAndRole || '20대 청년',
      category: reviewData.category || 'adult',
      categoryLabel: reviewData.categoryLabel || '일반 심리상담',
      programTaken: reviewData.programTaken || '개인 심리상담',
      rating: reviewData.rating || 5,
      headline: reviewData.headline || '',
      story: reviewData.story || '',
      beforeState: reviewData.beforeState || '',
      afterState: reviewData.afterState || '',
      counselorInsight: reviewData.counselorInsight || '',
      period: reviewData.period || `${today.slice(0, 7)} 완료`,
      tags: reviewData.tags || [],
      recommendCount: reviewData.recommendCount || 0,
      date: today,
      isBest: false,
      status: reviewData.status || 'pending', // Pending admin approval
      created_at: new Date().toISOString()
    };

    // 1. Try server
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (res.ok) {
        const result = await res.json();
        // Update local cache
        const local = getInitialLocalTestimonials();
        saveLocalTestimonials([newReview, ...local]);
        return result;
      }
    } catch (e) {
      console.warn("Server POST failed, saving to local cache:", e);
    }

    // 2. Local fallback
    const local = getInitialLocalTestimonials();
    saveLocalTestimonials([newReview, ...local]);

    return {
      success: true,
      id,
      message: "소중한 후기가 안전하게 접수되었습니다. 개인정보 보호 검토 및 관리자 승인 절차를 거친 후 안전하게 게시됩니다."
    };
  },

  // Admin approves a review
  async approveReview(id: string): Promise<boolean> {
    return this.updateReview(id, { status: 'approved' });
  },

  // Admin rejects / holds a review
  async rejectReview(id: string): Promise<boolean> {
    return this.updateReview(id, { status: 'rejected' });
  },

  // Admin updates review (edit text, tags, add counselor insight, toggle best, etc.)
  async updateReview(id: string, updates: Partial<Testimonial>): Promise<boolean> {
    // 1. Try server
    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        // Update local storage
        const local = getInitialLocalTestimonials();
        const updated = local.map(t => (t.id === id ? { ...t, ...updates } : t));
        saveLocalTestimonials(updated);
        return true;
      }
    } catch (e) {
      console.warn("Server PUT failed, applying locally:", e);
    }

    // 2. Local fallback
    const local = getInitialLocalTestimonials();
    const updated = local.map(t => (t.id === id ? { ...t, ...updates } : t));
    saveLocalTestimonials(updated);
    return true;
  },

  // Admin deletes a review
  async deleteReview(id: string): Promise<boolean> {
    // 1. Try server
    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const local = getInitialLocalTestimonials();
        const updated = local.filter(t => t.id !== id);
        saveLocalTestimonials(updated);
        return true;
      }
    } catch (e) {
      console.warn("Server DELETE failed, removing locally:", e);
    }

    // 2. Local fallback
    const local = getInitialLocalTestimonials();
    const updated = local.filter(t => t.id !== id);
    saveLocalTestimonials(updated);
    return true;
  },

  // Increment empathy / like count
  async likeReview(id: string): Promise<number> {
    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(id)}/like`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        const local = getInitialLocalTestimonials();
        const updated = local.map(t => t.id === id ? { ...t, recommendCount: data.count } : t);
        saveLocalTestimonials(updated);
        return data.count;
      }
    } catch (e) {
      console.warn("Server like failed, incrementing locally:", e);
    }

    // Local fallback
    const local = getInitialLocalTestimonials();
    let newCount = 1;
    const updated = local.map(t => {
      if (t.id === id) {
        newCount = (t.recommendCount || 0) + 1;
        return { ...t, recommendCount: newCount };
      }
      return t;
    });
    saveLocalTestimonials(updated);
    return newCount;
  }
};
