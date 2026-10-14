import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Info, 
  ArrowDown, 
  Check, 
  ShieldCheck,
  CalendarDays,
  User,
  Users,
  Award,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  Reservation, 
  ScheduleBlock, 
  RESERVATION_TIME_SLOTS, 
  TIME_SLOT_DETAILS,
  getPsychologicalTipForTime
} from '../types';

export interface CalendarCounselorInfo {
  id: string; // 'all' | 'park' | 'kim' | 'lee'
  name: string;
  shortName: string;
  role: string;
  qualification: string;
  specialties: string;
  avatar: string;
  availableDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  offDayReason?: string;
  hoursText: string;
  weekdaySlots: string[];
  saturdaySlots: string[];
  description: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
}

export const CALENDAR_COUNSELORS: CalendarCounselorInfo[] = [
  {
    id: 'all',
    name: '전체 상담사 일정',
    shortName: '전체 상담사',
    role: '통합 일정 안내',
    qualification: '3인 전문 상담진',
    specialties: '박미경 소장 · 김지현 수석 · 이진우 전문',
    avatar: '',
    availableDays: [1, 2, 3, 4, 5, 6],
    hoursText: '평일 09:00 ~ 20:00 · 토 09:00 ~ 16:30',
    weekdaySlots: ['09:00', '10:30', '14:00', '15:30', '19:00'],
    saturdaySlots: ['09:00', '10:30', '14:00', '15:30'],
    description: '행복바람 소속 3인의 전문 상담사 전체 일정 중 예약 가능한 시간대를 한눈에 조회합니다.',
    color: {
      bg: 'bg-brand-sage/10',
      text: 'text-brand-sage',
      border: 'border-brand-sage/30',
      badge: 'bg-brand-sage text-white'
    }
  },
  {
    id: 'park',
    name: '박미경 소장 (대표 원장)',
    shortName: '박미경 대표 원장',
    role: '상담 소장 (대표 원장)',
    qualification: '교육학 박사 · 1급 수련감독자',
    specialties: '성인 심층 치유 · 부부 갈등 · 기업 EAP · 종합평가',
    avatar: '/images/counselor_park.jpg',
    availableDays: [1, 2, 3, 4, 5, 6],
    hoursText: '월~금 09:00 ~ 20:00 (야간 19:00) · 토 09:00 ~ 16:30',
    weekdaySlots: ['09:00', '10:30', '14:00', '15:30', '19:00'],
    saturdaySlots: ['09:00', '10:30', '14:00', '15:30'],
    description: '30,000시간 이상의 심층 임상 경험을 바탕으로 개인 내면 치유와 부부·가족 갈등을 안전하게 이끕니다.',
    color: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      badge: 'bg-emerald-600 text-white'
    }
  },
  {
    id: 'kim',
    name: '김지현 수석 상담사',
    shortName: '김지현 수석',
    role: '수석 상담사',
    qualification: '상담심리학 석사 · 상담심리사 1급',
    specialties: '부부 및 커플 갈등 · 가족 대화 · 정서중심치료(EFT)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    availableDays: [2, 3, 4, 5, 6],
    offDayReason: '월요일 외부 가족중재 및 슈퍼비전 연구 휴진',
    hoursText: '화~금 10:00 ~ 19:00 · 토 09:00 ~ 16:30',
    weekdaySlots: ['10:30', '14:00', '15:30', '19:00'],
    saturdaySlots: ['09:00', '10:30', '14:00', '15:30'],
    description: '부부 및 커플 관계 회복, 가족 정서 소통을 전문으로 서로의 상처를 보듬고 재연결합니다.',
    color: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      badge: 'bg-rose-600 text-white'
    }
  },
  {
    id: 'lee',
    name: '이진우 전문 상담사',
    shortName: '이진우 전문',
    role: '전문 상담사',
    qualification: '정신건강임상심리사 2급 · 청소년상담사 1급',
    specialties: '청소년 심리 · 성인 ADHD · 공황/불안 · 인지행동치료(CBT)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    availableDays: [1, 3, 4, 5, 6],
    offDayReason: '화요일 종합심리평가 분석 및 임상 프로토콜 연구 휴진',
    hoursText: '월·수·목·금 13:00 ~ 20:00 · 토 09:00 ~ 16:30',
    weekdaySlots: ['14:00', '15:30', '19:00'],
    saturdaySlots: ['09:00', '10:30', '14:00', '15:30'],
    description: '체계적인 인지행동(CBT) 기법과 청소년 맞춤 접근으로 불안, ADHD, 무기력을 극복하도록 돕습니다.',
    color: {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-300',
      badge: 'bg-sky-600 text-white'
    }
  }
];

interface InteractiveReservationCalendarProps {
  selectedDate?: string;
  selectedTime?: string;
  selectedCounselor?: string;
  onSelectSlot: (date: string, time: string, counselor?: string) => void;
  onSelectDate?: (date: string) => void;
  onSelectCounselor?: (counselor: string) => void;
  formRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// Korean National & Public Holidays (2026 ~ 2027)
export const KOREAN_HOLIDAYS: Record<string, string> = {
  '2026-01-01': '신정',
  '2026-02-16': '설날 연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날 연휴',
  '2026-03-01': '삼일절',
  '2026-03-02': '대체공휴일',
  '2026-05-05': '어린이날',
  '2026-05-24': '부처님오신날',
  '2026-05-25': '대체공휴일',
  '2026-06-06': '현충일',
  '2026-08-15': '광복절',
  '2026-08-17': '대체공휴일',
  '2026-09-24': '추석 연휴',
  '2026-09-25': '추석',
  '2026-09-26': '추석 연휴',
  '2026-10-03': '개천절',
  '2026-10-05': '대체공휴일',
  '2026-10-09': '한글날',
  '2026-12-25': '성탄절'
};

export default function InteractiveReservationCalendar({
  selectedDate,
  selectedTime,
  selectedCounselor,
  onSelectSlot,
  onSelectDate,
  onSelectCounselor,
  formRef,
  className
}: InteractiveReservationCalendarProps) {
  // Selected Counselor State (default to 'all' or mapped from prop)
  const [activeCounselorId, setActiveCounselorId] = useState<string>(() => {
    if (selectedCounselor) {
      const found = CALENDAR_COUNSELORS.find(c => c.name.includes(selectedCounselor) || selectedCounselor.includes(c.shortName));
      if (found) return found.id;
    }
    return 'all';
  });

  // Today's reference date
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Calendar year and month navigation state
  const [viewYear, setViewYear] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[0], 10);
    }
    return today.getFullYear();
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) return parseInt(parts[1], 10) - 1;
    }
    return today.getMonth();
  });

  // Active clicked date for time slot viewing
  const [activeDate, setActiveDate] = useState<string>(() => {
    if (selectedDate) return selectedDate;
    // Default to tomorrow (or Monday if tomorrow is Sunday)
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    if (nextDay.getDay() === 0) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    const y = nextDay.getFullYear();
    const m = String(nextDay.getMonth() + 1).padStart(2, '0');
    const d = String(nextDay.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Real-time Reservations and Admin Schedule Blocks
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch reservations and schedule blocks
  const loadScheduleData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/reservations').then(res => res.json()).catch(() => []),
      fetch('/api/schedule-blocks').then(res => res.json()).catch(() => [])
    ]).then(([resData, blockData]) => {
      if (Array.isArray(resData)) setReservations(resData);
      if (Array.isArray(blockData)) setScheduleBlocks(blockData);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  // Sync external selectedDate if provided
  useEffect(() => {
    if (selectedDate) {
      setActiveDate(selectedDate);
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [selectedDate]);

  // Sync external selectedCounselor
  useEffect(() => {
    if (selectedCounselor) {
      const found = CALENDAR_COUNSELORS.find(c => c.name.includes(selectedCounselor) || selectedCounselor.includes(c.shortName));
      if (found) {
        setActiveCounselorId(found.id);
      }
    }
  }, [selectedCounselor]);

  // Active counselor object
  const activeCounselor = useMemo(() => {
    return CALENDAR_COUNSELORS.find(c => c.id === activeCounselorId) || CALENDAR_COUNSELORS[0];
  }, [activeCounselorId]);

  // Handle counselor change
  const handleSelectCounselorTab = (counselorId: string) => {
    setActiveCounselorId(counselorId);
    const counselor = CALENDAR_COUNSELORS.find(c => c.id === counselorId);
    if (onSelectCounselor && counselor) {
      onSelectCounselor(counselor.id === 'all' ? '' : counselor.name);
    }
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(prev => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(prev => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setActiveDate(todayStr);
    if (onSelectDate) {
      onSelectDate(todayStr);
    }
  };

  // Check if previous month is in the past
  const isPrevMonthDisabled = useMemo(() => {
    const currentViewDate = new Date(viewYear, viewMonth, 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentViewDate <= thisMonthStart;
  }, [viewYear, viewMonth, today]);

  // Monthly Days Matrix Generation
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();
    
    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      dayOfWeek: number;
    }> = [];

    // Fill leading days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(viewYear, viewMonth - 1, prevMonthDaysCount - i);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const d = String(prevDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: prevMonthDaysCount - i,
        isCurrentMonth: false,
        dayOfWeek: prevDate.getDay()
      });
    }

    // Fill current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const currDate = new Date(viewYear, viewMonth, day);
      const y = currDate.getFullYear();
      const m = String(currDate.getMonth() + 1).padStart(2, '0');
      const d = String(currDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: day,
        isCurrentMonth: true,
        dayOfWeek: currDate.getDay()
      });
    }

    // Fill trailing days to complete grid (up to multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i);
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, '0');
      const d = String(nextDate.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${y}-${m}-${d}`,
        dayNumber: i,
        isCurrentMonth: false,
        dayOfWeek: nextDate.getDay()
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Compute availability summary for any given date with Counselor sensitivity
  const getDateAvailability = useCallback((dateStr: string, dayOfWeek: number) => {
    const isPast = dateStr < todayStr;
    const isSunday = dayOfWeek === 0;
    const isHoliday = !!KOREAN_HOLIDAYS[dateStr];

    if (isSunday || isHoliday) {
      const holidayName = KOREAN_HOLIDAYS[dateStr];
      return { 
        status: 'closed' as const, 
        label: '휴무', 
        reason: holidayName ? `${holidayName} (휴무)` : '일요일 정기 휴무', 
        availableSlots: 0, 
        totalSlots: 0 
      };
    }

    if (isPast) {
      return { status: 'past' as const, label: '마감', reason: '지난 일정', availableSlots: 0, totalSlots: 0 };
    }

    // If specific counselor is selected, check if this day is their off-day
    if (activeCounselor.id !== 'all' && !activeCounselor.availableDays.includes(dayOfWeek)) {
      return {
        status: 'counselor_off' as const,
        label: '연구휴진',
        reason: activeCounselor.offDayReason || `${activeCounselor.shortName} 연구 휴진일`,
        availableSlots: 0,
        totalSlots: 0
      };
    }

    // Full day center block check
    const fullDayBlock = scheduleBlocks.find(b => b.block_date === dateStr && (!b.block_time || b.block_time === 'all'));
    if (fullDayBlock) {
      return { status: 'blocked' as const, label: '휴무', reason: fullDayBlock.reason || '상담소 휴무', availableSlots: 0, totalSlots: 0 };
    }

    // Allowed slots for this day & counselor
    const isSaturday = dayOfWeek === 6;
    let targetSlots: string[] = [];

    if (activeCounselor.id === 'all') {
      targetSlots = isSaturday 
        ? ['09:00', '10:30', '14:00', '15:30'] 
        : ['09:00', '10:30', '14:00', '15:30', '19:00'];
    } else {
      targetSlots = isSaturday ? activeCounselor.saturdaySlots : activeCounselor.weekdaySlots;
    }

    if (targetSlots.length === 0) {
      return { status: 'closed' as const, label: '휴무', reason: '휴무', availableSlots: 0, totalSlots: 0 };
    }

    let availableCount = 0;

    targetSlots.forEach(slot => {
      const isBlocked = scheduleBlocks.some(b => b.block_date === dateStr && b.block_time === slot);
      const isBooked = reservations.some(r => r.preferred_date === dateStr && r.preferred_time === slot && r.status !== 'cancelled');

      if (!isBlocked && !isBooked) {
        availableCount++;
      }
    });

    if (availableCount === 0) {
      return { status: 'full' as const, label: '마감', reason: '예약 마감', availableSlots: 0, totalSlots: targetSlots.length };
    }

    return { 
      status: 'available' as const, 
      label: '예약 가능', 
      availableSlots: availableCount, 
      totalSlots: targetSlots.length 
    };
  }, [todayStr, scheduleBlocks, reservations, activeCounselor]);

  // Current active date detail & day of week
  const activeDateInfo = useMemo(() => {
    if (!activeDate) return null;
    const parts = activeDate.split('-');
    if (parts.length !== 3) return null;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayOfWeek = d.getDay();
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;
    const isHoliday = !!KOREAN_HOLIDAYS[activeDate];
    const isPast = activeDate < todayStr;

    return {
      dateStr: activeDate,
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
      dayOfWeekName: WEEKDAYS[dayOfWeek],
      dayOfWeek,
      isSaturday,
      isSunday,
      isHoliday,
      isPast
    };
  }, [activeDate, todayStr]);

  // Counselors working for a specific day and time slot
  const getAvailableCounselorsForSlot = useCallback((dayOfWeek: number, slotTime: string) => {
    const isSaturday = dayOfWeek === 6;
    return CALENDAR_COUNSELORS.filter(c => {
      if (c.id === 'all') return false;
      if (!c.availableDays.includes(dayOfWeek)) return false;
      const slots = isSaturday ? c.saturdaySlots : c.weekdaySlots;
      return slots.includes(slotTime);
    });
  }, []);

  // Time slot availability for the active selected date
  const activeTimeSlots = useMemo(() => {
    if (!activeDateInfo || activeDateInfo.isSunday || activeDateInfo.isHoliday || activeDateInfo.isPast) return [];

    const dateStr = activeDateInfo.dateStr;
    const dayOfWeek = activeDateInfo.dayOfWeek;
    const isSaturday = activeDateInfo.isSaturday;

    return RESERVATION_TIME_SLOTS.map(slotTime => {
      const details = TIME_SLOT_DETAILS[slotTime];
      const isSatNight = isSaturday && slotTime === '19:00';

      // Counselors operating in this specific slot
      const workingCounselors = getAvailableCounselorsForSlot(dayOfWeek, slotTime);

      // Check admin block
      const block = scheduleBlocks.find(b => 
        b.block_date === dateStr && 
        (!b.block_time || b.block_time === 'all' || b.block_time === slotTime)
      );

      // Check booked reservation
      const existingRes = reservations.find(r => 
        r.preferred_date === dateStr && 
        r.preferred_time === slotTime && 
        r.status !== 'cancelled'
      );

      // If specific counselor is selected, check if they operate in this slot
      const isCounselorOperating = activeCounselor.id === 'all' 
        ? workingCounselors.length > 0 
        : (isSaturday ? activeCounselor.saturdaySlots : activeCounselor.weekdaySlots).includes(slotTime);

      let isAvailable = true;
      let reason = '예약 가능';

      if (isSatNight) {
        isAvailable = false;
        reason = '토요일 미운영';
      } else if (!isCounselorOperating) {
        isAvailable = false;
        reason = activeCounselor.id === 'all' ? '운영 없음' : `${activeCounselor.shortName} 미운영 타임`;
      } else if (block) {
        isAvailable = false;
        reason = block.reason || '예약 마감';
      } else if (existingRes) {
        isAvailable = false;
        reason = '예약 마감';
      }

      const isSelected = selectedDate === dateStr && selectedTime === slotTime;

      return {
        time: slotTime,
        session: details?.session || '',
        period: details?.period || '',
        duration: details?.duration || '50분 집중',
        workingCounselors,
        isAvailable,
        reason,
        isSelected
      };
    });
  }, [activeDateInfo, scheduleBlocks, reservations, selectedDate, selectedTime, activeCounselor, getAvailableCounselorsForSlot]);

  const handleSelectDate = (dateStr: string, dayOfWeek: number) => {
    const isPast = dateStr < todayStr;
    const isSunday = dayOfWeek === 0;
    if (isPast || isSunday) return;
    setActiveDate(dateStr);
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  const handleSelectSlotTime = (time: string, designatedCounselorName?: string) => {
    if (!activeDate) return;
    const counselorToPass = designatedCounselorName || (activeCounselor.id !== 'all' ? activeCounselor.name : undefined);
    onSelectSlot(activeDate, time, counselorToPass);

    // Smoothly scroll down to form section so user can proceed
    if (formRef?.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div id="interactive-calendar-section" className={cn("bg-white rounded-3xl p-5 sm:p-8 border border-brand-green/20 shadow-md", className)}>
      
      {/* 1. Header & Title Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-brand-green/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/30 text-brand-sage text-xs font-serif font-bold mb-2">
            <CalendarDays className="w-3.5 h-3.5 text-brand-sage" />
            <span>상담사별 실시간 예약 가능 일정표</span>
            <span aria-hidden="true" className="text-brand-brown/30">·</span>
            <span className="text-brand-brown/80 font-normal">1일 5회기 한정 심층 상담</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-brown leading-tight">
            희망 상담사와 <span className="text-brand-sage">가능한 날짜 &amp; 시간</span>을 한눈에 확인하세요
          </h3>
          <p className="text-xs sm:text-sm text-brand-brown/70 font-serif mt-1">
            상단에서 <strong>상담사</strong>를 선택하시면 해당 상담사의 주간 운영 요일과 실시간 잔여 상담 타임이 달력에 자동 반영됩니다.
          </p>
        </div>

        {/* Legend Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-serif text-brand-brown/75">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-emerald-900 text-xs">상담 가능</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-medium text-amber-900 text-xs">연구 휴진</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100 border border-gray-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
            <span className="font-medium text-gray-700 text-xs">마감</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="font-medium text-rose-600 text-xs">휴무(일/공휴일)</span>
          </div>
        </div>
      </div>

      {/* 2. Counselor Selector Tabs (상담사 선택 탭) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-serif font-bold text-brand-brown flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-sage" />
            <span>상담사 선택 필터 (희망하시는 전문가를 클릭하세요)</span>
          </label>
          <span className="text-[11px] text-brand-brown/60">
            {activeCounselor.id === 'all' ? '전체 상담사 일정 표시 중' : `${activeCounselor.name} 일정 표시 중`}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {CALENDAR_COUNSELORS.map((counselor) => {
            const isSelected = activeCounselorId === counselor.id;
            return (
              <button
                key={counselor.id}
                type="button"
                onClick={() => handleSelectCounselorTab(counselor.id)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group",
                  isSelected
                    ? "bg-brand-sage text-white border-brand-sage shadow-md ring-2 ring-brand-sage/20"
                    : "bg-white hover:bg-brand-beige/35 border-brand-green/25 text-brand-brown shadow-2xs"
                )}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  {counselor.avatar ? (
                    <img 
                      src={counselor.avatar} 
                      alt={counselor.name} 
                      className="w-9 h-9 rounded-full object-cover border border-white/60 shrink-0 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs",
                      isSelected ? "bg-white/20 text-white" : "bg-brand-sage/15 text-brand-sage"
                    )}>
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className={cn(
                      "text-xs font-bold font-serif truncate",
                      isSelected ? "text-white" : "text-brand-brown"
                    )}>
                      {counselor.shortName}
                    </div>
                    <div className={cn(
                      "text-[10px] truncate",
                      isSelected ? "text-white/80" : "text-brand-brown/60"
                    )}>
                      {counselor.role}
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-current/15 text-[10px] flex items-center justify-between">
                  <span className={cn(
                    "truncate font-medium",
                    isSelected ? "text-white/90" : "text-brand-brown/70"
                  )}>
                    {counselor.availableDays.length === 6 ? '월~토 상담' : counselor.id === 'kim' ? '화~토 상담' : '월·수~토 상담'}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0"></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Counselor Operating Schedule Overview Card (선택된 상담사 프로필 & 주간 운영 일정 안내) */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-brand-beige/30 border border-brand-green/20 text-brand-brown font-serif">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {activeCounselor.avatar ? (
              <img 
                src={activeCounselor.avatar} 
                alt={activeCounselor.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-sage shrink-0 shadow-xs mt-0.5"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-brand-sage/20 text-brand-sage flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-brand-brown">
                  {activeCounselor.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-sage text-white font-sans font-bold shadow-2xs">
                  {activeCounselor.qualification}
                </span>
              </div>
              <p className="text-xs text-brand-brown/75 mt-0.5 leading-relaxed">
                <strong>주요 전문:</strong> {activeCounselor.specialties}
              </p>
              <p className="text-[11px] text-brand-brown/65 mt-0.5">
                {activeCounselor.description}
              </p>
            </div>
          </div>

          {/* 7-Day Availability Pill Bar */}
          <div className="shrink-0 bg-white/90 p-2.5 rounded-xl border border-brand-green/20 shadow-2xs">
            <div className="text-[10px] text-brand-brown/60 font-bold mb-1.5 text-center">
              요일별 상담 일정 ({activeCounselor.hoursText})
            </div>
            <div className="flex items-center gap-1">
              {[
                { day: '월', idx: 1 },
                { day: '화', idx: 2 },
                { day: '수', idx: 3 },
                { day: '목', idx: 4 },
                { day: '금', idx: 5 },
                { day: '토', idx: 6 },
                { day: '일', idx: 0 }
              ].map(({ day, idx }) => {
                const isWorking = activeCounselor.availableDays.includes(idx);
                const isSun = idx === 0;
                return (
                  <div
                    key={`schedule-day-${idx}`}
                    className={cn(
                      "w-7 py-1 text-center rounded-lg text-[10px] font-bold border transition-colors",
                      isSun 
                        ? "bg-rose-50 text-rose-500 border-rose-200"
                        : isWorking
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    )}
                    title={
                      isSun ? '일요일 정기 휴무' :
                      isWorking ? `${day}요일 상담 가능` :
                      activeCounselor.offDayReason || `${day}요일 연구 휴진`
                    }
                  >
                    <div>{day}</div>
                    <div className="text-[9px] scale-90 font-mono">
                      {isSun ? '휴무' : isWorking ? '가능' : '휴진'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Two-Column Layout: Interactive Calendar (Left) + Available Time Slots (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left: Monthly Interactive Calendar (7 Cols on LG) */}
        <div className="lg:col-span-7 bg-brand-beige/25 rounded-3xl p-4 sm:p-6 border border-brand-green/20 shadow-2xs">
          
          {/* Month Navigation Bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-green/15">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-serif font-bold text-brand-brown tracking-tight">
                {viewYear}년 {viewMonth + 1}월
              </span>
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-brand-sage hover:text-white text-brand-brown/80 text-xs font-serif font-bold border border-brand-green/30 transition-colors shadow-2xs cursor-pointer"
                title="오늘 날짜로 이동"
              >
                오늘
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled}
                aria-label="이전 달 보기"
                className={cn(
                  "p-2 rounded-xl border transition-all cursor-pointer",
                  isPrevMonthDisabled
                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-brand-brown hover:bg-brand-sage hover:text-white border-brand-green/30 shadow-2xs"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="다음 달 보기"
                className="p-2 rounded-xl bg-white text-brand-brown hover:bg-brand-sage hover:text-white border-brand-green/30 transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header (일 ~ 토) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-2">
            {WEEKDAYS.map((dayName, idx) => {
              const isSun = idx === 0;
              const isSat = idx === 6;
              return (
                <div 
                  key={`col-weekday-${dayName}-${idx}`}
                  className={cn(
                    "py-1.5 text-xs font-serif font-bold",
                    isSun && "text-rose-500",
                    isSat && "text-sky-600",
                    !isSun && !isSat && "text-brand-brown/70"
                  )}
                >
                  {dayName}
                </div>
              );
            })}
          </div>

          {/* Calendar 7xN Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((dayItem, idx) => {
              const { dateStr, dayNumber, isCurrentMonth, dayOfWeek } = dayItem;
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;
              const isToday = dateStr === todayStr;
              const isSelected = activeDate === dateStr;
              const avail = getDateAvailability(dateStr, dayOfWeek);
              const isHoliday = !!KOREAN_HOLIDAYS[dateStr];
              const holidayName = KOREAN_HOLIDAYS[dateStr];
              const isCounselorOff = avail.status === 'counselor_off';
              const isClosed = avail.status === 'closed';
              const isAvailable = avail.status === 'available';
              const isClickable = !avail.reason.includes('지난') && !isSunday;

              return (
                <motion.button
                  key={`cal-cell-${dateStr}-${idx}`}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => handleSelectDate(dateStr, dayOfWeek)}
                  whileHover={isClickable ? { scale: 1.02 } : {}}
                  whileTap={isClickable ? { scale: 0.98 } : {}}
                  className={cn(
                    "min-h-[72px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between border transition-all text-left relative",
                    !isCurrentMonth && "opacity-35",
                    isSelected
                      ? "bg-white border-brand-sage ring-2 ring-brand-sage/40 shadow-md scale-101 z-10"
                      : isToday
                      ? "bg-brand-sage/5 border-brand-sage/40 shadow-2xs"
                      : isAvailable
                      ? "bg-white hover:bg-emerald-50/40 border-brand-green/20 hover:border-emerald-300 shadow-2xs cursor-pointer"
                      : isCounselorOff
                      ? "bg-amber-50/40 border-amber-200/60 cursor-pointer"
                      : isClosed
                      ? "bg-rose-50/30 border-rose-100 cursor-not-allowed"
                      : "bg-gray-50/70 border-gray-200/80 cursor-not-allowed"
                  )}
                >
                  {/* Top Bar inside cell: Day number + Badges */}
                  <div className="flex items-center justify-between w-full">
                    <span className={cn(
                      "text-xs sm:text-sm font-bold font-serif leading-none",
                      isSelected && "text-brand-sage font-extrabold",
                      !isSelected && isSunday && "text-rose-500",
                      !isSelected && isSaturday && "text-sky-600",
                      !isSelected && !isSunday && !isSaturday && "text-brand-brown"
                    )}>
                      {dayNumber}
                    </span>

                    {/* Today marker */}
                    {isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-brand-sage text-white font-sans">
                        오늘
                      </span>
                    )}

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-brand-sage text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Holiday Name Display */}
                  {isHoliday && (
                    <div className="text-[9px] font-serif font-semibold text-rose-600 leading-tight truncate w-full">
                      {holidayName}
                    </div>
                  )}

                  {/* Status Badges */}
                  {isCurrentMonth && (
                    <div className="mt-1 w-full">
                      {isAvailable ? (
                        <div className="w-full flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-800 font-serif">
                              가능
                            </span>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-700/80 mt-0.5">
                            {avail.availableSlots}타임
                          </span>
                        </div>
                      ) : isCounselorOff ? (
                        <div className="w-full">
                          <span className="inline-flex items-center justify-center text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none bg-amber-100/80 text-amber-800 border border-amber-200">
                            연구휴진
                          </span>
                        </div>
                      ) : isClosed ? (
                        <div className="w-full">
                          <span className="inline-flex items-center justify-center text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none bg-rose-100/60 text-rose-600 border border-rose-200/70">
                            휴무
                          </span>
                        </div>
                      ) : (
                        <div className="w-full">
                          <span className="inline-flex items-center justify-center text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none bg-gray-100 text-gray-500 border border-gray-200">
                            마감
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Quick Schedule Footer */}
          <div className="mt-3.5 pt-3 border-t border-brand-green/15 flex flex-wrap items-center justify-between text-[11px] text-brand-brown/65 font-serif gap-2">
            <span>* 평일: 09:00~20:00 (5회기) · 토요일: 09:00~16:30 (4회기)</span>
            <span className="text-rose-600 font-medium">매주 일요일 및 법정 공휴일 휴진</span>
          </div>
        </div>

        {/* Right: Available Time Slots Panel with Counselor Badges (5 Cols on LG) */}
        <div id="calendar-available-slots" className="lg:col-span-5 flex flex-col justify-between h-full space-y-4 scroll-mt-20">
          
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-green/30 shadow-sm relative">
            
            {/* Active Date Header */}
            <div className="pb-4 mb-4 border-b border-brand-green/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-serif font-bold text-brand-sage uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>예약 가능 시간대 및 담당 상담사</span>
                </span>
                
                {activeDateInfo?.isSaturday ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold border border-sky-200">
                    토요 4회 운영
                  </span>
                ) : !activeDateInfo?.isSunday ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    평일 5회 운영
                  </span>
                ) : null}
              </div>

              {activeDateInfo ? (
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-lg sm:text-xl font-serif font-bold text-brand-brown">
                      {activeDateInfo.year}년 {activeDateInfo.month}월 {activeDateInfo.day}일
                    </h4>
                    <span className={cn(
                      "text-sm font-serif font-bold",
                      activeDateInfo.isSaturday ? "text-sky-600" :
                      activeDateInfo.isSunday ? "text-rose-600" :
                      "text-brand-sage"
                    )}>
                      ({activeDateInfo.dayOfWeekName}요일)
                    </span>
                  </div>

                  {activeCounselor.id !== 'all' && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-beige/60 text-brand-brown border border-brand-green/20">
                      {activeCounselor.shortName}
                    </span>
                  )}
                </div>
              ) : (
                <h4 className="text-lg font-serif font-bold text-brand-brown">
                  날짜를 선택해 주세요
                </h4>
              )}
            </div>

            {/* Time Slot Cards List */}
            {activeDateInfo?.isSunday || activeDateInfo?.isHoliday ? (
              <div className="py-8 text-center bg-rose-50/50 rounded-2xl border border-rose-100 p-4 space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h5 className="text-sm font-serif font-bold text-rose-900">
                  {activeDate && KOREAN_HOLIDAYS[activeDate] 
                    ? `${KOREAN_HOLIDAYS[activeDate]} 공휴일은 상담소 휴무일입니다` 
                    : '일요일은 상담소 정기 휴무일입니다'}
                </h5>
                <p className="text-xs text-rose-800/80 font-serif leading-relaxed">
                  평일(월~금) 또는 토요일 운영 일정을 선택해 주시기 바랍니다.
                </p>
              </div>
            ) : activeDateInfo?.isPast ? (
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-2">
                <Info className="w-8 h-8 text-gray-400 mx-auto" />
                <h5 className="text-sm font-serif font-bold text-gray-600">
                  이미 지난 날짜입니다
                </h5>
                <p className="text-xs text-gray-500 font-serif">
                  오늘 이후의 날짜를 선택해 주세요.
                </p>
              </div>
            ) : activeCounselor.id !== 'all' && !activeCounselor.availableDays.includes(activeDateInfo?.dayOfWeek ?? -1) ? (
              <div className="py-8 text-center bg-amber-50/60 rounded-2xl border border-amber-200 p-5 space-y-2.5">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h5 className="text-sm font-serif font-bold text-amber-950">
                  {activeCounselor.name}의 연구 휴진일입니다
                </h5>
                <p className="text-xs text-amber-900/80 font-serif leading-relaxed max-w-sm mx-auto">
                  {activeCounselor.offDayReason || '해당 요일은 외부 강의 및 임상 수련 연구 휴무입니다.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectCounselorTab('all')}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-2xs cursor-pointer"
                  >
                    이 날짜의 다른 상담사 확인하기
                  </button>
                </div>
              </div>
            ) : activeTimeSlots.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-2">
                <Info className="w-8 h-8 text-brand-sage mx-auto" />
                <h5 className="text-sm font-serif font-bold text-brand-brown">
                  해당 일자에 예약 가능한 상담 일정이 없습니다
                </h5>
                <p className="text-xs text-brand-brown/70 font-serif leading-relaxed max-w-xs mx-auto">
                  다른 날짜를 선택해 주시기 바랍니다.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeTimeSlots.map((slot) => {
                  const { time, session, period, duration, workingCounselors, isAvailable, reason, isSelected } = slot;

                  return (
                    <div
                      key={`slot-card-${time}`}
                      className={cn(
                        "p-3.5 rounded-2xl border transition-all flex flex-col text-left relative",
                        isSelected
                          ? "bg-brand-sage text-white border-brand-sage shadow-md ring-2 ring-brand-sage/40 scale-101"
                          : isAvailable
                          ? "bg-white hover:bg-emerald-50/30 border-brand-green/25 hover:border-brand-sage/60 shadow-2xs"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      )}
                    >
                      {/* Slot Header */}
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[11px] font-bold font-serif",
                            isSelected 
                              ? "bg-white/20 text-white" 
                              : "bg-brand-sage/10 text-brand-sage"
                          )}>
                            {session}
                          </span>
                          <span className="text-base sm:text-lg font-bold font-mono tracking-tight">
                            {time}
                          </span>
                          <span className={cn(
                            "text-xs font-serif",
                            isSelected ? "text-white/80" : "text-brand-brown/60"
                          )}>
                            ({period} · {duration})
                          </span>
                        </div>

                        {/* Availability Pill */}
                        <div>
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-brand-sage font-bold text-xs shadow-2xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>선택 완료</span>
                            </span>
                          ) : isAvailable ? (
                            <button
                              type="button"
                              onClick={() => handleSelectSlotTime(time)}
                              className="px-3 py-1 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sage/90 shadow-2xs cursor-pointer transition-colors"
                            >
                              이 시간 예약
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-gray-100 text-gray-500 text-xs font-serif font-bold border border-gray-200">
                              {reason}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Counselor Match Chips for this Slot */}
                      {workingCounselors.length > 0 && (
                        <div className="pt-2 border-t border-current/10 flex flex-wrap items-center gap-1.5">
                          <span className={cn(
                            "text-[10px] font-serif font-bold mr-0.5",
                            isSelected ? "text-white/80" : "text-brand-brown/60"
                          )}>
                            상담 가능:
                          </span>
                          {workingCounselors.map((c) => {
                            const isDesignated = selectedCounselor?.includes(c.shortName) || activeCounselor.id === c.id;
                            return (
                              <button
                                key={`counselor-chip-${c.id}-${time}`}
                                type="button"
                                disabled={!isAvailable}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSlotTime(time, c.name);
                                }}
                                className={cn(
                                  "text-[10px] px-2 py-0.5 rounded-lg font-serif font-bold transition-all cursor-pointer flex items-center gap-1",
                                  isSelected
                                    ? isDesignated
                                      ? "bg-white text-brand-sage shadow-2xs ring-1 ring-white"
                                      : "bg-white/20 text-white hover:bg-white/30"
                                    : isDesignated
                                    ? "bg-brand-sage text-white shadow-2xs"
                                    : "bg-brand-beige/50 text-brand-brown/80 hover:bg-brand-sage/20 border border-brand-green/20"
                                )}
                                title={`${c.name} 상담사로 이 시간대 바로 예약`}
                              >
                                <span>{c.shortName}</span>
                                {isDesignated && <Check className="w-2.5 h-2.5" />}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Psychological Preparation Tip Tooltip for Selected Slot */}
                      {isSelected && (() => {
                        const tip = getPsychologicalTipForTime(time);
                        if (!tip) return null;
                        return (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full mt-2.5 pt-2 border-t border-white/20 flex items-start gap-1.5 text-xs text-white/95"
                          >
                            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-200" />
                            <div className="leading-snug">
                              <span className="font-bold text-amber-200">
                                {tip.title} (심리 준비 팁):{' '}
                              </span>
                              <span className="font-serif text-[11px] sm:text-xs text-white/95">
                                {tip.shortTip}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Currently Selected Summary Banner */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-serif space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-900">
                      선택된 상담 일정 &amp; 상담사
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-semibold">
                    신청서 자동 연동됨
                  </span>
                </div>

                <div className="text-sm font-bold text-emerald-950 pl-6 flex flex-wrap items-center gap-2">
                  <span>{selectedDate} ({TIME_SLOT_DETAILS[selectedTime]?.session || ''} {selectedTime})</span>
                  {selectedCounselor && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200/90 text-emerald-900 font-sans font-bold">
                      {selectedCounselor}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-emerald-800/80 pl-6 leading-relaxed">
                  아래 신청서로 이동하여 성함과 연락처를 입력하시면 간편하게 예약 접수가 완료됩니다.
                </p>

                {formRef?.current && (
                  <div className="pt-1 pl-6">
                    <button
                      type="button"
                      onClick={() => {
                        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100/50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>신청서 작성하러 가기</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Clinical Commitment Card */}
          <div className="p-4 rounded-2xl bg-brand-beige/40 border border-brand-green/20 flex items-start gap-3 text-xs text-brand-brown/80 font-serif leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0 mt-0.5" />
            <div>
              <strong className="block text-brand-brown font-bold mb-0.5">
                1일 5회기 한정 심층 상담 원칙
              </strong>
              <span>
                상담사의 온전한 집중력과 정서적 에너지를 유지하기 위해 상담사 1인당 하루 최대 5회기로 예약을 한정 운영합니다.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
