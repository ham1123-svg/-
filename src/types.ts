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

export interface CounselorDetailedProfile {
  greeting?: string;
  philosophy?: string;
  clinicalHours?: string;
  supervisionCount?: string;
  specialties?: CounselorExpertise[];
  careers?: CounselorCareerItem[];
  academicBackground?: string[];
  certificationsList?: string[];
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
  preferred_date: string;
  preferred_time: string;
  status?: string;
  admin_notes?: string;
  created_at?: string;
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
  ageGroupAndRole: string;
  category: 'adult' | 'couple' | 'youth' | 'anxiety';
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


