export interface CounselorExpertise {
  title: string;
  description: string;
  methods: string[];
}

export interface CounselorCareerItem {
  period?: string;
  role: string;
  organization: string;
}

export interface CounselorAvailabilityDay {
  day: string;
  dayEn: string;
  available: boolean;
  statusText: string;
  hours: string;
  slotsCount: number;
  sessions: string;
  highlight?: boolean;
}

export interface CounselorAvailabilitySchedule {
  primaryDaysSummary: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  notice: string;
  days: CounselorAvailabilityDay[];
}

export interface CounselorDetailedProfile {
  greeting?: string;
  philosophy?: string;
  clinicalHours?: string;
  supervisionCount?: string;
  specialties?: CounselorExpertise[];
  careers?: CounselorCareerItem[];
  academicBackground?: string[];
  certificationsList?: string[];
  licenseHighlights?: Array<{
    name: string;
    issuer?: string;
    level?: string;
    isSupervisor?: boolean;
  }>;
  availability?: CounselorAvailabilitySchedule;
  specialtyTagsDetailed?: Array<{
    tag?: string;
    label?: string;
    name?: string;
    description?: string;
    approach?: string;
    targetSymptoms?: string[];
    targetSymptom?: string;
    recommendedProgram?: string;
    badge?: string;
    relatedKeywords?: string[];
  }>;
  philosophyPrinciples?: Array<{
    title: string;
    subtitle?: string;
    description?: string;
  }>;
  recommendedFor?: string[];
  sessionProcedure?: Array<{ step: string; title: string; desc: string }>;
}

export interface Counselor {
  id: number;
  name: string;
  title: string;
  education: string;
  certifications: string;
  style: string;
  tags: string;
  image_url: string;
  detailedProfile?: CounselorDetailedProfile;
}

export interface Program {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string;
}

export interface Reservation {
  id?: number;
  name: string;
  phone: string;
  program_id: number;
  program_title?: string;
  program_category?: string;
  preferred_date: string;
  preferred_time: string;
  status?: string;
  admin_notes?: string;
  created_at?: string;
}

export interface CategoryMonthlyTrend {
  month: string;
  monthLabel: string;
  '개인상담': number;
  '부부상담': number;
  '심리검사': number;
  '기업상담': number;
  '집단/교육': number;
  total: number;
  [key: string]: any;
}

export interface CategorySummaryStat {
  category: string;
  count: number;
  percentage: number;
  color: string;
  secondaryColor: string;
  iconName: string;
  growthMoM?: number;
}

export interface ReservationTrendAnalytics {
  months: string[];
  monthlyData: CategoryMonthlyTrend[];
  categoryTotals: CategorySummaryStat[];
  summary: {
    totalReservations: number;
    monthlyAverage: number;
    topCategory: {
      category: string;
      count: number;
      percentage: number;
    };
    momGrowth: number;
    highestMonth: {
      monthLabel: string;
      count: number;
    };
  };
}

export interface ScheduleBlock {
  id?: number;
  block_date: string;
  block_time?: string;
  reason: string;
  created_at?: string;
}

export interface NotificationResult {
  success: boolean;
  channel: 'ALIMTALK' | 'SMS';
  status: 'SENT' | 'SIMULATED' | 'FAILED' | 'PENDING_CONFIG';
  message: string;
  templateTitle: string;
  content: string;
  buttons?: Array<{ title: string; url: string; type: string }>;
  recipientName: string;
  recipientPhone: string;
}

export interface NotificationLog {
  id: number;
  reservation_id: number;
  recipient_name: string;
  recipient_phone: string;
  channel: string;
  template_title: string;
  message_content: string;
  status: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  initial?: string;
  ageGroupAndRole: string;
  category: 'child' | 'youth' | 'adult' | 'couple' | 'anxiety' | string;
  categoryLabel: string;
  programTaken: string;
  rating: number;
  headline: string;
  story: string;
  beforeState: string;
  afterState: string;
  counselorInsight?: string;
  period: string;
  tags: string[];
  recommendCount?: number;
  date?: string;
  isBest?: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  created_at?: string;
}

export interface CommunityNotice {
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

export const WEEKDAY_TIME_SLOTS = [
  '09:00',
  '10:30',
  '14:00',
  '15:30',
  '19:00'
] as const;

export const SATURDAY_TIME_SLOTS = [
  '09:00',
  '10:30',
  '14:00',
  '15:30'
] as const;

export const RESERVATION_TIME_SLOTS = [
  '09:00',
  '10:30',
  '14:00',
  '15:30',
  '19:00'
] as const;

export type ReservationTimeSlot = typeof RESERVATION_TIME_SLOTS[number];

export const TIME_SLOT_DETAILS: Record<string, { session: string; period: string; duration: string }> = {
  '09:00': { session: '1회차', period: '오전', duration: '09:00 ~ 10:00' },
  '10:30': { session: '2회차', period: '오전', duration: '10:30 ~ 11:30' },
  '14:00': { session: '3회차', period: '오후', duration: '14:00 ~ 15:00' },
  '15:30': { session: '4회차', period: '오후', duration: '15:30 ~ 16:30' },
  '19:00': { session: '5회차', period: '야간', duration: '19:00 ~ 20:00' }
};

/**
 * Returns allowed operating slots for a given day of week:
 * 0 (Sunday) -> [] (Closed)
 * 6 (Saturday) -> ['09:00', '10:30', '14:00', '15:30'] (4 sessions)
 * 1..5 (Mon~Fri) -> ['09:00', '10:30', '14:00', '15:30', '19:00'] (5 sessions)
 */
export function getTimeSlotsForDay(dayOfWeek: number): string[] {
  if (dayOfWeek === 0) return [];
  if (dayOfWeek === 6) return [...SATURDAY_TIME_SLOTS];
  return [...WEEKDAY_TIME_SLOTS];
}

export function getTimeSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return [...WEEKDAY_TIME_SLOTS];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return [...WEEKDAY_TIME_SLOTS];
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return getTimeSlotsForDay(d.getDay());
}

export interface PsychologicalPrepTip {
  period: 'morning' | 'afternoon' | 'evening';
  title: string;
  shortTip: string;
  detailTip: string;
  recommendation: string;
}

export const PSYCHOLOGICAL_PREP_TIPS: Record<string, PsychologicalPrepTip> = {
  morning: {
    period: 'morning',
    title: '차분한 아침 명상',
    shortTip: '차분한 아침 명상과 심호흡으로 오늘 마주할 내면의 이야기를 맑게 열어보세요.',
    detailTip: '이른 아침의 맑은 공기와 함께 3~5분간 가벼운 호흡 명상을 진행하면, 뇌의 긴장이 풀리고 자신의 진솔한 마음에 더욱 집중할 수 있습니다.',
    recommendation: '따뜻한 미온수 한 잔과 가벼운 스트레칭 후 상담 참여를 권장합니다.'
  },
  afternoon: {
    period: 'afternoon',
    title: '일상 속 쉼표 & 차 한 잔',
    shortTip: '바쁜 일과를 잠시 멈추고 따뜻한 차 한 잔과 함께 숨을 고르며 마음에 집중해 보세요.',
    detailTip: '오후 시간대는 하루 일과로 분주할 수 있습니다. 상담 10분 전 스마트폰을 내려놓고 차 한 잔을 마시며 지금 내 감정에 머물러 보세요.',
    recommendation: '일과와 상담 사이에 10분의 완충 시간을 두어 호흡을 정돈해 보세요.'
  },
  evening: {
    period: 'evening',
    title: '하루 정리 & 마음 비우기',
    shortTip: '오늘 하루의 긴장과 분주함을 내려놓고 편안한 공간에서 하루를 차분히 정리해 보세요.',
    detailTip: '하루를 마무리하는 저녁 시간에는 오늘 겪은 일들과 억눌렸던 감정을 편안하게 내려놓고, 온전히 나만의 안식처를 찾는 마음으로 참여해 보세요.',
    recommendation: '오늘 느꼈던 감정 단어 1~2가지를 메모해 두시면 심층 상담에 큰 도움이 됩니다.'
  }
};

export function getPsychologicalTipForTime(timeStr?: string): PsychologicalPrepTip | null {
  if (!timeStr) return null;
  if (timeStr === '09:00' || timeStr === '10:30') return PSYCHOLOGICAL_PREP_TIPS.morning;
  if (timeStr === '14:00' || timeStr === '15:30') return PSYCHOLOGICAL_PREP_TIPS.afternoon;
  if (timeStr === '19:00') return PSYCHOLOGICAL_PREP_TIPS.evening;
  return null;
}

export interface CounselingInsight {
  id: number;
  title: string;
  category: string;
  summary: string;
  content?: string;
  author: string;
  author_title: string;
  read_time: string;
  image_url: string;
  tags?: string;
  featured?: number;
  views?: number;
  takeaways?: string[];
  created_at: string;
}



